import { describe, it, expect } from 'vitest';
import { filenameSchema } from './filenames.ts';

describe('filenameSchema', () => {
  it('accepts valid filenames', () => {
    expect(
      filenameSchema.safeParse('2026-02-05T21:38:22Z_arpeggiator.md').success,
    ).toBe(true);
    expect(
      filenameSchema.safeParse('2024-01-01T00:00:00Z_my-first-post.md').success,
    ).toBe(true);
    expect(
      filenameSchema.safeParse('2026-02-05T21:38:22Z_UPPERCASE.md').success,
    ).toBe(true);
  });

  it('rejects invalid filenames', () => {
    expect(filenameSchema.safeParse('bad-name.md').success).toBe(false);
    expect(filenameSchema.safeParse('2026-02-05_no-time.md').success).toBe(
      false,
    );
  });
});
