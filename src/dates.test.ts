import { describe, it, expect } from 'vitest';
import { parseDateFromFilename, toDatetimeReadable } from './dates.ts';

describe('parseDateFromFilename', () => {
  it('parses ISO 8601 timestamp from filename', () => {
    const date = parseDateFromFilename('2026-02-05T21:38:22Z_arpeggiator.md');
    expect(date).toBeInstanceOf(Date);
    expect(date.toISOString()).toBe('2026-02-05T21:38:22.000Z');
  });

  it('handles midnight timestamps', () => {
    const date = parseDateFromFilename('2024-01-01T00:00:00Z_new-year.md');
    expect(date.toISOString()).toBe('2024-01-01T00:00:00.000Z');
  });

  it('handles timestamps near end of day', () => {
    const date = parseDateFromFilename('2025-12-31T23:59:59Z_countdown.md');
    expect(date.toISOString()).toBe('2025-12-31T23:59:59.000Z');
  });
});

describe('toDatetimeReadable', () => {
  it('formats date in readable UTC format', () => {
    const date = new Date('2026-02-05T21:38:22Z');
    expect(toDatetimeReadable(date)).toBe('Thu 5 Feb 2026 21:38 UTC');
  });

  it('handles dates at midnight', () => {
    const date = new Date('2024-01-01T00:00:00Z');
    expect(toDatetimeReadable(date)).toBe('Mon 1 Jan 2024 00:00 UTC');
  });

  it('pads single-digit hours and minutes', () => {
    const date = new Date('2025-03-07T08:05:00Z');
    expect(toDatetimeReadable(date)).toBe('Fri 7 Mar 2025 08:05 UTC');
  });

  it('handles different weekdays', () => {
    expect(toDatetimeReadable(new Date('2026-02-01T12:00:00Z'))).toBe(
      'Sun 1 Feb 2026 12:00 UTC',
    );
    expect(toDatetimeReadable(new Date('2026-02-07T12:00:00Z'))).toBe(
      'Sat 7 Feb 2026 12:00 UTC',
    );
  });

  it('handles different months', () => {
    expect(toDatetimeReadable(new Date('2026-01-15T12:00:00Z'))).toContain(
      'Jan',
    );
    expect(toDatetimeReadable(new Date('2026-12-25T12:00:00Z'))).toContain(
      'Dec',
    );
  });

  it('handles double-digit dates', () => {
    const date = new Date('2026-11-23T15:45:00Z');
    expect(toDatetimeReadable(date)).toBe('Mon 23 Nov 2026 15:45 UTC');
  });
});
