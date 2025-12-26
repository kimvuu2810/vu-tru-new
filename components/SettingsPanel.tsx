import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { useFPSExternal } from '../hooks/useFPS';
import { Landmark } from '../types';

interface SettingsPanelProps {
  onClose: () => void;
  landmarks: Landmark[][] | null;
}

/**
 * Panel settings để điều chỉnh các thông số - FULLY FUNCTIONAL
 */
const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose, landmarks }) => {
  const { settings, updateSettings, resetSettings } = useSettings();
  const fps = useFPSExternal();

  const handCount = landmarks ? landmarks.length : 0;

  const getQualityLabel = (value: number) => {
    if (value >= 80) return 'High';
    if (value >= 50) return 'Medium';
    return 'Low';
  };

  const getSensitivityLabel = (value: number) => {
    if (value >= 70) return 'High';
    if (value >= 40) return 'Medium';
    return 'Low';
  };

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
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-light text-white tracking-wide">
              Settings
            </h3>
            <button
              onClick={resetSettings}
              className="text-xs text-white/40 hover:text-white transition-colors flex items-center gap-1"
              title="Reset to defaults"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
          >
            <X className="w-4 h-4 text-white/70" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Performance */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-white/70 mb-3">
              Performance
            </h4>
            <div className="space-y-4">
              {/* Particle Quality Slider */}
              <div>
                <label className="flex items-center justify-between text-xs text-white/70 mb-2">
                  <span>Particle Quality</span>
                  <span className="text-white/50">
                    {getQualityLabel(settings.particleQuality)} ({settings.particleQuality}%)
                  </span>
                </label>
                <input
                  type="range"
                  min="25"
                  max="100"
                  value={settings.particleQuality}
                  onChange={(e) => updateSettings({ particleQuality: parseInt(e.target.value) })}
                  className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right,
                      rgb(34 211 238) 0%,
                      rgb(168 85 247) ${settings.particleQuality}%,
                      rgba(255,255,255,0.1) ${settings.particleQuality}%,
                      rgba(255,255,255,0.1) 100%)`,
                  }}
                />
              </div>

              {/* Visual Effects Toggle */}
              <div>
                <label className="flex items-center justify-between text-xs text-white/70 mb-2">
                  <span>Visual Effects</span>
                  <span className="text-white/50">
                    {settings.visualEffects ? 'Enabled' : 'Disabled'}
                  </span>
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateSettings({ visualEffects: true })}
                    className={`flex-1 h-8 rounded-lg border transition-all ${
                      settings.visualEffects
                        ? 'bg-white/20 border-white/30 text-white'
                        : 'bg-white/5 border-white/10 text-white/40'
                    }`}
                  >
                    <span className="text-[10px] uppercase tracking-wide">On</span>
                  </button>
                  <button
                    onClick={() => updateSettings({ visualEffects: false })}
                    className={`flex-1 h-8 rounded-lg border transition-all ${
                      !settings.visualEffects
                        ? 'bg-white/20 border-white/30 text-white'
                        : 'bg-white/5 border-white/10 text-white/40'
                    }`}
                  >
                    <span className="text-[10px] uppercase tracking-wide">Off</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Hand Tracking */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-white/70 mb-3">
              Hand Tracking
            </h4>
            <div className="space-y-4">
              {/* Detection Sensitivity Slider */}
              <div>
                <label className="flex items-center justify-between text-xs text-white/70 mb-2">
                  <span>Detection Sensitivity</span>
                  <span className="text-white/50">
                    {getSensitivityLabel(settings.detectionSensitivity)}
                  </span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.detectionSensitivity}
                  onChange={(e) => updateSettings({ detectionSensitivity: parseInt(e.target.value) })}
                  className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right,
                      rgb(34 211 238) 0%,
                      rgb(168 85 247) ${settings.detectionSensitivity}%,
                      rgba(255,255,255,0.1) ${settings.detectionSensitivity}%,
                      rgba(255,255,255,0.1) 100%)`,
                  }}
                />
              </div>

              {/* Gesture Smoothing Slider */}
              <div>
                <label className="flex items-center justify-between text-xs text-white/70 mb-2">
                  <span>Gesture Smoothing</span>
                  <span className="text-white/50">{settings.gestureSmoothingFactor.toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={settings.gestureSmoothingFactor * 100}
                  onChange={(e) => updateSettings({ gestureSmoothingFactor: parseInt(e.target.value) / 100 })}
                  className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right,
                      rgb(34 211 238) 0%,
                      rgb(168 85 247) ${settings.gestureSmoothingFactor * 200}%,
                      rgba(255,255,255,0.1) ${settings.gestureSmoothingFactor * 200}%,
                      rgba(255,255,255,0.1) 100%)`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Display */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-white/70 mb-3">
              Display
            </h4>
            <div className="space-y-3">
              {/* Hand Visualizer Toggle */}
              <label
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all"
                onClick={() => updateSettings({ showHandVisualizer: !settings.showHandVisualizer })}
              >
                <span className="text-xs text-white/70">Show Hand Visualizer</span>
                <div
                  className={`w-10 h-5 rounded-full relative transition-all ${
                    settings.showHandVisualizer
                      ? 'bg-white/30 border border-white/50'
                      : 'bg-white/10 border border-white/20'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 rounded-full shadow-lg transition-all ${
                      settings.showHandVisualizer
                        ? 'right-0.5 bg-white'
                        : 'left-0.5 bg-white/40'
                    }`}
                  />
                </div>
              </label>

              {/* Zoom Indicator Toggle */}
              <label
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all"
                onClick={() => updateSettings({ showZoomIndicator: !settings.showZoomIndicator })}
              >
                <span className="text-xs text-white/70">Show Zoom Indicator</span>
                <div
                  className={`w-10 h-5 rounded-full relative transition-all ${
                    settings.showZoomIndicator
                      ? 'bg-white/30 border border-white/50'
                      : 'bg-white/10 border border-white/20'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 rounded-full shadow-lg transition-all ${
                      settings.showZoomIndicator
                        ? 'right-0.5 bg-white'
                        : 'left-0.5 bg-white/40'
                    }`}
                  />
                </div>
              </label>

              {/* Auto-rotate Toggle */}
              <label
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all"
                onClick={() => updateSettings({ autoRotate: !settings.autoRotate })}
              >
                <span className="text-xs text-white/70">Auto-rotate when idle</span>
                <div
                  className={`w-10 h-5 rounded-full relative transition-all ${
                    settings.autoRotate
                      ? 'bg-white/30 border border-white/50'
                      : 'bg-white/10 border border-white/20'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 rounded-full shadow-lg transition-all ${
                      settings.autoRotate
                        ? 'right-0.5 bg-white'
                        : 'left-0.5 bg-white/40'
                    }`}
                  />
                </div>
              </label>

              {/* FPS Counter Toggle */}
              <label
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all"
                onClick={() => updateSettings({ showFPS: !settings.showFPS })}
              >
                <span className="text-xs text-white/70">Show FPS Counter</span>
                <div
                  className={`w-10 h-5 rounded-full relative transition-all ${
                    settings.showFPS
                      ? 'bg-white/30 border border-white/50'
                      : 'bg-white/10 border border-white/20'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 rounded-full shadow-lg transition-all ${
                      settings.showFPS
                        ? 'right-0.5 bg-white'
                        : 'left-0.5 bg-white/40'
                    }`}
                  />
                </div>
              </label>
            </div>
          </div>

          {/* Stats */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-white/70 mb-3">
              Statistics
            </h4>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-2">
              <div className="flex justify-between text-[10px]">
                <span className="text-white/50">Total Particles</span>
                <span className="text-white/80 font-mono">
                  {Math.round((settings.particleQuality / 100) * 25200).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-white/50">Current FPS</span>
                <span
                  className={`font-mono ${
                    fps >= 55 ? 'text-green-400' : fps >= 30 ? 'text-yellow-400' : 'text-red-400'
                  }`}
                >
                  {fps}
                </span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-white/50">Hands Detected</span>
                <span className={`font-mono ${handCount > 0 ? 'text-white/80' : 'text-white/40'}`}>
                  {handCount}
                </span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-white/50">Visual Effects</span>
                <span className={`font-mono ${settings.visualEffects ? 'text-green-400' : 'text-red-400'}`}>
                  {settings.visualEffects ? 'ON' : 'OFF'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-black/20">
          <p className="text-[9px] text-white/40 text-center uppercase tracking-widest">
            Settings reset on page reload
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
