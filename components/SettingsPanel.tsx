import React from 'react';
import { X } from 'lucide-react';

interface SettingsPanelProps {
  onClose: () => void;
}

/**
 * Panel settings để điều chỉnh các thông số
 */
const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-end pointer-events-auto">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full md:w-96 h-auto md:h-auto md:mr-6 bg-gradient-to-br from-purple-900/30 to-black/50 backdrop-blur-2xl rounded-t-3xl md:rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-lg font-light text-white tracking-wide">
            Settings
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
          >
            <X className="w-4 h-4 text-white/70" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Performance */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-cyan-300 mb-3">
              Performance
            </h4>
            <div className="space-y-4">
              <div>
                <label className="flex items-center justify-between text-xs text-white/70 mb-2">
                  <span>Particle Quality</span>
                  <span className="text-white/50">High</span>
                </label>
                <div className="h-1 bg-white/10 rounded-full">
                  <div className="h-1 w-3/4 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full" />
                </div>
              </div>

              <div>
                <label className="flex items-center justify-between text-xs text-white/70 mb-2">
                  <span>Visual Effects</span>
                  <span className="text-white/50">Enabled</span>
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center">
                    <span className="text-[10px] text-cyan-300 uppercase tracking-wide">
                      On
                    </span>
                  </div>
                  <div className="flex-1 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <span className="text-[10px] text-white/40 uppercase tracking-wide">
                      Off
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hand Tracking */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-cyan-300 mb-3">
              Hand Tracking
            </h4>
            <div className="space-y-4">
              <div>
                <label className="flex items-center justify-between text-xs text-white/70 mb-2">
                  <span>Detection Sensitivity</span>
                  <span className="text-white/50">Medium</span>
                </label>
                <div className="h-1 bg-white/10 rounded-full">
                  <div className="h-1 w-1/2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full" />
                </div>
              </div>

              <div>
                <label className="flex items-center justify-between text-xs text-white/70 mb-2">
                  <span>Gesture Smoothing</span>
                  <span className="text-white/50">0.1</span>
                </label>
                <div className="h-1 bg-white/10 rounded-full">
                  <div className="h-1 w-1/4 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Display */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-cyan-300 mb-3">
              Display
            </h4>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
                <span className="text-xs text-white/70">Show Hand Visualizer</span>
                <div className="w-10 h-5 bg-cyan-500/30 border border-cyan-400/50 rounded-full relative">
                  <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-cyan-400 rounded-full shadow-lg" />
                </div>
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
                <span className="text-xs text-white/70">Show Zoom Indicator</span>
                <div className="w-10 h-5 bg-cyan-500/30 border border-cyan-400/50 rounded-full relative">
                  <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-cyan-400 rounded-full shadow-lg" />
                </div>
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
                <span className="text-xs text-white/70">Auto-rotate when idle</span>
                <div className="w-10 h-5 bg-cyan-500/30 border border-cyan-400/50 rounded-full relative">
                  <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-cyan-400 rounded-full shadow-lg" />
                </div>
              </label>
            </div>
          </div>

          {/* Stats */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-cyan-300 mb-3">
              Statistics
            </h4>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-2">
              <div className="flex justify-between text-[10px]">
                <span className="text-white/50">Total Particles</span>
                <span className="text-white/80 font-mono">25,200</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-white/50">Target FPS</span>
                <span className="text-white/80 font-mono">60</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-white/50">Hands Detected</span>
                <span className="text-cyan-400 font-mono">0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-black/20">
          <p className="text-[9px] text-white/40 text-center uppercase tracking-widest">
            Settings auto-saved
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
