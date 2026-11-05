import { getCollection, type CollectionEntry } from 'astro:content';
import { getCollectionEntries, type SeoOverride } from './cms';

type CaseData = CollectionEntry<'cases'>['data'];

export interface CaseView {
  id: string;
  data: CaseData;
  seo?: SeoOverride;
}

export async function getCases({ includeDrafts = false } = {}): Promise<CaseView[]> {
  const stored = (await getCollectionEntries('case')).map((row): CaseView => ({
    id: `db/${row.slug}`,
    seo: row.data.seo,
    data: {
      title: row.title,
      description: String(row.data.description ?? ''),
      serviceTags: (row.data.serviceTags ?? []) as CaseData['serviceTags'],
      problem: String(row.data.problem ?? ''),
      approach: String(row.data.approach ?? ''),
      result: String(row.data.result ?? ''),
      draft: false,
    },
  }));
  const storedSlugs = new Set(stored.map((item) => item.id.split('/').at(-1)));
  const markdown = (await getCollection('cases', ({ data }) => includeDrafts || !data.draft))
    .filter((entry) => !storedSlugs.has(entry.id.split('/').at(-1)))
    .map((entry): CaseView => ({ id: entry.id, data: entry.data }));
  return [...stored, ...markdown];
}
