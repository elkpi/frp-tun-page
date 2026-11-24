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
    'en/releases/v0.5.14.mdx',
    'en/releases/v0.5.15.mdx',
    'en/releases/v0.5.16.mdx',
    'en/releases/v0.5.17.mdx',
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

test('v0.5.14 release notes hand ciphertext in-process and keep fixture gains below the threshold', () => {
  const chinesePath = path.join(root, 'src/content/docs/releases/v0.5.14.mdx');
  const englishPath = path.join(root, 'src/content/docs/en/releases/v0.5.14.mdx');
  assert.equal(existsSync(chinesePath), true, 'Chinese v0.5.14 release notes must exist');
  assert.equal(existsSync(englishPath), true, 'English v0.5.14 release notes must exist');

  const chinese = readFileSync(chinesePath, 'utf8');
  const english = readFileSync(englishPath, 'utf8');
  for (const content of [chinese, english]) {
    assert.match(content, /^version: v0\.5\.14$/m);
    assert.match(content, /^status: release$/m);
    assert.match(content, /^published: true$/m);
    assert.match(content, /GOMAXPROCS=2/);
    assert.match(content, /1024/);
    assert.match(content, /[−-]27\.7%/);
    assert.match(content, /[−-]11\.8%/);
    assert.match(content, /[−-]30\.2%/);
    assert.match(content, /[−-]17\.1%/);
    assert.match(content, /0f36d37fae85f7732455a9a4be9fba3d8ed6045c8ca387b1a4692ea3b53cd081/);
    assert.match(content, /128MB RAM \/ 32MB Flash/);
    assert.match(content, /64MB\/16MB/);
    assert.match(content, /peer/);
  }
  assert.match(chinese, /2026 年 11 月 18 日/);
  assert.match(english, /November 18, 2026/);
  assert.match(chinese, /^slug: releases\/v0\.5\.14$/m);
  assert.match(english, /^slug: en\/releases\/v0\.5\.14$/m);
  assert.match(chinese, /loopback UDP/);
  assert.match(chinese, /进程内按 peer 队列/);
  assert.match(chinese, /不构成默认路径已通过生产接线样本门槛的证明/);
  assert.match(english, /in-process per-peer queues/);
  assert.match(english, /do not prove the default path passed a production-wiring sample threshold/);
});


test('v0.5.15 release notes document tun-quic, interoperability, and the checksum manifest', () => {
  const chinesePath = path.join(root, 'src/content/docs/releases/v0.5.15.mdx');
  const englishPath = path.join(root, 'src/content/docs/en/releases/v0.5.15.mdx');
  assert.equal(existsSync(chinesePath), true, 'Chinese v0.5.15 release notes must exist');
  assert.equal(existsSync(englishPath), true, 'English v0.5.15 release notes must exist');

  const chinese = readFileSync(chinesePath, 'utf8');
  const english = readFileSync(englishPath, 'utf8');
  for (const content of [chinese, english]) {
    assert.match(content, /^version: v0\.5\.15$/m);
    assert.match(content, /^status: release$/m);
    assert.match(content, /^published: true$/m);
    assert.match(content, /tun-quic/);
    assert.match(content, /wg-quic/);
    assert.match(content, /preview1[–-]preview5/);
    assert.match(content, /8f52ed5742cba51f1097fd6aecf35371072a6edfe5d318e92a173ac05701a0b9/);
    assert.match(content, /e17b696281f93c1948548302adb71a0f1a060ed12fcd26e172a95b7938f856f3/);
    assert.match(content, /128MB RAM \/ 32MB Flash/);
    assert.match(content, /64MB\/16MB/);
  }
  assert.match(chinese, /2026 年 11 月 21 日/);
  assert.match(english, /November 21, 2026/);
  assert.match(chinese, /^slug: releases\/v0\.5\.15$/m);
  assert.match(english, /^slug: en\/releases\/v0\.5\.15$/m);
  assert.match(chinese, /两端必须同时升级到 v0\.5\.15 才能互通/);
  assert.match(english, /Both ends must upgrade to v0\.5\.15 to interoperate/);
  assert.match(chinese, /默认数据面仍为 wg-quic/);
  assert.match(english, /default data plane remains wg-quic/);
  assert.match(chinese, /不宣称性能收益或更低的资源占用/);
  assert.match(english, /claims neither performance gains nor lower resource usage/);
});

