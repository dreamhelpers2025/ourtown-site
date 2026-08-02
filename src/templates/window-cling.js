/**
 * Storefront window cling, 12x18in.
 *
 * Read from the sidewalk through glass, so this strips to the fewest elements
 * that still work: partner color full bleed, one headline, the product, and a
 * QR big enough to scan from a pace or two back. The QR here is ~3.4in rather
 * than the 1.25in floor -- the minimum is a legality, not a target, and a
 * counter-card-sized code on glass does not get scanned.
 */

import { shell, ourtownMark, markOnField, mark, productHtml } from './base.js';
import { onColor } from '../lib/color.js';

export const spec = { id: 'window-cling', width: 12, height: 18, unit: 'in', outputs: ['pdf', 'png'], label: 'Window cling 12x18' };

export function render({ campaign, tokens, moment, progress, assets, business }) {
  const onField = onColor(business.raw);

  const body = /* html */ `
  <div class="canvas">
    <div class="field">
      <header class="head">
        ${markOnField({
          src: assets.businessLogoOnDark,
          hasDarkVariant: Boolean(campaign.business.logoOnDark),
          logoStyle: campaign.business.logoStyle,
          alt: campaign.business.name,
          className: 'biz-mark',
        })}
        <span class="moment" style="background:${onField === '#ffffff' ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,.14)'}; color:${onField}">
          <span class="dot"></span>${moment.eyebrow}${progress.pct > 0 ? ` · ${progress.percentLabel}` : ''}
        </span>
      </header>

      <p class="tagline" style="color:${onField}">${tokens.voice.platformTagline}</p>
      <h1 class="display headline" style="color:${onField}">${campaign.headline}</h1>

      <div class="product-stage">${productHtml(campaign, assets, tokens)}</div>

      <section class="scan">
        <img class="qr" src="${assets.qrLight}" alt="Scan to support">
        <div class="scan-copy" style="color:${onField}">
          <p class="scan-head display">${moment.cta}</p>
          <p class="supports">Every purchase supports</p>
          <span class="mark-chip">${mark({ src: assets.causeLogo, logoStyle: campaign.cause.logoStyle, alt: campaign.cause.name, className: 'cause-mark' })}</span>
        </div>
      </section>

      <footer class="foot" style="color:${onField}">
        <div class="powered">${ourtownMark(assets, onField === '#ffffff')}</div>
        <p class="disclosure" style="color:${onField}">${campaign.disclosure}</p>
      </footer>
    </div>
  </div>`;

  const css = /* css */ `
    @page { size: 12in 18in; margin: 0; }
    body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }

    .field {
      width: 100%; height: 100%; background: ${business.raw};
      padding: 5rem 5rem 4rem; display: flex; flex-direction: column; gap: 2.6rem;
    }

    .head { flex: 0 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 2rem; }
    .head .biz-mark { height: 9rem; max-width: 40rem; object-fit: contain; }
    .head .moment { font-size: 1.9rem; padding: 1rem 2rem; }

    .tagline { flex: 0 0 auto; font-size: 2.4rem; opacity: 0.9; }
    .headline { flex: 0 0 auto; font-size: 13rem; }

    .product-stage { flex: 1 1 auto; min-height: 0; }
    .product-stage .product-card { height: 100%; width: auto; }
    .price-tag { top: -1rem; right: -1rem; width: 15rem; font-size: 4.4rem; box-shadow: ${tokens.shadow.card}; }

    .scan { flex: 0 0 auto; display: flex; align-items: center; gap: 3rem; }
    /* 28rem = 3.36in -- far above the 1.25in floor, sized for glass. */
    .scan .qr { width: 28rem; height: 28rem; border-radius: ${tokens.radius.md}; background: #fff; padding: 1rem; }
    .scan-copy { display: flex; flex-direction: column; gap: 1.2rem; align-items: flex-start; min-width: 0; }
    .scan-head { font-size: 5.4rem; line-height: 1; }
    .scan-copy .supports { text-align: left; font-size: 1.9rem; opacity: 0.9; }
    .scan-copy .mark-chip { padding: 1rem 1.5rem; }
    .scan-copy .cause-mark { height: 6.4rem; max-width: 34rem; object-fit: contain; }

    .foot { flex: 0 0 auto; display: flex; flex-direction: column; gap: 1.2rem; }
    .powered .powered-label { font-size: 1.5rem; }
    .powered .ot-mark { height: 2.8rem; }
    /* 0.95rem = 8.2pt at 12in wide, clears the 8pt floor */
    .disclosure { font-size: 0.95rem; opacity: 0.9; max-width: none; }
  `;

  return shell({ ...spec, css, body, tokens });
}
