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
  token: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 8.5h7M12 8.5V16" />
    </>
  ),
  flame: <path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.4 1.2-3.9 2.5-5 .2 1.6 1 2.6 2 3 0-3 .3-5.5.5-8z" />,
  stake: (
    <>
      <path d="M12 3l9 4.5-9 4.5-9-4.5L12 3z" />
      <path d="M3 12l9 4.5 9-4.5M3 16.5L12 21l9-4.5" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <circle cx="17.5" cy="9" r="2.4" />
      <path d="M16 14.2c2.9.3 5 2.7 5 5.8" />
    </>
  ),
  wallet: (
    <>
      <rect x="3" y="6" width="18" height="14" rx="3" />
      <path d="M3 10h18M16 15h2M6 6l9-3 1 3" />
    </>
  ),
  vision: (
    <>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.2" />
    </>
  ),
  rank: <path d="M12 3l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.8L12 3z" />,
  swap: <path d="M7 4L3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7" />,
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