test('v0.5.16 release notes cover auto plane, explicit sync_port, and verification boundaries', () => {
  const chinesePath = path.join(root, 'src/content/docs/releases/v0.5.16.mdx');
  const englishPath = path.join(root, 'src/content/docs/en/releases/v0.5.16.mdx');
  assert.equal(existsSync(chinesePath), true, 'Chinese v0.5.16 release notes must exist');
  assert.equal(existsSync(englishPath), true, 'English v0.5.16 release notes must exist');

  const chinese = readFileSync(chinesePath, 'utf8');
  const english = readFileSync(englishPath, 'utf8');
  const digests = [
    'a1b6776ce2d0963c3407c528ba1a479bff6dd2e7f4740eb708530f89264d38f4',
    '762ef75ef8d775a01eb33b6fc70f597d8f0dff33365ae54e4ed5e1015b40b51e',
    '228a25d88f297e610c273aa3b6ac5a9e5740bc4793bb0a280ac87ecff6e88632',
    'c6f7778be42fbb46a71cbc4ff931d1143627c48218beb026ca032be075d74089',
    '5164e186e515a8fc398cdafc41cbbd585b35bc6f9ae02a2fc72308135d4f5949',
    '6162c23f8cbad83df64ba1194a8aeab314817d87ba6a6418ee6209b00947338a',
  ];
  for (const content of [chinese, english]) {
    assert.match(content, /^version: v0\.5\.16$/m);
    assert.match(content, /^status: release$/m);
    assert.match(content, /^published: true$/m);
    assert.match(content, /site\.data_plane = "auto"/);
    assert.match(content, /hub_unencrypted/);
    assert.match(content, /frp-tun pin/);
    assert.match(content, /sync_port/);
    assert.match(content, /51830/);
    assert.match(content, /checksums\.txt/);
    for (const digest of digests) {
      assert.match(content, new RegExp(digest));
    }
    assert.match(content, /128MB RAM \/ 32MB Flash/);
    assert.match(content, /64MB\/16MB/);
  }
  assert.match(chinese, /^slug: releases\/v0\.5\.16$/m);
  assert.match(chinese, /2026 年 11 月 22 日/);
  assert.match(chinese, /不宣称性能收益/);
  assert.match(chinese, /显式配置相同的 sync_port|两端.*显式.*sync_port/);
  assert.match(english, /^slug: en\/releases\/v0\.5\.16$/m);
  assert.match(english, /November 22, 2026/);
  assert.match(english, /claims neither performance gains nor lower resource usage/);
  assert.match(english, /both ends.*explicitly.*sync_port/i);
});

