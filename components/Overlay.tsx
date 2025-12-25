
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { AppState, Landmark } from '../types';
import { Loader2 } from 'lucide-react';
import HandVisualizer from './HandVisualizer';

interface OverlayProps {
  appState: AppState;
  videoRef: React.RefObject<HTMLVideoElement>;
  landmarks: Landmark[][] | null;
}

const Overlay: React.FC<OverlayProps> = ({ appState, videoRef, landmarks }) => {
  const handCount = landmarks ? landmarks.length : 0;

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
