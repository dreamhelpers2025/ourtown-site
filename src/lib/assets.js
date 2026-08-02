/**
 * Resolves campaign assets to inline data URIs.
 *
 * Everything is embedded rather than linked so a render is deterministic and
 * works offline -- no half-loaded logo silently shipping in a poster because a
 * CDN was slow at render time.
 */

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import QRCode from 'qrcode';

const MIME = {
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
};

export async function toDataUri(ref, baseDir) {
  if (!ref) return null;
  if (ref.startsWith('data:')) return ref;

  if (/^https?:\/\//.test(ref)) {
    const res = await fetch(ref);
    if (!res.ok) throw new Error(`Failed to fetch asset ${ref}: ${res.status}`);
    const type = res.headers.get('content-type') ?? 'application/octet-stream';
    const buf = Buffer.from(await res.arrayBuffer());
    return `data:${type};base64,${buf.toString('base64')}`;
  }

  const abs = path.resolve(baseDir, ref);
  const ext = path.extname(abs).toLowerCase();
  const mime = MIME[ext];
  if (!mime) throw new Error(`Unsupported asset type "${ext}" for ${ref}`);
  const buf = await readFile(abs);
  return `data:${mime};base64,${buf.toString('base64')}`;
}

/**
 * QR as an SVG data URI so it stays crisp at poster scale.
 * Error correction is bumped to 'M' -- these get printed on counter cards and
 * photographed under bad lighting, so a little redundancy is worth the density.
 */
export async function qrDataUri(url, { dark = '#2f2f2f', light = '#ffffff' } = {}) {
  const svg = await QRCode.toString(url, {
    type: 'svg',
    errorCorrectionLevel: 'M',
    margin: 2,
    color: { dark, light },
  });
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/** Pre-resolves every asset a template might need, once per campaign. */
export async function resolveAssets(campaign, tokens) {
  const { baseDir } = campaign;
  const [businessLogo, businessLogoOnDark, causeLogo, causeLogoOnDark, product, qrLight, qrDark] =
    await Promise.all([
      toDataUri(campaign.business.logo, baseDir),
      toDataUri(campaign.business.logoOnDark ?? campaign.business.logo, baseDir),
      toDataUri(campaign.cause.logo, baseDir),
      toDataUri(campaign.cause.logoOnDark ?? campaign.cause.logo, baseDir),
      toDataUri(campaign.product.image, baseDir),
      qrDataUri(campaign.campaignUrl, { dark: tokens.color.ink.DEFAULT, light: '#ffffff' }),
      qrDataUri(campaign.campaignUrl, { dark: '#ffffff', light: tokens.color.ink.DEFAULT }),
    ]);

  return { businessLogo, businessLogoOnDark, causeLogo, causeLogoOnDark, product, qrLight, qrDark };
}
