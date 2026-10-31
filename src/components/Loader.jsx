import { useEffect, useRef, useState } from 'react';
import { REDUCE } from '../lib/utils';

export default function Loader({ onDone }) {
  const [n, setN] = useState(0);
  const [out, setOut] = useState(false);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    let raf;
    let timer;
    const start = performance.now();
    const dur = REDUCE ? 300 : 2300;
    const tick = (t) => {
      const k = Math.min(1, (t - start) / dur);
      setN(Math.round((1 - Math.pow(1 - k, 3)) * 100));
      if (k < 1) raf = requestAnimationFrame(tick);
      else
        timer = setTimeout(() => {
          setOut(true);
          doneRef.current();
        }, 220);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, []);

  const msg =
    n < 34 ? 'Locating nearest edge' : n < 68 ? 'Warming 310 cities' : n < 100 ? 'Routing first request' : 'Online';

  return (
    <div className={'loader' + (out ? ' out' : '')} role="status" aria-label="Loading">
      <div className="ld-core">
        <svg className="ld-svg" viewBox="0 0 200 200" fill="none">
          <defs>
            <linearGradient id="ldg" x1="0" y1="0" x2="200" y2="200">
              <stop offset="0" stopColor="#1f7bff" />
              <stop offset=".5" stopColor="#27d6f5" />
              <stop offset="1" stopColor="#9af03c" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="92" stroke="rgba(120,175,255,.12)" strokeWidth="1" />
          <g className="r1">
            <circle cx="100" cy="100" r="92" stroke="url(#ldg)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="120 460" />
          </g>
          <g className="r2">
            <ellipse cx="100" cy="100" rx="78" ry="30" stroke="#27d6f5" strokeWidth="1.2" opacity=".6" />
            <circle cx="178" cy="100" r="4" fill="#9af03c" />
          </g>
          <g className="r3">
            <circle cx="100" cy="100" r="64" stroke="rgba(154,240,60,.5)" strokeWidth="1" strokeDasharray="2 8" />
          </g>
        </svg>
        <img className="ld-logo" src="/images/Titanx.jpeg" alt="TitanX" />
      </div>
      <div className="ld-num">{String(n).padStart(3, '0')}</div>
      <div className="ld-word">
        {'TITANX'.split('').map((c, i) => (
          <span key={i} style={{ '--i': i }}>{c}</span>
        ))}
      </div>
      <div className="ld-status">{msg}</div>
      <div className="ld-bar">
        <i style={{ transform: `scaleX(${n / 100})` }} />
      </div>
    </div>
  );
}
