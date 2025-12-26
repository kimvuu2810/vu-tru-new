import React, { useEffect, useState } from 'react';

interface FlashEffectProps {
  isActive: boolean;
  duration?: number;
}

/**
 * Epic Flash Effect - Hiệu ứng chói lóa EPIC toàn màn hình
 * Trigger khi zoom vào lõi
 */
const FlashEffect: React.FC<FlashEffectProps> = ({ isActive, duration = 3000 }) => {
  const [showFlash, setShowFlash] = useState(false);
  const [intensity, setIntensity] = useState(0);
  const [pulsePhase, setPulsePhase] = useState(0);

  useEffect(() => {
    if (isActive) {
      setShowFlash(true);
      setPulsePhase(0);

      // Instant flash
      setTimeout(() => setIntensity(1), 10);

      // First pulse
      setTimeout(() => setIntensity(0.7), 200);
      setTimeout(() => setIntensity(1), 400);

      // Second pulse
      setTimeout(() => setIntensity(0.6), 700);
      setTimeout(() => setIntensity(0.9), 900);

      // Slow fade out
      setTimeout(() => {
        setIntensity(0);
      }, duration / 1.5);

      // Hide hoàn toàn
      setTimeout(() => {
        setShowFlash(false);
      }, duration);

      // Pulse animation
      const pulseInterval = setInterval(() => {
        setPulsePhase((prev) => (prev + 0.1) % (Math.PI * 2));
      }, 50);

      return () => clearInterval(pulseInterval);
    }
  }, [isActive, duration]);

  if (!showFlash) return null;

  const pulseScale = 1 + Math.sin(pulsePhase) * 0.05;

  return (
    <>
      {/* Main Flash - Multiple Layers */}
      <div
        className="fixed inset-0 z-50 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%,
            rgba(255,255,255,${intensity}) 0%,
            rgba(255,240,200,${intensity * 0.9}) 20%,
            rgba(255,215,0,${intensity * 0.7}) 35%,
            rgba(255,150,80,${intensity * 0.5}) 55%,
            rgba(255,100,100,${intensity * 0.3}) 70%,
            transparent 100%)`,
          transform: `scale(${pulseScale})`,
          transition: 'opacity 0.2s ease-out',
        }}
      />

      {/* Secondary Flash Ring */}
      <div
        className="fixed inset-0 z-50 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%,
            transparent 0%,
            rgba(255,200,100,${intensity * 0.4}) 40%,
            transparent 60%)`,
          opacity: intensity,
          animation: intensity > 0.5 ? 'expand 2s ease-out infinite' : 'none',
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

        @keyframes expand {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};

export default FlashEffect;
