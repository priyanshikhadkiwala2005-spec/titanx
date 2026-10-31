import { useEffect, useRef } from 'react';
import * as THREE from 'three';

THREE.ColorManagement.enabled = false;

// Rough continent outlines as [lon, lat] — rasterised once into a land mask.
const LAND = [
  // North America
  [[-168, 66], [-162, 70], [-141, 70], [-125, 70], [-95, 72], [-82, 69], [-78, 62], [-94, 58], [-85, 55], [-80, 52], [-78, 58], [-70, 60], [-62, 57], [-56, 52], [-66, 45], [-70, 42], [-76, 36], [-81, 31], [-80, 25], [-83, 29], [-90, 30], [-97, 27], [-97, 21], [-90, 21], [-87, 21], [-88, 16], [-83, 10], [-77, 8], [-80, 7], [-86, 12], [-92, 15], [-105, 20], [-110, 24], [-112, 29], [-115, 30], [-110, 23], [-117, 32], [-121, 35], [-124, 40], [-124, 48], [-130, 55], [-140, 60], [-152, 59], [-158, 57], [-165, 60], [-166, 64]],
  // Greenland
  [[-73, 78], [-60, 82], [-30, 83], [-20, 78], [-22, 70], [-40, 65], [-44, 60], [-52, 64], [-55, 70], [-68, 76]],
  // South America
  [[-77, 8], [-72, 12], [-62, 10], [-52, 5], [-50, 0], [-44, -2], [-35, -6], [-39, -14], [-41, -22], [-48, -26], [-53, -34], [-58, -38], [-62, -40], [-65, -45], [-68, -50], [-69, -54], [-73, -52], [-75, -46], [-73, -37], [-71, -30], [-70, -18], [-76, -14], [-81, -6], [-80, -1], [-77, 3]],
  // Eurasia
  [[-9, 37], [-9, 43], [-1, 44], [-4, 48], [2, 51], [8, 54], [9, 57], [11, 54], [20, 54], [24, 58], [28, 60], [22, 64], [18, 60], [12, 56], [6, 58], [5, 62], [14, 68], [25, 71], [40, 68], [60, 70], [80, 73], [100, 77], [115, 73], [140, 72], [160, 70], [180, 68], [180, 65], [170, 60], [162, 58], [156, 51], [142, 52], [140, 46], [130, 42], [127, 38], [126, 35], [122, 40], [118, 38], [122, 31], [120, 25], [110, 20], [108, 15], [106, 10], [100, 13], [100, 5], [104, 1], [98, 8], [98, 16], [92, 22], [88, 22], [80, 15], [77, 8], [73, 17], [67, 24], [57, 26], [56, 27], [51, 30], [48, 30], [50, 26], [56, 24], [59, 22], [52, 16], [43, 13], [39, 21], [35, 28], [34, 31], [36, 36], [28, 36], [26, 40], [22, 37], [24, 40], [19, 41], [14, 45], [12, 44], [16, 40], [8, 44], [3, 43], [-1, 37]],
  // Africa
  [[-17, 21], [-16, 28], [-10, 32], [-6, 36], [10, 37], [11, 33], [20, 31], [32, 31], [34, 27], [38, 18], [43, 12], [51, 12], [45, 2], [40, -5], [40, -15], [35, -24], [32, -29], [27, -34], [20, -35], [17, -30], [12, -17], [13, -8], [9, -1], [9, 4], [4, 6], [-8, 4], [-14, 9], [-17, 14]],
  // Australia
  [[114, -22], [122, -18], [130, -12], [136, -12], [142, -11], [146, -19], [153, -26], [150, -37], [141, -38], [135, -34], [124, -33], [115, -34]],
  // British Isles
  [[-5, 50], [1, 51], [-2, 56], [-5, 58], [-6, 55]],
  // Madagascar
  [[44, -25], [48, -15], [50, -15], [47, -25]],
  // Sumatra
  [[95, 5], [98, 4], [106, -6], [102, -4]],
  // Borneo
  [[109, 1], [117, 7], [119, 1], [116, -4], [110, -3]],
  // Japan
  [[130, 31], [135, 34], [140, 36], [142, 40], [141, 45], [144, 43], [140, 35], [132, 33]],
];

