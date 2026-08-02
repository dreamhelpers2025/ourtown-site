/**
 * Shared HTML shell and design-system CSS for every generated asset.
 *
 * Sizing convention: `html` font-size is set to 1% of the canvas width, so
 * `1rem` always means "1% of this asset's width". That lets one stylesheet
 * drive a 1080px Instagram square and an 8.5in poster without a second set of
 * measurements -- only the vertical rhythm is tuned per template.
 */

import { onColor } from '../lib/color.js';

export function shell({ width, height, unit = 'px', css, body, tokens }) {
  const rootSize = unit === 'in' ? `${width / 100}in` : `${width / 100}px`;
  return /* html */ `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${tokens.font.webfontUrl}" rel="stylesheet">
<style>
  :root { font-size: ${rootSize}; }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    width: ${width}${unit};
    height: ${height}${unit};
    overflow: hidden;
    font-family: ${tokens.font.body};
    color: ${tokens.role.text};
    background: ${tokens.role.surface};
    -webkit-font-smoothing: antialiased;
    text-rendering: geometricPrecision;
  }

  .canvas { position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; }

  /* --- Type ------------------------------------------------------------ */
  .display { font-family: ${tokens.font.display}; font-weight: 800; line-height: 0.94; letter-spacing: -0.02em; }
  .eyebrow {
    font-weight: 700; text-transform: uppercase; letter-spacing: 0.16em;
    font-size: 1.55rem; line-height: 1;
  }
  .tagline {
    font-family: ${tokens.font.display}; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.14em;
  }

  /* --- Moment pill ------------------------------------------------------ */
  .moment {
    display: inline-flex; align-items: center; gap: 0.7rem;
    padding: 0.85rem 1.9rem; border-radius: ${tokens.radius.pill};
    font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em;
    font-size: 1.5rem; line-height: 1; white-space: nowrap;
  }
  .moment .dot { width: 0.85rem; height: 0.85rem; border-radius: 50%; background: currentColor; }

  /* --- Partner lockup ---------------------------------------------------
     Hero / beneficiary / powered-by. Never three equal logos: the business
     logo is set larger, the cause logo sits behind an "x", and OurTown always
     resolves the pairing in the footer. */
  .lockup { display: flex; align-items: center; justify-content: center; gap: 2.2rem; }
  .lockup img { object-fit: contain; display: block; }
  .lockup .hero-mark { height: 6.6rem; max-width: 30rem; }
  .lockup .cause-mark { height: 5.0rem; max-width: 24rem; }
  .lockup .cross { font-family: ${tokens.font.display}; font-weight: 600; font-size: 2.6rem; opacity: 0.4; }
  .supports {
    text-align: center; font-size: 1.5rem; font-weight: 600;
    letter-spacing: 0.06em; text-transform: uppercase; opacity: 0.72;
  }

  /* --- Product ---------------------------------------------------------- */
  .product-stage { position: relative; display: flex; align-items: center; justify-content: center; }
  .product-stage img { max-width: 100%; max-height: 100%; object-fit: contain; filter: drop-shadow(${tokens.shadow.lift}); }
  .price-tag {
    position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center;
    font-family: ${tokens.font.display}; font-weight: 800; line-height: 1;
    border-radius: 50%; aspect-ratio: 1;
  }

  /* --- Progress --------------------------------------------------------- */
  .progress { display: flex; flex-direction: column; gap: 1rem; width: 100%; }
  .progress .track { width: 100%; border-radius: ${tokens.radius.pill}; overflow: hidden; }
  .progress .fill { height: 100%; border-radius: ${tokens.radius.pill}; }
  .progress .labels { display: flex; justify-content: space-between; align-items: baseline; font-size: 1.5rem; font-weight: 600; }
  .progress .labels .pct { font-family: ${tokens.font.display}; font-weight: 800; }

  /* --- Badges ----------------------------------------------------------- */
  .badges { display: flex; flex-wrap: wrap; gap: 0.9rem; }
  .badge {
    display: inline-flex; align-items: center; gap: 0.55rem;
    padding: 0.7rem 1.35rem; border-radius: ${tokens.radius.pill};
    font-size: 1.28rem; font-weight: 700; letter-spacing: 0.04em; white-space: nowrap;
    border: 0.18rem solid currentColor;
  }
  .badge .ico { font-size: 1.4rem; line-height: 1; }

  /* --- Logo chip --------------------------------------------------------
     A partner logo placed on that partner's own brand color routinely loses
     part of itself -- a red wordmark on a red band simply disappears. Unless
     a dedicated light-on-dark variant is supplied, the mark gets a neutral
     chip so no automated render can silently drop half a logo. */
  .mark-chip {
    display: inline-flex; align-items: center; justify-content: center;
    background: #fff; border-radius: ${tokens.radius.sm};
    padding: 0.75rem 1.2rem; box-shadow: 0 0.2rem 0.9rem -0.35rem rgba(0,0,0,.4);
  }

  /* --- QR --------------------------------------------------------------- */
  .qr-block { display: flex; align-items: center; gap: 1.5rem; }
  .qr-block img { display: block; border-radius: ${tokens.radius.sm}; background: #fff; }
  .qr-copy .scan { font-family: ${tokens.font.display}; font-weight: 700; font-size: 1.9rem; line-height: 1.1; }
  .qr-copy .url { font-size: 1.35rem; opacity: 0.7; word-break: break-all; }

  /* --- Footer / disclosure ---------------------------------------------
     The disclosure is a first-class element, not an afterthought: charitable
     sales promotions are regulated in many states and the required amount
     statement has to actually be legible on the finished piece. */
  .powered { display: flex; align-items: center; gap: 0.8rem; font-size: 1.45rem; font-weight: 600; letter-spacing: 0.06em; }
  .powered .ot-mark { height: 2.4rem; }
  .disclosure { font-size: 1.12rem; line-height: 1.35; opacity: 0.72; max-width: 62rem; }

  ${css}
</style>
</head>
<body>
${body}
</body>
</html>`;
}

