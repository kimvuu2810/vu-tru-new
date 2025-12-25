
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SNOW_COUNT } from '../constants';

interface SnowParticlesProps {
  expansionFactor: number;
}

const SnowParticles: React.FC<SnowParticlesProps> = ({ expansionFactor }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Tăng phạm vi rơi của tuyết lên gấp đôi để bao phủ thiên hà khổng lồ
  const initialPositions = useMemo(() => {
    const pos = new Float32Array(SNOW_COUNT * 3);
    for (let i = 0; i < SNOW_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60; // Mở rộng chiều ngang (từ -30 đến 30)
      pos[i * 3 + 1] = Math.random() * 30;    // Tăng độ cao
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60; // Mở rộng chiều sâu
    }
    return pos;
  }, []);

  const velocities = useMemo(() => {
    return new Float32Array(SNOW_COUNT).map(() => 0.02 + Math.random() * 0.04);
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    meshRef.current.visible = true;

    for (let i = 0; i < SNOW_COUNT; i++) {
      const idx = i * 3;
      initialPositions[idx + 1] -= velocities[i];
      
      // Reset khi tuyết rơi xuống quá thấp (thấp hơn vì không gian rộng hơn)
      if (initialPositions[idx + 1] < -20) {
        initialPositions[idx + 1] = 20;
      }

      const drift = Math.sin(state.clock.getElapsedTime() + i) * 0.01;
      
      dummy.position.set(
        initialPositions[idx] + drift,
        initialPositions[idx + 1],
        initialPositions[idx + 2]
      );
      
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, SNOW_COUNT]}>
      <sphereGeometry args={[0.025, 4, 4]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
    </instancedMesh>
  );
};

export default SnowParticles;
