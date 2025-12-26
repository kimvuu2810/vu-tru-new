import { useEffect, useState, useRef } from 'react';
import { usePinchZoom } from './usePinchZoom';
import { useWheelZoom } from './useWheelZoom';
import { PINCH_ZOOM } from '../constants';
import { Landmark } from '../types';

/**
 * Hook kết hợp cả Pinch Zoom và Wheel Zoom
 * Ưu tiên pinch khi có gesture, fallback to wheel zoom
 * @param isDisabled - Vô hiệu hóa zoom (khi explosion/cooldown)
 */
export const useCombinedZoom = (landmarks: Landmark[][] | null, isDisabled: boolean = false): number => {
  const pinchZoom = usePinchZoom(landmarks);
  const wheelZoom = useWheelZoom();
  const [finalZoom, setFinalZoom] = useState(PINCH_ZOOM.DEFAULT_CAMERA_Z);
  const lastPinchZoomRef = useRef(PINCH_ZOOM.DEFAULT_CAMERA_Z);
  const animationFrameRef = useRef<number>();

  // Smooth return to default when disabled
  useEffect(() => {
    if (isDisabled) {
      const animate = () => {
        setFinalZoom((prev) => {
          const diff = PINCH_ZOOM.DEFAULT_CAMERA_Z - prev;
          if (Math.abs(diff) < 0.1) {
            return PINCH_ZOOM.DEFAULT_CAMERA_Z;
          }
          return prev + diff * 0.05; // Smooth lerp
        });
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      animationFrameRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [isDisabled]);

  // Normal zoom behavior
  useEffect(() => {
    if (isDisabled) return;

    // Detect if user is actively pinching
    const isPinching = landmarks && landmarks.length > 0;

    if (isPinching) {
      // Pinch has priority - use pinch zoom
      setFinalZoom(pinchZoom);
      lastPinchZoomRef.current = pinchZoom;
    } else {
      // No pinch - use wheel zoom
      setFinalZoom(wheelZoom);
    }
  }, [pinchZoom, wheelZoom, landmarks, isDisabled]);

  return finalZoom;
};
