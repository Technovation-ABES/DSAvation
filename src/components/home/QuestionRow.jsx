import React, { useState } from 'react';
import { Icon } from '../common/Icon.jsx';
import { Pill } from '../common/Pill.jsx';

export const QuestionRow = React.memo(function QuestionRow({
  question,
  solved,
  solvedAt,
  onSolve,
  locked = false,
}) {
  const [expanded, setExpanded] = useState(false);
  const handleCardClick = (e) => {
    if (e.target.closest('a') || e.target.closest('button') || e.target.closest('.question-analysis')) return;
    setExpanded((open) => !open);
  };

  return (
    <article
      className={`question-card fish-card ${solved ? 'is-solved' : ''} ${expanded ? 'is-expanded' : ''}`}
      onClick={handleCardClick}
      role="region"
      aria-expanded={expanded}
    >
      <div className="question-main">
        <span className="day-number">{String(question.day).padStart(3, '0')}</span>
        <div className="question-copy">
          <div className="question-title-line">
            <a
              className="question-title"
              href={`https://leetcode.com/problems/${question.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/`}
              target="_blank"
              rel="noreferrer"
            >
              {question.title}
            </a>
            <span className="lc-number">LC {question.id}</span>
          </div>
          <div className="question-pattern">
            {question.pattern}
            {solvedAt && (
              <span className="completion-date">
                {' '}· solved{' '}
                {new Date(solvedAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  timeZone: 'Asia/Kolkata',
                })}
              </span>
            )}
          </div>
        </div>
        <div className="question-topic">
          <Pill>{question.topic}</Pill>
        </div>
        <div className="question-level">
          <span className={`difficulty ${question.difficulty.toLowerCase()}`}>
            <i />
            {question.difficulty}
          </span>
        </div>
        <div className="question-actions">
          <button
            type="button"
            className={`icon-button solve-button ${solved ? 'complete' : ''} ${locked ? 'locked' : ''}`}
            disabled={locked}
            onClick={(e) => {
              e.stopPropagation();
              if (locked) return;
              onSolve(question.id);
            }}
            aria-label={
              locked
                ? 'Completed in a Club Challenge'
                : solved
                ? 'Remove from personal progress'
                : 'Mark in personal progress'
            }
            title={
              locked
                ? 'Club Challenge submissions stay completed'
                : solved
                ? 'Remove from personal progress'
                : 'Mark solved for personal progress'
            }
          >
            {solved ? <Icon name="check" size={15} /> : <span className="check-empty" />}
          </button>
        </div>
      </div>
      {expanded && (
        <div id={`question-analysis-${question.id}`} className="question-analysis">
          <div className="analysis-intro">
            <span className="micro-label">INTERVIEW NOTES</span>
            <p>
              {question.algorithm}. Focus on why <strong>{question.pattern.toLowerCase()}</strong> reduces the work compared with a direct approach.
            </p>
          </div>
          <div className="analysis-metrics">
            <div>
              <span>DATA STRUCTURE</span>
              <strong>{question.structures}</strong>
            </div>
            <div>
              <span>RECOMMENDED APPROACH</span>
              <strong>{question.algorithm}</strong>
            </div>
            <div>
              <span>TIME</span>
              <strong className="complexity">{question.time}</strong>
            </div>
            <div>
              <span>AUXILIARY SPACE</span>
              <strong className="complexity">{question.space}</strong>
            </div>
          </div>
          <a
            className="text-link"
            href={`https://leetcode.com/problems/${question.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/`}
            target="_blank"
            rel="noreferrer"
          >
            Open problem on LeetCode <Icon name="external" size={13} />
          </a>
        </div>
      )}
    </article>
  );
});

