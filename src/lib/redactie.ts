import { createClient } from '@supabase/supabase-js';
import { collections, seoFields, SERVICE_TAGS, type CollectionDef, type Field, type FixedItem } from './cms-schema';

interface Row { id: string; collection: string; slug: string; title: string; data: Record<string, any>; status: 'draft' | 'published'; version: number; published_at: string | null }
interface Current { row?: Row; item?: FixedItem; slug: string; title: string }

const supabase = createClient(import.meta.env.PUBLIC_SUPABASE_URL, import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY);
const $ = <T extends HTMLElement>(selector: string) => document.querySelector<T>(selector)!;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

let active = 'article';
let rows: Row[] = [];
let current: Current | null = null;

function make<K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Record<string, string> = {}, text = ''): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  for (const [name, value] of Object.entries(attrs)) node.setAttribute(name, value);
  if (text) node.textContent = text;
  return node;
}

function setStatus(message: string, kind: 'info' | 'error' | 'ok' = 'info') {
  const node = $('#redactie-status');
  node.textContent = message;
  node.dataset.kind = kind;
}

const slugify = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const getPath = (obj: any, path: string) => path.split('.').reduce((acc: any, key) => (acc == null ? undefined : acc[key]), obj);

function setPath(obj: any, path: string, value: unknown) {
  const keys = path.split('.');
  let node = obj;
  for (const key of keys.slice(0, -1)) node = node[key] ??= {};
  node[keys[keys.length - 1]] = value;
}

// ---------- Formulier opbouwen ----------

function buildFields(fields: Field[], values: Record<string, any>, container: HTMLElement) {
  for (const field of fields) container.append(buildField(field, getPath(values, field.key)));
  const apply = () => {
    for (const field of fields) {
      if (!field.showIf) continue;
      const control = container.querySelector<HTMLSelectElement>(`:scope > [data-key="${field.showIf.key}"] > .ctl`);
      const wrap = container.querySelector<HTMLElement>(`:scope > [data-key="${field.key}"]`);
      if (control && wrap) wrap.hidden = control.value !== field.showIf.equals;
    }
  };
  container.addEventListener('change', apply);
  apply();
}

function buildField(field: Field, value: unknown): HTMLElement {
  const wrap = make('div', { class: 'field', 'data-key': field.key });
  if (field.type === 'repeater') return buildRepeater(field, wrap, value);

  const id = `f-${Math.random().toString(36).slice(2)}`;
  wrap.append(make('label', { for: id }, field.required ? `${field.label} *` : field.label));
  let control: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
  if (field.type === 'textarea' || field.type === 'lines') control = make('textarea', { rows: String(field.rows ?? 5) });
  else if (field.type === 'select') {
    control = make('select');
    for (const option of field.options ?? []) control.append(new Option(option.label, option.value));
  } else control = make('input', { type: 'text' });
  control.id = id;
  control.classList.add('ctl');
  let initial: unknown = value;
  if (initial === undefined || initial === null || initial === '') initial = field.fallback ?? (field.type === 'select' ? field.options?.[0]?.value : '');
  control.value = Array.isArray(initial) ? initial.join(field.type === 'lines' ? '\n' : ', ') : String(initial ?? '');
  wrap.append(control);
  if (field.help) wrap.append(make('p', { class: 'help' }, field.help));
  return wrap;
}

function buildRepeater(field: Field, wrap: HTMLElement, value: unknown): HTMLElement {
  wrap.classList.add('repeater');
  wrap.append(make('span', { class: 'repeater-label' }, field.label));
  if (field.help) wrap.append(make('p', { class: 'help' }, field.help));
  const list = make('div', { class: 'repeater-items' });
  wrap.append(list);
  const add = (item: Record<string, any>) => {
    list.append(buildItem(field, item, list));
    renumber(field, list);
  };
  for (const item of Array.isArray(value) ? value : []) add(item as Record<string, any>);
  const addButton = make('button', { type: 'button', class: 'redactie-button small' }, `+ ${field.itemLabel ?? 'Item'} toevoegen`);
  addButton.addEventListener('click', () => { add({}); refreshSeo(); });
  wrap.append(addButton);
  return wrap;
}

