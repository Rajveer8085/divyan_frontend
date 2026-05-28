import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        setP(Math.min(1, window.scrollY / max));
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); };
  }, []);
  return p;
}

// Evenly-distributed points on a sphere (Fibonacci)
function fibonacciSphere(n, r) {
  const arr = new Float32Array(n * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = golden * i;
    arr[i * 3]     = Math.cos(theta) * radius * r;
    arr[i * 3 + 1] = y * r;
    arr[i * 3 + 2] = Math.sin(theta) * radius * r;
  }
  return arr;
}

function Satellite({ radius, speed, phase, color }) {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + phase;
    if (ref.current) {
      ref.current.position.set(Math.cos(t) * radius, Math.sin(t * 0.7) * radius * 0.25, Math.sin(t) * radius);
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.045, 12, 12]} />
      <meshBasicMaterial color={color} transparent opacity={0.95}
        blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

function Globe({ scrollRef, mouseRef }) {
  const group = useRef();
  const points = useMemo(() => fibonacciSphere(620, 1.5), []);

  useFrame((_, delta) => {
    const s = scrollRef.current ?? 0;
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    if (group.current) {
      group.current.rotation.y += delta * 0.1 + s * delta * 1.4;
      const tx = 0.3 + my * 0.25 + s * 0.5;
      group.current.rotation.x += (tx - group.current.rotation.x) * 0.05;
      group.current.rotation.z += (mx * 0.12 - group.current.rotation.z) * 0.05;
    }
  });

  return (
    <group ref={group} rotation={[0.3, 0, 0.08]}>
      {/* Globe grid */}
      <mesh>
        <sphereGeometry args={[1.5, 30, 18]} />
        <meshBasicMaterial color="#6E8BFF" wireframe transparent opacity={0.16}
          blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Surface nodes */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[points, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.035} color="#22D3EE" transparent opacity={0.9}
          sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>
      {/* Orbit rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={1.95}>
        <torusGeometry args={[1, 0.004, 8, 128]} />
        <meshBasicMaterial color="#A78BFA" transparent opacity={0.5}
          blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh rotation={[Math.PI / 2.4, 0.5, 0]} scale={2.25}>
        <torusGeometry args={[1, 0.003, 8, 128]} />
        <meshBasicMaterial color="#6E8BFF" transparent opacity={0.32}
          blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Orbiting satellites */}
      <Satellite radius={1.95} speed={0.6} phase={0}   color="#22D3EE" />
      <Satellite radius={2.25} speed={0.4} phase={2.1} color="#A78BFA" />
      <Satellite radius={1.95} speed={0.5} phase={4.0} color="#6E8BFF" />
    </group>
  );
}

export default function GlobeScene({ className = '' }) {
  const scrollRef = useRef(0);
  const progress = useScrollProgress();
  scrollRef.current = progress;

  const mouseRef = useRef({ x: 0, y: 0 });
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mouseRef.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    mouseRef.current.y = ((e.clientY - r.top) / r.height) * 2 - 1;
  };
  const onLeave = () => { mouseRef.current.x = 0; mouseRef.current.y = 0; };

  return (
    <div className={className} onPointerMove={onMove} onPointerLeave={onLeave}>
      <Canvas
        dpr={[1, 1.7]}
        camera={{ position: [0, 0, 4.6], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Globe scrollRef={scrollRef} mouseRef={mouseRef} />
      </Canvas>
    </div>
  );
}
