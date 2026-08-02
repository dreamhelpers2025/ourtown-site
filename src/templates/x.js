/** X post image, 1600x900. */
import { makeLandscape } from './_landscape.js';

const t = makeLandscape({ id: 'x', width: 1600, height: 900, label: 'X post image' });
export const spec = t.spec;
export const render = t.render;
