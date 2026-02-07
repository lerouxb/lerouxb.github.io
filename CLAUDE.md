# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static-attic is a static site generator for a personal blog. It reads YAML+Markdown post files from an input directory and generates a set of static HTML pages.

## Commands

- `npm run new` - create a blank new draft post in input/ with optional slug
- `npm run build` — compile TypeScript and generate the site
- `npm test` — run tests with Vitest
- `npm run test:watch` — run tests in watch mode
- `npx vitest run path/to/test.ts` — run a single test file
- `npm run lint` — run ESLint
- `npm run format` — run Prettier
- `npm run validate` - check all input files' names and content against zod schemas
- `npm run check` - run all checks (ESLink, Pretter, etc.)

## Architecture

Scripts go in `/scripts`, shared code go in `/src`.

### Input Format

Post files live in `/input` and are named `YYYY-MM-DDThh:mm:ssZ_slug.md` (e.g. `2026-02-05T21:38:22Z_arpeggiator.md`).

Each file has YAML frontmatter at the top followed by Markdown body content. Metadata fields (all optional): `date`, `title`, `mood`, `draft`.

This will correspond to the following TypeScript type:

```typescript
type Post = {
  data: {
    date?: string;
    title?: string;
    mood?: string;
    draft?: boolean;
  };
  content: string;
};
```

### Images

Images are allowed to go in `/input/images`. .png and .svg are allowed.

### Output

Generated HTML goes to `/output`. The site consists of:

- **Paginated index pages**: 5 posts per page in reverse-chronological order. Page 1 is the site index. Pages 2+ are at `/page/2/`, `/page/3/`, etc. Each page has next/prev navigation links.
- **Permalink pages**: One page per post, with the URL derived from the input filename. `slug` is never used separately - it is just useful for humans looking at the list of files to help identify which is which. Permalinks contain the full date and slug. `/2026-02-05T21:38:22Z_arpeggiator.html`, etc.

Draft posts (where `draft: true`) should be excluded from output.

### Caching

Cache post HTML snippets in /cache to avoid slow regeneration when rendering permalinks and index pages.

### Templating

HTML output is generated using TypeScript tagged template literals — no template engine dependency. The template for a specific post is in `/templates/template-post.html`. The template for a page containing one or more posts is `/templates/template-outline.html`. We'll fill these templates using the "function constructor" method.

### Tech Stack

- TypeScript on Node.js
- pnpm as package manager
- ESLint + Prettier for code quality
- gray-matter for parsing input files
- ts-to-zod for converting the TypeScript type to a Zod schema
- zod for validating input file names and content
- markdown-it for rendering markdown
- @shikijs/markdown-it for syntax highlighting code blocks with markdown-it
