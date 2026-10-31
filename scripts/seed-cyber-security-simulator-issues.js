// Usage: node scripts/seed-cyber-security-simulator-issues.js [owner/repo]
// Creates labels and seeds the 23 curated issues from the official maintainer guide using GitHub API via `gh api`.
import { spawnSync } from 'node:child_process';

const REPO = process.argv[2] || 'tkmfoss/Cyber-Security-Simulator';

function ghAPI(endpoint, data = null, method = 'POST') {
  const args = ['api', endpoint, '-X', method];
  let input = undefined;
  if (data) {
    args.push('--input', '-');
    input = JSON.stringify(data);
  }
  const res = spawnSync('gh', args, { input, encoding: 'utf8' });
  if (res.status !== 0) {
    throw new Error(res.stderr || res.stdout);
  }
  return res.stdout ? JSON.parse(res.stdout) : null;
}

console.log(`Setting up labels and issues for ${REPO}...\n`);

const LABELS = [
  { name: 'soc-s1', color: '3B82F6', description: 'FOSSSoC Season 1 official challenge' },
  { name: 'level:easy', color: '10B981', description: '10 points — Beginner friendly' },
  { name: 'level:medium', color: 'F59E0B', description: '25 points — Intermediate challenge' },
  { name: 'level:hard', color: 'EF4444', description: '50 points — Advanced challenge' },
  { name: 'quality:excellent', color: '8B5CF6', description: '+5 bonus points for outstanding code & PR quality' },
  { name: 'spam', color: '000000', description: 'Spam PR' },
];

console.log('--- 1. Creating Required Labels ---');
for (const l of LABELS) {
  try {
    ghAPI(`repos/${REPO}/labels`, l);
    console.log(`✓ Label created: ${l.name}`);
  } catch (err) {
    try {
      ghAPI(`repos/${REPO}/labels/${encodeURIComponent(l.name)}`, l, 'PATCH');
      console.log(`✓ Label updated: ${l.name}`);
    } catch (e) {
      console.log(`Note on ${l.name}: ${e.message.trim().split('\n')[0]}`);
    }
  }
}

