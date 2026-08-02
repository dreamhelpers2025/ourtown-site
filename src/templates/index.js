/**
 * Template registry.
 *
 * Adding a format (LinkedIn, X, counter card, table tent, email header, web
 * hero) means adding one module here -- the renderer, copy library, contrast
 * handling, QR, disclosure and packaging all come along for free. That is the
 * whole point of building the templates in code rather than as flat comps.
 */

import * as igSquare from './ig-square.js';
import * as story from './story.js';
import * as poster from './poster.js';

export const templates = {
  'ig-square': igSquare,
  story,
  poster,
};

export function getTemplate(id) {
  const t = templates[id];
  if (!t) throw new Error(`Unknown format "${id}". Known: ${Object.keys(templates).join(', ')}`);
  return t;
}
