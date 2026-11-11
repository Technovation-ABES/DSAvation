import React from 'react';

export const Pill = React.memo(function Pill({ children, tone = '' }) {
  return <span className={`pill ${tone}`}>{children}</span>;
});

