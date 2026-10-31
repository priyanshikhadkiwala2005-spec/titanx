# TitanX — Rule the Digital Era

React + Vite landing page for TitanX, a 100% decentralised token with staking and a referral programme. Loader, hero video and a different scroll animation in every section.

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
    Sections.jsx         Marquee (key features), Features (overview & vision),
                         Stats (token details), Pipeline (joining steps),
                         AccountRules, Developers (price rate), Regions
                         (five income types), Staking, DirectIncome,
                         RankIncome, UnityIncome, Voices (single-leg income),
                         CTA (thank you), Footer
```

## Customising

- **Colours and fonts:** edit the tokens in the `:root` block at the top of `src/styles.css` (`--blue`, `--cyan`, `--lime`, `--grad`, `--f-display`, …).
- **Content:** every section keeps its text in a constant at the top of its component (`OVERVIEW`, `STATS`, `TOKEN_ROWS`, `STEPS`, `RULES`, `PRICE_POINTS`, `INCOMES`, `LEVELS`, `RANK_NAMES`, `LEG`).
- **Scroll reveals:** add `data-reveal="up|left|right|zoom|flip|blur|rise"` to any element. Add `style={{'--d':'.2s'}}` for a delay.
- **Scroll-driven sections:** add `data-progress` to a tall section; it receives a CSS variable `--p` from 0 to 1 as you scroll through it.
- **Loader duration:** `dur` in `src/components/Loader.jsx`.

All animation respects the visitor's "reduce motion" setting.
