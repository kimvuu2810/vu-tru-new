import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CoreExplosionProps {
  zoomLevel: number;
  threshold?: number;
  onExplode?: () => void;
}

/**
 * Epic Core Explosion Effect - Nổ tung EPIC khi đi vào trong lõi
 */
const CoreExplosion: React.FC<CoreExplosionProps> = ({ zoomLevel, threshold = 1, onExplode }) => {
  const mainParticlesRef = useRef<THREE.Points>(null);
  const trailParticlesRef = useRef<THREE.Points>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const [isExploding, setIsExploding] = useState(false);
  const explosionTime = useRef(0);
  const hasExploded = useRef(false);

  // Trigger explosion
  useEffect(() => {
    if (zoomLevel <= threshold && !hasExploded.current) {
      setIsExploding(true);
      hasExploded.current = true;
      explosionTime.current = 0;

      if (onExplode) onExplode();

      // Reset sau 5 giây
      setTimeout(() => {
        setIsExploding(false);
        hasExploded.current = false;
      }, 5000);
    } else if (zoomLevel > threshold + 3) {
      hasExploded.current = false;
      setIsExploding(false);
    }
  }, [zoomLevel, threshold, onExplode]);

  // Main explosion particles - 4000 particles
  const mainParticles = useMemo(() => {
    const count = 4000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Start từ center
      positions[i * 3] = (Math.random() - 0.5) * 0.5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;

      // Spherical explosion velocity
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = 2 + Math.random() * 3;

      velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      velocities[i * 3 + 2] = Math.cos(phi) * speed;

      // Gradient: white -> gold -> orange -> red
      const t = Math.random();
      if (t < 0.25) {
        // Pure white
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 1;
      } else if (t < 0.5) {
        // Gold
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.84;
        colors[i * 3 + 2] = 0.2;
      } else if (t < 0.75) {
        // Orange
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.5;
        colors[i * 3 + 2] = 0;
      } else {
        // Red/Pink
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.1;
        colors[i * 3 + 2] = 0.3;
      }

      sizes[i] = 0.1 + Math.random() * 0.3;
    }

    return { positions, colors, sizes, velocities };
  }, []);

  // Trail particles - 2000 smaller particles
  const trailParticles = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.3;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.3;

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = 1 + Math.random() * 2;

      velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      velocities[i * 3 + 2] = Math.cos(phi) * speed;

      // Softer colors for trails
      colors[i * 3] = 1;
      colors[i * 3 + 1] = 0.7 + Math.random() * 0.3;
      colors[i * 3 + 2] = 0.3 + Math.random() * 0.3;

      sizes[i] = 0.05 + Math.random() * 0.1;
    }

    return { positions, colors, sizes, velocities };
  }, []);

  useFrame((state, delta) => {
    if (!isExploding) return;

    explosionTime.current += delta;
    const t = explosionTime.current;

    // Main particles
    if (mainParticlesRef.current) {
      const posArray = mainParticlesRef.current.geometry.attributes.position.array as Float32Array;
      const sizeArray = mainParticlesRef.current.geometry.attributes.size.array as Float32Array;
      const count = posArray.length / 3;

      for (let i = 0; i < count; i++) {
        // Apply velocity với friction
        posArray[i * 3] += mainParticles.velocities[i * 3] * delta * 5;
        posArray[i * 3 + 1] += mainParticles.velocities[i * 3 + 1] * delta * 5;
        posArray[i * 3 + 2] += mainParticles.velocities[i * 3 + 2] * delta * 5;

        // Slow down
        mainParticles.velocities[i * 3] *= 0.97;
        mainParticles.velocities[i * 3 + 1] *= 0.97;
        mainParticles.velocities[i * 3 + 2] *= 0.97;

        // Size pulsing
        sizeArray[i] = mainParticles.sizes[i] * (1 + Math.sin(t * 3 + i) * 0.3);
      }

      mainParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      mainParticlesRef.current.geometry.attributes.size.needsUpdate = true;

      const opacity = Math.max(0, 1 - t / 4);
      (mainParticlesRef.current.material as THREE.PointsMaterial).opacity = opacity;
    }

    // Trail particles
    if (trailParticlesRef.current) {
      const posArray = trailParticlesRef.current.geometry.attributes.position.array as Float32Array;
      const count = posArray.length / 3;

      for (let i = 0; i < count; i++) {
        posArray[i * 3] += trailParticles.velocities[i * 3] * delta * 3;
        posArray[i * 3 + 1] += trailParticles.velocities[i * 3 + 1] * delta * 3;
        posArray[i * 3 + 2] += trailParticles.velocities[i * 3 + 2] * delta * 3;

        trailParticles.velocities[i * 3] *= 0.95;
        trailParticles.velocities[i * 3 + 1] *= 0.95;
        trailParticles.velocities[i * 3 + 2] *= 0.95;
      }

      trailParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      const opacity = Math.max(0, 1 - t / 3);
      (trailParticlesRef.current.material as THREE.PointsMaterial).opacity = opacity;
    }

    // Shockwave rings
    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring, index) => {
        const delay = index * 0.2;
        const ringT = Math.max(0, t - delay);
        const scale = 1 + ringT * 12;
        ring.scale.setScalar(scale);

        const opacity = Math.max(0, 1 - ringT / 2);
        (ring as THREE.Mesh).material = new THREE.MeshBasicMaterial({
          color: index === 0 ? '#ffffff' : index === 1 ? '#ffd700' : '#ff3366',
          transparent: true,
          opacity: opacity * 0.6,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
        });
      });
    }
  });

  if (!isExploding) return null;

  return (
    <group>
      {/* Main Explosion Particles */}
      <points ref={mainParticlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={mainParticles.positions.length / 3}
            array={mainParticles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={mainParticles.colors.length / 3}
            array={mainParticles.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={mainParticles.sizes.length}
            array={mainParticles.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={1}
          sizeAttenuation
          vertexColors
          transparent
          opacity={1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Trail Particles */}
      <points ref={trailParticlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={trailParticles.positions.length / 3}
            array={trailParticles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={trailParticles.colors.length / 3}
            array={trailParticles.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={trailParticles.sizes.length}
            array={trailParticles.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={1}
          sizeAttenuation
          vertexColors
          transparent
          opacity={1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Multiple Shockwave Rings */}
      <group ref={ringsRef}>
        <mesh position={[0, 0, 0]}>
          <ringGeometry args={[0.9, 1, 64]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <mesh position={[0, 0, 0.1]}>
          <ringGeometry args={[0.85, 0.95, 64]} />
          <meshBasicMaterial
            color="#ffd700"
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <mesh position={[0, 0, 0.2]}>
          <ringGeometry args={[0.8, 0.9, 64]} />
          <meshBasicMaterial
            color="#ff3366"
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* Central Flash Light */}
      <pointLight intensity={100} distance={30} color="#ffffff" decay={2} />
      <pointLight intensity={50} distance={20} color="#ffd700" decay={2} position={[0, 1, 0]} />
      <pointLight intensity={50} distance={20} color="#ff3366" decay={2} position={[0, -1, 0]} />
    </group>
  );
};

export default CoreExplosion;
