import { useEffect, useRef, useState } from 'react';
import { Arrow, Check, Icon } from './Icons';
import { CountUp, Magnetic, Tilt } from './Interactive';
import { REDUCE, clamp, useInView } from '../lib/utils';

/* ---------- logo marquee ---------- */
export function Marquee() {
  const a = ['Northwind Labs', 'Kestrel Pay', 'Quanta Health', 'Lumio', 'Brightfold', 'Vantage Rail', 'Halcyon Studio', 'Meridian Games'];
  const b = ['Paperplane', 'Solace Bank', 'Atlas Freight', 'Nimbus Learn', 'Copperleaf', 'Driftwood Media', 'Pulsefit', 'Lattice AI'];
  const row = (arr, rev) => (
    <div className={'mq-row' + (rev ? ' rev' : '')}>
      {[...arr, ...arr].map((n, k) => <span key={k}>{n}</span>)}
    </div>
  );
  return (
    <section className="marquee" aria-label="Teams on TitanX">
      <div className="mq-label">Trusted by 40,000+ engineering teams</div>
      {row(a)}
      {row(b, true)}
    </section>
  );
}

/* ---------- features ---------- */
const FEATURES = [
  ['fn', 'Edge Functions', 'Write TypeScript, Go or Rust. Cold starts under 5 ms because isolates boot instead of containers.', '< 5 ms cold start'],
  ['kv', 'Global KV', 'A key-value store replicated to every city. Reads are local, writes reach the world in under a second.', '~800 ms global sync'],
  ['roll', 'Instant Rollbacks', 'Every deploy is immutable. Roll back to any version with one click and no rebuild.', '1-click, 0 rebuilds'],
  ['shield', 'Zero-trust Network', 'mTLS between every hop, DDoS absorption at the edge, and a WAF you configure in code.', '120 Tbps capacity'],
  ['img', 'Image Pipeline', 'Resize, crop and convert to AVIF on the fly, cached next to the person viewing it.', '-63% avg bytes'],
  ['eye', 'Live Observability', 'Traces, logs and per-city latency maps that stream in real time from every request.', '1 s log delay'],
];

