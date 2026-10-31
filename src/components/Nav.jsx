import { useEffect, useState } from 'react';

const LINKS = [
  ['Platform', '#platform'],
  ['How it works', '#pipeline'],
  ['Network', '#network'],
  ['Developers', '#developers'],
];

export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const f = () => setSolid(window.scrollY > 20);
    f();
    window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);

  return (
    <header className={'nav' + (solid || open ? ' solid' : '')}>
      <div className="wrap">
        <a href="#top" className="brand"><img src="/images/Titanx.jpeg" alt="TitanX Logo" className="nav-logo" />TITANX</a>
        <nav className="nav-links" aria-label="Main">
          {LINKS.map(([t, h]) => <a key={h} href={h}>{t}</a>)}
        </nav>
        <div className="nav-cta">
          <a href="#start" className="btn btn-primary btn-sm">Sign in</a>
          <button className="burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h10" />}
            </svg>
          </button>
        </div>
      </div>
      <div className={'mob-menu' + (open ? ' open' : '')}>
        {LINKS.map(([t, h]) => <a key={h} href={h} onClick={() => setOpen(false)}>{t}</a>)}
        <div className="mob-cta">
          <a href="#start" className="btn btn-primary" onClick={() => setOpen(false)}>Sign in</a>
        </div>
      </div>
    </header>
  );
}
