import { cleanHtml } from './html';

type Block = Record<string, any>;

const el = <K extends keyof HTMLElementTagNameMap>(tag: K, cls = '', text = ''): HTMLElementTagNameMap[K] => {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text) node.textContent = text;
  return node;
};

function stepsBlock(block: Block): HTMLElement {
  const section = el('section', 'pv-block');
  const head = el('div', 'pv-head');
  head.append(el('p', 'pv-eyebrow', block.eyebrow ?? ''), el('h3', '', block.title || '(titel)'), el('p', 'pv-muted', block.intro ?? ''));
  const list = el('ol', 'pv-steps');
  ((block.steps as Block[] | undefined) ?? []).forEach((step, index) => {
    const item = el('li', 'pv-step');
    const body = el('div', 'pv-step-body');
    body.append(el('p', 'pv-phase', step.phase ?? ''), el('h4', '', step.title || '(titel van de stap)'), el('p', 'pv-muted', step.description ?? ''));
    if (Array.isArray(step.tags) && step.tags.length) body.append(el('p', 'pv-tags', step.tags.join('  /  ')));
    item.append(el('span', 'pv-marker', String(index + 1).padStart(2, '0')), body);
    list.append(item);
  });
  if (!list.children.length) list.append(el('li', 'pv-empty', 'Nog geen stappen. Voeg een stap toe.'));
  section.append(head, list);
  return section;
}

function textBlock(block: Block): HTMLElement {
  const section = el('section', 'pv-block');
  const rich = el('div', 'pv-rich');
  rich.innerHTML = cleanHtml(String(block.html ?? ''));
  section.append(el('p', 'pv-eyebrow', block.eyebrow ?? ''), el('h3', '', block.title || '(titel)'), rich);
  return section;
}

function checklistBlock(block: Block): HTMLElement {
  const section = el('section', 'pv-block');
  const list = el('ul', 'pv-checks');
  for (const item of (block.items as string[] | undefined) ?? []) list.append(el('li', '', item));
  section.append(el('p', 'pv-eyebrow', block.eyebrow ?? ''), el('h3', '', block.title || '(titel)'), list);
  return section;
}

function calloutBlock(block: Block): HTMLElement {
  const box = el('section', 'pv-callout');
  box.append(el('p', 'pv-eyebrow', block.eyebrow ?? ''), el('h3', '', block.title || '(titel)'), el('p', 'pv-muted', block.text ?? ''));
  if (block.buttonLabel) box.append(el('span', 'pv-button', `${block.buttonLabel} ↗`));
  return box;
}

function faqBlock(block: Block): HTMLElement {
  const section = el('section', 'pv-block');
  section.append(el('p', 'pv-eyebrow', block.eyebrow ?? ''), el('h3', '', block.title || '(titel)'));
  for (const question of (block.questions as Block[] | undefined) ?? []) {
    const details = el('details', 'pv-faq');
    details.append(el('summary', '', question.question || '(vraag)'), el('p', 'pv-muted', question.answer ?? ''));
    section.append(details);
  }
  return section;
}

const renderers: Record<string, (block: Block) => HTMLElement> = { steps: stepsBlock, text: textBlock, checklist: checklistBlock, callout: calloutBlock, faq: faqBlock };

// Toont blokken of artikeltekst zoals ze ongeveer op de site komen.
export function renderPreview(values: Record<string, any>): HTMLElement | null {
  if (Array.isArray(values.contentBlocks)) {
    const wrap = el('div', 'pv');
    for (const block of values.contentBlocks as Block[]) wrap.append((renderers[block.type] ?? textBlock)(block));
    if (!wrap.children.length) wrap.append(el('p', 'pv-empty', 'Nog geen extra blokken. Kies hierboven welk blok je wilt toevoegen.'));
    return wrap;
  }
  if (typeof values.bodyHtml === 'string') {
    const wrap = el('div', 'pv');
    const rich = el('div', 'pv-rich');
    rich.innerHTML = cleanHtml(values.bodyHtml);
    wrap.append(el('h3', '', values.title || '(titel)'), rich);
    return wrap;
  }
  return null;
}
