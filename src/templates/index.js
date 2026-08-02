/**
 * Template registry.
 *
 * Adding a format means adding one module here -- the renderer, copy library,
 * contrast handling, QR, disclosure and packaging all come along for free. That
 * is the whole point of building the templates in code rather than as flat comps.
 */

import * as igSquare from './ig-square.js';
import * as story from './story.js';
import * as poster from './poster.js';
import * as linkedin from './linkedin.js';
import * as x from './x.js';
import * as webHero from './web-hero.js';
import * as emailHeader from './email-header.js';
import * as counterCard from './counter-card.js';
import * as tableTent from './table-tent.js';

export const templates = {
  'ig-square': igSquare,
  story,
  poster,
  linkedin,
  x,
  'web-hero': webHero,
  'email-header': emailHeader,
  'counter-card': counterCard,
  'table-tent': tableTent,
};

export function getTemplate(id) {
  const t = templates[id];
  if (!t) throw new Error(`Unknown format "${id}". Known: ${Object.keys(templates).join(', ')}`);
  return t;
}
