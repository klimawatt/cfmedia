export interface TierDefault { name: string; scope: string; includes: string[] }

export const pageDefaults = {
  home: {
    heroEyebrow: 'CF Media · SEO / GEO / webdesign',
    heroTitle: 'Je website verdient een plek in beeld.',
    heroIntro: 'We maken je online verhaal beter vindbaar, begrijpelijker en klaar om bezoekers verder te helpen.',
    heroLinkLabel: 'Ontdek wat we doen',
    servicesTitle: 'Drie disciplines. Eén sterke basis.',
    servicesIntro: 'Je kiest wat je nodig hebt. We verbinden de onderdelen waar dat zinvol is.',
    caseTitle: 'Goed werk laat zich zien.',
    caseText: 'We delen cases zodra de klantnaam, aanpak en uitkomst goedgekeurd zijn.',
    processTitle: 'Geen mist. Wel een volgende stap.',
    processIntro: 'Je weet waar we aan werken en waarom dat de prioriteit krijgt.',
    founderTitle: 'Fabian Clemens',
    founderRole: 'Eigenaar van CF Media',
    founderText: 'Mijn persoonlijke verhaal voeg ik later toe. CF Media helpt organisaties met SEO, GEO en webdesign.',
    ctaTitle: 'Plan een kennismakingsgesprek.',
    ctaText: 'Vertel waar je aan werkt. We denken mee over een passende eerste stap voor je website.',
  },
  tarieven: {
    heroTitle: 'Een pakket dat past bij je website.',
    heroIntro: 'SEO en GEO bieden we samen aan in drie niveaus. De juiste omvang hangt af van je website, aanbod en doelen. Bedragen bespreken we in een voorstel op basis van de afgesproken scope.',
    groupName: 'SEO + GEO',
    groupIntro: 'In elk niveau combineren we organische vindbaarheid met zichtbaarheid in AI-zoekervaringen. De omvang bepaalt hoe diep we je website, content en bronnen onderzoeken.',
    tiers: [
      { name: 'Fundament', scope: 'Voor een compacte website en een eerste, afgebakende optimalisatieslag.', includes: ['SEO: techniek, indexeerbaarheid en belangrijkste pagina’s', 'GEO: AI-zichtbaarheid van je belangrijkste diensten', 'Gecombineerde prioriteitenlijst voor de eerste verbeteringen'] },
      { name: 'Groei', scope: 'Voor websites met meerdere diensten, doelgroepen of contentclusters.', includes: ['SEO: techniek, content en interne links per thema', 'GEO: vragen, bronnen en inhoud per onderwerpcluster', 'Gezamenlijk werkplan met prioriteiten per onderdeel'] },
      { name: 'Schaal', scope: 'Voor grote websites, uitgebreide contentstructuren of meerdere locaties.', includes: ['SEO: brede technische en inhoudelijke analyse', 'GEO: zichtbaarheid en bronstructuur over meerdere onderdelen', 'Gefaseerde roadmap voor SEO- en GEO-verbeteringen'] },
    ] as TierDefault[],
    customEyebrow: 'Webdesign / maatwerk',
    customTitle: 'Jouw website vraagt om een eigen plan.',
    customText: 'Een website of webshop is geen standaardpakket. We stemmen de structuur, functionaliteit, inhoud en planning af op jouw project.',
    customPoints: ['Website of webshop op basis van je doelen', 'Scope, planning en oplevering vooraf besproken', 'SEO, toegankelijkheid en contentstructuur meegenomen'],
    notesTitle: 'Dit spreken we samen af.',
    notes: ['De werkzaamheden en grenzen van de opdracht.', 'De prijs en eventuele btw in je voorstel.', 'De planning en wat we van elkaar nodig hebben.', 'Hoe we omgaan met wijzigingen buiten de afgesproken scope.'],
    ctaTitle: 'Leg je situatie aan ons voor.',
  },
  'over-mij': {
    name: 'Fabian Clemens',
    role: 'Eigenaar van CF Media',
    intro: 'Ik ben eigenaar van CF Media. Mijn persoonlijke verhaal voeg ik later toe.',
    storyTitle: 'Mijn verhaal volgt.',
    story: '[Mijn verhaal later toevoegen.]',
    expertise: ['SEO', 'GEO', 'Webdesign'],
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/fabian-clemens-0675bbaa/' },
      { label: 'Frankwatching', href: 'https://www.frankwatching.com/archive/author/fabian-clemens/' },
    ],
    ctaTitle: 'Heb je een vraag over je website of content?',
  },
};

export type PageSlug = keyof typeof pageDefaults;

export const pageLabels: Record<PageSlug, { label: string; path: string }> = {
  home: { label: 'Homepage', path: '/' },
  tarieven: { label: 'Tarieven', path: '/tarieven/' },
  'over-mij': { label: 'Over mij', path: '/over-mij/' },
};
