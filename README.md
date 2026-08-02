# OurTown Campaign Kit

Turns one campaign record into a complete co-branded marketing package: graphics
for every format and campaign moment, ready-to-post copy for every channel, a
machine-readable manifest, and a zip.

```bash
npm install
node src/cli.js campaigns/volcanoes-vyb.json
```

Output lands in `out/<campaign-id>/` and `out/<campaign-id>.zip`.

## Why this is code and not a folder of design comps

The obvious version of this project is twenty hand-built templates in Canva or
Figma that a developer later "swaps variables into." That handoff doesn't
really exist — someone rebuilds the layouts from scratch in code and the comps
become stale documentation the same week.

So the templates *are* the code. The polished graphics are output, not source.
Adding a format later means adding one module; the contrast handling, QR
generation, disclosure placement, copy library and packaging all come along for
free.

## How it works

```
campaign.json ──> validate ──> resolve colors ──> embed assets
                                                       │
                        ┌──────────────────────────────┤
                        v                              v
              templates (HTML/CSS)              copy library
                        │                              │
                   Playwright                          │
                   PNG / PDF                        .txt
                        └───────────┬──────────────────┘
                                    v
                        manifest.json + campaign.zip
```

| Piece | Where |
|---|---|
| Design tokens | [tokens/brand.json](tokens/brand.json) |
| Campaign contract | [src/schema/campaign.schema.json](src/schema/campaign.schema.json) |
| Contrast engine | [src/lib/color.js](src/lib/color.js) |
| Templates | [src/templates/](src/templates/) |
| Copy library | [src/copy/index.js](src/copy/index.js) |
| Renderer | [src/render.js](src/render.js) |
| CLI | [src/cli.js](src/cli.js) |

### Brand hierarchy

Three logos, three different jobs — never three equal marks:

- **Hero** — the business. Dominant mark, their brand color drives the composition.
- **Beneficiary** — the cause. Secondary mark, accent color only.
- **Powered by** — OurTown. Always resolves the pairing in the footer.

Tokens carry over from the ourtown.store site build so campaign assets and the
website can't drift: Town Gold `#d99e23` primary, Community Navy `#295f98`
accent, cream `#f7f2e8` surface, Inter + Poppins.

### Campaign moments

Every format renders at `launch`, `halfway` and `goal`. That's what makes a
campaign a posting cadence instead of one graphic that goes stale on day one.
Progress figures, calls to action and copy all shift per moment.

## The three things that make automation survive real partners

**Contrast correction.** "Business colors dominate, cause colors accent" works
beautifully for one partner and breaks on the fourth. Partner colors are
resolved against the surface they'll actually sit on and nudged in-hue until
they clear WCAG. Vancouver Youth Basketball's orange is a live example — it
comes in at 2.68:1 on cream and gets corrected, with the change reported rather
than applied silently.

**Logo chips.** A red wordmark on that partner's own red band disappears. Unless
a `logoOnDark` variant is supplied, the mark is chipped onto white, and the
build emits an asset request for the missing variant.

**Disclosure as a first-class element.** See below.

## Disclosure

`disclosure` is a required field and the build refuses to run without it.

"Every purchase supports X" is a charitable sales promotion — a commercial
co-venture. It's regulated in roughly half of US states, Washington included,
and the requirements commonly include stating the actual per-unit amount or
percentage the nonprofit receives rather than a vague "supports," with some
states also requiring registration and a written agreement with the charity.

This tool does not attempt to be compliant on anyone's behalf. It guarantees
only that a disclosure is **present and legible on every asset** — on the poster
it's held above 8pt, and it's appended to every copy channel so the claim and
the disclosure always travel together. **The wording in
`campaigns/volcanoes-vyb.json` is placeholder text and needs review by the
partners' counsel before anything ships.**

## Rules that are enforced, not just documented

From `tokens.rules` — these bind in code rather than living in a PDF:

| Rule | Value |
|---|---|
| Business / cause name | ≤ 40 chars |
| Headline | ≤ 48 chars |
| QR minimum | 1.25 in (poster renders 1.275 in) |
| Disclosure minimum | 8 pt at letter size (poster renders 8.26 pt) |
| Body text contrast | ≥ 4.5:1 |
| OurTown mark | always present, footer |

## Current state

Formats: `ig-square` (1080×1080), `story` (1080×1920), `poster` (8.5×11in,
PDF + PNG). Moments: `launch`, `halfway`, `goal`. Channels: Facebook,
Instagram, LinkedIn, X, email, newsletter, press release.

One campaign currently produces **12 graphics and 21 copy assets**.

### Placeholders

Everything in `campaigns/assets/placeholder/` is a stand-in and is visibly
marked as such. Swap in real assets by editing the paths in the campaign JSON —
no code changes needed. What to request:

- Vector logos (SVG preferred) for both partners, plus light-on-dark variants
- Product photography, transparent PNG, 1500px+ on the long edge
- Confirmed disclosure wording

### Not done yet

- Remaining formats: LinkedIn, X, counter card, table tent, flyer, email header, web hero
- Print is RGB, which is right for digital/office printing. Offset work needs a CMYK step.
- Webfonts load from Google Fonts at render time, so the first render needs network access.
- Schema is enforced by a hand-written validator in `src/lib/campaign.js`; the JSON Schema is the reference contract.

## Integration

The CLI is deliberately the same shape as the eventual "Push Your Campaign"
button: campaign record in, package out. Wiring it into ourtown.store means
calling the same pipeline with a campaign built from database rows instead of a
JSON file, and serving the zip (or the individual assets, via `manifest.json`)
rather than writing to disk.
