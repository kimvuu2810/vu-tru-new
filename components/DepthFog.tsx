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
    // Disabled fog to remove blue haze
    scene.fog = null;
    return () => {
      scene.fog = null;
    };
  }, [scene, zoomLevel]);

  return null;
};

export default DepthFog;
