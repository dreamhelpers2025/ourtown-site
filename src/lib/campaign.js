/** Loads, validates and expands a campaign record into renderable jobs. */

import { readFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * Campaign moments. Each one re-renders the same templates with a different
 * progress state and voice -- this is what turns a campaign into a posting
 * cadence instead of a single graphic that goes stale the day it ships.
 */
export const MOMENTS = {
  launch: {
    id: 'launch',
    eyebrow: 'Now Live',
    progress: 0,
    cta: 'Be the first to support',
    tone: 'Announce the partnership and the product.',
  },
  halfway: {
    id: 'halfway',
    eyebrow: 'Halfway There',
    progress: 0.5,
    cta: 'Help us finish strong',
    tone: 'Social proof plus urgency. The community is already behind this.',
  },
  goal: {
    id: 'goal',
    eyebrow: 'Goal Reached',
    progress: 1,
    cta: 'Thank you',
    tone: 'Celebration and gratitude. Name the impact, not the ask.',
  },
};

const DEFAULT_MOMENTS = ['launch', 'halfway', 'goal'];
const DEFAULT_FORMATS = ['ig-square', 'story', 'poster'];

function fail(errors) {
  const err = new Error(`Invalid campaign:\n  - ${errors.join('\n  - ')}`);
  err.validation = errors;
  throw err;
}

/**
 * Enforces the constraints in tokens.rules that would produce a broken asset if
 * violated. Deliberately strict about `disclosure`: an asset that says "every
 * purchase supports X" without stating what X actually receives is the exact
 * thing charitable-solicitation statutes care about, so the generator refuses
 * to emit one rather than leaving it to whoever fills in the JSON.
 */
export function validate(c, rules) {
  const errors = [];
  const req = (cond, msg) => { if (!cond) errors.push(msg); };

  req(typeof c.id === 'string' && /^[a-z0-9][a-z0-9-]*$/.test(c.id), 'id must be a lowercase slug');
  req(c.business?.name, 'business.name is required');
  req(c.business?.logo, 'business.logo is required');
  req(c.cause?.name, 'cause.name is required');
  req(c.cause?.logo, 'cause.logo is required');
  req(c.product?.name, 'product.name is required');
  req(c.product?.price, 'product.price is required');
  req(c.product?.image, 'product.image is required');
  req(c.campaignUrl, 'campaignUrl is required (it is what the QR encodes)');
  req(c.goal?.target > 0, 'goal.target must be greater than 0');

  req(
    typeof c.disclosure === 'string' && c.disclosure.trim().length > 0,
    'disclosure is required on every asset. State what the cause actually receives per purchase.'
  );

  if (c.business?.name?.length > rules.businessName.maxLength)
    errors.push(`business.name exceeds ${rules.businessName.maxLength} chars`);
  if (c.cause?.name?.length > rules.causeName.maxLength)
    errors.push(`cause.name exceeds ${rules.causeName.maxLength} chars`);
  if (c.headline && c.headline.length > rules.headline.maxLength)
    errors.push(`headline exceeds ${rules.headline.maxLength} chars (it will not auto-fit legibly)`);

  for (const m of c.moments ?? []) if (!MOMENTS[m]) errors.push(`unknown moment "${m}"`);

  if (errors.length) fail(errors);
  return c;
}

export async function loadCampaign(file, tokens) {
  const raw = JSON.parse(await readFile(file, 'utf8'));
  const campaign = validate(raw, tokens.rules);

  campaign.baseDir = path.dirname(path.resolve(file));
  campaign.headline ??= tokens.voice.headlines[0];
  campaign.moments = campaign.moments?.length ? campaign.moments : DEFAULT_MOMENTS;
  campaign.formats = campaign.formats?.length ? campaign.formats : DEFAULT_FORMATS;
  campaign.goal.current ??= 0;

  return campaign;
}

/** Cartesian product of formats x moments -- the render queue. */
export function expandJobs(campaign) {
  const jobs = [];
  for (const format of campaign.formats) {
    for (const momentId of campaign.moments) {
      jobs.push({ format, moment: MOMENTS[momentId], name: `${format}--${momentId}` });
    }
  }
  return jobs;
}

/** Progress figures for a given moment, in the campaign's own units. */
export function progressFor(campaign, moment) {
  const { type, target } = campaign.goal;
  const pct = moment.progress;
  const value = Math.round(target * pct);
  const format = (n) => (type === 'dollars' ? `$${n.toLocaleString('en-US')}` : n.toLocaleString('en-US'));
  return {
    pct,
    percentLabel: `${Math.round(pct * 100)}%`,
    valueLabel: format(value),
    targetLabel: format(target),
    unit: type === 'dollars' ? 'raised' : 'sold',
    remainingLabel: format(Math.max(0, target - value)),
  };
}
