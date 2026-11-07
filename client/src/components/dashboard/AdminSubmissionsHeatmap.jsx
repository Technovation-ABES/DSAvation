import React, { useState, useMemo } from 'react';
import { Icon } from '../common/Icon.jsx';
import { localDay } from '../../utils/dateUtils.js';

export const AdminSubmissionsHeatmap = React.memo(function AdminSubmissionsHeatmap({
  counts = {},
  secondYearOnly = false,
  onDayClick,
  onDownloadMonthCsv,
}) {
  const [selectedMonthKey, setSelectedMonthKey] = useState(null);

  const {
    monthsData,
    totalSubmissions,
    peakDay,
  } = useMemo(() => {
    const today = localDay();
    const todayDate = new Date(`${today}T00:00:00.000Z`);
    const currentYear = todayDate.getUTCFullYear();
    const currentMonth = todayDate.getUTCMonth();

    const mList = [];
    let totalSubs = 0;
    let totalActive = 0;
    let peak = { date: '', count: 0 };

    for (let i = 11; i >= 0; i--) {
      const mDate = new Date(Date.UTC(currentYear, currentMonth - i, 1));
      const year = mDate.getUTCFullYear();
      const monthIndex = mDate.getUTCMonth();
      const monthKey = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
      const monthName = mDate.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' });
      const shortMonth = mDate.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' });
      const numDays = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
      const firstDayOfWeek = new Date(Date.UTC(year, monthIndex, 1)).getUTCDay();

      const days = [];
      let monthTotal = 0;
      let monthActive = 0;

      for (let day = 1; day <= numDays; day++) {
        const dateKey = `${monthKey}-${String(day).padStart(2, '0')}`;
        const inRange = dateKey <= today;
        const count = inRange ? (counts[dateKey] || 0) : 0;
        if (count > 0) {
          monthTotal += count;
          monthActive += 1;
          if (count > peak.count) peak = { date: dateKey, count };
        }
        const level = count === 0
          ? 0
          : count < 5
            ? 1
            : count < 10
              ? 2
              : count < 15
                ? 3
                : count < 20
                  ? 4
                  : count < 30
                    ? 5
                    : 6;
        days.push({ date: dateKey, day, dayOfWeek: (firstDayOfWeek + day - 1) % 7, count, level, inRange });
      }

      totalSubs += monthTotal;
      totalActive += monthActive;

      mList.push({ monthKey, monthName, shortMonth, year, firstDayOfWeek, numDays, days, totalSolved: monthTotal, activeDays: monthActive });
    }

    return { monthsData: mList, totalSubmissions: totalSubs, activeDays: totalActive, peakDay: peak };
  }, [counts]);

  const activeMonth = useMemo(() => {
    if (selectedMonthKey) {
      const found = monthsData.find((m) => m.monthKey === selectedMonthKey);
      if (found) return found;
    }
    return monthsData[monthsData.length - 1] || null;
  }, [selectedMonthKey, monthsData]);

  const activeMonthIndex = useMemo(() => {
    if (!activeMonth) return 0;
    const idx = monthsData.findIndex((m) => m.monthKey === activeMonth.monthKey);
    return idx >= 0 ? idx : monthsData.length - 1;
  }, [activeMonth, monthsData]);

  const handlePrevMonth = () => { if (activeMonthIndex > 0) setSelectedMonthKey(monthsData[activeMonthIndex - 1].monthKey); };
  const handleNextMonth = () => { if (activeMonthIndex < monthsData.length - 1) setSelectedMonthKey(monthsData[activeMonthIndex + 1].monthKey); };

  return (
    <div className="admin-heatmap-wrapper">
      <div className="heatmap-month-selector" role="tablist" aria-label="Select month">
        {monthsData.map((m) => (
          <div key={m.monthKey} className="month-tab-container">
            <button
              type="button"
              className={`month-tab ${activeMonth?.monthKey === m.monthKey ? 'active' : ''}`}
              onClick={() => setSelectedMonthKey(m.monthKey)}
              role="tab"
              aria-selected={activeMonth?.monthKey === m.monthKey}
            >
              <span>{m.shortMonth}</span>
              {m.totalSolved > 0 && <span className="month-tab-badge">{m.totalSolved}</span>}
            </button>
            <div className="month-tab-flyout">
              <button
                type="button"
                className="month-flyout-csv-btn primary"
                onClick={(e) => {
                  e.stopPropagation();
                  onDownloadMonthCsv?.(m.monthKey, m.shortMonth, 'xlsx');
                }}
                title={`Download ${m.shortMonth} ${m.year} Excel (.xlsx) with colored cells`}
              >
                <Icon name="download" size={12} />
                <span>Excel (.xlsx)</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="admin-heatmap-calendar-wrap">
        <div className="practice-calendar-col">
          {activeMonth && (
            <div className="month-detail-card">
              <div className="month-detail-top">
                <div className="month-nav-controls">
                  <button type="button" className="month-nav-btn" disabled={activeMonthIndex <= 0} onClick={handlePrevMonth} aria-label="Previous month" title="Previous month">‹</button>
                  <h3>{activeMonth.monthName} {activeMonth.year}</h3>
                  <button type="button" className="month-nav-btn" disabled={activeMonthIndex >= monthsData.length - 1} onClick={handleNextMonth} aria-label="Next month" title="Next month">›</button>
                </div>
                <div className="month-detail-totals">
                  <span><strong>{activeMonth.totalSolved}</strong> submissions</span>
                </div>
              </div>
              <div className="month-detail-calendar">
                <div className="month-detail-weekdays">
                  <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                </div>
                <div className="month-detail-grid">
                  {Array.from({ length: activeMonth.firstDayOfWeek }).map((_, i) => (
                    <div key={`admin-pad-${i}`} className="month-detail-cell empty" />
                  ))}
                  {activeMonth.days.map((day) => (
                    <div
                      key={day.date}
                      className={`month-detail-cell level-${day.level} ${day.inRange ? '' : 'outside-range'} ${day.count > 0 ? 'has-activity' : ''} ${day.count > 0 && onDayClick ? 'heatmap-day-clickable' : ''}`}
                      title={day.count > 0 ? `${day.count} ${day.count === 1 ? 'submission' : 'submissions'} on ${day.date} — click to view` : `${day.count} submissions on ${day.date}`}
                      role={day.count > 0 && onDayClick ? 'button' : undefined}
                      tabIndex={day.count > 0 && onDayClick ? 0 : undefined}
                      onClick={day.count > 0 && onDayClick ? () => onDayClick(day.date, day.count) : undefined}
                      onKeyDown={day.count > 0 && onDayClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onDayClick(day.date, day.count); } } : undefined}
                    >
                      <span className="day-number">{day.day}</span>
                      {day.count > 0 && <span className="day-count-badge">{day.count}</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="heatmap-legend">
            <span>Less</span>
            {[0, 1, 2, 3, 4, 5, 6].map((level) => (
              <i
                key={level}
                className={`heatmap-cell level-${level}`}
                title={level === 0 ? '0' : level === 1 ? '1–4' : level === 2 ? '5+' : level === 3 ? '10+' : level === 4 ? '15+' : level === 5 ? '20+' : '30+'}
              />
            ))}
            <span>30+</span>
          </div>
        </div>
      </div>
    </div>
  );
});