function landMask() {
  const W = 360;
  const H = 180;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = '#fff';
  LAND.forEach((poly) => {
    g.beginPath();
    poly.forEach(([lo, la], i) => (i ? g.lineTo(lo + 180, 90 - la) : g.moveTo(lo + 180, 90 - la)));
    g.closePath();
    g.fill();
  });
  const d = g.getImageData(0, 0, W, H).data;
  return (lon, lat) => {
    const x = Math.min(W - 1, Math.max(0, Math.floor(lon + 180)));
    const y = Math.min(H - 1, Math.max(0, Math.floor(90 - lat)));
    return d[(y * W + x) * 4 + 3] > 127;
  };
}

function dotTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  r.addColorStop(0, 'rgba(255,255,255,1)');
  r.addColorStop(0.4, 'rgba(255,255,255,.9)');
  r.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = r;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

/** A plain dotted Earth that only rotates. */
export default function EarthSpin() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return; // no WebGL: hero still works without the globe
    }
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    const W = () => Math.max(1, el.clientWidth);
    const H = () => Math.max(1, el.clientHeight);
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setSize(W(), H(), false);
    renderer.domElement.style.cssText = 'width:100%;height:100%;display:block';
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const FOV = 36;
    const cam = new THREE.PerspectiveCamera(FOV, W() / H(), 0.1, 100);
    const R = 2;
    const fit = () => {
      cam.aspect = W() / H();
      const t = Math.tan((FOV * Math.PI) / 360);
      // keep the whole globe (plus glow) in view for any wrapper shape
      const need = R * 1.15;
      const zH = need / t;
      const zW = need / (t * cam.aspect);
      cam.position.set(0, 0, Math.max(zH, zW));
      cam.updateProjectionMatrix();
    };
    fit();

    const tex = dotTexture();
    const isLand = landMask();
    const world = new THREE.Group();
    world.rotation.z = 0.41; // axial tilt
    scene.add(world);
    const spin = new THREE.Group();
    world.add(spin);

    const small = W() < 500;
    const N = small ? 14000 : 24000;
    const pos = [];
    const col = [];
    const cA = new THREE.Color('#1f7bff');
    const cB = new THREE.Color('#27d6f5');
    const tmp = new THREE.Color();
    const gold = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = i * gold;
      const x = Math.cos(th) * r;
      const z = Math.sin(th) * r;
      // must match the sphere → lon/lat mapping below
      const lat = (Math.asin(y) * 180) / Math.PI;
      const lon = (Math.atan2(-z, x) * 180) / Math.PI;
      if (isLand(lon, lat)) {
        pos.push(x * R, y * R, z * R);
        tmp.copy(cA).lerp(cB, (y + 1) / 2);
        col.push(tmp.r, tmp.g, tmp.b);
      } else if (i % 5 === 0) {
        pos.push(x * R, y * R, z * R);
        col.push(0.1, 0.24, 0.5);
      }
    }
    const dg = new THREE.BufferGeometry();
    dg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    dg.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    spin.add(
      new THREE.Points(
        dg,
        new THREE.PointsMaterial({ size: small ? 0.075 : 0.062, map: tex, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
      )
    );
    // dark core so the far side doesn't show through
    spin.add(new THREE.Mesh(new THREE.SphereGeometry(R * 0.985, 64, 64), new THREE.MeshBasicMaterial({ color: 0x030c22 })));

    let visible = true;
    let raf;
    let last = performance.now();
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(el);
    const ro = new ResizeObserver(() => {
      renderer.setSize(W(), H(), false);
      fit();
    });
    ro.observe(el);

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible) return;
      spin.rotation.y += dt * 0.18;
      renderer.render(scene, cam);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      scene.traverse((o) => {
        o.geometry?.dispose?.();
        o.material?.dispose?.();
      });
      tex.dispose();
      renderer.dispose();
      el.innerHTML = '';
    };
  }, []);

  return <div className="earth-spin" ref={ref} aria-hidden="true" />;
}
