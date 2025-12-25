
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { AppState, Landmark } from '../types';
import { Loader2 } from 'lucide-react';
import HandVisualizer from './HandVisualizer';

interface OverlayProps {
  appState: AppState;
  videoRef: React.RefObject<HTMLVideoElement>;
  landmarks: Landmark[][] | null;
  zoomLevel?: number;
}

const Overlay: React.FC<OverlayProps> = ({ appState, videoRef, landmarks, zoomLevel = 20 }) => {
  const handCount = landmarks ? landmarks.length : 0;

  // Tính toán pinch distance để hiển thị indicator
  const isPinching = React.useMemo(() => {
    if (!landmarks || landmarks.length === 0) return false;
    const hand = landmarks[0];
    const thumbTip = hand[4];
    const indexTip = hand[8];
    if (!thumbTip || !indexTip) return false;

    const distance = Math.sqrt(
      Math.pow(thumbTip.x - indexTip.x, 2) +
      Math.pow(thumbTip.y - indexTip.y, 2) +
      Math.pow(thumbTip.z - indexTip.z, 2)
    );

    // Coi là pinch nếu khoảng cách < 0.08
    return distance < 0.08;
  }, [landmarks]);

  // Tính zoom percentage (0-100%)
  const zoomPercentage = Math.round(((35 - zoomLevel) / (35 - 8)) * 100);

  return (
    <div className="fixed inset-0 pointer-events-none flex flex-col items-center justify-center">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="fixed opacity-0 pointer-events-none"
        style={{ width: '1px', height: '1px' }}
      />

      {appState === AppState.LOADING && (
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="w-8 h-8 text-white/20 animate-spin" />
          <p className="text-[10px] text-white/30 uppercase tracking-[1em] animate-pulse">Summoning</p>
        </div>
      )}

      {appState === AppState.ERROR && (
        <div className="bg-red-950/20 backdrop-blur-md p-6 rounded-full border border-red-500/20 text-center">
          <p className="text-[10px] text-red-400 uppercase tracking-widest">Portal Error</p>
        </div>
      )}

      {/* Pinch Zoom Indicator */}
      {isPinching && (
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
          <div className="bg-cyan-500/10 backdrop-blur-xl px-6 py-3 rounded-full border border-cyan-400/30 shadow-[0_0_20px_rgba(0,255,255,0.2)]">
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
                <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse delay-75" />
                <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse delay-150" />
              </div>
              <p className="text-[10px] text-cyan-300 uppercase tracking-[0.3em] font-light">
                Zoom {zoomPercentage}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hand Radar / Constellation Map - Minimalist Corner UI */}
      <div className="absolute bottom-12 right-12 pointer-events-auto">
        <div className="relative w-40 h-40 bg-white/[0.02] backdrop-blur-3xl rounded-full border border-white/5 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <div className="w-32 h-32 border border-white rounded-full" />
            <div className="w-16 h-16 border border-white rounded-full absolute" />
          </div>
          
          <Canvas camera={{ position: [0, 0, 5], fov: 40 }}>
            <ambientLight intensity={1} />
            <HandVisualizer landmarks={landmarks} />
          </Canvas>
          
          {/* Status Indicator */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <div className={`w-1 h-1 rounded-full ${handCount > 0 ? 'bg-cyan-400 shadow-[0_0_8px_cyan]' : 'bg-white/10'}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overlay;
