import React from 'react';
import { Icon } from '../common/Icon.jsx';

export function QuestionActionsGuide() {
  return (
    <div className="question-actions-guide" aria-label="Question controls">
      <span>
        <i className="guide-check">
          <Icon name="check" size={12} />
        </i>
        Mark solved for personal progress
      </span>
      <span>
        <i className="guide-expand">
          <Icon name="arrow" size={12} />
        </i>
        Click card to show/hide approach and complexity
      </span>
    </div>
  );
}