function buildItem(field: Field, values: Record<string, any>, list: HTMLElement): HTMLElement {
  const item = make('fieldset', { class: 'repeater-item' });
  item.append(make('legend'));
  const bar = make('div', { class: 'item-bar' });
  const actions: Array<[string, () => void]> = [
    ['Omhoog', () => { const previous = item.previousElementSibling; if (previous) list.insertBefore(item, previous); }],
    ['Omlaag', () => { const next = item.nextElementSibling; if (next) list.insertBefore(next, item); }],
    ['Verwijderen', () => item.remove()],
  ];
  for (const [label, run] of actions) {
    const button = make('button', { type: 'button', class: 'redactie-button small', 'aria-label': `${label}: ${field.itemLabel ?? 'item'}` }, label);
    button.addEventListener('click', () => { run(); renumber(field, list); refreshSeo(); });
    bar.append(button);
  }
  item.append(bar);
  const holder = make('div', { class: 'item-fields' });
  buildFields(field.fields ?? [], values, holder);
  item.append(holder);
  return item;
}

function renumber(field: Field, list: HTMLElement) {
  list.querySelectorAll(':scope > .repeater-item > legend').forEach((legend, index) => {
    legend.textContent = `${field.itemLabel ?? 'Item'} ${index + 1}`;
  });
}

// ---------- Formulier uitlezen ----------

function readFields(fields: Field[], container: HTMLElement): Record<string, any> {
  const flat: Record<string, any> = {};
  for (const field of fields) {
    const wrap = container.querySelector<HTMLElement>(`:scope > [data-key="${field.key}"]`);
    if (wrap) flat[field.key] = readField(field, wrap);
  }
  const out: Record<string, any> = {};
  for (const field of fields) {
    if (field.showIf && flat[field.showIf.key] !== field.showIf.equals) continue;
    if (field.key in flat) setPath(out, field.key, flat[field.key]);
  }
  return out;
}

function readField(field: Field, wrap: HTMLElement): any {
  if (field.type === 'repeater') {
    return [...wrap.querySelectorAll<HTMLElement>(':scope > .repeater-items > .repeater-item')]
      .map((item) => readFields(field.fields ?? [], item.querySelector<HTMLElement>(':scope > .item-fields')!));
  }
  const control = wrap.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(':scope > .ctl')!;
  const value = control.value.trim();
  if (field.type === 'tags') return value.split(',').map((tag) => tag.trim()).filter(Boolean);
  if (field.type === 'lines') return value.split('\n').map((line) => line.trim()).filter(Boolean);
  return value;
}

function collect(): Record<string, any> {
  const def = collections[active];
  const content = readFields(def.fields(current!.slug), $('#editor-fields'));
  const seo = readFields(seoFields, $('#seo-fields')).seo ?? {};
  for (const key of Object.keys(seo)) if (!seo[key]) delete seo[key];
  if (seo.noindex === 'nee') delete seo.noindex;
  return Object.keys(seo).length ? { ...content, seo } : content;
}

// ---------- SEO-paneel ----------

function refreshSeo() {
  if (!current) return;
  const def = collections[active];
  const values = collect();
  const slug = def.fixed ? current.slug : String(values.slug ?? '');
  const context = def.context(slug, values, current.item);
  const seo = values.seo ?? {};
  const title: string = seo.title || context.defaultTitle;
  const description: string = seo.description || context.defaultDescription;
  const keyword = String(seo.focusKeyword ?? '').toLowerCase().trim();

  const preview = $('#seo-preview');
  preview.replaceChildren(
    make('span', { class: 'snippet-url' }, `https://www.cfmedia.nl${context.path}`),
    make('span', { class: 'snippet-title' }, title || '(geen titel)'),
    make('span', { class: 'snippet-description' }, description.length > 155 ? `${description.slice(0, 152)}…` : description || '(geen omschrijving)'),
  );

  const checks: Array<[boolean, string]> = [
    [title.length >= 30 && title.length <= 60, `SEO-titel: ${title.length} tekens (ideaal 30 tot 60)`],
    [description.length >= 70 && description.length <= 155, `Meta-omschrijving: ${description.length} tekens (ideaal 70 tot 155)`],
  ];
  if (keyword) {
    checks.push(
      [title.toLowerCase().includes(keyword), 'Focuszoekwoord staat in de titel'],
      [description.toLowerCase().includes(keyword), 'Focuszoekwoord staat in de meta-omschrijving'],
      [context.body.toLowerCase().includes(keyword), 'Focuszoekwoord komt voor in de tekst'],
      [context.path.includes(slugify(keyword)), 'Focuszoekwoord staat in de URL'],
    );
  } else checks.push([false, 'Vul een focuszoekwoord in voor extra controles']);
  const list = $('#seo-checks');
  list.replaceChildren(...checks.map(([ok, text]) => make('li', { class: ok ? 'ok' : 'bad' }, `${ok ? '✓' : '✗'} ${text}`)));
}

// ---------- Lijst en editor ----------

