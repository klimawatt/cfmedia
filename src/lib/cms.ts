export interface SeoOverride {
  title?: string;
  description?: string;
  canonical?: string;
  noindex?: string | boolean;
  ogImage?: string;
  focusKeyword?: string;
}

export interface CmsEntry {
  collection: string;
  slug: string;
  title: string;
  data: Record<string, any>;
  published_at: string | null;
}

let cached: Promise<CmsEntry[]> | undefined;

async function fetchEntries(): Promise<CmsEntry[]> {
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const key = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return [];
  try {
    const response = await fetch(`${url}/rest/v1/content_entries?select=collection,slug,title,data,published_at&status=eq.published`, {
      headers: { apikey: key },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return (await response.json()) as CmsEntry[];
  } catch (error) {
    console.warn(`[cms] Inhoud uit Supabase niet opgehaald, standaardinhoud wordt gebruikt: ${(error as Error).message}`);
    return [];
  }
}

// In dev altijd vers ophalen, zodat gepubliceerde wijzigingen direct zichtbaar zijn.
export function getEntries(): Promise<CmsEntry[]> {
  if (import.meta.env.DEV) return fetchEntries();
  cached ??= fetchEntries();
  return cached;
}

export async function getCollectionEntries(collection: string): Promise<CmsEntry[]> {
  return (await getEntries()).filter((entry) => entry.collection === collection);
}

export async function getOverrideMap(collection: string): Promise<Map<string, Record<string, any>>> {
  return new Map((await getCollectionEntries(collection)).map((entry) => [entry.slug, entry.data]));
}

const isFilled = (value: unknown) => (Array.isArray(value) ? value.length > 0 : typeof value === 'string' ? value.trim() !== '' : value !== undefined && value !== null);

export function mergeDefaults<T extends Record<string, any>>(defaults: T, data: Record<string, any> | undefined): T & { seo?: SeoOverride } {
  const merged: Record<string, any> = { ...defaults };
  if (data) for (const key of Object.keys(defaults)) if (isFilled(data[key])) merged[key] = data[key];
  if (data?.seo) merged.seo = data.seo;
  return merged as T & { seo?: SeoOverride };
}

export async function getPageContent<T extends Record<string, any>>(slug: string, defaults: T) {
  const map = await getOverrideMap('page');
  return mergeDefaults(defaults, map.get(slug));
}

export function seoProps(seo: SeoOverride | undefined, fallback: { title: string; description: string; canonical: string }) {
  return {
    title: seo?.title?.trim() || fallback.title,
    description: seo?.description?.trim() || fallback.description,
    canonical: seo?.canonical?.trim() || fallback.canonical,
    noindex: seo?.noindex === true || seo?.noindex === 'ja',
    image: seo?.ogImage?.trim() || undefined,
  };
}
