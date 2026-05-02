import fs from 'node:fs';
import path from 'node:path';

const templatesDir = path.resolve(import.meta.dirname, '..', 'templates');

export function loadPostTemplate(): (options: {
  permalink: string;
  datetimeISO: string;
  datetimeReadable: string;
  title: string;
  source: string;
  content: string;
}) => string {
  const src = fs.readFileSync(
    path.join(templatesDir, 'template-post.html'),
    'utf-8',
  );
  return new Function(
    'options',
    'const { permalink, datetimeISO, datetimeReadable, title, source, content } = options; return `' +
      src +
      '`',
  ) as ReturnType<typeof loadPostTemplate>;
}

export function loadOutlineTemplate(): (options: {
  title: string;
  posts: string;
  prev: string;
  next: string;
}) => string {
  const src = fs.readFileSync(
    path.join(templatesDir, 'template-outline.html'),
    'utf-8',
  );
  return new Function(
    'options',
    'const { title, posts, prev, next } = options; return `' + src + '`',
  ) as ReturnType<typeof loadOutlineTemplate>;
}
