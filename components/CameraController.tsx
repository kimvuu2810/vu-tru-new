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
 * - Smooth camera movements
 */
const CameraController: React.FC<CameraControllerProps> = ({ zoomLevel }) => {
  const { camera } = useThree();
  const currentZ = useRef(20);
  const currentFOV = useRef(45);

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

    // Apply camera transforms - smooth only, no shake
    camera.position.z = currentZ.current;
    camera.position.x = 0;
    camera.position.y = 0;

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
