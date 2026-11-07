export function normalizeQuestions(rows = []) {
  return rows.map((row, index) => ({
    topic: row[0],
    id: Number(row[1]),
    title: row[2],
    difficulty: row[3],
    structures: row[4],
    pattern: row[5],
    algorithm: row[6],
    time: row[7],
    space: row[8],
    day: index + 1,
  }));
}

