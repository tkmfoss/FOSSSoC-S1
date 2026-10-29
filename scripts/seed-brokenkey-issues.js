// Usage: node scripts/seed-brokenkey-issues.js [owner/repo]
// Creates labels and seeds the 17 curated issues using GitHub API via `gh api`.
import { spawnSync } from 'node:child_process';

const REPO = process.argv[2] || 'tkmfoss/BrokenKey';

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
    // If label already exists, update color/description
    try {
      ghAPI(`repos/${REPO}/labels/${encodeURIComponent(l.name)}`, l, 'PATCH');
      console.log(`✓ Label updated: ${l.name}`);
    } catch (e) {
      console.log(`Note on ${l.name}: ${e.message.trim().split('\n')[0]}`);
    }
  }
}

const ISSUES = [
  // Easy
  {
    title: 'fix(ui): Light mode text lacks contrast and is unreadable',
    level: 'level:easy',
    body: `### Problem Description
When light mode is enabled via the theme toggle, passage characters, input text, and stat values lack sufficient contrast against the bright surfaces, making them difficult or impossible to read.

### Steps to Reproduce
1. Open \`index.html\` in a browser.
2. Click the theme toggle button to switch to Light Mode.
3. Observe the passage text and stats.

### Expected Behavior
In light mode, all passage characters and dashboard statistics should remain clearly readable with WCAG AA compliant contrast.

### Relevant Files
- \`style.css\`
- \`script.js\`

### Acceptance Criteria
- [ ] Light mode text is easily readable on light background.
- [ ] Dark mode styling remains intact and functional.
- [ ] No regression or visual glitches.`,
  },
  {
    title: 'fix(logic): Accuracy indicator remains stuck at 100% despite typos',
    level: 'level:easy',
    body: `### Problem Description
The accuracy indicator remains hardcoded at 100% throughout the typing session and does not recalculate or decline even when multiple typing mistakes are made.

### Steps to Reproduce
1. Start a typing round.
2. Deliberately type incorrect characters.
3. Observe the Accuracy percentage metric on the dashboard.

### Expected Behavior
Accuracy should dynamically calculate: \`((totalCharacters - errors) / totalCharacters) * 100\` and update in real-time.

### Relevant Files
- \`script.js\`

### Acceptance Criteria
- [ ] Accuracy accurately reflects typing accuracy during and at the end of the test.
- [ ] Accuracy handles edge case where 0 characters are typed (should display 100% or 0%, without \`NaN\`).`,
  },
  {
    title: 'fix(logic): Error counter fails to record typing mistakes',
    level: 'level:easy',
    body: `### Problem Description
The error counter fails to record every mistyped character. After entering multiple deliberate errors in sequence, the "Errors" count misses mistakes and does not reflect the actual number of typos.

### Steps to Reproduce
1. Start a typing session.
2. Type 5 incorrect characters deliberately.
3. Check the "Errors" count display.

### Expected Behavior
Every incorrect keystroke should increment the error count accurately.

### Relevant Files
- \`script.js\`

### Acceptance Criteria
- [ ] Error counter increments on every typo.
- [ ] Display correctly shows the cumulative error total.`,
  },
  {
    title: 'fix(ux): Backspace key is blocked in the typing box',
    level: 'level:easy',
    body: `### Problem Description
Pressing the Backspace key inside the typing textarea is prevented by default, stopping users from deleting incorrect input or moving backwards to correct mistakes.

### Steps to Reproduce
1. Start a typing test.
2. Type a word with a mistake.
3. Press the Backspace key.
4. Observe that the caret does not move back and text is not erased.

### Expected Behavior
Users should be allowed to press Backspace to delete typos and correct their input.

### Relevant Files
- \`script.js\`

### Acceptance Criteria
- [ ] Backspace allows correcting recent typos.
- [ ] Highlighting adjusts backwards to match the current cursor position.`,
  },
  {
    title: 'fix(storage): Personal best score does not persist or update on higher WPM',
    level: 'level:easy',
    body: `### Problem Description
Completing a typing session with a Words Per Minute (WPM) score higher than the existing personal record does not update the displayed personal best metric on the dashboard.

### Steps to Reproduce
1. Complete a test with e.g. 30 WPM.
2. Run a second test and achieve 50 WPM.
3. Observe the "Personal Best" card on the UI.

### Expected Behavior
When a session finishes with a WPM > previous best, the Personal Best should update immediately and save to \`localStorage\`.

### Relevant Files
- \`script.js\`

### Acceptance Criteria
- [ ] Personal best updates when a higher score is achieved.
- [ ] Stored in \`localStorage\` so it persists on page reload.`,
  },
  {
    title: 'fix(logic): Passage prematurely completes before all characters are typed',
    level: 'level:easy',
    body: `### Problem Description
The application prematurely marks the typing passage as completed and displays results while several required characters remain untyped at the end of the text.

### Steps to Reproduce
1. Select a passage and type quickly toward the end.
2. Observe when the completion modal appears.
3. Notice that the last 2-3 characters were not yet typed.

### Expected Behavior
A passage should only complete when the user has typed all characters of the passage up to the final character.

### Relevant Files
- \`script.js\`

### Acceptance Criteria
- [ ] Test finishes only after the final character of the passage is typed or timer hits zero.`,
  },

  // Medium
  {
    title: 'fix(logic): WPM calculation artificially inflates on retyping deleted characters',
    level: 'level:medium',
    body: `### Problem Description
When a user deletes portions of their input and retypes them, the WPM calculation inflates significantly, rewarding repeated typing and backspacing of the same word rather than measuring net progress through the passage.

### Steps to Reproduce
1. Type 5 characters, press backspace 5 times, repeat 10 times in 10 seconds.
2. Observe WPM spike to unrealistic numbers (100+ WPM) despite 0 net words typed.

### Expected Behavior
WPM should be calculated based on net correct characters typed divided by 5, over elapsed time in minutes: \`((correctChars / 5) / (elapsedSeconds / 60))\`.

### Relevant Files
- \`script.js\`

### Acceptance Criteria
- [ ] Backspacing and retyping does not artificially inflate WPM score.
- [ ] Gross vs Net WPM calculations are consistent.`,
  },
  {
    title: 'fix(timer): Timer interval continues running into negative numbers after test completes',
    level: 'level:medium',
    body: `### Problem Description
When the round countdown reaches zero and the completion banner appears, the timer callback continues running in the background, pushing the timer into negative seconds and repeatedly triggering session completion updates.

### Steps to Reproduce
1. Start a 15-second test and let the timer run out without typing anything.
2. Wait another 5 seconds after the modal appears.
3. Observe the console or timer variable in devtools.

### Expected Behavior
Once the countdown hits 0, \`clearInterval\` must be called, and the timer must stop completely.

### Relevant Files
- \`script.js\`

### Acceptance Criteria
- [ ] Timer stops exactly at 0.
- [ ] No background callbacks continue firing after session end.`,
  },
  {
    title: 'fix(input): Pasting text breaks character highlighting and state synchronization',
    level: 'level:medium',
    body: `### Problem Description
Pasting a chunk of text into the typing box causes the character highlight to jump forward while leaving intermediate characters unverified and unstyled, desynchronizing the passage state and progress counters.

### Steps to Reproduce
1. Start a test.
2. Copy a sentence from the passage and paste it into the input area.
3. Observe the visual highlighting and error counters.

### Expected Behavior
Either pasting should be prevented completely (with a polite tooltip or notification), OR pasted text must be validated character-by-character to maintain state integrity.

### Relevant Files
- \`script.js\`

### Acceptance Criteria
- [ ] Pasted text does not corrupt the character highlighting array or progress calculations.`,
  },
  {
    title: 'perf: Character highlighting lags and stutters during fast typing bursts',
    level: 'level:medium',
    body: `### Problem Description
During rapid typing bursts (> 80 WPM), active-character highlighting noticeably lags behind the cursor and keystrokes, creating visible latency and stutter as characters are re-rendered.

### Steps to Reproduce
1. Type very fast or hold down keys.
2. Observe the DOM element updates on the passage container.

### Expected Behavior
Passage rendering should be efficient (e.g. updating only the previous and next character spans, or batching DOM updates using \`requestAnimationFrame\`) instead of rebuilding the full innerHTML on every keystroke.

### Relevant Files
- \`script.js\`

### Acceptance Criteria
- [ ] Smooth, zero-lag character highlighting even above 100 WPM.`,
  },
  {
    title: 'fix(state): Switching round durations or resetting leaves stale timer state',
    level: 'level:medium',
    body: `### Problem Description
Resetting the test or switching round durations (e.g. from 15s to 60s) after a completed session can leave behind timer state from the prior run, causing the time display to count down on an unstarted round.

### Steps to Reproduce
1. Start and finish a 15s round.
2. Click the 60s round button.
3. Observe the timer display.

### Expected Behavior
Changing round duration must cleanly reset all test states, cancel active intervals, reset progress counters, and display the new duration without starting the timer until user starts typing.

### Relevant Files
- \`script.js\`

### Acceptance Criteria
- [ ] Switching rounds properly resets timer and all UI state cleanly.`,
  },
  {
    title: 'fix(state): Toggling theme during an active test resets user progress and timer',
    level: 'level:medium',
    body: `### Problem Description
Toggling between light and dark themes while a test is actively in progress unexpectedly resets the session, clearing user input and resetting the timer to initial state.

### Steps to Reproduce
1. Start typing a test (run for 5 seconds).
2. Click the theme toggle icon.
3. Notice that the input box clears and timer resets to start.

### Expected Behavior
Theme toggle should ONLY update CSS classes / data attributes on the \`<body>\` or root container without re-initializing the typing session state.

### Relevant Files
- \`script.js\`
- \`index.html\`

### Acceptance Criteria
- [ ] Toggling theme mid-test preserves the active timer, typed text, and current passage position.`,
  },
  {
    title: 'fix(chart): Live WPM progression chart plots inaccurate/fluctuating values',
    level: 'level:medium',
    body: `### Problem Description
The live WPM chart plots fluctuating or random speed values throughout the session that do not match the user's actual measured typing velocity.

### Steps to Reproduce
1. Start a test and type at a steady pace.
2. Inspect the live WPM speed progression chart.
3. Notice unexpected peaks and troughs disconnected from keystroke timestamps.

### Expected Behavior
The chart should plot actual measured WPM samples recorded at regular 1-second intervals.

### Relevant Files
- \`script.js\`
- \`index.html\`

### Acceptance Criteria
- [ ] Live chart coordinates accurately reflect second-by-second WPM performance.`,
  },

  // Hard
  {
    title: 'feat: Implement Ghost Race replay mode from placeholder page',
    level: 'level:hard',
    body: `### Problem Description
Clicking the "Race a ghost" button navigates to \`ghost.html\`, which is currently an HTTP 501 / unimplemented placeholder page.

### Expected Behavior
Ghost mode should allow users to race against their personal best or a previous recorded run:
1. Record timestamped keystrokes during a personal best run into \`localStorage\`.
2. When "Race a ghost" is launched, animate a second cursor or progress bar representing the "ghost" runner at the recorded pace alongside the user's live typing.
3. Display comparative delta (e.g. "+3 words ahead" or "-2 words behind").

### Relevant Files
- \`ghost.html\`
- \`script.js\`
- \`style.css\`

### Acceptance Criteria
- [ ] Functional ghost race mode that replays past personal best pace.
- [ ] Clean UI showing user vs ghost progress in real time.`,
  },
  {
    title: 'fix(concurrency): Final keystroke races with timer expiry causing duplicate completion',
    level: 'level:hard',
    body: `### Problem Description
Keystrokes entered right at or near the timer deadline (0.0s) can race with the session expiration handler, resulting in duplicate completion triggers, mismatched final statistics, and inconsistent passage text.

### Steps to Reproduce
1. Type right up until the last millisecond of the timer.
2. In devtools, observe multiple completion events or duplicated summary dialogs.

### Expected Behavior
A mutex or boolean lock (\`isTestActive\` / \`isCompleted\`) should guard session completion so only a single completion cycle can ever execute.

### Relevant Files
- \`script.js\`

### Acceptance Criteria
- [ ] Exact, idempotent termination: session completes exactly once, locking the input textarea immediately.`,
  },
  {
    title: 'fix(timer): Restarting creates multiple concurrent timer intervals accelerating countdown',
    level: 'level:hard',
    body: `### Problem Description
Starting a new round after completing an earlier session or clicking Restart rapidly can leave the previous timer interval active, causing subsequent rounds to run with multiple concurrent timers, accelerating the countdown and ending tests prematurely.

### Steps to Reproduce
1. Rapidly click Restart multiple times, then start typing.
2. Notice the seconds count down twice as fast (e.g. 2 seconds ticking per real second).

### Expected Behavior
The timer manager should ensure any existing interval is strictly cleared before starting a new one (\`clearInterval(timerId); timerId = null;\`).

### Relevant Files
- \`script.js\`

### Acceptance Criteria
- [ ] Countdown ticks strictly at 1 real second per countdown second, regardless of how many times reset is clicked.`,
  },
  {
    title: 'fix(heatmap): Per-key error keyboard heatmap displays random distribution instead of real typos',
    level: 'level:hard',
    body: `### Problem Description
The keyboard heatmap highlights keys and assigns error intensity values based on randomly generated distributions rather than reflecting the actual keys the user mistyped.

### Steps to Reproduce
1. Intentionally mistype only the 'Q' and 'Z' keys during a round.
2. View the post-test keyboard heatmap.
3. Observe that keys like 'E', 'T', 'O' are highlighted instead of 'Q' and 'Z'.

### Expected Behavior
The keyboard heatmap must track an error frequency map: \`{ [expectedChar]: count }\` or \`{ [typedChar]: count }\` and map CSS intensity gradients based on genuine recorded mistakes.

### Relevant Files
- \`script.js\`
- \`style.css\`

### Acceptance Criteria
- [ ] Heatmap accurately highlights the exact keys that had errors with proportional color intensity.`,
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
