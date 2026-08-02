/**
 * Instagram / Facebook story, 1080x1920.
 *
 * Story surfaces are where "business colors dominate" actually shows: the
 * partner's brand color runs full bleed and OurTown resolves the pairing in the
 * footer. Content is kept inside the platform safe zones -- roughly the top and
 * bottom 250px are covered by profile chrome, reply bars and swipe affordances.
 */

import { shell, ourtownMark, badgeHtml, progressHtml, markOnField, mark, productHtml } from './base.js';
import { onColor } from '../lib/color.js';

export const spec = { id: 'story', width: 1080, height: 1920, unit: 'px', outputs: ['png'], label: 'Instagram / Facebook story' };

const SAFE_TOP = '15rem';
const SAFE_BOTTOM = '15rem';

export function render({ campaign, tokens, moment, progress, assets, business }) {
  const onField = onColor(business.raw);
  const causeName = campaign.cause.shortName ?? campaign.cause.name;

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
        <span class="moment" style="background:${onField === '#ffffff' ? 'rgba(255,255,255,.18)' : 'rgba(0,0,0,.12)'}; color:${onField}">
          <span class="dot"></span>${moment.eyebrow}
        </span>
      </header>

      <section class="card">
        <p class="tagline" style="color:${tokens.role.brandDeep}">${tokens.voice.platformTagline}</p>
        <h1 class="display headline">${campaign.headline}</h1>

        <div class="product-stage">
          ${productHtml(campaign, assets, tokens)}
        </div>

        <p class="prod-name">${campaign.product.name}</p>

        ${progressHtml(progress, {
          trackHeight: '1.7rem',
          bg: 'rgba(47,47,47,.12)',
          fill: business.raw,
          text: tokens.role.text,
        })}

        <div class="meta">
          <p class="supports">Every purchase supports</p>
          <div class="lockup">
            ${mark({ src: assets.causeLogo, logoStyle: campaign.cause.logoStyle, alt: campaign.cause.name, className: 'cause-mark' })}
          </div>
          <p class="cause-name">${causeName}</p>
        </div>

        <div class="badges">${badgeHtml(campaign.badges, tokens, business.primary)}</div>
      </section>

      <footer class="foot" style="color:${onField}">
        <div class="qr-block">
          <img src="${assets.qrLight}" alt="Scan to support">
          <div class="qr-copy">
            <div class="scan">${moment.cta}</div>
            <div class="url">${campaign.campaignUrl.replace(/^https?:\/\//, '')}</div>
          </div>
        </div>
        <div class="powered">${ourtownMark(assets, onField === '#ffffff')}</div>
        <p class="disclosure" style="color:${onField}">${campaign.disclosure}</p>
      </footer>
    </div>
  </div>`;

  const css = /* css */ `
    .field {
      width: 100%; height: 100%; background: ${business.raw};
      padding: ${SAFE_TOP} 4.5rem ${SAFE_BOTTOM};
      display: flex; flex-direction: column; gap: 3rem;
    }

    .head { flex: 0 0 auto; display: flex; align-items: center; justify-content: space-between; }
    .head .biz-mark { height: 6.2rem; max-width: 40rem; object-fit: contain; }

    .card {
      flex: 1 1 auto; min-height: 0;
      background: ${tokens.role.surfaceAlt}; border-radius: ${tokens.radius.lg};
      padding: 4.2rem 4rem; display: flex; flex-direction: column; gap: 2.4rem;
      box-shadow: ${tokens.shadow.lift};
    }
    .tagline { font-size: 1.85rem; }
    .headline { font-size: 8.4rem; }

    .product-stage { flex: 1 1 auto; min-height: 0; }
    .product-stage img { max-height: 100%; }
    .price-tag {
      top: 0; right: 0; width: 14rem; font-size: 3.8rem;
      box-shadow: ${tokens.shadow.card};
    }

    .prod-name { font-family: ${tokens.font.display}; font-weight: 700; font-size: 2.6rem; text-align: center; }

    .meta { display: flex; flex-direction: column; align-items: center; gap: 1.2rem; }
    .cause-name { font-family: ${tokens.font.display}; font-weight: 700; font-size: 2.3rem; color: ${tokens.role.accent}; text-align: center; }
    .badges { justify-content: center; }

    .foot { flex: 0 0 auto; display: flex; flex-direction: column; gap: 1.6rem; }
    .foot .qr-block img { width: 11rem; height: 11rem; }
    .foot .qr-copy .scan { font-size: 2.2rem; }
    .foot .qr-copy .url { opacity: 0.85; }
    /* Stories are viewed at arm's length on a phone; the disclosure is set
       larger here than on the square so it stays genuinely readable. */
    .foot .disclosure { opacity: 0.92; font-size: 1.45rem; line-height: 1.4; max-width: none; }
  `;

  return shell({ ...spec, css, body, tokens });
}
