import { useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * Hook để theo dõi FPS real-time
 */
export const useFPS = () => {
  const [fps, setFps] = useState(60);

  useFrame((state) => {
    const currentFps = Math.round(1 / state.clock.getDelta());
    setFps(currentFps);
  });

  return fps;
};

/**
 * Hook để theo dõi FPS bên ngoài Canvas (dùng requestAnimationFrame)
 */
export const useFPSExternal = () => {
  const [fps, setFps] = useState(60);

  useEffect(() => {
    let lastTime = performance.now();
    let frames = 0;
    let frameId: number;

    const measureFPS = () => {
      frames++;
      const currentTime = performance.now();
      const delta = currentTime - lastTime;

      if (delta >= 1000) {
        setFps(Math.round((frames * 1000) / delta));
        frames = 0;
        lastTime = currentTime;
      }

      frameId = requestAnimationFrame(measureFPS);
    };

    frameId = requestAnimationFrame(measureFPS);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  return fps;
};
