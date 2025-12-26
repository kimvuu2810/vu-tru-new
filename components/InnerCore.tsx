import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface InnerCoreProps {
  zoomLevel: number; // -10 to 35, closer = more visible
}

/**
 * Inner Core - Thế giới bên trong lõi, chỉ hiện khi zoom SÂU
 * Tạo cảm giác thám hiểm vào center của vũ trụ
 */
const InnerCore: React.FC<InnerCoreProps> = ({ zoomLevel }) => {
  const group1Ref = useRef<THREE.Group>(null);
  const group2Ref = useRef<THREE.Group>(null);
  const group3Ref = useRef<THREE.Group>(null);

  // Calculate visibility based on zoom (0 = far, 1 = deep inside)
  const zoomFactor = Math.max(0, Math.min(1, (35 - zoomLevel) / (35 - (-10))));

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
      // Outer rings - hiện khi bắt đầu vào sâu (z < 5)
      group1Ref.current.visible = zoomFactor > 0.6; // ~z < 5
    }

    if (group2Ref.current) {
      group2Ref.current.rotation.y = -time * 0.5;
      group2Ref.current.rotation.x = time * 0.2;
      // Inner sphere - hiện khi zoom sâu hơn (z < 0)
      group2Ref.current.visible = zoomFactor > 0.75; // ~z < 0
    }

    if (group3Ref.current) {
      group3Ref.current.rotation.y = time * 0.8;
      group3Ref.current.scale.setScalar(1 + Math.sin(time * 3) * 0.15); // Pulsing mạnh hơn
      // Glowing core - chỉ hiện khi RẤT SÂU (z < -5)
      group3Ref.current.visible = zoomFactor > 0.85; // ~z < -3
    }
  });

  return (
    <group>
      {/* Layer 1: Outer Rings */}
      <group ref={group1Ref}>
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={rings1.positions.length / 3}
              array={rings1.positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={rings1.colors.length / 3}
              array={rings1.colors}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.08}
            vertexColors
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      </group>

      {/* Layer 2: Inner Sphere */}
      <group ref={group2Ref}>
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={sphere.positions.length / 3}
              array={sphere.positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={sphere.colors.length / 3}
              array={sphere.colors}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.12}
            vertexColors
            transparent
            opacity={0.9}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      </group>

      {/* Layer 3: Glowing Core - LUNG LINH */}
      <group ref={group3Ref}>
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={core.positions.length / 3}
              array={core.positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={core.colors.length / 3}
              array={core.colors}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.2}
            vertexColors
            transparent
            opacity={1}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>

        {/* Central bright core light */}
        <pointLight intensity={20} distance={5} color="#ffffff" decay={2} />
        <pointLight intensity={15} distance={3} color="#ffd700" decay={2} position={[0.2, 0, 0]} />
        <pointLight intensity={15} distance={3} color="#ff3366" decay={2} position={[-0.2, 0, 0]} />

        {/* Ultra bright center sphere */}
        <mesh>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
    </group>
  );
};

export default InnerCore;
