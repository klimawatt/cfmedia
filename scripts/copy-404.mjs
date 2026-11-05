import { copyFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const source = fileURLToPath(new URL('../dist/404.html', import.meta.url));
const directory = fileURLToPath(new URL('../dist/404/', import.meta.url));

await mkdir(directory, { recursive: true });
await copyFile(source, `${directory}/index.html`);