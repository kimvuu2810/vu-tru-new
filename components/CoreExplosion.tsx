import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CoreExplosionProps {
  zoomLevel: number;
  threshold?: number;
  onExplode?: () => void;
}

/**
 * BIG BANG - Vụ nổ tạo vũ trụ sơ khai
 * Toàn bộ màn hình tràn ngập particles tự do
 */
const CoreExplosion: React.FC<CoreExplosionProps> = ({ zoomLevel, threshold = -5, onExplode }) => {
  const mainParticlesRef = useRef<THREE.Points>(null);
  const trailParticlesRef = useRef<THREE.Points>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const [isExploding, setIsExploding] = useState(false);
  const explosionTime = useRef(0);
  const hasExploded = useRef(false);

  // Trigger BIG BANG explosion
  useEffect(() => {
    if (zoomLevel <= threshold && !hasExploded.current) {
      setIsExploding(true);
      hasExploded.current = true;
      explosionTime.current = 0;

      if (onExplode) onExplode();

      // Keep particles visible much longer (10 seconds)
      setTimeout(() => {
        setIsExploding(false);
        hasExploded.current = false;
      }, 10000);
    } else if (zoomLevel > threshold + 5) {
      hasExploded.current = false;
      setIsExploding(false);
    }
  }, [zoomLevel, threshold, onExplode]);

  // BIG BANG - 8000 particles tràn ngập màn hình
  const mainParticles = useMemo(() => {
    const count = 8000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Start from center point
      positions[i * 3] = (Math.random() - 0.5) * 0.2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.2;

      // MASSIVE explosion velocity - fill entire screen
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = 8 + Math.random() * 12; // Much faster!

      velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      velocities[i * 3 + 2] = Math.cos(phi) * speed;

      // Vũ trụ sơ khai colors: white, gold, cyan, pink, purple
      const t = Math.random();
      if (t < 0.3) {
        // Pure white (stars)
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 1;
      } else if (t < 0.5) {
        // Gold
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.84;
        colors[i * 3 + 2] = 0.2;
      } else if (t < 0.65) {
        // Cyan (cosmic dust)
        colors[i * 3] = 0.4;
        colors[i * 3 + 1] = 0.9;
        colors[i * 3 + 2] = 1;
      } else if (t < 0.8) {
        // Pink/Red (nebula)
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.2;
        colors[i * 3 + 2] = 0.5;
      } else {
        // Purple (dark matter)
        colors[i * 3] = 0.6;
        colors[i * 3 + 1] = 0.2;
        colors[i * 3 + 2] = 0.8;
      }

      sizes[i] = 0.15 + Math.random() * 0.4; // Bigger particles
    }

    return { positions, colors, sizes, velocities };
  }, []);

  // Secondary particles - 4000 cosmic dust
  const trailParticles = useMemo(() => {
    const count = 4000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.15;

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = 5 + Math.random() * 8;

      velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      velocities[i * 3 + 2] = Math.cos(phi) * speed;

      // Softer, ethereal colors
      const t = Math.random();
      if (t < 0.4) {
        // Pale white
        colors[i * 3] = 0.9;
        colors[i * 3 + 1] = 0.95;
        colors[i * 3 + 2] = 1;
      } else if (t < 0.7) {
        // Pale gold
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.9;
        colors[i * 3 + 2] = 0.6;
      } else {
        // Pale pink
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.7;
        colors[i * 3 + 2] = 0.8;
      }

      sizes[i] = 0.08 + Math.random() * 0.15;
    }

    return { positions, colors, sizes, velocities };
  }, []);

  useFrame((state, delta) => {
    if (!isExploding) return;

    explosionTime.current += delta;
    const t = explosionTime.current;
    const time = state.clock.getElapsedTime();

    // Main particles - BIG BANG expansion
    if (mainParticlesRef.current) {
      const posArray = mainParticlesRef.current.geometry.attributes.position.array as Float32Array;
      const sizeArray = mainParticlesRef.current.geometry.attributes.size.array as Float32Array;
      const count = posArray.length / 3;

      for (let i = 0; i < count; i++) {
        // Fast expansion initially, then slow drift
        const speedMultiplier = t < 1 ? 10 : 3;
        posArray[i * 3] += mainParticles.velocities[i * 3] * delta * speedMultiplier;
        posArray[i * 3 + 1] += mainParticles.velocities[i * 3 + 1] * delta * speedMultiplier;
        posArray[i * 3 + 2] += mainParticles.velocities[i * 3 + 2] * delta * speedMultiplier;

        // Very slow velocity decay - particles float freely
        const decayFactor = t < 2 ? 0.98 : 0.995; // Almost no friction after 2s
        mainParticles.velocities[i * 3] *= decayFactor;
        mainParticles.velocities[i * 3 + 1] *= decayFactor;
        mainParticles.velocities[i * 3 + 2] *= decayFactor;

        // Gentle floating motion
        if (t > 2) {
          posArray[i * 3] += Math.sin(time * 0.5 + i) * 0.01;
          posArray[i * 3 + 1] += Math.cos(time * 0.4 + i * 1.3) * 0.01;
        }

        // Twinkling like stars
        sizeArray[i] = mainParticles.sizes[i] * (0.8 + Math.sin(time * 2 + i) * 0.3);
      }

      mainParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      mainParticlesRef.current.geometry.attributes.size.needsUpdate = true;

      // Keep visible much longer
      const opacity = Math.max(0.3, 1 - t / 8); // Stay visible until t=8
      (mainParticlesRef.current.material as THREE.PointsMaterial).opacity = opacity;
    }

    // Cosmic dust particles
    if (trailParticlesRef.current) {
      const posArray = trailParticlesRef.current.geometry.attributes.position.array as Float32Array;
      const count = posArray.length / 3;

      for (let i = 0; i < count; i++) {
        const speedMultiplier = t < 1.5 ? 6 : 2;
        posArray[i * 3] += trailParticles.velocities[i * 3] * delta * speedMultiplier;
        posArray[i * 3 + 1] += trailParticles.velocities[i * 3 + 1] * delta * speedMultiplier;
        posArray[i * 3 + 2] += trailParticles.velocities[i * 3 + 2] * delta * speedMultiplier;

        // Free floating
        trailParticles.velocities[i * 3] *= 0.996;
        trailParticles.velocities[i * 3 + 1] *= 0.996;
        trailParticles.velocities[i * 3 + 2] *= 0.996;

        // Gentle drift
        if (t > 1.5) {
          posArray[i * 3 + 1] += Math.sin(time * 0.3 + i * 2) * 0.008;
        }
      }

      trailParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      const opacity = Math.max(0.2, 1 - t / 7);
      (trailParticlesRef.current.material as THREE.PointsMaterial).opacity = opacity;
    }

    // Massive shockwave rings
    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring, index) => {
        const delay = index * 0.15;
        const ringT = Math.max(0, t - delay);
        const scale = 1 + ringT * 25; // MUCH bigger rings
        ring.scale.setScalar(scale);

        const opacity = Math.max(0, 1 - ringT / 2.5);
        (ring as THREE.Mesh).material = new THREE.MeshBasicMaterial({
          color: index === 0 ? '#ffffff' : index === 1 ? '#00ffff' : '#ff00ff',
          transparent: true,
          opacity: opacity * 0.5,
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
          size={2}
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
          size={2}
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

      {/* Massive light burst */}
      <pointLight intensity={200} distance={50} color="#ffffff" decay={2} />
      <pointLight intensity={100} distance={40} color="#00ffff" decay={2} position={[2, 2, 0]} />
      <pointLight intensity={100} distance={40} color="#ff00ff" decay={2} position={[-2, -2, 0]} />
      <pointLight intensity={80} distance={35} color="#ffd700" decay={2} position={[0, 0, 3]} />
    </group>
  );
};

export default CoreExplosion;
