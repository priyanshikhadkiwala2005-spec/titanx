import { useEffect, useRef, useState } from 'react';
import { Arrow, Check, Icon } from './Icons';
import { Magnetic, Tilt } from './Interactive';
import { REDUCE, clamp, useInView } from '../lib/utils';

/* ---------- shared: content table ---------- */
function DataTable({ head, rows, align, foot, caption }) {
  return (
    <div className="tx-table-wrap" data-reveal="up">
      <table className="tx-table">
        {caption ? <caption>{caption}</caption> : null}
        <thead>
          <tr>{head.map((h, k) => <th key={k} className={align && align[k] === 'r' ? 'r' : ''}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, k) => (k === 0 ? <th scope="row" key={k}>{c}</th> : <td key={k} className={align && align[k] === 'r' ? 'r' : ''}>{c}</td>))}
            </tr>
          ))}
        </tbody>
        {foot ? (
          <tfoot>
            <tr>{foot.map((c, k) => (k === 0 ? <th scope="row" key={k}>{c}</th> : <td key={k} className={align && align[k] === 'r' ? 'r' : ''}>{c}</td>))}</tr>
          </tfoot>
        ) : null}
      </table>
    </div>
  );
}

/* ---------- key features marquee ---------- */
export function Marquee() {
  const a = ['Decentralised Smart Contract', 'Transparent Token Burning', 'Staking Opportunities', 'Referral Programme'];
  const b = ['Flexi & Regular Staking', 'Income Categories', 'Rank Recognition', 'Public Transparency', 'Withdrawals in Tokens', 'Compatible Web3 Wallets'];
  const row = (arr, rev) => (
    <div className={'mq-row' + (rev ? ' rev' : '')}>
      {[...arr, ...arr, ...arr].map((n, k) => <span key={k}>{n}</span>)}
    </div>
  );
  return (
    <section className="marquee" aria-label="TitanX key features">
      <div className="mq-label">TitanX · Rule the Digital Era</div>
      {row(a)}
      {row(b, true)}
    </section>
  );
}

/* ---------- about, vision & mission ---------- */
const OVERVIEW = [
  ['fn', 'Decentralised Ecosystem', 'Built around smart-contract technology, with project rules managed through the contract.', 'Smart-contract rules'],
  ['token', 'Transparent Token Model', 'Token creation, participation and burning are based on the smart-contract mechanism.', 'Open mechanism'],
  ['stake', 'Staking Opportunities', 'Members can participate in staking through the available Flexi and Regular options.', 'Flexi · Regular'],
  ['users', 'Community Participation', 'A referral-based ecosystem designed to encourage community engagement and network development.', 'Referral-based'],
];