const ISSUES = [
  // Easy Issues (E1–E8)
  {
    title: 'fix(quiz): Quiz continues after timer reaches 0',
    level: 'level:easy',
    body: `### Problem Description
In \`src/pages/CyberQuiz.jsx\`, when the 60-second quiz countdown reaches 0:00, the interval clamps \`timeLeft\` at 0 but omits calling \`setFinished(true)\`. The quiz remains interactive at 0:00, allowing users to answer questions past expiration with no timeout screen.

### Contributor Tasks
- Inspect the timer interval block in \`src/pages/CyberQuiz.jsx\` around lines 40–51.
- Ensure that when \`t <= 1\`, the quiz transitions immediately into the finished state: \`setFinished(true)\`.
- Ensure user selections are blocked immediately upon timeout and score is saved via \`recordQuizScore\`.

### Relevant Files
- \`src/pages/CyberQuiz.jsx\`

### Acceptance Criteria
- [ ] When timer hits 0:00, quiz ends automatically with zero delay.
- [ ] The results screen appears showing final score up to the timeout.
- [ ] No options can be clicked after expiration.

> **Boundary:** Do not modify timer styles or warning colors (that is E7). Fix only expiration transition logic.`,
  },
  {
    title: 'fix(detector): "Inspect Another" repeats the same website',
    level: 'level:easy',
    body: `### Problem Description
The \`inspectAnother()\` handler uses \`Math.floor(Math.random() * websiteExamples.length)\` without excluding the currently selected site. With 4 targets, there is an immediate 25% chance of picking the exact same website.

### Contributor Tasks
- Update \`inspectAnother()\` in \`src/pages/FakeWebsiteDetector.jsx\`.
- Filter out \`selectedId\` from available options before picking a random index, or cycle sequentially.
- Call \`reset()\` to clear prior inspection state.

### Relevant Files
- \`src/pages/FakeWebsiteDetector.jsx\`

### Acceptance Criteria
- [ ] Clicking "Inspect Another" guaranteed never to pick the same site currently active.
- [ ] Smooth transition to a new website target every time.`,
  },
  {
    title: 'fix(detector): Inspection checklist reveals the correct answers',
    level: 'level:easy',
    body: `### Problem Description
The inspection checklist items evaluate ground-truth properties (such as \`site.redFlags\`) during user interaction, leaking whether the website is legitimate or fraudulent before judgment submission.

### Contributor Tasks
- Make the checklist neutral before submission. The checklist should track what the user checked, not reveal ground truth.
- Reveal actual red flags and correctness feedback only after the user submits their verdict ("Legitimate" or "Fake").

### Relevant Files
- \`src/pages/FakeWebsiteDetector.jsx\`

### Acceptance Criteria
- [ ] Pre-submission checklist provides zero hints or auto-evaluations of correctness.
- [ ] Comprehensive feedback and red-flag explanations appear only after verdict submission.`,
  },
  {
    title: 'fix(ui): Password analyzer copy button gives no feedback',
    level: 'level:easy',
    body: `### Problem Description
When clicking the copy button next to the generated/suggested password, \`navigator.clipboard.writeText(...)\` executes without providing any visual feedback, leaving users unsure if copying succeeded.

### Contributor Tasks
- Introduce a \`copied\` boolean state in \`src/pages/PasswordAnalyzer.jsx\`.
- On copy click, set \`copied(true)\` and revert after 2 seconds via \`setTimeout\`.
- Render a Check icon and "Copied!" text/tooltip when active.

### Relevant Files
- \`src/pages/PasswordAnalyzer.jsx\`

### Acceptance Criteria
- [ ] Instant visual feedback confirms copying to clipboard.
- [ ] Button returns smoothly to default state after 2 seconds.`,
  },
  {
    title: 'refactor(ui): Move achievement badges to Dashboard',
    level: 'level:easy',
    body: `### Problem Description
Achievement Badges currently live at the bottom of \`About.jsx\`. As an essential user training reward, badges logically belong in the user's personal training hub (\`Dashboard.jsx\`).

### Contributor Tasks
- Remove the Achievement Badges section and \`achievementList\` import from \`src/pages/About.jsx\`.
- Import \`achievementList\` and render the \`<AchievementBadge>\` grid in \`src/pages/Dashboard.jsx\`.
- Preserve locked/unlocked styling and responsiveness cleanly in the new location.

### Relevant Files
- \`src/pages/About.jsx\`
- \`src/pages/Dashboard.jsx\`

### Acceptance Criteria
- [ ] Achievements section removed from About page.
- [ ] Achievements prominently displayed on Dashboard page.

> **Boundary:** This is purely UI relocation. Do not implement XP, levels, or progression engines (that is H3).`,
  },
  {
    title: 'feat(ui): Add proper Dashboard empty states',
    level: 'level:easy',
    body: `### Problem Description
When a user has no prior quiz attempts, \`quizScores.length > 0 && ...\` hides the quiz history card completely. Users see an awkward visual blank space with no guidance.

### Contributor Tasks
- Add an empty-state fallback when \`quizScores.length === 0\`.
- Render a styled card with an icon, descriptive text ("No quiz attempts yet! Complete your first Cyber Safety Quiz to track your scores."), and a call-to-action button linking to \`/cyber-quiz\`.

### Relevant Files
- \`src/pages/Dashboard.jsx\`

### Acceptance Criteria
- [ ] Clean empty-state container appears when no history is present.
- [ ] CTA button deep-links cleanly to start the quiz.`,
  },
  {
    title: 'feat(ui): Improve quiz timer visibility and warnings',
    level: 'level:easy',
    body: `### Problem Description
The quiz countdown timer is styled in static, low-contrast text. Users receive no visual urgency or cues when time is running out.

### Contributor Tasks
- Update timer styling dynamically: yellow text when \`timeLeft <= 20\`; red text with a pulse/glow animation when \`timeLeft <= 10\`.
- Ensure timer text remains crisp, legible, and centered across all screen sizes.

### Relevant Files
- \`src/pages/CyberQuiz.jsx\`

### Acceptance Criteria
- [ ] Visual urgency changes trigger automatically at 20s and 10s.
- [ ] Existing countdown math and timer stability remain unaffected.`,
  },
  {
    title: 'fix(detector): Reset fake-website inspection state for a new inspection',
    level: 'level:easy',
    body: `### Problem Description
Clicking a new website in the sidebar selection list updates \`selectedId\` but omits calling \`reset()\`. The user's prior verdict banner and checklist selections carry over to the new site.

### Contributor Tasks
- Update website sidebar button \`onClick\` in \`src/pages/FakeWebsiteDetector.jsx\`.
- Invoke \`reset()\` whenever a website is switched, resetting checklist choices, verdict banners, and submitted state.

### Relevant Files
- \`src/pages/FakeWebsiteDetector.jsx\`

### Acceptance Criteria
- [ ] Selecting a new website displays a pristine, un-inspected state.
- [ ] No residual feedback banners from prior sites are visible.`,
  },

  // Medium Issues (M1–M10)
  {
    title: 'feat(quiz): Prevent navigation away from active quiz without confirmation',
    level: 'level:medium',
    body: `### Problem Description
Users in the middle of a timed quiz can accidentally click navbar or footer links, instantly unmounting the quiz and discarding all progress with zero confirmation.

### Contributor Tasks
- Add a navigation blocker or prompt when navigating away while \`started && !finished\`.
- Attach \`beforeunload\` window event listener to warn on tab close / browser refresh.
- If user confirms exit, clear interval timer and reset state; if user cancels, stay in quiz.

### Relevant Files
- \`src/pages/CyberQuiz.jsx\`

### Acceptance Criteria
- [ ] Unsaved quiz progress triggers confirmation prompt on navigation or tab close.
- [ ] Canceling prompt preserves quiz state and timer.
- [ ] Confirming cleanly clears timer and resets state.`,
  },
  {
    title: 'fix(simulation): Prevent duplicate attack-scenario replay scores',
    level: 'level:medium',
    body: `### Problem Description
In \`src/pages/AttackSimulation.jsx\`, replaying a completed scenario adds \`choice.score\` to \`totalScore\` repeatedly, allowing users to inflate their security score without limit.

### Contributor Tasks
- Store scores per scenario (e.g. \`scenarioScores: { [id]: score }\`).
- Calculate \`totalScore\` as the sum of unique scenario scores or only award points on initial completion / improvement.
- Max achievable score must never exceed the legitimate maximum (50 points).

### Relevant Files
- \`src/pages/AttackSimulation.jsx\`

### Acceptance Criteria
- [ ] Replaying an attack scenario updates or retains the scenario score without inflating total score.
- [ ] Maximum possible score is capped at legitimate maximum (50 points).`,
  },
  {
    title: 'fix(dashboard): Fix Dashboard preset/stale personal data',
    level: 'level:medium',
    body: `### Problem Description
The "Training Performance Trend" line chart on \`Dashboard.jsx\` renders static mock data (\`userPerformance\`) from \`dashboardData.js\` instead of the user's real \`quizScores\` from \`ThemeContext\`.

### Contributor Tasks
- Derive chart data dynamically from \`quizScores\` (chronological quiz attempts with percentage scores).
- Display a helpful placeholder notice when fewer than 2 quiz scores are recorded.
- Chart updates immediately when a new quiz is completed.

### Relevant Files
- \`src/pages/Dashboard.jsx\`

### Acceptance Criteria
- [ ] Chart dynamically renders chronological quiz attempts and scores from user history.
- [ ] Graceful fallback displayed when insufficient score entries exist.`,
  },
  {
    title: 'feat(dashboard): Detailed quiz-history question-by-question review',
    level: 'level:medium',
    body: `### Problem Description
\`recordQuizScore\` currently records only summary numbers (score, total, date, percentage). Users cannot review past questions or understand why an answer was wrong.

### Contributor Tasks
- Expand the quiz score data schema to store user selections and question references.
- Build a "Review Questions" modal or expander on Dashboard allowing users to inspect past answers, correct solutions, and explanations.

### Relevant Files
- \`src/context/ThemeContext.jsx\`
- \`src/pages/CyberQuiz.jsx\`
- \`src/pages/Dashboard.jsx\`

### Acceptance Criteria
- [ ] Quiz attempts preserve submitted user answers alongside correct answers and explanations.
- [ ] Dashboard features an interactive review modal or expandable view for past attempts.`,
  },
  {
    title: 'feat(storage): Persist complete user progress with localStorage',
    level: 'level:medium',
    body: `### Problem Description
In \`src/pages/AttackSimulation.jsx\`, completed scenarios and scenario security scores are held in ephemeral React state and are lost on page refresh.

### Contributor Tasks
- Persist attack simulation completion and scores using \`useLocalStorage\` in \`ThemeContext\`.
- Ensure scenario completion markers (✓ COMPLETED) and security scores survive page reloads.
- Provide a clean "Reset All" action that resets the persisted state.

### Relevant Files
- \`src/pages/AttackSimulation.jsx\`
- \`src/context/ThemeContext.jsx\`

### Acceptance Criteria
- [ ] Completed scenario marks and earned scores persist across browser reloads.
- [ ] User can optionally clear / reset their scenario history.`,
  },
  {
    title: 'feat(quiz): Add quiz category and difficulty selection',
    level: 'level:medium',
    body: `### Problem Description
All 10 quiz questions in \`quizQuestions.js\` are un-categorized and have no difficulty ratings, preventing focused learning.

### Contributor Tasks
- Tag all questions with category (e.g. Phishing, Passwords, Network, Social Engineering) and difficulty (Easy, Medium, Hard).
- Add a pre-quiz setup screen allowing users to filter by category or difficulty before starting.

### Relevant Files
- \`src/data/quizQuestions.js\`
- \`src/pages/CyberQuiz.jsx\`

### Acceptance Criteria
- [ ] Questions categorized with taxonomy and difficulty tiers.
- [ ] Pre-quiz filter screen allows starting focused quizzes by topic or difficulty.`,
  },
  {
    title: 'feat(phishing): Add search & filtering for phishing simulator',
    level: 'level:medium',
    body: `### Problem Description
\`PhishingSimulator.jsx\` only allows linear next/previous stepping. Users cannot filter by attack type or search email senders/subjects.

### Contributor Tasks
- Add a search bar for email subject, sender, and tactics.
- Add category filter chips (All, Spoofing, Urgency, Attachments, Financial).
- Render filtered inbox items dynamically.

### Relevant Files
- \`src/pages/PhishingSimulator.jsx\`
- \`src/data/phishingEmails.js\`

### Acceptance Criteria
- [ ] Real-time search filter for inbox by sender or subject.
- [ ] Category chips filter visible phishing emails correctly.`,
  },
  {
    title: 'feat(ui): Simulation completion celebration & summary',
    level: 'level:medium',
    body: `### Problem Description
Completing all 5 attack scenarios abruptly drops the user back onto the scenario grid without celebration or summary.

### Contributor Tasks
- Detect when all 5 scenarios are completed.
- Display an animated celebration modal/banner with final score, security rating, and key takeaways.

### Relevant Files
- \`src/pages/AttackSimulation.jsx\`

### Acceptance Criteria
- [ ] Completion modal triggers when all 5 scenarios are finished.
- [ ] Modal displays overall score, security proficiency rating, and review summary.`,
  },
  {
    title: 'fix(css): Resolve mobile layout clipping on 320px–375px screens',
    level: 'level:medium',
    body: `### Problem Description
On narrow mobile screens (320px–375px), the browser URL address bar in \`FakeWebsiteDetector.jsx\` and stat cards in \`About.jsx\` clip and cause horizontal scrolling.

### Contributor Tasks
- Refactor fixed pixel widths to responsive Tailwind classes (e.g. \`w-full\`, \`max-w-full\`, \`truncate\`).
- Ensure zero horizontal body overflow across mobile viewports (320px, 375px, 414px).

### Relevant Files
- \`src/pages/FakeWebsiteDetector.jsx\`
- \`src/pages/About.jsx\`

### Acceptance Criteria
- [ ] Clean rendering without horizontal scrollbar on 320px, 375px, and 414px viewports.
- [ ] Text and address bar truncate gracefully without overflowing container.`,
  },
  {
    title: 'feat(storage): Add localStorage progress export & import (JSON)',
    level: 'level:medium',
    body: `### Problem Description
All user progress is stored locally in the browser. Clearing cache destroys all training records with no backup or transfer mechanism.

### Contributor Tasks
- Add "Export Progress" button generating a JSON download of all \`cyber-*\` localStorage keys.
- Add "Import Progress" button with JSON validation that restores state safely.

### Relevant Files
- \`src/pages/Dashboard.jsx\`
- storage helper utilities

### Acceptance Criteria
- [ ] Export generates valid \`.json\` backup file with all simulator progress.
- [ ] Import validates JSON schema and successfully restores user progress.`,
  },

  // Hard Issues (H1–H5)
  {
    title: 'feat(dashboard): Add Personal Progress Center to Dashboard',
    level: 'level:hard',
    body: `### Problem Description
Following the Phase 2 cleanup that relocated platform threat charts to the About page, the Dashboard requires a dedicated, unified Personal Progress Center that synthesizes training accomplishments across all modules.

### Contributor Tasks
- Design an overarching "Cyber Readiness Score" (0–100%) weighted across Quizzes, Phishing, Fake Websites, Passwords, and Scenarios.
- Build domain mastery breakdown cards showing user proficiency across each distinct security area.
- Provide a "Recommended Next Step" widget guiding the user to their weakest or uncompleted training module.
- Support clean empty-state fallbacks for fresh users with zero training history.

### Relevant Files
- \`src/pages/Dashboard.jsx\`
- component modules

### Acceptance Criteria
- [ ] Dashboard displays an executive personal progress hub giving transparent feedback on user training.
- [ ] Strictly client-side; no backend, auth, or external APIs.

> **Boundary:** H1 aggregates personal progress on Dashboard; do not implement curriculum roadmaps (H4) or global leveling/XP engines (H3).`,
  },
  {
    title: 'feat(simulation): Implement Multi-Step Attack Simulations',
    level: 'level:hard',
    body: `### Problem Description
Currently, attack scenarios are single-question prompts with 1 step. H2 transforms them into multi-phase narrative simulations reflecting realistic cyber incident stages (Initial Contact, Exploitation, Mitigation, Debrief).

### Contributor Tasks
- Expand all 5 scenarios in \`src/data/attackScenarios.js\` with 3 to 4 sequential phases each.
- Update \`AttackSimulation.jsx\` to navigate through phases using \`stepIndex + 1\`.
- Add a visual phase progress indicator ("Phase 2 of 4: Credential Harvesting") in the scenario header.
- Build a post-scenario incident debrief screen summarizing cumulative score, phase choices, and security takeaways.

### Relevant Files
- \`src/data/attackScenarios.js\`
- \`src/pages/AttackSimulation.jsx\`

### Acceptance Criteria
- [ ] Every scenario unfolds across multiple sequential decision phases with consequence-driven feedback.
- [ ] Phase progress bar and debrief screen clearly communicate impact of choices.

> **Boundary:** H2 enriches intra-scenario phase progression; do not confuse with H5 (cross-domain crisis assessment).`,
  },
  {
    title: 'feat(engine): Build Achievement & Progression System (XP, Levels, Engine)',
    level: 'level:hard',
    body: `### Problem Description
Achievements are currently checked via scattered, hardcoded strings in random components with zero progression layers, partial progress tracking, XP points, or unlock notifications.

### Contributor Tasks
- Establish a centralized achievement rules evaluator evaluating user activity across all 5 simulator tools.
- Introduce a balanced progression model (XP points and Mastery Ranks: Novice → Guardian → Sentinel → Cyber Specialist).
- Support partial progress tracking (e.g. "3/5 Scenarios Completed — 60%").
- Implement non-intrusive real-time toast notifications when an achievement unlocks.
- Persist all progression state cleanly in \`localStorage\`.

### Relevant Files
- \`src/data/achievements.js\`
- \`src/context/ThemeContext.jsx\`

### Acceptance Criteria
- [ ] Progression engine listens across all activities, updates XP/ranks, tracks partial progress, and triggers unlock toasts.
- [ ] All levels, ranks, and XP persist reliably across sessions.

> **Boundary:** H3 builds the underlying progression engine; do not confuse with E5 (relocating badges to Dashboard).`,
  },
  {
    title: 'feat(curriculum): Build Interactive Cybersecurity Learning Path',
    level: 'level:hard',
    body: `### Problem Description
The simulator currently provides 5 standalone tools with zero curricular guidance, order, or prerequisites. H4 structures these tools into an interactive, gated learning journey.

### Contributor Tasks
- Structure existing tools into ordered modules (e.g. Module 1: Passwords → Module 2: Phishing → Module 3: Websites → Module 4: Scenarios → Module 5: Comprehensive Quiz).
- Create a dedicated \`/learning-path\` route and interactive roadmap view showing module cards with lock/unlock states.
- Implement prerequisite gating (subsequent modules unlock only when prior module completion criteria are met).
- Add a "Resume Learning" action deep-linking to the user's next unfinished module.

### Relevant Files
- \`src/routes/AppRoutes.jsx\`
- \`src/pages/LearningPath.jsx\` (new)

### Acceptance Criteria
- [ ] Users follow a guided curriculum with prerequisite locks, clear module completion criteria, and roadmap progression.
- [ ] Seamless navigation and state persistence for unlocked modules.

> **Boundary:** H4 is curriculum progression ("What to learn next"); do not confuse with H3 (XP/badges) or H1 (Dashboard analytics).`,
  },
  {
    title: 'feat(assessment): Build Cybersecurity Challenge Mode',
    level: 'level:hard',
    body: `### Problem Description
Users currently test skills in silos. There is no unified assessment mode that evaluates combined cybersecurity proficiency under pressure in a single assessment session.

### Contributor Tasks
- Create a dedicated \`/challenge-mode\` standalone assessment route and session runner.
- Assemble a randomized challenge session drawing tasks across diverse domains (Phishing classification, Fake website check, Password evaluation, Scenario decision, Quiz question).
- Implement a normalized scoring model standardizing diverse tasks into a unified challenge score (0–500 or 0–1,000 points).
- Build an end-of-challenge diagnostic debrief screen breaking down performance by category (e.g. Phishing: 100%, Social Engineering: 50%).
- Support seamless session replay and retry without state leakage.

### Relevant Files
- \`src/routes/AppRoutes.jsx\`
- \`src/pages/ChallengeMode.jsx\` (new)

### Acceptance Criteria
- [ ] Standalone assessment session tests cross-domain cybersecurity readiness and delivers domain-by-domain diagnostic feedback.
- [ ] Clean scoring normalization and replay handling.

> **Boundary:** H5 evaluates users under pressure; do not confuse with H4 (curriculum learning) or H2 (multi-step attack scenario branching).`,
  },
];

console.log(`\n--- 2. Creating ${ISSUES.length} Issues via GitHub API ---`);
for (const [idx, iss] of ISSUES.entries()) {
  try {
    const payload = {
      title: iss.title,
      body: iss.body,
      labels: ['soc-s1', iss.level],
    };
    const created = ghAPI(`repos/${REPO}/issues`, payload);
    console.log(`✓ #${created.number}: ${iss.title} (${iss.level})`);
  } catch (err) {
    console.error(`✗ Error on #${idx + 1} (${iss.title}):`, err.message.trim().split('\n')[0]);
  }
}

console.log(`\n✓ All done! View issues at: https://github.com/${REPO}/issues`);
