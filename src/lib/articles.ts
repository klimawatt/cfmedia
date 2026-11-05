import { getCollection, type CollectionEntry } from 'astro:content';
import { marked } from 'marked';
import fabianPortrait from '../assets/fabian-clemens.jpg';
import { getCollectionEntries, type SeoOverride } from './cms';

type ArticleData = CollectionEntry<'articles'>['data'];

// Zelfde vorm als een Markdown-entry, zodat sjablonen beide bronnen gelijk behandelen.
export interface ArticleView {
  id: string;
  data: ArticleData;
  seo?: SeoOverride;
  html?: string;
  entry?: CollectionEntry<'articles'>;
}

export async function getArticles({ includeDrafts = false } = {}): Promise<ArticleView[]> {
  const stored = (await getCollectionEntries('article')).map((row): ArticleView => ({
    id: `db/${row.slug}`,
    seo: row.data.seo,
    html: marked.parse(String(row.data.body ?? ''), { async: false }) as string,
    data: {
      title: row.title,
      description: String(row.data.description ?? ''),
      author: { name: String(row.data.authorName ?? 'Fabian Clemens'), jobTitle: String(row.data.authorJobTitle ?? 'Eigenaar van CF Media'), photo: fabianPortrait },
      coverAlt: row.data.coverAlt || undefined,
      datePublished: String(row.data.datePublished ?? row.published_at?.slice(0, 10) ?? ''),
      dateModified: String(row.data.dateModified ?? row.published_at?.slice(0, 10) ?? ''),
      category: row.data.category as ArticleData['category'],
      serviceTags: (row.data.serviceTags ?? []) as ArticleData['serviceTags'],
      draft: false,
    },
  }));
  const storedSlugs = new Set(stored.map((article) => article.id.split('/').at(-1)));
  const markdown = (await getCollection('articles', ({ data }) => includeDrafts || !data.draft))
    .filter((entry) => !storedSlugs.has(entry.id.split('/').at(-1)))
    .map((entry): ArticleView => ({ id: entry.id, data: entry.data, entry }));
  return [...stored, ...markdown];
}
