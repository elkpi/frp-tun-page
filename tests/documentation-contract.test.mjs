import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const architecturePages = [
  ['architecture/index.mdx', 'architecture-overview.svg'],
  ['architecture/direct-fallback.mdx', 'direct-fallback.svg'],
  ['architecture/two-site-gateway.mdx', 'two-site-gateway.svg'],
  ['architecture/private-relay.mdx', 'private-relay-hub-spoke.svg'],
];
const configurationPages = [
  'configuration/full-reference.mdx',
  'configuration/minimal-two-site.mdx',
  'configuration/dual-stack-qos.mdx',
  'configuration/openwrt.mdx',
];

for (const [page, diagram] of architecturePages) {
  test(`${page} explains its local topology diagram`, () => {
    const pagePath = path.join(root, 'src/content/docs', page);
    assert.equal(existsSync(pagePath), true, `${page} must exist`);

    const content = readFileSync(pagePath, 'utf8');
    assert.match(content, new RegExp(`!\\[[^\\]]+\\]\\([^)]*${diagram}\\)`));
    assert.match(content, /适用版本：技术预览/);
  });
}

const englishArchitecturePages = [
  ['en/architecture/index.mdx', 'architecture-overview-en.svg'],
  ['en/architecture/direct-fallback.mdx', 'direct-fallback-en.svg'],
  ['en/architecture/two-site-gateway.mdx', 'two-site-gateway-en.svg'],
  ['en/architecture/private-relay.mdx', 'private-relay-hub-spoke-en.svg'],
];

for (const [page, diagram] of englishArchitecturePages) {
  test(`${page} explains its local topology diagram`, () => {
    const pagePath = path.join(root, 'src/content/docs', page);
    assert.equal(existsSync(pagePath), true, `${page} must exist`);

    const content = readFileSync(pagePath, 'utf8');
    assert.match(content, new RegExp(`!\\[[^\\]]+\\]\\([^)]*${diagram}\\)`));
    assert.match(content, /Applicable version: technical preview/i);
  });
}

for (const page of configurationPages) {
  test(`${page} preserves preview and safe-example boundaries`, () => {
    const pagePath = path.join(root, 'src/content/docs', page);
    assert.equal(existsSync(pagePath), true, `${page} must exist`);

    const content = readFileSync(pagePath, 'utf8');
    assert.match(content, /适用版本：技术预览/);
    assert.match(content, /REPLACE_WITH_/);
  });
}

test('all documentation pages have an English counterpart', () => {
  const expectedEnglishPages = [
    'en/index.mdx',
    'en/getting-started/index.mdx',
    'en/architecture/index.mdx',
    'en/architecture/direct-fallback.mdx',
    'en/architecture/two-site-gateway.mdx',
    'en/architecture/private-relay.mdx',
    'en/configuration/index.mdx',
    'en/configuration/full-reference.mdx',
    'en/configuration/minimal-two-site.mdx',
    'en/configuration/dual-stack-qos.mdx',
    'en/configuration/openwrt.mdx',
    'en/operations/index.mdx',
    'en/operations/cli-reference.mdx',
    'en/operations/upgrade-rollback.mdx',
    'en/operations/troubleshooting.mdx',
    'en/security/index.mdx',
    'en/security/privacy.mdx',
    'en/security/support-and-disclosure.mdx',
    'en/releases/index.mdx',
    'en/releases/v0.5.1.mdx',
  ];

  for (const page of expectedEnglishPages) {
    assert.equal(existsSync(path.join(root, 'src/content/docs', page)), true, `${page} must exist`);
  }
});

test('sidebar configuration translates all custom Chinese labels for English', () => {
  const config = readFileSync(path.join(root, 'astro.config.mjs'), 'utf8');
  const englishLabels = [
    'Get started',
    'Project overview',
    'Architecture',
    'Architecture overview',
    'P2P & relay fallback',
    'Two-site gateway',
    'Private relay hub',
    'Configuration',
    'Configuration overview',
    'Full configuration reference',
    'Minimal two-site configuration',
    'Dual-stack & QoS configuration',
    'OpenWrt notes',
    'Operations & security',
    'CLI reference',
    'Upgrade & rollback',
    'Troubleshooting',
    'Security boundaries',
    'Privacy policy',
    'Security disclosure & support',
    'Release notes',
  ];

  for (const label of englishLabels) {
    assert.match(config, new RegExp(`translations: \\{ en: '${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}' \\}`));
  }
});
