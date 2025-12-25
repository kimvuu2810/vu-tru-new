import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

interface CameraControllerProps {
  zoomLevel: number;
}

/**
 * Enhanced Camera Controller với smooth journey effect
 * - Z position changes
 * - FOV changes (zoom in = wider FOV for immersion)
 * - Subtle camera shake when zooming fast
 */
const CameraController: React.FC<CameraControllerProps> = ({ zoomLevel }) => {
  const { camera } = useThree();
  const currentZ = useRef(20);
  const currentFOV = useRef(45);
  const prevZoom = useRef(zoomLevel);
  const shakeOffset = useRef(new THREE.Vector3());

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Smooth lerp để camera di chuyển mượt mà
    const targetZ = zoomLevel;
    currentZ.current += (targetZ - currentZ.current) * 0.08;

    // FOV thay đổi theo zoom (zoom in = FOV tăng = immersive)
    // At zoom 8 (close): FOV = 55 (wider)
    // At zoom 35 (far): FOV = 45 (normal)
    const zoomFactor = (35 - zoomLevel) / (35 - 8); // 0 = far, 1 = close
    const targetFOV = 45 + zoomFactor * 15; // 45-60 degrees
    currentFOV.current += (targetFOV - currentFOV.current) * 0.05;

    // Calculate zoom speed for shake effect
    const zoomSpeed = Math.abs(zoomLevel - prevZoom.current);
    prevZoom.current = zoomLevel;

    // Camera shake khi zoom nhanh
    if (zoomSpeed > 0.1) {
      const shakeAmount = Math.min(zoomSpeed * 0.3, 0.2);
      shakeOffset.current.set(
        (Math.random() - 0.5) * shakeAmount,
        (Math.random() - 0.5) * shakeAmount,
        0
      );
    } else {
      // Smooth return to center
      shakeOffset.current.multiplyScalar(0.9);
    }

    // Apply camera transforms
    camera.position.z = currentZ.current;
    camera.position.x = shakeOffset.current.x;
    camera.position.y = shakeOffset.current.y;

    // Update FOV
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = currentFOV.current;
      camera.updateProjectionMatrix();
    }

    // Subtle camera tilt when very close (adds drama)
    if (zoomFactor > 0.6) {
      const tiltAmount = (zoomFactor - 0.6) * 0.05;
      camera.rotation.z = Math.sin(time * 0.5) * tiltAmount;
    } else {
      camera.rotation.z *= 0.95; // Smooth return
    }
  });

  return null;
};

export default CameraController;
