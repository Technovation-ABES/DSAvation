import React, { useState, useMemo } from 'react';
import { localDay, shiftDay } from '../../utils/dateUtils.js';

export const ProgressHeatmap = React.memo(function ProgressHeatmap({ progress }) {
  const [selectedMonthKey, setSelectedMonthKey] = useState(null);

  const {
    monthsData,
    activeDays,
    activeQuestions,
    currentStreak,
    longestStreak,
  } = useMemo(() => {
    const counts = new Map();
    for (const solvedAt of Object.values(progress || {})) {
      const dateKey = new Intl.DateTimeFormat('sv-SE', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(new Date(solvedAt));
      counts.set(dateKey, (counts.get(dateKey) || 0) + 1);
    }

    const today = localDay();
    const todayDate = new Date(`${today}T00:00:00.000Z`);
    const currentYear = todayDate.getUTCFullYear();
    const currentMonth = todayDate.getUTCMonth();

    // 1. Calculate 12 Months Breakdown
    const mList = [];
    let totalActiveDays = 0;
    let totalQuestionsSolved = 0;

    for (let i = 11; i >= 0; i--) {
      const mDate = new Date(Date.UTC(currentYear, currentMonth - i, 1));
      const year = mDate.getUTCFullYear();
      const monthIndex = mDate.getUTCMonth();
      const monthKey = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
      const monthName = mDate.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' });
      const shortMonth = mDate.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' });
      const numDays = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
      const firstDayOfWeek = new Date(Date.UTC(year, monthIndex, 1)).getUTCDay(); // 0=Sun, 1=Mon, ..., 6=Sat

      const days = [];
      let totalSolved = 0;
      let monthActiveDays = 0;

      for (let day = 1; day <= numDays; day++) {
        const dateKey = `${monthKey}-${String(day).padStart(2, '0')}`;
        const inRange = dateKey <= today;
        const count = inRange ? (counts.get(dateKey) || 0) : 0;
        if (count > 0) {
          totalSolved += count;
          monthActiveDays += 1;
        }
        const level = count === 0 ? 0 : count === 1 ? 1 : count === 2 ? 2 : count <= 4 ? 3 : 4;
        days.push({
          date: dateKey,
          day,
          dayOfWeek: (firstDayOfWeek + day - 1) % 7,
          count,
          level,
          inRange,
        });
      }

      totalActiveDays += monthActiveDays;
      totalQuestionsSolved += totalSolved;

      mList.push({
        monthKey,
        monthName,
        shortMonth,
        year,
        firstDayOfWeek,
        numDays,
        days,
        totalSolved,
        activeDays: monthActiveDays,
      });
    }

    // 2. Calculate Streaks
    let curStreak = 0;
    let checkDate = today;
    if (!counts.has(checkDate) || counts.get(checkDate) === 0) {
      checkDate = shiftDay(today, -1);
    }
    while (counts.has(checkDate) && counts.get(checkDate) > 0) {
      curStreak++;
      checkDate = shiftDay(checkDate, -1);
    }

    let maxStreak = 0;
    let tempStreak = 0;
    for (let i = 365; i >= 0; i--) {
      const d = shiftDay(today, -i);
      if ((counts.get(d) || 0) > 0) {
        tempStreak++;
        if (tempStreak > maxStreak) maxStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    }

    return {
      monthsData: mList,
      activeDays: totalActiveDays,
      activeQuestions: totalQuestionsSolved,
      currentStreak: curStreak,
      longestStreak: maxStreak,
    };
  }, [progress]);

  // Active month: defaults to the latest month
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

  const handlePrevMonth = () => {
    if (activeMonthIndex > 0) {
      setSelectedMonthKey(monthsData[activeMonthIndex - 1].monthKey);
    }
  };

  const handleNextMonth = () => {
    if (activeMonthIndex < monthsData.length - 1) {
      setSelectedMonthKey(monthsData[activeMonthIndex + 1].monthKey);
    }
  };

  return (
    <section className="panel heatmap-panel" aria-labelledby="progress-heatmap-title">
      <div className="panel-heading heatmap-header">
        <div>
          <div className="eyebrow"><span className="eyebrow-line" />YOUR CLUB ACTIVITY</div>
          <h2 id="progress-heatmap-title">Question activity</h2>
        </div>
      </div>

      <p className="heatmap-caption">
        Each square counts Club Challenge questions you submitted that day. Personal checkmarks stay out of this record.
      </p>

      {/* Quick Month Selector Tabs - Justified Center */}
      {activeMonth && (
        <div className="heatmap-month-selector" role="tablist" aria-label="Select month">
          {monthsData.map((m) => (
            <button
              key={m.monthKey}
              type="button"
              className={`month-tab ${activeMonth.monthKey === m.monthKey ? 'active' : ''}`}
              onClick={() => setSelectedMonthKey(m.monthKey)}
              role="tab"
              aria-selected={activeMonth.monthKey === m.monthKey}
            >
              <span>{m.shortMonth}</span>
              {m.totalSolved > 0 && <span className="month-tab-badge">{m.totalSolved}</span>}
            </button>
          ))}
        </div>
      )}

      {/* Practice History 3-column layout: Left Stats, Middle Calendar, Right Stats */}
      <div className="practice-history-layout">
        {/* Left Column: 2 Stat Cards */}
        <div className="practice-stats-col practice-stats-col-left heatmap-stats-strip">
          <div className="heatmap-stat-item">
            <strong>{activeQuestions} <small>/ 220</small></strong>
            <span>Solved · {Math.round(activeQuestions / 220 * 100)}%</span>
          </div>
          <div className="heatmap-stat-item">
            <strong>{activeDays}</strong>
            <span>Active Days</span>
          </div>
        </div>

        {/* Middle Column: Calendar Card & Legend */}
        <div className="practice-calendar-col">
          {activeMonth && (
            <div className="month-detail-card">
              <div className="month-detail-top">
                <div className="month-nav-controls">
                  <button
                    type="button"
                    className="month-nav-btn"
                    disabled={activeMonthIndex <= 0}
                    onClick={handlePrevMonth}
                    aria-label="Previous month"
                    title="Previous month"
                  >
                    ‹
                  </button>
                  <h3>{activeMonth.monthName} {activeMonth.year}</h3>
                  <button
                    type="button"
                    className="month-nav-btn"
                    disabled={activeMonthIndex >= monthsData.length - 1}
                    onClick={handleNextMonth}
                    aria-label="Next month"
                    title="Next month"
                  >
                    ›
                  </button>
                </div>
                <div className="month-detail-totals">
                  <span><strong>{activeMonth.totalSolved}</strong> solved</span>
                  <span><strong>{activeMonth.activeDays}</strong> active days</span>
                </div>
              </div>

              <div className="month-detail-calendar">
                <div className="month-detail-weekdays">
                  <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                </div>
                <div className="month-detail-grid">
                  {Array.from({ length: activeMonth.firstDayOfWeek }).map((_, i) => (
                    <div key={`detail-pad-${i}`} className="month-detail-cell empty" />
                  ))}
                  {activeMonth.days.map((day) => (
                    <div
                      key={day.date}
                      className={`month-detail-cell level-${day.level} ${day.inRange ? '' : 'outside-range'} ${day.count > 0 ? 'has-activity' : ''}`}
                      title={day.count > 0 ? `Submitted on ${day.date}` : day.date}
                    >
                      <span className="day-number">{day.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: 2 Stat Cards */}
        <div className="practice-stats-col practice-stats-col-right heatmap-stats-strip">
          <div className="heatmap-stat-item">
            <strong>{currentStreak} <small>days</small></strong>
            <span>Current Streak</span>
          </div>
          <div className="heatmap-stat-item">
            <strong>{longestStreak} <small>days</small></strong>
            <span>Longest Streak</span>
          </div>
        </div>
      </div>
    </section>
  );
});

