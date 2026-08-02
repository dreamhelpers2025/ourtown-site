/**
 * Web sidebar banner, 300x600 (IAB half page).
 *
 * The tightest surface in the kit and the one that tests the disclosure rule
 * hardest: at 300px wide there is no room to be generous, but the requirement
 * does not scale down with the ad unit. The disclosure is set at 9px here --
 * small, still legible on screen, and deliberately not dropped. If a future
 * format genuinely cannot carry it, that format should not carry the claim
 * either.
 */

import { shell, ourtownMark, progressHtml, markOnField, mark, productHtml } from './base.js';
import { onColor } from '../lib/color.js';

export const spec = { id: 'sidebar-banner', width: 300, height: 600, unit: 'px', outputs: ['png'], label: 'Web sidebar banner 300x600' };

export function render({ campaign, tokens, moment, progress, assets, business }) {
  const onField = onColor(business.raw);

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
      <span class="moment" style="background:${onField === '#ffffff' ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,.14)'}; color:${onField}">${moment.eyebrow}</span>
    </header>

    <main class="body">
      <p class="tagline" style="color:${tokens.role.brandDeep}">${tokens.voice.platformTagline}</p>
      <h1 class="display headline">${campaign.headline}</h1>

      <div class="product-stage">${productHtml(campaign, assets, tokens)}</div>

      ${progressHtml(progress, {
        trackHeight: '1.6rem',
        bg: 'rgba(47,47,47,.12)',
        fill: business.raw,
        text: tokens.role.text,
      })}

      <div class="supports-row">
        <p class="supports">Every purchase supports</p>
        ${mark({ src: assets.causeLogoCompact, logoStyle: campaign.cause.logoStyle, alt: campaign.cause.name, className: 'cause-mark' })}
      </div>

      <div class="cta" style="background:${business.raw}; color:${onField}">${moment.cta}</div>
    </main>

    <footer class="foot">
      <div class="powered" style="color:${tokens.role.textSoft}">${ourtownMark(assets)}</div>
      <p class="disclosure">${campaign.disclosure}</p>
    </footer>
  </div>`;

  const css = /* css */ `
    .band {
      flex: 0 0 auto; background: ${business.raw};
      display: flex; align-items: center; justify-content: space-between;
      gap: 1.5rem; padding: 2.6rem 3.4rem;
    }
    .band .biz-mark { height: 9rem; max-width: 30rem; object-fit: contain; }
    .band .mark-tile { border-radius: 1.6rem; }
    .band .moment {
      font-size: 2.6rem; padding: 1rem 1.6rem; letter-spacing: 0.08em; line-height: 1;
    }

    .body { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; gap: 2.6rem; padding: 3rem 3.4rem 0; }
    .tagline { font-size: 3rem; }
    .headline { font-size: 9.5rem; }

    .product-stage { flex: 1 1 auto; min-height: 0; }
    .product-stage .product-card { height: 100%; width: auto; border-radius: 2.6rem; }
    .price-tag { top: -1rem; right: -1rem; width: 17rem; font-size: 5rem; box-shadow: ${tokens.shadow.card}; }

    .progress .labels { font-size: 2.5rem; }

    .supports-row { display: flex; flex-direction: column; align-items: center; gap: 1.2rem; }
    .supports-row .supports { font-size: 2.4rem; }
    .supports-row .cause-mark { height: 15rem; max-width: 100%; object-fit: contain; }

    .cta {
      text-align: center; border-radius: ${tokens.radius.pill};
      font-family: ${tokens.font.display}; font-weight: 800; font-size: 3.6rem;
      padding: 2rem 1.5rem; line-height: 1;
    }

    .foot { flex: 0 0 auto; display: flex; flex-direction: column; gap: 1.2rem; padding: 2.4rem 3.4rem 2.6rem; }
    .powered { justify-content: center; }
    .powered .powered-label { font-size: 2.1rem; }
    .powered .ot-mark { height: 3.6rem; }
    /* 3rem = 9px. Small, but present and readable on screen. */
    .disclosure { font-size: 3rem; line-height: 1.3; text-align: center; max-width: none; }
  `;

  return shell({ ...spec, css, body, tokens });
}
