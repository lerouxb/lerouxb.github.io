import fs from 'node:fs';
import path from 'node:path';

const slug = process.argv[2] || 'untitled';

// Validate slug format: lowercase alphanumeric segments separated by hyphens
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error(
    `Invalid slug: "${slug}". Use lowercase letters, numbers, and hyphens (e.g. "my-new-post").`,
  );
  process.exit(1);
}

const now = new Date();
const timestamp = now.toISOString().replace(/\.\d{3}Z$/, 'Z');
const filename = `${timestamp}_${slug}.md`;

const inputDir = path.resolve(import.meta.dirname, '..', 'input');
const filepath = path.join(inputDir, filename);

if (fs.existsSync(filepath)) {
  console.error(`File already exists: ${filename}`);
  process.exit(1);
}

fs.writeFileSync(filepath, '---\ndraft: true\n---\n\n');

console.log(`Created ${filename}`);
