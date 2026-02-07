import MarkdownIt from 'markdown-it';
import markdownItShiki from '@shikijs/markdown-it';

export async function createMarkdownRenderer(): Promise<MarkdownIt> {
  const md = MarkdownIt({
    html: true
  });
  md.use(
    await markdownItShiki({
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    }),
  );
  return md;
}
