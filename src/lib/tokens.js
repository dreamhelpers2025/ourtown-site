/** Loads brand tokens and resolves `{color.gold.500}` style references. */

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const TOKENS_PATH = fileURLToPath(new URL('../../tokens/brand.json', import.meta.url));

const REF = /^\{([a-zA-Z0-9_.]+)\}$/;

function lookup(root, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), root);
}

function resolve(node, root, seen = 0) {
  if (seen > 10) throw new Error('Token reference cycle detected');
  if (typeof node === 'string') {
    const m = node.match(REF);
    if (!m) return node;
    const target = lookup(root, m[1]);
    if (target === undefined) throw new Error(`Unknown token reference: ${node}`);
    return resolve(target, root, seen + 1);
  }
  if (Array.isArray(node)) return node.map((n) => resolve(n, root, seen));
  if (node && typeof node === 'object') {
    return Object.fromEntries(
      Object.entries(node)
        .filter(([k]) => !k.startsWith('$'))
        .map(([k, v]) => [k, resolve(v, root, seen)])
    );
  }
  return node;
}

let cached;

export async function loadTokens() {
  if (cached) return cached;
  const raw = JSON.parse(await readFile(TOKENS_PATH, 'utf8'));
  cached = resolve(raw, raw);
  return cached;
}
