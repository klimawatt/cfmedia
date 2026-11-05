import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const serviceTag = z.enum([
  'seo', 'geo', 'webdesign', 'technische-seo', 'contentstrategie', 'linkbuilding',
  'lokale-seo', 'seo-audit', 'ai-zichtbaarheid-audit', 'chatgpt-optimalisatie',
  'google-ai-overviews', 'wordpress-website', 'webshop-laten-maken', 'website-redesign',
]);

const dateOrPlaceholder = z.string().refine((value) => (
  value === '[DATUM INVULLEN]' || /^\d{4}-\d{2}-\d{2}$/.test(value)
));

const articles = defineCollection({
  loader: glob({ pattern: 'articles/**/*.md', base: './src/content' }),
  schema: ({ image }) => z.object({
    title: z.string().min(1),
    description: z.string().min(1).max(155),
    author: z.object({
      name: z.string().min(1),
      jobTitle: z.string().min(1),
      teamSlug: z.string().min(1),
      photo: image(),
    }),
    cover: image().optional(),
    coverAlt: z.string().optional(),
    datePublished: dateOrPlaceholder,
    dateModified: dateOrPlaceholder,
    category: z.enum(['seo', 'geo', 'webdesign']),
    serviceTags: z.array(serviceTag),
    draft: z.boolean().default(false),
  }).superRefine((article, context) => {
    if (article.cover && !article.coverAlt?.trim()) {
      context.addIssue({ code: 'custom', message: 'coverAlt is verplicht als een artikelcover wordt gebruikt.', path: ['coverAlt'] });
    }
    if (!article.draft) {
      for (const field of ['datePublished', 'dateModified'] as const) {
        if (article[field] === '[DATUM INVULLEN]') {
          context.addIssue({ code: 'custom', message: `${field} is verplicht voor gepubliceerde artikelen.`, path: [field] });
        }
      }
    }
  }),
});

const cases = defineCollection({
  loader: glob({ pattern: 'cases/**/*.md', base: './src/content' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1).max(155),
    serviceTags: z.array(serviceTag),
    problem: z.string().min(1),
    approach: z.string().min(1),
    result: z.string().min(1),
  }),
});

export const collections = { articles, cases };