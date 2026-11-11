import React from 'react';
import { Icon } from '../common/Icon.jsx';

export const NoticeBanner = React.memo(function NoticeBanner({
  notice,
  setNotice,
  apiNotice,
}) {
  return (
    <>
      {notice && (
        <div className="toast" role="status">
          <span>{notice}</span>
          <button onClick={() => setNotice('')} aria-label="Dismiss message">
            ×
          </button>
        </div>
      )}
      {apiNotice && (
        <div className="system-banner">
          <Icon name="lock" size={15} />
          <span>{apiNotice}</span>
        </div>
      )}
    </>
  );
});

