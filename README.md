# CF Media

Statische website voor CF Media, gebouwd met Astro, Tailwind CSS 4 en Astro Content Collections. De site bevat SEO-, GEO- en webdesignpagina’s, een kennisbank, cases en contact.

Het kleurpalet gebruikt bijna-wit (`#f7f7f5`), inktzwart (`#171819`), vermiljoen (`#c43d28`) en één zachte neutrale vlaktint (`#ecece8`). `prefers-color-scheme` schakelt automatisch naar de donkere tokens.

## Lokaal starten

Vereist Node.js 24 of hoger.

```sh
npm install
npm run dev
```

Astro luistert op `0.0.0.0:4321`, zodat de preview ook direct in GitHub Codespaces bereikbaar is. Gebruik in Codespaces de doorgestuurde poort 4321.

```sh
npm run build
npm run preview
```

De statische productie-output staat in `dist/`. `npm run build` voert eerst `astro check` uit.

## Deployen

De productiebuild is statisch en kan op Netlify of Vercel worden gehost. Stel de primaire domeinnaam in op `https://www.cfmedia.nl`; canonicals, sitemap en robots-verwijzingen gebruiken dit domein. Oude `/over-ons/`-URL’s verwijzen door naar `/over-mij/` via de Netlify- en Vercel-redirectconfiguratie.

### Netlify

1. Importeer de repository in Netlify.
2. Gebruik `npm run build` als build command en `dist` als publicatiedirectory.
3. Koppel `www.cfmedia.nl` en stel dit in als primair domein.
4. Netlify Forms detecteert de formulieren `cfmedia-gesprek` en `cfmedia-contact` tijdens de deploy. Controleer daarna een echte inzending in Netlify Forms.

### Vercel

1. Importeer de repository in Vercel en gebruik Astro als framework.
2. Gebruik `npm run build` als build command en `dist` als outputdirectory.
3. Koppel `www.cfmedia.nl` en stel dit in als primair domein.
4. Het formulier gebruikt standaard Netlify Forms. Voor Vercel moet je het formulier koppelen aan bijvoorbeeld Formspree of een eigen endpoint en daarna een echte inzending testen.

## Inhoud beheren

- Diensten en FAQ’s staan centraal in `src/data/services.ts`.
- Extra dienstinhoud voeg je per hub of subdienst toe aan `contentBlocks`: `steps` voor een stappenplan of `text` voor aanvullende uitleg. Laat de renderer in `src/components/ServiceContentBlocks.astro` de vormgeving verzorgen.
- Cases zijn Markdown-bestanden in `src/content/cases/` en gebruiken het schema in `src/content.config.ts`.
- Kennisbankartikelen staan in `src/content/articles/{seo,geo,webdesign}/`.
- Artikelen vereisen titel, beschrijving, auteur, `datePublished`, `dateModified`, categorie en dienst-tags.
- Voeg optioneel `cover` en `coverAlt` toe voor een geoptimaliseerde artikelcover; `coverAlt` is verplicht zodra een cover is ingesteld.
- De zes voorbeeldartikelen hebben `draft: true` en worden niet als pagina gebouwd. Vervang eerst de auteur, foto, datums en inhoud; zet daarna `draft: false` om het artikel te publiceren.
- Cases met `draft: true` zijn alleen in de dev-preview zichtbaar. Zet een case pas op `draft: false` na controle van inhoud en toestemming; twee of drie duidelijke cases zijn voldoende om mee te beginnen.

## Routes

De site gebruikt kleine letters, koppeltekens en trailing slashes. De hoofdroutes zijn `/`, `/diensten/` met SEO-, GEO- en webdesignhubs en hun subpagina’s, `/cases/`, `/kennisbank/` met categorieën, `/tarieven/`, `/over-mij/`, `/contact/` en `/privacyverklaring/`. De eigenaarspagina `/over-mij/` wordt ook gebruikt als auteursprofiel voor kennisbankartikelen. De build maakt `/404/` en kopieert dezelfde pagina naar `404.html` voor hostingplatforms.

## Invulvelden vóór publicatie

- Nog in te vullen bedrijfsgegevens: telefoonnummer en btw-nummer. E-mail, adres en KvK zijn ingevuld in de footer, contactpagina, privacyverklaring en homepage-structured data.
- LinkedIn staat in de footer en bij de eigenaarspagina. Voeg andere socialprofielen toe aan `sameAs` zodra die bekend zijn.
- Google-profielbanner: stel `PUBLIC_GOOGLE_PROFILE_URL` in met de echte Google-profiel-URL om de knop op home en artikelen te activeren.
- Cases: klantnaam, probleem, aanpak, resultaat, dienst-tags en goedgekeurde klantlogo’s.
- Tarieven: bedragen, btw, facturatie-eenheid, scope en voorwaarden.
- Eigenaarspagina: vervang de tijdelijke portretplaceholder door de echte foto van Fabian Clemens.
- Kennisbank: auteursnaam, functie, eigenaarspagina, echte foto en publicatie-/bijwerkdatum in `YYYY-MM-DD`-vorm. Controleer de inhoud en zet daarna `draft: false`.
- Privacyverklaring: verantwoordelijke, rechtsgrond, bewaartermijn, hosting-/formulierverwerkers, eventuele doorgifte, cookies en controledatum. Laat de juridische tekst controleren op de uiteindelijke configuratie.
- Merkbestanden: controleer het tekstlogo in `public/images/cfmedia-logo.svg` en vervang zo nodig de standaard OG-afbeelding in `public/images/og-default.svg`.

De telefoon-, btw-, case-, team-, tarief- en juridische placeholders zijn bewust zichtbaar. Er zijn geen klantnamen, resultaten, reviews of teamleden verzonnen.
