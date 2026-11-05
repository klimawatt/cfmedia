import { allServicePages, services, serviceKey } from '../data/services';
import { pageDefaults, pageLabels, type PageSlug } from '../data/pages';

export interface Option { value: string; label: string }

export interface Field {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'tags' | 'lines' | 'repeater' | 'richtext';
  help?: string;
  rows?: number;
  levels?: number[];
  addTypes?: Option[];
  required?: boolean;
  options?: Option[];
  fallback?: string;
  fields?: Field[];
  itemLabel?: string;
  showIf?: { key: string; equals: string };
}

export interface SeoContext { path: string; defaultTitle: string; defaultDescription: string; body: string }

export interface FixedItem {
  slug: string;
  title: string;
  defaults: Record<string, any>;
  meta: { path: string; title: string; description: string };
}

export interface CollectionDef {
  label: string;
  fixed: boolean;
  fields: (slug: string) => Field[];
  items?: () => FixedItem[];
  context: (slug: string, values: Record<string, any>, item?: FixedItem) => SeoContext;
}

export const SERVICE_TAGS = ['seo', 'geo', 'webdesign', 'technische-seo', 'contentstrategie', 'linkbuilding', 'lokale-seo', 'seo-audit', 'ai-zichtbaarheid-audit', 'chatgpt-optimalisatie', 'google-ai-overviews', 'seo-vriendelijke-website', 'wordpress-website', 'webshop-laten-maken', 'website-redesign'];

const t = (key: string, label: string, extra: Partial<Field> = {}): Field => ({ key, label, type: 'text', ...extra });
const ta = (key: string, label: string, rows = 3, extra: Partial<Field> = {}): Field => ({ key, label, type: 'textarea', rows, ...extra });
const lines = (key: string, label: string, help?: string, extra: Partial<Field> = {}): Field => ({ key, label, type: 'lines', help: help ?? 'Eén regel per onderdeel.', ...extra });
const opts = (...values: string[]): Option[] => values.map((value) => ({ value, label: value }));

export const seoFields: Field[] = [
  t('seo.title', 'SEO-titel', { help: 'Leeg laten gebruikt de standaardtitel. Ideaal: 30 tot 60 tekens.' }),
  ta('seo.description', 'Meta-omschrijving', 3, { help: 'Leeg laten gebruikt de standaardomschrijving. Ideaal: 70 tot 155 tekens.' }),
  t('seo.focusKeyword', 'Focuszoekwoord', { help: 'Wordt alleen gebruikt voor de controles hieronder, niet op de site.' }),
  t('seo.canonical', 'Canonical-URL', { help: 'Alleen invullen als deze pagina naar een andere URL moet verwijzen. Gebruik een volledige URL.' }),
  { key: 'seo.noindex', label: 'Verbergen voor zoekmachines (noindex)', type: 'select', options: [{ value: 'nee', label: 'Nee, laat indexeren' }, { value: 'ja', label: 'Ja, niet indexeren' }], fallback: 'nee' },
  t('seo.ogImage', 'Deelafbeelding (URL)', { help: 'Volledige URL van een afbeelding voor delen op social media. Leeg laten gebruikt de standaardafbeelding.' }),
];

const blockTypes: Option[] = [
  { value: 'steps', label: 'Stappenplan' },
  { value: 'text', label: 'Tekst' },
  { value: 'checklist', label: 'Checklist' },
  { value: 'callout', label: 'Uitgelichte oproep' },
  { value: 'faq', label: 'Veelgestelde vragen' },
];

const blockFields: Field[] = [
  { key: 'type', label: 'Soort blok', type: 'select', options: blockTypes },
  t('eyebrow', 'Klein label boven de titel'),
  t('title', 'Titel'),
  ta('intro', 'Inleiding', 3, { showIf: { key: 'type', equals: 'steps' } }),
  {
    key: 'steps', label: 'Stappen', type: 'repeater', itemLabel: 'Stap', showIf: { key: 'type', equals: 'steps' },
    fields: [t('phase', 'Fase (bijvoorbeeld Fase 1)'), t('title', 'Titel'), ta('description', 'Uitleg', 3), { key: 'tags', label: 'Tags', type: 'tags', help: 'Gescheiden door komma’s.' }],
  },
  { key: 'html', label: 'Tekst', type: 'richtext', levels: [3, 4], showIf: { key: 'type', equals: 'text' } },
  lines('items', 'Punten', 'Eén regel per punt.', { showIf: { key: 'type', equals: 'checklist' } }),
  ta('text', 'Tekst', 3, { showIf: { key: 'type', equals: 'callout' } }),
  t('buttonLabel', 'Knoptekst (optioneel)', { showIf: { key: 'type', equals: 'callout' } }),
  t('buttonHref', 'Knop-link, bijvoorbeeld /contact/', { showIf: { key: 'type', equals: 'callout' } }),
  { key: 'questions', label: 'Vragen', type: 'repeater', itemLabel: 'Vraag', showIf: { key: 'type', equals: 'faq' }, fields: [t('question', 'Vraag'), ta('answer', 'Antwoord', 3)] },
];

