export interface ServiceFaq {
  question: string;
  answer: string;
}

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
}

export interface ServiceHub extends ServicePage {
  audience: string;
  process: string[];
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
  faq: [
    { question: `Wat valt onder ${name.toLowerCase()}?`, answer: `${approach} De precieze werkzaamheden bepalen we op basis van je website en vraag.` },
    { question: `Wat ontvang ik?`, answer: `Je ontvangt ${deliverables.join(', ').toLowerCase()}. We lichten de keuzes en vervolgstappen toe.` },
    { question: `Kan ik dit combineren met andere diensten?`, answer: `Ja. We bekijken welke onderdelen elkaar aanvullen en stellen alleen werk voor dat aansluit op je doelen.` },
  ],
});

const seoSubservices = [
  makeSubservice('seo', 'Technische SEO', 'technische-seo', 'Technische SEO helpt zoekmachines je website goed te crawlen en begrijpen.', 'Pagina’s zijn traag, niet indexeerbaar of technisch moeilijk te begrijpen.', 'We onderzoeken de technische basis, prioriteren knelpunten en maken verbeteringen inzichtelijk.', ['een technische analyse', 'geprioriteerde verbeterpunten', 'advies voor implementatie']),
  makeSubservice('seo', 'Contentstrategie', 'contentstrategie', 'Een contentstrategie verbindt de vragen van je doelgroep aan inhoud op je website.', 'Je publiceert zonder duidelijke keuzes in onderwerpen, zoekintentie of interne samenhang.', 'We brengen zoekvragen en bestaande content in kaart en vertalen die naar een werkbare inhoudsplanning.', ['een analyse van kansen', 'onderwerpclusters', 'een praktische contentplanning']),
  makeSubservice('seo', 'Linkbuilding', 'linkbuilding', 'Linkbuilding richt zich op relevante vermeldingen en verwijzingen naar je website.', 'Je website mist relevante verwijzingen of je weet niet welke inspanning verantwoord is.', 'We beoordelen je huidige linkprofiel en verkennen relevante, redactionele mogelijkheden.', ['een profielanalyse', 'kansrijke bronnen', 'een transparant voorstel']),
  makeSubservice('seo', 'Lokale SEO', 'lokale-seo', 'Lokale SEO maakt je bedrijf beter vindbaar voor mensen die lokaal zoeken.', 'Je bedrijf is lokaal moeilijk te vinden of je bedrijfsinformatie is niet overal gelijk.', 'We controleren je lokale vermeldingen, pagina’s en bedrijfsinformatie op duidelijkheid en consistentie.', ['een lokale vindbaarheidsanalyse', 'verbeterpunten voor je bedrijfsprofiel', 'advies voor lokale pagina’s']),
  makeSubservice('seo', 'SEO-audit', 'seo-audit', 'Een SEO-audit brengt kansen en belemmeringen voor organische vindbaarheid in kaart.', 'Je weet niet welke SEO-problemen prioriteit hebben of waar je het beste begint.', 'We onderzoeken techniek, content en interne structuur en rangschikken bevindingen op impact en inspanning.', ['een audit van je website', 'geprioriteerde bevindingen', 'een concreet actieplan']),
];

const geoSubservices = [
  makeSubservice('geo', 'AI-zichtbaarheid audit', 'ai-zichtbaarheid-audit', 'Een AI-zichtbaarheid audit onderzoekt hoe je merk en informatie terugkomen in AI-zoekervaringen.', 'Je wilt weten of AI-systemen je organisatie herkennen en je informatie kunnen gebruiken.', 'We onderzoeken relevante vragen, bronnen en de duidelijkheid van je online informatie.', ['een nulmeting', 'bevindingen per onderwerp', 'aanbevelingen voor vervolgstappen']),
  makeSubservice('geo', 'ChatGPT-optimalisatie', 'chatgpt-optimalisatie', 'ChatGPT-optimalisatie maakt betrouwbare informatie over je organisatie beter vindbaar en bruikbaar.', 'Belangrijke informatie over je merk is online versnipperd, onduidelijk of lastig te controleren.', 'We verbeteren de structuur, bronvermelding en samenhang van je openbare informatie.', ['een analyse van je online informatie', 'verbeterde inhoudsrichtlijnen', 'technische en redactionele aanbevelingen']),
  makeSubservice('geo', 'Google AI Overviews', 'google-ai-overviews', 'Optimalisatie voor Google AI Overviews versterkt de duidelijkheid en bruikbaarheid van je pagina’s.', 'Je wilt dat pagina’s vragen helder beantwoorden en hun informatie goed onderbouwen.', 'We verbinden zoekintentie, inhoudskwaliteit en technische toegankelijkheid in een gerichte analyse.', ['een pagina-analyse', 'advies voor antwoordgerichte inhoud', 'een lijst met verbeterpunten']),
];

const webdesignSubservices = [
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
    process: ['We bespreken je doelen en huidige situatie.', 'We onderzoeken techniek, content en zoekvragen.', 'We maken een plan met heldere prioriteiten.', 'We voeren verbeteringen uit en bespreken de voortgang.'],
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
    process: ['We bepalen welke vragen en AI-zoekervaringen relevant zijn.', 'We onderzoeken je website en openbare bronnen.', 'We prioriteren inhoudelijke en technische verbeteringen.', 'We evalueren de voortgang en passen het plan aan.'],
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
    process: ['We bespreken je organisatie, bezoekers en doelen.', 'We bepalen de inhoud en structuur.', 'We ontwerpen en bouwen de website.', 'We testen samen en begeleiden de livegang.'],
    subservices: webdesignSubservices, category: 'webdesign', faq: hubFaq('webdesign'),
  },
];

export const allServicePages = services.flatMap((service) => [service, ...service.subservices]);