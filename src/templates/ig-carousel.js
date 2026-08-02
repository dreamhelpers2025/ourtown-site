/**
 * Instagram carousel, 1080x1080 x 5 slides.
 *
 * The slides build an argument rather than restating one image five times:
 * hook, product, cause, where the money actually goes, call to action. Slide 4
 * is the one that makes this format worth having -- it states the split in
 * plain numbers, which is exactly what a charitable sales promotion is supposed
 * to disclose and what a single graphic never has room for.
 */

import { shell, ourtownMark, badgeHtml, progressHtml, markOnField, mark, productHtml } from './base.js';
import { onColor } from '../lib/color.js';

export const spec = {
  id: 'ig-carousel', width: 1080, height: 1080, unit: 'px',
  outputs: ['png'], slides: 5, label: 'Instagram carousel (5 slides)',
};

/** Pulls the leading "$18" style figure out of the disclosure, if present. */
function splitFigure(disclosure) {
  const m = disclosure.match(/\$[\d,]+(?:\.\d{2})?/);
  return m ? m[0] : null;
}

export function render({ campaign, tokens, moment, progress, assets, business, cause, slide = 0 }) {
  const onField = onColor(business.raw);
  const toCause = splitFigure(campaign.disclosure);

  const head = (dark) => /* html */ `
    <header class="head ${dark ? 'on-field' : ''}">
      ${dark
        ? markOnField({
            src: assets.businessLogoOnDark,
            hasDarkVariant: Boolean(campaign.business.logoOnDark),
            logoStyle: campaign.business.logoStyle,
            alt: campaign.business.name,
            className: 'biz-mark',
          })
        : mark({ src: assets.businessLogo, logoStyle: campaign.business.logoStyle, alt: campaign.business.name, className: 'biz-mark' })}
      <span class="pager" style="color:${dark ? onField : tokens.role.textSoft}">${slide + 1} / ${spec.slides}</span>
    </header>`;

  const foot = (dark) => /* html */ `
    <footer class="foot ${dark ? 'on-field' : ''}">
      <div class="powered" style="color:${dark ? onField : tokens.role.textSoft}">${ourtownMark(assets, dark)}</div>
      <p class="disclosure" ${dark ? `style="color:${onField}"` : ''}>${campaign.disclosure}</p>
    </footer>`;

  const SLIDES = [
    // 1 — Hook
    () => ({
      dark: true,
      main: /* html */ `
        <p class="tagline" style="color:${onField}; opacity:.85">${tokens.voice.platformTagline}</p>
        <h1 class="display headline" style="color:${onField}">${campaign.headline}</h1>
        ${campaign.subhead ? `<p class="lede" style="color:${onField}">${campaign.subhead}</p>` : ''}
        <span class="swipe" style="color:${onField}">Swipe &rarr;</span>`,
    }),

    // 2 — Product
    () => ({
      dark: false,
      main: /* html */ `
        <p class="eyebrow-sm" style="color:${tokens.role.brandDeep}">The Product</p>
        <div class="product-stage">${productHtml(campaign, assets, tokens)}</div>
        <p class="prod-name">${campaign.product.name}</p>`,
    }),

    // 3 — Cause
    () => ({
      dark: false,
      main: /* html */ `
        <p class="eyebrow-sm" style="color:${tokens.role.brandDeep}">Who It Helps</p>
        <div class="cause-block">
          ${mark({ src: assets.causeLogo, logoStyle: campaign.cause.logoStyle, alt: campaign.cause.name, className: 'cause-big' })}
          ${campaign.cause.mission ? `<p class="mission">${campaign.cause.mission}</p>` : ''}
        </div>
        <div class="badges">${badgeHtml(campaign.badges, tokens, business.primary)}</div>`,
    }),

    // 4 — Where the money goes
    () => ({
      dark: false,
      main: /* html */ `
        <p class="eyebrow-sm" style="color:${tokens.role.brandDeep}">Where It Goes</p>
        <div class="split">
          <div class="split-cell">
            <span class="split-num display">${campaign.product.price}</span>
            <span class="split-lbl">you pay</span>
          </div>
          <span class="split-arrow">&rarr;</span>
          <div class="split-cell accent" style="color:${cause.primary}">
            <span class="split-num display">${toCause ?? '—'}</span>
            <span class="split-lbl">to ${campaign.cause.shortName ?? campaign.cause.name}</span>
          </div>
        </div>
        ${progressHtml(progress, {
          trackHeight: '1.5rem',
          bg: 'rgba(47,47,47,.12)',
          fill: business.raw,
          text: tokens.role.text,
        })}
        ${campaign.goal.statement ? `<p class="goal-line">${campaign.goal.statement}</p>` : ''}`,
    }),

    // 5 — Call to action
    () => ({
      dark: true,
      main: /* html */ `
        <h2 class="display cta-head" style="color:${onField}">${moment.cta}</h2>
        <img class="qr-big" src="${assets.qrLight}" alt="Scan to support">
        <p class="url-big" style="color:${onField}">${campaign.campaignUrl.replace(/^https?:\/\//, '')}</p>`,
    }),
  ];

  const { dark, main } = SLIDES[slide]();

  const body = /* html */ `
  <div class="canvas ${dark ? 'field' : ''}">
    ${head(dark)}
    <main class="body">${main}</main>
    ${foot(dark)}
  </div>`;

  const css = /* css */ `
    .canvas.field { background: ${business.raw}; }

    .head { flex: 0 0 auto; display: flex; align-items: center; justify-content: space-between; padding: 4rem 4.5rem 0; }
    .head .biz-mark { height: 6rem; max-width: 30rem; object-fit: contain; }
    .head .pager { font-size: 1.5rem; font-weight: 700; letter-spacing: 0.14em; }

    .body {
      flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column;
      justify-content: center; gap: 2.4rem; padding: 2.5rem 4.5rem;
    }
    .eyebrow-sm {
      font-size: 1.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.16em;
    }
    .tagline { font-size: 1.9rem; }
    .headline { font-size: 8.6rem; }
    .lede { font-size: 2.5rem; line-height: 1.3; opacity: 0.9; max-width: 66rem; }
    .swipe { font-size: 1.9rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.85; }

    .product-stage { flex: 1 1 auto; min-height: 0; }
    .price-tag { top: 0; right: 0; width: 13rem; font-size: 3.5rem; box-shadow: ${tokens.shadow.card}; }
    .prod-name { font-family: ${tokens.font.display}; font-weight: 700; font-size: 3rem; text-align: center; }

    .cause-block { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2.6rem; }
    .cause-big { height: 16rem; max-width: 68rem; object-fit: contain; }
    .mission { font-size: 2.6rem; line-height: 1.35; text-align: center; max-width: 62rem; color: ${tokens.role.textSoft}; }
    .badges { justify-content: center; }

    .split { display: flex; align-items: center; justify-content: center; gap: 3.5rem; padding: 1.5rem 0; }
    .split-cell { display: flex; flex-direction: column; align-items: center; gap: 0.6rem; }
    .split-num { font-size: 9rem; line-height: 1; }
    .split-lbl { font-size: 1.9rem; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; opacity: 0.75; text-align: center; }
    .split-arrow { font-size: 5rem; opacity: 0.35; }
    .goal-line { font-size: 2.3rem; text-align: center; color: ${tokens.role.textSoft}; }

    .cta-head { font-size: 7rem; text-align: center; }
    .qr-big { width: 34rem; height: 34rem; align-self: center; border-radius: ${tokens.radius.md}; background: #fff; padding: 1.2rem; }
    .url-big { font-size: 2.1rem; text-align: center; opacity: 0.9; word-break: break-all; }

    .foot { flex: 0 0 auto; display: flex; flex-direction: column; gap: 1.2rem; padding: 0 4.5rem 3.4rem; }
    .foot .disclosure { max-width: none; }
    .foot.on-field .disclosure { opacity: 0.85; }
  `;

  return shell({ ...spec, css, body, tokens });
}
