"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";

const COLD = new THREE.Color("#ff2e88");
const WARM = new THREE.Color("#ffb454");
const COLD_CORE = new THREE.Color("#7a1048");
const WARM_CORE = new THREE.Color("#ff7a3d");

function Galaxy({ happy }: { happy: boolean }) {
  const pts = useRef<THREE.Points>(null!);
  const mat = useRef<THREE.PointsMaterial>(null!);
  const speed = useRef(0.06);

  const { positions, colors } = useMemo(() => {
    const n = 9000;
    const positions = new Float32Array(n * 3);
    const colors = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = Math.pow(Math.random(), 1.5) * 7;
      const angle = ((i % 3) / 3) * Math.PI * 2 + r * 0.9;
      const jitter = () => (Math.random() - 0.5) * Math.pow(Math.random(), 2) * 1.6;
      positions[i * 3] = Math.cos(angle) * r + jitter();
      positions[i * 3 + 1] = jitter() * 0.6;
      positions[i * 3 + 2] = Math.sin(angle) * r + jitter();
      const b = 1 - (r / 7) * 0.65;
      colors.set([b, b, b], i * 3);
    }
    return { positions, colors };
  }, []);

  useFrame((_, dt) => {
    speed.current = THREE.MathUtils.damp(speed.current, happy ? 0.7 : 0.06, 1.5, dt);
    pts.current.rotation.y += dt * speed.current;
    mat.current.color.lerp(happy ? WARM : COLD, 0.04);
  });

  return (
    <points ref={pts} rotation={[0.45, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={mat}
        size={0.045}
        sizeAttenuation
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Crystal({ happy }: { happy: boolean }) {
  const mesh = useRef<THREE.Mesh>(null!);
  const mat = useRef<THREE.MeshPhysicalMaterial>(null!);

  useFrame((s, dt) => {
    const t = s.clock.elapsedTime;
    const rate = happy ? 5 : 2.6;
    // doble latido tipo "lub-dub"
    const beat =
      Math.pow(Math.max(0, Math.sin(t * rate)), 6) * 0.12 +
      Math.pow(Math.max(0, Math.sin(t * rate - 0.7)), 6) * 0.07;
    mesh.current.scale.setScalar(1 + beat);
    mesh.current.rotation.y += dt * (happy ? 0.9 : 0.25);
    mesh.current.rotation.x += dt * 0.1;
    mat.current.color.lerp(happy ? WARM : COLD, 0.04);
    mat.current.emissive.lerp(happy ? WARM_CORE : COLD_CORE, 0.04);
  });

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.1, 1]} />
      <meshPhysicalMaterial
        ref={mat}
        color={COLD}
        emissive={COLD_CORE}
        emissiveIntensity={0.9}
        metalness={0.25}
        roughness={0.08}
        clearcoat={1}
        clearcoatRoughness={0.05}
        iridescence={1}
        flatShading
      />
    </mesh>
  );
}

function Rig({ children }: { children: ReactNode }) {
  const g = useRef<THREE.Group>(null!);
  useFrame((s, dt) => {
    g.current.rotation.x = THREE.MathUtils.damp(g.current.rotation.x, -s.pointer.y * 0.35, 3, dt);
    g.current.rotation.y = THREE.MathUtils.damp(g.current.rotation.y, s.pointer.x * 0.5, 3, dt);
  });
  return <group ref={g}>{children}</group>;
}

export default function Scene3D({ happy }: { happy: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 2.4, 8.5], fov: 55 }}
      dpr={[1, 2]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#14040f"]} />
      <fog attach="fog" args={["#14040f", 9, 20]} />
      <ambientLight intensity={0.35} />
      <pointLight position={[4, 3, 4]} intensity={60} color="#ff4d9d" />
      <pointLight position={[-5, -2, 3]} intensity={40} color="#8a5cff" />
      <Rig>
        <Galaxy happy={happy} />
        <Crystal happy={happy} />
      </Rig>
    </Canvas>
  );
}
