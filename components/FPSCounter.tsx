import React from 'react';
import { useFPSExternal } from '../hooks/useFPS';
import { useSettings } from '../contexts/SettingsContext';

/**
 * FPS Counter overlay component
 */
const FPSCounter: React.FC = () => {
  const { settings } = useSettings();
  const fps = useFPSExternal();

  if (!settings.showFPS) return null;

  return (
    <div className="absolute top-6 left-6 pointer-events-none">
      <div className="bg-black/60 backdrop-blur-xl px-4 py-2 rounded-lg border border-white/10">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              fps >= 55 ? 'bg-green-400' : fps >= 30 ? 'bg-yellow-400' : 'bg-red-400'
            }`}
          />
          <span
            className={`text-sm font-mono font-bold ${
              fps >= 55 ? 'text-green-400' : fps >= 30 ? 'text-yellow-400' : 'text-red-400'
            }`}
          >
            {fps}
          </span>
          <span className="text-[10px] text-white/40 uppercase tracking-wide">FPS</span>
        </div>
      </div>
    </div>
  );
};

export default FPSCounter;
