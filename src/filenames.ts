import { z } from 'zod';

// Matches: YYYY-MM-DDThh:mm:ssZ_slug.md
export const filenamePattern =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z_[a-z0-9]+(?:-[a-z0-9]+)*\.md$/;

export const filenameSchema = z.string().regex(filenamePattern, {
  message:
    'Filename must match YYYY-MM-DDThh:mm:ssZ_slug.md (e.g. 2026-02-05T21:38:22Z_arpeggiator.md)',
});

