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

function Particles({ count = 260, color = '#A78BFA' }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.2 + Math.random() * 1.8;
      const t = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(t);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(t);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.04;
      ref.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color={color}
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function Core({ scrollRef, mouseRef, palette }) {
  const group = useRef();
  const inner = useRef();
  const ring  = useRef();

  useFrame((_, delta) => {
    const s = scrollRef.current ?? 0;
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;

    if (group.current) {
      // Strong scroll-driven rotation + idle drift
      group.current.rotation.y += delta * 0.12 + s * delta * 2.2;
      const targetX = s * Math.PI * 1.4 + my * 0.3;
      group.current.rotation.x += (targetX - group.current.rotation.x) * 0.06;
      group.current.rotation.z += (mx * 0.2 - group.current.rotation.z) * 0.06;
      // Scroll-driven scale pulse
      const sc = 1 + Math.sin(s * Math.PI) * 0.12;
      group.current.scale.setScalar(sc);
    }
    if (inner.current) {
      inner.current.rotation.y -= delta * 0.5;
      inner.current.rotation.z += delta * 0.25;
    }
    if (ring.current) ring.current.rotation.z += delta * 0.1;
  });

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshBasicMaterial color={palette.outer} wireframe transparent opacity={0.55}
          blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={inner} scale={0.6}>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshBasicMaterial color={palette.inner} wireframe transparent opacity={0.9}
          blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={ring} scale={2.0}>
        <torusGeometry args={[1, 0.006, 8, 110]} />
        <meshBasicMaterial color={palette.inner} transparent opacity={0.6}
          blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh scale={2.35} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[1, 0.004, 6, 110]} />
        <meshBasicMaterial color={palette.accent} transparent opacity={0.4}
          blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

export default function WireScene({ className = '', size = 'lg' }) {
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

  const palette = { outer: '#6E8BFF', inner: '#22D3EE', accent: '#A78BFA' };
  const camZ = size === 'sm' ? 4.8 : 4.0;

  return (
    <div className={className} onPointerMove={onMove} onPointerLeave={onLeave}>
      <Canvas
        dpr={[1, 1.7]}
        camera={{ position: [0, 0, camZ], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Core scrollRef={scrollRef} mouseRef={mouseRef} palette={palette} />
        <Particles count={size === 'sm' ? 160 : 260} />
      </Canvas>
    </div>
  );
}
