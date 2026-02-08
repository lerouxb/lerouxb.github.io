# static-attic

A minimalist static site generator for a personal blog. Reads YAML+Markdown post files and generates clean, self-contained HTML pages.

## Features

- **Simple input format**: YAML frontmatter + Markdown, with ISO 8601 timestamps in filenames
- **Reverse-chronological pagination**: Index pages with configurable posts per page
- **Self-contained output**: All CSS inlined in `<style>` blocks
- **Syntax highlighting**: Code blocks via Shiki
- **Type-safe**: Full TypeScript with Zod schema validation
- **GitHub Pages ready**: Automated deployment via GitHub Actions

## Quick Start

```bash
# Install dependencies
pnpm install

# Create a new draft post
pnpm run new my-post-slug

# Build the site
pnpm run build

# Validate all input files
pnpm run validate

# Run all checks (lint + format)
pnpm run check
```

## Input Format

Post files live in `/input` and are named `YYYY-MM-DDThh:mm:ssZ_slug.md`:

```
2026-02-05T21:38:22Z_arpeggiator.md
```

Each file contains YAML frontmatter followed by Markdown:

```markdown
---
title: My Post Title
draft: false
---

Your post content here with **markdown** support.
```

**Metadata fields** (all optional):
- `date`: ISO 8601 datetime string
- `title`: Post title
- `mood`: Current mood/theme
- `draft`: Set to `true` to exclude from output

**Images**: Place in `/input/images` (supports `.png`, `.jpg`, `.svg`)

## Output Structure

Generated HTML goes to `/output`:

```
output/
├── index.html                    # Page 1 of index
├── page/
│   ├── 2/
│   │   └── index.html           # Page 2 of index
│   └── 3/
│       └── index.html           # Page 3 of index
├── 2026-02-05T21:38:22Z_arpeggiator/
│   └── index.html               # Permalink page
└── images/
    └── photo.jpg
```

- **Index pages**: 5 posts per page, reverse-chronological, with next/prev navigation
- **Permalink pages**: One per post at `/{filename}/index.html`
- Drafts excluded automatically

## Development

```bash
# Create new post
pnpm run new [slug]

# Build site
pnpm run build

# Run tests
pnpm test
pnpm run test:watch

# Code quality
pnpm run lint
pnpm run format
pnpm run check

# Validate input
pnpm run validate
```

## Tech Stack

- **Runtime**: Node.js 24+ with TypeScript erasable syntax
- **Package manager**: pnpm
- **Parsing**: gray-matter (YAML frontmatter)
- **Markdown**: markdown-it
- **Syntax highlighting**: @shikijs/markdown-it
- **Validation**: Zod + ts-to-zod
- **Code quality**: ESLint + Prettier
- **Testing**: Vitest

## Deployment

Pushes to `main` automatically trigger a GitHub Actions workflow that builds and deploys to GitHub Pages.

**Setup**:
1. Go to repository Settings → Pages
2. Set Source to "GitHub Actions"

The workflow is defined in [.github/workflows/deploy.yml](.github/workflows/deploy.yml).

## Project Structure

```
static-attic/
├── input/              # Source markdown posts
├── output/             # Generated HTML (git-ignored)
├── templates/          # HTML templates
├── scripts/            # Build and utility scripts
├── src/                # Shared TypeScript modules
└── .github/workflows/  # CI/CD automation
```

## License

MIT
