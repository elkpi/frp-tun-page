import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));

function workflow(name) {
  const file = path.join(root, '.github/workflows', name);
  assert.equal(existsSync(file), true, `${name} must exist`);
  return readFileSync(file, 'utf8');
}

test('CI validates the static site on a GitHub-hosted runner only', () => {
  const content = workflow('ci.yml');

  assert.match(content, /ubuntu-24\.04/);
  assert.doesNotMatch(content, /self-hosted/i);
  assert.doesNotMatch(content, /secrets\./i);
  assert.match(content, /npm ci/);
  assert.match(content, /npm run check/);
  assert.match(content, /npm test/);
  assert.match(content, /npm run build/);
});

test('Pages deployment requires manual dispatch and explicit release approval', () => {
  const content = workflow('deploy-pages.yml');

  assert.match(content, /workflow_dispatch:/);
  assert.match(content, /PUBLIC_RELEASE_APPROVED == 'true'/);
  assert.match(content, /ubuntu-24\.04/);
  assert.doesNotMatch(content, /self-hosted/i);
  assert.doesNotMatch(content, /secrets\./i);
  assert.match(content, /contents:\s*read/);
  assert.match(content, /pages:\s*write/);
  assert.match(content, /id-token:\s*write/);
});
