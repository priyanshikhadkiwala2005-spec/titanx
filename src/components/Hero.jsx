import { useEffect, useRef, useState } from 'react';
import { Arrow } from './Icons';
import { Magnetic } from './Interactive';
import { REDUCE, clamp } from '../lib/utils';

const LINES = [['Run', 'your', 'app'], ['in', 'every', 'city'], ['at', 'once.']];

export default function Hero() {
  const [lat, setLat] = useState(18);
  const [rps, setRps] = useState(4.82);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (REDUCE) return;
    const id = setInterval(() => {
      setLat(16 + Math.round(Math.random() * 5));
      setRps((v) => clamp(v + (Math.random() - 0.48) * 0.06, 4.6, 5.1));
    }, 1400);
    return () => clearInterval(id);
  }, []);

  let idx = 0;
  return (
    <section className="hero" id="top">
      {/* Full-Screen Immersive Video Background Covering Entire Screen */}
      <div className="hero-video-bg-wrap" aria-hidden="true">
        <video
          ref={videoRef}
          className="hero-fullscreen-video"
          src="/videos/hero-video.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
        <div className="hero-video-mask" />
      </div>

      <div className="hero-grid" />
      <div className="wrap">
        <div className="hero-copy">
          <span className="pill fade-seq" style={{ '--d': '.05s' }}><b>NEW</b>Edge Functions now run in 310 cities</span>
          <h1>
            {LINES.map((ln, li) => (
              <span key={li} className="ln">
                {ln.map((w, wi) => {
                  const i = idx++;
                  const grad = li === 1 && wi === 2;
                  return (
                    <span key={wi}>
                      <span className={'w' + (grad ? ' grad-text' : '')} style={{ '--i': i }}>{w}</span>{' '}
                    </span>
                  );
                })}
              </span>
            ))}
          </h1>
          <p className="hero-sub fade-seq" style={{ '--d': '.8s' }}>
            TitanX deploys your code to a global edge network in seconds. Every request is answered by the server closest to the person who sent it.
          </p>
          <div className="hero-actions fade-seq" style={{ '--d': '.95s' }}>
            <Magnetic href="#start" className="btn btn-primary">Deploy your first app <Arrow /></Magnetic>
            <Magnetic href="#pipeline" className="btn btn-ghost">See how it works</Magnetic>
          </div>
          <dl className="live fade-seq" style={{ '--d': '1.1s' }}>
            <div><dt><span className="dot" />Median latency</dt><dd>{lat}<small>ms</small></dd></div>
            <div><dt>Requests / sec</dt><dd>{rps.toFixed(2)}<small>M</small></dd></div>
            <div><dt>Edge cities</dt><dd>310</dd></div>
          </dl>
        </div>
        <div className="hero-stage-spacer" aria-hidden="true" />
      </div>
    </section>
  );
}