import React from 'react';
import { createPortal } from 'react-dom';
import { Icon as IconifyIcon } from '@iconify/react';
import { Icon } from '../common/Icon.jsx';
import { MemberAvatar } from '../common/MemberAvatar.jsx';
import { studyYearLabel } from '../../utils/dateUtils.js';

export function HeatmapDayModal({
  heatmapDayModal,
  closeHeatmapDayModal,
  heatmapSecondYearOnly,
  navigateHeatmapDay,
  isHeatmapPrevDisabled,
  isHeatmapNextDisabled,
  heatmapDayBusy,
  heatmapDatePickerRef,
  MIN_HEATMAP_DATE,
  todayDateKey,
  openHeatmapDay,
  heatmapDayData,
}) {
  if (!heatmapDayModal) return null;

  return createPortal(
    <div
      className="member-admin-overlay-backdrop"
      onClick={closeHeatmapDayModal}
      role="dialog"
      aria-modal="true"
      aria-label={`Submissions on ${heatmapDayModal.date}`}
    >
      <div
        className="member-admin-overlay-card heatmap-day-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="member-admin-overlay-header heatmap-day-modal-header">
          <div className="heatmap-day-header-info">
            <div className="eyebrow">
              <span className="eyebrow-line" />
              SUBMISSION DETAIL{heatmapSecondYearOnly ? ' (2ND YEAR)' : ''}
            </div>
            <div className="heatmap-day-nav-bar">
              <button
                type="button"
                className="heatmap-nav-arrow-btn"
                onClick={() => navigateHeatmapDay(-1)}
                disabled={isHeatmapPrevDisabled || heatmapDayBusy}
                title={isHeatmapPrevDisabled ? 'Cannot navigate before 1 November 2026' : 'Previous day'}
                aria-label="Previous day"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>

              <div className="heatmap-day-date-picker-wrap">
                <button
                  type="button"
                  className="heatmap-day-date-trigger"
                  onClick={() => heatmapDatePickerRef.current?.showPicker?.() || heatmapDatePickerRef.current?.focus?.()}
                  title="Click to choose a date from calendar (from 1 Nov onwards)"
                  aria-label="Select date"
                >
                  <Icon name="calendar" size={17} />
                  <span className="heatmap-day-date-text">
                    {new Date(`${heatmapDayModal.date}T00:00:00.000Z`).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      timeZone: 'UTC',
                    })}
                  </span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="heatmap-day-cal-chevron">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                <input
                  ref={heatmapDatePickerRef}
                  type="date"
                  min={MIN_HEATMAP_DATE}
                  max={todayDateKey}
                  value={heatmapDayModal.date}
                  onChange={(e) => {
                    if (e.target.value) {
                      let d = e.target.value;
                      if (d < MIN_HEATMAP_DATE) d = MIN_HEATMAP_DATE;
                      if (d > todayDateKey) d = todayDateKey;
                      openHeatmapDay(d);
                    }
                  }}
                  className="heatmap-day-native-date-input"
                  aria-label="Select date from calendar"
                />
              </div>

              <button
                type="button"
                className="heatmap-nav-arrow-btn"
                onClick={() => navigateHeatmapDay(1)}
                disabled={isHeatmapNextDisabled || heatmapDayBusy}
                title={isHeatmapNextDisabled ? 'Cannot navigate to future dates' : 'Next day'}
                aria-label="Next day"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
            {!heatmapDayBusy && heatmapDayData && (
              <p className="heatmap-day-modal-subtitle">
                <strong>{heatmapDayData.count ?? 0}</strong> submitted
                {heatmapDayData.notSubmittedCount != null && (
                  <> · <strong>{heatmapDayData.notSubmittedCount}</strong> not submitted</>
                )}
              </p>
            )}
          </div>
          <button type="button" className="modal-close" onClick={closeHeatmapDayModal} aria-label="Close">
            ×
          </button>
        </div>
        <div className="heatmap-day-modal-body">
          {heatmapDayBusy ? (
            <div className="heatmap-day-modal-loading">
              <IconifyIcon icon="charm:refresh" width={18} height={18} className="spin-icon" />
              <span>Loading submissions…</span>
            </div>
          ) : heatmapDayData?.error ? (
            <p className="heatmap-day-modal-error">{heatmapDayData.error}</p>
          ) : (
            <div className="heatmap-day-sections">
              {/* Submitted Section */}
              <div className="heatmap-day-section">
                <div className="heatmap-day-section-header">
                  <span className="heatmap-day-section-title">
                    <span className="section-dot dot-submitted" />
                    SUBMITTED
                  </span>
                  <span className="heatmap-day-count-pill pill-submitted">
                    {heatmapDayData?.submissions?.length || 0}
                  </span>
                </div>
                {heatmapDayData?.submissions?.length ? (
                  <ul className="heatmap-day-submitters-list">
                    {heatmapDayData.submissions.map((sub, i) => {
                      const isLc = sub.isLeetCode || sub.submissionMethod === 'leetcode' || (!sub.commitUrl && sub.leetcodeUsername);
                      const profileUrl = sub.profileUrl || (sub.leetcodeUsername ? `https://leetcode.com/u/${encodeURIComponent(sub.leetcodeUsername)}/` : null);
                      return (
                        <li key={`sub-${sub.userId}-${i}`} className="heatmap-day-submitter-row">
                          <MemberAvatar person={sub} className="heatmap-day-submitter-avatar" label={sub.name} />
                          <div className="heatmap-day-submitter-info">
                            <strong>{sub.name}</strong>
                            <span>{sub.department}{sub.studyYear ? ` · ${studyYearLabel(sub.studyYear)}` : ''}</span>
                            {sub.questionId && <span className="heatmap-day-submitter-lc">LC #{sub.questionId}</span>}
                          </div>
                          <div className="heatmap-day-submitter-actions">
                            {isLc && profileUrl ? (
                              <a
                                href={profileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="heatmap-day-action-badge leetcode-action"
                                title={`View ${sub.name} on LeetCode`}
                              >
                                <Icon name="leetcode" size={13} />
                                <span>LeetCode</span>
                                <Icon name="external" size={11} />
                              </a>
                            ) : sub.commitUrl ? (
                              <a
                                href={sub.commitUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="heatmap-day-action-badge commit-action"
                                title={`Open verified commit for ${sub.name}`}
                              >
                                <Icon name="github" size={13} />
                                <span>Verified commit</span>
                                <Icon name="external" size={11} />
                              </a>
                            ) : (
                              <span className="heatmap-day-submitted-chip">Submitted</span>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="heatmap-day-empty-sub">No accepted submissions on this date.</p>
                )}
              </div>

              {/* Not Submitted Section */}
              <div className="heatmap-day-section">
                <div className="heatmap-day-section-header">
                  <span className="heatmap-day-section-title">
                    <span className="section-dot dot-not-submitted" />
                    NOT SUBMITTED
                  </span>
                  <span className="heatmap-day-count-pill pill-not-submitted">
                    {heatmapDayData?.notSubmitted?.length || 0}
                  </span>
                </div>
                {heatmapDayData?.notSubmitted?.length ? (
                  <ul className="heatmap-day-submitters-list">
                    {heatmapDayData.notSubmitted.map((member, i) => (
                      <li key={`unsub-${member.userId}-${i}`} className="heatmap-day-submitter-row not-submitted-row">
                        <MemberAvatar person={member} className="heatmap-day-submitter-avatar" label={member.name} />
                        <div className="heatmap-day-submitter-info">
                          <strong>{member.name}</strong>
                          <span>{member.department}{member.studyYear ? ` · ${studyYearLabel(member.studyYear)}` : ''}</span>
                        </div>
                        <span className="heatmap-day-not-submitted-chip">Not submitted</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="heatmap-day-empty-sub">All active members submitted on this date!</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

