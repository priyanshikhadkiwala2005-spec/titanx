import { useEffect, useRef, useState } from 'react';
import Loader from './components/Loader';
import Nav from './components/Nav';
import Hero from './components/Hero';
import { Marquee, Features, Pipeline, Stats, Regions, Developers, Voices, CTA, Footer } from './components/Sections';
import { REDUCE, clamp } from './lib/utils';

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const cursor = useRef(null);

  // Scroll engine: writes --p (0..1) on every [data-progress] section,
  // the active step index, and the top progress bar.
  useEffect(() => {
    let raf;
    const root = document.documentElement;
    const loop = () => {
      const vh = window.innerHeight;
      document.querySelectorAll('[data-progress]').forEach((el) => {
        const r = el.getBoundingClientRect();
        const total = r.height - vh;
        const p = clamp(total > 0 ? -r.top / total : 0, 0, 1);
        el.style.setProperty('--p', p.toFixed(4));
        const s = el.dataset.steps;
        if (s) {
          const a = String(Math.min(+s - 1, Math.floor(p * s * 0.999 + 0.0001)));
          if (el.dataset.active !== a) el.dataset.active = a;
        }
      });
      const max = root.scrollHeight - vh;
      root.style.setProperty('--sp', max > 0 ? (window.scrollY / max).toFixed(4) : 0);
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, []);

  // Reveal-on-scroll, armed only after the loader so nothing is hidden at rest.
  useEffect(() => {
    if (!loaded) return;
    const root = document.documentElement;
    root.classList.add('ready');
    if (REDUCE || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) el.classList.add('in');
      else io.observe(el);
    });
    root.classList.add('armed');
    return () => io.disconnect();
  }, [loaded]);

  // Soft cursor glow
  useEffect(() => {
    if (REDUCE) return;
    let x = -500, y = -500, cx = x, cy = y, raf;
    const m = (e) => { x = e.clientX; y = e.clientY; };
    window.addEventListener('pointermove', m, { passive: true });
    const f = () => {
      cx += (x - cx) * 0.12;
      cy += (y - cy) * 0.12;
      if (cursor.current) cursor.current.style.transform = `translate(${cx}px,${cy}px)`;
      raf = requestAnimationFrame(f);
    };
    f();
    return () => {
      window.removeEventListener('pointermove', m);
      cancelAnimationFrame(raf);
    };
  }, []);

  const [showBottomBar, setShowBottomBar] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setShowBottomBar(y > 380 && y < max - 500);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const done = () => {
    setLoaded(true);
    setTimeout(() => setShowLoader(false), 1200);
  };

  return (
    <>
      {showLoader && <Loader onDone={done} />}
      <div className="topbar"><i /></div>
      <div className="cursor" ref={cursor} />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Features />
        <Pipeline />
        <Stats />
        <Regions />
        <Developers />
        <Voices />
        <CTA />
      </main>
      <Footer />
      {/* Mobile Floating Action Bar */}
      <aside className={'mob-bottom-bar' + (showBottomBar ? ' visible' : '')} aria-label="Quick Actions">
        <div className="mob-bar-inner">
          <div className="mob-bar-info">
            <span className="dot" />
            <b>310 PoPs</b>
            <span className="sep">·</span>
            <span>p50 9ms</span>
          </div>
          <a href="#start" className="btn btn-primary btn-sm">Deploy ➔</a>
        </div>
      </aside>
    </>
  );
}
