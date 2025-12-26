import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface InnerCoreProps {
  zoomLevel: number; // 8-35, closer = more visible
}

/**
 * Inner Core - Lõi bên trong chỉ hiện khi zoom sâu
 * Tạo cảm giác đi vào center của universe
 */
const InnerCore: React.FC<InnerCoreProps> = ({ zoomLevel }) => {
  const group1Ref = useRef<THREE.Group>(null);
  const group2Ref = useRef<THREE.Group>(null);
  const group3Ref = useRef<THREE.Group>(null);

  // Calculate visibility based on zoom (0 = far, 1 = close)
  const zoomFactor = (35 - zoomLevel) / (35 - 8);

  // Layer 1: Outer rings (visible at medium zoom)
  const rings1 = useMemo(() => {
    const positions = new Float32Array(600 * 3);
    const colors = new Float32Array(600 * 3);
    const color = new THREE.Color('#ffffff');

    for (let i = 0; i < 600; i++) {
      const angle = (i / 600) * Math.PI * 2;
      const radius = 3 + Math.random() * 0.5;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return { positions, colors };
  }, []);

  // Layer 2: Inner sphere (visible at close zoom)
  const sphere = useMemo(() => {
    const positions = new Float32Array(400 * 3);
    const colors = new Float32Array(400 * 3);

    for (let i = 0; i < 400; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 1.5 + Math.random() * 0.3;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const color = new THREE.Color('#ffffff');
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return { positions, colors };
  }, []);

  // Layer 3: Core center (only visible when very close)
  const core = useMemo(() => {
    const positions = new Float32Array(200 * 3);
    const colors = new Float32Array(200 * 3);
    const white = new THREE.Color('#ffffff');

    for (let i = 0; i < 200; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 0.5 * Math.random();

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      colors[i * 3] = white.r;
      colors[i * 3 + 1] = white.g;
      colors[i * 3 + 2] = white.b;
    }

    return { positions, colors };
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (group1Ref.current) {
      group1Ref.current.rotation.y = time * 0.3;
      group1Ref.current.rotation.z = time * 0.1;
      // Fade in khi zoom > 0.3
      group1Ref.current.visible = zoomFactor > 0.3;
    }

    if (group2Ref.current) {
      group2Ref.current.rotation.y = -time * 0.5;
      group2Ref.current.rotation.x = time * 0.2;
      // Fade in khi zoom > 0.5
      group2Ref.current.visible = zoomFactor > 0.5;
    }

    if (group3Ref.current) {
      group3Ref.current.rotation.y = time * 0.8;
      group3Ref.current.scale.setScalar(1 + Math.sin(time * 2) * 0.1);
      // Chỉ hiện khi zoom rất sâu > 0.7
      group3Ref.current.visible = zoomFactor > 0.7;
    }
  });

  return (
    <group>
      {/* Layer 1: Outer Rings */}
      <group ref={group1Ref} scale={1 - zoomFactor * 0.3}>
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={600}
              array={rings1.positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={600}
              array={rings1.colors}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.03}
            vertexColors
            transparent
            opacity={Math.min(1, (zoomFactor - 0.3) * 3)}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </group>

      {/* Layer 2: Inner Sphere */}
      <group ref={group2Ref} scale={1.2 - zoomFactor * 0.5}>
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={400}
              array={sphere.positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={400}
              array={sphere.colors}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.04}
            vertexColors
            transparent
            opacity={Math.min(1, (zoomFactor - 0.5) * 4)}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </group>

      {/* Layer 3: Core Center */}
      <group ref={group3Ref}>
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={200}
              array={core.positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={200}
              array={core.colors}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.06}
            vertexColors
            transparent
            opacity={Math.min(1, (zoomFactor - 0.7) * 5)}
            blending={THREE.AdditiveBlending}
          />
        </points>

        {/* Glowing core orb */}
        <mesh>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={Math.min(0.8, (zoomFactor - 0.7) * 3)}
          />
        </mesh>
      </group>
    </group>
  );
};

export default InnerCore;
