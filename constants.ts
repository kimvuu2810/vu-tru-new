
export const PARTICLE_COUNT = 18000; 
export const CORE_PARTICLE_COUNT = 3000;
export const SNOW_COUNT = 1200;

export const COLORS = {
  WHITE: '#ffffff',
  RED: '#ff3366',
  GOLD: '#ffd700',
  CYAN: '#a0feff',
  PURPLE: '#3a0066',
  SUPERNOVA: '#fffceb',
  CORE_INNER: '#ffffff',
  CORE_OUTER: '#ff1a75'
};

export const MEDIAPIPE_CDN = "https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/";

export const GESTURE_THRESHOLDS = {
  FIST_RATIO: 1.35,
  OPEN_RATIO: 1.75,
};

export const PINCH_ZOOM = {
  MIN_DISTANCE: 0.02,     // Khoảng cách tối thiểu (zoom in max)
  MAX_DISTANCE: 0.15,     // Khoảng cách tối đa (zoom out max)
  MIN_CAMERA_Z: 2,        // Camera gần nhất (zoom in) - Sâu vào lõi
  MAX_CAMERA_Z: 35,       // Camera xa nhất (zoom out)
  DEFAULT_CAMERA_Z: 20,   // Vị trí camera mặc định
  SMOOTHING: 0.1,         // Độ mượt của zoom (0-1, càng nhỏ càng mượt)
  CORE_THRESHOLD: 3,      // Threshold để trigger explosion effect
};
