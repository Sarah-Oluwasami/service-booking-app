const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const pad = (n: number) => String(n).padStart(2, '0');

/** Local date as YYYY-MM-DD (avoids the UTC shift you get from toISOString). */
export function toISODate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Parses YYYY-MM-DD as a local date. */
export function fromISODate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export interface DateOption {
  iso: string;
  weekday: string;
  day: number;
  month: string;
}

/** The next `count` days, starting tomorrow. */
export function upcomingDates(count = 14, from = new Date()): DateOption[] {
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i + 1);
    return {
      iso: toISODate(date),
      weekday: WEEKDAYS[date.getDay()],
      day: date.getDate(),
      month: MONTHS[date.getMonth()],
    };
  });
}

/** Hourly and half-hourly slots between 8:00 and 17:30. */
export const TIME_SLOTS: string[] = Array.from({ length: 20 }, (_, i) => {
  const minutes = 8 * 60 + i * 30;
  return `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
});

/** "14:30" -> "2:30 PM" */
export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${pad(m)} ${suffix}`;
}

/** "2026-11-12" -> "Thu, 12 Nov 2026" */
export function formatDate(iso: string): string {
  const date = fromISODate(iso);
  return `${WEEKDAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

/** True if the booking's date is before today. */
export function isPast(iso: string, today = new Date()): boolean {
  return iso < toISODate(today);
}
