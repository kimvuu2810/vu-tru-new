
import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { AppState, Landmark } from '../types';
import { Loader2, Move } from 'lucide-react';
import HandVisualizer from './HandVisualizer';
import { useSettings } from '../contexts/SettingsContext';

interface OverlayProps {
  appState: AppState;
  videoRef: React.RefObject<HTMLVideoElement>;
  landmarks: Landmark[][] | null;
  zoomLevel?: number;
}

const Overlay: React.FC<OverlayProps> = ({ appState, videoRef, landmarks, zoomLevel = 20 }) => {
  const { settings, updateSettings } = useSettings();
  const handCount = landmarks ? landmarks.length : 0;
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const visualizerRef = useRef<HTMLDivElement>(null);

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

  // Drag and drop handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!visualizerRef.current) return;
    setIsDragging(true);
    const rect = visualizerRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!visualizerRef.current) return;
    setIsDragging(true);
    const touch = e.touches[0];
    const rect = visualizerRef.current.getBoundingClientRect();
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    });
  };

  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!isDragging) return;

      const newX = window.innerWidth - clientX + dragOffset.x - 160; // 160 = circle width
      const newY = window.innerHeight - clientY + dragOffset.y - 160;

      // Constrain to viewport
      const constrainedX = Math.max(0, Math.min(newX, window.innerWidth - 160));
      const constrainedY = Math.max(0, Math.min(newY, window.innerHeight - 160));

      updateSettings({
        visualizerPosition: { x: constrainedX, y: constrainedY },
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleEnd);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleEnd);
      };
    }
  }, [isDragging, dragOffset, updateSettings]);

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
      {settings.showZoomIndicator && isPinching && (
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
          <div className="bg-white/10 backdrop-blur-xl px-6 py-3 rounded-full border border-white/30">
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-white/80 rounded-full animate-pulse" />
                <div className="w-1 h-1 bg-white/80 rounded-full animate-pulse delay-75" />
                <div className="w-1 h-1 bg-white/80 rounded-full animate-pulse delay-150" />
              </div>
              <p className="text-[10px] text-white/70 uppercase tracking-[0.3em] font-light">
                Zoom {zoomPercentage}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hand Radar / Constellation Map - Draggable Minimalist Corner UI */}
      {settings.showHandVisualizer && (
        <div
          ref={visualizerRef}
          className="absolute pointer-events-auto group"
          style={{
            bottom: `${settings.visualizerPosition.y}px`,
            right: `${settings.visualizerPosition.x}px`,
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div className={`relative w-40 h-40 bg-white/[0.02] backdrop-blur-3xl rounded-full border overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] transition-all ${
            isDragging ? 'border-white/30 scale-105' : 'border-white/5'
          }`}>
            {/* Drag Indicator */}
            <div className={`absolute top-2 left-0 right-0 flex justify-center transition-opacity ${
              isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
            }`}>
              <Move className="w-3 h-3 text-white/50" />
            </div>

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
              <div className={`w-1 h-1 rounded-full ${handCount > 0 ? 'bg-white/80 shadow-[0_0_8px_white]' : 'bg-white/10'}`} />
            </div>

            {/* Drag Hint */}
            {!isDragging && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-black/80 px-2 py-1 rounded-md">
                  <p className="text-[8px] text-white/70 uppercase tracking-wider">Drag to move</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Overlay;
