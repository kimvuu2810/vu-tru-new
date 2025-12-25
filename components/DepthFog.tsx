import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface DepthFogProps {
  zoomLevel: number;
}

/**
 * Depth Fog - Fog thay đổi theo zoom level
 * Zoom in (close) = less fog (clear view of core)
 * Zoom out (far) = more fog (mysterious distance)
 */
const DepthFog: React.FC<DepthFogProps> = ({ zoomLevel }) => {
  const { scene } = useThree();

  useEffect(() => {
    // Calculate fog parameters based on zoom
    const zoomFactor = (35 - zoomLevel) / (35 - 8); // 0 = far, 1 = close

    // Fog color: darker when far, lighter when close
    const fogColor = new THREE.Color().setHSL(
      0.65, // Hue (blue-purple)
      0.3,  // Saturation
      0.02 + zoomFactor * 0.03 // Lightness: 0.02-0.05
    );

    // Fog density: more when far, less when close
    const fogNear = 10 + (1 - zoomFactor) * 10; // 10-20
    const fogFar = 30 + (1 - zoomFactor) * 20;  // 30-50

    // Apply fog
    scene.fog = new THREE.Fog(fogColor, fogNear, fogFar);

    return () => {
      scene.fog = null;
    };
  }, [scene, zoomLevel]);

  return null;
};

export default DepthFog;
