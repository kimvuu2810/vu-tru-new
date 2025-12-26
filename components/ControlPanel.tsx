import React, { useState } from 'react';
import { Maximize2, Minimize2, Camera, HelpCircle, Settings } from 'lucide-react';

interface ControlPanelProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onScreenshot?: () => void;
  onShowHelp?: () => void;
  onShowSettings?: () => void;
}

/**
 * Panel điều khiển chính với các nút fullscreen, screenshot, help, settings
 */
const ControlPanel: React.FC<ControlPanelProps> = ({
  isFullscreen,
  onToggleFullscreen,
  onScreenshot,
  onShowHelp,
  onShowSettings,
}) => {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const buttons = [
    {
      id: 'fullscreen',
      icon: isFullscreen ? Minimize2 : Maximize2,
      label: isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)',
      onClick: onToggleFullscreen,
    },
    {
      id: 'screenshot',
      icon: Camera,
      label: 'Screenshot (S)',
      onClick: onScreenshot,
    },
    {
      id: 'help',
      icon: HelpCircle,
      label: 'Help (H)',
      onClick: onShowHelp,
    },
    {
      id: 'settings',
      icon: Settings,
      label: 'Settings',
      onClick: onShowSettings,
    },
  ];

  return (
    <div className="absolute top-6 right-6 pointer-events-auto">
      <div className="flex gap-2">
        {buttons.map((btn) => {
          const Icon = btn.icon;
          return (
            <div
              key={btn.id}
              className="relative"
              onMouseEnter={() => setShowTooltip(btn.id)}
              onMouseLeave={() => setShowTooltip(null)}
            >
              <button
                onClick={btn.onClick}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 shadow-lg hover:shadow-white/20"
              >
                <Icon className="w-4 h-4 text-white/70" />
              </button>

              {/* Tooltip */}
              {showTooltip === btn.id && (
                <div className="absolute top-full mt-2 right-0 whitespace-nowrap">
                  <div className="bg-black/80 backdrop-blur-xl px-3 py-1.5 rounded-md border border-white/10">
                    <p className="text-[9px] text-white/80 uppercase tracking-wider">
                      {btn.label}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ControlPanel;
