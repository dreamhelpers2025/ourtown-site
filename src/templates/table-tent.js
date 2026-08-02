/** Table tent, 4x6in. */
import { makePrintCard } from './_print-card.js';

const t = makePrintCard({ id: 'table-tent', width: 4, height: 6, label: 'Table tent 4x6' });
export const spec = t.spec;
export const render = t.render;
