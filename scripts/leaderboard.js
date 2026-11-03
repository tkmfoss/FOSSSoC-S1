// Node 20+, no dependencies. Run from the repo root.  GH_TOKEN=xxx node scripts/leaderboard.js
import fs from 'node:fs';
const ORG = 'tkmfoss', LABEL = 'soc-s1', TEMPLATE = 'portfolio-template';
const START = '2026-10-24', PORTFOLIO_DEADLINE = '2026-10-31';
const LEVEL = { 'level:easy': 10, 'level:medium': 25, 'level:hard': 50 };
const SKIP = ['invalid', 'spam'];
const BONUS = 5, QUALITY = 5, REPO_CAP = 5, MIN_COMMITS = 3;
const WEEK1 = [['2026-11-01', '2026-11-07'], ['2026-12-01', '2026-12-07']];
const TH = {
    october: { total: 35, rubric: 10 },
    month: { points: 50, prs: 2, mediumPlus: 1 },
    overall: { points: 120, months: 2, repos: 2 },
};
const OUT = 'public/data/leaderboard.json';

const H = {
    Authorization: `Bearer ${process.env.GH_TOKEN}`, Accept: 'application/vnd.github+json',
    'User-Agent': 'soc-bot', 'Content-Type': 'application/json'
};
const api = async (p) => {
    for (let i = 0; i < 3; i++) {
        try {
            const r = await fetch('https://api.github.com' + p, { headers: H });
            return r.ok ? r.json() : null;
        } catch {
            if (i === 2) return null;
            await new Promise((res) => setTimeout(res, 1000));
        }
    }
    return null;
};
const readJSON = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return d; } };
const ist = (d) => new Date(new Date(d).getTime() + 19800000).toISOString().slice(0, 10);
const low = (s) => String(s).toLowerCase();

const Q = `query($q:String!,$after:String){search(query:$q,type:ISSUE,first:50,after:$after){
 pageInfo{hasNextPage endCursor}
 nodes{... on PullRequest{number title url createdAt mergedAt author{login} repository{name}
  labels(first:20){nodes{name}}
  closingIssuesReferences(first:5){nodes{labels(first:20){nodes{name}}}}}}}}`;
async function prSearch(q) {
    let after = null; const out = [];
    do {
        let j = null;
        for (let i = 0; i < 3; i++) {
            try {
                const r = await fetch('https://api.github.com/graphql',
                    { method: 'POST', headers: H, body: JSON.stringify({ query: Q, variables: { q, after } }) });
                j = await r.json();
                break;
            } catch (e) {
                if (i === 2) throw e;
                await new Promise((res) => setTimeout(res, 1000));
            }
        }
        if (j.errors) throw new Error(JSON.stringify(j.errors));
        if (j.message) throw new Error(`GitHub GraphQL API error: ${j.message}`);
        if (!j.data?.search) throw new Error(`Unexpected GitHub response: ${JSON.stringify(j)}`);
        out.push(...j.data.search.nodes);
        const p = j.data.search.pageInfo; after = p.hasNextPage ? p.endCursor : null;
    } while (after);
    return out;
}

function loadRubric() {
    let txt = ''; try { txt = fs.readFileSync('data/rubric.csv', 'utf8'); } catch { return {}; }
    const acc = {};
    for (const line of txt.trim().split(/\r?\n/).slice(1)) {
        const [g, a, b, c] = line.split(',').map((s) => s.trim());
        if (!g) continue;
        (acc[low(g)] ??= []).push(Math.min(+a || 0, 8) + Math.min(+b || 0, 8) + Math.min(+c || 0, 4));
    }
    return Object.fromEntries(Object.entries(acc).map(([k, v]) =>
        [k, Math.round(v.reduce((x, y) => x + y, 0) / v.length * 10) / 10]));
}

