import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const sourceDirectory = path.join(root, 'src/assets/diagrams');
const outputDirectory = path.join(root, 'public/images/diagrams');

mkdirSync(outputDirectory, { recursive: true });

function findD2Binary() {
  const localD2 = path.join(os.homedir(), '.local/bin/d2');
  if (existsSync(localD2)) {
    return localD2;
  }
  try {
    const whichResult = execFileSync('which', ['d2'], { encoding: 'utf8' }).trim();
    if (whichResult && existsSync(whichResult)) {
      return whichResult;
    }
  } catch {
    // not in path
  }
  return undefined;
}

const d2Binary = findD2Binary();
const executableName = process.platform === 'win32' ? 'mmdc.cmd' : 'mmdc';
const mermaidCli = path.join(root, 'node_modules/.bin', executableName);

const entries = readdirSync(sourceDirectory, { withFileTypes: true });

// First compile all .d2 sources using D2 if available
const d2Sources = entries.filter((e) => e.isFile() && path.extname(e.name) === '.d2');
if (d2Sources.length > 0 && d2Binary) {
  for (const entry of d2Sources) {
    const source = path.join(sourceDirectory, entry.name);
    const output = path.join(outputDirectory, `${path.basename(entry.name, '.d2')}.svg`);
    execFileSync(d2Binary, [source, output], {
      stdio: 'inherit',
    });
  }
} else {
  // Fall back to Mermaid CLI
  if (!existsSync(mermaidCli)) {
    throw new Error('Neither D2 nor Mermaid CLI is available to compile diagrams.');
  }

  const mmdSources = entries.filter((e) => e.isFile() && path.extname(e.name) === '.mmd');
  for (const entry of mmdSources) {
    const source = path.join(sourceDirectory, entry.name);
    const output = path.join(outputDirectory, `${path.basename(entry.name, '.mmd')}.svg`);
    execFileSync(mermaidCli, ['-i', source, '-o', output, '-b', 'transparent'], {
      stdio: 'inherit',
    });
  }
}
