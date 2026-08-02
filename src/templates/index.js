/**
 * Template registry.
 *
 * Adding a format means adding one module here -- the renderer, copy library,
 * contrast handling, QR, disclosure and packaging all come along for free. That
 * is the whole point of building the templates in code rather than as flat comps.
 */

import * as igSquare from './ig-square.js';
import * as igCarousel from './ig-carousel.js';
import * as story from './story.js';
import * as linkedin from './linkedin.js';
import * as x from './x.js';
import * as webHero from './web-hero.js';
import * as emailHeader from './email-header.js';
import * as sidebarBanner from './sidebar-banner.js';
import * as poster from './poster.js';
import * as flyer from './flyer.js';
import * as counterCard from './counter-card.js';
import * as tableTent from './table-tent.js';
import * as windowCling from './window-cling.js';

export const templates = {
  // Social
  'ig-square': igSquare,
  'ig-carousel': igCarousel,
  story,
  linkedin,
  x,
  // Web + email
  'web-hero': webHero,
  'email-header': emailHeader,
  'sidebar-banner': sidebarBanner,
  // Print
  poster,
  flyer,
  'counter-card': counterCard,
  'table-tent': tableTent,
  'window-cling': windowCling,
};

export function getTemplate(id) {
  const t = templates[id];
  if (!t) throw new Error(`Unknown format "${id}". Known: ${Object.keys(templates).join(', ')}`);
  return t;
}
