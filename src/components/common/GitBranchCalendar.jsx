import React from 'react';

function getTodayPosition(now = new Date()) {
  const keyframes = [
    { date: '2026-10-20', x: 60, y: 70 },
    { date: '2026-10-24', x: 140, y: 70 }, // Kickoff
    { date: '2026-10-26', x: 230, y: 140 }, // profile.json
    { date: '2026-10-29', x: 300, y: 140 }, // pages deploy
    { date: '2026-10-31', x: 390, y: 70 }, // merge port-wk
    { date: '2026-11-01', x: 450, y: 70 }, // build-month branch start
    { date: '2026-11-03', x: 520, y: 140 }, // entering branch line
    { date: '2026-11-07', x: 550, y: 140 }, // 1st week bonus end
    { date: '2026-11-18', x: 620, y: 140 }, // prs review
    { date: '2026-11-28', x: 660, y: 140 }, // branch exit curve start
    { date: '2026-11-30', x: 710, y: 70 }, // merge build
    { date: '2026-12-01', x: 770, y: 70 }, // christmas-eve start
    { date: '2026-12-04', x: 840, y: 140 }, // entering branch line
    { date: '2026-12-07', x: 860, y: 140 }, // 1st week bonus end
    { date: '2026-12-20', x: 920, y: 140 }, // last PRs
    { date: '2026-12-24', x: 1000, y: 70 }, // merge finale
    { date: '2026-12-27', x: 1055, y: 70 } // demo day
  ];

  const nowMs = now.getTime();
  const first = keyframes[0];
  const last = keyframes[keyframes.length - 1];

  const firstMs = new Date(`${first.date}T00:00:00+05:30`).getTime();
  const lastMs = new Date(`${last.date}T23:59:59+05:30`).getTime();

  if (nowMs <= firstMs) return { x: first.x, y: first.y };
  if (nowMs >= lastMs) return { x: last.x, y: last.y };

  for (let i = 0; i < keyframes.length - 1; i++) {
    const k1 = keyframes[i];
    const k2 = keyframes[i + 1];
    const t1 = new Date(`${k1.date}T00:00:00+05:30`).getTime();
    const t2 = new Date(`${k2.date}T00:00:00+05:30`).getTime();
    if (nowMs >= t1 && nowMs <= t2) {
      const ratio = (nowMs - t1) / (t2 - t1);
      const x = Math.round(k1.x + (k2.x - k1.x) * ratio);
      const y = Math.round(k1.y + (k2.y - k1.y) * ratio);
      return { x, y };
    }
  }
  return { x: 510, y: 130 };
}

