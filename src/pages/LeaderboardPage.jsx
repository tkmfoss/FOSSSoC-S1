import React, { useState } from 'react';
import { useLeaderboardData } from '../hooks/useLeaderboardData';
import { useTheme } from '../context/ThemeContext';
import { TIER_CONFIG } from '../rules';
import {
  Search,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Clock,
  X,
  AlertTriangle
} from 'lucide-react';

export default function LeaderboardPage() {
  const { data, loading, error, refetch, isDemoMode } = useLeaderboardData();
  const { theme, themes } = useTheme();
  const currentTheme = themes[theme] || themes.october;
  const [activeTab, setActiveTab] = useState('overall');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const users = data?.users || [];
  const thresholds = data?.thresholds || {
    october: { total: 35, rubric: 10 },
    month: { points: 50, prs: 2, mediumPlus: 1 },
    overall: { points: 120, months: 2, repos: 2 }
  };

  // Compute row data
  const rows = users.map((u) => {
    let tabPoints = 0;
    let tabPrs = 0;
    let tabEligible = false;

    if (activeTab === 'overall') {
      tabPoints = u.total || 0;
      tabPrs = (u.portfolio?.showcase > 0 ? 1 : 0) + (u.projects?.merged || 0);
      tabEligible = u.overall?.eligible || false;
    } else if (activeTab === 'october') {
      tabPoints = u.portfolio?.total || 0;
      tabPrs = u.portfolio?.showcase > 0 ? 1 : 0;
      tabEligible = u.portfolio?.eligible || false;
    } else if (activeTab === 'november') {
      const nov = u.months ? u.months['2026-11'] : null;
      tabPoints = nov?.points || 0;
      tabPrs = nov?.prs || 0;
      tabEligible = nov?.eligible || false;
    } else if (activeTab === 'december') {
      const dec = u.months ? u.months['2026-12'] : null;
      tabPoints = dec?.points || 0;
      tabPrs = dec?.prs || 0;
      tabEligible = dec?.eligible || false;
    }

    return {
      ...u,
      tabPoints,
      tabPrs,
      tabEligible
    };
  });

  rows.sort((a, b) => b.tabPoints - a.tabPoints);

  const filteredRows = rows.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      (r.name && r.name.toLowerCase().includes(q)) ||
      (r.user && r.user.toLowerCase().includes(q)) ||
      (r.college && r.college.toLowerCase().includes(q)) ||
      (r.department && r.department.toLowerCase().includes(q))
    );
  });

  return (
    <div className="section-spacing" style={{ position: 'relative', zIndex: 1 }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Leaderboard</h1>
            <p style={{ maxWidth: '640px', fontSize: '0.95rem' }}>
              Standings computed from merged pull requests and portfolio evaluations. Click a row to inspect breakdown.
            </p>
          </div>

          {/* Theme Board Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--theme-border)',
              background: 'var(--theme-card-bg)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem'
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: 'var(--theme-primary)',
                display: 'inline-block'
              }}
            />
            <span style={{ color: 'var(--color-text-subtle)' }}>THEME:</span>
            <span style={{ color: 'var(--theme-primary)', fontWeight: 700 }}>{currentTheme.themeName}</span>
          </div>
        </div>

        {/* Tab Controls, Search & Refresh */}
        <div
          style={{
            padding: '1rem',
            background: 'var(--theme-card-bg)',
            border: '1px solid var(--theme-border)',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {[
              { id: 'overall', label: 'Overall' },
              { id: 'october', label: 'October (Halloween)' },
              { id: 'november', label: 'November (Build Month)' },
              { id: 'december', label: 'December (Christmas Eve)' }
            ].map((t) => {
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  style={{
                    padding: '0.45rem 0.9rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: isActive ? 700 : 500,
                    background: isActive ? 'var(--theme-primary)' : 'transparent',
                    color: isActive ? '#000000' : 'var(--color-text-muted)',
                    border: '1px solid ' + (isActive ? 'var(--theme-primary)' : 'var(--theme-border)'),
                    cursor: 'pointer'
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Right: Search & Refresh */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 0.8rem',
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid var(--theme-border)',
                borderRadius: 'var(--radius-sm)',
                minWidth: '220px'
              }}
            >
              <Search size={14} color="var(--color-text-muted)" />
              <input
                type="text"
                placeholder="filter by user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-white)',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-mono)',
                  outline: 'none',
                  width: '100%'
                }}
              />
            </div>

            <button
              onClick={() => refetch()}
              title="Refresh Leaderboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.75rem',
                border: '1px solid var(--theme-border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-text-muted)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={13} className={loading ? 'spin' : ''} />
              <span>refresh</span>
            </button>
          </div>
        </div>

        {/* Sync Schedule Notification */}
        <div
          style={{
            padding: '0.65rem 1rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--theme-border)',
            background: 'rgba(0, 245, 212, 0.04)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            color: 'var(--color-text-muted)',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.6rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--theme-primary)', fontWeight: 700 }}>● SYNC SCHEDULE:</span>
            <span>Leaderboard updates twice daily at <strong>1:30 PM</strong> and <strong>11:30 PM IST</strong>. Newly merged PRs will reflect in the next sync window.</span>
          </div>
        </div>

        {/* Timestamp */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-text-subtle)',
            marginBottom: '1rem',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Clock size={12} />
            <span>
              Last synced: {data?.updated ? `${new Date(data.updated).toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${new Date(data.updated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Not synced'} (browser auto-refreshes every 5m)
            </span>
          </div>
          <div>Rows: {filteredRows.length}</div>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              padding: '1.5rem',
              border: '1px solid var(--color-danger)',
              marginBottom: '1.5rem',
              background: 'var(--color-danger-bg)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem'
            }}
          >
            <div style={{ color: 'var(--color-danger)', fontWeight: 700, marginBottom: '0.3rem' }}>
              Error loading leaderboard
            </div>
            <div>{error}</div>
          </div>
        )}

        {/* Table / Honest Empty State */}
        <div
          style={{
            border: '1px solid var(--theme-border)',
            borderRadius: 'var(--radius-sm)',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            background: 'var(--theme-card-bg)'
          }}
        >
          {loading && !data ? (
            <div style={{ padding: '3.5rem', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
              $ git shortlog --summary --numbered
              <div style={{ marginTop: '0.5rem', color: 'var(--color-text-muted)' }}>fetching data...</div>
            </div>
          ) : users.length === 0 ? (
            /* Honest empty state */
            <div style={{ padding: '4rem 2rem', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
              <div style={{ fontSize: '1rem', color: 'var(--color-white)', marginBottom: '0.5rem' }}>
                No contributors yet. Registration is open until 24 Oct.
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', maxWidth: '480px', margin: '0 auto' }}>
                Pull request submissions and scoring begin with Portfolio Week on 24 October 2026.
              </p>
            </div>
          ) : filteredRows.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
              No matches for search query.
            </div>
          ) : (
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '0.88rem',
                fontFamily: 'var(--font-mono)'
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: '1px solid var(--theme-border)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    color: 'var(--color-text-muted)',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase'
                  }}
                >
                  <th style={{ padding: '0.8rem 1rem', width: '60px' }}>Rank</th>
                  <th style={{ padding: '0.8rem 1rem' }}>User</th>
                  <th style={{ padding: '0.8rem 1rem' }}>Tier</th>
                  <th style={{ padding: '0.8rem 1rem', textAlign: 'center' }}>PRs</th>
                  <th style={{ padding: '0.8rem 1rem', textAlign: 'right' }}>Points</th>
                  <th style={{ padding: '0.8rem 1rem', textAlign: 'center' }}>Eligibility</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row, index) => {
                  const rank = index + 1;
                  const tierInfo = TIER_CONFIG[row.tier] || TIER_CONFIG.none;
                  const pendingPrs = row.projects?.pending || 0;

                  return (
                    <tr
                      key={row.user}
                      onClick={() => setSelectedUser(row)}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <td style={{ padding: '0.8rem 1rem', color: rank <= 3 ? 'var(--theme-primary)' : 'var(--color-text-muted)' }}>
                        #{rank}
                      </td>

                      <td style={{ padding: '0.8rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <img
                            src={`https://github.com/${row.user}.png?size=48`}
                            alt={row.user}
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '2px',
                              objectFit: 'cover'
                            }}
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                          <div>
                            <div>
                              <span style={{ color: 'var(--color-white)', fontWeight: 600 }}>{row.name}</span>
                              <span style={{ color: 'var(--color-text-muted)', marginLeft: '0.4rem', fontSize: '0.78rem' }}>
                                @{row.user}
                              </span>
                            </div>
                            {(row.college || row.department || row.year) && (
                              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-subtle)', marginTop: '0.15rem' }}>
                                {[row.college, row.department, row.year ? `Y${row.year}` : null].filter(Boolean).join(' • ')}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '0.8rem 1rem' }}>
                        <span style={{ color: tierInfo.color, fontSize: '0.78rem' }}>
                          [{tierInfo.label}]
                        </span>
                      </td>

                      <td style={{ padding: '0.8rem 1rem', textAlign: 'center' }}>
                        {row.tabPrs}
                        {pendingPrs > 0 && activeTab !== 'october' && (
                          <span style={{ color: 'var(--color-warning)', fontSize: '0.75rem', marginLeft: '0.3rem' }}>
                            (+{pendingPrs})
                          </span>
                        )}
                      </td>

                      <td style={{ padding: '0.8rem 1rem', textAlign: 'right', fontWeight: 700, color: 'var(--theme-primary)' }}>
                        {row.tabPoints}
                      </td>

                      <td style={{ padding: '0.8rem 1rem', textAlign: 'center' }}>
                        {row.tabEligible ? (
                          <span style={{ color: 'var(--color-success)', fontSize: '0.78rem' }}>
                            Eligible
                          </span>
                        ) : (
                          <span style={{ color: 'var(--color-text-subtle)', fontSize: '0.78rem' }}>
                            In progress
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Profile Drawer */}
      {selectedUser && (
        <div
          role="dialog"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 100,
            display: 'flex',
            justifyContent: 'flex-end',
            background: 'rgba(0, 0, 0, 0.7)'
          }}
          onClick={() => setSelectedUser(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '600px',
              height: '100%',
              background: 'var(--theme-bg)',
              borderLeft: '1px solid var(--theme-border)',
              overflowY: 'auto',
              padding: '1.8rem',
              fontFamily: 'var(--font-mono)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '1px solid var(--theme-border)', paddingBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: '1.2rem', color: 'var(--color-white)', fontWeight: 700 }}>{selectedUser.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.2rem' }}>
                  <a
                    href={`https://github.com/${selectedUser.user}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--theme-primary)', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    @{selectedUser.user} <ExternalLink size={12} />
                  </a>
                  {selectedUser.college && (
                    <span style={{ fontSize: '0.75rem', padding: '0.1rem 0.4rem', border: '1px solid var(--theme-border)', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-muted)' }}>
                      {selectedUser.college}
                    </span>
                  )}
                </div>
                {(selectedUser.department || selectedUser.year) && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.3rem' }}>
                    {[selectedUser.department, selectedUser.year ? `Year ${selectedUser.year}` : null].filter(Boolean).join(' • ')}
                  </div>
                )}
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                style={{ padding: '0.3rem', color: 'var(--color-text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Threshold check */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                Prize Threshold Progress
              </div>
              <div style={{ fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                October Portfolio: {selectedUser.portfolio?.total || 0} / {thresholds.october.total} pts ({selectedUser.portfolio?.eligible ? 'Eligible' : 'In progress'})
              </div>
              <div style={{ fontSize: '0.8rem' }}>
                Season Total: {selectedUser.total || 0} / {thresholds.overall.points} pts ({selectedUser.overall?.eligible ? 'Eligible' : 'In progress'})
              </div>
            </div>

            {/* Portfolio breakdown if available */}
            {selectedUser.portfolio && selectedUser.portfolio.total > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                  Portfolio Week Breakdown ({selectedUser.portfolio.total} pts)
                </div>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', fontSize: '0.72rem' }}>
                  <span style={{ padding: '0.15rem 0.45rem', border: '1px solid var(--theme-border)', borderRadius: 'var(--radius-sm)', color: selectedUser.portfolio.fork > 0 ? 'var(--color-success)' : 'var(--color-text-subtle)' }}>
                    Fork: +{selectedUser.portfolio.fork}
                  </span>
                  <span style={{ padding: '0.15rem 0.45rem', border: '1px solid var(--theme-border)', borderRadius: 'var(--radius-sm)', color: selectedUser.portfolio.commits > 0 ? 'var(--color-success)' : 'var(--color-text-subtle)' }}>
                    Commits (3+): +{selectedUser.portfolio.commits}
                  </span>
                  <span style={{ padding: '0.15rem 0.45rem', border: '1px solid var(--theme-border)', borderRadius: 'var(--radius-sm)', color: selectedUser.portfolio.live > 0 ? 'var(--color-success)' : 'var(--color-text-subtle)' }}>
                    Live Site: +{selectedUser.portfolio.live}
                  </span>
                  <span style={{ padding: '0.15rem 0.45rem', border: '1px solid var(--theme-border)', borderRadius: 'var(--radius-sm)', color: selectedUser.portfolio.showcase > 0 ? 'var(--color-success)' : 'var(--color-text-subtle)' }}>
                    Showcase PR: +{selectedUser.portfolio.showcase}
                  </span>
                  {selectedUser.portfolio.rubric !== null && (
                    <span style={{ padding: '0.15rem 0.45rem', border: '1px solid rgba(255, 209, 102, 0.35)', borderRadius: 'var(--radius-sm)', color: '#FFD166', background: 'rgba(255, 209, 102, 0.08)' }}>
                      Rubric Avg: +{selectedUser.portfolio.rubric}/20
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* PR breakdown */}
            <div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '0.6rem', textTransform: 'uppercase' }}>
                Scored Pull Requests ({selectedUser.projects?.prs?.length || 0})
              </div>
              {(!selectedUser.projects?.prs || selectedUser.projects.prs.length === 0) ? (
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>No pull requests scored yet.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {selectedUser.projects.prs.map((pr, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '0.8rem 0.9rem',
                        border: '1px solid var(--theme-border)',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(255, 255, 255, 0.02)',
                        fontSize: '0.8rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.4rem'
                      }}
                    >
                      {/* Top: Repo #Number and Total Points */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <div>
                          <a
                            href={pr.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'var(--color-white)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}
                          >
                            <span>{pr.repo} #{pr.number}</span>
                            <ExternalLink size={12} color="var(--color-text-muted)" />
                          </a>
                          {pr.title && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.15rem', lineHeight: 1.3 }}>
                              {pr.title}
                            </div>
                          )}
                        </div>
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            flexShrink: 0,
                            color: pr.capped ? 'var(--color-warning)' : 'var(--theme-primary)'
                          }}
                        >
                          {pr.capped ? '0 pts (Capped)' : `+${pr.points} pts`}
                        </span>
                      </div>

                      {/* Middle: Point Breakdown Badges */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.15rem' }}>
                        {/* Base level */}
                        <span
                          style={{
                            fontSize: '0.72rem',
                            padding: '0.15rem 0.45rem',
                            borderRadius: 'var(--radius-sm)',
                            background: pr.level === 'hard' ? 'rgba(239, 71, 111, 0.15)' : pr.level === 'medium' ? 'rgba(17, 138, 178, 0.18)' : 'rgba(6, 214, 160, 0.15)',
                            color: pr.level === 'hard' ? '#EF476F' : pr.level === 'medium' ? '#118AB2' : 'var(--color-success)',
                            border: `1px solid ${pr.level === 'hard' ? 'rgba(239, 71, 111, 0.35)' : pr.level === 'medium' ? 'rgba(17, 138, 178, 0.35)' : 'rgba(6, 214, 160, 0.35)'}`,
                            fontWeight: 600,
                            textTransform: 'capitalize'
                          }}
                        >
                          Level: {pr.level} (+{pr.base || 0} pts)
                        </span>

                        {/* Early / Week 1 bonus */}
                        {pr.firstWeek > 0 && (
                          <span
                            style={{
                              fontSize: '0.72rem',
                              padding: '0.15rem 0.45rem',
                              borderRadius: 'var(--radius-sm)',
                              background: 'rgba(0, 245, 212, 0.12)',
                              color: 'var(--theme-primary)',
                              border: '1px solid rgba(0, 245, 212, 0.35)',
                              fontWeight: 600
                            }}
                          >
                            ⚡ Early Bonus (+{pr.firstWeek} pts)
                          </span>
                        )}

                        {/* Quality: excellent bonus */}
                        {pr.quality > 0 && (
                          <span
                            style={{
                              fontSize: '0.72rem',
                              padding: '0.15rem 0.45rem',
                              borderRadius: 'var(--radius-sm)',
                              background: 'rgba(255, 209, 102, 0.15)',
                              color: '#FFD166',
                              border: '1px solid rgba(255, 209, 102, 0.35)',
                              fontWeight: 600
                            }}
                          >
                            ★ Quality: Excellent (+{pr.quality} pts)
                          </span>
                        )}

                        {/* Capped warning */}
                        {pr.capped && (
                          <span
                            style={{
                              fontSize: '0.72rem',
                              padding: '0.15rem 0.45rem',
                              borderRadius: 'var(--radius-sm)',
                              background: 'rgba(255, 183, 3, 0.12)',
                              color: 'var(--color-warning)',
                              border: '1px solid rgba(255, 183, 3, 0.35)',
                              fontWeight: 600
                            }}
                          >
                            ⚠️ Capped (max 5 PRs per repo)
                          </span>
                        )}
                      </div>

                      {/* Bottom: Timestamps */}
                      <div style={{ color: 'var(--color-text-subtle)', fontSize: '0.72rem', display: 'flex', gap: '0.7rem', marginTop: '0.1rem' }}>
                        <span>Opened: {pr.opened}</span>
                        <span>•</span>
                        <span>Merged: {pr.merged}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
