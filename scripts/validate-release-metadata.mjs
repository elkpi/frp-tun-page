import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const requiredSections = ['摘要', '已验证范围', '已知限制', '升级', '回退', '验证', '撤回'];

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    return {};
  }

  return Object.fromEntries(
    match[1]
      .split(/\r?\n/)
      .map((line) => line.match(/^([A-Za-z_][A-Za-z0-9_-]*):\s*(.*?)\s*$/))
      .filter(Boolean)
      .map(([, key, value]) => [key, value.replace(/^['"]|['"]$/g, '')]),
  );
}

function collectReleaseDocuments(root) {
  return readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isFile() && ['.md', '.mdx'].includes(path.extname(entry.name)))
    .map((entry) => ({
      file: path.join(root, entry.name),
      content: readFileSync(path.join(root, entry.name), 'utf8'),
    }));
}

function hasSection(content, section) {
  return new RegExp(`^##\\s+${section}\\s*$`, 'm').test(content);
}

export function validateReleaseMetadata({ root, documents }) {
  const selectedDocuments = documents ?? collectReleaseDocuments(root);
  const violations = [];

  for (const document of selectedDocuments) {
    if (path.basename(document.file).startsWith('index.')) {
      continue;
    }

    const frontmatter = parseFrontmatter(document.content);
    if (!frontmatter.version) {
      violations.push({ file: document.file, rule: 'missing-version' });
    }
    if (frontmatter.status !== 'preview' && frontmatter.status !== 'release') {
      violations.push({ file: document.file, rule: 'invalid-status-type' });
    }

    for (const section of requiredSections) {
      if (!hasSection(document.content, section)) {
        violations.push({ file: document.file, rule: `missing-section-${section}` });
      }
    }

    if (/OpenWrt\s*(?:已支持|supported)|非零\s*SO_MARK\s*(?:已验证|verified)/i.test(document.content)) {
      violations.push({ file: document.file, rule: 'unsupported-platform-claim' });
    }
  }

  return { violations };
}

if (import.meta.main) {
  const root = process.argv[2] ?? 'src/content/docs/releases';
  try {
    statSync(root);
  } catch {
    console.error(`${root}: release metadata directory is unavailable`);
    process.exit(1);
  }

  const result = validateReleaseMetadata({ root });
  if (result.violations.length > 0) {
    console.error(result.violations.map(({ file, rule }) => `${file}: ${rule}`).join('\n'));
    process.exitCode = 1;
  }
}
