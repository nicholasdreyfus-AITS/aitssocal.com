import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Blog posts live in src/content/blog/*.md(x).
// The schema enforces the metadata every post needs for SEO/AEO:
// a focused title, a meta description, a date, and optional FAQ entries
// that become FAQPage structured data on the post.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().max(70, 'Keep titles under ~60 chars for search results'),
    description: z.string().max(165, 'Meta descriptions should be under ~160 chars'),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('AITS'),
    // Short, search-intent tags used for related-content + topical clustering.
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    draft: z.boolean().default(false),
    // Optional Q&A pairs -> rendered on-page AND emitted as FAQPage JSON-LD.
    faq: z
      .array(z.object({ question: z.string(), answer: z.string() }))
      .optional(),
  }),
});

export const collections = { blog };
