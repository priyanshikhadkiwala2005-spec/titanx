import { useEffect, useRef, useState } from 'react';
import { REDUCE, useInView } from '../lib/utils';

/** Animated number that counts up when scrolled into view. */
export function CountUp({ to, dec = 0, dur = 2000, suffix }) {
  const ref = useRef(null);
  const seen = useInView(ref);
  const [v, setV] = useState(REDUCE ? to : 0);
  useEffect(() => {
    if (!seen || REDUCE) return;
    let raf;
    const s = performance.now();
    const f = (t) => {
      const k = Math.min(1, (t - s) / dur);
      setV(to * (1 - Math.pow(1 - k, 4)));
      if (k < 1) raf = requestAnimationFrame(f);
    };
    raf = requestAnimationFrame(f);
    return () => cancelAnimationFrame(raf);
  }, [seen]);
  return (
    <span ref={ref}>
      {v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec })}
      {suffix ? <small>{suffix}</small> : null}
    </span>
  );
}

/** Card that tilts in 3D toward the pointer, with a moving glare. */
export function Tilt({ children }) {
  const ref = useRef(null);
  const move = (e) => {
    const el = ref.current;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--ry', (x - 0.5) * 14 + 'deg');
    el.style.setProperty('--rx', (0.5 - y) * 12 + 'deg');
    el.style.setProperty('--mx', x * 100 + '%');
    el.style.setProperty('--my', y * 100 + '%');
  };
  const leave = () => {
    ref.current.style.setProperty('--rx', '0deg');
    ref.current.style.setProperty('--ry', '0deg');
  };
  return (
    <div className="tilt" ref={ref} onPointerMove={REDUCE ? undefined : move} onPointerLeave={leave}>
      {children}
    </div>
  );
}

/** Link that drifts toward the cursor. */
export function Magnetic({ className, children, href = '#' }) {
  const ref = useRef(null);
  const move = (e) => {
    const el = ref.current;
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px,${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
  };
  const leave = () => { ref.current.style.transform = ''; };
  return (
    <a ref={ref} href={href} className={className} onPointerMove={REDUCE ? undefined : move} onPointerLeave={leave}>
      {children}
    </a>
  );
}
