/**
 * Resolves campaign assets to inline data URIs.
 *
 * Everything is embedded rather than linked so a render is deterministic and
 * works offline -- no half-loaded logo silently shipping in a poster because a
 * CDN was slow at render time.
 */

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import QRCode from 'qrcode';

const MIME = {
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.jfif': 'image/jpeg',
};

/**
 * Intrinsic pixel size from a PNG or JPEG header.
 *
 * Templates use this to give a photographic product card the photo's own aspect
 * ratio. Without it the card either letterboxes (contain) or crops the product
 * out of frame (cover) -- matching the ratio avoids both.
 * Returns null for formats we don't parse (e.g. SVG), and callers fall back.
 */
export function imageSize(buf) {
  if (buf.length > 24 && buf.slice(1, 4).toString('latin1') === 'PNG') {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length - 9) {
      if (buf[i] !== 0xff) { i++; continue; }
      const marker = buf[i + 1];
      const isSOF = marker >= 0xc0 && marker <= 0xcf &&
        marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
      if (isSOF) return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
      if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) { i += 2; continue; }
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }
  return null;
}

async function readAsset(ref, baseDir) {
  if (!ref || ref.startsWith('data:') || /^https?:\/\//.test(ref)) return null;
  try {
    return await readFile(path.resolve(baseDir, ref));
  } catch {
    return null;
  }
}

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
  const repoRoot = fileURLToPath(new URL('../../', import.meta.url));

  const [
    businessLogo, businessLogoOnDark, causeLogo, causeLogoOnDark, product,
    qrLight, qrDark, otWordmark,
  ] = await Promise.all([
    toDataUri(campaign.business.logo, baseDir),
    toDataUri(campaign.business.logoOnDark ?? campaign.business.logo, baseDir),
    toDataUri(campaign.cause.logo, baseDir),
    toDataUri(campaign.cause.logoOnDark ?? campaign.cause.logo, baseDir),
    toDataUri(campaign.product.image, baseDir),
    qrDataUri(campaign.campaignUrl, { dark: tokens.color.ink.DEFAULT, light: '#ffffff' }),
    qrDataUri(campaign.campaignUrl, { dark: '#ffffff', light: tokens.color.ink.DEFAULT }),
    toDataUri(tokens.brandAssets.wordmark, repoRoot),
  ]);

  const productBuf = await readAsset(campaign.product.image, baseDir);
  const size = productBuf && imageSize(productBuf);

  return {
    businessLogo, businessLogoOnDark, causeLogo, causeLogoOnDark, product,
    qrLight, qrDark, otWordmark,
    productAspect: size ? size.width / size.height : null,
  };
}
