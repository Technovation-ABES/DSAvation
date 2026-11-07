import React from 'react';
import { Icon as IconifyIcon } from '@iconify/react';
import { Icon } from '../common/Icon.jsx';
import { Pill } from '../common/Pill.jsx';
import { MemberAvatar } from '../common/MemberAvatar.jsx';
import { useAdaptiveCardTheme } from '../../hooks/useAdaptiveCardTheme.js';
import { studyYearLabel } from '../../utils/dateUtils.js';

export const MemberDirectoryCard = React.memo(function MemberDirectoryCard({
  member,
  isAdmin,
  lookup,
  stats,
  maxActivity,
  isSectionVisible,
  canSeeLeetcode,
  leetcodeStatsBusy,
  onAdminSelect,
  onOpenStats,
  onLoadStats,
}) {
  const cardTheme = useAdaptiveCardTheme(member.cardBgUrl);

  return (
    <article
      className={`panel member-directory-card ${member.cardBgUrl ? 'has-custom-bg' : ''} ${isAdmin ? 'admin-manageable-card' : ''} water-glass-card`}
      data-card-theme={member.cardBgUrl ? cardTheme.theme : undefined}
      style={member.cardBgUrl ? cardTheme.cssVariables : undefined}
      onClick={(e) => {
        if (isAdmin && !e.target.closest('a, button, input, select')) {
          onAdminSelect(member);
        }
      }}
    >
      {member.cardBgUrl && (
        <>
          <div
            className="member-card-bg-layer"
            style={{ backgroundImage: `url(${JSON.stringify(member.cardBgUrl)})` }}
            aria-hidden="true"
          />
          <div className="member-card-overlay-layer" aria-hidden="true" />
        </>
      )}
      <div className="member-card-content-layer">
        <header className="directory-card-header">
          <MemberAvatar person={member} className="directory-avatar" label="" />
          <div className="directory-card-identity">
            <h2>
              <span className="directory-name-text">{member.name}</span>
              {member.role === 'admin' && (
                <span className="directory-admin-pill-group">
                  <Pill tone="green">{member.role === 'lead' ? 'Club lead' : member.role}</Pill>
                  <span className="admin-verified-badge" title="Administrator">
                    <IconifyIcon icon="codicon:verified" width={18} height={18} />
                  </span>
                </span>
              )}
            </h2>
            <p>
              {member.department} · {studyYearLabel(member.studyYear)} ·{' '}
              <span className="member-points-chip" title="Total club points">
                <IconifyIcon icon="iconoven:achievement" width={13} height={13} /> {member.points ?? 0} pts
              </span>{' '}
              <span className="member-points-chip member-aura-chip" title="Total Blaze points">
                <IconifyIcon icon="at-icons:fire" width={13} height={13} /> {member.blaze ?? member.aura ?? 0}
              </span>
            </p>
          </div>
        </header>

        <div className="directory-socials">
          {member.githubUsername ? (
            <a href={`https://github.com/${encodeURIComponent(member.githubUsername)}`} target="_blank" rel="noreferrer">
              <Icon name="github" size={14} />@{member.githubUsername}
              <Icon name="external" size={12} />
            </a>
          ) : (
            <span>GitHub not linked</span>
          )}
          {canSeeLeetcode && (
            member.leetcodeUsername ? (
              <div className="directory-leetcode-row">
                <a href={`https://leetcode.com/${encodeURIComponent(member.leetcodeUsername)}/`} target="_blank" rel="noreferrer">
                  <Icon name="leetcode" size={14} />@{member.leetcodeUsername}
                  <Icon name="external" size={12} />
                </a>
                <button
                  className="text-button leetcode-inline-load-btn"
                  type="button"
                  disabled={leetcodeStatsBusy === member.id}
                  onClick={() => {
                    onOpenStats(member.id);
                    onLoadStats(member);
                  }}
                >
                  {leetcodeStatsBusy === member.id ? 'Fetching…' : stats ? 'Refresh stats' : lookup ? 'Try again' : 'Load stats'}{' '}
                  <Icon name="arrow" size={12} />
                </button>
              </div>
            ) : (
              <span>LeetCode ID not added</span>
            )
          )}
        </div>

        {isSectionVisible && (
          <section className="directory-leetcode" aria-label={`LeetCode statistics for ${member.name}`}>
            <div className="directory-leetcode-heading">
              <strong>LeetCode progress</strong>
              {stats && (
                <span>
                  Updated{' '}
                  {new Date(stats.fetchedAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    timeZone: 'Asia/Kolkata',
                  })}
                </span>
              )}
            </div>
            {lookup?.available && stats ? (
              <>
                <div className="leetcode-counts">
                  <span>
                    <strong>{stats.attemptedCount ?? '—'}</strong> attempted
                  </span>
                  <span>
                    <strong>{stats.solvedCount}</strong> solved
                  </span>
                </div>
                <div className="leetcode-bars">
                  {stats.byDifficulty.map((item) => (
                    <div className="leetcode-bar-row" key={item.difficulty}>
                      <span>{item.difficulty}</span>
                      <i>
                        <b style={{ width: `${Math.max(2, Math.round(((item.attempted ?? item.solved) / maxActivity) * 100))}%` }} />
                      </i>
                      <strong>{item.attempted ?? item.solved}</strong>
                    </div>
                  ))}
                </div>
                {lookup.stale && <small className="leetcode-unavailable">{lookup.reason}</small>}
              </>
            ) : lookup?.reason ? (
              <div className="leetcode-empty">
                <span>{lookup.reason}</span>
              </div>
            ) : (
              <div className="leetcode-empty">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <IconifyIcon icon="charm:refresh" width={14} height={14} className="spin-icon" />
                  Loading LeetCode stats…
                </span>
              </div>
            )}
          </section>
        )}
      </div>
    </article>
  );
});