export function Features() {
  return (
    <section className="sec" id="overview">
      <div className="wrap">
        <div className="sec-head" data-reveal="blur">
          <span className="eyebrow">About TitanX</span>
          <h2>Discover the TitanX Ecosystem</h2>
          <p>TitanX is a decentralised token project built around smart-contract technology. It brings together token participation, staking opportunities, community referrals and a structured income ecosystem. The project focuses on transparency, decentralisation and community-driven participation.</p>
        </div>
        <div className="feat-grid f4">
          {OVERVIEW.map((x, k) => (
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
        <div className="vm-grid">
          <div data-reveal="left">
            <Tilt>
              <div className="ficon"><Icon k="vision" /></div>
              <h3>Our Vision</h3>
              <p>To build a transparent and decentralised token community where members can participate in a smart-contract-driven digital ecosystem.</p>
            </Tilt>
          </div>
          <div data-reveal="right" style={{ '--d': '.12s' }}>
            <Tilt>
              <div className="ficon"><Icon k="target" /></div>
              <h3>Our Mission</h3>
              <p>To create an accessible ecosystem that brings together decentralised technology, token participation, staking and community engagement. We aim to encourage transparency, trust and long-term community participation through smart-contract-based operations.</p>
            </Tilt>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- token ecosystem ---------- */
const STATS = [
  ['Decentralised', 'Operates through a decentralised smart contract', 0.9],
  ['No Open Buy', 'The ecosystem does not provide an open token-buying mechanism', 0.7],
  ['Transparent', 'Token supply, minting and burning information is publicly visible', 0.8],
  ['In Tokens', 'Withdrawals are processed in tokens under smart-contract rules', 0.6],
];

const TOKEN_ROWS = [
  ['Token Creation', 'Tokens are created through the joining process according to the smart-contract mechanism.'],
  ['No Open Buy', 'The ecosystem does not provide an open token-buying mechanism.'],
  ['Joining Mechanism', 'Members can participate using USDT or supported tokens.'],
  ['Token Withdrawal', 'Withdrawals are processed in tokens according to the applicable smart-contract rules.'],
  ['Transparent Burning', "The token-burning mechanism is designed to support the ecosystem's supply-management model."],
  ['Public Transparency', 'Token supply, minting and burning information is made publicly visible through the ecosystem.'],
];

export function Stats() {
  return (
    <section className="sec" id="token">
      <div className="wrap">
        <div className="sec-head" data-reveal="left">
          <span className="eyebrow">Token Ecosystem</span>
          <h2>Understanding the TitanX Token</h2>
          <p>The TitanX token operates through a decentralised smart contract. Its creation, participation and burning mechanisms follow the rules defined within the contract.</p>
        </div>
        <div className="stats" data-reveal="zoom">
          {STATS.map((x, k) => (
            <div className="stat in" key={k} style={{ '--w': x[2] }}>
              <div className="v txt">{x[0]}</div>
              <div className="l">{x[1]}</div>
              <div className="bar"><i /></div>
            </div>
          ))}
        </div>
        <div className="tx-block">
          <DataTable head={['Topic', 'Details']} rows={TOKEN_ROWS} />
        </div>
      </div>
    </section>
  );
}

/* ---------- how to join: joining process (sticky, scroll-driven) ---------- */
const STEPS = [
  ['Create Your Wallet', 'Set up a compatible digital wallet such as Trust Wallet, TokenPocket, SafePal or MetaMask.', 'Web3', 'Wallet'],
  ['Connect Through Referral', 'Access the TitanX ecosystem using a valid referral link.', 'Link', 'Connect'],
  ['Join the Ecosystem', 'Participate through the available joining mechanism using supported payment options.', 'Join', 'Join'],
  ['Choose Your Staking Option', 'Explore the available Flexi and Regular staking options.', 'Stake', 'Stake'],
  ['Activate Your TitanX ID', 'Complete the required staking process to activate your TitanX ID according to the smart-contract rules.', 'ID', 'Activate'],
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
    const major = i % 12 === 0;
    ticks.push(
      <line key={i} x1={100 + Math.cos(a) * 99} y1={100 + Math.sin(a) * 99} x2={100 + Math.cos(a) * (major ? 92 : 96)} y2={100 + Math.sin(a) * (major ? 92 : 96)} strokeWidth={major ? 1.5 : 0.6} />
    );
  }
  const total = String(STEPS.length).padStart(2, '0');
  return (
    <section className="pipe pipe-5" id="join" data-progress data-steps={STEPS.length}>
      <div className="pipe-stick">
        <div className="wrap">
          <div className="sec-head pipe-head">
            <span className="eyebrow">How to Join TitanX</span>
            <h2>Start Your TitanX Journey</h2>
            <p>Getting started with TitanX involves connecting a compatible Web3 wallet and following the ecosystem's joining and staking process.</p>
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
                <div key={k}><span className="big grad-text">{s[2]}</span><span className="cap">Step 0{k + 1} · {s[3]}</span></div>
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
                <span className="mob-pipe-badge">STEP 0{mobStep + 1} OF {total}</span>
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

/* ---------- smart contract & transparency ---------- */
const CONTRACT = [
  ['fn', 'Decentralised Operations', 'The ecosystem follows predefined smart-contract rules.'],
  ['eye', 'Transparent Mechanisms', 'Applicable token and ecosystem information is made visible to participants.'],
  ['roll', 'Automated Processes', 'Joining, staking and applicable distribution mechanisms operate according to contract conditions.'],
  ['users', 'Community Participation', 'Members can interact with the ecosystem through compatible digital wallets.'],
];

export function SmartContract() {
  return (
    <section className="sec sec-tight" id="contract">
      <div className="wrap">
        <div className="sec-head" data-reveal="blur">
          <span className="eyebrow">Smart Contract &amp; Transparency</span>
          <h2>Powered by Smart Contract Technology</h2>
          <p>TitanX is built around decentralised smart-contract technology, providing a structured mechanism for token participation, staking, referrals and income distribution.</p>
        </div>
        <div className="feat-grid f4">
          {CONTRACT.map((x, k) => (
            <div key={k} data-reveal={k % 2 ? 'up' : 'flip'} style={{ '--d': k * 0.12 + 's' }}>
              <Tilt>
                <div className="ficon"><Icon k={x[0]} /></div>
                <h3>{x[1]}</h3>
                <p>{x[2]}</p>
              </Tilt>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- supported wallets ---------- */
const WALLETS = ['Trust Wallet', 'TokenPocket', 'SafePal', 'MetaMask'];

export function Wallets() {
  return (
    <section className="sec sec-tight" id="wallets">
      <div className="wrap">
        <div className="sec-head" data-reveal="blur">
          <span className="eyebrow">Supported Wallets</span>
          <h2>Connect Your Digital Wallet</h2>
          <p>Access the TitanX ecosystem using a compatible Web3 wallet. Supported wallet options mentioned in the project material include:</p>
        </div>
        <div className="rule-grid cols-4">
          {WALLETS.map((w, k) => (
            <div className="rule" key={k} data-reveal="up" style={{ '--d': k * 0.1 + 's' }}>
              <span className="rule-k">Wallet</span>
              <b className="rule-v">{w}</b>
            </div>
          ))}
        </div>
        <p className="tx-foot-note" data-reveal="up">Connect your compatible wallet and explore the TitanX decentralised ecosystem.</p>
      </div>
    </section>
  );
}

/* ---------- token burning + typing terminal ---------- */
const TERM = [
  [['c', '# TitanX token burning']],
  [['g', '$ '], ['', 'burning     '], ['y', 'smart contract']],
  [['b', '▸ '], ['', 'rules       '], ['y', 'predefined']],
  [['b', '▸ '], ['', 'records     '], ['y', 'public']],
  [['b', '▸ '], ['', 'management  '], ['y', 'decentralised']],
  [['g', '✓ '], ['', 'minting, supply & burning → '], ['b', 'visible']],
  [['g', '✓ '], ['', 'no manual intervention']],
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
      <div className="term-top"><i /><i /><i /><span>titanx — token burning</span></div>
      <pre>{out}<span className="caret" /></pre>
    </div>
  );
}

const BURN_POINTS = [
  ['How It Works', ['The token-burning mechanism operates through the smart contract.', 'Tokens are burned according to the applicable smart-contract rules during the defined selling process.']],
  ['Transparent Records', ['Token minting, total supply and burning information are made publicly visible.']],
  ['Decentralised Management', ['The burning mechanism follows the predefined contract rules rather than manual intervention.']],
];

export function Developers() {
  return (
    <section className="sec" id="burning">
      <div className="wrap dev">
        <div data-reveal="left">
          <div className="sec-head" style={{ marginBottom: 0 }}>
            <span className="eyebrow">Token Burning Mechanism</span>
            <h2>Transparent Token Burning</h2>
            <p>TitanX incorporates a token-burning mechanism as part of its token ecosystem.</p>
          </div>
          <ul className="dev-list">
            {BURN_POINTS.map((p, k) => (
              <li key={k}>
                <Check />
                <span className="dev-item">
                  <b>{p[0]}</b>
                  {p[1].map((t) => <span key={t}>{t}</span>)}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <Terminal />
      </div>
      <div className="wrap">
        <div className="tx-note tx-gap" data-reveal="up">
          <span className="eyebrow">Transparency</span>
          <p>Transparency and smart-contract-based operations remain important elements of the TitanX ecosystem.</p>
        </div>
      </div>
    </section>
  );
}

/* ---------- income categories (horizontal scroll) ---------- */
const INCOMES = [
  ['NETWORK', 'Decentralised Network', 'TitanX is built around decentralised smart-contract technology, so project rules are managed through the contract rather than manual control.', [['Focus', 'Decentralisation'], ['Managed by', 'Smart contract']]],
  ['TRANSPARENCY', 'Token Transparency', 'Token supply, minting and burning information is made publicly visible, supporting an open and understandable token model.', [['Focus', 'Open information'], ['Visible', 'Supply · Mint · Burn']]],
  ['CONTRACTS', 'Smart Contracts', 'Joining, staking and applicable distribution mechanisms operate automatically according to predefined contract conditions.', [['Focus', 'Automation'], ['Rules', 'Predefined']]],
  ['WALLETS', 'Wallet Integration', 'Members can interact with the ecosystem through compatible Web3 wallets such as Trust Wallet, TokenPocket, SafePal and MetaMask.', [['Focus', 'Easy access'], ['Access via', 'Web3 wallet']]],
  ['COMMUNITY', 'Community Participation', 'A referral-based ecosystem designed to encourage community engagement, connections and long-term participation.', [['Focus', 'Engagement'], ['Built on', 'Referral connections']]],
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
    <section className="hz" id="ecosystem" ref={ref} data-progress aria-label="Ecosystem Features">
      <div className="hz-stick">
        <div className="wrap">
          <div className="sec-head" style={{ marginBottom: 0 }}>
            <span className="eyebrow">Ecosystem Features</span>
            <h2>Explore the TitanX Ecosystem</h2>
            <p>TitanX brings together decentralised technology, transparent token mechanisms, smart-contract automation and community participation in one connected ecosystem.</p>
          </div>
        </div>
        <div className="hz-track" ref={trackRef}>
          {INCOMES.map((x, k) => (
            <article className="region" key={k}>
              <span className="code">{x[0]}</span>
              <h3>{x[1]}</h3>
              <p className="region-d">{x[2]}</p>
              <svg className="spark" viewBox="0 0 300 44" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <linearGradient id={'sp' + k} x1="0" x2="1">
                    <stop offset="0" stopColor="#1f7bff" />
                    <stop offset=".5" stopColor="#27d6f5" />
                    <stop offset="1" stopColor="#9af03c" />
                  </linearGradient>
                </defs>
                <polyline points={spark(k + 1)} fill="none" stroke={`url(#sp${k})`} strokeWidth="2" />
              </svg>
              {x[3].map((r) => <div className="row" key={r[0]}><span>{r[0]}</span><b>{r[1]}</b></div>)}
            </article>
          ))}
        </div>
        <div className="mob-swipe-hint">
          <span>👈 Swipe</span>
          <span className="dot" />
          <span>Ecosystem Features 👉</span>
        </div>
        <div className="wrap">
          <div className="hz-progress"><span>NETWORK</span><i /><span>COMMUNITY</span></div>
        </div>
      </div>
    </section>
  );
}

/* ---------- direct referral programme ---------- */
const DIRECT = [
  ['Community expansion', 'Invite others to explore the ecosystem.'],
  ['Referral-based participation', 'Participate through referral connections.'],
  ['Structured referral connections', 'A structured referral network.'],
  ['Smart-contract-managed distribution', 'Distribution follows the contract.'],
];

export function DirectIncome() {
  return (
    <section className="sec sec-tight" id="direct">
      <div className="wrap">
        <div className="sec-head" data-reveal="blur">
          <span className="eyebrow">Direct Referral Programme</span>
          <h2>Grow Through Community Connections</h2>
          <p>The TitanX referral programme encourages community participation through direct referrals and a structured referral network. Members can invite others to explore the TitanX ecosystem and participate through their referral connections.</p>
        </div>
        <div className="rule-grid cols-4">
          {DIRECT.map((r, k) => (
            <div className="rule" key={k} data-reveal="up" style={{ '--d': k * 0.1 + 's' }}>
              <span className="rule-k">Direct Referral Benefit</span>
              <b className="rule-v">{r[0]}</b>
              <span className="rule-d">{r[1]}</span>
            </div>
          ))}
        </div>
        <p className="tx-foot-note" data-reveal="up">Build meaningful connections and become an active part of the TitanX community.</p>
      </div>
    </section>
  );
}

/* ---------- staking opportunities ---------- */
export function Staking() {
  const cards = [
    ['roll', 'Flexi Staking', 'The Flexi option provides flexibility in accessing basic capital, subject to the applicable smart-contract conditions.'],
    ['stake', 'Regular Staking', 'The Regular option is designed for members participating through a structured staking mechanism.'],
    ['fn', 'Smart Contract Management', 'Staking operations and applicable conditions are managed through the smart contract.'],
  ];
  return (
    <section className="sec" id="staking">
      <div className="wrap">
        <div className="sec-head" data-reveal="left">
          <span className="eyebrow">Staking Opportunities</span>
          <h2>Explore Staking Opportunities</h2>
          <p>TitanX provides staking opportunities through different participation options. Members can explore the available staking mechanisms according to their preferences.</p>
        </div>
        <div className="feat-grid">
          {cards.map((x, k) => (
            <div key={k} data-reveal={k % 2 ? 'up' : 'flip'} style={{ '--d': k * 0.12 + 's' }}>
              <Tilt>
                <div className="ficon"><Icon k={x[0]} /></div>
                <h3>{x[1]}</h3>
                <p>{x[2]}</p>
              </Tilt>
            </div>
          ))}
        </div>
        <div className="tx-note tx-gap" data-reveal="up">
          <span className="eyebrow">Important Note</span>
          <p>Staking participation, withdrawals and applicable conditions are subject to the project's smart-contract rules.</p>
        </div>
      </div>
    </section>
  );
}

/* ---------- rank income + unity income ---------- */
function RankBlock({ id, eyebrow, title, intro, cards, closing, f4 }) {
  return (
    <section className="sec" id={id}>
      <div className="wrap">
        <div className="sec-head" data-reveal="blur">
          <span className="eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
          <p>{intro}</p>
        </div>
        <div className={'feat-grid' + (f4 ? ' f4' : '')}>
          {cards.map((x, k) => (
            <div key={k} data-reveal={k % 2 ? 'up' : 'flip'} style={{ '--d': k * 0.12 + 's' }}>
              <Tilt>
                <div className="ficon"><Icon k={x[0]} /></div>
                <h3>{x[1]}</h3>
                <p>{x[2]}</p>
              </Tilt>
            </div>
          ))}
        </div>
        <p className="tx-foot-note" data-reveal="up">{closing}</p>
      </div>
    </section>
  );
}

export function RankIncome() {
  return (
    <RankBlock
      id="rank"
      eyebrow="Rank Income"
      title="Recognising Team Development"
      intro="The TitanX rank system is designed to recognise team development, business contribution and community growth. Members progress through different ranks according to the applicable team-business requirements."
      cards={[
        ['users', 'Team Structure', 'The rank mechanism considers team development across the A Team and other team groups.'],
        ['rank', 'Rank Recognition', 'Members become eligible for rank-based income according to their achieved rank and applicable project rules.'],
        ['swap', 'Automatic Rank Replacement', 'The highest achieved rank determines the applicable rank-income eligibility. Previous rank eligibility is replaced according to the smart-contract mechanism.'],
      ]}
      closing="Grow your network, contribute to the community and progress through the TitanX rank ecosystem."
    />
  );
}

export function UnityIncome() {
  return (
    <RankBlock
      id="unity"
      eyebrow="Unity Income"
      title="Grow Together with Unity Income"
      intro="Unity Income is a team-oriented income mechanism connected with rank achievement and team-business participation. It recognises community development and participation across the TitanX ecosystem."
      f4
      cards={[
        ['users', 'Team-Based Participation', 'Unity Income is associated with team-business development and the applicable rank structure.'],
        ['rank', 'Rank-Based Eligibility', 'Eligibility is determined by the highest achieved rank according to the smart-contract rules.'],
        ['swap', 'Automatic Replacement', 'Previous rank eligibility is automatically replaced when a higher eligible rank is achieved.'],
        ['fn', 'Smart Contract Distribution', "The Unity Income mechanism follows the project's defined smart-contract conditions."],
      ]}
      closing="Build a stronger community through collaboration, participation and shared growth."
    />
  );
}

/* ---------- single-leg income: 3D carousel ---------- */
const LEG = [
  ['The system recognises eligible upline members according to the defined network structure.', 'Upline Participation', '↑'],
  ["The income distribution mechanism also includes eligible downline members according to the project's rules.", 'Downline Distribution', '↓'],
  ['The structure encourages active participation and connections throughout the TitanX community.', 'Community Network', '⇄'],
  ['The highest achieved rank determines eligibility according to the smart-contract mechanism.', 'Automatic Replacement', '↻'],
  ['It connects members through a network-based distribution mechanism managed by the smart contract.', 'Smart Contract Managed', '◆'],
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
  const step = 360 / LEG.length;
  const front = ((i % LEG.length) + LEG.length) % LEG.length;

  const onTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (diff > 45) setI((v) => v + 1);
    else if (diff < -45) setI((v) => v - 1);
  };

  return (
    <section className="sec" id="single-leg" style={{ overflow: 'hidden' }}>
      <div className="wrap">
        <div className="sec-head" data-reveal="blur" style={{ marginInline: 'auto', textAlign: 'center', justifyItems: 'center' }}>
          <span className="eyebrow">Single-Leg Income</span>
          <h2>Single-Leg Income – Community Network</h2>
          <p>The Single-Leg Income mechanism is designed around an interconnected upline and downline community structure. It connects members through a network-based distribution mechanism managed by the smart contract.</p>
        </div>

        {/* Desktop 3D Ring Carousel */}
        <div className="carousel" data-reveal="zoom" onPointerEnter={() => (paused.current = true)} onPointerLeave={() => (paused.current = false)}>
          <div className="car-ring" style={{ transform: `translateZ(calc(var(--R) * -1)) rotateY(${-i * step}deg)` }}>
            {LEG.map((x, k) => (
              <figure key={k} className="quote" style={{ transform: `rotateY(${k * step}deg) translateZ(var(--R))`, opacity: front === k ? 1 : 0.45, margin: 0 }}>
                <p>{x[0]}</p>
                <figcaption className="who">
                  <span className="avatar">{x[2]}</span>
                  <div><b>{x[1]}</b><span>Single-Leg Income</span></div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        {/* Mobile Swipeable Card */}
        <div
          className="mob-voice-card"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="mob-voice-top">
            <span className="mob-voice-stars">{LEG[front][2]}</span>
            <span className="mob-voice-tag">SINGLE-LEG INCOME</span>
          </div>
          <p className="mob-voice-quote">{LEG[front][0]}</p>
          <div className="who">
            <span className="avatar">{LEG[front][2]}</span>
            <div>
              <b>{LEG[front][1]}</b>
              <span>Single-Leg Income</span>
            </div>
          </div>
          <div className="mob-voice-dots">
            {LEG.map((_, k) => (
              <button
                key={k}
                className={'mob-dot' + (front === k ? ' active' : '')}
                onClick={() => setI(k)}
                aria-label={LEG[k][1]}
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

        <p className="tx-foot-note tx-center" data-reveal="up">Be part of an interconnected digital community built around participation and decentralised technology.</p>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
const FAQS = [
  ['What is TitanX?', 'TitanX is a decentralised token project built around smart-contract technology, staking and a referral ecosystem.'],
  ['How can I access TitanX?', 'You can access the ecosystem through a compatible digital wallet and the available DApp.'],
  ['Which wallets are supported?', 'The project material mentions Trust Wallet, TokenPocket, SafePal and MetaMask.'],
  ['Does TitanX have an open-buy mechanism?', 'No. Tokens are created through the joining mechanism rather than an open-buy mechanism.'],
  ['What staking options are available?', 'TitanX provides Flexi and Regular staking options.'],
  ['What income categories are available?', 'The ecosystem includes Staking Rewards, Direct Income, Rank Income, Unity Income and Single-Leg Income.'],
  ['How does the referral programme work?', "Members can participate through referral connections according to the project's smart-contract rules."],
  ['How does token burning work?', "Token burning operates through the smart contract according to the project's defined mechanism."],
  ['How are income distributions managed?', 'Applicable income distributions follow the predefined smart-contract conditions.'],
  ['Are withdrawals available?', 'Withdrawals are processed according to the applicable smart-contract rules.'],
];

export function Faq() {
  return (
    <section className="sec sec-tight" id="faq">
      <div className="wrap">
        <div className="sec-head faq-head">
          <span className="eyebrow">FAQ</span>
          <h2>Frequently Asked Questions</h2>
          <p>Quick answers about the TitanX ecosystem.</p>
        </div>
        <div className="faq">
          {FAQS.map((f, k) => (
            <details key={k} className="faq-item">
              <summary>{f[0]}</summary>
              <p>{f[1]}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- closing CTA + footer ---------- */
export function CTA() {
  return (
    <section className="sec" id="start" style={{ paddingBottom: 0 }}>
      <div className="wrap">
        <div className="cta" data-reveal="rise">
          <span className="eyebrow">TitanX · Rule the Digital Era</span>
          <h2><span className="grad-text">Be Part of the TitanX Digital Revolution</span></h2>
          <p>Explore a decentralised ecosystem built around smart-contract technology, token participation, staking and community connections. Discover TitanX and become part of its growing digital community.</p>
          <div className="cta-actions">
            <Magnetic href="#overview" className="btn btn-primary">Explore TitanX <Arrow /></Magnetic>
            <Magnetic href="#join" className="btn btn-ghost">Join the Community</Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const cols = [
    ['Explore', [['Home', '#top'], ['About TitanX', '#overview'], ['Token Ecosystem', '#token']]],
    ['Ecosystem', [['Staking', '#staking'], ['Ecosystem Features', '#ecosystem'], ['Referral Programme', '#direct']]],
    ['More', [['Smart Contract', '#contract'], ['Wallets', '#wallets'], ['FAQ', '#faq']]],
  ];
  return (
    <footer>
      <div className="wrap">
        <div className="foot">
          <div className="about">
            <a href="#top" className="brand"><img src="/images/Titanx.jpeg" alt="TitanX Logo" className="brand-logo" />TITANX</a>
            <p>Rule the Digital Era. A decentralised token ecosystem focused on smart-contract technology, staking opportunities, transparent token mechanisms and community participation.</p>
          </div>
          {cols.map(([h, l]) => (
            <div key={h}>
              <h4>{h}</h4>
              <ul>{l.map(([t, href]) => <li key={t}><a href={href}>{t}</a></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="foot-bottom">
          <span className="status">Building a transparent and community-driven digital ecosystem.</span>
          <span>Presented by TitanX Team.</span>
        </div>
      </div>
    </footer>
  );
}
