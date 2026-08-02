/**
 * Contrast-safe color handling.
 *
 * Automated co-branding lives or dies here. "Business colors dominate, cause
 * colors accent" is a lovely rule right up until a partner's brand color is
 * pale yellow and the headline sitting on it becomes unreadable. Rather than
 * shipping that -- or hand-fixing every new campaign -- we correct the color
 * until it clears WCAG, and report what we changed.
 */

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

export function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

export function rgbToHex({ r, g, b }) {
  const p = (n) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0');
  return `#${p(r)}${p(g)}${p(b)}`;
}

/** WCAG 2.1 relative luminance. */
export function luminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const channel = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** WCAG contrast ratio between two colors, 1..21. */
export function contrast(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/**
 * Pick whichever of `dark`/`light` is more readable on `bg`.
 * This is why we never hardcode text color on a partner-tinted surface.
 */
export function onColor(bg, dark = '#2f2f2f', light = '#ffffff') {
  return contrast(bg, dark) >= contrast(bg, light) ? dark : light;
}

function mix(hex, toward, amount) {
  const a = hexToRgb(hex);
  const b = hexToRgb(toward);
  return rgbToHex({
    r: a.r + (b.r - a.r) * amount,
    g: a.g + (b.g - a.g) * amount,
    b: a.b + (b.b - a.b) * amount,
  });
}

export const darken = (hex, amount = 0.2) => mix(hex, '#000000', amount);
export const lighten = (hex, amount = 0.2) => mix(hex, '#ffffff', amount);

/**
 * Nudge `color` toward black or white until it hits `minRatio` against `against`.
 * Preserves hue -- the partner's color still reads as their color, just legible.
 *
 * Returns the corrected hex plus whether (and how far) we had to move it, so the
 * build can warn instead of silently altering someone's brand.
 */
export function ensureContrast(color, against, minRatio = 4.5) {
  if (contrast(color, against) >= minRatio) {
    return { hex: color, adjusted: false, steps: 0, ratio: contrast(color, against) };
  }

  // Move away from the background: darken on light surfaces, lighten on dark.
  const towardBlack = luminance(against) > 0.5;

  let candidate = color;
  for (let step = 1; step <= 20; step++) {
    const amount = step * 0.05;
    candidate = towardBlack ? darken(color, amount) : lighten(color, amount);
    if (contrast(candidate, against) >= minRatio) {
      return { hex: candidate, adjusted: true, steps: step, ratio: contrast(candidate, against) };
    }
  }

  // Nothing in-hue worked (rare -- e.g. mid-grey on mid-grey). Fall back to
  // guaranteed-legible rather than emitting an unreadable asset.
  const fallback = towardBlack ? '#000000' : '#ffffff';
  return { hex: fallback, adjusted: true, steps: 20, ratio: contrast(fallback, against), fellBack: true };
}

/**
 * Resolve a partner's palette against the surface it will actually sit on.
 * Every template calls this instead of reading partner.colors directly.
 */
export function resolvePartnerPalette(partner, surface, fallbackPrimary, minRatio = 4.5) {
  const raw = partner?.colors?.primary || fallbackPrimary;
  const rawSecondary = partner?.colors?.secondary || darken(raw, 0.25);

  const primary = ensureContrast(raw, surface, minRatio);
  const secondary = ensureContrast(rawSecondary, surface, minRatio);

  return {
    // `raw` stays available for large blocks of solid fill, where the partner's
    // exact color matters more than text contrast.
    raw,
    rawSecondary,
    primary: primary.hex,
    secondary: secondary.hex,
    onRaw: onColor(raw),
    warnings: [
      primary.adjusted && {
        field: 'colors.primary', from: raw, to: primary.hex,
        reason: `contrast ${contrast(raw, surface).toFixed(2)}:1 against ${surface} is below ${minRatio}:1`,
      },
      secondary.adjusted && {
        field: 'colors.secondary', from: rawSecondary, to: secondary.hex,
        reason: `contrast ${contrast(rawSecondary, surface).toFixed(2)}:1 against ${surface} is below ${minRatio}:1`,
      },
    ].filter(Boolean),
  };
}
