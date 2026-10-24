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
const entries = readdirSync(sourceDirectory, { withFileTypes: true });
const d2Sources = entries.filter((e) => e.isFile() && path.extname(e.name) === '.d2');

if (d2Sources.length > 0) {
  if (d2Binary) {
    for (const entry of d2Sources) {
      const source = path.join(sourceDirectory, entry.name);
      const output = path.join(outputDirectory, `${path.basename(entry.name, '.d2')}.svg`);
      execFileSync(d2Binary, [source, output], {
        stdio: 'inherit',
      });
    }
  } else {
    // If D2 is not installed, verify that all target SVGs are already present
    const missing = d2Sources.filter((entry) => {
      const output = path.join(outputDirectory, `${path.basename(entry.name, '.d2')}.svg`);
      return !existsSync(output);
    });

    if (missing.length > 0) {
      throw new Error(
        `D2 CLI is not found and the following pre-compiled SVGs are missing: ${missing.map((e) => e.name).join(', ')}. Please install D2 from https://d2lang.com.`,
      );
    }

    console.log('D2 compiler not present; pre-compiled SVGs already exist in public/images/diagrams, skipping.');
  }
}
