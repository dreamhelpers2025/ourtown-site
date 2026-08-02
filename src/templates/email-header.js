/**
 * Email header banner, 1200x400.
 *
 * Short and wide, so this is the one surface that drops the product shot and
 * leads with the partnership itself.
 */

import { shell, ourtownMark, markOnField, mark } from './base.js';
import { onColor } from '../lib/color.js';

export const spec = { id: 'email-header', width: 1200, height: 400, unit: 'px', outputs: ['png'], label: 'Email header banner' };

export function render({ campaign, tokens, moment, progress, assets, business }) {
  const onField = onColor(business.raw);

  const body = /* html */ `
  <div class="canvas">
    <div class="field">
      <div class="row-top">
        ${markOnField({
          src: assets.businessLogoOnDark,
          hasDarkVariant: Boolean(campaign.business.logoOnDark),
          logoStyle: campaign.business.logoStyle,
          alt: campaign.business.name,
          className: 'biz-mark',
        })}
        <span class="cross" style="color:${onField}">&times;</span>
        <span class="mark-chip">${mark({ src: assets.causeLogo, logoStyle: campaign.cause.logoStyle, alt: campaign.cause.name, className: 'cause-mark' })}</span>
      </div>

      <h1 class="display headline" style="color:${onField}">${campaign.headline}</h1>

      <div class="row-bot" style="color:${onField}">
        <span class="moment" style="background:${onField === '#ffffff' ? 'rgba(255,255,255,.18)' : 'rgba(0,0,0,.12)'}">
          <span class="dot"></span>${moment.eyebrow}${progress.pct > 0 ? ` · ${progress.percentLabel}` : ''}
        </span>
        <div class="powered">${ourtownMark(assets, onField === '#ffffff')}</div>
      </div>

      <p class="disclosure" style="color:${onField}">${campaign.disclosure}</p>
    </div>
  </div>`;

  const css = /* css */ `
    .field {
      width: 100%; height: 100%; background: ${business.raw};
      padding: 2.6rem 3.4rem; display: flex; flex-direction: column;
      align-items: center; justify-content: center; gap: 1.5rem; text-align: center;
    }
    .row-top { display: flex; align-items: center; gap: 1.8rem; }
    .row-top .biz-mark { height: 6.4rem; max-width: 26rem; object-fit: contain; }
    .row-top .cause-mark { height: 5rem; max-width: 24rem; object-fit: contain; }
    .row-top .cross { font-family: ${tokens.font.display}; font-weight: 600; font-size: 2.2rem; opacity: 0.55; }
    .row-top .mark-chip { padding: 0.7rem 1.1rem; }
    .row-top .mark-tile { border-radius: ${tokens.radius.sm}; }

    .headline { font-size: 4.4rem; }

    .row-bot { display: flex; align-items: center; gap: 2rem; }
    .row-bot .moment { font-size: 1.05rem; padding: 0.55rem 1.3rem; }
    .powered .powered-label { font-size: 0.92rem; }
    .powered .ot-mark { height: 1.6rem; }

    .disclosure { font-size: 0.95rem; opacity: 0.82; max-width: 76rem; text-align: center; }
  `;

  return shell({ ...spec, css, body, tokens });
}
