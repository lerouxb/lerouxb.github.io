import fs from 'node:fs';
import path from 'node:path';

const templatesDir = path.resolve(import.meta.dirname, '..', 'templates');

export function loadPostTemplate(): (
  permalink: string,
  datetimeISO: string,
  datetimeReadable: string,
  title: string,
  content: string,
) => string {
  const source = fs.readFileSync(
    path.join(templatesDir, 'template-post.html'),
    'utf-8',
  );
  return new Function(
    'permalink',
    'datetimeISO',
    'datetimeReadable',
    'title',
    'content',
    'return `' + source + '`',
  ) as ReturnType<typeof loadPostTemplate>;
}

export function loadOutlineTemplate(): (
  title: string,
  posts: string,
  prev: string,
  next: string,
) => string {
  const source = fs.readFileSync(
    path.join(templatesDir, 'template-outline.html'),
    'utf-8',
  );
  return new Function(
    'title',
    'posts',
    'prev',
    'next',
    'return `' + source + '`',
  ) as ReturnType<typeof loadOutlineTemplate>;
}
