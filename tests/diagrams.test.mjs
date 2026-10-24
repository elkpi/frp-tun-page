import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const diagramNames = ['direct-fallback', 'two-site-gateway', 'private-relay-hub-spoke'];

for (const name of diagramNames) {
  test(`renders ${name} from source without external assets`, () => {
    const sourceD2 = path.join(root, 'src/assets/diagrams', `${name}.d2`);
    const sourceMmd = path.join(root, 'src/assets/diagrams', `${name}.mmd`);
    const output = path.join(root, 'public/images/diagrams', `${name}.svg`);

    assert.equal(existsSync(sourceD2) || existsSync(sourceMmd), true, `${name} source must exist`);
    assert.equal(existsSync(output), true, `${name}.svg must exist`);

    const svg = readFileSync(output, 'utf8');
    assert.match(svg, /<svg\b/);
    assert.doesNotMatch(svg, /(?:href|src)=["']https?:\/\//i);
  });
}
