import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const textExtensions = new Set([
  '.css',
  '.html',
  '.js',
  '.json',
  '.md',
  '.mdx',
  '.mjs',
  '.mmd',
  '.svg',
  '.toml',
  '.txt',
  '.yml',
  '.yaml',
]);

const allowedHostnames = new Set([
  'd2lang.com',
  'elkpi.com',
  'example.com',
  'frp-tun.elkpi.com',
  'github.com',
  'www.w3.org',
]);

const nonHostnameSuffixes = new Set([
  'css',
  'html',
  'js',
  'json',
  'md',
  'mdx',
  'mjs',
  'svg',
  'toml',
  'yaml',
  'yml',
  'txt',
  'sock',
  'key',
  'qos',
  'ipv6',
  'server_port',
  'token',
  'shared_secret',
  'private_key',
  'public_key',
  '1',
]);

function isPlaceholder(value) {
  // Strip trailing comments (e.g. # comment)
  const commentIndex = value.indexOf('#');
  const cleanVal = commentIndex !== -1 ? value.slice(0, commentIndex) : value;
  const normalized = cleanVal.trim().replace(/^['"]|['"]$/g, '');
  return (
    /^REPLACE_WITH_[A-Z0-9_]+$/i.test(normalized) ||
    /^\$\{[A-Z0-9_]+\}$/i.test(normalized) ||
    /^<[^>]+>$/.test(normalized) ||
    /^example(?:[-_.]|$)/i.test(normalized) ||
    /^(?:changeme|not-a-real)/i.test(normalized)
  );
}

function isAllowedHostname(hostname) {
  const normalized = hostname.toLowerCase();
  return (
    normalized === 'localhost' ||
    normalized === 'elkpi.com' ||
    normalized.endsWith('.elkpi.com') ||
    normalized.endsWith('.example.com') ||
    normalized.endsWith('.test') ||
    allowedHostnames.has(normalized)
  );
}

function collectFiles(root) {
  const stats = statSync(root);
  if (stats.isFile()) {
    return textExtensions.has(path.extname(root).toLowerCase()) ? [root] : [];
  }

  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.superpowers' || entry.name === 'dist') {
      return [];
    }

    return collectFiles(path.join(root, entry.name));
  });
}

function findPrivateAddress(line) {
  const ipv4 = /\b(?:10(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})\b/;
  const ipv6 = /\b(?:fc|fd)[0-9a-f]{2}:[0-9a-f:]+\b/i;
  return ipv4.test(line) || ipv6.test(line);
}

function findUnsafeHostname(line) {
  const candidates = line.matchAll(/\b(?:[a-z0-9-]+\.)+[a-z]{2,}\b/gi);
  return [...candidates].find(([hostname]) => {
    const parts = hostname.toLowerCase().split('.');
    const suffix = parts.at(-1);
    if (nonHostnameSuffixes.has(suffix)) {
      return false;
    }
    // Check if it's a version tag like v0.5.1
    if (/^v\d+\.\d+\.\d+$/i.test(hostname)) {
      return false;
    }
    return !isAllowedHostname(hostname);
  });
}

function inspectLine(line) {
  // If line is markdown text explaining config (like 1. `frp.token`), don't treat as assignment
  if (/^\s*\d+\.\s*`?[A-Za-z_][A-Za-z0-9_.]*`?:?/i.test(line)) {
    return undefined;
  }

  const assignment = /^\s*([A-Za-z_][A-Za-z0-9_-]*)\s*=\s*(.*?)\s*$/;
  const matched = line.match(assignment);

  if (matched) {
    const [, key, value] = matched;
    if (/^(?:PrivateKey|private_key)$/i.test(key) && !isPlaceholder(value)) {
      return 'wireguard-private-key';
    }
    if (/^(?:token|shared_secret|secret_key)$/i.test(key) && !isPlaceholder(value)) {
      return 'frp-credential';
    }
  }

  if (findPrivateAddress(line)) {
    return 'private-network-address';
  }

  if (/\.(?:md|mdx|toml|txt)$/i.test(this.file ?? '') && findUnsafeHostname(line)) {
    return 'non-example-hostname';
  }

  return undefined;
}

export function validatePublicContent({ roots }) {
  const violations = [];

  for (const root of roots) {
    for (const file of collectFiles(root)) {
      if (file.split(path.sep).some((part) => part === 'output' || part === 'artifacts')) {
        violations.push({ file, line: 1, rule: 'forbidden-source-path' });
        continue;
      }

      const lines = readFileSync(file, 'utf8').split(/\r?\n/);
      lines.forEach((line, index) => {
        const rule = inspectLine.call({ file }, line);
        if (rule) {
          violations.push({ file, line: index + 1, rule });
        }
      });
    }
  }

  return { violations };
}

function formatViolation({ file, line, rule }) {
  return `${path.relative(process.cwd(), file)}:${line}: ${rule}`;
}

if (import.meta.main) {
  const roots = process.argv.slice(2);
  const selectedRoots = roots.length > 0 ? roots : ['src/content/docs', 'public', '.github', 'README.md', 'SECURITY.md', 'EULA.md'];
  const result = validatePublicContent({ roots: selectedRoots.filter((root) => {
    try {
      statSync(root);
      return true;
    } catch {
      return false;
    }
  }) });

  if (result.violations.length > 0) {
    console.error(result.violations.map(formatViolation).join('\n'));
    process.exitCode = 1;
  }
}
