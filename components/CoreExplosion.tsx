import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CoreExplosionProps {
  zoomLevel: number;
  threshold?: number;
}

/**
 * Core Explosion Effect - Nổ tung khi zoom sâu vào lõi
 * Trigger khi zoomLevel <= threshold
 */
const CoreExplosion: React.FC<CoreExplosionProps> = ({ zoomLevel, threshold = 3 }) => {
  const particlesRef = useRef<THREE.Points>(null);
  const shockwaveRef = useRef<THREE.Mesh>(null);
  const [isExploding, setIsExploding] = useState(false);
  const explosionTime = useRef(0);
  const hasExploded = useRef(false);

  // Trigger explosion khi zoom đến threshold
  useEffect(() => {
    if (zoomLevel <= threshold && !hasExploded.current) {
      setIsExploding(true);
      hasExploded.current = true;
      explosionTime.current = 0;

      // Reset sau 3 giây
      setTimeout(() => {
        setIsExploding(false);
        hasExploded.current = false;
      }, 3000);
    } else if (zoomLevel > threshold + 2) {
      // Reset nếu zoom ra xa
      hasExploded.current = false;
      setIsExploding(false);
    }
  }, [zoomLevel, threshold]);

  // Explosion particles
  const { positions, colors, velocities } = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Start từ center
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;

      // Random velocity trong mọi hướng
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = 0.5 + Math.random() * 1.5;

      velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      velocities[i * 3 + 2] = Math.cos(phi) * speed;

      // Gradient colors: white -> gold -> red
      const t = Math.random();
      if (t < 0.3) {
        // White
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 1;
      } else if (t < 0.6) {
        // Gold
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.84;
        colors[i * 3 + 2] = 0;
      } else {
        // Red/Pink
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.2;
        colors[i * 3 + 2] = 0.4;
      }
    }

    return { positions, colors, velocities };
  }, []);

  useFrame((state, delta) => {
    if (!isExploding || !particlesRef.current) return;

    explosionTime.current += delta;
    const t = explosionTime.current;

    // Update particle positions
    const posArray = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const count = posArray.length / 3;

    for (let i = 0; i < count; i++) {
      // Apply velocity với gravity
      posArray[i * 3] += velocities[i * 3] * delta * 10;
      posArray[i * 3 + 1] += velocities[i * 3 + 1] * delta * 10 - delta * 2; // Gravity
      posArray[i * 3 + 2] += velocities[i * 3 + 2] * delta * 10;

      // Fade out với thời gian
      velocities[i * 3] *= 0.98;
      velocities[i * 3 + 1] *= 0.98;
      velocities[i * 3 + 2] *= 0.98;
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;

    // Update opacity
    const opacity = Math.max(0, 1 - t / 3);
    if (particlesRef.current.material) {
      (particlesRef.current.material as THREE.PointsMaterial).opacity = opacity;
    }

    // Shockwave expansion
    if (shockwaveRef.current) {
      const scale = 1 + t * 8;
      shockwaveRef.current.scale.setScalar(scale);
      const shockOpacity = Math.max(0, 1 - t / 1);
      (shockwaveRef.current.material as THREE.MeshBasicMaterial).opacity = shockOpacity;
    }
  });

  if (!isExploding) return null;

  return (
    <group>
      {/* Explosion Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.15}
          vertexColors
          transparent
          opacity={1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Shockwave Ring */}
      <mesh ref={shockwaveRef} position={[0, 0, 0]}>
        <ringGeometry args={[0.8, 1, 32]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={1}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Core Flash Light */}
      <pointLight intensity={50} distance={20} color="#ffffff" decay={2} />
    </group>
  );
};

export default CoreExplosion;
