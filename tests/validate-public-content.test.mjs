import assert from 'node:assert/strict';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const fixtures = fileURLToPath(new URL('./fixtures/', import.meta.url));

async function loadValidator() {
  return import('../scripts/validate-public-content.mjs').catch(() => ({}));
}

test('accepts documentation addresses and explicit placeholders', async () => {
  const { validatePublicContent } = await loadValidator();

  assert.equal(typeof validatePublicContent, 'function');
  const result = await validatePublicContent({ roots: [`${fixtures}safe-config.toml`] });

  assert.deepEqual(result.violations, []);
});

test('rejects a concrete WireGuard private key', async () => {
  const { validatePublicContent } = await loadValidator();

  assert.equal(typeof validatePublicContent, 'function');
  const result = await validatePublicContent({ roots: [`${fixtures}unsafe-private-key.toml`] });

  assert.equal(result.violations.length, 1);
  assert.equal(result.violations[0].rule, 'wireguard-private-key');
});

test('rejects frp credentials and private network addresses', async () => {
  const { validatePublicContent } = await loadValidator();

  assert.equal(typeof validatePublicContent, 'function');
  const tokenResult = await validatePublicContent({ roots: [`${fixtures}unsafe-frp-token.toml`] });
  const addressResult = await validatePublicContent({ roots: [`${fixtures}unsafe-private-address.md`] });

  assert.equal(tokenResult.violations[0].rule, 'frp-credential');
  assert.equal(addressResult.violations[0].rule, 'private-network-address');
});

test('does not treat a Node.js version reference as a hostname', async () => {
  const { validatePublicContent } = await loadValidator();

  assert.equal(typeof validatePublicContent, 'function');
  const result = await validatePublicContent({ roots: [`${fixtures}safe-node-runtime.md`] });

  assert.deepEqual(result.violations, []);
});

test('allows the disclosed built-in STUN endpoints', async () => {
  const { validatePublicContent } = await loadValidator();

  assert.equal(typeof validatePublicContent, 'function');
  const result = await validatePublicContent({ roots: [`${fixtures}safe-stun-disclosure.md`] });

  assert.deepEqual(result.violations, []);
});
