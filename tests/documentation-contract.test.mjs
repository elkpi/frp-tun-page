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

for (const page of configurationPages) {
  test(`${page} preserves preview and safe-example boundaries`, () => {
    const pagePath = path.join(root, 'src/content/docs', page);
    assert.equal(existsSync(pagePath), true, `${page} must exist`);

    const content = readFileSync(pagePath, 'utf8');
    assert.match(content, /适用版本：技术预览/);
    assert.match(content, /REPLACE_WITH_/);
  });
}

test('English architecture, configuration, and security entry points exist', () => {
  for (const page of ['en/architecture/index.mdx', 'en/configuration/index.mdx', 'en/security/index.mdx']) {
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
