import { Arrow } from './Icons';
import { Magnetic } from './Interactive';
import EarthSpin from './EarthSpin';

// Main heading split into animated words. Words marked with `*` get the gradient.
const LINES = [['Rule', 'the', 'Digital'], ['Era', 'with', '*TITANX']];

export default function Hero() {
  let idx = 0;
  return (
    <section className="hero" id="top">
      {/* Rotating Earth (dotted globe) stage */}
      <div className="hero-video-bg-wrap" aria-hidden="true">
        <EarthSpin />
        <div className="hero-video-mask" />
      </div>

      <div className="hero-grid" />
      <div className="wrap">
        <div className="hero-copy">
          <span className="pill fade-seq" style={{ '--d': '.05s' }}><b>TITANX</b>Rule the Digital Era</span>
          <h1 className="hero-h1-long">
            {LINES.map((ln, li) => (
              <span key={li} className="ln">
                {ln.map((raw, wi) => {
                  const i = idx++;
                  const grad = raw.startsWith('*');
                  const w = grad ? raw.slice(1) : raw;
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
            A Decentralised Token Ecosystem with Staking and Referral Opportunities. Discover TitanX, a decentralised token ecosystem designed around smart-contract technology, community participation, staking and referral opportunities. Join the ecosystem, participate in staking and explore different income categories through a transparent smart-contract-based system.
          </p>
          <div className="hero-actions fade-seq" style={{ '--d': '.95s' }}>
            <Magnetic href="#overview" className="btn btn-primary">Explore Ecosystem <Arrow /></Magnetic>
          </div>
        </div>
        <div className="hero-stage-spacer" aria-hidden="true" />
      </div>
    </section>
  );
}
