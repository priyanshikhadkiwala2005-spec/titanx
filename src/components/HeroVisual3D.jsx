import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { REDUCE, clamp } from '../lib/utils';

// Helper to create glowing radial sprite texture
function createGlowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.2, 'rgba(39, 214, 245, 0.9)');
  grad.addColorStop(0.5, 'rgba(31, 123, 255, 0.4)');
  grad.addColorStop(1, 'rgba(31, 123, 255, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

// Helper to create ring tick texture
function createRingTickTexture() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 32;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, 512, 32);
  for (let i = 0; i < 512; i += 8) {
    const isMajor = i % 32 === 0;
    ctx.fillStyle = isMajor ? 'rgba(39, 214, 245, 0.9)' : 'rgba(154, 240, 60, 0.5)';
    ctx.fillRect(i, isMajor ? 4 : 12, 2, isMajor ? 24 : 8);
  }
  return new THREE.CanvasTexture(c);
}

export default function HeroVisual() {
  const canvasContainerRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  const [mobTab, setMobTab] = useState('telemetry');
  const [latencyData, setLatencyData] = useState([
    { code: 'bom-1', city: 'Mumbai', ping: 8 },
    { code: 'fra-2', city: 'Frankfurt', ping: 11 },
    { code: 'sfo-1', city: 'San Francisco', ping: 5 },
    { code: 'nrt-1', city: 'Tokyo', ping: 14 },
  ]);

  // Mobile tab auto-cycler
  useEffect(() => {
    const t = setInterval(() => {
      setMobTab((tab) => (tab === 'telemetry' ? 'terminal' : 'telemetry'));
    }, 4500);
    return () => clearInterval(t);
  }, []);

  // Real-time jitter for live telemetry feel
  useEffect(() => {
    if (REDUCE) return;
    const interval = setInterval(() => {
      setLatencyData((prev) =>
        prev.map((item) => ({
          ...item,
          ping: Math.max(3, item.ping + (Math.random() > 0.5 ? 1 : -1) * (Math.random() > 0.7 ? 1 : 0)),
        }))
      );
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  // Terminal command cycler
  useEffect(() => {
    const t = setInterval(() => {
      setActiveStep((s) => (s + 1) % 4);
    }, 3200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const el = canvasContainerRef.current;
    if (!el) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      return;
    }

    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    const W = () => Math.max(1, el.clientWidth);
    const H = () => Math.max(1, el.clientHeight);
    renderer.setSize(W(), H(), false);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, W() / H(), 0.1, 100);
    camera.position.set(0, 0, 7.8);

    const glowTex = createGlowTexture();
    const tickTex = createRingTickTexture();

    // Primary Root Group
    const root = new THREE.Group();
    scene.add(root);

    // Color definitions
    const cBlue = new THREE.Color('#1f7bff');
    const cCyan = new THREE.Color('#27d6f5');
    const cLime = new THREE.Color('#9af03c');

    // 1. Central Holographic Core (Inner glowing geometric energy cage)
    const coreGroup = new THREE.Group();
    root.add(coreGroup);

    // Inner glowing energy sphere
    const energyGeo = new THREE.SphereGeometry(0.72, 32, 32);
    const energyMat = new THREE.MeshBasicMaterial({
      color: 0x1f7bff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const energySphere = new THREE.Mesh(energyGeo, energyMat);
    coreGroup.add(energySphere);

    // Inner bright point
    const coreSpriteMat = new THREE.SpriteMaterial({
      map: glowTex,
      color: 0x27d6f5,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.9,
    });
    const coreSprite = new THREE.Sprite(coreSpriteMat);
    coreSprite.scale.set(3.2, 3.2, 3.2);
    coreGroup.add(coreSprite);

    // Inner Faceted Polyhedron (Quantum Cage)
    const polyGeo = new THREE.IcosahedronGeometry(1.22, 1);
    const polyWireMat = new THREE.MeshBasicMaterial({
      color: 0x27d6f5,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const polyMesh = new THREE.Mesh(polyGeo, polyWireMat);
    coreGroup.add(polyMesh);

    // Polyhedron vertices as glowing data nodes
    const polyPos = polyGeo.attributes.position;
    const pPointsGeo = new THREE.BufferGeometry();
    const pPointsArray = [];
    for (let i = 0; i < polyPos.count; i++) {
      pPointsArray.push(polyPos.getX(i), polyPos.getY(i), polyPos.getZ(i));
    }
    pPointsGeo.setAttribute('position', new THREE.Float32BufferAttribute(pPointsArray, 3));
    const pPointsMat = new THREE.PointsMaterial({
      size: 0.12,
      map: glowTex,
      color: 0x9af03c,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    coreGroup.add(new THREE.Points(pPointsGeo, pPointsMat));

    // Outer Geometric Cage
    const outerCageGeo = new THREE.IcosahedronGeometry(1.85, 0);
    const outerCageMat = new THREE.MeshBasicMaterial({
      color: 0x1f7bff,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    });
    const outerCage = new THREE.Mesh(outerCageGeo, outerCageMat);
    coreGroup.add(outerCage);

    // 2. Futuristic Cyber Accelerator Rings
    const ringGroup = new THREE.Group();
    root.add(ringGroup);
    ringGroup.rotation.set(1.15, 0.25, -0.35);

    // Ring A: Inner neon data torus
    const ringAGeo = new THREE.TorusGeometry(2.1, 0.015, 8, 200);
    const ringAMat = new THREE.MeshBasicMaterial({
      color: 0x27d6f5,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const ringA = new THREE.Mesh(ringAGeo, ringAMat);
    ringGroup.add(ringA);

    // Ring B: Middle accented ring with gradient colors
    const ringBGeo = new THREE.TorusGeometry(2.55, 0.008, 6, 240);
    const ringBPos = ringBGeo.attributes.position;
    const ringBCol = [];
    for (let i = 0; i < ringBPos.count; i++) {
      const angle = (Math.atan2(ringBPos.getY(i), ringBPos.getX(i)) + Math.PI) / (Math.PI * 2);
      const c = angle < 0.5 ? cBlue.clone().lerp(cCyan, angle * 2) : cCyan.clone().lerp(cLime, (angle - 0.5) * 2);
      ringBCol.push(c.r, c.g, c.b);
    }
    ringBGeo.setAttribute('color', new THREE.Float32BufferAttribute(ringBCol, 3));
    const ringBMat = new THREE.MeshBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    const ringB = new THREE.Mesh(ringBGeo, ringBMat);
    ringGroup.add(ringB);

    // Ring C: Outer radar tick perimeter
    const ringCGeo = new THREE.RingGeometry(2.88, 2.94, 64);
    const ringCMat = new THREE.MeshBasicMaterial({
      color: 0x1f7bff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    });
    const ringC = new THREE.Mesh(ringCGeo, ringCMat);
    ringGroup.add(ringC);

    // Orbital Satellites / Edge Relays travelling on rings
    const satCount = 4;
    const satellites = [];
    for (let i = 0; i < satCount; i++) {
      const satSprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: glowTex,
          color: i % 2 === 0 ? 0x9af03c : 0x27d6f5,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      satSprite.scale.set(0.35, 0.35, 0.35);
      ringGroup.add(satSprite);
      satellites.push({
        sprite: satSprite,
        radius: i < 2 ? 2.1 : 2.55,
        speed: (0.35 + i * 0.15) * (i % 2 === 0 ? 1 : -1),
        phase: (i * Math.PI) / 2,
      });
    }

    // 3. Floating Global Edge Node Constellation with Laser Packet Arcs
    const nodeStations = [
      new THREE.Vector3(1.7, 1.4, 0.9),
      new THREE.Vector3(-1.9, 1.1, 0.8),
      new THREE.Vector3(2.1, -1.2, 0.6),
      new THREE.Vector3(-1.6, -1.5, 0.9),
      new THREE.Vector3(0.5, 2.2, -0.6),
      new THREE.Vector3(-0.8, -2.1, -0.7),
      new THREE.Vector3(2.3, 0.2, -1.0),
      new THREE.Vector3(-2.2, -0.3, -1.1),
    ];

    const nodeGroup = new THREE.Group();
    root.add(nodeGroup);

    // Render node sprites
    nodeStations.forEach((pos, idx) => {
      const s = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: glowTex,
          color: idx % 3 === 0 ? 0x9af03c : 0x27d6f5,
          transparent: true,
          blending: THREE.AdditiveBlending,
          opacity: 0.85,
        })
      );
      s.position.copy(pos);
      s.scale.set(0.24, 0.24, 0.24);
      nodeGroup.add(s);
    });

    // Dynamic laser arcs connecting core to outer nodes
    const laserArcs = [];
    nodeStations.forEach((pos, idx) => {
      const mid = pos.clone().multiplyScalar(0.5);
      mid.x += (Math.random() - 0.5) * 0.5;
      mid.y += (Math.random() - 0.5) * 0.5;
      mid.z += 0.4;
      const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, 0, 0), mid, pos);
      const points = curve.getPoints(36);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: idx % 2 === 0 ? 0x27d6f5 : 0x1f7bff,
        transparent: true,
        opacity: 0.28,
        blending: THREE.AdditiveBlending,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      nodeGroup.add(line);

      laserArcs.push({
        curve,
        progress: Math.random(),
        speed: 0.005 + Math.random() * 0.006,
      });
    });

    // Travelling photon pulses on the arcs
    const pulsePositions = new Float32Array(laserArcs.length * 3);
    const pulseGeo = new THREE.BufferGeometry();
    pulseGeo.setAttribute('position', new THREE.BufferAttribute(pulsePositions, 3));
    const pulseMat = new THREE.PointsMaterial({
      size: 0.16,
      map: glowTex,
      color: 0x9af03c,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const pulsePoints = new THREE.Points(pulseGeo, pulseMat);
    nodeGroup.add(pulsePoints);

    // 4. Ambient Cyber Starfield / Particle Cloud
    const particleCount = 420;
    const particlePos = [];
    const particleColors = [];
    for (let i = 0; i < particleCount; i++) {
      const p = new THREE.Vector3(
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 12
      );
      particlePos.push(p.x, p.y, p.z);
      const col = Math.random() > 0.6 ? cLime : Math.random() > 0.3 ? cCyan : cBlue;
      particleColors.push(col.r, col.g, col.b);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(particlePos, 3));
    starGeo.setAttribute('color', new THREE.Float32BufferAttribute(particleColors, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.045,
      map: glowTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Mouse and visibility handling
    let mx = 0, my = 0, tx = 0, ty = 0, visible = true, rafId;
    const t0 = performance.now();

    const onPointerMove = (e) => {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(el);

    const ro = new ResizeObserver(() => {
      renderer.setSize(W(), H(), false);
      camera.aspect = W() / H();
      camera.updateProjectionMatrix();
    });
    ro.observe(el);

    // Main render loop
    const animate = (now) => {
      rafId = requestAnimationFrame(animate);
      if (!visible) return;

      const elapsed = (now - t0) / 1000;
      mx += (tx - mx) * 0.045;
      my += (ty - my) * 0.045;

      const scrollOffset = clamp(window.scrollY / window.innerHeight, 0, 1.2);

      // Core rotations & gentle breath
      if (!REDUCE) {
        coreGroup.rotation.y = elapsed * 0.22 + mx * 0.5;
        coreGroup.rotation.x = Math.sin(elapsed * 0.4) * 0.15 + my * 0.4;
        outerCage.rotation.y = -elapsed * 0.16;
        outerCage.rotation.z = elapsed * 0.12;

        const pulse = 1 + Math.sin(elapsed * 2.8) * 0.04;
        energySphere.scale.set(pulse, pulse, pulse);
        coreSprite.scale.set(3.2 * pulse, 3.2 * pulse, 3.2 * pulse);

        // Ring rotations
        ringGroup.rotation.z = -0.35 + elapsed * 0.08;
        ringA.rotation.z = elapsed * 0.15;
        ringB.rotation.z = -elapsed * 0.25;

        // Satellites orbiting
        satellites.forEach((sat) => {
          const angle = sat.phase + elapsed * sat.speed;
          sat.sprite.position.set(Math.cos(angle) * sat.radius, Math.sin(angle) * sat.radius, 0);
        });

        // Laser pulse travel
        laserArcs.forEach((arc, i) => {
          arc.progress += arc.speed;
          if (arc.progress > 1) arc.progress = 0;
          const pt = arc.curve.getPoint(arc.progress);
          pulsePositions[i * 3] = pt.x;
          pulsePositions[i * 3 + 1] = pt.y;
          pulsePositions[i * 3 + 2] = pt.z;
        });
        pulseGeo.attributes.position.needsUpdate = true;

        // Starfield drift
        stars.rotation.y = elapsed * 0.015;
      }

      // Parallax camera framing
      camera.position.x = mx * 0.6;
      camera.position.y = -my * 0.5 + scrollOffset * 0.4;
      camera.position.z = 7.8 + scrollOffset * 1.8;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      io.disconnect();
      ro.disconnect();

      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose());
          else o.material.dispose();
        }
      });
      glowTex.dispose();
      tickTex.dispose();
      renderer.dispose();
      el.innerHTML = '';
    };
  }, []);

  const terminalSteps = [
    { cmd: 'titanx deploy --production', status: 'Propagating edge isolates across 310 PoPs...', badge: 'BUILDING', time: '1.2s' },
    { cmd: 'titanx route verify', status: 'TLS 1.3 handshake verified · 0 cold starts', badge: 'OPTIMIZED', time: '< 2ms' },
    { cmd: 'titanx sync --kv-global', status: 'Global state synced across all continents', badge: 'REPLICATED', time: '41ms' },
    { cmd: 'titanx live:observability', status: 'Ingesting 4.82M req/sec at edge boundaries', badge: 'LIVE 200 OK', time: '99.999%' },
  ];

  const currentTerm = terminalSteps[activeStep];

  return (
    <div className="hero-visual-container">
      {/* 3D Three.js WebGL Canvas */}
      <div className="hero-visual-canvas" ref={canvasContainerRef} aria-hidden="true" />

      {/* Mobile Interactive Tab Switcher */}
      <div className="mob-hud-switcher">
        <button
          className={'mob-hud-btn' + (mobTab === 'telemetry' ? ' active' : '')}
          onClick={() => setMobTab('telemetry')}
        >
          <span className="live-dot" /> Live Telemetry
        </button>
        <button
          className={'mob-hud-btn' + (mobTab === 'terminal' ? ' active' : '')}
          onClick={() => setMobTab('terminal')}
        >
          <span className="term-ico">$</span> Deploy Log
        </button>
      </div>

      {/* Floating Glassmorphism HUD Card 1: Edge Terminal */}
      <div className={`edge-hud hud-terminal ${mobTab === 'terminal' ? 'mob-active' : ''}`}>
        <div className="hud-header">
          <div className="hud-dots">
            <span className="dot dot-red" />
            <span className="dot dot-yellow" />
            <span className="dot dot-green" />
          </div>
          <span className="hud-title">titanx-edge-worker · prod</span>
          <span className="hud-badge pulse-badge">{currentTerm.badge}</span>
        </div>
        <div className="hud-body">
          <div className="term-line">
            <span className="term-prompt">$</span>
            <span className="term-cmd">{currentTerm.cmd}</span>
          </div>
          <div className="term-output">
            <span className="term-check">✔</span>
            <span className="term-text">{currentTerm.status}</span>
          </div>
          <div className="term-footer">
            <span className="term-metric">Latency: <i>{currentTerm.time}</i></span>
            <span className="term-url">edge.titanx.sh</span>
          </div>
        </div>
      </div>

      {/* Floating Glassmorphism HUD Card 2: Global Latency Matrix */}
      <div className={`edge-hud hud-telemetry ${mobTab === 'telemetry' ? 'mob-active' : ''}`}>
        <div className="hud-header">
          <div className="hud-live-tag">
            <span className="live-dot" />
            <span>GLOBAL EDGE ROUTING</span>
          </div>
          <span className="hud-nodes">310 CITIES</span>
        </div>
        <div className="telemetry-list">
          {latencyData.map((node) => (
            <div key={node.code} className="telemetry-item">
              <span className="node-info">
                <b className="node-code">{node.code}</b>
                <span className="node-city">{node.city}</span>
              </span>
              <div className="node-bars">
                <span className="bar bar-1" />
                <span className="bar bar-2" />
                <span className="bar bar-3" />
              </div>
              <span className="node-ping">{node.ping} ms</span>
            </div>
          ))}
        </div>
        <div className="telemetry-footer">
          <span className="pulse-text">⚡ Zero cold starts</span>
          <span className="p50-text">Global p50: <b>9.2 ms</b></span>
        </div>
      </div>

      {/* Floating Accent Badge: High Throughput */}
      <div className="edge-hud hud-pill">
        <span className="pill-dot" />
        <span className="pill-val">120 Tbps</span>
        <span className="pill-sep">/</span>
        <span className="pill-lbl">Zero-Trust Network</span>
      </div>
    </div>
  );
}
