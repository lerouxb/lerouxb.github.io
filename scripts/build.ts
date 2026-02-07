import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import matter from 'gray-matter';
import {
  parseDateFromFilename,
  toDatetimeISO,
  toDatetimeReadable,
} from '../src/dates.ts';
import { createMarkdownRenderer } from '../src/markdown.ts';
import { loadPostTemplate, loadOutlineTemplate } from '../src/templates.ts';

const rootDir = path.resolve(import.meta.dirname, '..');
const inputDir = path.join(rootDir, 'input');
const outputDir = path.join(rootDir, 'output');
const cacheDir = path.join(rootDir, 'cache');

const POSTS_PER_PAGE = 5;

// 1. Clean output, ensure cache exists
fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });
fs.mkdirSync(cacheDir, { recursive: true });

// 2. Read and parse posts, filter drafts, sort reverse-chronologically
const files = fs
  .readdirSync(inputDir)
  .filter((f) => f.endsWith('.md'))
  .sort()
  .reverse();

type ParsedPost = {
  filename: string;
  datetimeISO: string;
  datetimeReadable: string;
  title: string;
  content: string;
};

function permalink(filename: string): string {
  return `/${path.basename(filename, '.md')}/`;
}

const posts: ParsedPost[] = [];
for (const filename of files) {
  const raw = fs.readFileSync(path.join(inputDir, filename), 'utf-8');
  const { data, content } = matter(raw);
  if (data.draft) continue;

  posts.push({
    filename,
    datetimeISO: toDatetimeISO(filename),
    datetimeReadable: toDatetimeReadable(parseDateFromFilename(filename)),
    title: (data.title as string) || '',
    content,
  });
}

// 3. Init markdown renderer
const md = await createMarkdownRenderer();

// 4. Load templates
const postTemplate = loadPostTemplate();
const outlineTemplate = loadOutlineTemplate();

// Read post template source for cache hashing
const postTemplateSource = fs.readFileSync(
  path.join(rootDir, 'templates', 'template-post.html'),
  'utf-8',
);

// 5. Render post snippets with caching
const renderedSnippets: Map<string, string> = new Map();

for (const post of posts) {
  const cacheFile = path.join(cacheDir, `${post.filename}.json`);
  const inputContent = fs.readFileSync(
    path.join(inputDir, post.filename),
    'utf-8',
  );
  const hash = crypto
    .createHash('sha256')
    .update(inputContent)
    .update(postTemplateSource)
    .digest('hex');

  let html: string | undefined;

  if (fs.existsSync(cacheFile)) {
    try {
      const cached = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
      if (cached.hash === hash) {
        html = cached.html;
      }
    } catch {
      // ignore corrupt cache
    }
  }

  if (!html) {
    const renderedContent = md.render(post.content);
    html = postTemplate(
      permalink(post.filename),
      post.datetimeISO,
      post.datetimeReadable,
      post.title,
      renderedContent,
    );
    fs.writeFileSync(cacheFile, JSON.stringify({ hash, html }));
  }

  renderedSnippets.set(post.filename, html);
}

// 6. Generate permalink pages
for (let i = 0; i < posts.length; i++) {
  const post = posts[i];
  const html = renderedSnippets.get(post.filename)!;
  const prev = i > 0 ? permalink(posts[i - 1].filename) : '';
  const next = i < posts.length - 1 ? permalink(posts[i + 1].filename) : '';
  const pageTitle = post.title || 'static-attic';

  const page = outlineTemplate(pageTitle, html, prev, next);
  const dir = path.join(outputDir, path.basename(post.filename, '.md'));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page);
}

// 7. Generate paginated index pages
const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));

for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
  const start = (pageNum - 1) * POSTS_PER_PAGE;
  const pagePosts = posts.slice(start, start + POSTS_PER_PAGE);
  const postsHtml = pagePosts
    .map((p) => renderedSnippets.get(p.filename)!)
    .join('\n');

  // prev = newer page (lower number), next = older page (higher number)
  let prev = '';
  if (pageNum === 2) prev = '/';
  else if (pageNum > 2) prev = `/page/${pageNum - 1}/`;

  const next = pageNum < totalPages ? `/page/${pageNum + 1}/` : '';

  const page = outlineTemplate('static-attic', postsHtml, prev, next);

  if (pageNum === 1) {
    fs.writeFileSync(path.join(outputDir, 'index.html'), page);
  } else {
    const dir = path.join(outputDir, 'page', String(pageNum));
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), page);
  }
}

// 8. Copy images
const imagesInputDir = path.join(inputDir, 'images');
if (fs.existsSync(imagesInputDir)) {
  const imagesOutputDir = path.join(outputDir, 'images');
  fs.mkdirSync(imagesOutputDir, { recursive: true });
  for (const file of fs.readdirSync(imagesInputDir)) {
    fs.copyFileSync(
      path.join(imagesInputDir, file),
      path.join(imagesOutputDir, file),
    );
  }
}

// 9. Summary
console.log(
  `Built ${posts.length} post(s), ${totalPages} index page(s) → output/`,
);

function printTree(dir: string, prefix = '', isLast = true): void {
  const name = path.basename(dir);
  const connector = isLast ? '└── ' : '├── ';
  console.log(prefix + connector + name);

  const newPrefix = prefix + (isLast ? '    ' : '│   ');
  const entries = fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => {
    if (a.isDirectory() === b.isDirectory()) return a.name.localeCompare(b.name);
    return a.isDirectory() ? -1 : 1;
  });

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const fullPath = path.join(dir, entry.name);
    const last = i === entries.length - 1;

    if (entry.isDirectory()) {
      printTree(fullPath, newPrefix, last);
    } else {
      const connector = last ? '└── ' : '├── ';
      console.log(newPrefix + connector + entry.name);
    }
  }
}

printTree(outputDir);
