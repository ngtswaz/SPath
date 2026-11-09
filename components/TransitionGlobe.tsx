"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SpinningGlobe } from "./Globe";

/**
 * Orbits the camera around the globe for the duration of a page transition
 * — the globe itself never moves or resizes, only the vantage point does.
 * That's what actually reads as "the camera swinging around it" rather than
 * the globe sliding across the screen. Direction (left vs right) is chosen
 * per-transition by the caller so it doesn't feel mechanically identical
 * every time.
 *
 * Progress is measured from wall-clock time (performance.now()), not
 * accumulated per-frame `delta` — under frame-rate throttling (seen in
 * testing: a busy main thread during a route change can starve rAF for a
 * stretch), summing small deltas compounds any drift and a dropped/delayed
 * frame just means the swing quietly runs long. Wall-clock elapsed time
 * means whatever frame actually fires always lands at the *correct*
 * position for how much real time has passed, so the swing self-corrects
 * instead of drifting.
 */
function SwingCamera({
  duration = 0.85,
  reverse = false,
  onDone,
}: {
  duration?: number;
  reverse?: boolean;
  onDone?: () => void;
}) {
  const startTime = useRef<number | null>(null);
  const finished = useRef(false);

  useFrame((state) => {
    if (startTime.current === null) startTime.current = performance.now();
    const elapsedSec = (performance.now() - startTime.current) / 1000;
    const t = Math.min(elapsedSec / duration, 1);

    // ease-in-out so the swing doesn't snap to a stop at either end
    const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const sweepDeg = 100; // total arc covered over the full swing
    const startDeg = reverse ? 30 : -70;
    const dir = reverse ? -1 : 1;
    const angle = THREE.MathUtils.degToRad(startDeg + eased * sweepDeg * dir);

    const radius = 4.4;
    state.camera.position.set(Math.sin(angle) * radius, 0.35, Math.cos(angle) * radius);
    state.camera.lookAt(0, 0, 0);

    if (t >= 1 && !finished.current) {
      finished.current = true;
      onDone?.();
    }
  });

  return null;
}

/**
 * The connective-tissue globe used between page transitions (see
 * PathTransition). Deliberately the same body as the hero's Globe — same
 * sphere, graticule, markers, idle rotation, imported directly rather than
 * duplicated — with no OrbitControls (nothing to drag mid-transition) and a
 * transparent background (`alpha: true`), so the destination page is
 * visible the whole time and the globe is the only thing actually moving.
 */
export default function TransitionGlobe({
  reverse = false,
  onDone,
}: {
  reverse?: boolean;
  onDone?: () => void;
}) {
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
      <SwingCamera reverse={reverse} onDone={onDone} />
    </Canvas>
  );
}
