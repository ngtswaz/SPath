"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const RADIUS = 1.5;

function pointOnSphere(lat: number, lon: number, r = RADIUS) {
  const x = r * Math.cos(lat) * Math.sin(lon);
  const y = r * Math.sin(lat);
  const z = r * Math.cos(lat) * Math.cos(lon);
  return new THREE.Vector3(x, y, z);
}

function Graticule() {
  const lineR = RADIUS * 1.003;

  const lines = useMemo(() => {
    const out: THREE.Vector3[][] = [];
    for (let i = 0; i < 6; i++) {
      const lon = (i / 6) * Math.PI * 2;
      const pts: THREE.Vector3[] = [];
      for (let j = 0; j <= 32; j++) {
        const lat = -Math.PI / 2 + (j / 32) * Math.PI;
        pts.push(pointOnSphere(lat, lon, lineR));
      }
      out.push(pts);
    }
    for (let i = 1; i < 5; i++) {
      const lat = -Math.PI / 2 + (i / 5) * Math.PI;
      const pts: THREE.Vector3[] = [];
      for (let j = 0; j <= 48; j++) {
        const lon = (j / 48) * Math.PI * 2;
        pts.push(pointOnSphere(lat, lon, lineR));
      }
      out.push(pts);
    }
    return out;
  }, []);

  return (
    <group>
      {lines.map((pts, i) => {
        const geometry = new THREE.BufferGeometry().setFromPoints(pts);
        return (
          <primitive
            key={i}
            object={
              new THREE.Line(
                geometry,
                new THREE.LineBasicMaterial({ color: "#E8DCC4", transparent: true, opacity: 0.6 })
              )
            }
          />
        );
      })}
    </group>
  );
}

function SpinningBody() {
  const group = useRef<THREE.Group>(null);

  // Spins much faster than the hero's idle globe (0.08/s) — this is on
  // screen for under a second, so it needs to visibly be in motion the
  // instant it appears, not just getting started.
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 1.1;
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[RADIUS, 48, 48]} />
        <meshStandardMaterial color="#231b14" roughness={0.8} metalness={0.08} />
      </mesh>
      <mesh scale={1.03}>
        <sphereGeometry args={[RADIUS, 48, 48]} />
        <meshBasicMaterial
          color="#C0532E"
          transparent
          opacity={0.28}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <Graticule />
    </group>
  );
}

/**
 * A lean, non-interactive globe used purely as the connective flourish
 * between pages (see PathTransition). Deliberately no OrbitControls — it's
 * on screen for well under a second and never needs to be draggable, which
 * also means it can never trip the touch-action/scroll-trap bug the hero's
 * interactive globe had to be fixed for.
 */
export default function TransitionGlobe({ onReady }: { onReady?: () => void }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.2], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      onCreated={() => {
        // onCreated fires once the renderer/scene/camera exist, which is
        // still slightly ahead of the first frame actually being composited
        // to screen — wait one more paint tick before telling the caller
        // it's safe to reveal, so nothing gates visibility on an empty
        // canvas. See PathTransition for why this matters: a fixed-delay
        // guess (how long WebGL init "usually" takes) measured ~65-85ms on
        // one machine but still left a real gap on a slower/colder run, so
        // the overlay now waits on this signal instead of a timer.
        requestAnimationFrame(() => onReady?.());
      }}
    >
      <ambientLight intensity={0.5} color="#F7F2EA" />
      <directionalLight position={[3, 2, 3]} intensity={1.7} color="#E8A23D" />
      <directionalLight position={[-3, -1, -2]} intensity={0.4} color="#2E6E5B" />
      <SpinningBody />
    </Canvas>
  );
}
