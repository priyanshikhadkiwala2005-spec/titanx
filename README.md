# TitanX — Edge Cloud Landing Page

React + Vite + Three.js landing page concept with a loader, a 3D globe hero and a different scroll animation in every section. TitanX is a fictional brand made for design showcase use.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in /dist
npm run preview   # serve the build locally
```

Needs Node.js 18 or newer.

## Structure

```
src/
  main.jsx               entry
  App.jsx                loader, scroll engine, reveal system, cursor glow
  styles.css             all styles and design tokens (top of file)
  lib/utils.js           clamp, reduced-motion flag, useInView hook
  components/
    Loader.jsx           orbit-ring loader with counter
    Globe.jsx            Three.js globe: dots, arcs, pulses, orbit ring, stars
    Hero.jsx             split-word headline, live stats
    Nav.jsx              sticky blur nav + mobile menu
    Interactive.jsx      CountUp, Tilt (3D card), Magnetic (button)
    Icons.jsx            logo and icon set
    Sections.jsx         Marquee, Features, Pipeline, Stats, Regions,
                         Developers, Voices, CTA, Footer
```

## Customising

- **Colours and fonts:** edit the tokens in the `:root` block at the top of `src/styles.css` (`--blue`, `--cyan`, `--lime`, `--grad`, `--f-display`, …).
- **Content:** every section keeps its text in a constant at the top of its component (`FEATURES`, `STEPS`, `STATS`, `REGIONS`, `PLANS`, `QUOTES`).
- **Scroll reveals:** add `data-reveal="up|left|right|zoom|flip|blur|rise"` to any element. Add `style={{'--d':'.2s'}}` for a delay.
- **Scroll-driven sections:** add `data-progress` to a tall section; it receives a CSS variable `--p` from 0 to 1 as you scroll through it.
- **Loader duration:** `dur` in `src/components/Loader.jsx`.

All animation respects the visitor's "reduce motion" setting.
