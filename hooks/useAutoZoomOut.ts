import { useEffect, useRef } from 'react';
import { PINCH_ZOOM } from '../constants';

/**
 * Hook tự động zoom out sau khi explosion
 */
export const useAutoZoomOut = (isExploding: boolean, currentZoom: number) => {
  const isZoomingOut = useRef(false);
  const targetZoom = useRef(PINCH_ZOOM.DEFAULT_CAMERA_Z);

  useEffect(() => {
    if (isExploding && !isZoomingOut.current) {
      // Trigger auto zoom out sau 1.5 giây
      setTimeout(() => {
        isZoomingOut.current = true;

        // Smooth zoom out về default position
        const startZoom = currentZoom;
        const duration = 3000; // 3 giây
        const startTime = Date.now();

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Easing function (ease-out)
          const eased = 1 - Math.pow(1 - progress, 3);

          const newZoom = startZoom + (PINCH_ZOOM.DEFAULT_CAMERA_Z - startZoom) * eased;
          targetZoom.current = newZoom;

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            isZoomingOut.current = false;
          }
        };

        animate();
      }, 1500);
    }
  }, [isExploding, currentZoom]);

  return {
    isAutoZooming: isZoomingOut.current,
    autoZoomTarget: targetZoom.current,
  };
};
