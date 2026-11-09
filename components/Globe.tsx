"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { SPOKES } from "@/lib/constants";

const RADIUS = 1.6;

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
      SPOKES.map((s) => {
        const { lat, lon } = latLonFromAngle(s.angle);
        return { ...s, pos: pointOnSphere(lat, lon, RADIUS * 1.01) };
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

function ContourLines() {
  const rings = useMemo(() => {
    const out: { radius: number; rotX: number; rotY: number }[] = [];
    for (let i = 0; i < 6; i++) {
      out.push({
        radius: RADIUS * (0.3 + (i / 6) * 0.68),
        rotX: (i * 37 * Math.PI) / 180,
        rotY: (i * 61 * Math.PI) / 180,
      });
    }
    return out;
  }, []);

  return (
    <group>
      {rings.map((r, i) => (
        <mesh key={i} rotation={[r.rotX, r.rotY, 0]}>
          <torusGeometry args={[r.radius, 0.002, 8, 64]} />
          <meshBasicMaterial color="#E0C9A6" transparent opacity={0.28} />
        </mesh>
      ))}
    </group>
  );
}

function SpinningGlobe() {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.08;
  });

  return (
    <group ref={group}>
      {/* Core sphere */}
      <mesh>
        <sphereGeometry args={[RADIUS, 64, 64]} />
        <meshStandardMaterial color="#1c1611" roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Tight additive rim glow — kept faint per the "not an ugly ring" lesson */}
      <mesh scale={1.06}>
        <sphereGeometry args={[RADIUS, 64, 64]} />
        <meshBasicMaterial
          color="#C0532E"
          transparent
          opacity={0.16}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <ContourLines />
      <Markers />
    </group>
  );
}

export default function Globe() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.4], fov: 42 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.35} color="#F7F2EA" />
      <directionalLight position={[3, 2, 3]} intensity={1.4} color="#E8A23D" />
      <directionalLight position={[-3, -1, -2]} intensity={0.3} color="#2E6E5B" />
      <SpinningGlobe />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        rotateSpeed={0.35}
        minPolarAngle={Math.PI / 2 - 0.6}
        maxPolarAngle={Math.PI / 2 + 0.6}
      />
    </Canvas>
  );
}
