import { useEffect, useState, useRef } from 'react';
import { usePinchZoom } from './usePinchZoom';
import { useWheelZoom } from './useWheelZoom';
import { PINCH_ZOOM } from '../constants';
import { Landmark } from '../types';

/**
 * Hook kết hợp cả Pinch Zoom và Wheel Zoom
 * Ưu tiên pinch khi có gesture, fallback to wheel zoom
 */
export const useCombinedZoom = (landmarks: Landmark[][] | null): number => {
  const pinchZoom = usePinchZoom(landmarks);
  const wheelZoom = useWheelZoom();
  const [finalZoom, setFinalZoom] = useState(PINCH_ZOOM.DEFAULT_CAMERA_Z);
  const lastPinchZoomRef = useRef(PINCH_ZOOM.DEFAULT_CAMERA_Z);

  useEffect(() => {
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
  }, [pinchZoom, wheelZoom, landmarks]);

  return finalZoom;
};
