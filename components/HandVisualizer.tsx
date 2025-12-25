
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Landmark } from '../types';

interface HandVisualizerProps {
  landmarks: Landmark[][] | null;
}

const HandVisualizer: React.FC<HandVisualizerProps> = ({ landmarks }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    if (!meshRef.current) return;

    if (!landmarks || landmarks.length === 0) {
      meshRef.current.visible = false;
      return;
    }

    meshRef.current.visible = true;
    let pointIdx = 0;

    landmarks.forEach((hand) => {
      hand.forEach((landmark) => {
        if (pointIdx < 42) {
          const x = (landmark.x - 0.5) * -4; 
          const y = (landmark.y - 0.5) * -3;
          const z = landmark.z * -2;

          dummy.position.set(x, y, z);
          dummy.scale.setScalar(0.035);
          dummy.updateMatrix();
          meshRef.current?.setMatrixAt(pointIdx, dummy.matrix);
          pointIdx++;
        }
      });
    });

    for (let i = pointIdx; i < 42; i++) {
      dummy.position.set(0, 0, -20);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, 42]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.6} toneMapped={false} />
    </instancedMesh>
  );
};

export default HandVisualizer;
