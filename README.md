# Hitesh Kumar — Portfolio

Personal portfolio site for Hitesh Kumar, Senior Software Engineer. Live at **https://rewrihitesh.github.io/Hitesh-Kumar-Portfolio/**.

## 2026 redesign

A light "Makro-style" layout: a large hero with a 3D portrait and floating metric cards, a bento-grid About section, and a two-column career timeline with company logos.

- **Static, no build step.** Open `index.html` in a browser or serve the repo root (for example `python -m http.server`).
- **Sections:** Hero, About bento, Career timeline, Projects, Stack, Education, Contact.

### Design: "Glass Premium"

- **Glassmorphism:** frosted panels over slowly drifting gradient blobs, with gradient rims, a faint grain, and a pointer-following light and tilt on desktop.
- **Career line:** the timeline line fills as you scroll.
- **Mobile kit (≤900px):**
  - A floating bottom dock that highlights the current section.
  - A contact bottom sheet: Email, Call, WhatsApp, LinkedIn, GitHub, Résumé, Save contact (vCard) and Share.
  - A touch glow, and a gyroscope tilt light. iOS asks for permission through a "Tilt your phone" chip.
  - Tapping a role card opens a full detail card with a View Transitions morph. This is mobile only; desktop keeps the accordion.
- **Accessibility and fallbacks:** respects `prefers-reduced-motion`. Browsers without `backdrop-filter` get opaque panels.

### Where to edit

- All CSS and JS live inside `index.html` (one inline `<style>` and `<script>`). There are no external stylesheets, scripts or font requests.
- Each section is marked with a `<!-- ============ NAME ============ -->` comment, e.g. `<!-- ============ CAREER TIMELINE ============ -->`. Search for these to jump to a section.
- Assets:
  - `assets/img/`: hero portrait (`hk-hero-portrait-3d@640` / `@1024`, AVIF with WebP fallback).
  - `assets/logos/`: company and university logos.
  - `assets/fonts/`: self-hosted, subset **Inter Display** (400/500/600/700 `.woff2`), loaded with `@font-face` at the top of the inline `<style>`. Inter is licensed under the SIL Open Font License; see `assets/fonts/LICENSE.txt`.
  - `favicon.ico` and `assets/icons/` (`favicon-32.png`, `icon-192.png`, `apple-touch-icon.png`): favicon and app icons, generated from the avatar.
  - `raw/Hitesh_Kumar_Oracle.pdf`: the résumé linked from the site.

### "Swap" hover on CTA buttons

Buttons with the `.swap` class (e.g. "Download résumé", "View full résumé", "Say hello") use a swap hover. On hover or keyboard focus, the icon chip slides to the opposite end, a colour fill expands from the chip to cover the button, and the label mirrors to the other side. On leave or blur the animation reverses.

- **CSS:** the `.swap` rules drive it. `.is-on` sets the transforms and the `clip-path` of the `::before` fill, and each button variant sets its colours through `--swap-fill`.
- **JS:** a small `measureSwap` function in the inline script measures the chip and label positions and sets the travel distances as CSS custom properties. A `ResizeObserver` keeps these values correct when the button resizes. Pointer and focus listeners toggle `.is-on` (touch is ignored).

### Logo sources

- **Microsoft:** a custom 4-square mark (`logo-microsoft.svg`).
- **Oracle, Qualcomm, TCS:** SVG paths from [Simple Icons](https://simpleicons.org/) (CC0).
- **Schoollog:** mark from [schoollog.in](https://schoollog.in/).
- **IIIT Hyderabad:** banyan-tree mark from [iiit.ac.in](https://www.iiit.ac.in/).

Company and university logos are trademarks of their respective owners and are used here only to identify past employers and education.

## Deployment

`.github/workflows/static.yml` deploys the repository root to GitHub Pages on every push to `main`. It can also be run manually with `workflow_dispatch`.

## License

GPL-3.0. See [LICENSE](LICENSE).
