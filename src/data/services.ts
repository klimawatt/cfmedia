import type { SeoOverride } from '../lib/cms';

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServicePlanStep {
  phase: string;
  title: string;
  description: string;
  tags: string[];
}

export interface ServiceStepsBlock {
  type: 'steps';
  eyebrow: string;
  title: string;
  intro: string;
  steps: ServicePlanStep[];
}

export interface ServiceTextBlock {
  type: 'text';
  eyebrow: string;
  title: string;
  paragraphs: string[];
}

export type ServiceContentBlock = ServiceStepsBlock | ServiceTextBlock;

export interface ServicePage {
  slug: string;
  name: string;
  title: string;
  description: string;
  summary: string;
  problem: string;
  approach: string;
  deliverables: string[];
  hub: string;
  faq: ServiceFaq[];
  contentBlocks?: ServiceContentBlock[];
  seo?: SeoOverride;
}

export interface ServiceHub extends ServicePage {
  audience: string;
  contentBlocks: ServiceContentBlock[];
  subservices: ServicePage[];
  category: string;
}

const hubFaq = (name: string): ServiceFaq[] => [
  { question: `Wat houdt ${name} in?`, answer: `${name} bestaat uit werkzaamheden die passen bij je website, doelen en beschikbare middelen. We beginnen met de vraag die je wilt oplossen.` },
  { question: `Voor wie is ${name} geschikt?`, answer: `${name} kan passen als je gericht aan je website wilt werken. In een gesprek bepalen we samen of dit aansluit op je situatie.` },
  { question: `Wat levert de samenwerking op?`, answer: `Je krijgt inzicht in de uitgevoerde werkzaamheden, gemaakte keuzes en concrete vervolgstappen. Resultaten verschillen per website en markt.` },
  { question: `Hoe lang duurt een traject?`, answer: `De doorlooptijd hangt af van de omvang van je website en de werkzaamheden. We stemmen de planning vooraf met je af.` },
  { question: `Hoe starten we?`, answer: `We bespreken je vraag, bekijken de huidige situatie en bepalen samen een passende eerste stap. Je zit nergens aan vast.` },
];

const makeSubservice = (
  hub: string,
  name: string,
  slug: string,
  summary: string,
  problem: string,
  approach: string,
  deliverables: string[],
  contentBlocks?: ServiceContentBlock[],
): ServicePage => ({
  slug: `${hub}/${slug}`,
  hub,
  name,
  title: `${name} | CF Media`,
  description: `${summary} Ontdek de aanpak van CF Media.`,
  summary,
  problem,
  approach,
  deliverables,
  ...(contentBlocks ? { contentBlocks } : {}),
  faq: [
    { question: `Wat valt onder ${name.toLowerCase()}?`, answer: `${approach} De precieze werkzaamheden bepalen we op basis van je website en vraag.` },
    { question: `Wat ontvang ik?`, answer: `Je ontvangt ${deliverables.join(', ').toLowerCase()}. We lichten de keuzes en vervolgstappen toe.` },
    { question: `Kan ik dit combineren met andere diensten?`, answer: `Ja. We bekijken welke onderdelen elkaar aanvullen en stellen alleen werk voor dat aansluit op je doelen.` },
  ],
});

