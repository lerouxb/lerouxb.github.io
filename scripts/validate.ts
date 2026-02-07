import fs from 'node:fs';
import path from 'node:path';
import { filenameSchema } from '../src/filenames.ts';
import { postSchema } from '../src/types.zod.ts';
import matter from 'gray-matter';

const inputDir = path.resolve(import.meta.dirname, '..', 'input');

const files = fs.readdirSync(inputDir).filter((f) => f.endsWith('.md'));

let hasErrors = false;

for (const file of files) {
  // Validate filename
  const filenameResult = filenameSchema.safeParse(file);
  if (!filenameResult.success) {
    console.error(`Invalid filename: ${file}`);
    for (const issue of filenameResult.error.issues) {
      console.error(`  - ${issue.message}`);
    }
    hasErrors = true;
  }

  // Validate content
  const text = fs.readFileSync(path.join(inputDir, file), 'utf-8');
  const post = matter(text);
  const contentResult = postSchema.safeParse(post);
  if (!contentResult.success) {
    console.error(`Invalid content in: ${file}`);
    for (const issue of contentResult.error.issues) {
      console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
    }
    hasErrors = true;
  }
}

if (hasErrors) {
  process.exit(1);
} else {
  console.log(`Validated ${files.length} file(s) successfully.`);
}
