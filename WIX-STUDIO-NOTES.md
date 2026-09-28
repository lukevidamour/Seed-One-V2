# Seed One: rebuilding the site in Wix Studio

The preview has two builds of the same design:

- **Coded build**: https://lukevidamour.github.io/Seed-One-V2/
- **Wix Studio build**: https://lukevidamour.github.io/Seed-One-V2/wix/

Click the logo to switch between them on any page. A badge beside the logo shows which build is on screen. The Wix build is still code, but it only uses behaviour Wix Studio offers natively, so it shows what a manual Wix Studio rebuild would look and feel like. Layout, type, colour, imagery and copy are identical.

## What changes in the Wix build

| Coded build | Wix Studio build | Why |
|---|---|---|
| Inertial smooth scroll (Lenis), including keyboard | Native browser scrolling | Wix Studio has no smooth-scroll setting |
| Headline words rise one by one out of a mask | Each line reveals as one element | Entrance animations apply per element, not per word |
| Mission statement fills from grey to ink as you read | Static two-tone text | No scroll-scrubbed text colour |
| Method section pins and lights its five stages in sequence | Normal five-column grid, all stages lit | Sticky and pinned exist, but not scrubbed sequences |
| Dot glyphs assemble dot by dot | Glyphs fade in as one image | Per-dot animation needs code |
| Impact numbers count up | Numbers are static | No native count-up |
| Impact gradients drift slowly | Static gradients | Wix gradients cannot animate |
| Soft highlight follows the pointer on gradient tiles | Removed (hover lift stays) | Mouse effects move elements, not gradient highlights |
| Fine grain over the gradients | Removed | No blend-mode overlays |
| Glass with a faint rim refraction | Plain blur ("Apply glass effect") | Wix glass is blur only |
| "Biodefense" in gradient type inside the marquee | One text style throughout | The text marquee has one style |
| Hero film drifts and zooms slightly on scroll | Drifts only (parallax) | One background scroll effect per section |

## Section by section, in Wix Studio

| Section | Wix Studio build |
|---|---|
| Nav | Header set to **Pinned**, with the **Disappear** scroll effect (hides on the way down, returns on the way up). The white pill is a container with a radius. |
| Hero | Section with a **video background** (Banner 3 edit) and the **Parallax** background scroll effect. The kicker, both headline lines, the button and the paragraph use **Entrance** animations (Reveal and Float) with staggered delays, and the kicker comes last. The copy uses a **Fade** scroll animation set to Out. |
| Focus marquee | **Text marquee** element with a circle-plus separator icon, slow speed and no pause on hover. |
| Dashed grid | Vertical line elements on the section grid. |
| Mission | Rich text with two colours, and a **Fade** entrance. The dot glyph is an SVG image. |
| Cells band | Section with a **video background** (Adobe Stock 812350176) and a white gradient overlay. The dot-matrix mark is an SVG image with a Fade entrance. The logo strip is a **Pro Gallery slider** set to continuous autoplay. |
| Method | Five containers with **radial or fluid gradient** backgrounds, white line drawings as SVG images, and **Reveal** entrances staggered by about 0.08s. |
| Research-bench band | Image background with **Parallax**. The status bar is a container with **Apply glass effect** turned on. |
| Case studies | Native **Accordion** element. Each open panel holds a gradient container with the drawing and outcome. |
| Impact grid | Five containers with static gradients and **Float** entrances. Each tile lifts slightly on hover through a **Hover** interaction. |
| Team | Four columns. Each colour line uses a **Reveal** entrance from the left, and a hover interaction scales it to full width. |
| Finale | Section with the hero video at low opacity under a gradient overlay. "Let's" and "forge it." are two text elements with scroll animations that move them in from the left and right. |
| Enquiry drawer | A **Lightbox** that slides in from the right, holding a **Wix Form** with the same fields. |
| Footer | Standard section. The colour strip is five boxes. |
| Portfolio page | A **CMS** collection shown in a repeater, filtered by focus area with CMS filter elements. |
| Case study pages | A **CMS dynamic page**, one item per company. |

## Things to know before choosing Wix Studio

- **Custom CSS.** Wix Studio allows custom CSS on elements. That could bring back some coded touches, such as the grain or gradient text, but it moves away from a no-code build.
- **Velo.** Wix's code layer could add the count-up, the word reveals or the pinned method sequence. It's JavaScript inside Wix, so it needs a developer to maintain it.
- **Video and fonts.** The two videos would be uploaded to the Wix media manager, and Google Sans and Geist Mono added as custom fonts.
