import { useState, useEffect, useRef } from 'react';
import { Landmark } from '../types';
import { PINCH_ZOOM } from '../constants';

/**
 * Hook để tính toán zoom level dựa trên cử chỉ pinch (ngón cái và ngón trỏ)
 * @param landmarks - Mảng các landmarks của tay (từ MediaPipe)
 * @returns zoomLevel - Giá trị camera Z position (8-35)
 */
export const usePinchZoom = (landmarks: Landmark[][] | null): number => {
  const [zoomLevel, setZoomLevel] = useState(PINCH_ZOOM.DEFAULT_CAMERA_Z);
  const smoothZoomRef = useRef(PINCH_ZOOM.DEFAULT_CAMERA_Z);

  useEffect(() => {
    if (!landmarks || landmarks.length === 0) {
      // Không có tay, về vị trí mặc định
      smoothZoomRef.current = PINCH_ZOOM.DEFAULT_CAMERA_Z;
      setZoomLevel(PINCH_ZOOM.DEFAULT_CAMERA_Z);
      return;
    }

    // Lấy tay đầu tiên
    const hand = landmarks[0];

    // Landmark 4 = Ngón cái (thumb tip)
    // Landmark 8 = Ngón trỏ (index finger tip)
    const thumbTip = hand[4];
    const indexTip = hand[8];

    if (!thumbTip || !indexTip) return;

    // Tính khoảng cách Euclidean 3D giữa ngón cái và ngón trỏ
    const distance = Math.sqrt(
      Math.pow(thumbTip.x - indexTip.x, 2) +
      Math.pow(thumbTip.y - indexTip.y, 2) +
      Math.pow(thumbTip.z - indexTip.z, 2)
    );

    // Map khoảng cách ngón tay thành camera position
    // Khoảng cách nhỏ (pinch) = zoom in (camera gần)
    // Khoảng cách lớn (spread) = zoom out (camera xa)
    const normalizedDistance = Math.max(
      0,
      Math.min(
        1,
        (distance - PINCH_ZOOM.MIN_DISTANCE) /
        (PINCH_ZOOM.MAX_DISTANCE - PINCH_ZOOM.MIN_DISTANCE)
      )
    );

    // Áp dụng easing curve để zoom mượt hơn (ease-out)
    const easedDistance = 1 - Math.pow(1 - normalizedDistance, 2);

    // Tính camera position mới
    const targetZoom = PINCH_ZOOM.MIN_CAMERA_Z +
      (PINCH_ZOOM.MAX_CAMERA_Z - PINCH_ZOOM.MIN_CAMERA_Z) * easedDistance;

    // Smooth interpolation để tránh giật lag
    smoothZoomRef.current += (targetZoom - smoothZoomRef.current) * PINCH_ZOOM.SMOOTHING;

    setZoomLevel(smoothZoomRef.current);
  }, [landmarks]);

  return zoomLevel;
};
