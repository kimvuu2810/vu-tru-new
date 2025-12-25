import { useCallback } from 'react';
import { useThree } from '@react-three/fiber';

/**
 * Hook để capture screenshot từ 3D canvas
 */
export const useScreenshot = () => {
  const { gl } = useThree();

  const captureScreenshot = useCallback(() => {
    try {
      // Get canvas data URL
      const dataURL = gl.domElement.toDataURL('image/png');

      // Create download link
      const link = document.createElement('a');
      link.download = `celestial-glow-${Date.now()}.png`;
      link.href = dataURL;
      link.click();

      return true;
    } catch (error) {
      console.error('Screenshot error:', error);
      return false;
    }
  }, [gl]);

  return { captureScreenshot };
};
