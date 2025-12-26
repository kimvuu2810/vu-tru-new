import { useState, useEffect, useMemo } from 'react';
import { Landmark } from '../types';

/**
 * Hook phát hiện cử chỉ tạo hình trái tim bằng 2 tay
 * Ngón trỏ và ngón cái của 2 tay sẽ chéo nhau tạo thành hình trái tim
 */
export const useHeartGesture = (landmarks: Landmark[][] | null) => {
  const [isHeartGesture, setIsHeartGesture] = useState(false);
  const [heartPosition, setHeartPosition] = useState<{ x: number; y: number } | null>(null);
  const [lastDetectionTime, setLastDetectionTime] = useState(0);

  const detectHeartGesture = useMemo(() => {
    if (!landmarks || landmarks.length < 2) {
      return { detected: false, position: null };
    }

    const hand1 = landmarks[0];
    const hand2 = landmarks[1];

    // Lấy các điểm quan trọng
    // Hand 1
    const hand1ThumbTip = hand1[4];      // Ngón cái
    const hand1IndexTip = hand1[8];      // Ngón trỏ
    const hand1MiddleTip = hand1[12];    // Ngón giữa

    // Hand 2
    const hand2ThumbTip = hand2[4];      // Ngón cái
    const hand2IndexTip = hand2[8];      // Ngón trỏ
    const hand2MiddleTip = hand2[12];    // Ngón giữa

    if (!hand1ThumbTip || !hand1IndexTip || !hand2ThumbTip || !hand2IndexTip) {
      return { detected: false, position: null };
    }

    // Tính khoảng cách giữa các ngón tay
    const distance = (p1: Landmark, p2: Landmark) => {
      return Math.sqrt(
        Math.pow(p1.x - p2.x, 2) +
        Math.pow(p1.y - p2.y, 2) +
        Math.pow(p1.z - p2.z, 2)
      );
    };

    // Kiểm tra khoảng cách giữa ngón cái và ngón trỏ của cùng 1 tay
    const hand1ThumbIndexDistance = distance(hand1ThumbTip, hand1IndexTip);
    const hand2ThumbIndexDistance = distance(hand2ThumbTip, hand2IndexTip);

    // Kiểm tra khoảng cách giữa các ngón của 2 tay (để tạo hình trái tim)
    // Ngón trỏ tay 1 gần ngón cái tay 2
    const hand1IndexToHand2Thumb = distance(hand1IndexTip, hand2ThumbTip);
    // Ngón trỏ tay 2 gần ngón cái tay 1
    const hand2IndexToHand1Thumb = distance(hand2IndexTip, hand1ThumbTip);

    // Kiểm tra khoảng cách giữa ngón giữa của 2 tay (phải xa nhau - tạo hình trái tim)
    const middleFingerDistance = distance(hand1MiddleTip, hand2MiddleTip);

    // Điều kiện để là heart gesture:
    // 1. Ngón cái và ngón trỏ của mỗi tay gần nhau (nhưng không quá gần - không phải pinch)
    const isHand1Forming = hand1ThumbIndexDistance > 0.03 && hand1ThumbIndexDistance < 0.15;
    const isHand2Forming = hand2ThumbIndexDistance > 0.03 && hand2ThumbIndexDistance < 0.15;

    // 2. Ngón trỏ của tay này gần ngón cái của tay kia (tạo hình chéo)
    const isCrossing = hand1IndexToHand2Thumb < 0.1 && hand2IndexToHand1Thumb < 0.1;

    // 3. Ngón giữa của 2 tay xa nhau (tạo hình trái tim mở)
    const isOpenHeart = middleFingerDistance > 0.15;

    // 4. Kiểm tra vị trí tương đối: 2 tay phải ở gần nhau
    const handsDistance = distance(hand1[0], hand2[0]); // Wrist distance
    const handsClose = handsDistance < 0.3;

    const detected = isHand1Forming && isHand2Forming && isCrossing && isOpenHeart && handsClose;

    // Tính vị trí trung tâm của trái tim (giữa 2 ngón trỏ và 2 ngón cái)
    const position = detected ? {
      x: (hand1ThumbTip.x + hand1IndexTip.x + hand2ThumbTip.x + hand2IndexTip.x) / 4,
      y: (hand1ThumbTip.y + hand1IndexTip.y + hand2ThumbTip.y + hand2IndexTip.y) / 4,
    } : null;

    return { detected, position };
  }, [landmarks]);

  useEffect(() => {
    const now = Date.now();

    // Debounce: chỉ update nếu đã qua 500ms từ lần detect cuối
    if (detectHeartGesture.detected && now - lastDetectionTime > 500) {
      setIsHeartGesture(true);
      setHeartPosition(detectHeartGesture.position);
      setLastDetectionTime(now);

      // Auto hide sau 2 giây
      const timer = setTimeout(() => {
        setIsHeartGesture(false);
      }, 2000);

      return () => clearTimeout(timer);
    } else if (!detectHeartGesture.detected && now - lastDetectionTime > 500) {
      setIsHeartGesture(false);
    }
  }, [detectHeartGesture, lastDetectionTime]);

  return {
    isHeartGesture,
    heartPosition,
    isDetecting: detectHeartGesture.detected,
  };
};