function renderList() {
  const def = collections[active];
  const list = $('#entry-list');
  list.replaceChildren();
  const addEntry = (title: string, badge: string, published: boolean, open: () => void) => {
    const button = make('button', { type: 'button', class: 'redactie-item' }, title);
    button.append(make('span', { class: 'badge', 'data-status': published ? 'published' : 'draft' }, badge));
    button.addEventListener('click', open);
    const item = make('li');
    item.append(button);
    list.append(item);
  };
  if (def.fixed) {
    for (const item of def.items!()) {
      const row = rows.find((candidate) => candidate.slug === item.slug);
      const badge = !row ? 'Standaardtekst' : row.status === 'published' ? 'Aangepast en gepubliceerd' : 'Concept (nog niet live)';
      addEntry(item.title, badge, row?.status === 'published', () => openEditor({ row, item, slug: item.slug, title: item.title }, { ...item.defaults, ...(row?.data ?? {}) }));
    }
    return;
  }
  for (const row of rows) addEntry(row.title, row.status === 'published' ? 'Gepubliceerd' : 'Concept', row.status === 'published', () => openEditor({ row, slug: row.slug, title: row.title }, { ...row.data, title: row.title, slug: row.slug }));
  if (!rows.length) list.append(make('li', { class: 'redactie-empty' }, 'Nog geen inhoud in deze lijst.'));
}

function openEditor(next: Current, values: Record<string, any>) {
  current = next;
  const def: CollectionDef = collections[active];
  $('#editor').hidden = false;
  $('#editor-title').textContent = def.fixed ? `Bewerken: ${next.title}` : next.row ? `Bewerken: ${next.title}` : `Nieuw: ${def.label.toLowerCase()}`;
  const host = $('#editor-fields');
  host.replaceChildren();
  buildFields(def.fields(next.slug), values, host);
  const seoHost = $('#seo-fields');
  seoHost.replaceChildren();
  buildFields(seoFields, values, seoHost);
  if (!def.fixed && !next.row) {
    const titleControl = host.querySelector<HTMLInputElement>(':scope > [data-key="title"] > .ctl');
    const slugControl = host.querySelector<HTMLInputElement>(':scope > [data-key="slug"] > .ctl');
    titleControl?.addEventListener('input', () => { if (slugControl) slugControl.value = slugify(titleControl.value); });
  }
  const published = next.row?.status === 'published';
  $('#save-draft').textContent = published ? 'Terugzetten naar concept (haalt offline)' : 'Opslaan als concept';
  $('#publish').textContent = published ? 'Wijzigingen publiceren' : 'Publiceren';
  const remove = $('#delete-entry');
  remove.hidden = !next.row;
  remove.textContent = def.fixed ? 'Terug naar standaardtekst' : 'Verwijderen';
  refreshSeo();
}

async function loadRows() {
  const { data, error } = await supabase.from('content_entries').select('id, collection, slug, title, data, status, version, published_at').eq('collection', active).order('updated_at', { ascending: false });
  if (error) { setStatus(`Laden mislukt: ${error.message}`, 'error'); return; }
  rows = (data ?? []) as Row[];
  renderList();
}

// ---------- Opslaan ----------

