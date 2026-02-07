const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function parseDateFromFilename(filename: string): Date {
  const iso = filename.slice(0, 20); // "YYYY-MM-DDThh:mm:ssZ"
  return new Date(iso);
}

export function toDatetimeISO(filename: string): string {
  return filename.slice(0, 20); // "YYYY-MM-DDThh:mm:ssZ"
}

export function toDatetimeReadable(date: Date): string {
  const day = DAYS[date.getUTCDay()];
  const d = date.getUTCDate();
  const month = MONTHS[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  return `${day} ${d} ${month} ${year} ${hours}:${minutes} UTC`;
}
