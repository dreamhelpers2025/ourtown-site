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

Tokens: OurTown Gold `#f8a800` primary, Community Navy `#295f98` accent, cream
`#f7f2e8` surface, Inter + Poppins. The gold is sampled from the supplied
wordmark — the ourtown.store site build uses `#d99e23`, which is noticeably
duller than the real logo and should be brought to this value.

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

**Logo chips and tiles.** A wordmark on that partner's own brand color
disappears. Unless a `logoOnDark` variant is supplied, the mark is chipped onto
white and the build emits an asset request for the missing variant. Marks
delivered with a background already baked in use `logoStyle: "tile"` and get
rounded corners, so they read as a badge rather than an un-knocked-out
rectangle — which is how the Volcanoes JPEG is handled.

**Compact logo variants.** A horizontal lockup shrunk into a 300px sidebar
column becomes an illegible smudge. `logoCompact` lets a partner supply a
square or badge mark for tight surfaces; VYB's circular mark is used there and
their full lockup everywhere else.

**Disclosure as a first-class element.** See below.

## Disclosure

`disclosure` is a required field and the build refuses to run without it.

"Every purchase supports X" is a charitable sales promotion — a commercial
co-venture. It's regulated in roughly half of US states, Washington included,
and the requirements commonly include stating the actual per-unit amount or
percentage the nonprofit receives rather than a vague "supports," with some
states also requiring registration and a written agreement with the charity.

This tool does not attempt to be compliant on anyone's behalf. It guarantees
only that a disclosure is **present and legible on every asset** — held above
8pt on print, and appended to every copy channel so the claim and the
disclosure always travel together. The tightest surface is the 300×600 sidebar
banner, where it renders at 9px rather than being dropped; if a future format
genuinely cannot carry the disclosure, that format should not carry the claim
either.

**The `$18` figure and the exact wording are the partners' to confirm with
counsel before anything ships.**

## Rules that are enforced, not just documented

From `tokens.rules` — these bind in code rather than living in a PDF:

| Rule | Value |
|---|---|
| Business / cause name | ≤ 40 chars |
| Headline | ≤ 48 chars |
| QR minimum | 1.25 in — print templates compute this from canvas width |
| Disclosure minimum | 8 pt — likewise computed per size, not hardcoded |
| Body text contrast | ≥ 4.5:1 |
| OurTown mark | always present, footer |

## Current state

Thirteen formats.

| | Format | Size |
|---|---|---|
| **Social** | `ig-square` | 1080×1080 |
| | `ig-carousel` | 1080×1080 × 5 slides |
| | `story` | 1080×1920 |
| | `linkedin` | 1200×627 |
| | `x` | 1600×900 |
| **Web + email** | `web-hero` | 1600×600 |
| | `email-header` | 1200×400 |
| | `sidebar-banner` | 300×600 |
| **Print** | `poster` | 8.5×11 in |
| | `flyer` | 8.5×11 in |
| | `counter-card` | 5×7 in |
| | `table-tent` | 4×6 in |
| | `window-cling` | 12×18 in |

Print formats emit PDF and PNG; the rest emit PNG.

Moments: `launch`, `halfway`, `goal`. Channels: Facebook, Instagram, LinkedIn,
X, email, newsletter, press release.

One campaign currently produces **66 graphics and 21 copy assets**.

A few of these are deliberately not variations on a theme:

- **`ig-carousel`** builds an argument across five slides — hook, product,
  cause, where the money goes, call to action. Slide 4 states the split in
  plain numbers (`$35 → $18`), parsed from the disclosure itself. That is the
  one thing a single graphic never has room to say.
- **`flyer`** is not a second poster at the same trim. A poster is read across
  a room and carries one idea; a flyer is held, so it carries the mechanics —
  how it works, who the cause is, what the per-item amount is.
- **`window-cling`** renders its QR at ~3.4in, not the 1.25in floor. The
  minimum is a legality, not a target, and a counter-card-sized code on glass
  does not get scanned.

### Asset status

Real partner assets are in `campaigns/assets/volcanoes-vyb/`. Still worth
requesting — none of these block anything, they just raise the ceiling:

- **A vector or transparent Volcanoes mark.** The only usable file supplied is a
  512×287 JPEG of the badge on a solid blue field, so it renders via
  `logoStyle: "tile"`. That reads as an intentional badge, but the mark can't
  sit on a light surface without its blue block, and 512px is thin for large
  print. (`VV logo.png` in the handoff was not an image at all — it was a saved
  Columbian.com article page.)
- **A light-on-dark Volcanoes variant**, so the mark can drop the white chip.
- **A transparent-background hat photo.** The supplied shot is a 2790×3308 JPEG
  carrying its own background, so it renders as `style: "photo"` in a framed
  card sized to the photo's aspect ratio.
- **A transparent dark OurTown wordmark.** Both supplied PNGs are gold; the
  black version exists only as a JPEG, so the dark variant is derived with a
  `brightness(0)` filter.

### Not done yet

- Print is RGB, which is right for digital/office printing. Offset work needs a CMYK step.
- Webfonts load from Google Fonts at render time, so the first render needs network access.
- Schema is enforced by a hand-written validator in `src/lib/campaign.js`; the JSON Schema is the reference contract.

## Integration

The CLI is deliberately the same shape as the eventual "Push Your Campaign"
button: campaign record in, package out. Wiring it into ourtown.store means
calling the same pipeline with a campaign built from database rows instead of a
JSON file, and serving the zip (or the individual assets, via `manifest.json`)
rather than writing to disk.
