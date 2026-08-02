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
  /* Sized generously because supplied marks often carry their own internal
     padding -- the VYB horizontal lockup is ~1280x896 with the artwork
     occupying well under half the frame, so a nominal height renders small. */
  .lockup .hero-mark { height: 8.4rem; max-width: 34rem; }
  .lockup .cause-mark { height: 7.6rem; max-width: 32rem; }
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
  /* For marks delivered with their own background baked in. Rounding the block
     makes it read as a badge instead of an un-knocked-out rectangle. */
  .mark-tile {
    display: inline-flex; overflow: hidden; border-radius: ${tokens.radius.md};
    box-shadow: 0 0.15rem 0.7rem -0.3rem rgba(0,0,0,.35);
  }
  .mark-tile img { display: block; }

  /* Photographic products keep their own background inside a framed card.
     The card is sized by its stage, never by the source image -- a 2790x3308
     photo must not be allowed to dictate the canvas. */
  .product-card {
    overflow: hidden; border-radius: ${tokens.radius.lg};
    box-shadow: ${tokens.shadow.lift}; background: #fff;
    display: flex; align-items: center; justify-content: center;
    height: 100%; width: auto; max-width: 100%; max-height: 100%; min-height: 0;
  }
  .product-card img { width: 100%; height: 100%; object-fit: cover; display: block; }

  /* --- QR --------------------------------------------------------------- */
  .qr-block { display: flex; align-items: center; gap: 1.5rem; }
  .qr-block img { display: block; border-radius: ${tokens.radius.sm}; background: #fff; }
  .qr-copy .scan { font-family: ${tokens.font.display}; font-weight: 700; font-size: 1.9rem; line-height: 1.1; }
  .qr-copy .url { font-size: 1.35rem; opacity: 0.7; word-break: break-all; }

  /* --- Footer / disclosure ---------------------------------------------
     The disclosure is a first-class element, not an afterthought: charitable
     sales promotions are regulated in many states and the required amount
     statement has to actually be legible on the finished piece. */
  .powered { display: flex; align-items: center; gap: 0.75rem; }
  .powered .powered-label {
    font-size: 1.25rem; font-weight: 600; letter-spacing: 0.1em;
    text-transform: uppercase; opacity: 0.7; white-space: nowrap;
  }
  .powered .ot-mark { height: 2.1rem; width: auto; display: block; }
  /* The gold wordmark (#f8a800) does not clear contrast on cream, and no
     transparent dark version was supplied -- brightness(0) knocks the solid
     wordmark to ink while preserving its alpha. */
  .powered .ot-mark--ink { filter: brightness(0); opacity: 0.78; }
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
 * A mark supplied with its own baked-in background (`logoStyle: "tile"`) is
 * already opaque, so it just gets rounded corners. A transparent mark with a
 * supplied `logoOnDark` variant is trusted as-is. Anything else is chipped onto
 * white rather than gambling that none of its ink matches the field behind it.
 */
export function markOnField({ src, hasDarkVariant, logoStyle, alt, className }) {
  const img = `<img class="${className}" src="${src}" alt="${alt}">`;
  if (logoStyle === 'tile') return `<span class="mark-tile">${img}</span>`;
  return hasDarkVariant ? img : `<span class="mark-chip">${img}</span>`;
}

/** A partner mark on a light surface. Tiles keep their rounded treatment. */
export function mark({ src, logoStyle, alt, className }) {
  const img = `<img class="${className}" src="${src}" alt="${alt}">`;
  return logoStyle === 'tile' ? `<span class="mark-tile">${img}</span>` : img;
}

/**
 * The real OurTown wordmark. Dark on light surfaces, gold on dark ones --
 * the gold reads at #f8a800 and would not clear contrast on cream.
 */
export function ourtownMark(assets, onDark = false) {
  return `<span class="powered-label">Powered by</span><img class="ot-mark${onDark ? '' : ' ot-mark--ink'}" src="${assets.otWordmark}" alt="OurTown">`;
}

/** Product imagery: a floating cutout, or a photo framed in a card. */
export function productHtml(campaign, assets, tokens, { priceStyle = '' } = {}) {
  const alt = campaign.product.alt ?? campaign.product.name;
  // Matching the card to the photo's own ratio means `cover` crops nothing.
  const ratio = assets.productAspect ? `aspect-ratio:${assets.productAspect};` : '';
  const img = campaign.product.style === 'photo'
    ? `<span class="product-card" style="${ratio}"><img src="${assets.product}" alt="${alt}"></span>`
    : `<img src="${assets.product}" alt="${alt}">`;
  return `${img}
    <span class="price-tag" style="background:${tokens.role.brand}; color:${tokens.role.onBrand}; ${priceStyle}">${campaign.product.price}</span>`;
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