const seoSubservices = [
  makeSubservice('seo', 'SEO-audit', 'seo-audit', 'Een SEO-audit is een laagdrempelige eerste opdracht: je ziet wat je website belemmert en wat voorrang heeft.', 'Je wilt met SEO aan de slag, maar weet nog niet welke technische of inhoudelijke verbeteringen de meeste aandacht vragen.', 'We onderzoeken techniek, content en interne structuur en rangschikken bevindingen op impact en inspanning. Je krijgt een helder startpunt voor vervolgwerk.', ['een audit van je website', 'geprioriteerde bevindingen', 'een concreet actieplan']),
  makeSubservice('seo', 'Technische SEO', 'technische-seo', 'Technische SEO helpt zoekmachines je website goed te crawlen en begrijpen.', 'Pagina’s zijn traag, niet indexeerbaar of technisch moeilijk te begrijpen.', 'We onderzoeken de technische basis, prioriteren knelpunten en maken verbeteringen inzichtelijk.', ['een technische analyse', 'geprioriteerde verbeterpunten', 'advies voor implementatie']),
  makeSubservice(
    'seo', 'Contentstrategie', 'contentstrategie',
    'Een contentstrategie verbindt de vragen van je doelgroep aan inhoud op je website.',
    'Je publiceert zonder duidelijke keuzes in onderwerpen, zoekintentie of interne samenhang.',
    'We brengen zoekvragen en bestaande content in kaart en vertalen die naar een werkbare inhoudsplanning.',
    ['een analyse van kansen', 'onderwerpclusters', 'een praktische contentplanning'],
    [{
      type: 'steps',
      eyebrow: 'Van zoekvraag naar redactieplan',
      title: 'Zo bouwen we je contentstrategie op',
      intro: 'We verbinden zoekgedrag, bestaande inhoud en bedrijfsdoelen tot een plan waar je redactie mee verder kan.',
      steps: [
        { phase: 'Fase 1', title: 'Doelgroep en doelen', description: 'We brengen in kaart wie je wilt bereiken, welke vragen die mensen hebben en wat de inhoud voor je organisatie moet doen.', tags: ['Doelgroep', 'Doelen', 'Zoekintentie'] },
        { phase: 'Fase 2', title: 'Zoekvragen ordenen', description: 'We onderzoeken relevante zoekvragen en groeperen ze per onderwerp en fase in de klantreis.', tags: ['Zoekwoorden', 'Onderwerpen', 'Clustering'] },
        { phase: 'Fase 3', title: 'Bestaande inhoud beoordelen', description: 'We bekijken welke pagina’s bruikbaar zijn, welke hiaten er zijn en waar inhoud elkaar mogelijk overlapt.', tags: ['Contentaudit', 'Hiaten', 'Overlap'] },
        { phase: 'Fase 4', title: 'Prioriteren en plannen', description: 'Je krijgt een haalbare inhoudsplanning met onderwerpen, paginadoelen en interne links als uitgangspunt.', tags: ['Prioriteiten', 'Briefings', 'Planning'] },
      ],
    }],
  ),
  makeSubservice('seo', 'Linkbuilding', 'linkbuilding', 'Linkbuilding richt zich op relevante vermeldingen en verwijzingen naar je website.', 'Je website mist relevante verwijzingen of je weet niet welke inspanning verantwoord is.', 'We beoordelen je huidige linkprofiel en verkennen relevante, redactionele mogelijkheden.', ['een profielanalyse', 'kansrijke bronnen', 'een transparant voorstel']),
  makeSubservice('seo', 'Lokale SEO', 'lokale-seo', 'Lokale SEO maakt je bedrijf beter vindbaar voor mensen die lokaal zoeken.', 'Je bedrijf is lokaal moeilijk te vinden of je bedrijfsinformatie is niet overal gelijk.', 'We controleren je lokale vermeldingen, pagina’s en bedrijfsinformatie op duidelijkheid en consistentie.', ['een lokale vindbaarheidsanalyse', 'verbeterpunten voor je bedrijfsprofiel', 'advies voor lokale pagina’s']),
];

