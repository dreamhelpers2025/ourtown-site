/**
 * Retail poster, 8.5x11in. Emits both PDF (for printing) and PNG (for preview).
 *
 * Sized in inches rather than pixels so the token rules that are expressed in
 * physical units actually bind here: the QR clears the 1.25in floor and the
 * disclosure clears 8pt. At 1rem = 0.085in, that means QR >= 14.7rem and
 * disclosure >= 1.31rem -- the values below are chosen against those limits.
 *
 * Note: this is an RGB PDF, which is correct for digital/office printing. Offset
 * work would need a CMYK conversion step before it goes to a commercial press.
 */

import { shell, ourtownMark, badgeHtml, progressHtml, markOnField } from './base.js';
import { onColor } from '../lib/color.js';

export const spec = { id: 'poster', width: 8.5, height: 11, unit: 'in', outputs: ['pdf', 'png'], label: 'Retail poster 8.5x11' };

export function render({ campaign, tokens, moment, progress, assets, business }) {
  const onBand = onColor(business.raw);

  const body = /* html */ `
  <div class="canvas">
    <header class="band">
      ${markOnField({
        src: assets.businessLogoOnDark,
        hasDarkVariant: Boolean(campaign.business.logoOnDark),
        alt: campaign.business.name,
        className: 'biz-mark',
      })}
      <span class="moment" style="background:${onBand === '#ffffff' ? 'rgba(255,255,255,.18)' : 'rgba(0,0,0,.12)'}">
        <span class="dot"></span>${moment.eyebrow}
      </span>
    </header>

    <main class="body">
      <p class="tagline" style="color:${tokens.role.brandDeep}">${tokens.voice.platformTagline}</p>
      <h1 class="display headline">${campaign.headline}</h1>
      ${campaign.subhead ? `<p class="subhead">${campaign.subhead}</p>` : ''}

      <div class="product-stage">
        <img src="${assets.product}" alt="${campaign.product.alt ?? campaign.product.name}">
        <span class="price-tag" style="background:${tokens.role.brand}; color:${tokens.role.onBrand}">${campaign.product.price}</span>
      </div>

      <p class="prod-name">${campaign.product.name}</p>

      ${progressHtml(progress, {
        trackHeight: '1.3rem',
        bg: 'rgba(47,47,47,.12)',
        fill: business.raw,
        text: tokens.role.text,
      })}

      <div class="meta">
        <p class="supports">Every purchase supports</p>
        <div class="lockup">
          <img class="hero-mark" src="${assets.businessLogo}" alt="${campaign.business.name}">
          <span class="cross">&times;</span>
          <img class="cause-mark" src="${assets.causeLogo}" alt="${campaign.cause.name}">
        </div>
        ${campaign.cause.mission ? `<p class="mission">${campaign.cause.mission}</p>` : ''}
      </div>

      <div class="badges">${badgeHtml(campaign.badges, tokens, business.primary)}</div>
    </main>

    <footer class="foot">
      <div class="qr-block">
        <img src="${assets.qrLight}" alt="Scan to support">
        <div class="qr-copy">
          <div class="scan">${moment.cta}</div>
          <div class="url">${campaign.campaignUrl.replace(/^https?:\/\//, '')}</div>
        </div>
      </div>
      <div class="foot-right">
        <div class="powered" style="color:${tokens.role.textSoft}">${ourtownMark(tokens.role.brandDeep)}</div>
      </div>
    </footer>

    <p class="disclosure">${campaign.disclosure}</p>
  </div>`;

  const css = /* css */ `
    @page { size: 8.5in 11in; margin: 0; }
    body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }

    .band {
      flex: 0 0 auto; height: 8.5rem; background: ${business.raw}; color: ${onBand};
      display: flex; align-items: center; justify-content: space-between; padding: 0 5.9rem;
    }
    .band .biz-mark { height: 4.6rem; max-width: 32rem; object-fit: contain; }

    .body { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; gap: 1.9rem; padding: 3.4rem 5.9rem 0; }
    .tagline { font-size: 1.6rem; }
    .headline { font-size: 7.2rem; }
    .subhead { font-size: 2rem; line-height: 1.3; color: ${tokens.role.textSoft}; max-width: 62rem; }

    .product-stage { flex: 1 1 auto; min-height: 0; }
    .product-stage img { max-height: 100%; }
    .price-tag { top: 0; right: 0; width: 11.5rem; font-size: 3.1rem; box-shadow: ${tokens.shadow.card}; }

    .prod-name { font-family: ${tokens.font.display}; font-weight: 700; font-size: 2.2rem; text-align: center; }

    .meta { display: flex; flex-direction: column; align-items: center; gap: 1.1rem; }
    .mission { font-size: 1.5rem; text-align: center; color: ${tokens.role.textSoft}; max-width: 56rem; line-height: 1.35; }
    .badges { justify-content: center; }

    .foot {
      flex: 0 0 auto; display: flex; align-items: center; justify-content: space-between;
      padding: 2.2rem 5.9rem 0; gap: 2rem;
    }
    /* 15rem = 1.275in, clears the 1.25in QR floor in tokens.rules.qr */
    .foot .qr-block img { width: 15rem; height: 15rem; }
    .foot .qr-copy .scan { font-size: 2.4rem; }
    .foot .qr-copy .url { font-size: 1.5rem; }

    /* 1.35rem = 0.1148in = 8.26pt, clears the 8pt disclosure floor */
    .disclosure { flex: 0 0 auto; font-size: 1.35rem; padding: 1.5rem 5.9rem 2.4rem; max-width: none; }
  `;

  return shell({ ...spec, css, body, tokens });
}
