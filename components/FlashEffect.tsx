import React, { useEffect, useState } from 'react';

interface FlashEffectProps {
  isActive: boolean;
  duration?: number;
}

/**
 * Flash Effect - Hiệu ứng chói lóa toàn màn hình
 * Trigger khi zoom vào lõi
 */
const FlashEffect: React.FC<FlashEffectProps> = ({ isActive, duration = 2000 }) => {
  const [showFlash, setShowFlash] = useState(false);
  const [intensity, setIntensity] = useState(0);

  useEffect(() => {
    if (isActive) {
      setShowFlash(true);

      // Fade in nhanh
      setTimeout(() => setIntensity(1), 50);

      // Fade out chậm
      setTimeout(() => {
        setIntensity(0);
      }, duration / 2);

      // Hide hoàn toàn
      setTimeout(() => {
        setShowFlash(false);
      }, duration);
    }
  }, [isActive, duration]);

  if (!showFlash) return null;

  return (
    <>
      {/* Main Flash */}
      <div
        className="fixed inset-0 z-50 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,215,0,0.8) 30%, rgba(255,100,100,0.4) 60%, transparent 100%)',
          opacity: intensity,
          transition: intensity === 1 ? 'opacity 0.1s ease-out' : 'opacity 1s ease-out',
        }}
      />

      {/* Overlay Particles */}
      <div
        className="fixed inset-0 z-50 pointer-events-none"
        style={{
          opacity: intensity * 0.6,
          transition: 'opacity 0.5s ease-out',
        }}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              background: 'white',
              borderRadius: '50%',
              boxShadow: '0 0 20px rgba(255,255,255,0.8)',
              animation: `sparkle ${0.5 + Math.random()}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* Lens Flare Effect */}
      <div
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
        style={{
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
          opacity: intensity,
          filter: 'blur(40px)',
          transition: 'opacity 0.3s ease-out',
        }}
      />

      <style jsx>{`
        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
};

export default FlashEffect;