/**
 * Renders a partner mark that is about to sit on a colored field.
 *
 * With a supplied `logoOnDark` we trust the partner's own variant. Without one,
 * the mark is chipped onto white rather than gambling that none of its ink
 * matches the field behind it.
 */
export function markOnField({ src, hasDarkVariant, alt, className }) {
  const img = `<img class="${className}" src="${src}" alt="${alt}">`;
  return hasDarkVariant ? img : `<span class="mark-chip">${img}</span>`;
}

/** Inline OurTown wordmark so the footer lockup never depends on an external file. */
export function ourtownMark(color) {
  return /* html */ `<svg class="ot-mark" viewBox="0 0 260 40" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="OurTown">
    <circle cx="20" cy="20" r="16" stroke="${color}" stroke-width="4"/>
    <path d="M13 22 L20 12 L27 22 L27 28 L13 28 Z" fill="${color}"/>
    <text x="46" y="29" font-family="Poppins, sans-serif" font-weight="800" font-size="26" fill="${color}">OurTown</text>
  </svg>`;
}

export function badgeHtml(ids = [], tokens, palette) {
  return ids
    .map((id) => {
      const b = tokens.badges[id];
      if (!b) return '';
      const tone = { brand: tokens.role.brandDeep, accent: tokens.role.accent, heritage: tokens.color.heritage[600], forest: tokens.color.forest[600] }[b.tone] ?? palette;
      return `<span class="badge" style="color:${tone}"><span class="ico">${b.icon}</span>${b.label}</span>`;
    })
    .join('');
}

export function progressHtml(progress, { trackHeight, bg, fill, text }) {
  if (progress.pct <= 0) return '';
  return /* html */ `<div class="progress" style="color:${text}">
    <div class="track" style="height:${trackHeight}; background:${bg}">
      <div class="fill" style="width:${Math.max(progress.pct * 100, 4)}%; background:${fill}"></div>
    </div>
    <div class="labels">
      <span><span class="pct">${progress.valueLabel}</span> of ${progress.targetLabel} ${progress.unit}</span>
      <span class="pct">${progress.percentLabel}</span>
    </div>
  </div>`;
}

export { onColor };
