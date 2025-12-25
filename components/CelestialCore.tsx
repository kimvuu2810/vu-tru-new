
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CORE_PARTICLE_COUNT, COLORS } from '../constants';

interface CelestialCoreProps {
  expansionFactor: number;
}

const CelestialCore: React.FC<CelestialCoreProps> = ({ expansionFactor }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particleData = useMemo(() => {
    const data = new Float32Array(CORE_PARTICLE_COUNT * 3);
    for (let i = 0; i < CORE_PARTICLE_COUNT; i++) {
      data[i * 3] = Math.random() * Math.PI * 2; // Theta
      data[i * 3 + 1] = Math.random() * Math.PI;    // Phi
      data[i * 3 + 2] = 0.5 + Math.random() * 0.5;  // Distance
    }
    return data;
  }, []);

  const colors = useMemo(() => {
    const c = new Float32Array(CORE_PARTICLE_COUNT * 3);
    const inner = new THREE.Color(COLORS.CORE_INNER);
    const outer = new THREE.Color(COLORS.CORE_OUTER);
    for (let i = 0; i < CORE_PARTICLE_COUNT; i++) {
      const mix = Math.random();
      const col = new THREE.Color().lerpColors(inner, outer, mix);
      c[i * 3] = col.r;
      c[i * 3 + 1] = col.g;
      c[i * 3 + 2] = col.b;
    }
    return c;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Core fades as galaxy expands
    const visibility = THREE.MathUtils.lerp(1, 0.2, expansionFactor);
    const pulse = 1 + Math.sin(time * 6) * 0.1;

    for (let i = 0; i < CORE_PARTICLE_COUNT; i++) {
      const theta = particleData[i * 3];
      const phi = particleData[i * 3 + 1];
      const dist = particleData[i * 3 + 2];

      // Vibration effect
      const vibration = Math.sin(time * 20 + i) * 0.05;
      const r = (dist + vibration) * pulse * (1 - expansionFactor * 0.5);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      dummy.position.set(x, y, z);
      dummy.scale.setScalar(0.05 * visibility);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.rotation.y = time * 0.5;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, CORE_PARTICLE_COUNT]}>
      <sphereGeometry args={[0.5, 4, 4]} />
      <meshBasicMaterial vertexColors transparent opacity={0.8} toneMapped={false} />
      <instancedBufferAttribute attach="geometry-attributes-color" args={[colors, 3]} />
    </instancedMesh>
  );
};

export default CelestialCore;
