
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PARTICLE_COUNT, COLORS, GESTURE_THRESHOLDS } from '../constants';
import { Landmark } from '../types';

interface MagicParticlesProps {
  landmarks: Landmark[][] | null;
  onFactorChange?: (factor: number) => void;
}

const MagicParticles: React.FC<MagicParticlesProps> = ({ landmarks, onFactorChange }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const expansionFactor = useRef(1); // 0 = Heart, 1 = Galaxy
  const explosionPulse = useRef(0);
  
  const rotationY = useRef(0);
  const rotationX = useRef(0);

  // Lưu trữ dữ liệu lấp lánh và kích thước riêng cho từng ngôi sao
  const starData = useMemo(() => {
    const data = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      data[i * 3] = Math.random() * Math.PI * 2; // Phase lấp lánh
      data[i * 3 + 1] = 0.4 + Math.pow(Math.random(), 2) * 1.6; // Kích thước sao (đa dạng)
      data[i * 3 + 2] = Math.random(); // Độ trễ nam châm
    }
    return data;
  }, []);

  // Galaxy: Thiên hà xoắn ốc tinh tế
  const galaxyPositions = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.pow(Math.random(), 0.6) * 26;
      const spin = radius * 0.7;
      const arms = (Math.floor(Math.random() * 3) * (Math.PI * 2 / 3));
      const finalAngle = angle + spin + arms;
      const spread = (1 - (radius / 26)) * 6 * (Math.random() - 0.5);

      pos[i * 3] = Math.cos(finalAngle) * radius;
      pos[i * 3 + 1] = spread;
      pos[i * 3 + 2] = Math.sin(finalAngle) * radius;
    }
    return pos;
  }, []);

  // Trái tim 3D: Một khối sao sống động
  const heartPositions = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const t = Math.random() * Math.PI * 2;
      // Công thức trái tim cổ điển
      const xBase = 16 * Math.pow(Math.sin(t), 3);
      const yBase = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      
      // Tạo độ dày 3D bằng cách rải hạt trong một "vỏ" trái tim
      const depthFactor = (Math.random() - 0.5) * 2;
      const scatter = 0.85 + Math.random() * 0.15;
      
      const scale = 0.42;
      pos[i * 3] = xBase * scale * scatter;
      pos[i * 3 + 1] = (yBase + 1.5) * scale * scatter;
      pos[i * 3 + 2] = depthFactor * scatter * Math.cos(t); // Làm mỏng ở hai bên
    }
    return pos;
  }, []);

  const colors = useMemo(() => {
    const c = new Float32Array(PARTICLE_COUNT * 3);
    const starPalette = [
      new THREE.Color(COLORS.WHITE),
      new THREE.Color(COLORS.WHITE),
      new THREE.Color(COLORS.WHITE),
      new THREE.Color(COLORS.GOLD),
      new THREE.Color(COLORS.RED),
    ];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const col = starPalette[Math.floor(Math.random() * starPalette.length)];
      c[i * 3] = col.r;
      c[i * 3 + 1] = col.g;
      c[i * 3 + 2] = col.b;
    }
    return c;
  }, []);

  useFrame((state) => {
    if (!meshRef.current || !groupRef.current) return;
    const time = state.clock.getElapsedTime();
    
    let targetX = 0, targetY = 0, targetZ = 0;
    let handActive = false;

    if (landmarks && landmarks.length > 0) {
      handActive = true;
      const h = landmarks[0];
      const wrist = h[0];
      const indexTip = h[8];
      
      // Tọa độ tay để hút hạt
      targetX = (indexTip.x - 0.5) * -28;
      targetY = (indexTip.y - 0.5) * -20;
      targetZ = (indexTip.z) * -12;

      // Nhận diện nắm tay (Trái tim) hay bung tay (Galaxy)
      const middleTip = h[12];
      const middleMCP = h[9];
      const ratio = Math.sqrt(Math.pow(wrist.x - middleTip.x, 2) + Math.pow(wrist.y - middleTip.y, 2)) / 
                    Math.sqrt(Math.pow(wrist.x - middleMCP.x, 2) + Math.pow(wrist.y - middleMCP.y, 2));

      const isFist = ratio < GESTURE_THRESHOLDS.FIST_RATIO;
      
      if (isFist) {
        // Nếu đang co lại thành tim, chuẩn bị năng lượng nổ
        if (expansionFactor.current > 0.4) explosionPulse.current = 1.0; 
        expansionFactor.current = THREE.MathUtils.lerp(expansionFactor.current, 0, 0.08);
      } else if (ratio > GESTURE_THRESHOLDS.OPEN_RATIO) {
        expansionFactor.current = THREE.MathUtils.lerp(expansionFactor.current, 1, 0.05);
      }

      // Giảm dần xung nổ
      explosionPulse.current = THREE.MathUtils.lerp(explosionPulse.current, 0, 0.05);

      // Xoay khối hạt theo hướng tay
      const indexMCP = h[5];
      const pinkyMCP = h[17];
      const handRoll = Math.atan2(pinkyMCP.y - indexMCP.y, pinkyMCP.x - indexMCP.x);
      rotationY.current = THREE.MathUtils.lerp(rotationY.current, (wrist.x - 0.5) * Math.PI * 4 + handRoll * 2.5, 0.12);
      rotationX.current = THREE.MathUtils.lerp(rotationX.current, (wrist.y - 0.5) * -Math.PI * 0.8, 0.1);
    } else {
      expansionFactor.current = THREE.MathUtils.lerp(expansionFactor.current, 1, 0.015);
      rotationY.current += 0.004;
      rotationX.current = THREE.MathUtils.lerp(rotationX.current, Math.sin(time * 0.4) * 0.15, 0.03);
    }

    if (onFactorChange) onFactorChange(expansionFactor.current);

    groupRef.current.rotation.y = rotationY.current;
    groupRef.current.rotation.x = rotationX.current;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const phase = starData[i * 3];
      const magnitude = starData[i * 3 + 1];
      const lag = starData[i * 3 + 2];

      // Morphing giữa Heart và Galaxy
      let x = THREE.MathUtils.lerp(heartPositions[i * 3], galaxyPositions[i * 3], expansionFactor.current);
      let y = THREE.MathUtils.lerp(heartPositions[i * 3 + 1], galaxyPositions[i * 3 + 1], expansionFactor.current);
      let z = THREE.MathUtils.lerp(heartPositions[i * 3 + 2], galaxyPositions[i * 3 + 2], expansionFactor.current);

      // Hiệu ứng "Từ trường" khi có tay
      if (handActive) {
        const pull = 0.12 * (1 - lag * 0.4) * (expansionFactor.current * 0.8 + 0.2);
        x = THREE.MathUtils.lerp(x, targetX, pull);
        y = THREE.MathUtils.lerp(y, targetY, pull);
        z = THREE.MathUtils.lerp(z, targetZ, pull);
      }

      // Cú nổ Supernova đẩy hạt ra xa khi bung tay
      if (explosionPulse.current > 0.01) {
        const force = explosionPulse.current * 12 * (0.5 + lag);
        x += (x / 10) * force;
        y += (y / 10) * force;
        z += (z / 10) * force;
      }

      dummy.position.set(x, y, z);
      
      // Lấp lánh như sao đêm
      const twinkle = 0.6 + Math.sin(time * (3 + lag * 4) + phase) * 0.4;
      const scale = magnitude * twinkle * (1 + explosionPulse.current * 3);
      
      // Nếu là trái tim, cho nó đập nhẹ
      const heartPulse = (1 - expansionFactor.current) * Math.sin(time * 4) * 0.05;
      dummy.scale.setScalar(scale * (1 + heartPulse));
      
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
        <sphereGeometry args={[0.022, 4, 4]} />
        <meshBasicMaterial vertexColors transparent opacity={0.9} toneMapped={false} />
        <instancedBufferAttribute attach="geometry-attributes-color" args={[colors, 3]} />
      </instancedMesh>
    </group>
  );
};

export default MagicParticles;
