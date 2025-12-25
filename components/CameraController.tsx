import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';

interface CameraControllerProps {
  zoomLevel: number;
}

/**
 * Component để điều khiển vị trí camera dựa trên zoom level từ pinch gesture
 */
const CameraController: React.FC<CameraControllerProps> = ({ zoomLevel }) => {
  const { camera } = useThree();
  const currentZ = useRef(20);

  useFrame(() => {
    // Smooth lerp để camera di chuyển mượt mà
    currentZ.current += (zoomLevel - currentZ.current) * 0.05;
    camera.position.z = currentZ.current;
    camera.updateProjectionMatrix();
  });

  return null;
};

export default CameraController;
