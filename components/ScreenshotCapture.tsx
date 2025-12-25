import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

interface ScreenshotCaptureProps {
  onCapture: (captureFunc: () => void) => void;
}

/**
 * Component để expose screenshot functionality ra ngoài Canvas
 */
const ScreenshotCapture: React.FC<ScreenshotCaptureProps> = ({ onCapture }) => {
  const { gl } = useThree();

  useEffect(() => {
    const capture = () => {
      try {
        const dataURL = gl.domElement.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `celestial-glow-${Date.now()}.png`;
        link.href = dataURL;
        link.click();
      } catch (error) {
        console.error('Screenshot error:', error);
      }
    };

    onCapture(capture);
  }, [gl, onCapture]);

  return null;
};

export default ScreenshotCapture;
