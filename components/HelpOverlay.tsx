import React from 'react';
import { X, Hand, Maximize, Camera as CameraIcon } from 'lucide-react';

interface HelpOverlayProps {
  onClose: () => void;
}

/**
 * Overlay hiển thị hướng dẫn sử dụng
 */
const HelpOverlay: React.FC<HelpOverlayProps> = ({ onClose }) => {
  const gestures = [
    {
      icon: '👊',
      title: 'Fist Gesture',
      description: 'Nắm tay lại → Hình trái tim',
      detail: 'Các hạt co lại thành hình trái tim 3D đập theo nhịp',
    },
    {
      icon: '✋',
      title: 'Open Hand',
      description: 'Mở bàn tay → Galaxy xoắn ốc',
      detail: 'Hạt mở rộng thành thiên hà 3 cánh với hiệu ứng supernova',
    },
    {
      icon: '🤏',
      title: 'Pinch Zoom',
      description: 'Chụm ngón cái + trỏ → Zoom',
      detail: 'Gần nhau = zoom in, xa nhau = zoom out',
    },
    {
      icon: '🖐️',
      title: 'Hand Movement',
      description: 'Di chuyển tay → Hút hạt',
      detail: 'Các hạt bị hút theo ngón trỏ như từ trường',
    },
  ];

  const shortcuts = [
    { key: 'F', action: 'Toggle Fullscreen' },
    { key: 'S', action: 'Screenshot' },
    { key: 'H', action: 'Show/Hide Help' },
    { key: 'ESC', action: 'Exit Fullscreen' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Content */}
      <div className="relative w-full max-w-3xl mx-4 bg-gradient-to-br from-purple-900/20 to-black/40 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative px-8 py-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-light text-white tracking-wide">
                Celestial Glow
              </h2>
              <p className="text-xs text-white/50 mt-1 uppercase tracking-widest">
                Interactive 3D Experience
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
            >
              <X className="w-5 h-5 text-white/70" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-6 max-h-[70vh] overflow-y-auto">
          {/* Gestures */}
          <div className="mb-8">
            <h3 className="text-sm uppercase tracking-widest text-cyan-300 mb-4">
              Hand Gestures
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gestures.map((gesture, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/30 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{gesture.icon}</div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-sm mb-1">
                        {gesture.title}
                      </h4>
                      <p className="text-cyan-300 text-xs mb-2">
                        {gesture.description}
                      </p>
                      <p className="text-white/50 text-[10px] leading-relaxed">
                        {gesture.detail}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="mb-6">
            <h3 className="text-sm uppercase tracking-widest text-cyan-300 mb-4">
              Keyboard Shortcuts
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {shortcuts.map((shortcut, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-white/5 border border-white/10 text-center"
                >
                  <div className="text-xs font-mono text-cyan-400 mb-1 bg-white/5 py-1 px-2 rounded">
                    {shortcut.key}
                  </div>
                  <p className="text-[9px] text-white/60 uppercase tracking-wide">
                    {shortcut.action}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-400/20">
            <h3 className="text-sm uppercase tracking-widest text-cyan-300 mb-3">
              💡 Tips
            </h3>
            <ul className="space-y-2 text-xs text-white/70">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">•</span>
                <span>Use Chrome or Edge for best performance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">•</span>
                <span>Good lighting improves hand tracking accuracy</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">•</span>
                <span>Keep your hand centered in the camera view</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">•</span>
                <span>Fullscreen mode provides the most immersive experience</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-white/10 bg-black/20">
          <p className="text-[9px] text-white/40 text-center uppercase tracking-widest">
            Press H to toggle this help • Press ESC to close
          </p>
        </div>
      </div>
    </div>
  );
};

export default HelpOverlay;
