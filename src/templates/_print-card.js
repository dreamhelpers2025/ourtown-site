/**
 * Shared small-format print layout: counter card (5x7in) and table tent (4x6in).
 *
 * These are scan-first pieces -- someone is standing at a register with a phone,
 * so the QR leads and the product supports it. The physical minimums from
 * tokens.rules are computed from the canvas width rather than hardcoded, so a
 * new size can be added without re-deriving them by hand.
 */

import { shell, ourtownMark, progressHtml, markOnField, mark, productHtml } from './base.js';
import { onColor } from '../lib/color.js';

/** Converts inches to the canvas-relative rem unit (1rem = 1% of width). */
const remFor = (inches, canvasWidthIn) => inches / (canvasWidthIn / 100);

export function makePrintCard({ id, width, height, label }) {
  const spec = { id, width, height, unit: 'in', outputs: ['pdf', 'png'], label };

  // 1.25in QR floor and 8pt disclosure floor, expressed in this canvas's rem.
  const qrRem = remFor(1.25, width) * 1.04;
  const disclosureRem = remFor(8 / 72, width) * 1.04;

  function render({ campaign, tokens, moment, progress, assets, business }) {
    const onBand = onColor(business.raw);

    const body = /* html */ `
    <div class="canvas">
      <header class="band">
        ${markOnField({
          src: assets.businessLogoOnDark,
          hasDarkVariant: Boolean(campaign.business.logoOnDark),
          logoStyle: campaign.business.logoStyle,
          alt: campaign.business.name,
          className: 'biz-mark',
        })}
        <span class="moment" style="background:${onBand === '#ffffff' ? 'rgba(255,255,255,.18)' : 'rgba(0,0,0,.12)'}; color:${onBand}">
          <span class="dot"></span>${moment.eyebrow}
        </span>
      </header>

      <main class="body">
        <p class="tagline" style="color:${tokens.role.brandDeep}">${tokens.voice.platformTagline}</p>
        <h1 class="display headline">${campaign.headline}</h1>

        <div class="product-stage">
          ${productHtml(campaign, assets, tokens)}
        </div>

        ${progressHtml(progress, {
          trackHeight: '1.1rem',
          bg: 'rgba(47,47,47,.12)',
          fill: business.raw,
          text: tokens.role.text,
        })}

        <div class="scan-row">
          <img class="qr" src="${assets.qrLight}" alt="Scan to support">
          <div class="scan-copy">
            <div class="scan">${moment.cta}</div>
            <p class="supports">Every purchase supports</p>
            ${mark({ src: assets.causeLogo, logoStyle: campaign.cause.logoStyle, alt: campaign.cause.name, className: 'cause-mark' })}
          </div>
        </div>
      </main>

      <footer class="foot">
        <div class="powered" style="color:${tokens.role.textSoft}">${ourtownMark(assets)}</div>
        <p class="disclosure">${campaign.disclosure}</p>
      </footer>
    </div>`;

    const css = /* css */ `
      @page { size: ${width}in ${height}in; margin: 0; }
      body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }

      .band {
        flex: 0 0 auto; height: 9rem; background: ${business.raw}; color: ${onBand};
        display: flex; align-items: center; justify-content: space-between; padding: 0 4rem; gap: 1.5rem;
      }
      .band .biz-mark { height: 5.2rem; max-width: 30rem; object-fit: contain; }
      .band .moment { font-size: 1.6rem; padding: 0.7rem 1.5rem; }

      .body { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; gap: 2rem; padding: 3rem 4rem 0; }
      .tagline { font-size: 1.9rem; }
      .headline { font-size: 8rem; }

      .product-stage { flex: 1 1 auto; min-height: 0; }
      .product-stage .product-card { height: 100%; width: auto; }
      .price-tag { top: -1rem; right: -1rem; width: 15rem; font-size: 4.2rem; box-shadow: ${tokens.shadow.card}; }

      .scan-row { display: flex; align-items: center; gap: 2.4rem; }
      .qr { width: ${qrRem}rem; height: ${qrRem}rem; border-radius: ${tokens.radius.sm}; background: #fff; }
      .scan-copy { display: flex; flex-direction: column; gap: 0.9rem; min-width: 0; }
      .scan-copy .scan { font-family: ${tokens.font.display}; font-weight: 800; font-size: 3.2rem; line-height: 1; }
      .scan-copy .supports { font-size: 1.5rem; text-align: left; }
      .scan-copy .cause-mark { height: 7.5rem; max-width: 100%; object-fit: contain; align-self: flex-start; }

      .foot { flex: 0 0 auto; display: flex; flex-direction: column; gap: 1.1rem; padding: 2.2rem 4rem 2.6rem; }
      .powered .powered-label { font-size: 1.5rem; }
      .powered .ot-mark { height: 2.6rem; }
      .disclosure { font-size: ${disclosureRem}rem; max-width: none; }
    `;

    return shell({ ...spec, css, body, tokens });
  }

  return { spec, render };
}
