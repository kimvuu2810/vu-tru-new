import { useState, useEffect, useCallback, useRef } from 'react';
import { PINCH_ZOOM } from '../constants';

/**
 * Hook để control zoom bằng Ctrl + Mouse Wheel
 * @returns zoomLevel - Camera Z position (8-35)
 */
export const useWheelZoom = (): number => {
  const [zoomLevel, setZoomLevel] = useState(PINCH_ZOOM.DEFAULT_CAMERA_Z);
  const smoothZoomRef = useRef(PINCH_ZOOM.DEFAULT_CAMERA_Z);
  const targetZoomRef = useRef(PINCH_ZOOM.DEFAULT_CAMERA_Z);

  const handleWheel = useCallback((e: WheelEvent) => {
    // Chỉ xử lý khi Ctrl được giữ
    if (!e.ctrlKey) return;

    // Prevent default zoom behavior của browser
    e.preventDefault();

    // Tính zoom direction
    const delta = e.deltaY;
    const zoomSpeed = 0.5; // Tốc độ zoom

    // Update target zoom
    // deltaY > 0 = scroll down = zoom out (tăng Z)
    // deltaY < 0 = scroll up = zoom in (giảm Z)
    targetZoomRef.current += delta * zoomSpeed * 0.01;

    // Clamp giữa min và max
    targetZoomRef.current = Math.max(
      PINCH_ZOOM.MIN_CAMERA_Z,
      Math.min(PINCH_ZOOM.MAX_CAMERA_Z, targetZoomRef.current)
    );
  }, []);

  // Add wheel event listener
  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  // Smooth interpolation loop
  useEffect(() => {
    let animationFrame: number;

    const animate = () => {
      // Smooth lerp
      smoothZoomRef.current += (targetZoomRef.current - smoothZoomRef.current) * PINCH_ZOOM.SMOOTHING;

      // Update state nếu có thay đổi đáng kể
      if (Math.abs(smoothZoomRef.current - zoomLevel) > 0.01) {
        setZoomLevel(smoothZoomRef.current);
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [zoomLevel]);

  return zoomLevel;
};
