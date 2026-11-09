"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const RADIUS = 1.6;

// Four fixed points around the equator, purely decorative — this used to
// mark the marketing site's four spoke pages; now it's just the globe's
// own visual rhythm, with no routes behind it.
const MARKER_ANGLES = [310, 40, 140, 220];

function latLonFromAngle(angleDeg: number) {
  // Spread the four spokes around the equator band, with a little
  // latitude variance so they don't read as four dots in a flat ring.
  const lon = (angleDeg * Math.PI) / 180;
  const lat = ((angleDeg % 53) - 20) * (Math.PI / 180) * 0.35;
  return { lat, lon };
}

function pointOnSphere(lat: number, lon: number, r = RADIUS) {
  const x = r * Math.cos(lat) * Math.sin(lon);
  const y = r * Math.sin(lat);
  const z = r * Math.cos(lat) * Math.cos(lon);
  return new THREE.Vector3(x, y, z);
}

function Markers() {
  const points = useMemo(
    () =>
      MARKER_ANGLES.map((angle) => {
        const { lat, lon } = latLonFromAngle(angle);
        return { key: angle, pos: pointOnSphere(lat, lon, RADIUS * 1.01) };
      }),
    []
  );

  const arcs = useMemo(() => {
    const curves: THREE.Vector3[][] = [];
    for (let i = 0; i < points.length; i++) {
      const a = points[i].pos;
      const b = points[(i + 1) % points.length].pos;
      const mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(RADIUS * 1.32);
      const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
      curves.push(curve.getPoints(32));
    }
    return curves;
  }, [points]);

  return (
    <group>
      {arcs.map((pts, i) => {
        const geometry = new THREE.BufferGeometry().setFromPoints(pts);
        return (
          <primitive
            key={i}
            object={
              new THREE.Line(
                geometry,
                new THREE.LineBasicMaterial({
                  color: "#E8A23D",
                  transparent: true,
                  opacity: 0.55,
                })
              )
            }
          />
        );
      })}
      {points.map((p) => (
        <mesh key={p.key} position={p.pos}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshStandardMaterial
            color="#E8A23D"
            emissive="#E8A23D"
            emissiveIntensity={1.4}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * A real lat/lon graticule (meridians + parallels), not randomly-rotated
 * rings — the random rings read as scattered flat portals instead of a
 * sphere. A proper grid is what makes a stylized globe actually look like
 * a globe at a glance, even with zero landmass texture.
 */
function Graticule() {
  const lineR = RADIUS * 1.003;

  const meridians = useMemo(() => {
    const count = 7;
    const lines: THREE.Vector3[][] = [];
    for (let i = 0; i < count; i++) {
      const lon = (i / count) * Math.PI * 2;
      const pts: THREE.Vector3[] = [];
      for (let j = 0; j <= 48; j++) {
        const lat = -Math.PI / 2 + (j / 48) * Math.PI;
        pts.push(pointOnSphere(lat, lon, lineR));
      }
      lines.push(pts);
    }
    return lines;
  }, []);

  const parallels = useMemo(() => {
    const steps = 6;
    const lines: THREE.Vector3[][] = [];
    for (let i = 1; i < steps; i++) {
      const lat = -Math.PI / 2 + (i / steps) * Math.PI;
      const pts: THREE.Vector3[] = [];
      for (let j = 0; j <= 64; j++) {
        const lon = (j / 64) * Math.PI * 2;
        pts.push(pointOnSphere(lat, lon, lineR));
      }
      lines.push(pts);
    }
    return lines;
  }, []);

  const allLines = useMemo(() => [...meridians, ...parallels], [meridians, parallels]);

  return (
    <group>
      {allLines.map((pts, i) => {
        const geometry = new THREE.BufferGeometry().setFromPoints(pts);
        return (
          <primitive
            key={i}
            object={
              new THREE.Line(
                geometry,
                new THREE.LineBasicMaterial({ color: "#E8DCC4", transparent: true, opacity: 0.55 })
              )
            }
          />
        );
      })}
    </group>
  );
}

// Exported so TransitionGlobe can reuse the exact same body (sphere,
// graticule, rim glow, markers, idle spin) instead of a separate lookalike
// copy — the two had quietly drifted apart (radius, line opacity), which
// read as "not really the same globe" during page transitions.
export function SpinningGlobe() {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.08;
  });

  return (
    <group ref={group}>
      {/* Core sphere — a touch warmer than near-black so the amber key light
          actually reads on it, instead of the sphere looking flat and dead */}
      <mesh>
        <sphereGeometry args={[RADIUS, 64, 64]} />
        <meshStandardMaterial color="#231b14" roughness={0.8} metalness={0.08} />
      </mesh>

      {/* Tight additive rim glow — kept faint per the "not an ugly ring" lesson.
          Scale trimmed closer to 1 so it reads as a glow, not a drawn ring. */}
      <mesh scale={1.025}>
        <sphereGeometry args={[RADIUS, 64, 64]} />
        <meshBasicMaterial
          color="#C0532E"
          transparent
          opacity={0.22}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <Graticule />
      <Markers />
    </group>
  );
}

export default function Globe() {
  // three.js's OrbitControls imperatively sets `domElement.style.touchAction
  // = "none"` the moment it connects, to read raw drag gestures for
  // rotation — it does this unconditionally, so a Canvas `style` prop can't
  // override it, and it doesn't check enableRotate/Pan/Zoom first. On a
  // phone the globe covers nearly the full hero width, so that silently
  // swallowed every swipe there and trapped mobile visitors who couldn't
  // scroll past it. The globe already auto-rotates on its own (see
  // SpinningGlobe's useFrame below), so drag-to-look is a nice-to-have for
  // a mouse, not something touch users were relying on — only mount
  // OrbitControls for fine-pointer (mouse/trackpad) devices, so touch
  // devices never trigger the lock and native scroll always works there.
  const [allowDrag, setAllowDrag] = useState(false);

  useEffect(() => {
    try {
      setAllowDrag(window.matchMedia("(pointer: fine)").matches);
    } catch {
      setAllowDrag(false);
    }
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 4.4], fov: 42 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.42} color="#F7F2EA" />
      <directionalLight position={[3, 2, 3]} intensity={1.6} color="#E8A23D" />
      <directionalLight position={[-3, -1, -2]} intensity={0.35} color="#2E6E5B" />
      <SpinningGlobe />
      {allowDrag && (
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          rotateSpeed={0.35}
          minPolarAngle={Math.PI / 2 - 0.6}
          maxPolarAngle={Math.PI / 2 + 0.6}
        />
      )}
    </Canvas>
  );
}
