export const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#9af03c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export const Logo = () => (
  <svg viewBox="0 0 40 40" fill="none">
    <defs>
      <linearGradient id="lg" x1="0" y1="0" x2="40" y2="40">
        <stop offset="0" stopColor="#1f7bff" />
        <stop offset=".5" stopColor="#27d6f5" />
        <stop offset="1" stopColor="#9af03c" />
      </linearGradient>
    </defs>
    <circle cx="20" cy="20" r="9" stroke="url(#lg)" strokeWidth="3" />
    <ellipse cx="20" cy="20" rx="18" ry="7" transform="rotate(-25 20 20)" stroke="url(#lg)" strokeWidth="1.6" opacity=".9" />
    <circle cx="35.5" cy="12.5" r="2.4" fill="#9af03c" />
  </svg>
);

const paths = {
  fn: <path d="M8 4c-2 0-3 1-3 3v3c0 1-1 2-2 2 1 0 2 1 2 2v3c0 2 1 3 3 3M16 4c2 0 3 1 3 3v3c0 1 1 2 2 2-1 0-2 1-2 2v3c0 2-1 3-3 3M10 15l4-6" />,
  kv: (
    <>
      <ellipse cx="12" cy="5.5" rx="7.5" ry="2.8" />
      <path d="M4.5 5.5v6.5c0 1.6 3.4 2.8 7.5 2.8s7.5-1.2 7.5-2.8V5.5M4.5 12v6.5c0 1.6 3.4 2.8 7.5 2.8s7.5-1.2 7.5-2.8V12" />
    </>
  ),
  roll: <path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l3 2" />,
  shield: (
    <>
      <path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6l8-3z" />
      <path d="M8.5 12l2.5 2.5 4.5-5" />
    </>
  ),
  img: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <circle cx="9" cy="10" r="2" />
      <path d="M21 16l-5-5-9 9" />
    </>
  ),
  eye: (
    <>
      <path d="M3 17l5-6 4 4 4-7 5 9" />
      <path d="M3 21h18" />
    </>
  ),
};

export const Icon = ({ k }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="url(#ig)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <defs>
      <linearGradient id="ig" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#27d6f5" />
        <stop offset="1" stopColor="#9af03c" />
      </linearGradient>
    </defs>
    {paths[k]}
  </svg>
);
