"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const COLD = new THREE.Color("#ff3b5c");
const WARM = new THREE.Color("#ffb066");
const SOLID_COLD = new THREE.Color("#d4143c");
const SOLID_WARM = new THREE.Color("#ff8a3d");
const damp = THREE.MathUtils.damp;

// Corazón sólido extruido, con bisel y barniz brillante.
function SolidHeart({ show, happy }: { show: boolean; happy: boolean }) {
  const mesh = useRef<THREE.Mesh>(null!);
  const mat = useRef<THREE.MeshPhysicalMaterial>(null!);
  const vis = useRef(0);

  const geo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0.25, 0.25);
    s.bezierCurveTo(0.25, 0.25, 0.2, 0, 0, 0);
    s.bezierCurveTo(-0.3, 0, -0.3, 0.35, -0.3, 0.35);
    s.bezierCurveTo(-0.3, 0.55, -0.1, 0.77, 0.25, 0.95);
    s.bezierCurveTo(0.6, 0.77, 0.8, 0.55, 0.8, 0.35);
    s.bezierCurveTo(0.8, 0.35, 0.8, 0, 0.5, 0);
    s.bezierCurveTo(0.35, 0, 0.25, 0.25, 0.25, 0.25);
    const g = new THREE.ExtrudeGeometry(s, {
      depth: 0.25,
      bevelEnabled: true,
      bevelThickness: 0.14,
      bevelSize: 0.12,
      bevelSegments: 10,
      curveSegments: 40,
    });
    g.center();
    return g;
  }, []);

  useFrame((st, dt) => {
    const t = st.clock.elapsedTime;
    const rate = happy ? 4.2 : 2.2;
    const beat =
      Math.pow(Math.max(0, Math.sin(t * rate)), 8) * 0.09 +
      Math.pow(Math.max(0, Math.sin(t * rate - 0.8)), 8) * 0.05;
    vis.current = damp(vis.current, show ? 1 : 0, 4, dt);
    mesh.current.visible = vis.current > 0.01;
    mesh.current.scale.setScalar(3.1 * vis.current * (1 + beat));
    mesh.current.rotation.y = Math.sin(t * 0.55) * 0.55;
    mesh.current.rotation.z = Math.sin(t * 0.4) * 0.05;
    mat.current.color.lerp(happy ? SOLID_WARM : SOLID_COLD, Math.min(1, dt * 2));
  });

  return (
    <mesh ref={mesh} geometry={geo}>
      <meshPhysicalMaterial
        ref={mat}
        color={SOLID_COLD}
        emissive="#5c0a1e"
        emissiveIntensity={0.55}
        roughness={0.18}
        metalness={0.15}
        clearcoat={1}
        clearcoatRoughness={0.1}
      />
    </mesh>
  );
}

// Halo: ~7000 puntos siguiendo la ecuación paramétrica del corazón.
function HeartCloud({ hero, happy }: { hero: boolean; happy: boolean }) {
  const pts = useRef<THREE.Points>(null!);
  const mat = useRef<THREE.PointsMaterial>(null!);
  const base = useRef(1.25);

  const { pos, col } = useMemo(() => {
    const n = 7000;
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const t = Math.random() * Math.PI * 2;
      const s = Math.pow(Math.random(), 0.35);
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      const depth = (1 - s * s * 0.6) * (Math.random() - 0.5) * 2.4;
      pos.set([(hx * s) / 6, (hy * s) / 6 + 0.2, depth], i * 3);
      const b = 0.3 + 0.7 * s;
      col.set([b, b * 0.9, b * 0.95], i * 3);
    }
    return { pos, col };
  }, []);

  useFrame((s, dt) => {
    const t = s.clock.elapsedTime;
    const rate = happy ? 4.2 : 2.2;
    const beat =
      Math.pow(Math.max(0, Math.sin(t * rate)), 8) * 0.07 + Math.pow(Math.max(0, Math.sin(t * rate - 0.8)), 8) * 0.04;
    base.current = damp(base.current, hero ? 0.95 : 1.25, 3, dt);
    pts.current.scale.setScalar(base.current * (1 + beat));
    pts.current.rotation.y = Math.sin(t * (happy ? 0.6 : 0.25)) * 0.6;
    mat.current.color.lerp(happy ? WARM : COLD, Math.min(1, dt * 2));
  });

  return (
    <points ref={pts}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
        <bufferAttribute attach="attributes-color" args={[col, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={mat}
        size={0.035}
        sizeAttenuation
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// El conjunto sube en las pantallas "hero" y sigue al cursor (parallax) aunque la UI cubra el canvas.
function Stage({ hero, happy }: { hero: boolean; happy: boolean }) {
  const outer = useRef<THREE.Group>(null!);
  const inner = useRef<THREE.Group>(null!);
  const p = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  useEffect(() => {
    const f = (e: PointerEvent) => {
      p.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      p.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", f);
    return () => window.removeEventListener("pointermove", f);
  }, []);

  useFrame((_, dt) => {
    outer.current.scale.setScalar(Math.min(1, viewport.width / 6.5));
    outer.current.position.y = damp(outer.current.position.y, hero ? 1.2 : 0, 3, dt);
    inner.current.rotation.y = damp(inner.current.rotation.y, p.current.x * 0.4, 3, dt);
    inner.current.rotation.x = damp(inner.current.rotation.x, -p.current.y * 0.25, 3, dt);
  });

  return (
    <group ref={outer}>
      <group ref={inner}>
        <SolidHeart show={hero} happy={happy} />
        <HeartCloud hero={hero} happy={happy} />
        <Sparkles
          count={90}
          scale={[14, 9, 6]}
          size={3}
          speed={0.3}
          opacity={0.55}
          color={happy ? "#ffc78a" : "#ff8aa0"}
        />
      </group>
    </group>
  );
}

export default function Scene3D({ hero, happy }: { hero: boolean; happy: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 50 }}
      dpr={[1, 1.75]}
      gl={{ antialias: false, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#0a090c"]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[3, 3, 6]} intensity={90} color="#ff9ab0" />
      <pointLight position={[-4, -1, 5]} intensity={60} color="#9d6bff" />
      <pointLight position={[0, -3, 3]} intensity={30} color="#ffb066" />
      <Stage hero={hero} happy={happy} />
      <EffectComposer multisampling={0}>
        <Bloom intensity={happy ? 1.3 : 0.85} luminanceThreshold={0.2} luminanceSmoothing={0.4} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
