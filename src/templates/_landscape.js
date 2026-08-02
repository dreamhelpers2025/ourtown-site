/**
 * Shared landscape layout: text column left, product right.
 *
 * Drives LinkedIn (1200x627), X (1600x900) and the website hero (1600x600).
 * They differ only in canvas size and a couple of density tweaks, so they share
 * one layout rather than three near-copies that drift apart.
 */

import { shell, ourtownMark, badgeHtml, progressHtml, markOnField, mark, productHtml } from './base.js';
import { onColor } from '../lib/color.js';

export function makeLandscape({ id, width, height, label, density = 'normal' }) {
  const spec = { id, width, height, unit: 'px', outputs: ['png'], label };
  const tight = density === 'tight';

  function render({ campaign, tokens, moment, progress, assets, business }) {
    const onField = onColor(business.raw);

    const body = /* html */ `
    <div class="canvas">
      <div class="grid">
        <section class="col-text">
          <div class="topline">
            ${markOnField({
              src: assets.businessLogoOnDark,
              hasDarkVariant: Boolean(campaign.business.logoOnDark),
              logoStyle: campaign.business.logoStyle,
              alt: campaign.business.name,
              className: 'biz-mark',
            })}
            <span class="moment" style="background:rgba(47,47,47,.07); color:${tokens.role.text}">
              <span class="dot" style="background:${business.raw}"></span>${moment.eyebrow}
            </span>
          </div>

          <div class="headline-block">
            <p class="tagline" style="color:${tokens.role.brandDeep}">${tokens.voice.platformTagline}</p>
            <h1 class="display headline">${campaign.headline}</h1>
            ${!tight && campaign.subhead ? `<p class="subhead">${campaign.subhead}</p>` : ''}
          </div>

          ${progressHtml(progress, {
            trackHeight: '0.95rem',
            bg: 'rgba(47,47,47,.12)',
            fill: business.raw,
            text: tokens.role.text,
          })}

          <div class="meta">
            <p class="supports">Every purchase supports</p>
            <div class="lockup">
              ${mark({ src: assets.causeLogo, logoStyle: campaign.cause.logoStyle, alt: campaign.cause.name, className: 'cause-mark' })}
            </div>
          </div>

          <div class="cta-row">
            <div class="qr-block">
              <img src="${assets.qrLight}" alt="Scan to support">
              <div class="qr-copy">
                <div class="scan">${moment.cta}</div>
                <div class="url">${campaign.campaignUrl.replace(/^https?:\/\//, '')}</div>
              </div>
            </div>
            <div class="powered" style="color:${tokens.role.textSoft}">${ourtownMark(assets)}</div>
          </div>
        </section>

        <aside class="col-product" style="background:${business.raw}">
          <div class="product-stage">
            ${productHtml(campaign, assets, tokens)}
          </div>
          ${!tight ? `<div class="badges">${badgeHtml(campaign.badges, tokens, business.primary)}</div>` : ''}
        </aside>
      </div>

      <p class="disclosure">${campaign.disclosure}</p>
    </div>`;

    const css = /* css */ `
      .grid { flex: 1 1 auto; min-height: 0; display: grid; grid-template-columns: 1.18fr 1fr; }

      .col-text {
        display: flex; flex-direction: column; justify-content: space-between;
        padding: ${tight ? '2.6rem 3rem' : '3rem 3.4rem'}; gap: ${tight ? '1.4rem' : '1.9rem'};
        min-width: 0; min-height: 0;
      }
      .topline { display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; }
      .topline .biz-mark { height: ${tight ? '3.4rem' : '4rem'}; max-width: 22rem; object-fit: contain; }
      .topline .moment { font-size: 1.05rem; padding: 0.6rem 1.3rem; }

      .headline-block { display: flex; flex-direction: column; gap: 0.9rem; }
      .tagline { font-size: 1.15rem; }
      .headline { font-size: ${tight ? '4.4rem' : '4.9rem'}; }
      .subhead { font-size: 1.5rem; line-height: 1.3; color: ${tokens.role.textSoft}; }

      .progress .labels { font-size: 1.1rem; }
      .meta { display: flex; align-items: center; gap: 1.4rem; }
      .supports { font-size: 1.05rem; }
      .lockup .cause-mark { height: ${tight ? '4.4rem' : '5.2rem'}; max-width: 26rem; }

      .cta-row { display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; }
      .cta-row .qr-block img { width: ${tight ? '5.6rem' : '6.4rem'}; height: ${tight ? '5.6rem' : '6.4rem'}; }
      .cta-row .qr-copy .scan { font-size: 1.4rem; }
      .cta-row .qr-copy .url { font-size: 1rem; }
      .powered .powered-label { font-size: 0.92rem; }
      .powered .ot-mark { height: 1.55rem; }

      .col-product {
        position: relative; display: flex; flex-direction: column;
        align-items: center; justify-content: center; gap: 1.4rem;
        padding: ${tight ? '2.2rem' : '2.8rem'}; min-width: 0; min-height: 0; overflow: hidden;
      }
      .col-product .product-stage { flex: 1 1 auto; width: 100%; min-height: 0; }
      .col-product .product-card { height: 100%; width: auto; }
      .col-product .price-tag {
        top: -0.5rem; right: -0.5rem; width: ${tight ? '6.4rem' : '7.2rem'};
        font-size: ${tight ? '1.9rem' : '2.15rem'}; box-shadow: ${tokens.shadow.card};
      }
      .col-product .badges { justify-content: center; flex: 0 0 auto; }
      .col-product .badge { background: rgba(255,255,255,.94); border-color: transparent; font-size: 0.95rem; padding: 0.5rem 1rem; }

      /* Its own full-width band on the surface color, so it can never collide
         with the product column or be clipped off the bottom of the canvas. */
      .disclosure {
        flex: 0 0 auto; background: ${tokens.role.surface};
        padding: 1rem 3.4rem 1.2rem; font-size: 0.92rem; max-width: none;
      }
    `;

    return shell({ ...spec, css, body, tokens });
  }

  return { spec, render };
}
