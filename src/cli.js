#!/usr/bin/env node
/**
 * campaign-kit <campaign.json> [--out dir] [--no-zip]
 *
 * Takes one campaign record and produces the complete co-branded marketing
 * package: graphics for every format x moment, copy for every channel, a
 * machine-readable manifest, and a zip.
 *
 * This is the shape the "Push Your Campaign" button would call.
 */

import { mkdir, writeFile, rm } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import path from 'node:path';
import archiver from 'archiver';

import { loadTokens } from './lib/tokens.js';
import { loadCampaign, expandJobs, progressFor, MOMENTS } from './lib/campaign.js';
import { resolveAssets } from './lib/assets.js';
import { resolvePartnerPalette } from './lib/color.js';
import { getTemplate } from './templates/index.js';
import { createRenderer } from './render.js';
import { generateCopy } from './copy/index.js';

const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
};

function parseArgs(argv) {
  const args = { file: null, out: 'out', zip: true };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--out') args.out = argv[++i];
    else if (a === '--no-zip') args.zip = false;
    else if (!a.startsWith('-')) args.file ??= a;
  }
  return args;
}

async function zipDir(dir, zipPath) {
  await new Promise((resolve, reject) => {
    const output = createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    output.on('close', resolve);
    archive.on('error', reject);
    archive.pipe(output);
    archive.directory(dir, false);
    archive.finalize();
  });
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.file) {
    console.error('usage: campaign-kit <campaign.json> [--out dir] [--no-zip]');
    process.exit(1);
  }

  const tokens = await loadTokens();
  const campaign = await loadCampaign(args.file, tokens);

  // Partner colors are resolved against the surface they will actually sit on,
  // and any correction is surfaced rather than applied silently.
  const business = resolvePartnerPalette(
    campaign.business, tokens.role.surface, tokens.role.brand, tokens.rules.contrast.minRatioBodyText
  );
  const cause = resolvePartnerPalette(
    campaign.cause, tokens.role.surface, tokens.role.accent, tokens.rules.contrast.minRatioBodyText
  );

  const warnings = [
    ...business.warnings.map((w) => ({ ...w, partner: 'business' })),
    ...cause.warnings.map((w) => ({ ...w, partner: 'cause' })),
  ];

  // Things the render worked around but that a better source asset would fix.
  // Surfaced so they become a request to the partner, not a permanent kludge.
  const assetNotes = [];
  if (!campaign.business.logoOnDark) {
    assetNotes.push({
      partner: 'business',
      field: 'logoOnDark',
      applied: 'white chip behind the mark on colored bands',
      request: `Ask ${campaign.business.name} for a light-on-dark logo variant to place the mark directly on their brand color.`,
    });
  }

  console.log(`\n${c.bold(`OurTown Campaign Kit`)} ${c.dim('v1')}`);
  console.log(`${c.dim('campaign')}  ${campaign.business.name} × ${campaign.cause.name}`);
  console.log(`${c.dim('product')}   ${campaign.product.name} (${campaign.product.price})\n`);

  for (const w of warnings) {
    console.log(c.yellow(`  ! ${w.partner}.${w.field}: ${w.from} → ${w.to}`));
    console.log(c.dim(`    ${w.reason}`));
  }
  for (const n of assetNotes) {
    console.log(c.yellow(`  ! ${n.partner}.${n.field} not supplied`));
    console.log(c.dim(`    ${n.applied} — ${n.request}`));
  }
  if (warnings.length || assetNotes.length) console.log('');

  const assets = await resolveAssets(campaign, tokens);

  const root = path.resolve(args.out, campaign.id);
  await rm(root, { recursive: true, force: true });
  await mkdir(root, { recursive: true });

  const renderer = await createRenderer();
  const manifest = {
    campaignId: campaign.id,
    business: campaign.business.name,
    cause: campaign.cause.name,
    product: campaign.product.name,
    price: campaign.product.price,
    campaignUrl: campaign.campaignUrl,
    disclosure: campaign.disclosure,
    tokensVersion: '1.0.0',
    colorAdjustments: warnings,
    assetNotes,
    assets: [],
  };

  try {
    for (const job of expandJobs(campaign)) {
      const template = getTemplate(job.format);
      const progress = progressFor(campaign, job.moment);
      const outDir = path.join(root, 'graphics', job.moment.id);

      // A format may emit several images -- a carousel is one format, N slides.
      const slides = template.spec.slides ?? 1;

      for (let slide = 0; slide < slides; slide++) {
        const html = template.render({ campaign, tokens, moment: job.moment, progress, assets, business, cause, slide });
        const basename = slides > 1 ? `${job.format}-${String(slide + 1).padStart(2, '0')}` : job.format;

        const written = await renderer.render({ html, spec: template.spec, outDir, basename });

        for (const { file, bytes } of written) {
          const rel = path.relative(root, file).replace(/\\/g, '/');
          manifest.assets.push({
            path: rel,
            format: job.format,
            moment: job.moment.id,
            type: path.extname(file).slice(1),
            width: template.spec.width,
            height: template.spec.height,
            unit: template.spec.unit,
            ...(slides > 1 ? { slide: slide + 1, slides } : {}),
            bytes,
          });
          console.log(`  ${c.green('✓')} ${rel} ${c.dim(`${(bytes / 1024).toFixed(0)}kb`)}`);
        }
      }
    }
  } finally {
    await renderer.close();
  }

  // Copy assets, per moment.
  for (const momentId of campaign.moments) {
    const moment = MOMENTS[momentId];
    const dir = path.join(root, 'copy', momentId);
    await mkdir(dir, { recursive: true });
    for (const { filename, content } of generateCopy(campaign, moment)) {
      const file = path.join(dir, filename);
      await writeFile(file, content, 'utf8');
      const rel = path.relative(root, file).replace(/\\/g, '/');
      manifest.assets.push({ path: rel, moment: momentId, type: 'copy', channel: filename.replace('.txt', '') });
      console.log(`  ${c.green('✓')} ${rel}`);
    }
  }

  await writeFile(path.join(root, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`  ${c.green('✓')} manifest.json`);

  if (args.zip) {
    const zipPath = path.resolve(args.out, `${campaign.id}.zip`);
    await zipDir(root, zipPath);
    console.log(`\n${c.bold('package')}  ${path.relative(process.cwd(), zipPath)}`);
  }

  const graphics = manifest.assets.filter((a) => a.type === 'png' || a.type === 'pdf').length;
  const copy = manifest.assets.filter((a) => a.type === 'copy').length;
  console.log(`${c.dim('totals')}   ${graphics} graphics · ${copy} copy assets\n`);
}

main().catch((err) => {
  console.error(`\n${c.red('✗')} ${err.message}\n`);
  process.exit(1);
});
