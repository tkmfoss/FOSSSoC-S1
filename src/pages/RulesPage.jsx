import React from 'react';
import { POINTS, ELIGIBILITY, TIERS } from '../rules';

export default function RulesPage() {
  return (
    <div className="section-spacing" style={{ position: 'relative', zIndex: 1 }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Rules & Points</h1>
          <p style={{ maxWidth: '640px', fontSize: '0.95rem' }}>
            Official contribution guidelines and scoring rubric for FOSSSoC-S1.
          </p>
        </div>

        {/* Level points */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', fontFamily: 'var(--font-mono)' }}>
            Issue Levels & Base Points
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1.2rem', border: '1px solid var(--theme-border)', borderRadius: 'var(--radius-sm)', background: 'var(--theme-card-bg)', fontFamily: 'var(--font-mono)' }}>
              <div style={{ color: 'var(--theme-primary)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                Easy: {POINTS.levels.easy} pts
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                Mentor sets the level. Small bug fixes, documentation, minor UI adjustments.
              </div>
            </div>

            <div style={{ padding: '1.2rem', border: '1px solid var(--theme-border)', borderRadius: 'var(--radius-sm)', background: 'var(--theme-card-bg)', fontFamily: 'var(--font-mono)' }}>
              <div style={{ color: 'var(--theme-primary)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                Medium: {POINTS.levels.medium} pts
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                Mentor sets the level. Feature implementations, component logic, API updates.
              </div>
            </div>

            <div style={{ padding: '1.2rem', border: '1px solid var(--theme-border)', borderRadius: 'var(--radius-sm)', background: 'var(--theme-card-bg)', fontFamily: 'var(--font-mono)' }}>
              <div style={{ color: 'var(--theme-primary)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                Hard: {POINTS.levels.hard} pts
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                Mentor sets the level. Architecture rewrites, complex subsystems, critical integrations.
              </div>
            </div>
          </div>
        </div>

        {/* Bonuses & Caps */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', fontFamily: 'var(--font-mono)' }}>
            Bonuses & Capping Rules
          </h2>
          <div style={{ border: '1px solid var(--theme-border)', borderRadius: 'var(--radius-sm)', background: 'var(--theme-card-bg)', padding: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.88rem', lineHeight: 1.8 }}>
            <div><strong style={{ color: 'var(--color-white)' }}>First-week bonus (+{POINTS.firstWeekBonus} pts):</strong> Awarded on your earliest-opened scored PR in each repo, if opened in the first week of the month (1-7 Nov for Build Month; 1-7 Dec for Christmas Eve Month).</div>
            <div><strong style={{ color: 'var(--color-white)' }}>Quality bonus (+{POINTS.qualityBonus} pts):</strong> Granted via maintainer's quality:excellent label for high code quality, tests, or documentation.</div>
            <div><strong style={{ color: 'var(--color-white)' }}>{POINTS.repoCap} PRs per repo cap:</strong> Only the first {POINTS.repoCap} scored PRs per repository count towards points. Further PRs are capped at 0 pts.</div>
            <div><strong style={{ color: 'var(--color-white)' }}>Merge credit rule:</strong> Points are credited only after merge; a PR counts for the month it was opened. The leaderboard recalculates and syncs twice daily at <strong>1:30 PM</strong> and <strong>11:30 PM IST</strong>.</div>
            <div><strong style={{ color: 'var(--color-white)' }}>Spam or invalid:</strong> 0 points. Automated or copy-pasted low-effort submissions are disqualified.</div>
          </div>
        </div>

        {/* Prize Eligibility */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', fontFamily: 'var(--font-mono)' }}>
            Prize Eligibility Thresholds
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1.2rem', border: '1px solid var(--theme-border)', borderRadius: 'var(--radius-sm)', background: 'var(--theme-card-bg)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
              <div style={{ color: 'var(--color-white)', fontWeight: 700, marginBottom: '0.5rem' }}>October (Portfolio Week)</div>
              <ul style={{ paddingLeft: '1.2rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                <li>{ELIGIBILITY.october.totalMin} of {POINTS.portfolio.total} points total</li>
                {ELIGIBILITY.october.needs.map((item, idx) => (
                  <li key={idx} style={{ textTransform: 'capitalize' }}>{item}</li>
                ))}
                <li>Mentor rubric at least {ELIGIBILITY.october.rubricMin} pts</li>
              </ul>
            </div>

            <div style={{ padding: '1.2rem', border: '1px solid var(--theme-border)', borderRadius: 'var(--radius-sm)', background: 'var(--theme-card-bg)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
              <div style={{ color: 'var(--color-white)', fontWeight: 700, marginBottom: '0.5rem' }}>Monthly (Nov & Dec)</div>
              <ul style={{ paddingLeft: '1.2rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                <li>{ELIGIBILITY.month.pointsMin} points in that month</li>
                <li>At least {ELIGIBILITY.month.mergedPRsMin} merged PRs</li>
                <li>At least {ELIGIBILITY.month.mediumOrHardMin} medium or hard PR</li>
              </ul>
            </div>

            <div style={{ padding: '1.2rem', border: '1px solid var(--theme-border)', borderRadius: 'var(--radius-sm)', background: 'var(--theme-card-bg)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
              <div style={{ color: 'var(--color-white)', fontWeight: 700, marginBottom: '0.5rem' }}>Overall Season</div>
              <ul style={{ paddingLeft: '1.2rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                <li>{ELIGIBILITY.overall.pointsMin} points total</li>
                <li>Active in {ELIGIBILITY.overall.activeMonthsMin} distinct months</li>
                <li>Contributions across {ELIGIBILITY.overall.reposMin} different repos</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Participation Tiers */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', fontFamily: 'var(--font-mono)' }}>
            Recognition Tiers
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {TIERS.map((tier) => (
              <div key={tier.id} style={{ padding: '1.2rem', border: '1px solid var(--theme-border)', borderRadius: 'var(--radius-sm)', background: 'var(--theme-card-bg)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                <div style={{ color: 'var(--theme-primary)', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.3rem' }}>
                  {tier.label}
                </div>
                <div style={{ color: 'var(--color-text-muted)' }}>
                  {tier.rule ? tier.rule : `Minimum ${tier.min} points accumulated across the season`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Note on Prize Eligibility */}
        <div
          style={{
            padding: '1.4rem',
            border: '1px solid var(--theme-border)',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--theme-card-bg)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            lineHeight: 1.6
          }}
        >
          <div style={{ color: 'var(--color-white)', fontWeight: 700, marginBottom: '0.3rem' }}>
            Note on Prize Eligibility
          </div>
          <div style={{ color: 'var(--color-text-muted)' }}>
            "Not prize-eligible" is not "disqualified". It simply denotes whether the minimum criteria to receive seasonal prizes have been met. If nobody qualifies in a category, no winner is awarded. All merged contributions remain valid open source commits.
          </div>
        </div>
      </div>
    </div>
  );
}
