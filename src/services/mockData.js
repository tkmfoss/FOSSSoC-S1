export function generateDemoLeaderboard() {
  const departments = [
    'Computer Science & Engineering',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Electrical & Electronics',
    'Civil Engineering',
    'Chemical Engineering'
  ];

  const demoUsers = [
    {
      user: 'karthik-menon',
      name: 'Karthik Menon',
      dept: departments[0],
      year: 3,
      tier: 'core',
      portAuto: 30,
      rubric: 18,
      prs: [
        {
          repo: 'campus-connect',
          number: 42,
          title: 'feat: add websocket notifications for event alerts',
          level: 'hard',
          base: 50,
          firstWeek: 5,
          quality: 5,
          capped: false,
          points: 60,
          opened: '2026-11-03',
          merged: '2026-11-05',
          month: '2026-11'
        },
        {
          repo: 'campus-connect',
          number: 48,
          title: 'fix: sanitize user markdown inputs in event descriptions',
          level: 'medium',
          base: 25,
          firstWeek: 0,
          quality: 2,
          capped: false,
          points: 27,
          opened: '2026-11-12',
          merged: '2026-11-14',
          month: '2026-11'
        },
        {
          repo: 'campus-connect',
          number: 52,
          title: 'perf: optimize SQL query for club member search',
          level: 'medium',
          base: 25,
          firstWeek: 0,
          quality: 0,
          capped: false,
          points: 25,
          opened: '2026-11-19',
          merged: '2026-11-21',
          month: '2026-11'
        },
        {
          repo: 'campus-connect',
          number: 58,
          title: 'docs: document event schema API contracts',
          level: 'easy',
          base: 10,
          firstWeek: 0,
          quality: 0,
          capped: false,
          points: 10,
          opened: '2026-11-25',
          merged: '2026-11-26',
          month: '2026-11'
        },
        {
          repo: 'campus-connect',
          number: 64,
          title: 'chore: upgrade fastapi and pydantic dependencies',
          level: 'easy',
          base: 10,
          firstWeek: 0,
          quality: 0,
          capped: false,
          points: 10,
          opened: '2026-11-28',
          merged: '2026-11-29',
          month: '2026-11'
        },
        {
          repo: 'campus-connect',
          number: 70,
          title: 'refactor: extract date formatting helpers (capped)',
          level: 'easy',
          base: 10,
          firstWeek: 0,
          quality: 0,
          capped: true,
          points: 0,
          opened: '2026-11-30',
          merged: '2026-12-01',
          month: '2026-11'
        },
        {
          repo: 'foss-bot',
          number: 19,
          title: 'feat: slash command for checking participant stats',
          level: 'medium',
          base: 25,
          firstWeek: 5,
          quality: 0,
          capped: false,
          points: 30,
          opened: '2026-12-04',
          merged: '2026-12-06',
          month: '2026-12'
        }
      ]
    },
    {
      user: 'ananya-s',
      name: 'Ananya Sharma',
      dept: departments[1],
      year: 2,
      tier: 'contributor',
      portAuto: 30,
      rubric: 16,
      prs: [
        {
          repo: 'tkm-bus-tracker',
          number: 15,
          title: 'feat: GPS polling debounce and live bus icon rotation',
          level: 'hard',
          base: 50,
          firstWeek: 5,
          quality: 5,
          capped: false,
          points: 60,
          opened: '2026-11-04',
          merged: '2026-11-06',
          month: '2026-11'
        },
        {
          repo: 'tkm-bus-tracker',
          number: 21,
          title: 'fix: prevent unnecessary re-render on map pan',
          level: 'medium',
          base: 25,
          firstWeek: 0,
          quality: 0,
          capped: false,
          points: 25,
          opened: '2026-11-18',
          merged: '2026-11-19',
          month: '2026-11'
        },
        {
          repo: 'tkm-notes-hub',
          number: 11,
          title: 'feat: add dark mode theme to pdf reader',
          level: 'medium',
          base: 25,
          firstWeek: 0,
          quality: 0,
          capped: false,
          points: 25,
          opened: '2026-12-10',
          merged: '2026-12-12',
          month: '2026-12'
        }
      ]
    },
    {
      user: 'rahul-v',
      name: 'Rahul Verma',
      dept: departments[2],
      year: 4,
      tier: 'contributor',
      portAuto: 30,
      rubric: 14,
      prs: [
        {
          repo: 'open-lab-inventory',
          number: 31,
          title: 'feat: export equipment audit log to CSV',
          level: 'medium',
          base: 25,
          firstWeek: 0,
          quality: 3,
          capped: false,
          points: 28,
          opened: '2026-11-15',
          merged: '2026-11-18',
          month: '2026-11'
        },
        {
          repo: 'open-lab-inventory',
          number: 34,
          title: 'feat: barcode scanner integration via html5-qrcode',
          level: 'medium',
          base: 25,
          firstWeek: 0,
          quality: 0,
          capped: false,
          points: 25,
          opened: '2026-11-22',
          merged: '2026-11-25',
          month: '2026-11'
        }
      ]
    },
    {
      user: 'fathima-noor',
      name: 'Fathima Noor',
      dept: departments[0],
      year: 2,
      tier: 'participant',
      portAuto: 30,
      rubric: null,
      prs: [
        {
          repo: 'campus-connect',
          number: 51,
          title: 'feat: dark mode toggle persistence in localStorage',
          level: 'medium',
          base: 25,
          firstWeek: 0,
          quality: 0,
          capped: false,
          points: 25,
          opened: '2026-11-10',
          merged: '2026-11-13',
          month: '2026-11'
        },
        {
          repo: 'tkm-notes-hub',
          number: 8,
          title: 'feat: pdf preview thumbnail generator',
          level: 'easy',
          base: 10,
          firstWeek: 5,
          quality: 5,
          capped: false,
          points: 20,
          opened: '2026-12-02',
          merged: '2026-12-05',
          month: '2026-12'
        }
      ]
    },
    {
      user: 'arjun-krishna',
      name: 'Arjun Krishna',
      dept: departments[3],
      year: 1,
      tier: 'participant',
      portAuto: 30,
      rubric: 15,
      prs: [
        {
          repo: 'foss-bot',
          number: 27,
          title: 'fix: handle edge case when user has no discord avatar',
          level: 'easy',
          base: 10,
          firstWeek: 0,
          quality: 0,
          capped: false,
          points: 10,
          opened: '2026-12-11',
          merged: '2026-12-13',
          month: '2026-12'
        }
      ]
    },
    {
      user: 'devika-nair',
      name: 'Devika Nair',
      dept: departments[4],
      year: 2,
      tier: 'contributor',
      portAuto: 30,
      rubric: 17,
      prs: [
        {
          repo: 'tkm-bus-tracker',
          number: 28,
          title: 'feat: add offline caching with indexeddb',
          level: 'hard',
          base: 50,
          firstWeek: 0,
          quality: 5,
          capped: false,
          points: 55,
          opened: '2026-11-14',
          merged: '2026-11-17',
          month: '2026-11'
        }
      ]
    },
    {
      user: 'siddharth-r',
      name: 'Siddharth Ramesh',
      dept: departments[5],
      year: 3,
      tier: 'participant',
      portAuto: 20,
      rubric: 12,
      prs: [
        {
          repo: 'open-lab-inventory',
          number: 40,
          title: 'style: modern card grid layout for equipment catalogue',
          level: 'easy',
          base: 10,
          firstWeek: 0,
          quality: 0,
          capped: false,
          points: 10,
          opened: '2026-11-19',
          merged: '2026-11-20',
          month: '2026-11'
        }
      ]
    },
    {
      user: 'aisha-mariam',
      name: 'Aisha Mariam',
      dept: departments[0],
      year: 1,
      tier: 'participant',
      portAuto: 30,
      rubric: 15,
      prs: []
    },
    {
      user: 'vishnu-prasad',
      name: 'Vishnu Prasad',
      dept: departments[1],
      year: 4,
      tier: 'contributor',
      portAuto: 30,
      rubric: 19,
      prs: [
        {
          repo: 'embedded-gateway',
          number: 12,
          title: 'feat: MQTT broker reconnection state machine in Rust',
          level: 'hard',
          base: 50,
          firstWeek: 5,
          quality: 5,
          capped: false,
          points: 60,
          opened: '2026-12-03',
          merged: '2026-12-07',
          month: '2026-12'
        }
      ]
    },
    {
      user: 'sneha-alex',
      name: 'Sneha Alex',
      dept: departments[0],
      year: 2,
      tier: 'participant',
      portAuto: 30,
      rubric: 10,
      prs: [
        {
          repo: 'campus-connect',
          number: 66,
          title: 'fix: aria accessibility tags on navigation menu',
          level: 'easy',
          base: 10,
          firstWeek: 0,
          quality: 0,
          capped: false,
          points: 10,
          opened: '2026-11-26',
          merged: '2026-11-27',
          month: '2026-11'
        }
      ]
    }
  ];

  const processedUsers = demoUsers.map((u) => {
    const portfolioScore = (u.portAuto || 0) + (u.rubric || 0);
    const portEligible = portfolioScore >= 35 && (u.rubric || 0) >= 10;

    const prsList = u.prs.map((p) => ({
      ...p,
      url: `https://github.com/tkmfoss/${p.repo}/pull/${p.number}`
    }));

    // Calculate month breakdown
    let novPoints = 0, novPrs = 0, novMediumPlus = 0;
    let decPoints = 0, decPrs = 0, decMediumPlus = 0;
    const reposSet = new Set();

    prsList.forEach((p) => {
      reposSet.add(p.repo);
      if (p.month === '2026-11') {
        novPoints += p.points;
        novPrs++;
        if (p.level === 'medium' || p.level === 'hard') novMediumPlus++;
      } else if (p.month === '2026-12') {
        decPoints += p.points;
        decPrs++;
        if (p.level === 'medium' || p.level === 'hard') decMediumPlus++;
      }
    });

    const novEligible = novPoints >= 50 && novPrs >= 2 && novMediumPlus >= 1;
    const decEligible = decPoints >= 50 && decPrs >= 2 && decMediumPlus >= 1;

    let activeMonths = 0;
    if (portfolioScore > 0) activeMonths++;
    if (novPrs > 0) activeMonths++;
    if (decPrs > 0) activeMonths++;

    const projectPoints = prsList.reduce((acc, curr) => acc + curr.points, 0);
    const grandTotal = portfolioScore + projectPoints;
    const overallEligible = grandTotal >= 120 && activeMonths >= 2 && reposSet.size >= 2;

    const pendingCount = u.prs.length % 2 === 1 ? 1 : 0;

    return {
      user: u.user,
      name: u.name,
      college: u.college || 'TKMCE',
      department: u.dept,
      year: u.year,
      total: grandTotal,
      tier: u.tier,
      portfolio: {
        fork: 5,
        commits: 5,
        live: 10,
        showcase: 10,
        auto: u.portAuto,
        rubric: u.rubric,
        total: portfolioScore,
        eligible: portEligible
      },
      projects: {
        total: projectPoints,
        merged: prsList.length,
        pending: pendingCount,
        prs: prsList
      },
      months: {
        '2026-10': { points: portfolioScore, prs: 1, mediumPlus: 0, eligible: portEligible },
        '2026-11': { points: novPoints, prs: novPrs, mediumPlus: novMediumPlus, eligible: novEligible },
        '2026-12': { points: decPoints, prs: decPrs, mediumPlus: decMediumPlus, eligible: decEligible }
      },
      overall: {
        points: grandTotal,
        activeMonths,
        repos: reposSet.size,
        eligible: overallEligible
      }
    };
  });

  // Sort overall by total descending
  processedUsers.sort((a, b) => b.total - a.total);

  return {
    updated: new Date().toISOString(),
    lastChecked: new Date().toISOString(),
    thresholds: {
      october: { total: 35, rubric: 10 },
      month: { points: 50, prs: 2, mediumPlus: 1 },
      overall: { points: 120, months: 2, repos: 2 }
    },
    users: processedUsers,
    hall: [
      {
        github: 'karthik-menon',
        name: 'Karthik Menon',
        site: 'https://karthik-menon.github.io/portfolio',
        college: 'TKMCE',
        department: 'Computer Science & Engineering',
        year: 3
      },
      {
        github: 'ananya-s',
        name: 'Ananya Sharma',
        site: 'https://ananya-sharma.dev',
        college: 'TKMCE',
        department: 'Electronics & Communication',
        year: 2
      },
      {
        github: 'rahul-v',
        name: 'Rahul Verma',
        site: 'https://rahulverma-tkm.github.io',
        college: 'TKMCE',
        department: 'Mechanical Engineering',
        year: 4
      },
      {
        github: 'arjun-krishna',
        name: 'Arjun Krishna',
        site: 'https://arjunkrishna.web.app',
        college: 'CET Trivandrum',
        department: 'Electrical & Electronics',
        year: 1
      },
      {
        github: 'devika-nair',
        name: 'Devika Nair',
        site: 'https://devika-nair.me',
        college: 'TKMCE',
        department: 'Civil Engineering',
        year: 2
      },
      {
        github: 'siddharth-r',
        name: 'Siddharth Ramesh',
        site: 'https://sid-ramesh.github.io/showcase',
        college: 'NIT Calicut',
        department: 'Chemical Engineering',
        year: 3
      },
      {
        github: 'aisha-mariam',
        name: 'Aisha Mariam',
        site: 'https://aishamariam.dev',
        college: 'TKMCE',
        department: 'Computer Science & Engineering',
        year: 1
      },
      {
        github: 'vishnu-prasad',
        name: 'Vishnu Prasad',
        site: 'https://vishnu-prasad.tech',
        college: 'BITS Pilani (Goa)',
        department: 'Electronics & Communication',
        year: 4
      }
    ]
  };
}
