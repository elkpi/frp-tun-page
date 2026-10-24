import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));

try {
  execFileSync(process.execPath, [path.join(root, 'scripts/build-diagrams.mjs')], { stdio: 'inherit' });
} catch {
  // handled in tests
}

const diagramNames = [
  'architecture-overview',
  'direct-fallback',
  'two-site-gateway',
  'private-relay-hub-spoke',
  'architecture-overview-en',
  'direct-fallback-en',
  'two-site-gateway-en',
  'private-relay-hub-spoke-en',
];

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
