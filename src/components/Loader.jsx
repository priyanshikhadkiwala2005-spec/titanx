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
    const dur = REDUCE ? 300 : 2600;
    const tick = (t) => {
      const k = Math.min(1, (t - start) / dur);
      setN(Math.round((1 - Math.pow(1 - k, 3)) * 100));
      if (k < 1) raf = requestAnimationFrame(tick);
      else
        timer = setTimeout(() => {
          setOut(true);
          doneRef.current();
        }, 300);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, []);

  const msg =
    n < 34 ? 'Loading TitanX' : n < 68 ? 'Preparing ecosystem' : n < 100 ? 'Rule the Digital Era' : 'Ready';

  return (
    <div className={'loader ld2' + (out ? ' out' : '')} role="status" aria-label="Loading">
      <div className="ld2-panel top" />
      <div className="ld2-panel bot" />
      <div className="ld2-stage">
        <div className="ld2-frame">
          <i className="c tl" /><i className="c tr" /><i className="c bl" /><i className="c br" />
          <svg className="ld2-trace" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <rect x="1" y="1" width="98" height="98" rx="4" pathLength="100" style={{ strokeDashoffset: 100 - n }} />
          </svg>
          <img className="ld2-img dim" src="/images/Titanx.jpeg" alt="" />
          <img className="ld2-img lit" src="/images/Titanx.jpeg" alt="TitanX" style={{ clipPath: `inset(${100 - n}% 0 0 0)` }} />
          <span className="ld2-scan" style={{ bottom: `${n}%`, opacity: n > 0 && n < 100 ? 1 : 0 }} />
        </div>
        <div className="ld2-word">
          {'TITANX'.split('').map((c, i) => (
            <span key={i} style={{ '--i': i }}>{c}</span>
          ))}
        </div>
        <div className="ld2-meta">
          <span className="ld2-status">{msg}</span>
          <span className="ld2-num">{String(n).padStart(3, '0')}</span>
        </div>
      </div>
    </div>
  );
}
