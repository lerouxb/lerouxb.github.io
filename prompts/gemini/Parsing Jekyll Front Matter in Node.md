# Parsing Jekyll Front Matter in Node

> Exported on: 10/02/2026, 20:50:14

---

## 👤 You

In node.js, how do you parse a jekyll style yaml file where you have a block of yaml fields at the top followed by a block of markdown so that you get the yaml fields and plus all the markdown as one field?

## 🤖 Gemini

In the world of Jekyll, Hugo, and other static site generators, that "YAML at the top" structure is known as **Front Matter**.

To handle this in Node.js, you don't want to reinvent the wheel with complex Regular Expressions. The industry standard is a library called **`gray-matter`**. It’s fast, reliable, and does exactly what you’re looking for: splits the YAML and the Markdown into a clean object.

### 1\. Install the Package

First, grab the library via npm:

Bash

```
npm install gray-matter
```

### 2\. The Implementation

Here is how you parse a file (or string) to get the data you need:

JavaScript

```
const fs = require('fs');
const matter = require('gray-matter');

// Read your Jekyll-style file
const fileContent = fs.readFileSync('post.md', 'utf8');

// Parse the file
const { data, content } = matter(fileContent);

console.log('--- YAML Fields ---');
console.log(data); // This is a JavaScript object (e.g., { title: "Hello", tags: [...] })

console.log('--- Markdown Content ---');
console.log(content); // This is your raw Markdown string
```

---

### How it works

- **The Delimiters:** By default, `gray-matter` looks for the triple-dash `---` lines that start and end the YAML block.
- **The Data:** The YAML is automatically parsed into a plain JavaScript object.
- **The Content:** Everything after the closing `---` is captured as a single string, preserving all your Markdown formatting, line breaks, and spacing.

### Why not use a manual Split?

You might be tempted to just use `fileContent.split('---')`, but that often breaks if:

1.  Your Markdown content contains a horizontal rule (which also uses `---`).
2.  There is leading whitespace before the first `---`.
3.  The YAML block is empty.

`gray-matter` handles these edge cases gracefully, so you don't have to worry about your parser crashing on a specific blog post.

---

Would you like me to show you how to integrate this with a Markdown-to-HTML converter like **marked** or **markdown-it**?

---

## 👤 You

are there newer maintained alternatives to gray-matter?

## 🤖 Gemini

While **`gray-matter`** remains the most popular choice, it hasn't seen a major update in a few years. If you are building a modern application (especially with TypeScript or ESM) and want something more actively maintained or better integrated into a specific ecosystem, here are the top alternatives for 2026:

### 1\. Unified / Remark (The Modern Standard)

If you are doing more than just parsing (e.g., converting Markdown to HTML or linting), the **Unified.js** ecosystem is the professional choice. It uses a plugin architecture that is extremely active.

- **Packages:** `remark-frontmatter` (to detect it) and `remark-parse`.
- **Best for:** Projects already using **Remark**, **Rehype**, or **Next.js** content pipelines.
- **Pros:** Highly modular, native TypeScript support, and part of a massive ecosystem.

JavaScript

```
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import remarkStringify from 'remark-stringify';

// This setup identifies the frontmatter block as a node in the syntax tree
const processor = unified()
  .use(remarkParse)
  .use(remarkFrontmatter, ['yaml']);
```

### 2\. `vfile-matter`

Also from the Unified team, `vfile-matter` is a lighter alternative that specifically populates a `data` object on a virtual file. It is much closer to the "one-liner" experience of gray-matter but stays within the modern `vfile` ecosystem.

### 3\. `front-matter`

This is a tiny, zero-dependency alternative. While it's also "mature" (meaning few updates), it is specifically designed to be lighter than `gray-matter`.

- **Pros:** Extremely small footprint.
- **Cons:** Only supports YAML (gray-matter supports JSON, TOML, and JS).

### 4\. Framework-Specific Parsers

If you are using a specific modern framework, you might not need an external library at all:

- **Astro:** Has built-in frontmatter parsing via its internal compiler.
- **Bun:** If you are using the Bun runtime, `@stacksjs/markdown` is a high-performance, native-speed alternative designed specifically for that environment.

---

### Comparison at a Glance

| Feature           | `gray-matter`        | `remark-frontmatter` | `front-matter`      |
| ----------------- | -------------------- | -------------------- | ------------------- |
| **Maintenance**   | Low (Stable)         | **High (Active)**    | Low (Stable)        |
| **Size**          | ~38kB                | Modular              | **~4kB**            |
| **Formats**       | YAML, JSON, TOML, JS | YAML, TOML           | YAML only           |
| **Best Use Case** | General Node.js apps | Complex MD pipelines | Lightweight scripts |

Export to Sheets

### My Recommendation

- **For a simple script:** Stick with **`gray-matter`**. Despite the age, it is "finished" software—it does one thing perfectly and is used by VitePress, Astro, and Eleventy.
- **For a modern web app:** Use **`remark-frontmatter`**. It is the most "future-proof" and handles Markdown as a proper syntax tree rather than just a split string.

Would you like me to show you how to set up a **Remark** pipeline to handle both the frontmatter and the HTML conversion in one go?

---
