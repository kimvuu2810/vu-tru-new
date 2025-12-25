
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TreeStarProps {
  expansionFactor: number;
}

const TreeStar: React.FC<TreeStarProps> = ({ expansionFactor }) => {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current || !glowRef.current) return;
    
    // Hiện rõ khi là trái tim, ẩn dần khi bung thiên hà
    const visibility = THREE.MathUtils.lerp(1, 0, Math.min(expansionFactor * 2, 1));
    groupRef.current.scale.setScalar(visibility);
    
    const time = state.clock.getElapsedTime();
    
    // Nhịp đập lõi năng lượng
    const pulse = 1 + Math.sin(time * 4) * 0.2;
    glowRef.current.scale.setScalar(pulse);
    
    groupRef.current.rotation.y = time * 0.2;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Lõi sáng chói (Core Energy) */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} toneMapped={false} />
      </mesh>
      
      {/* Vầng hào quang hồng ngoại */}
      <mesh scale={[2, 2, 2]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#ff3366" transparent opacity={0.2} toneMapped={false} />
      </mesh>
    </group>
  );
};

export default TreeStar;
