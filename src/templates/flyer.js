/**
 * Handout flyer, 8.5x11in.
 *
 * Deliberately not a second poster at the same size. A poster is read across a
 * room and carries one idea; a flyer is held in the hand, so it carries the
 * mechanics -- how it works, who the cause is, what the split is. If both ended
 * up identical there would be no reason for this format to exist.
 */

import { shell, ourtownMark, badgeHtml, progressHtml, markOnField, mark, productHtml } from './base.js';
import { onColor } from '../lib/color.js';

export const spec = { id: 'flyer', width: 8.5, height: 11, unit: 'in', outputs: ['pdf', 'png'], label: 'Handout flyer 8.5x11' };

const STEPS = [
  { n: '1', t: 'Scan the code', d: 'Point your phone at the code on this page.' },
  { n: '2', t: 'Buy the gear', d: 'Checkout takes under a minute on OurTown.' },
  { n: '3', t: 'The cause gets paid', d: 'A fixed amount goes straight to the nonprofit.' },
];

export function render({ campaign, tokens, moment, progress, assets, business, cause }) {
  const onBand = onColor(business.raw);
  const toCause = campaign.disclosure.match(/\$[\d,]+(?:\.\d{2})?/)?.[0];

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
      <section class="intro">
        <div class="intro-copy">
          <p class="tagline" style="color:${tokens.role.brandDeep}">${tokens.voice.platformTagline}</p>
          <h1 class="display headline">${campaign.headline}</h1>
          ${campaign.subhead ? `<p class="subhead">${campaign.subhead}</p>` : ''}
          <p class="prod-line"><strong>${campaign.product.name}</strong> · ${campaign.product.price}</p>
        </div>
        <div class="product-stage">${productHtml(campaign, assets, tokens)}</div>
      </section>

      <section class="steps">
        ${STEPS.map((s) => `
          <div class="step">
            <span class="step-n" style="background:${business.raw}; color:${onBand}">${s.n}</span>
            <div class="step-copy">
              <p class="step-t">${s.t}</p>
              <p class="step-d">${s.d}</p>
            </div>
          </div>`).join('')}
      </section>

      <section class="cause-row">
        <div class="cause-copy">
          <p class="supports">Every purchase supports</p>
          ${mark({ src: assets.causeLogo, logoStyle: campaign.cause.logoStyle, alt: campaign.cause.name, className: 'cause-mark' })}
          ${campaign.cause.mission ? `<p class="mission">${campaign.cause.mission}</p>` : ''}
        </div>
        ${toCause ? `
        <div class="split-box" style="border-color:${cause.primary}">
          <span class="split-num display" style="color:${cause.primary}">${toCause}</span>
          <span class="split-lbl">per ${campaign.product.name.toLowerCase().includes('hat') ? 'hat' : 'item'} to the cause</span>
        </div>` : ''}
      </section>

      ${progressHtml(progress, {
        trackHeight: '1rem',
        bg: 'rgba(47,47,47,.12)',
        fill: business.raw,
        text: tokens.role.text,
      })}

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
      <div class="powered" style="color:${tokens.role.textSoft}">${ourtownMark(assets)}</div>
    </footer>

    <p class="disclosure">${campaign.disclosure}</p>
  </div>`;

  const css = /* css */ `
    @page { size: 8.5in 11in; margin: 0; }
    body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }

    .band {
      flex: 0 0 auto; height: 7.5rem; background: ${business.raw}; color: ${onBand};
      display: flex; align-items: center; justify-content: space-between; padding: 0 5.5rem;
    }
    .band .biz-mark { height: 4.4rem; max-width: 30rem; object-fit: contain; }
    .band .moment { font-size: 1.4rem; }

    .body { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; gap: 2.4rem; padding: 3rem 5.5rem 0; }

    .intro { flex: 1 1 auto; display: grid; grid-template-columns: 1.25fr 1fr; gap: 3rem; align-items: center; min-height: 0; }
    .intro-copy { display: flex; flex-direction: column; gap: 1.2rem; min-width: 0; }
    .tagline { font-size: 1.5rem; }
    .headline { font-size: 6rem; }
    .subhead { font-size: 1.9rem; line-height: 1.3; color: ${tokens.role.textSoft}; }
    .prod-line { font-size: 1.8rem; }
    .intro .product-stage { height: 100%; min-height: 0; }
    .intro .product-card { height: 100%; width: auto; }
    .price-tag { top: -0.8rem; right: -0.8rem; width: 9rem; font-size: 2.6rem; box-shadow: ${tokens.shadow.card}; }

    .steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
    .step { display: flex; gap: 1.2rem; align-items: flex-start; }
    .step-n {
      flex: 0 0 auto; width: 3.4rem; height: 3.4rem; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-family: ${tokens.font.display}; font-weight: 800; font-size: 1.8rem;
    }
    .step-copy { min-width: 0; }
    .step-t { font-family: ${tokens.font.display}; font-weight: 700; font-size: 1.85rem; line-height: 1.15; }
    .step-d { font-size: 1.45rem; line-height: 1.35; color: ${tokens.role.textSoft}; margin-top: 0.35rem; }

    .cause-row { display: flex; align-items: center; justify-content: space-between; gap: 3rem; }
    .cause-copy { display: flex; flex-direction: column; gap: 1rem; align-items: flex-start; min-width: 0; }
    .cause-copy .supports { text-align: left; font-size: 1.4rem; }
    .cause-copy .cause-mark { height: 9.5rem; max-width: 44rem; object-fit: contain; }
    .mission { font-size: 1.55rem; line-height: 1.35; color: ${tokens.role.textSoft}; max-width: 48rem; }
    .split-box {
      flex: 0 0 auto; display: flex; flex-direction: column; align-items: center; gap: 0.3rem;
      border: 0.35rem solid; border-radius: ${tokens.radius.md}; padding: 1.5rem 2.4rem;
    }
    .split-num { font-size: 5.4rem; line-height: 1; }
    .split-lbl { font-size: 1.25rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; opacity: 0.75; text-align: center; }

    .foot {
      flex: 0 0 auto; display: flex; align-items: center; justify-content: space-between;
      padding: 2.2rem 5.5rem 0; gap: 2rem;
    }
    /* 15rem = 1.275in, clears the 1.25in QR floor */
    .foot .qr-block img { width: 15rem; height: 15rem; }
    .foot .qr-copy .scan { font-size: 2.3rem; }
    .foot .qr-copy .url { font-size: 1.4rem; }

    /* 1.35rem = 8.26pt at 8.5in wide, clears the 8pt floor */
    .disclosure { flex: 0 0 auto; font-size: 1.35rem; padding: 1.4rem 5.5rem 2.2rem; max-width: none; }
  `;

  return shell({ ...spec, css, body, tokens });
}