const serviceFields: Field[] = [
  ta('summary', 'Samenvatting (bovenaan de pagina)', 3),
  ta('problem', 'Het probleem (alleen op subpagina’s)', 3),
  ta('approach', 'De aanpak', 4),
  ta('audience', 'Voor wie (alleen op hoofdpagina’s)', 3),
  lines('deliverables', 'Wat je krijgt'),
  { key: 'faq', label: 'Veelgestelde vragen', type: 'repeater', itemLabel: 'Vraag', fields: [t('question', 'Vraag'), ta('answer', 'Antwoord', 3)] },
  { key: 'contentBlocks', label: 'Extra blokken (stappenplannen en tekst)', type: 'repeater', itemLabel: 'Blok', addTypes: blockTypes, fields: blockFields, help: 'Kies met de knoppen onderaan welk blok je wilt toevoegen. Blokken staan onder “Wat je krijgt”.' },
];

const homeFields: Field[] = [
  t('heroEyebrow', 'Hero: klein label'), t('heroTitle', 'Hero: titel'), ta('heroIntro', 'Hero: inleiding'), t('heroLinkLabel', 'Hero: linktekst'),
  t('servicesTitle', 'Diensten: titel'), ta('servicesIntro', 'Diensten: inleiding'),
  t('caseTitle', 'Cases: titel'), ta('caseText', 'Cases: tekst'),
  t('processTitle', 'Werkwijze: titel'), ta('processIntro', 'Werkwijze: inleiding'),
  t('founderTitle', 'Eigenaar: naam'), t('founderRole', 'Eigenaar: functie'), ta('founderText', 'Eigenaar: tekst', 4),
  t('ctaTitle', 'Afsluitende oproep: titel'), ta('ctaText', 'Afsluitende oproep: tekst'),
];

const tarievenFields: Field[] = [
  t('heroTitle', 'Titel'), ta('heroIntro', 'Inleiding', 4),
  t('groupName', 'Naam pakketgroep'), ta('groupIntro', 'Uitleg bij de pakketten', 3),
  { key: 'tiers', label: 'Pakketten', type: 'repeater', itemLabel: 'Pakket', fields: [t('name', 'Naam'), ta('scope', 'Voor wie', 3), lines('includes', 'Wat zit erin')] },
  t('customEyebrow', 'Maatwerk: klein label'), t('customTitle', 'Maatwerk: titel'), ta('customText', 'Maatwerk: tekst', 3), lines('customPoints', 'Maatwerk: punten'),
  t('notesTitle', 'Afspraken: titel'), lines('notes', 'Afspraken: punten'),
  t('ctaTitle', 'Afsluitende oproep: titel'),
];

const overMijFields: Field[] = [
  t('name', 'Naam'), t('role', 'Functie'), ta('intro', 'Korte introductie', 3),
  t('storyTitle', 'Titel van het verhaal'), { key: 'story', label: 'Mijn verhaal', type: 'richtext', levels: [3, 4], help: 'Je kunt opgemaakte tekst plakken. Kop 1 en 2 zijn niet beschikbaar: de pagina heeft die al.' },
  lines('expertise', 'Expertise'),
  { key: 'links', label: 'Profielen (LinkedIn, Frankwatching, …)', type: 'repeater', itemLabel: 'Profiel', fields: [t('label', 'Naam'), t('href', 'URL')] },
  t('ctaTitle', 'Afsluitende oproep: titel'),
];

const pageFields: Record<PageSlug, Field[]> = { home: homeFields, tarieven: tarievenFields, 'over-mij': overMijFields };

const pageMeta: Record<PageSlug, { title: string; description: string }> = {
  home: { title: 'CF Media | SEO, GEO en webdesign', description: 'CF Media helpt je met SEO, GEO en webdesign. Maak je website beter vindbaar en prettiger in gebruik.' },
  tarieven: { title: 'Tarieven | CF Media', description: 'Bekijk hoe de tarieven van CF Media worden opgebouwd. Bedragen en voorwaarden worden per dienst transparant ingevuld.' },
  'over-mij': { title: 'Over Fabian Clemens | CF Media', description: 'Maak kennis met Fabian Clemens, eigenaar van CF Media.' },
};

const joinText = (values: Record<string, any>, keys: string[]) => keys.map((key) => String(values[key] ?? '')).join(' ');