const geoSubservices = [
  makeSubservice('geo', 'AI-zichtbaarheid audit', 'ai-zichtbaarheid-audit', 'Een AI-zichtbaarheid audit is een laagdrempelige eerste scan van hoe je organisatie terugkomt in AI-zoekervaringen.', 'Je wilt weten of AI-systemen je organisatie herkennen, welke bronnen ze gebruiken en wat nog onduidelijk is.', 'We onderzoeken relevante vragen, bronnen en de duidelijkheid van je online informatie. Je ontvangt een nulmeting met praktische verbeterpunten.', ['een nulmeting', 'bevindingen per onderwerp', 'aanbevelingen voor vervolgstappen']),
  makeSubservice('geo', 'ChatGPT-optimalisatie', 'chatgpt-optimalisatie', 'ChatGPT-optimalisatie maakt betrouwbare informatie over je organisatie beter vindbaar en bruikbaar.', 'Belangrijke informatie over je merk is online versnipperd, onduidelijk of lastig te controleren.', 'We verbeteren de structuur, bronvermelding en samenhang van je openbare informatie.', ['een analyse van je online informatie', 'verbeterde inhoudsrichtlijnen', 'technische en redactionele aanbevelingen']),
  makeSubservice('geo', 'Google AI Overviews', 'google-ai-overviews', 'Optimalisatie voor Google AI Overviews versterkt de duidelijkheid en bruikbaarheid van je pagina’s.', 'Je wilt dat pagina’s vragen helder beantwoorden en hun informatie goed onderbouwen.', 'We verbinden zoekintentie, inhoudskwaliteit en technische toegankelijkheid in een gerichte analyse.', ['een pagina-analyse', 'advies voor antwoordgerichte inhoud', 'een lijst met verbeterpunten']),
];

const webdesignSubservices = [
  makeSubservice('webdesign', 'SEO-vriendelijke website', 'seo-vriendelijke-website', 'Een SEO-vriendelijke website combineert een heldere structuur, toegankelijke techniek en inhoud die aansluit op zoekvragen.', 'Je bouwt een nieuwe website of vernieuwt je bestaande site en wilt organische vindbaarheid vanaf het begin meenemen.', 'We vertalen zoekvragen naar een logische paginastructuur en letten op indexeerbaarheid, interne links, metadata en prestaties.', ['een zoekgerichte sitestructuur', 'technische aandachtspunten', 'richtlijnen voor metadata en interne links']),
  makeSubservice('webdesign', 'WordPress-website', 'wordpress-website', 'Een WordPress-website geeft je een beheerbare basis voor je inhoud en online diensten.', 'Je website past niet meer bij je organisatie of is lastig zelf bij te houden.', 'We brengen inhoud en doelen in kaart en vertalen die naar een heldere structuur en maatwerkontwerp.', ['een paginastructuur', 'een responsive ontwerp', 'een beheerbare WordPress-website']),
  makeSubservice('webdesign', 'Webshop laten maken', 'webshop-laten-maken', 'Een webshop maakt je producten online vindbaar en eenvoudig bestelbaar.', 'Je wilt online verkopen, maar je huidige bestelproces sluit niet aan op je aanbod.', 'We werken aan productstructuur, duidelijke informatie en een toegankelijk bestelproces.', ['een webshopstructuur', 'een responsive ontwerp', 'een ingerichte webshop']),
  makeSubservice('webdesign', 'Website redesign', 'website-redesign', 'Een website redesign verbetert de structuur, uitstraling en werking van je bestaande website.', 'Je website voelt verouderd, werkt niet prettig of ondersteunt je doelen onvoldoende.', 'We beoordelen de bestaande website en behouden wat werkt terwijl we knelpunten aanpakken.', ['een analyse van de huidige website', 'een vernieuwd ontwerp', 'een plan voor migratie en livegang']),
];

