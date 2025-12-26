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
    // At zoom -10 (DEEP INSIDE core): FOV = 100 (ultra wide, thám hiểm)
    // At zoom 35 (far): FOV = 45 (normal)
    const zoomFactor = Math.max(0, Math.min(1, (35 - zoomLevel) / (35 - (-10)))); // 0 = far, 1 = deep inside
    const targetFOV = 45 + zoomFactor * 55; // 45-100 degrees
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

    // Dramatic camera effects when exploring deep inside
    if (zoomFactor > 0.7) {
      const tiltAmount = (zoomFactor - 0.7) * 0.1;
      camera.rotation.z = Math.sin(time * 0.5) * tiltAmount;

      // Extra rotation when DEEP INSIDE core (z < -5)
      if (zoomLevel < -5) {
        const deepFactor = Math.min(1, (-5 - zoomLevel) / 5); // 0 to 1 as we go from -5 to -10
        camera.rotation.y = Math.sin(time * 0.4) * 0.08 * deepFactor;
        camera.rotation.x = Math.cos(time * 0.3) * 0.05 * deepFactor;
      } else if (zoomLevel < 0) {
        camera.rotation.y = Math.sin(time * 0.3) * 0.05;
      }
    } else {
      camera.rotation.z *= 0.95; // Smooth return
      camera.rotation.y *= 0.95;
      camera.rotation.x *= 0.95;
    }
  });

  return null;
};

export default CameraController;