export function Features() {
  return (
    <section className="sec" id="platform">
      <div className="wrap">
        <div className="sec-head" data-reveal="blur">
          <span className="eyebrow">Platform</span>
          <h2>Everything your app needs, already at the edge</h2>
          <p>Compute, storage and security run in the same 310 cities, so nothing has to cross an ocean to answer a request.</p>
        </div>
        <div className="feat-grid">
          {FEATURES.map((x, k) => (
            <div key={k} data-reveal={k % 2 ? 'up' : 'flip'} style={{ '--d': (k % 3) * 0.12 + 's' }}>
              <Tilt>
                <div className="ficon"><Icon k={x[0]} /></div>
                <h3>{x[1]}</h3>
                <p>{x[2]}</p>
                <div className="meta">{x[3]}</div>
              </Tilt>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- pipeline (sticky, scroll-driven) ---------- */
const STEPS = [
  ['git push', 'Connect a repository. Every push to a branch starts a deploy.', '01', 'Push'],
  ['Build in 9 seconds', 'A remote cache reuses unchanged layers, so most builds finish before your coffee cools.', '9s', 'Build'],
  ['Replicate to 310 cities', 'The build is signed and copied to every edge location over our private backbone.', '310', 'Replicate'],
  ['Serve in 18 ms', 'Traffic shifts to the new version city by city, with automatic rollback on errors.', '18ms', 'Serve'],
];

export function Pipeline() {
  const [mobStep, setMobStep] = useState(0);
  useEffect(() => {
    if (REDUCE) return;
    const id = setInterval(() => {
      setMobStep((s) => (s + 1) % STEPS.length);
    }, 3800);
    return () => clearInterval(id);
  }, []);

  const ticks = [];
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2;
    const major = i % 15 === 0;
    ticks.push(
      <line key={i} x1={100 + Math.cos(a) * 99} y1={100 + Math.sin(a) * 99} x2={100 + Math.cos(a) * (major ? 92 : 96)} y2={100 + Math.sin(a) * (major ? 92 : 96)} strokeWidth={major ? 1.5 : 0.6} />
    );
  }
  return (
    <section className="pipe" id="pipeline" data-progress data-steps="4">
      <div className="pipe-stick">
        <div className="wrap">
          <div className="sec-head pipe-head">
            <span className="eyebrow">How it works</span>
            <h2>From commit to every continent in under a minute</h2>
          </div>
          <div className="ring">
            <svg viewBox="0 0 200 200" fill="none">
              <defs>
                <linearGradient id="rg" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#1f7bff" />
                  <stop offset=".5" stopColor="#27d6f5" />
                  <stop offset="1" stopColor="#9af03c" />
                </linearGradient>
              </defs>
              <g className="ticks">{ticks}</g>
              <circle className="track" cx="100" cy="100" r="90" strokeWidth="1" />
              <circle className="prog" cx="100" cy="100" r="90" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <div className="ring-center">
              {STEPS.map((s, k) => (
                <div key={k}><span className="big grad-text">{s[2]}</span><span className="cap">{s[3]}</span></div>
              ))}
            </div>
          </div>
          <div className="steps">
            {STEPS.map((s, k) => (
              <div className="step" key={k}>
                <span className="n">0{k + 1}</span>
                <div><h3>{s[0]}</h3><p>{s[1]}</p></div>
              </div>
            ))}
          </div>

          {/* Mobile Dedicated Interactive Stepper */}
          <div className="mob-pipe-view">
            <div className="mob-pipe-nav">
              {STEPS.map((s, k) => (
                <button
                  key={k}
                  className={'mob-pipe-tab' + (mobStep === k ? ' active' : '')}
                  onClick={() => setMobStep(k)}
                >
                  <span className="mob-tab-num">0{k + 1}</span>
                  <span className="mob-tab-lbl">{s[3]}</span>
                </button>
              ))}
            </div>
            <div className="mob-pipe-card">
              <div className="mob-pipe-card-top">
                <span className="mob-pipe-badge">STAGE 0{mobStep + 1} OF 04</span>
                <span className="mob-pipe-val grad-text">{STEPS[mobStep][2]}</span>
              </div>
              <h3>{STEPS[mobStep][0]}</h3>
              <p>{STEPS[mobStep][1]}</p>
              <div className="mob-pipe-prog">
                <i style={{ width: `${((mobStep + 1) / STEPS.length) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- stats ---------- */
const STATS = [
  [310, 0, '', 'Edge cities in 120 countries', 0.92],
  [18, 0, 'ms', 'Median global response time', 0.82],
  [99.995, 3, '%', 'Uptime over the last 12 months', 0.99],
  [120, 0, 'Tbps', 'Network capacity for traffic spikes', 0.75],
];

export function Stats() {
  return (
    <section className="sec" id="network">
      <div className="wrap">
        <div className="sec-head" data-reveal="left">
          <span className="eyebrow">Network</span>
          <h2>A backbone built for the speed of light</h2>
          <p>We run our own fibre between regions, so your traffic never waits in a public internet queue.</p>
        </div>
        <div className="stats" data-reveal="zoom">
          {STATS.map((x, k) => (
            <div className="stat in" key={k} style={{ '--w': x[4] }}>
              <div className="v"><CountUp to={x[0]} dec={x[1]} suffix={x[2]} /></div>
              <div className="l">{x[3]}</div>
              <div className="bar"><i /></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- regions (horizontal scroll) ---------- */
const REGIONS = [
  ['BOM', 'Mumbai', 'India', 9, 41], ['FRA', 'Frankfurt', 'Germany', 11, 58], ['GRU', 'São Paulo', 'Brazil', 14, 33],
  ['NRT', 'Tokyo', 'Japan', 8, 62], ['IAD', 'Ashburn', 'United States', 7, 74], ['SYD', 'Sydney', 'Australia', 12, 29],
  ['JNB', 'Johannesburg', 'South Africa', 15, 22], ['SIN', 'Singapore', 'Singapore', 6, 47], ['DXB', 'Dubai', 'UAE', 10, 26],
];
function spark(seed) {
  const p = [];
  let v = 20;
  for (let i = 0; i < 24; i++) {
    v = clamp(v + Math.sin(seed * 9 + i * 1.7) * 6 + Math.cos(i * seed) * 3, 6, 38);
    p.push(`${i * (300 / 23)},${44 - v}`);
  }
  return p.join(' ');
}

export function Regions() {
  const ref = useRef(null);
  const trackRef = useRef(null);
  useEffect(() => {
    const sec = ref.current;
    const tr = trackRef.current;
    if (!sec || !tr) return;
    const size = () => {
      if (window.innerWidth < 860) {
        sec.style.height = 'auto';
        sec.style.setProperty('--shift', '0');
        return;
      }
      const shift = Math.max(0, tr.scrollWidth - window.innerWidth);
      sec.style.setProperty('--shift', shift);
      sec.style.height = window.innerHeight + shift + 'px';
    };
    size();
    window.addEventListener('resize', size);
    const t = setTimeout(size, 600);
    return () => {
      window.removeEventListener('resize', size);
      clearTimeout(t);
    };
  }, []);
  return (
    <section className="hz" ref={ref} data-progress aria-label="Regions">
      <div className="hz-stick">
        <div className="wrap">
          <div className="sec-head" style={{ marginBottom: 0 }}>
            <span className="eyebrow">Regions</span>
            <h2>Close to everyone, everywhere</h2>
          </div>
        </div>
        <div className="hz-track" ref={trackRef}>
          {REGIONS.map((x, k) => (
            <article className="region" key={k}>
              <span className="code">{x[0]} · {x[2]}</span>
              <h3>{x[1]}</h3>
              <svg className="spark" viewBox="0 0 300 44" preserveAspectRatio="none">
                <defs>
                  <linearGradient id={'sp' + k} x1="0" x2="1">
                    <stop offset="0" stopColor="#1f7bff" />
                    <stop offset=".5" stopColor="#27d6f5" />
                    <stop offset="1" stopColor="#9af03c" />
                  </linearGradient>
                </defs>
                <polyline points={spark(k + 1)} fill="none" stroke={`url(#sp${k})`} strokeWidth="2" />
              </svg>
              <div className="row"><span>p50 latency</span><b>{x[3]} ms</b></div>
              <div className="row"><span>Edge nodes</span><b>{x[4]}</b></div>
            </article>
          ))}
        </div>
        <div className="mob-swipe-hint">
          <span>👈 Swipe edge hubs</span>
          <span className="dot" />
          <span>9 Global Cities 👉</span>
        </div>
        <div className="wrap">
          <div className="hz-progress"><span>BOM</span><i /><span>DXB</span></div>
        </div>
      </div>
    </section>
  );
}

/* ---------- developers + typing terminal ---------- */
const TERM = [
  [['c', '# install the CLI and ship']],
  [['g', '$ '], ['', 'npm i -g titanx']],
  [['g', '$ '], ['', 'titanx deploy']],
  [['b', '▸ '], ['', 'Detected Next.js 15 project']],
  [['b', '▸ '], ['', 'Build cache hit 87%  '], ['y', '8.6s']],
  [['b', '▸ '], ['', 'Uploading 214 assets  '], ['y', '1.2s']],
  [['b', '▸ '], ['', 'Replicating to 310 cities ████████████ '], ['y', '100%']],
  [['g', '✓ '], ['', 'Live at '], ['b', 'https://shop-7f3a.titanx.app']],
  [['g', '✓ '], ['', 'p50 '], ['y', '17 ms'], ['', ' · p99 '], ['y', '61 ms']],
];
const TERM_TOTAL = TERM.reduce((s, l) => s + l.reduce((a, p) => a + p[1].length, 0) + 1, 0);

function Terminal() {
  const ref = useRef(null);
  const seen = useInView(ref, { threshold: 0.4 });
  const [n, setN] = useState(REDUCE ? TERM_TOTAL : 0);
  useEffect(() => {
    if (!seen || REDUCE) return;
    let k = 0;
    const id = setInterval(() => {
      k += 2;
      setN(k);
      if (k >= TERM_TOTAL) clearInterval(id);
    }, 18);
    return () => clearInterval(id);
  }, [seen]);

  let left = n;
  const out = [];
  TERM.forEach((line, li) => {
    if (left <= 0) return;
    const parts = [];
    line.forEach((p, pi) => {
      if (left <= 0) return;
      parts.push(<span key={pi} className={p[0]}>{p[1].slice(0, left)}</span>);
      left -= p[1].length;
    });
    left -= 1;
    out.push(<span key={li}>{parts}{'\n'}</span>);
  });

  return (
    <div className="term" ref={ref} data-reveal="right">
      <div className="term-top"><i /><i /><i /><span>~/shop — titanx</span></div>
      <pre>{out}<span className="caret" /></pre>
    </div>
  );
}

export function Developers() {
  const pts = [
    'Framework presets for Next.js, Astro, Remix, SvelteKit and plain HTML',
    'Preview URL for every pull request, shareable with your team',
    'Environment secrets encrypted at rest and injected at runtime',
    'Local dev server that mirrors the edge runtime exactly',
  ];
  return (
    <section className="sec" id="developers">
      <div className="wrap dev">
        <div data-reveal="left">
          <div className="sec-head" style={{ marginBottom: 0 }}>
            <span className="eyebrow">Developers</span>
            <h2>One command. Global in 10 seconds.</h2>
            <p>No regions to choose, no load balancers to configure. The CLI handles builds, caching and rollout.</p>
          </div>
          <ul className="dev-list">
            {pts.map((p, k) => <li key={k}><Check /><span>{p}</span></li>)}
          </ul>
        </div>
        <Terminal />
      </div>
    </section>
  );
}

/* ---------- testimonials 3D carousel ---------- */
const QUOTES = [
  ['Our checkout page went from 420 ms to 38 ms for customers in Southeast Asia. Conversion rose the same week.', 'Aditi Rao', 'Head of Platform, Kestrel Pay'],
  ['We deleted three load balancers and a CDN contract. One config file replaced all of it.', 'Marcus Lind', 'CTO, Vantage Rail'],
  ['Rollbacks used to take twenty minutes. Now it is one click and the old version is live everywhere.', 'Sofia Mendes', 'SRE Lead, Lumio'],
  ['Preview URLs on every pull request changed how our designers review work.', 'Kenji Watanabe', 'Engineering Manager, Meridian Games'],
  ['During a launch we hit 2 million requests a minute and nobody on the team got paged.', 'Leila Haddad', 'VP Engineering, Brightfold'],
  ['The latency map showed us that São Paulo users were our slowest. Fixed in an afternoon.', 'Daniel Okafor', 'Staff Engineer, Quanta Health'],
];

export function Voices() {
  const [i, setI] = useState(0);
  const paused = useRef(false);
  const touchStart = useRef(0);
  useEffect(() => {
    if (REDUCE) return;
    const id = setInterval(() => { if (!paused.current) setI((v) => v + 1); }, 4200);
    return () => clearInterval(id);
  }, []);
  const step = 360 / QUOTES.length;
  const front = ((i % QUOTES.length) + QUOTES.length) % QUOTES.length;

  const onTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (diff > 45) setI((v) => v + 1);
    else if (diff < -45) setI((v) => v - 1);
  };

  return (
    <section className="sec" id="voices" style={{ overflow: 'hidden' }}>
      <div className="wrap">
        <div className="sec-head" data-reveal="blur" style={{ marginInline: 'auto', textAlign: 'center', justifyItems: 'center' }}>
          <span className="eyebrow">Customers</span>
          <h2>Teams that moved to the edge</h2>
        </div>

        {/* Desktop 3D Ring Carousel (Untouched on Desktop) */}
        <div className="carousel" data-reveal="zoom" onPointerEnter={() => (paused.current = true)} onPointerLeave={() => (paused.current = false)}>
          <div className="car-ring" style={{ transform: `translateZ(calc(var(--R) * -1)) rotateY(${-i * step}deg)` }}>
            {QUOTES.map((x, k) => (
              <figure key={k} className="quote" style={{ transform: `rotateY(${k * step}deg) translateZ(var(--R))`, opacity: front === k ? 1 : 0.45, margin: 0 }}>
                <p>“{x[0]}”</p>
                <figcaption className="who">
                  <span className="avatar">{x[1].split(' ').map((s) => s[0]).join('')}</span>
                  <div><b>{x[1]}</b><span>{x[2]}</span></div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        {/* Mobile Swipeable Testimonial Card */}
        <div
          className="mob-voice-card"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="mob-voice-top">
            <span className="mob-voice-stars">★★★★★</span>
            <span className="mob-voice-tag">VERIFIED PRODUCTION TEAM</span>
          </div>
          <p className="mob-voice-quote">“{QUOTES[front][0]}”</p>
          <div className="who">
            <span className="avatar">{QUOTES[front][1].split(' ').map((s) => s[0]).join('')}</span>
            <div>
              <b>{QUOTES[front][1]}</b>
              <span>{QUOTES[front][2]}</span>
            </div>
          </div>
          <div className="mob-voice-dots">
            {QUOTES.map((_, k) => (
              <button
                key={k}
                className={'mob-dot' + (front === k ? ' active' : '')}
                onClick={() => setI(k)}
                aria-label={`Testimonial ${k + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="car-ctl">
          <button aria-label="Previous" onClick={() => setI((v) => v - 1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 6l-6 6 6 6" /></svg>
          </button>
          <button aria-label="Next" onClick={() => setI((v) => v + 1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 6l6 6-6 6" /></svg>
          </button>
        </div>
      </div>
    </section>
  );
}

/* ---------- CTA + footer ---------- */
export function CTA() {
  return (
    <section className="sec" id="start" style={{ paddingBottom: 0 }}>
      <div className="wrap">
        <div className="cta" data-reveal="rise">
          <span className="eyebrow">Get started</span>
          <h2>Your users are everywhere. <span className="grad-text">Your app should be too.</span></h2>
          <p>Deploy free in under a minute. No credit card, no regions to pick, no servers to babysit.</p>
          <div className="cta-actions">
            <Magnetic href="#top" className="btn btn-primary">Deploy now <Arrow /></Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const cols = [
    ['Product', ['Edge Functions', 'Global KV', 'Image Pipeline', 'Observability']],
    ['Developers', ['Documentation', 'CLI reference', 'Status', 'Changelog']],
    ['Company', ['About', 'Careers', 'Security', 'Contact']],
  ];
  return (
    <footer>
      <div className="wrap">
        <div className="foot">
          <div className="about">
            <a href="#top" className="brand"><img src="/images/Titanx.jpeg" alt="TitanX Logo" className="brand-logo" />TITANX</a>
            <p>The edge cloud for teams who want every user to feel like they live next to the data centre.</p>
          </div>
          {cols.map(([h, l]) => (
            <div key={h}>
              <h4>{h}</h4>
              <ul>{l.map((x) => <li key={x}><a href="#top">{x}</a></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="foot-bottom">
          <span className="status">All 310 cities operational</span>
          <span>TitanX is a fictional brand created as a design concept. © 2026</span>
        </div>
      </div>
    </footer>
  );
}
