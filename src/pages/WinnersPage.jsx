import React, { useState } from 'react';
import { useWinnersData } from '../hooks/useExtraData';
import { ExternalLink, Trophy, Award } from 'lucide-react';

export default function WinnersPage() {
  const { data, loading } = useWinnersData();
  const [activeTab, setActiveTab] = useState('october');

  const tabLabels = {
    october: 'October (Portfolio)',
    november: 'November',
    december: 'Christmas Eve (December)',
    overall: 'Overall'
  };

  const currentWinners = data ? data[activeTab] || [] : [];

  const getRankStyle = (rank) => {
    switch (rank) {
      case 1:
        return {
          border: '1px solid rgba(255, 209, 102, 0.45)',
          background: 'linear-gradient(180deg, rgba(255, 209, 102, 0.08) 0%, rgba(13, 17, 23, 0.85) 100%)',
          badgeBg: 'rgba(255, 209, 102, 0.15)',
          badgeColor: '#FFD166',
          icon: <Trophy size={16} color="#FFD166" />,
          title: '1st Place • Winner'
        };
      case 2:
        return {
          border: '1px solid rgba(192, 192, 192, 0.4)',
          background: 'linear-gradient(180deg, rgba(192, 192, 192, 0.07) 0%, rgba(13, 17, 23, 0.85) 100%)',
          badgeBg: 'rgba(192, 192, 192, 0.15)',
          badgeColor: '#E0E0E0',
          icon: <Award size={16} color="#E0E0E0" />,
          title: '2nd Place • Runner-up'
        };
      case 3:
        return {
          border: '1px solid rgba(205, 127, 50, 0.4)',
          background: 'linear-gradient(180deg, rgba(205, 127, 50, 0.07) 0%, rgba(13, 17, 23, 0.85) 100%)',
          badgeBg: 'rgba(205, 127, 50, 0.15)',
          badgeColor: '#CD7F32',
          icon: <Award size={16} color="#CD7F32" />,
          title: '3rd Place • 2nd Runner-up'
        };
      default:
        return {
          border: '1px solid var(--theme-border)',
          background: 'var(--theme-card-bg)',
          badgeBg: 'rgba(255, 255, 255, 0.06)',
          badgeColor: 'var(--color-text-muted)',
          icon: <Award size={16} color="var(--color-text-muted)" />,
          title: `Rank #${rank}`
        };
    }
  };

  return (
    <div className="section-spacing" style={{ position: 'relative', zIndex: 1 }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Winners</h1>
          <p style={{ maxWidth: '640px', fontSize: '0.95rem' }}>
            Sprint and overall champions for FOSSSoC-S1. Recognized for technical excellence, consistency, and open source impact.
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {Object.entries(tabLabels).map(([key, label]) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid ' + (isActive ? 'var(--theme-primary)' : 'var(--theme-border)'),
                  background: isActive ? 'var(--theme-primary)' : 'transparent',
                  color: isActive ? '#000000' : 'var(--color-text-muted)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  fontWeight: isActive ? 600 : 400
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Loading winners...
          </div>
        ) : currentWinners.length === 0 ? (
          /* Empty 'To be announced' state */
          <div
            style={{
              padding: '3.5rem 2rem',
              border: '1px solid var(--theme-border)',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--theme-card-bg)',
              textAlign: 'center',
              fontFamily: 'var(--font-mono)'
            }}
          >
            <div style={{ fontSize: '1.1rem', color: 'var(--color-white)', marginBottom: '0.3rem', fontWeight: 600 }}>
              To be announced
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Winners for {tabLabels[activeTab]} will be announced after judging concludes.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.25rem'
            }}
          >
            {currentWinners.map((w, idx) => {
              const rank = w.rank || idx + 1;
              const style = getRankStyle(rank);

              return (
                <div
                  key={w.user || idx}
                  style={{
                    padding: '1.5rem',
                    border: style.border,
                    borderRadius: 'var(--radius-sm)',
                    background: style.background,
                    fontFamily: 'var(--font-mono)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: rank === 1 ? '0 8px 24px rgba(0, 0, 0, 0.4)' : 'none',
                    transition: 'transform 0.2s ease, border-color 0.2s ease'
                  }}
                >
                  <div>
                    {/* Badge & Rank */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          padding: '0.25rem 0.65rem',
                          borderRadius: 'var(--radius-sm)',
                          background: style.badgeBg,
                          color: style.badgeColor,
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em'
                        }}
                      >
                        {style.icon}
                        <span>{style.title}</span>
                      </span>

                      <span
                        style={{
                          fontSize: '1.1rem',
                          fontWeight: 800,
                          color: style.badgeColor
                        }}
                      >
                        {w.points} pts
                      </span>
                    </div>

                    {/* Contributor Profile */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
                      <img
                        src={`https://github.com/${w.user}.png?size=96`}
                        alt={w.user}
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '4px',
                          objectFit: 'cover',
                          border: `1px solid ${style.badgeColor}`
                        }}
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                      <div>
                        <div style={{ color: 'var(--color-white)', fontWeight: 700, fontSize: '1.1rem', lineHeight: 1.2 }}>
                          {w.name}
                        </div>
                        <a
                          href={`https://github.com/${w.user}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: '0.82rem',
                            color: 'var(--theme-primary)',
                            textDecoration: 'none',
                            display: 'inline-block',
                            marginTop: '0.2rem'
                          }}
                        >
                          @{w.user}
                        </a>
                      </div>
                    </div>

                    {/* Metadata */}
                    {(w.college || w.department || w.year) && (
                      <div
                        style={{
                          fontSize: '0.76rem',
                          color: 'var(--color-text-subtle)',
                          marginBottom: '1rem',
                          paddingTop: '0.6rem',
                          borderTop: '1px solid rgba(255, 255, 255, 0.05)'
                        }}
                      >
                        {[w.college, w.department, w.year ? `Y${w.year}` : null].filter(Boolean).join(' • ')}
                      </div>
                    )}
                  </div>

                  {/* Actions / Links */}
                  {w.site && (
                    <div style={{ marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <a
                        href={w.site}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          fontSize: '0.8rem',
                          color: 'var(--theme-primary)',
                          textDecoration: 'none',
                          padding: '0.4rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--theme-border)',
                          background: 'rgba(0, 0, 0, 0.3)',
                          transition: 'background 0.2s ease'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0, 245, 212, 0.1)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)'; }}
                      >
                        <span>View Portfolio</span>
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
