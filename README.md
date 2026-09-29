# Seed One website, PX3 build

Static site, no build step for the browser: HTML, `styles.css`, `main.js`, `assets/`.
Local preview: the `seedone-px3` launch config serves a mirror at http://localhost:8081
(mirror with `rsync -a --delete "Site PX3/" /private/tmp/claude-501/seedone-px3/`).

## Pages
| File | What it is |
|---|---|
| `index.html` | Homepage |
| `portfolio.html` | All ten companies from the client copy, filterable by focus area |
| `case-studies/zeltiq.html`, `elusys.html`, `aerin.html` | Case studies, copy from the client document |
| `contact.html` | Contact page with the enquiry form (also the no-JavaScript fallback for the drawer) |
| `privacy.html`, `terms.html` | Placeholders until Seed One supplies the policies |

`tools/build_pages.py` generates every page except the homepage. It reads the nav, footer, drawer,
form, dot glyphs and line drawings from `index.html`, so edit those on the homepage and run:

    python3 tools/build_pages.py

## Shareable preview
`python3 tools/deploy_preview.py` copies the site into `../Deploy PX3` (its own git repository, published with GitHub Pages) and adds the "theshed" review gate to every page. The gate lives only in the preview; this folder stays gate-free for the developer.

## Homepage sections
A nav · B hero film · C focus marquee · D mission · E specimen band (with portfolio logo marquee) · F method (pinned sequence) · G research-bench band · H case studies · I impact · J team · K finale · L footer · M enquiry drawer

## Enquiry form: wire before launch
- Every "Partner with Seed One" and "Contact" link opens a drawer with the form. Without JavaScript they go to `contact.html`.
- Fields follow the client's contact copy: first name, last name, email, company or organization (all required) and message, plus "I am a founder or researcher / an investor / something else" so enquiries arrive sorted.
- Validation is inline and announced to screen readers. On success the form shows "Thank you, {first name}."
- **Set `data-endpoint` on `<form class="enq">`** (in `index.html`, then rebuild the pages) to the form service URL, for example Formspree or a Wix Velo function. It posts JSON. Until it is set, the form shows its success state without sending anything, so the flow can be reviewed.

## Motion
- Every entrance fires once. Only transform, opacity and clip-path animate, on one ease curve `cubic-bezier(.16,1,.3,1)`.
- Hero: the film settles from 1.08x and the headline words rise, then the button, paragraph and finally the "Med-tech venture builders since 1997" label (1.75s). On scroll the film drifts and the copy lifts and fades.
- Word masks are kept for the two editorial headlines. Section headings use a quieter fade, so motion falls away after the hero.
- Method: on screens 1024x700 and larger the section pins while the five stages light in turn and stay lit, with a progress rail. Smaller screens show a normal grid (5 across, 2 + 3 on tablets, stacked on phones).
- VI dot glyphs assemble dot by dot as they arrive.
- The mission statement fills from grey to ink as it is read.
- Smooth scroll: Lenis 1.1.20 (MIT, vendored in `assets/vendor`). Wheel, trackpad and keyboard (arrows, Page Up and Down, Space, Home, End) share the same easing. Touch stays native. The drawer pauses it.
- The focus marquee loops every 110s. The logo marquee loops every 60s and pauses on hover.
- `prefers-reduced-motion` turns all of it off, including smooth scroll, pinning and autoplay.
- The footer's "Pause videos" control stops all background videos and remembers the choice (WCAG 2.2.2).

## Design system
- Colour appears only as single-hue gradient fields: green, orange or purple, each with white and a deeper and paler tone of itself, never mixed. Only the impact grid's gradients drift, and only while it is on screen (registered CSS properties; older browsers show them static). Every other field is static, each with its own fixed arrangement.
- White line drawings, one per tile, all bleed in from the top right at the same scale.
- Glass is flat: a light tint and one hairline.
- Type: Google Sans (Google Fonts); Geist Mono for labels, self-hosted variable woff2 in `assets/fonts` (SIL OFL, included).
- Icons: Lucide (ISC licence), inlined at a 1.6 stroke.
- Logo: green leaf and charcoal wordmark everywhere, optically centred on the wordmark in the nav.

## Before launch
- Set the form endpoint (above).
- Remove `<meta name="robots" content="noindex, nofollow">` from every page (run the generator after editing it in `tools/build_pages.py` too).
- Make `og:image` an absolute URL once the domain is known (`assets/og-image.jpg`, 1200x630).
- Replace `privacy.html` and `terms.html` with the real policies.
- `#still` in a URL is a review-capture mode (no transitions, no smooth scroll). Harmless; can be removed.

## To confirm with the client
- "We forge them." uses a full stop. Jeff asked for three dots in round 1 (20 Sep 2026).
- The figures (12+, 10+, 1997, $100Ms), the case study facts and the portfolio summaries, which are condensed from the client copy.
- The research-bench band still says "Now reviewing technologies".

## Media
- Hero: Banner 6 (Premiere edit, 29 Sep 2026; the volvox and green-cell shots darkened for legibility), 1920x1080 with audio removed, plus a 1280 version for phones. The finale reuses it very faintly. White hero type clears WCAG contrast on every clip with the standard overlay (headline at least 3.5:1, small text at least 5:1).
- Specimen band: Adobe Stock 812350176 (dividing cells).
- Research-bench still: Unsplash (National Cancer Institute), free commercial licence. Credit in `assets/img/credits.json`.
- Portfolio logos were supplied by the client as raster screenshots. Request vector logos for production. Elusys has no logo, so it is set as a wordmark.
