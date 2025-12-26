
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CelestialBackground: React.FC = () => {
  const count = 3000;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const nebulaRef = useRef<THREE.Group>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!meshRef.current || !nebulaRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Xoay nền cực chậm
    nebulaRef.current.rotation.y = time * 0.02;
    nebulaRef.current.rotation.z = time * 0.01;

    for (let i = 0; i < count; i++) {
      dummy.position.set(particles[i * 3], particles[i * 3 + 1], particles[i * 3 + 2]);
      const s = 0.5 + Math.sin(time * 0.5 + i) * 0.5;
      dummy.scale.setScalar(s * 0.1);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={nebulaRef}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <sphereGeometry args={[1, 4, 4]} />
        <meshBasicMaterial color="#666666" transparent opacity={0.15} />
      </instancedMesh>

      {/* Glow dịu nhẹ cho trung tâm */}
      <mesh scale={[50, 50, 50]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color="#1a0033"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};

export default CelestialBackground;