export const collections: Record<string, CollectionDef> = {
  article: {
    label: 'Artikelen', fixed: false,
    fields: () => [
      t('title', 'Titel', { required: true }),
      t('slug', 'Webadres (slug)', { required: true, help: 'Kleine letters en koppeltekens, bijvoorbeeld wat-is-seo.' }),
      ta('description', 'Samenvatting (max. 155 tekens)', 3, { required: true }),
      { key: 'category', label: 'Categorie', type: 'select', options: opts('seo', 'geo', 'webdesign'), required: true },
      { key: 'serviceTags', label: 'Diensttags', type: 'tags', help: `Gescheiden door komma’s. Toegestaan: ${SERVICE_TAGS.join(', ')}.` },
      t('authorName', 'Auteur', { fallback: 'Fabian Clemens' }),
      t('authorJobTitle', 'Functie auteur', { fallback: 'Eigenaar van CF Media' }),
      t('coverAlt', 'Beschrijving van de coverafbeelding', { help: 'Afbeeldingen uploaden volgt in een volgende stap.' }),
      { key: 'bodyHtml', label: 'Tekst', type: 'richtext', levels: [2, 3, 4], required: true, help: 'Plak gerust opgemaakte tekst of code. Kop 1 is niet beschikbaar: elke pagina heeft al één hoofdkop.' },
    ],
    context: (slug, v) => ({ path: `/kennisbank/${v.category || 'seo'}/${slug}/`, defaultTitle: `${v.title ?? ''} | CF Media`, defaultDescription: String(v.description ?? ''), body: String(v.bodyHtml ?? v.body ?? '') }),
  },
  case: {
    label: 'Cases', fixed: false,
    fields: () => [
      t('title', 'Titel', { required: true }),
      t('slug', 'Webadres (slug)', { required: true, help: 'Kleine letters en koppeltekens.' }),
      ta('description', 'Samenvatting (max. 155 tekens)', 3, { required: true }),
      { key: 'serviceTags', label: 'Diensttags', type: 'tags', help: `Gescheiden door komma’s. Toegestaan: ${SERVICE_TAGS.join(', ')}.` },
      ta('problem', 'De vraag', 5, { required: true }),
      ta('approach', 'De aanpak', 5, { required: true }),
      ta('result', 'Het resultaat', 5, { required: true, help: 'Vermeld alleen resultaten die kloppen en waarvoor toestemming is.' }),
    ],
    context: (slug, v) => ({ path: `/cases/${slug}/`, defaultTitle: `${v.title ?? ''} | CF Media`, defaultDescription: String(v.description ?? ''), body: joinText(v, ['problem', 'approach', 'result']) }),
  },
  service: {
    label: 'Diensten', fixed: true,
    fields: () => serviceFields,
    items: () => allServicePages.map((page) => {
      const hub = services.find((item) => item.slug === page.hub)!;
      const isHub = page.slug === page.hub;
      return {
        slug: serviceKey(page.slug),
        title: isHub ? page.name : `${hub.name} › ${page.name}`,
        defaults: {
          summary: page.summary, problem: page.problem, approach: page.approach, audience: 'audience' in page ? (page as { audience: string }).audience : '',
          deliverables: page.deliverables, faq: page.faq, contentBlocks: page.contentBlocks ?? [],
        },
        meta: { path: `/diensten/${page.slug}/`, title: page.title, description: page.description },
      };
    }),
    context: (_slug, v, item) => ({ path: item?.meta.path ?? '/diensten/', defaultTitle: item?.meta.title ?? '', defaultDescription: item?.meta.description ?? '', body: joinText(v, ['summary', 'approach']) }),
  },
  page: {
    label: 'Pagina’s', fixed: true,
    fields: (slug) => pageFields[slug as PageSlug] ?? [],
    items: () => (Object.keys(pageDefaults) as PageSlug[]).map((slug) => ({
      slug, title: pageLabels[slug].label, defaults: structuredClone(pageDefaults[slug]) as Record<string, any>,
      meta: { path: pageLabels[slug].path, ...pageMeta[slug] },
    })),
    context: (_slug, v, item) => ({ path: item?.meta.path ?? '/', defaultTitle: item?.meta.title ?? '', defaultDescription: item?.meta.description ?? '', body: joinText(v, ['heroIntro', 'intro', 'story']) }),
  },
};

const escapeHtml = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const toParagraphs = (items: string[]) => items.map((item) => item.trim()).filter(Boolean).map((item) => `<p>${escapeHtml(item)}</p>`).join('');

// Zet oudere platte tekst om naar HTML, zodat de editor het kan tonen.
export function prepareValues(collection: string, slug: string, values: Record<string, any>): Record<string, any> {
  const next = { ...values };
  if (collection === 'service' && Array.isArray(next.contentBlocks)) {
    next.contentBlocks = next.contentBlocks.map((block: any) => (block.type === 'text' && !block.html && Array.isArray(block.paragraphs) ? { ...block, html: toParagraphs(block.paragraphs) } : block));
  }
  if (collection === 'page' && slug === 'over-mij' && typeof next.story === 'string' && next.story && !/^\s*</.test(next.story)) {
    next.story = toParagraphs(next.story.split(/\n\s*\n/));
  }
  return next;
}
