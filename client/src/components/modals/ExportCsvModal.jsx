import React from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../common/Icon.jsx';
import { CLUB_DEPARTMENTS } from '../../data/constants.js';
import { studyYearLabel } from '../../utils/dateUtils.js';

export function ExportCsvModal({
  exportModalOpen,
  setExportModalOpen,
  exportTarget,
  setExportTarget,
  filteredSubmissions = [],
  filteredNotAttempted = [],
  exportStudyYear,
  setExportStudyYear,
  exportDepartment,
  setExportDepartment,
  matchingExportCount,
  executeExportCsv,
}) {
  if (!exportModalOpen) return null;

  return createPortal(
    <div
      className="modal-scrim"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setExportModalOpen(false);
      }}
    >
      <section className="auth-modal export-csv-modal" role="dialog" aria-modal="true" aria-labelledby="export-csv-modal-title">
        <button className="modal-close" onClick={() => setExportModalOpen(false)} aria-label="Close">
          ×
        </button>
        <div className="eyebrow">
          <span className="eyebrow-line" />
          MODERATION · EXPORT REPORT
        </div>
        <h2 id="export-csv-modal-title">
          Export Submissions as .CSV<span>.</span>
        </h2>
        <p className="auth-lede">
          Export today's question activity to a spreadsheet. Choose who to export, filter by year of study or department, and download clean data (LeetCode IDs are removed).
        </p>

        <div className="export-modal-content">
          <div className="export-field-group">
            <label className="export-field-label">SELECT AUDIENCE TO EXPORT</label>
            <div className="export-radio-cards" role="radiogroup" aria-label="Export audience">
              <label className={`export-radio-card ${exportTarget === 'attempted' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="exportTarget"
                  value="attempted"
                  checked={exportTarget === 'attempted'}
                  onChange={(e) => setExportTarget(e.target.value)}
                />
                <div className="export-radio-info">
                  <strong>Attempted today's question</strong>
                  <span>Members who submitted a solution ({filteredSubmissions.length})</span>
                </div>
              </label>

              <label className={`export-radio-card ${exportTarget === 'not_attempted' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="exportTarget"
                  value="not_attempted"
                  checked={exportTarget === 'not_attempted'}
                  onChange={(e) => setExportTarget(e.target.value)}
                />
                <div className="export-radio-info">
                  <strong>Not attempted today's question</strong>
                  <span>Approved members who haven't submitted today ({filteredNotAttempted.length})</span>
                </div>
              </label>

              <label className={`export-radio-card ${exportTarget === 'all' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="exportTarget"
                  value="all"
                  checked={exportTarget === 'all'}
                  onChange={(e) => setExportTarget(e.target.value)}
                />
                <div className="export-radio-info">
                  <strong>All club members</strong>
                  <span>
                    {exportStudyYear === 'all'
                      ? 'All club members'
                      : `All ${studyYearLabel(exportStudyYear).toLowerCase()} members`}{' '}
                    ({filteredSubmissions.length + filteredNotAttempted.length})
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div className="export-filters-grid">
            <label className="export-select-field">
              <span>FILTER BY YEAR OF STUDY</span>
              <select value={exportStudyYear} onChange={(e) => setExportStudyYear(e.target.value)}>
                <option value="all">All years</option>
                <option value="second-year">Second year</option>
                <option value="first-year">First year</option>
                <option value="third-year">Third year</option>
                <option value="fourth-year">Fourth year</option>
                <option value="passed">Passed out</option>
              </select>
            </label>

            <label className="export-select-field">
              <span>FILTER BY CLUB DEPARTMENT</span>
              <select value={exportDepartment} onChange={(e) => setExportDepartment(e.target.value)}>
                <option value="all">All departments</option>
                {CLUB_DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="export-summary-box">
            <div className="export-summary-main">
              <Icon name="download" size={16} />
              <div>
                <strong>
                  {matchingExportCount} member{matchingExportCount === 1 ? '' : 's'} selected
                </strong>
                <p>
                  {matchingExportCount === 0
                    ? 'No members match the current filter selection.'
                    : `Will export ${exportTarget === 'not_attempted' ? 'unattempted' : exportTarget === 'attempted' ? 'attempted' : 'all'} ${exportStudyYear === 'all' ? 'club' : studyYearLabel(exportStudyYear).toLowerCase()} members${exportDepartment !== 'all' ? ` (${exportDepartment})` : ''}. LeetCode IDs are excluded.`}
                </p>
              </div>
            </div>
          </div>

          <div className="export-modal-actions">
            <button
              type="button"
              className="button button-quiet"
              onClick={() => setExportModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="button button-green"
              onClick={executeExportCsv}
              disabled={matchingExportCount === 0}
            >
              <Icon name="download" size={14} /> <span>Download .CSV ({matchingExportCount})</span>
            </button>
          </div>
        </div>
      </section>
    </div>,
    document.body
  );
}

