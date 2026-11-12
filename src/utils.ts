import { Habit } from './types';

const pad = (n: number) => String(n).padStart(2, '0');

export const toKey = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const parseKey = (k: string) => new Date(`${k}T00:00:00`);

export const todayKey = () => toKey(new Date());

// Lunes de la semana de la fecha dada
export const weekKey = (d: Date) => {
  const c = new Date(d);
  c.setDate(c.getDate() - ((c.getDay() + 6) % 7));
  return toKey(c);
};

export function isDone(h: Habit): boolean {
  if (h.frequency === 'daily') return h.completions.includes(todayKey());
  const wk = weekKey(new Date());
  return h.completions.some((k) => weekKey(parseKey(k)) === wk);
}

export function toggleCompletion(h: Habit): Habit {
  if (h.frequency === 'daily') {
    const t = todayKey();
    const completions = h.completions.includes(t)
      ? h.completions.filter((k) => k !== t)
      : [...h.completions, t];
    return { ...h, completions };
  }
  const wk = weekKey(new Date());
  const doneThisWeek = isDone(h);
  const completions = doneThisWeek
    ? h.completions.filter((k) => weekKey(parseKey(k)) !== wk)
    : [...h.completions, todayKey()];
  return { ...h, completions };
}

// Racha de días (diario) o semanas (semanal) consecutivos
export function calcStreak(h: Habit): number {
  let count = 0;
  if (h.frequency === 'daily') {
    const set = new Set(h.completions);
    const cursor = new Date();
    if (!set.has(toKey(cursor))) cursor.setDate(cursor.getDate() - 1);
    while (set.has(toKey(cursor))) {
      count++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return count;
  }
  const weeks = new Set(h.completions.map((k) => weekKey(parseKey(k))));
  const cursor = parseKey(weekKey(new Date()));
  if (!weeks.has(toKey(cursor))) cursor.setDate(cursor.getDate() - 7);
  while (weeks.has(toKey(cursor))) {
    count++;
    cursor.setDate(cursor.getDate() - 7);
  }
  return count;
}
