
import React from 'react';

export enum AppState {
  LOADING = 'LOADING',
  READY = 'READY',
  ERROR = 'ERROR'
}

export interface Landmark {
  x: number;
  y: number;
  z: number;
}

export interface HandTrackingResult {
  // landmarks bây giờ là mảng của mảng các điểm (mỗi mảng con là một bàn tay)
  landmarks: Landmark[][] | null;
  appState: AppState;
  videoRef: React.RefObject<HTMLVideoElement>;
}

declare global {
  interface Window {
    Hands: any;
    Camera: any;
  }
}
