/** Retail counter card, 5x7in. */
import { makePrintCard } from './_print-card.js';

const t = makePrintCard({ id: 'counter-card', width: 5, height: 7, label: 'Counter card 5x7' });
export const spec = t.spec;
export const render = t.render;