async function showcasePRs() {
    const map = {};
    for (let page = 1; ; page++) {
        const q = encodeURIComponent(`repo:${ORG}/${TEMPLATE} is:pr is:merged created:>=${START}`);
        const r = await api(`/search/issues?q=${q}&per_page=100&page=${page}`);
        if (!r || !r.items.length) break;
        for (const it of r.items) map[low(it.user.login)] = ist(it.created_at);
        if (r.items.length < 100) break;
    }
    return map;
}

async function loadHall() {
    const list = (await api(`/repos/${ORG}/${TEMPLATE}/contents/showcase`)) || [];
    const hall = [];
    for (const f of list.filter((f) => f.name.endsWith('.json'))) {
        try {
            const j = await (await fetch(f.download_url)).json();
            if (/^https:\/\/[\w-]+\.github\.io\//i.test(j.site))
                hall.push({ github: j.github, name: j.name, site: j.site, college: j.college || '', department: j.department, year: j.year });
        } catch { }
    }
    return hall;
}

async function portfolio(login, tpl, showPR, rubric, ov) {
    const k = low(login);
    const repo = await api(`/repos/${login}/${TEMPLATE}`);
    const fork = repo && repo.fork && low(repo.parent?.full_name) === low(`${ORG}/${TEMPLATE}`) ? 5 : 0;
    let commits = 0;
    if (fork) {
        const c = await api(`/repos/${ORG}/${TEMPLATE}/compare/main...${login}:main`);
        commits = c && c.ahead_by >= MIN_COMMITS ? 5 : 0;
    }
    let live = 0;
    try {
        const r = await fetch(`https://${login}.github.io/${TEMPLATE}/profile.json`);
        if (r.ok) live = JSON.stringify(await r.json()) !== JSON.stringify(tpl) ? 10 : 0;
    } catch { }
    const opened = showPR[k];
    const showcase = opened && opened <= PORTFOLIO_DEADLINE ? 10 : 0;
    const parts = { fork, commits, live, showcase, ...(ov[k] || {}) };
    const auto = parts.fork + parts.commits + parts.live + parts.showcase;
    const r = rubric[k] ?? null;
    const total = auto + (r ?? 0);
    return {
        ...parts, auto, rubric: r, total,
        eligible: total >= TH.october.total && parts.showcase > 0 && parts.live > 0
            && r !== null && r >= TH.october.rubric
    };
}

(async () => {
    const people = readJSON('data/participants.json', []);
    const rubric = loadRubric(), ov = readJSON('data/overrides.json', {});
    const users = {};
    const U = (login) => (users[low(login)] ??= {
        user: login, name: login, college: '', department: '', year: null,
        portfolio: null, projects: { total: 0, merged: 0, pending: 0, prs: [] }
    });
    for (const p of people) Object.assign(U(p.github), { user: p.github, name: p.name, college: p.college || '', department: p.department, year: p.year });

    // ---- Portfolio Week
    let tpl = null;
    try { tpl = await (await fetch(`https://raw.githubusercontent.com/${ORG}/${TEMPLATE}/main/profile.json`)).json(); } catch { }
    const showPR = await showcasePRs();
    for (const p of people) U(p.github).portfolio = await portfolio(p.github, tpl, showPR, rubric, ov);
    const hall = await loadHall();

    // ---- Project months
    const base = `org:${ORG} is:pr label:${LABEL} created:>=${START}`;
    const merged = (await prSearch(`${base} is:closed`)).filter((p) => p.author && p.mergedAt);
    const open = (await prSearch(`${base} is:open`)).filter((p) => p.author);
    merged.sort((a, b) => new Date(a.mergedAt) - new Date(b.mergedAt));
    const count = {}, rows = [];
    for (const pr of merged) {
        const labels = [...pr.labels.nodes.map((l) => l.name),
        ...pr.closingIssuesReferences.nodes.flatMap((i) => i.labels.nodes.map((l) => l.name))];
        if (labels.some((l) => SKIP.includes(l))) continue;
        const lvl = labels.find((l) => LEVEL[l]); if (!lvl) continue;
        const key = low(pr.author.login) + '|' + pr.repository.name;
        count[key] = (count[key] || 0) + 1;
        const opened = ist(pr.createdAt);
        rows.push({
            login: pr.author.login, repo: pr.repository.name, number: pr.number, title: pr.title, url: pr.url,
            level: lvl.split(':')[1], base: LEVEL[lvl], firstWeek: 0,
            quality: labels.includes('quality:excellent') ? QUALITY : 0, capped: count[key] > REPO_CAP,
            opened, merged: ist(pr.mergedAt), month: opened.slice(0, 7), ts: new Date(pr.createdAt).getTime()
        });
    }
    const first = {};
    for (const r of rows.filter((r) => !r.capped)) {
        const k = low(r.login) + '|' + r.repo + '|' + r.month;
        if (!first[k] || r.ts < first[k].ts) first[k] = r;
    }
    for (const r of Object.values(first))
        if (WEEK1.some(([a, b]) => r.opened >= a && r.opened <= b)) r.firstWeek = BONUS;
    for (const r of rows) {
        r.points = r.capped ? 0 : r.base + r.firstWeek + r.quality;
        const u = U(r.login).projects; u.merged += 1; u.total += r.points;
        u.prs.push({
            repo: r.repo, number: r.number, title: r.title, url: r.url, level: r.level, base: r.base,
            firstWeek: r.firstWeek, quality: r.quality, capped: r.capped, points: r.points,
            opened: r.opened, merged: r.merged, month: r.month
        });
    }
    for (const pr of open) U(pr.author.login).projects.pending += 1;

    // ---- Eligibility and tiers
    const list = Object.values(users).map((u) => {
        const pf = u.portfolio || { fork: 0, commits: 0, live: 0, showcase: 0, auto: 0, rubric: null, total: 0, eligible: false };
        const counted = u.projects.prs.filter((p) => !p.capped);
        const months = {};
        for (const p of counted) {
            const m = (months[p.month] ??= { points: 0, prs: 0, mediumPlus: 0, eligible: false });
            m.points += p.points; m.prs += 1; if (p.level !== 'easy') m.mediumPlus += 1;
        }
        for (const m of Object.values(months))
            m.eligible = m.points >= TH.month.points && m.prs >= TH.month.prs && m.mediumPlus >= TH.month.mediumPlus;
        const total = pf.total + u.projects.total;
        const repos = new Set(counted.map((p) => p.repo)).size;
        const active = new Set([...(pf.showcase > 0 ? ['2026-10'] : []), ...Object.keys(months)]);
        const overall = {
            points: total, activeMonths: active.size, repos,
            eligible: total >= TH.overall.points && active.size >= TH.overall.months && repos >= TH.overall.repos
        };
        // October entry for the website: Portfolio Week points (plus any project PRs opened in October)
        const oct = months['2026-10'];
        months['2026-10'] = {
            points: pf.total + (oct?.points || 0), prs: (pf.showcase > 0 ? 1 : 0) + (oct?.prs || 0),
            mediumPlus: oct?.mediumPlus || 0, eligible: pf.eligible
        };
        const tier = total >= 150 ? 'core' : total >= 50 ? 'contributor'
            : (pf.showcase > 0 || u.projects.merged > 0) ? 'participant' : 'none';
        return { ...u, portfolio: pf, months, overall, total, tier };
    }).sort((a, b) => b.total - a.total || b.projects.merged - a.projects.merged);

    // Only rewrite the file when the data really changed (keeps the commit history clean)
    const next = { thresholds: TH, users: list, hall };
    const prev = readJSON(OUT, null);
    if (prev && JSON.stringify({ thresholds: prev.thresholds, users: prev.users, hall: prev.hall }) === JSON.stringify(next)) {
        console.log('No changes'); return;
    }
    fs.mkdirSync('public/data', { recursive: true });
    fs.writeFileSync(OUT, JSON.stringify({ updated: new Date().toISOString(), ...next }, null, 2));
    console.log(`participants: ${people.length}, merged project PRs: ${merged.length}, hall: ${hall.length}`);
})();