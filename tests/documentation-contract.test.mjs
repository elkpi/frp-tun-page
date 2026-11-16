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
    'en/releases/v0.5.2.mdx',
    'en/releases/v0.5.3.mdx',
    'en/releases/v0.5.4.mdx',
    'en/releases/v0.5.5.mdx',
    'en/releases/v0.5.6.mdx',
    'en/releases/v0.5.7.mdx',
    'en/releases/v0.5.8.mdx',
    'en/releases/v0.5.9.mdx',
    'en/releases/v0.5.10.mdx',
    'en/releases/v0.5.11.mdx',
    'en/releases/v0.5.12.mdx',
    'en/releases/v0.5.13.mdx',
  ];

  for (const page of expectedEnglishPages) {
    assert.equal(existsSync(path.join(root, 'src/content/docs', page)), true, `${page} must exist`);
  }
});

test('v0.5.11 release notes expose the official release metadata and benchmark caveats', () => {
  const chinesePath = path.join(root, 'src/content/docs/releases/v0.5.11.mdx');
  const englishPath = path.join(root, 'src/content/docs/en/releases/v0.5.11.mdx');
  assert.equal(existsSync(chinesePath), true, 'Chinese v0.5.11 release notes must exist');
  assert.equal(existsSync(englishPath), true, 'English v0.5.11 release notes must exist');

  const chinese = readFileSync(chinesePath, 'utf8');
  const english = readFileSync(englishPath, 'utf8');
  for (const content of [chinese, english]) {
    assert.match(content, /^version: v0\.5\.11$/m);
    assert.match(content, /^status: release$/m);
    assert.match(content, /^published: true$/m);
    assert.match(content, /1400B[^\n]*22\.9%/);
    assert.match(content, /3\.1[^\n]*57%/);
    assert.match(content, /-9\.2%[^\n]*-10\.1%[^\n]*(?:作废|invalidated|withdrawn|void)/i);
  }
  assert.match(chinese, /2026 年 11 月 15 日/);
  assert.match(english, /November 15, 2026/);
  assert.match(chinese, /^slug: releases\/v0\.5\.11$/m);
  assert.match(english, /^slug: en\/releases\/v0\.5\.11$/m);
});

test('v0.5.12 release notes keep batch receive as the default and refuse a performance claim', () => {
  const chinesePath = path.join(root, 'src/content/docs/releases/v0.5.12.mdx');
  const englishPath = path.join(root, 'src/content/docs/en/releases/v0.5.12.mdx');
  assert.equal(existsSync(chinesePath), true, 'Chinese v0.5.12 release notes must exist');
  assert.equal(existsSync(englishPath), true, 'English v0.5.12 release notes must exist');

  const chinese = readFileSync(chinesePath, 'utf8');
  const english = readFileSync(englishPath, 'utf8');
  for (const content of [chinese, english]) {
    assert.match(content, /^version: v0\.5\.12$/m);
    assert.match(content, /^status: release$/m);
    assert.match(content, /^published: true$/m);
    assert.match(content, /sendmmsg/);
    assert.match(content, /recvmmsg/);
    assert.match(content, /3d33430214af45958255a1112ac720a4fe20eeb60de4dda03fc92463b96cf62d/);
    assert.match(content, /128MB RAM \/ 32MB Flash/);
    assert.match(content, /64MB\/16MB/);
    assert.match(content, /10%/);
  }
  assert.match(chinese, /2026 年 11 月 15 日/);
  assert.match(english, /November 15, 2026/);
  assert.match(chinese, /^slug: releases\/v0\.5\.12$/m);
  assert.match(english, /^slug: en\/releases\/v0\.5\.12$/m);
  assert.match(chinese, /生产默认仍是批量接收/);
  assert.match(chinese, /没有切换到小包接收模式/);
  assert.match(chinese, /不宣称稳定性能收益/);
  assert.match(chinese, /诊断样本/);
  assert.match(english, /still defaults to batch receive/);
  assert.match(english, /does not switch on small-packet receive mode/);
  assert.match(english, /does not claim a stable performance gain/);
  assert.match(english, /diagnostic only/);
});

