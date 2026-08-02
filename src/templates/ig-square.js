/** Instagram / Facebook square, 1080x1080. */

import { shell, ourtownMark, badgeHtml, progressHtml, markOnField } from './base.js';
import { onColor } from '../lib/color.js';

export const spec = { id: 'ig-square', width: 1080, height: 1080, unit: 'px', outputs: ['png'], label: 'Instagram / Facebook square' };

export function render({ campaign, tokens, moment, progress, assets, business, cause }) {
  const onBand = onColor(business.raw);
  const headline = campaign.headline;

  const body = /* html */ `
  <div class="canvas">
    <header class="band">
      ${markOnField({
        src: assets.businessLogoOnDark,
        hasDarkVariant: Boolean(campaign.business.logoOnDark),
        alt: campaign.business.name,
        className: 'biz-mark',
      })}
      <span class="moment" style="background:${onBand === '#ffffff' ? 'rgba(255,255,255,.16)' : 'rgba(0,0,0,.10)'}">
        <span class="dot"></span>${moment.eyebrow}
      </span>
    </header>

    <main class="body">
      <p class="tagline" style="color:${tokens.role.brandDeep}">${tokens.voice.platformTagline}</p>
      <h1 class="display headline">${headline}</h1>

      <div class="product-stage">
        <img src="${assets.product}" alt="${campaign.product.alt ?? campaign.product.name}">
        <span class="price-tag" style="background:${tokens.role.brand}; color:${tokens.role.onBrand}">
          <span class="amt">${campaign.product.price}</span>
        </span>
      </div>

      <div class="meta">
        <p class="supports">Every purchase supports</p>
        <div class="lockup">
          <img class="hero-mark" src="${assets.businessLogo}" alt="${campaign.business.name}">
          <span class="cross">&times;</span>
          <img class="cause-mark" src="${assets.causeLogo}" alt="${campaign.cause.name}">
        </div>
      </div>

      ${progressHtml(progress, {
        trackHeight: '1.5rem',
        bg: 'rgba(47,47,47,.12)',
        fill: business.raw,
        text: tokens.role.text,
      })}
    </main>

    <footer class="foot">
      <div class="qr-block">
        <img src="${assets.qrLight}" alt="Scan to support" width="112" height="112">
        <div class="qr-copy">
          <div class="scan">${moment.cta}</div>
          <div class="url">${campaign.campaignUrl.replace(/^https?:\/\//, '')}</div>
        </div>
      </div>
      <div class="foot-right">
        <div class="powered" style="color:${tokens.role.textSoft}">${ourtownMark(tokens.role.brandDeep)}</div>
        <div class="badges">${badgeHtml(campaign.badges, tokens, business.primary)}</div>
      </div>
    </footer>

    <p class="disclosure">${campaign.disclosure}</p>
  </div>`;

  const css = /* css */ `
    .band {
      flex: 0 0 auto; height: 11.5rem; background: ${business.raw}; color: ${onBand};
      display: flex; align-items: center; justify-content: space-between; padding: 0 4.5rem;
    }
    .band .biz-mark { height: 5.4rem; max-width: 34rem; object-fit: contain; }

    .body { flex: 1 1 auto; display: flex; flex-direction: column; padding: 3.6rem 4.5rem 0; gap: 2.2rem; min-height: 0; }
    .tagline { font-size: 1.75rem; }
    .headline { font-size: 7.6rem; max-width: 78rem; }

    .product-stage { flex: 1 1 auto; min-height: 0; margin: 0.5rem 0; }
    .product-stage img { max-height: 100%; }
    .price-tag { top: 0.5rem; right: 1rem; width: 13rem; font-size: 3.5rem; box-shadow: ${tokens.shadow.card}; }

    .meta { display: flex; flex-direction: column; gap: 1.4rem; }

    .foot {
      flex: 0 0 auto; display: flex; align-items: center; justify-content: space-between;
      padding: 2.4rem 4.5rem 0; gap: 2rem;
    }
    .foot-right { display: flex; flex-direction: column; align-items: flex-end; gap: 1.1rem; }
    .qr-block img { width: 10.4rem; height: 10.4rem; }

    .disclosure { flex: 0 0 auto; padding: 1.6rem 4.5rem 2.2rem; text-align: left; }
  `;

  return shell({ ...spec, css, body, tokens });
}
