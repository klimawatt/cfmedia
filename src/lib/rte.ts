import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';

export interface RichText {
  element: HTMLElement;
  getHtml: () => string;
}

const make = <K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Record<string, string> = {}, text = '') => {
  const node = document.createElement(tag);
  for (const [name, value] of Object.entries(attrs)) node.setAttribute(name, value);
  if (text) node.textContent = text;
  return node;
};

export function createRichText(initialHtml: string, levels: number[], labelId: string, onChange: () => void): RichText {
  const root = make('div', { class: 'rte' });
  const toolbar = make('div', { class: 'rte-toolbar', role: 'toolbar', 'aria-label': 'Opmaak' });
  const surface = make('div', { class: 'rte-surface' });
  const source = make('textarea', { class: 'rte-source', rows: '12', 'aria-label': 'HTML-bron', spellcheck: 'false' });
  source.hidden = true;
  root.append(toolbar, surface, source);

  const editor = new Editor({
    element: surface,
    content: initialHtml,
    extensions: [StarterKit.configure({
      heading: { levels: levels as Array<1 | 2 | 3 | 4 | 5 | 6> },
      link: { openOnClick: false, autolink: true, HTMLAttributes: { rel: 'noopener noreferrer' } },
    })],
    editorProps: { attributes: { class: 'rte-content', role: 'textbox', 'aria-multiline': 'true', 'aria-labelledby': labelId } },
    onUpdate: onChange,
  });

  const buttons: Array<{ node: HTMLButtonElement; active?: () => boolean }> = [];
  const addButton = (label: string, title: string, run: () => void, active?: () => boolean) => {
    const node = make('button', { type: 'button', class: 'rte-button', title, 'aria-label': title }, label);
    node.addEventListener('click', () => { run(); editor.commands.focus(); });
    toolbar.append(node);
    buttons.push({ node, active });
  };

  const heading = make('select', { class: 'rte-heading', 'aria-label': 'Tekststijl' });
  heading.append(new Option('Alinea', '0'));
  for (const level of levels) heading.append(new Option(`Kop ${level}`, String(level)));
  heading.addEventListener('change', () => {
    const level = Number(heading.value);
    const chain = editor.chain().focus();
    if (level === 0) chain.setParagraph().run();
    else chain.setHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run();
  });
  toolbar.append(heading);

  addButton('B', 'Vet', () => editor.chain().toggleBold().run(), () => editor.isActive('bold'));
  addButton('I', 'Cursief', () => editor.chain().toggleItalic().run(), () => editor.isActive('italic'));
  addButton('U', 'Onderstreept', () => editor.chain().toggleUnderline().run(), () => editor.isActive('underline'));
  addButton('• Lijst', 'Opsomming', () => editor.chain().toggleBulletList().run(), () => editor.isActive('bulletList'));
  addButton('1. Lijst', 'Genummerde lijst', () => editor.chain().toggleOrderedList().run(), () => editor.isActive('orderedList'));
  addButton('“ ”', 'Citaat', () => editor.chain().toggleBlockquote().run(), () => editor.isActive('blockquote'));
  addButton('Link', 'Link toevoegen of wijzigen', () => {
    const previous = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Webadres van de link (bijvoorbeeld https://… of /contact/)', previous ?? 'https://');
    if (url === null) return;
    if (url.trim() === '') { editor.chain().unsetLink().run(); return; }
    if (!/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(url.trim())) { window.alert('Begin de link met https://, mailto:, tel: of /.'); return; }
    editor.chain().extendMarkRange('link').setLink({ href: url.trim() }).run();
  }, () => editor.isActive('link'));
  addButton('Ontlink', 'Link verwijderen', () => editor.chain().unsetLink().run());
  addButton('</>', 'Code in de regel', () => editor.chain().toggleCode().run(), () => editor.isActive('code'));
  addButton('Codeblok', 'Codeblok', () => editor.chain().toggleCodeBlock().run(), () => editor.isActive('codeBlock'));
  addButton('―', 'Horizontale lijn', () => editor.chain().setHorizontalRule().run());
  addButton('↶', 'Ongedaan maken', () => editor.chain().undo().run());
  addButton('↷', 'Opnieuw', () => editor.chain().redo().run());

  let sourceMode = false;
  const sourceToggle = make('button', { type: 'button', class: 'rte-button', title: 'HTML-bron tonen of verbergen', 'aria-pressed': 'false' }, 'HTML');
  sourceToggle.addEventListener('click', () => {
    sourceMode = !sourceMode;
    sourceToggle.setAttribute('aria-pressed', String(sourceMode));
    if (sourceMode) {
      source.value = editor.isEmpty ? '' : editor.getHTML();
      surface.hidden = true;
      source.hidden = false;
    } else {
      editor.commands.setContent(source.value, { emitUpdate: true });
      source.hidden = true;
      surface.hidden = false;
    }
    for (const { node } of buttons) node.disabled = sourceMode;
    heading.disabled = sourceMode;
  });
  source.addEventListener('input', onChange);
  toolbar.append(sourceToggle);

  const refresh = () => {
    for (const { node, active } of buttons) if (active) node.setAttribute('aria-pressed', String(active()));
    const level = levels.find((candidate) => editor.isActive('heading', { level: candidate }));
    heading.value = String(level ?? 0);
  };
  editor.on('transaction', refresh);
  refresh();

  return { element: root, getHtml: () => (sourceMode ? source.value.trim() : editor.isEmpty ? '' : editor.getHTML()) };
}
