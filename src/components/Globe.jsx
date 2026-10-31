import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { REDUCE, clamp } from '../lib/utils';

THREE.ColorManagement.enabled = false;

const CITIES = [
  [19.07, 72.88], [50.11, 8.68], [-23.55, -46.63], [35.68, 139.69], [38.9, -77.04], [-33.87, 151.21], [-26.2, 28.05],
  [1.35, 103.82], [51.5, -0.12], [37.77, -122.42], [25.2, 55.27], [28.61, 77.2], [-34.6, -58.38], [45.5, -73.57],
];
const ARCS = [
  [0, 1], [0, 7], [1, 8], [8, 4], [4, 9], [9, 3], [3, 7], [7, 5], [2, 4], [6, 1], [10, 0], [10, 8], [11, 3], [12, 2], [13, 8], [11, 10],
];

function latLon(lat, lon, r) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const th = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th));
}

function dotTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  r.addColorStop(0, 'rgba(255,255,255,1)');
  r.addColorStop(0.35, 'rgba(255,255,255,.9)');
  r.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = r;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

export default function Globe() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return; // no WebGL: the hero still works without the globe
    }
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    const W = () => Math.max(1, el.clientWidth);
    const H = () => Math.max(1, el.clientHeight);
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setSize(W(), H(), false);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(38, W() / H(), 0.1, 100);
    cam.position.set(0, 0, 7.4);
    const R = 2;
    const tex = dotTexture();
    const world = new THREE.Group();
    world.rotation.z = 0.22;
    scene.add(world);
    const spin = new THREE.Group();
    world.add(spin);

    // continent-like dot field
    const small = W() < 500;
    const N = small ? 7000 : 12000;
    const pos = [];
    const col = [];
    const cA = new THREE.Color('#1f7bff');
    const cB = new THREE.Color('#27d6f5');
    const cC = new THREE.Color('#9af03c');
    const tmp = new THREE.Color();
    const land = (x, y, z) =>
      Math.sin(x * 3.1 + 1.7) * Math.sin(y * 2.6 + 0.4) * Math.cos(z * 2.2 - 1.1) +
      0.38 * Math.sin(x * 7.3 + y * 5.1 + z * 1.3) +
      0.22 * Math.cos(z * 6.7 - y * 4.2);
    const gold = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = i * gold;
      const x = Math.cos(th) * r;
      const z = Math.sin(th) * r;
      const v = land(x, y, z);
      if (v > 0.1) {
        pos.push(x * R, y * R, z * R);
        tmp.copy(cA).lerp(cB, clamp((y + 1) / 2, 0, 1));
        if (v > 0.55) tmp.lerp(cC, 0.35);
        col.push(tmp.r, tmp.g, tmp.b);
      } else if (Math.random() < 0.06) {
        pos.push(x * R, y * R, z * R);
        col.push(0.08, 0.2, 0.45);
      }
    }
    const dg = new THREE.BufferGeometry();
    dg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    dg.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    spin.add(
      new THREE.Points(
        dg,
        new THREE.PointsMaterial({ size: small ? 0.05 : 0.042, map: tex, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
      )
    );

    // core + atmosphere
    spin.add(new THREE.Mesh(new THREE.SphereGeometry(R * 0.985, 64, 64), new THREE.MeshBasicMaterial({ color: 0x030c22, transparent: true, opacity: 0.9 })));
    const atm = new THREE.Mesh(
      new THREE.SphereGeometry(R, 64, 64),
      new THREE.ShaderMaterial({
        vertexShader: 'varying vec3 vN;void main(){vN=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
        fragmentShader: 'varying vec3 vN;void main(){float i=pow(0.72-dot(vN,vec3(0.0,0.0,1.0)),3.2);gl_FragColor=vec4(0.12,0.55,1.0,1.0)*i;}',
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      })
    );
    atm.scale.setScalar(1.22);
    world.add(atm);
    spin.add(new THREE.Mesh(new THREE.SphereGeometry(R * 1.003, 48, 48), new THREE.MeshBasicMaterial({ color: 0x1f7bff, wireframe: true, transparent: true, opacity: 0.05 })));

    // city markers, arcs and travelling pulses
    const cityPos = [];
    CITIES.forEach(([la, lo]) => {
      const v = latLon(la, lo, R * 1.005);
      cityPos.push(v.x, v.y, v.z);
    });
    const cg = new THREE.BufferGeometry();
    cg.setAttribute('position', new THREE.Float32BufferAttribute(cityPos, 3));
    spin.add(new THREE.Points(cg, new THREE.PointsMaterial({ size: 0.16, map: tex, color: 0x9af03c, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })));

    const pulses = [];
    ARCS.forEach(([a, b], k) => {
      const va = latLon(CITIES[a][0], CITIES[a][1], R);
      const vb = latLon(CITIES[b][0], CITIES[b][1], R);
      const mid = va.clone().add(vb).multiplyScalar(0.5);
      mid.normalize().multiplyScalar(R + va.distanceTo(vb) * 0.42);
      const curve = new THREE.QuadraticBezierCurve3(va, mid, vb);
      const g = new THREE.BufferGeometry().setFromPoints(curve.getPoints(80));
      spin.add(new THREE.Line(g, new THREE.LineBasicMaterial({ color: k % 2 ? 0x27d6f5 : 0x9af03c, transparent: true, opacity: 0.32, blending: THREE.AdditiveBlending, depthWrite: false })));
      pulses.push({ curve, t: Math.random(), s: 0.0035 + Math.random() * 0.004 });
    });
    const pp = new Float32Array(pulses.length * 3);
    const pg = new THREE.BufferGeometry();
    pg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
    spin.add(new THREE.Points(pg, new THREE.PointsMaterial({ size: 0.14, map: tex, color: 0xffffff, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })));

    // gradient orbit ring + satellites
    const ringG = new THREE.Group();
    ringG.rotation.set(1.22, 0.18, -0.42);
    scene.add(ringG);
    const tg = new THREE.TorusGeometry(R * 1.52, 0.013, 8, 360);
    const tp = tg.attributes.position;
    const tc = [];
    for (let i = 0; i < tp.count; i++) {
      const a = (Math.atan2(tp.getY(i), tp.getX(i)) + Math.PI) / (Math.PI * 2);
      tmp.copy(a < 0.5 ? cA : cB).lerp(a < 0.5 ? cB : cC, a < 0.5 ? a * 2 : (a - 0.5) * 2);
      tc.push(tmp.r, tmp.g, tmp.b);
    }
    tg.setAttribute('color', new THREE.Float32BufferAttribute(tc, 3));
    ringG.add(new THREE.Mesh(tg, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending })));
    ringG.add(new THREE.Mesh(new THREE.TorusGeometry(R * 1.72, 0.004, 6, 300), new THREE.MeshBasicMaterial({ color: 0x27d6f5, transparent: true, opacity: 0.25 })));
    const sat = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, color: 0x9af03c, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    sat.scale.setScalar(0.38);
    ringG.add(sat);
    const sat2 = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, color: 0x27d6f5, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    sat2.scale.setScalar(0.26);
    ringG.add(sat2);

    // starfield
    const sp = [];
    for (let i = 0; i < 600; i++) {
      const v = new THREE.Vector3().randomDirection().multiplyScalar(9 + Math.random() * 8);
      sp.push(v.x, v.y, v.z);
    }
    const sg = new THREE.BufferGeometry();
    sg.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
    const stars = new THREE.Points(sg, new THREE.PointsMaterial({ size: 0.05, map: tex, color: 0x7fb2ff, transparent: true, opacity: 0.6, depthWrite: false }));
    scene.add(stars);

    let mx = 0, my = 0, tx = 0, ty = 0, visible = true, raf;
    const t0 = performance.now();
    const onMove = (e) => {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(el);
    const ro = new ResizeObserver(() => {
      renderer.setSize(W(), H(), false);
      cam.aspect = W() / H();
      cam.updateProjectionMatrix();
    });
    ro.observe(el);

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const t = (now - t0) / 1000;
      mx += (tx - mx) * 0.04;
      my += (ty - my) * 0.04;
      const s = clamp(window.scrollY / window.innerHeight, 0, 1.2);
      if (!REDUCE) spin.rotation.y = t * 0.09 + mx * 0.6;
      world.rotation.x = my * 0.35 + s * 0.25;
      ringG.rotation.z = -0.42 + (REDUCE ? 0 : t * 0.05);
      const a = REDUCE ? 0.8 : t * 0.55;
      sat.position.set(Math.cos(a) * R * 1.52, Math.sin(a) * R * 1.52, 0);
      const b = REDUCE ? 3 : -t * 0.32;
      sat2.position.set(Math.cos(b) * R * 1.72, Math.sin(b) * R * 1.72, 0);
      pulses.forEach((p, i) => {
        if (!REDUCE) {
          p.t += p.s;
          if (p.t > 1) p.t = 0;
        }
        const v = p.curve.getPoint(p.t);
        pp[i * 3] = v.x;
        pp[i * 3 + 1] = v.y;
        pp[i * 3 + 2] = v.z;
      });
      pg.attributes.position.needsUpdate = true;
      stars.rotation.y = t * 0.01;
      cam.position.z = 7.4 + s * 2.2;
      cam.position.x = mx * 0.4;
      cam.position.y = -my * 0.3 + s * 0.6;
      cam.lookAt(0, 0, 0);
      renderer.render(scene, cam);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
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

  return <div className="globe" ref={ref} aria-hidden="true" />;
}
