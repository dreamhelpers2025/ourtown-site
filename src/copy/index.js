/**
 * Copy library.
 *
 * Every channel gets ready-to-post text generated from the same campaign
 * record that drives the graphics, so the words and the artwork can never
 * disagree about the price, the goal or the disclosure.
 *
 * The disclosure string is appended to every outbound channel for the same
 * reason it appears on every graphic: the promotional claim and the disclosure
 * need to travel together.
 */

import { progressFor } from '../lib/campaign.js';

const money = (s) => String(s).trim();

function ctx(campaign, moment) {
  const p = progressFor(campaign, moment);
  return {
    biz: campaign.business.name,
    cause: campaign.cause.name,
    causeShort: campaign.cause.shortName ?? campaign.cause.name,
    product: campaign.product.name,
    price: money(campaign.product.price),
    url: campaign.campaignUrl,
    goalStatement: campaign.goal.statement ?? `Support ${campaign.cause.name}.`,
    mission: campaign.cause.mission ?? '',
    headline: campaign.headline,
    disclosure: campaign.disclosure,
    p,
  };
}

const CHANNELS = {
  'facebook.txt': (c, m) => {
    const t = ctx(c, m);
    const lead = {
      launch: `It's here. The ${t.product} is live — and every one sold supports ${t.cause}.`,
      halfway: `We're halfway there. ${t.p.valueLabel} of ${t.p.targetLabel} ${t.p.unit}, and every single one supports ${t.cause}.`,
      goal: `We did it. ${t.p.targetLabel} ${t.p.unit} — and ${t.cause} feels every bit of it.`,
    }[m.id];
    const close = {
      launch: `Grab yours for ${t.price} and wear where you're from.`,
      halfway: `${t.p.remainingLabel} to go. Let's finish this.`,
      goal: `Thank you to everyone who showed up for this town.`,
    }[m.id];
    return `${lead}

${t.goalStatement}

${close}

${t.url}

${t.disclosure}

#ShopLocal #GiveLocal #OurTown`;
  },

  'instagram.txt': (c, m) => {
    const t = ctx(c, m);
    const lead = {
      launch: `${t.headline}\n\nThe ${t.product} is live. ${t.price}.`,
      halfway: `${t.p.percentLabel} there.\n\n${t.p.valueLabel} of ${t.p.targetLabel} ${t.p.unit}.`,
      goal: `Goal reached. ${t.p.targetLabel} ${t.p.unit}.`,
    }[m.id];
    return `${lead}

Every purchase supports ${t.cause}.
${t.goalStatement}

🔗 Link in bio — or scan the code in store.

${t.disclosure}

#ShopLocal #GiveLocal #OurTown #${t.biz.replace(/[^a-zA-Z0-9]/g, '')}`;
  },

  'linkedin.txt': (c, m) => {
    const t = ctx(c, m);
    const lead = {
      launch: `${t.biz} has partnered with ${t.cause} on something we think matters.`,
      halfway: `An update on our partnership with ${t.cause}: we're at ${t.p.percentLabel}.`,
      goal: `Our campaign with ${t.cause} hit its goal.`,
    }[m.id];
    return `${lead}

The ${t.product} (${t.price}) is available now, and every purchase supports ${t.cause}. ${t.mission}

${t.goalStatement}

This is what local commerce can look like when businesses and nonprofits build together instead of separately. Powered by OurTown.

${t.url}

${t.disclosure}`;
  },

  'x.txt': (c, m) => {
    const t = ctx(c, m);
    const lead = {
      launch: `The ${t.product} is live. ${t.price}. Every one sold supports ${t.causeShort}.`,
      halfway: `${t.p.percentLabel} to goal. ${t.p.valueLabel}/${t.p.targetLabel} ${t.p.unit} supporting ${t.causeShort}.`,
      goal: `Goal reached. ${t.p.targetLabel} ${t.p.unit} for ${t.causeShort}. Thank you.`,
    }[m.id];
    return `${lead}

${t.url}

${t.disclosure}`;
  },

  'email.txt': (c, m) => {
    const t = ctx(c, m);
    const subject = {
      launch: `${t.headline} — the ${t.product} is here`,
      halfway: `We're ${t.p.percentLabel} of the way there`,
      goal: `We hit the goal — thank you`,
    }[m.id];
    const lead = {
      launch: `The ${t.product} is available now for ${t.price}, and every purchase supports ${t.cause}.`,
      halfway: `Thanks to this community, we're at ${t.p.valueLabel} of ${t.p.targetLabel} ${t.p.unit} — ${t.p.percentLabel} of the way to our goal. ${t.p.remainingLabel} to go.`,
      goal: `${t.p.targetLabel} ${t.p.unit}. That's the whole goal, met, because people here decided to buy local.`,
    }[m.id];
    return `Subject: ${subject}
Preheader: Every purchase supports ${t.cause}.

---

${lead}

${t.mission}

${t.goalStatement}

[ ${m.cta} → ${t.url} ]

Powered by OurTown — Shop Local. Give Local.

${t.disclosure}`;
  },

  'newsletter.txt': (c, m) => {
    const t = ctx(c, m);
    return `## ${t.biz} × ${t.cause}

${t.headline}

The ${t.product} is ${m.id === 'goal' ? 'a wrap' : `available for ${t.price}`}. ${m.id === 'goal'
      ? `The campaign closed at ${t.p.targetLabel} ${t.p.unit}.`
      : `Every purchase supports ${t.cause}${m.id === 'halfway' ? `, and we're currently at ${t.p.valueLabel} of ${t.p.targetLabel} ${t.p.unit}` : ''}.`}

${t.mission}

**${m.cta}:** ${t.url}

_${t.disclosure}_`;
  },

  'press-release.txt': (c, m) => {
    const t = ctx(c, m);
    const headline = {
      launch: `${t.biz} Launches Community Campaign Benefiting ${t.cause}`,
      halfway: `${t.biz} Campaign for ${t.cause} Reaches ${t.p.percentLabel} of Goal`,
      goal: `${t.biz} and ${t.cause} Complete Community Campaign, Reaching ${t.p.targetLabel} ${t.p.unit}`,
    }[m.id];
    return `FOR IMMEDIATE RELEASE

${headline.toUpperCase()}

VANCOUVER, WASH. — ${t.biz} today ${m.id === 'launch' ? 'announced the launch of' : m.id === 'halfway' ? 'reported significant progress in' : 'announced the successful completion of'} a community campaign benefiting ${t.cause}, offered through the OurTown local commerce platform.

The campaign features the ${t.product}, available for ${t.price}. ${t.disclosure}

${t.mission ? `${t.cause} ${t.mission.charAt(0).toLowerCase()}${t.mission.slice(1)}\n` : ''}
${m.id === 'goal'
      ? `The campaign closed having reached ${t.p.targetLabel} ${t.p.unit}.`
      : `The campaign's goal is ${t.p.targetLabel} ${t.p.unit}${m.id === 'halfway' ? `, and it currently stands at ${t.p.valueLabel}` : ''}.`}

"${t.goalStatement}"
— [SPOKESPERSON NAME, TITLE, ${t.biz}]

[ADD QUOTE FROM ${t.cause.toUpperCase()} REPRESENTATIVE]

The campaign is available at ${t.url}.

ABOUT OURTOWN
OurTown is a local commerce platform connecting shoppers, businesses and causes under a single premise: Shop Local. Give Local.

MEDIA CONTACT
[NAME] · [EMAIL] · [PHONE]

###`;
  },
};

/** Generates every copy asset for one moment. */
export function generateCopy(campaign, moment) {
  return Object.entries(CHANNELS).map(([filename, fn]) => ({
    filename,
    content: fn(campaign, moment).trim() + '\n',
  }));
}

export const CHANNEL_NAMES = Object.keys(CHANNELS);
