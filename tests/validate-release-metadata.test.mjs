import assert from 'node:assert/strict';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const releaseRoot = fileURLToPath(new URL('../src/content/docs/releases/', import.meta.url));

async function loadValidator() {
  return import('../scripts/validate-release-metadata.mjs').catch(() => ({}));
}

test('accepts a gated preview release with all required evidence sections', async () => {
  const { validateReleaseMetadata } = await loadValidator();

  assert.equal(typeof validateReleaseMetadata, 'function');
  const result = await validateReleaseMetadata({ root: releaseRoot });

  assert.deepEqual(result.violations, []);
});

test('requires preview release metadata to remain unpublished', async () => {
  const { validateReleaseMetadata } = await loadValidator();

  assert.equal(typeof validateReleaseMetadata, 'function');
  const result = await validateReleaseMetadata({
    root: releaseRoot,
    documents: [
      {
        file: 'invalid.mdx',
        content: `---\nversion: v0.6.0-preview.1\nstatus: preview\npublished: true\n---\n## 摘要\n## 已验证范围\n## 已知限制\n## 升级\n## 回退\n## 验证\n## 撤回`,
      },
    ],
  });

  assert.equal(result.violations[0].rule, 'preview-must-remain-unpublished');
});

test('rejects unsupported platform claims in preview release notes', async () => {
  const { validateReleaseMetadata } = await loadValidator();

  assert.equal(typeof validateReleaseMetadata, 'function');
  const result = await validateReleaseMetadata({
    root: releaseRoot,
    documents: [
      {
        file: 'invalid.mdx',
        content: `---\nversion: v0.6.0-preview.1\nstatus: preview\npublished: false\n---\n## 摘要\n## 已验证范围\nOpenWrt 已支持\n## 已知限制\n## 升级\n## 回退\n## 验证\n## 撤回`,
      },
    ],
  });

  assert.equal(result.violations[0].rule, 'unsupported-platform-claim');
});
