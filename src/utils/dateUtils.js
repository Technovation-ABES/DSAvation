export const localDay = () =>
  new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());

export const formatDmy = (dateStr) => {
  if (!dateStr || typeof dateStr !== 'string') return '';
  const parts = dateStr.split('-');
  return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : dateStr;
};

export const shiftDay = (dateKey, offset) => {
  const date = new Date(`${dateKey}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().slice(0, 10);
};

export const studyYearLabel = (year) =>
  ({
    'first-year': 'First year',
    'second-year': 'Second year',
    'third-year': 'Third year',
    'fourth-year': 'Fourth year',
    passed: 'Passed out',
  }[year] || 'Year not provided');

