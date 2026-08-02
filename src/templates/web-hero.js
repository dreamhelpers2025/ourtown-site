/** Website hero banner, 1600x600. */
import { makeLandscape } from './_landscape.js';

const t = makeLandscape({ id: 'web-hero', width: 1600, height: 600, label: 'Website hero banner', density: 'tight' });
export const spec = t.spec;
export const render = t.render;