test('v0.5.17 release notes document MTU negotiation, port drift, and verification boundaries', () => {
  const chinesePath = path.join(root, 'src/content/docs/releases/v0.5.17.mdx');
  const englishPath = path.join(root, 'src/content/docs/en/releases/v0.5.17.mdx');
  assert.equal(existsSync(chinesePath), true, 'Chinese v0.5.17 release notes must exist');
  assert.equal(existsSync(englishPath), true, 'English v0.5.17 release notes must exist');

  const chinese = readFileSync(chinesePath, 'utf8');
  const english = readFileSync(englishPath, 'utf8');
  const digests = [
    'be5593a269f2f0c5f722a4a8889e9589d8ec3910f3414063394edb54dd3fa82f',
    '668d54744a99c3ab57cffb88784b68086dde6dc77441ad4101e0c5770b3b4562',
    'fc5cf79ba27640e2db8d66b6771bda0d7e1418402587d680267485405b1a949d',
    'de7fdbe2043ea81710934c03f9054888dc79202ee030fb1d69adeed861c4bcc1',
    '5d094698833eee8f39b860c05977b9b97f7c7cc9f0883451c4a1f79289f6fc13',
    '8252448531b2b23ec2b04f97d8d0e512dfba0531c49e6f2d6652d06eccfc8ce5',
  ];
  for (const content of [chinese, english]) {
    assert.match(content, /^version: v0\.5\.17$/m);
    assert.match(content, /^status: release$/m);
    assert.match(content, /^published: true$/m);
    assert.match(content, /effective_mtu/);
    assert.match(content, /mtu_source/);
    assert.match(content, /mtu_advertise/);
    assert.match(content, /listen_port_drifts_24h/);
    assert.match(content, /listen_port_range/);
    assert.match(content, /1420/);
    assert.match(content, /1360/);
    assert.match(content, /1280/);
    assert.match(content, /5 分钟|5 minutes/);
    assert.match(content, /checksums\.txt/);
    for (const digest of digests) {
      assert.match(content, new RegExp(digest));
    }
    assert.match(content, /frp-tun-page\/releases\/download\/v0\.5\.17\//);
    assert.match(content, /128MB RAM \/ 32MB Flash/);
    assert.match(content, /64MB\/16MB/);
  }
  assert.match(chinese, /^slug: releases\/v0\.5\.17$/m);
  assert.match(chinese, /2026 年 11 月 24 日/);
  assert.match(chinese, /只降不升/);
  assert.match(chinese, /网络完全不通/);
  assert.match(chinese, /不宣称性能收益/);
  assert.match(chinese, /真机端口封禁.*未验证/);
  assert.match(english, /^slug: en\/releases\/v0\.5\.17$/m);
  assert.match(english, /November 24, 2026/);
  assert.match(english, /lower only/i);
  assert.match(english, /no path confirmation/i);
  assert.match(english, /claims neither performance gains/i);
  assert.match(english, /real-device port blocking.*not verified/i);
});

test('current release links point to v0.5.16 in both locales', () => {
  const pages = [
    ['index.mdx', '/releases/v0.5.16/'],
    ['en/index.mdx', '/en/releases/v0.5.16/'],
    ['releases/index.mdx', '/releases/v0.5.16/'],
    ['en/releases/index.mdx', '/en/releases/v0.5.16/'],
    ['configuration/openwrt.mdx', '/releases/v0.5.16/'],
    ['en/configuration/openwrt.mdx', '/en/releases/v0.5.16/'],
  ];

  for (const [page, currentReleasePath] of pages) {
    const content = readFileSync(path.join(root, 'src/content/docs', page), 'utf8');
    assert.match(content, new RegExp(currentReleasePath.replaceAll('/', '\\/')),
      `${page} must link to ${currentReleasePath}`);
    if (page.endsWith('configuration/openwrt.mdx')) {
      assert.match(content, /frp-tun_v0\.5\.16_/,
        `${page} must use v0.5.16 binary names`);
    }
  }

  const chineseIndex = readFileSync(path.join(root, 'src/content/docs/releases/index.mdx'), 'utf8');
  const englishIndex = readFileSync(path.join(root, 'src/content/docs/en/releases/index.mdx'), 'utf8');
  assert.match(chineseIndex, /v0\.5\.16 \(当前稳定版本\)/);
  assert.match(englishIndex, /v0\.5\.16 \(Current Stable Release\)/);
  assert.doesNotMatch(chineseIndex, /v0\.5\.15 \(当前稳定版本\)/);
  assert.doesNotMatch(englishIndex, /v0\.5\.15 \(Current Stable Release\)/);
});

test('v0.5.16 auto plane and pin are documented in both locales', () => {
  const cliPages = [
    'operations/cli-reference.mdx',
    'en/operations/cli-reference.mdx',
  ];
  for (const page of cliPages) {
    const content = readFileSync(path.join(root, 'src/content/docs', page), 'utf8');
    assert.match(content, /frp-tun pin/, `${page} must document frp-tun pin`);
    assert.match(content, /--peer/, `${page} must document --peer`);
    assert.match(content, /--target/, `${page} must document --target`);
    assert.match(content, /data_plane = "auto"/, `${page} must document the auto data plane`);
  }

  const fullReferencePages = [
    'configuration/full-reference.mdx',
    'en/configuration/full-reference.mdx',
  ];
  for (const page of fullReferencePages) {
    const content = readFileSync(path.join(root, 'src/content/docs', page), 'utf8');
    assert.match(content, /data_plane = "auto"/, `${page} must document data_plane`);
    assert.match(content, /hub_unencrypted = false/, `${page} must document hub_unencrypted`);
    assert.match(content, /按站点对.*派生|per.site.pair.*derivation/i, `${page} must document the new sync_port default`);
  }

  const scenarioPages = [
    'configuration/minimal-two-site.mdx',
    'en/configuration/minimal-two-site.mdx',
  ];
  for (const page of scenarioPages) {
    const content = readFileSync(path.join(root, 'src/content/docs', page), 'utf8');
    assert.match(content, /data_plane = "auto"/, `${page} must include an auto scenario`);
    assert.match(content, /hub_unencrypted = true/, `${page} must include a cleartext Hub scenario`);
    assert.match(content, /hubs = \[/, `${page} must show private_relay.hubs`);
    assert.match(content, /data_plane = "tun-quic"/, `${page} must include a tun-quic scenario`);
    assert.match(content, /allow_relay = false/, `${page} must disable relay in the tun-quic scenario`);
  }
});

test('full reference documents mtu_adjust and disable_print_color in both locales', () => {
  const pages = [
    ['configuration/full-reference.mdx', '不改运行配置', '受控提交'],
    ['en/configuration/full-reference.mdx', 'does not change the running configuration', 'controlled commit'],
  ];

  for (const [page, suggestBoundary, autoBoundary] of pages) {
    const content = readFileSync(path.join(root, 'src/content/docs', page), 'utf8');
    assert.match(content, /mtu_adjust = "suggest"/, `${page} must show the mtu_adjust default`);
    assert.match(content, /disable_print_color = false/, `${page} must show disable_print_color`);
    assert.match(content, /1404[^\n]*1360/, `${page} must keep the MTU suggestion example`);
    assert.match(content, /10 分钟|10 minutes/, `${page} must state the stability window`);
    assert.match(content, /30 分钟|30 minutes/, `${page} must state the auto cooldown`);
    assert.match(content, new RegExp(suggestBoundary), `${page} must say suggest does not apply`);
    assert.match(content, new RegExp(autoBoundary), `${page} must say auto is a controlled commit`);
    assert.match(content, /"off"|`off`/, `${page} must document off`);
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