function validate(def: CollectionDef, values: Record<string, any>, publishing: boolean): string[] {
  const errors: string[] = [];
  if (!def.fixed) {
    if (!values.title) errors.push('Vul een titel in.');
    if (!SLUG_PATTERN.test(String(values.slug ?? ''))) errors.push('Het webadres mag alleen kleine letters, cijfers en koppeltekens bevatten.');
    if (String(values.description ?? '').length > 155) errors.push('De samenvatting is langer dan 155 tekens.');
    const badTags = ((values.serviceTags as string[] | undefined) ?? []).filter((tag) => !SERVICE_TAGS.includes(tag));
    if (badTags.length) errors.push(`Onbekende diensttags: ${badTags.join(', ')}.`);
    if (publishing) for (const field of def.fields(current!.slug)) if (field.required && !values[field.key]) errors.push(`Vul “${field.label}” in om te publiceren.`);
  }
  const seo = values.seo ?? {};
  if (seo.canonical && !/^https?:\/\//.test(seo.canonical)) errors.push('De canonical-URL moet beginnen met https://.');
  if (seo.ogImage && !/^https?:\/\//.test(seo.ogImage)) errors.push('De deelafbeelding moet een volledige URL zijn (https://).');
  return errors;
}

const saveError = (error: { code?: string; message: string }) => (error.code === '23505' ? 'Dit webadres bestaat al in deze lijst.' : `Opslaan mislukt: ${error.message}`);

async function save(status: 'draft' | 'published') {
  if (!current) return;
  const def = collections[active];
  const values = collect();
  const errors = validate(def, values, status === 'published');
  if (errors.length) { setStatus(errors.join(' '), 'error'); return; }

  let slug = current.slug;
  let title = current.title;
  const data: Record<string, any> = { ...values };
  if (!def.fixed) {
    slug = String(values.slug);
    title = String(values.title);
    delete data.slug;
    delete data.title;
  }
  if (active === 'article') {
    const today = new Date().toISOString().slice(0, 10);
    const previous = current.row?.data ?? {};
    data.datePublished = status === 'published' ? previous.datePublished ?? today : previous.datePublished;
    data.dateModified = status === 'published' ? today : previous.dateModified;
  }
  const payload = { collection: active, slug, title, data, status, published_at: status === 'published' ? (current.row?.published_at ?? new Date().toISOString()) : null };

  setStatus('Opslaan…');
  let saved: Row | undefined;
  if (current.row) {
    const { data: updated, error } = await supabase.from('content_entries').update(payload).eq('id', current.row.id).eq('version', current.row.version).select();
    if (error) { setStatus(saveError(error), 'error'); return; }
    if (!updated?.length) { setStatus('Dit item is intussen door iemand anders gewijzigd. Laad het opnieuw en probeer het nog een keer.', 'error'); return; }
    saved = updated[0] as Row;
  } else {
    const { data: inserted, error } = await supabase.from('content_entries').insert(payload).select().single();
    if (error) { setStatus(saveError(error), 'error'); return; }
    saved = inserted as Row;
  }
  setStatus(status === 'published' ? 'Gepubliceerd. De website toont dit na de volgende build.' : 'Opgeslagen als concept. Het staat niet live.', 'ok');
  await loadRows();
  const item = def.fixed ? def.items!().find((candidate) => candidate.slug === saved!.slug) : undefined;
  openEditor({ row: saved, item, slug: saved.slug, title: saved.title }, { ...(item?.defaults ?? {}), ...saved.data, title: saved.title, slug: saved.slug });
}

async function remove() {
  if (!current?.row) return;
  const def = collections[active];
  const question = def.fixed ? `Terug naar de standaardtekst van “${current.title}”? Jouw aanpassingen worden gewist.` : `“${current.title}” definitief verwijderen?`;
  if (!confirm(question)) return;
  const { error } = await supabase.from('content_entries').delete().eq('id', current.row.id);
  if (error) { setStatus(`Verwijderen mislukt: ${error.message}`, 'error'); return; }
  current = null;
  $('#editor').hidden = true;
  setStatus(def.fixed ? 'Teruggezet naar de standaardtekst.' : 'Verwijderd.', 'ok');
  await loadRows();
}

// ---------- Inloggen en opstarten ----------

function showApp(isEditor: boolean) {
  $('#login-form').hidden = isEditor;
  $('#redactie-app').hidden = !isEditor;
  if (isEditor) void loadRows();
}

async function checkSession() {
  const { data } = await supabase.auth.getSession();
  if (!data.session) { showApp(false); return; }
  const { data: editor, error } = await supabase.from('editors').select('user_id').maybeSingle();
  if (error) { setStatus(`De database is nog niet klaar (${error.message}). Voer eerst schema.sql uit in Supabase.`, 'error'); showApp(false); return; }
  if (!editor) { setStatus('Je bent ingelogd, maar je account staat nog niet in de tabel editors. Voer de insert-regel uit schema.sql uit met je e-mailadres.', 'error'); showApp(false); return; }
  setStatus('');
  showApp(true);
}

function switchCollection(key: string) {
  active = key;
  current = null;
  $('#editor').hidden = true;
  $('#new-entry').hidden = collections[key].fixed;
  void loadRows();
}

const select = $<HTMLSelectElement>('#collection-select');
for (const [key, definition] of Object.entries(collections)) select.append(new Option(definition.label, key));
select.value = active;
select.addEventListener('change', () => switchCollection(select.value));

$('#new-entry').addEventListener('click', () => openEditor({ slug: '', title: '' }, {}));
$('#save-draft').addEventListener('click', () => void save('draft'));
$('#publish').addEventListener('click', () => void save('published'));
$('#delete-entry').addEventListener('click', () => void remove());
$('#editor').addEventListener('input', refreshSeo);
$('#editor').addEventListener('change', refreshSeo);
$('#logout').addEventListener('click', async () => { await supabase.auth.signOut(); current = null; $('#editor').hidden = true; setStatus('Uitgelogd.'); showApp(false); });

$('#login-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  setStatus('Inloggen…');
  const { error } = await supabase.auth.signInWithPassword({ email: $<HTMLInputElement>('#login-email').value.trim(), password: $<HTMLInputElement>('#login-password').value });
  if (error) { setStatus('Inloggen mislukt. Controleer je e-mailadres en wachtwoord.', 'error'); return; }
  await checkSession();
});

void checkSession();