export default function GitBranchCalendar() {
  const todayPos = React.useMemo(() => getTodayPosition(), []);

  return (
    <div
      style={{
        border: '1px solid var(--theme-border)',
        borderRadius: 'var(--radius-sm)',
        background: 'var(--theme-card-bg)',
        padding: '1.5rem',
        overflowX: 'auto',
        fontFamily: 'var(--font-mono)'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '0.8rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ color: 'var(--theme-primary)', fontWeight: 700, fontSize: '0.85rem' }}>
            $ git log --graph --oneline --all
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
            (Season Branch Architecture)
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          <span className="calendar-scroll-hint" style={{ color: 'var(--theme-primary)', fontSize: '0.72rem' }}>
            [ swipe horizontally ← → ]
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-white)' }} />
            <span>main</span>
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--theme-primary)' }} />
            <span>sprint branches</span>
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-warning)' }} />
            <span>today</span>
          </span>
        </div>
      </div>

      <style>{`
        .calendar-scroll-hint { display: none; }
        @media (max-width: 768px) {
          .calendar-scroll-hint { display: inline-block !important; }
        }
      `}</style>

      <div style={{ minWidth: '980px' }}>
        <svg viewBox="0 0 1080 220" width="100%" height="220" fill="none">
          {/* Main trunk line */}
          <line x1="30" y1="70" x2="1050" y2="70" stroke="rgba(255,255,255,0.22)" strokeWidth="3" />

          {/* Branch 1: Portfolio Week (Oct 24 -> Oct 31) */}
          <path
            d="M 140 70 C 165 140, 185 140, 210 140 L 320 140 C 345 140, 365 70, 390 70"
            stroke="var(--theme-primary)"
            strokeWidth="2.5"
          />

          {/* Branch 2: Build Month (Nov 1 -> Nov 30) */}
          <path
            d="M 450 70 C 475 140, 495 140, 520 140 L 640 140 C 665 140, 685 70, 710 70"
            stroke="var(--theme-primary)"
            strokeWidth="2.5"
          />

          {/* Branch 3: Christmas Eve Month (Dec 1 -> Dec 24) */}
          <path
            d="M 770 70 C 795 140, 815 140, 840 140 L 930 140 C 955 140, 975 70, 1000 70"
            stroke="var(--theme-primary)"
            strokeWidth="2.5"
          />

          {/* TODAY PIN: Dynamically positioned based on current date */}
          <g transform={`translate(${todayPos.x}, ${todayPos.y})`}>
            <circle cx="0" cy="0" r="9" fill="none" stroke="var(--color-warning)" strokeWidth="2" />
            <circle cx="0" cy="0" r="3.5" fill="var(--color-warning)" />
            <line x1="0" y1="-12" x2="0" y2="-28" stroke="var(--color-warning)" strokeWidth="1.5" />
            <rect x="-26" y="-46" width="52" height="18" fill="var(--color-warning)" rx="2" />
            <text x="0" y="-33" fill="#000000" fontSize="9.5" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="800">
              TODAY
            </text>
          </g>

          {/* 1. Kickoff Workshop */}
          <circle cx="140" cy="70" r="5.5" fill="#ffffff" />
          <text x="140" y="50" fill="var(--color-white)" fontSize="11" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="700">
            24 Oct
          </text>
          <text x="140" y="34" fill="var(--color-text-muted)" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle">
            kickoff
          </text>

          {/* Branch 1 Commits */}
          <circle cx="230" cy="140" r="4.5" fill="var(--theme-primary)" />
          <text x="230" y="162" fill="var(--theme-primary)" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="600">
            26 Oct
          </text>
          <text x="230" y="176" fill="var(--color-text-muted)" fontSize="8.5" fontFamily="var(--font-mono)" textAnchor="middle">
            profile.json
          </text>

          <circle cx="300" cy="140" r="4.5" fill="var(--theme-primary)" />
          <text x="300" y="162" fill="var(--theme-primary)" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="600">
            29 Oct
          </text>
          <text x="300" y="176" fill="var(--color-text-muted)" fontSize="8.5" fontFamily="var(--font-mono)" textAnchor="middle">
            pages deploy
          </text>

          <text x="265" y="198" fill="var(--theme-primary)" fontSize="9.5" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="700">
            branch: portfolio-week
          </text>

          {/* 2. Merge: Portfolio Week */}
          <circle cx="390" cy="70" r="5.5" fill="#ffffff" />
          <text x="390" y="50" fill="var(--color-white)" fontSize="11" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="700">
            31 Oct
          </text>
          <text x="390" y="34" fill="var(--color-text-muted)" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle">
            merge: port-wk
          </text>

          {/* 3. October Winners (placed below main to prevent top collision) */}
          <circle cx="450" cy="70" r="4.5" fill="rgba(255,255,255,0.7)" />
          <text x="450" y="94" fill="var(--color-white)" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="600">
            4 Nov
          </text>
          <text x="450" y="108" fill="var(--color-text-muted)" fontSize="8.5" fontFamily="var(--font-mono)" textAnchor="middle">
            oct winners
          </text>

          {/* Branch 2 Commits: Build Month */}
          <circle cx="540" cy="140" r="4.5" fill="var(--theme-primary)" />
          <text x="540" y="162" fill="var(--theme-primary)" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="600">
            1-7 Nov
          </text>
          <text x="540" y="176" fill="var(--color-text-muted)" fontSize="8.5" fontFamily="var(--font-mono)" textAnchor="middle">
            +5 1st-wk bonus
          </text>

          <circle cx="620" cy="140" r="4.5" fill="var(--theme-primary)" />
          <text x="620" y="162" fill="var(--theme-primary)" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="600">
            18 Nov
          </text>
          <text x="620" y="176" fill="var(--color-text-muted)" fontSize="8.5" fontFamily="var(--font-mono)" textAnchor="middle">
            prs review
          </text>

          <text x="580" y="198" fill="var(--theme-primary)" fontSize="9.5" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="700">
            branch: build-month
          </text>

          {/* 4. Merge: Build Month */}
          <circle cx="710" cy="70" r="5.5" fill="#ffffff" />
          <text x="710" y="50" fill="var(--color-white)" fontSize="11" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="700">
            30 Nov
          </text>
          <text x="710" y="34" fill="var(--color-text-muted)" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle">
            merge: build
          </text>

          {/* 5. November Winners (placed below main) */}
          <circle cx="770" cy="70" r="4.5" fill="rgba(255,255,255,0.7)" />
          <text x="770" y="94" fill="var(--color-white)" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="600">
            3 Dec
          </text>
          <text x="770" y="108" fill="var(--color-text-muted)" fontSize="8.5" fontFamily="var(--font-mono)" textAnchor="middle">
            nov winners
          </text>

          {/* Branch 3 Commits: Christmas Eve */}
          <circle cx="850" cy="140" r="4.5" fill="var(--theme-primary)" />
          <text x="850" y="162" fill="var(--theme-primary)" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="600">
            1-7 Dec
          </text>
          <text x="850" y="176" fill="var(--color-text-muted)" fontSize="8.5" fontFamily="var(--font-mono)" textAnchor="middle">
            +5 1st-wk bonus
          </text>

          <circle cx="920" cy="140" r="4.5" fill="var(--theme-primary)" />
          <text x="920" y="162" fill="var(--theme-primary)" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="600">
            20 Dec
          </text>
          <text x="920" y="176" fill="var(--color-text-muted)" fontSize="8.5" fontFamily="var(--font-mono)" textAnchor="middle">
            last PRs (prop)
          </text>

          <text x="885" y="198" fill="var(--theme-primary)" fontSize="9.5" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="700">
            branch: christmas-eve
          </text>

          {/* 6. Merge: Christmas Eve Finale */}
          <circle cx="1000" cy="70" r="5.5" fill="#ffffff" />
          <text x="1000" y="50" fill="var(--color-white)" fontSize="11" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="700">
            24 Dec
          </text>
          <text x="1000" y="34" fill="var(--color-text-muted)" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle">
            merge: finale (prop)
          </text>

          {/* 7. Results & Demo Day */}
          <circle cx="1055" cy="70" r="6.5" fill="var(--theme-primary)" />
          <text x="1055" y="94" fill="var(--theme-primary)" fontSize="10.5" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="800">
            27 Dec
          </text>
          <text x="1055" y="108" fill="var(--theme-primary)" fontSize="8.5" fontFamily="var(--font-mono)" textAnchor="middle">
            demo day (prop)
          </text>
        </svg>
      </div>
    </div>
  );
}
