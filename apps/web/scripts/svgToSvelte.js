import { readdirSync, copyFileSync, readFileSync, writeFileSync } from 'fs';

const SOURCE_PATH = './src/lib/assets/icons';
const DESTINATION_PATH = './src/lib/assets/icons';

const isSVG = (file) => /.svg$/.test(file);
const removeExtension = (file) => file.split('.')[0];
const toPascalCase = (str) => str
  .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
  .map(x => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase())
  .join('');

const sourceDir = readdirSync(SOURCE_PATH);
const set = new Set(sourceDir);
let filesLength = 0;

for (const fileName of set) {
  if (!isSVG(fileName)) { continue };
  const name = `${toPascalCase(removeExtension(fileName))}.svg.svelte`;
  copyFileSync(`${SOURCE_PATH}/${fileName}`, `${DESTINATION_PATH}/${name}`);
  filesLength += 1;
}

console.log(`➜  Created ${filesLength} svelte components`);