export const services: ServiceHub[] = [
  {
    slug: 'seo', name: 'SEO', title: 'SEO: organische vindbaarheid verbeteren | CF Media',
    description: 'Verbeter de organische vindbaarheid van je website met technische SEO, contentstrategie, linkbuilding en lokale SEO.',
    summary: 'SEO helpt je website beter aansluiten op wat mensen zoeken en hoe zoekmachines pagina’s begrijpen.',
    problem: 'Je website krijgt weinig organisch bezoek of je weet niet welke verbeteringen het meeste verschil maken.',
    approach: 'We bekijken techniek, inhoud en structuur in samenhang. Daarna prioriteren we verbeteringen die passen bij je doelen.',
    deliverables: ['inzicht in je huidige vindbaarheid', 'geprioriteerd advies', 'ondersteuning bij uitvoering'],
    hub: 'seo', audience: 'SEO is relevant als je website structureel bezoekers uit zoekmachines moet aantrekken en je bereid bent te investeren in techniek en inhoud.',
    contentBlocks: [
      {
        type: 'steps', eyebrow: 'Van vraag naar plan', title: 'Zo pakken we SEO aan',
        intro: 'We beginnen met inzicht in je huidige situatie en werken toe naar verbeteringen die je team kan uitvoeren en volgen.',
        steps: [
          { phase: 'Fase 1', title: 'Doelen en uitgangspunt', description: 'We bespreken je doelen, doelgroep en huidige website. Samen bepalen we wat een goede nulmeting voor jouw situatie bevat.', tags: ['Doelen', 'Nulmeting', 'Zoekvragen'] },
          { phase: 'Fase 2', title: 'Onderzoek en prioriteiten', description: 'We onderzoeken techniek, inhoud en interne structuur. De bevindingen ordenen we op relevantie en benodigde inspanning.', tags: ['Techniek', 'Content', 'Structuur'] },
          { phase: 'Fase 3', title: 'Verbeterplan', description: 'Je krijgt een concreet plan met aanbevelingen, volgorde en uitleg voor de mensen die het werk uitvoeren.', tags: ['Aanbevelingen', 'Planning'] },
          { phase: 'Fase 4', title: 'Uitvoeren en bijsturen', description: 'We ondersteunen bij de uitvoering en bespreken wat er is aangepast en wat daarna aandacht verdient.', tags: ['Uitvoering', 'Evaluatie'] },
        ],
      },
      {
        type: 'text', eyebrow: 'Samenwerken', title: 'Inzicht vóór extra werk',
        paragraphs: ['Je weet vooraf waar we naar kijken en waarom iets prioriteit krijgt.', 'We stemmen de omvang van het werk af op je doelen, website en beschikbare middelen.'],
      },
    ],
    subservices: seoSubservices, category: 'seo', faq: hubFaq('SEO'),
  },
  {
    slug: 'geo', name: 'GEO', title: 'GEO: vindbaar in AI-zoekmachines | CF Media',
    description: 'GEO helpt je informatie beter vindbaar te maken in ChatGPT, Perplexity en Google AI Overviews.',
    summary: 'GEO staat voor Generative Engine Optimization: je informatie begrijpelijk en bruikbaar maken voor AI-zoekmachines zoals ChatGPT, Perplexity en Google AI Overviews.',
    problem: 'Je weet niet hoe AI-zoekmachines je organisatie vinden, begrijpen of noemen.',
    approach: 'We maken je openbare informatie duidelijk, controleerbaar en goed gestructureerd. GEO bouwt voort op een sterke inhoudelijke en technische basis.',
    deliverables: ['inzicht in je AI-vindbaarheid', 'advies voor betrouwbare informatie', 'prioriteiten voor je website'],
    hub: 'geo', audience: 'GEO past bij organisaties die hun informatie ook in nieuwe AI-zoekervaringen helder beschikbaar willen maken.',
    contentBlocks: [
      {
        type: 'steps', eyebrow: 'Onderzoek / verbeteren / evalueren', title: 'Een zorgvuldige GEO-aanpak',
        intro: 'GEO begint met vragen die voor je organisatie relevant zijn. We maken informatie controleerbaar voordat we verbeteringen voorstellen.',
        steps: [
          { phase: 'Fase 1', title: 'Kies relevante vragen', description: 'We bepalen welke onderwerpen en AI-zoekervaringen passen bij je doelgroep en diensten.', tags: ['Doelgroep', 'Vragen', 'Onderwerpen'] },
          { phase: 'Fase 2', title: 'Bekijk bronnen en antwoorden', description: 'We onderzoeken je website en relevante openbare bronnen. Antwoorden behandelen we als momentopname, niet als vaste belofte.', tags: ['Bronnen', 'Nulmeting'] },
          { phase: 'Fase 3', title: 'Maak informatie duidelijker', description: 'We verbeteren waar nodig de structuur, onderbouwing en samenhang van je openbare informatie.', tags: ['Inhoud', 'Bronvermelding', 'Structuur'] },
          { phase: 'Fase 4', title: 'Evalueer en stel bij', description: 'We bekijken opnieuw hoe je belangrijkste informatie wordt gevonden en bepalen welke vervolgstap passend is.', tags: ['Evaluatie', 'Vervolg'] },
        ],
      },
    ],
    subservices: geoSubservices, category: 'geo', faq: hubFaq('GEO'),
  },
  {
    slug: 'webdesign', name: 'Webdesign', title: 'Webdesign voor websites die prettig werken | CF Media',
    description: 'Laat een snelle, toegankelijke website of webshop ontwerpen die je zelf kunt beheren en die aansluit op je doelen.',
    summary: 'Goed webdesign maakt informatie helder, werkt op ieder scherm en helpt bezoekers hun doel te bereiken.',
    problem: 'Je website is lastig te gebruiken, past niet meer bij je organisatie of laat belangrijke vragen onbeantwoord.',
    approach: 'We combineren inhoud, structuur, ontwerp en techniek tot een website die voor bezoekers én beheerders werkt.',
    deliverables: ['een heldere sitestructuur', 'een responsive ontwerp', 'een toegankelijke website'],
    hub: 'webdesign', audience: 'Webdesign is geschikt als je een nieuwe website nodig hebt of een bestaande site grondig wilt verbeteren.',
    contentBlocks: [
      {
        type: 'steps', eyebrow: 'Van structuur naar livegang', title: 'Een website in heldere stappen',
        intro: 'We maken keuzes over inhoud en ontwerp voordat we bouwen, en testen de complete site voordat die live gaat.',
        steps: [
          { phase: 'Fase 1', title: 'Doelen en bezoekers', description: 'We bespreken je organisatie, bezoekers en doelen en bepalen welke taken de website moet ondersteunen.', tags: ['Doelen', 'Gebruikers', 'Inhoud'] },
          { phase: 'Fase 2', title: 'Structuur en ontwerp', description: 'We ordenen de pagina’s en werken de belangrijkste schermen uit tot een ontwerp dat je kunt beoordelen.', tags: ['Structuur', 'Wireframes', 'Ontwerp'] },
          { phase: 'Fase 3', title: 'Bouwen en invullen', description: 'We realiseren het ontwerp en plaatsen de afgesproken inhoud in een website die op verschillende schermen werkt.', tags: ['Ontwikkeling', 'Content', 'Responsive'] },
          { phase: 'Fase 4', title: 'Testen en publiceren', description: 'We controleren de pagina’s, formulieren en bediening. Daarna begeleiden we de livegang en dragen het beheer over.', tags: ['Toegankelijkheid', 'Controle', 'Livegang'] },
        ],
      },
    ],
    subservices: webdesignSubservices, category: 'webdesign', faq: hubFaq('webdesign'),
  },
];

export const allServicePages = services.flatMap((service) => [service, ...service.subservices]);

export const serviceKey = (slug: string) => slug.replace('/', '-');

const overridable = ['summary', 'problem', 'approach', 'deliverables', 'audience', 'faq', 'contentBlocks'] as const;
const hasValue = (value: unknown) => (Array.isArray(value) ? value.length > 0 : typeof value === 'string' && value.trim() !== '');

export function applyServiceOverrides(overrides: Map<string, Record<string, any>>): ServiceHub[] {
  const merge = <T extends ServicePage>(page: T): T => {
    const data = overrides.get(serviceKey(page.slug));
    if (!data) return page;
    const next: Record<string, any> = { ...page };
    for (const key of overridable) if (hasValue(data[key])) next[key] = data[key];
    if (data.seo) {
      next.seo = data.seo;
      if (data.seo.title?.trim()) next.title = data.seo.title.trim();
      if (data.seo.description?.trim()) next.description = data.seo.description.trim();
    }
    return next as T;
  };
  return services.map((hub) => ({ ...merge(hub), subservices: hub.subservices.map(merge) }));
}