test('v0.5.13 release notes keep batch receive and treat 9.42% as below the threshold', () => {
  const chinesePath = path.join(root, 'src/content/docs/releases/v0.5.13.mdx');
  const englishPath = path.join(root, 'src/content/docs/en/releases/v0.5.13.mdx');
  assert.equal(existsSync(chinesePath), true, 'Chinese v0.5.13 release notes must exist');
  assert.equal(existsSync(englishPath), true, 'English v0.5.13 release notes must exist');

  const chinese = readFileSync(chinesePath, 'utf8');
  const english = readFileSync(englishPath, 'utf8');
  for (const content of [chinese, english]) {
    assert.match(content, /^version: v0\.5\.13$/m);
    assert.match(content, /^status: release$/m);
    assert.match(content, /^published: true$/m);
    assert.match(content, /9\.42%/);
    assert.match(content, /10%/);
    assert.match(content, /35166ebd6d111358b57b6dc6aaf4dafa0f97d587b98130fbd0f55d41783fd748/);
    assert.match(content, /128MB RAM \/ 32MB Flash/);
    assert.match(content, /64MB\/16MB/);
    assert.match(content, /rx\/1400B/);
  }
  assert.match(chinese, /2026 年 11 月 16 日/);
  assert.match(english, /November 16, 2026/);
  assert.match(chinese, /^slug: releases\/v0\.5\.13$/m);
  assert.match(english, /^slug: en\/releases\/v0\.5\.13$/m);
  assert.match(chinese, /生产默认仍是批量接收/);
  assert.match(chinese, /没有切换到小包接收模式/);
  assert.match(chinese, /不宣称稳定性能收益/);
  assert.match(english, /still defaults to batch receive/);
  assert.match(english, /does not switch on small-packet receive mode/);
  assert.match(english, /does not claim a stable performance gain/);
});

test('current release links point to v0.5.12 in both locales', () => {
  const pages = [
    ['index.mdx', '/releases/v0.5.12/'],
    ['en/index.mdx', '/en/releases/v0.5.12/'],
    ['releases/index.mdx', '/releases/v0.5.12/'],
    ['en/releases/index.mdx', '/en/releases/v0.5.12/'],
    ['configuration/openwrt.mdx', '/releases/v0.5.12/'],
    ['en/configuration/openwrt.mdx', '/en/releases/v0.5.12/'],
  ];

  for (const [page, currentReleasePath] of pages) {
    const content = readFileSync(path.join(root, 'src/content/docs', page), 'utf8');
    assert.match(content, new RegExp(currentReleasePath.replaceAll('/', '\\/')),
      `${page} must link to ${currentReleasePath}`);
    if (!page.endsWith('releases/index.mdx')) {
      assert.doesNotMatch(content, /v0\.5\.11/,
        `${page} must not retain a v0.5.11 current-version pointer`);
    }
    if (page.endsWith('configuration/openwrt.mdx')) {
      assert.match(content, /frp-tun_v0\.5\.12_/,
        `${page} must use v0.5.12 binary names`);
    }
  }

  const chineseIndex = readFileSync(path.join(root, 'src/content/docs/releases/index.mdx'), 'utf8');
  const englishIndex = readFileSync(path.join(root, 'src/content/docs/en/releases/index.mdx'), 'utf8');
  assert.match(chineseIndex, /v0\.5\.12 \(当前稳定版本\)/);
  assert.match(englishIndex, /v0\.5\.12 \(Current Stable Release\)/);
  assert.doesNotMatch(chineseIndex, /v0\.5\.11 \(当前稳定版本\)/);
  assert.doesNotMatch(englishIndex, /v0\.5\.11 \(Current Stable Release\)/);
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
