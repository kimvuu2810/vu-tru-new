
import { useState, useEffect, useRef, useCallback } from 'react';
import { AppState, Landmark, HandTrackingResult } from '../types';
import { MEDIAPIPE_CDN } from '../constants';

export const useHandTracking = (): HandTrackingResult => {
  const [appState, setAppState] = useState<AppState>(AppState.LOADING);
  const [landmarks, setLandmarks] = useState<Landmark[][] | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const handsRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  
  const isReadyRef = useRef(false);

  const onResults = useCallback((results: any) => {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      // Lưu trữ tất cả các bàn tay được nhận diện
      setLandmarks(results.multiHandLandmarks);
    } else {
      setLandmarks(null);
    }
    
    if (!isReadyRef.current) {
      isReadyRef.current = true;
      setAppState(AppState.READY);
    }
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;

    let isActive = true;

    const initHands = async () => {
      try {
        if (!window.Hands || !window.Camera) {
          console.error("MediaPipe scripts not fully loaded");
          setAppState(AppState.ERROR);
          return;
        }

        const hands = new window.Hands({
          locateFile: (file: string) => {
            return `${MEDIAPIPE_CDN}${file}`;
          }
        });

        hands.setOptions({
          maxNumHands: 2, // Cho phép tối đa 2 tay
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        hands.onResults(onResults);
        handsRef.current = hands;

        const camera = new window.Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current && handsRef.current && isActive) {
              try {
                await handsRef.current.send({ image: videoRef.current });
              } catch (e) {
                console.warn("Hand detection frame dropped:", e);
              }
            }
          },
          width: 640,
          height: 480
        });

        camera.start();
        cameraRef.current = camera;
      } catch (error) {
        console.error("MediaPipe initialization failed:", error);
        if (isActive) setAppState(AppState.ERROR);
      }
    };

    initHands();

    return () => {
      isActive = false;
      if (cameraRef.current) {
        cameraRef.current.stop();
        cameraRef.current = null;
      }
      if (handsRef.current) {
        handsRef.current.close();
        handsRef.current = null;
      }
    };
  }, [onResults]);

  return { landmarks, appState, videoRef };
};
