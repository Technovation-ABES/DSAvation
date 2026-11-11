import React from 'react';
import { Icon } from '../common/Icon.jsx';
import { MemberAvatar } from '../common/MemberAvatar.jsx';

export function RepickModal({
  repickModalOpen,
  setRepickModalOpen,
  repickCycle,
  repickMode,
  setRepickMode,
  executeRepick,
  pickExplainerBusy,
  repickSearch,
  setRepickSearch,
  club,
  repickWaivePenalty,
  setRepickWaivePenalty,
  repickLoading,
  repickCandidates,
}) {
  if (!repickModalOpen) return null;

  return (
    <div
      className="modal-scrim"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setRepickModalOpen(false);
      }}
    >
      <section className="auth-modal repick-explainer-modal" role="dialog" aria-modal="true" aria-labelledby="repick-modal-title">
        <button className="modal-close" onClick={() => setRepickModalOpen(false)} aria-label="Close">
          ×
        </button>
        <div className="eyebrow">
          <span className="eyebrow-line" />
          EXPLAINER SELECTION
        </div>
        <h2 id="repick-modal-title">Re-pick Solution Explainer</h2>
        <p className="auth-lede">
          Choose whether to pick randomly from eligible submitters or select a specific 2nd-year member.
        </p>
        {repickCycle && (
          <div className="repick-cycle-summary">
            <span className="cycle-badge">ROUND {repickCycle.cycleNumber}</span>
            <span className="cycle-stat">
              <b>{repickCycle.completedCount}</b> / {repickCycle.totalCohort} completed
            </span>
            <span className="cycle-stat remaining">
              <b>{repickCycle.remainingCount}</b> remaining
            </span>
          </div>
        )}

        <div className="repick-mode-toggle">
          <button
            type="button"
            className={`repick-tab-btn ${repickMode === 'custom' ? 'active' : ''}`}
            onClick={() => setRepickMode('custom')}
          >
            <Icon name="users" size={14} /> Custom Select
          </button>
          <button
            type="button"
            className={`repick-tab-btn ${repickMode === 'random' ? 'active' : ''}`}
            onClick={() => setRepickMode('random')}
          >
            <Icon name="dice" size={14} /> Random Pick
          </button>
        </div>

        {repickMode === 'random' ? (
          <div className="repick-random-box">
            {repickCycle && repickCycle.remainingCount === 0 ? (
              <div className="repick-last-notice">
                <Icon name="info" size={15} />
                <div>
                  <strong>All second-year members have completed Round {repickCycle.cycleNumber}.</strong>
                  <p>
                    Switch to <strong>Custom Select</strong> to choose an emergency volunteer from WhatsApp.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <p>
                  DSAvation will automatically select an explainer at random among eligible 2nd-year members, prioritizing accepted submitters whose turn is pending.
                </p>
                <p className="helper-copy">
                  The current explainer will be replaced and their turn will be restored so they can be picked again in upcoming sessions.
                </p>
              </>
            )}
            <button
              type="button"
              className="button button-green repick-action-btn"
              onClick={() => executeRepick(null)}
              disabled={pickExplainerBusy || (repickCycle && repickCycle.remainingCount === 0)}
            >
              <Icon name="dice" size={15} /> {pickExplainerBusy ? 'Selecting…' : 'Pick Random Explainer'}
            </button>
          </div>
        ) : (
          <div className="repick-custom-box">
            <div className="repick-search-bar">
              <Icon name="search" size={14} />
              <input
                type="text"
                placeholder="Filter 2nd-year students by name or department…"
                value={repickSearch}
                onChange={(e) => setRepickSearch(e.target.value)}
              />
            </div>
            {club?.assignment?.explainer && (
              <label className="repick-waive-label">
                <input
                  type="checkbox"
                  checked={repickWaivePenalty}
                  onChange={(e) => setRepickWaivePenalty(e.target.checked)}
                />
                <span>Waive -50 Blaze penalty (admin correction / swap)</span>
              </label>
            )}

            {repickLoading ? (
              <div className="soft-empty">Loading second-year members…</div>
            ) : (
              <div className="repick-candidates-list">
                {repickCandidates
                  .filter((c) => {
                    if (!repickSearch) return true;
                    const q = repickSearch.toLowerCase();
                    return (c.name || '').toLowerCase().includes(q) || (c.department || '').toLowerCase().includes(q);
                  })
                  .map((student) => {
                    return (
                      <div
                        className={`repick-candidate-row ${student.isCurrentExplainer ? 'is-current' : ''}`}
                        key={student.id}
                      >
                        <MemberAvatar person={student} className="repick-candidate-avatar" label="" />
                        <div className="repick-candidate-info">
                          <div className="repick-candidate-name-row">
                            <strong>{student.name}</strong>
                            {student.turnCompleted ? (
                              <span
                                className="turn-status-badge completed"
                                title={`Turn completed${student.pastDate ? ` on ${student.pastDate}` : ''}`}
                              >
                                <Icon name="check" size={11} /> Turn completed
                              </span>
                            ) : (
                              <span className="turn-status-badge pending">Turn pending</span>
                            )}
                            {student.isCurrentExplainer && (
                              <span className="turn-status-badge current">Current</span>
                            )}
                          </div>
                          <p>
                            {student.department || 'Club Member'} · 2nd Year
                            {student.submittedToday && <span className="submitted-today-pill">✓ Submitted today</span>}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="button button-quiet select-candidate-btn"
                          disabled={pickExplainerBusy || student.isCurrentExplainer}
                          onClick={() => executeRepick(student.id)}
                          title={
                            student.isCurrentExplainer
                              ? 'Currently selected explainer'
                              : `Select ${student.name} as today's solution explainer`
                          }
                        >
                          {student.isCurrentExplainer ? 'Current' : 'Select'}
                        </button>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

