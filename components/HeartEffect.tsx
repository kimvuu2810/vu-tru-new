import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

interface HeartEffectProps {
  isActive: boolean;
  position: { x: number; y: number } | null;
}

/**
 * Component hiển thị effect trái tim khi người dùng tạo cử chỉ trái tim
 * Với animation đẹp mắt và particles
 */
const HeartEffect: React.FC<HeartEffectProps> = ({ isActive, position }) => {
  const [particles, setParticles] = useState<Array<{ id: number; delay: number }>>([]);
  const [showHeart, setShowHeart] = useState(false);

  useEffect(() => {
    if (isActive) {
      setShowHeart(true);

      // Tạo particles với random delays
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        delay: i * 0.08,
      }));
      setParticles(newParticles);

      // Reset sau khi animation xong
      const timer = setTimeout(() => {
        setShowHeart(false);
        setParticles([]);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isActive]);

  if (!showHeart || !position) return null;

  // Convert position (0-1) to viewport coordinates
  const viewportX = position.x * 100; // Convert to percentage
  const viewportY = position.y * 100;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Main Heart */}
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${viewportX}%`,
          top: `${viewportY}%`,
        }}
      >
        {/* Glow Effect */}
        <div className="absolute inset-0 animate-ping">
          <div className="absolute inset-0 bg-pink-500/30 rounded-full blur-3xl scale-150" />
        </div>

        {/* Main Heart Icon */}
        <div className="relative animate-[bounce_1s_ease-in-out_3]">
          <Heart
            className="w-24 h-24 text-pink-500 fill-pink-500 drop-shadow-[0_0_20px_rgba(236,72,153,0.8)]"
            strokeWidth={1.5}
          />
        </div>

        {/* Sparkle Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              animation: `heartSparkle 1.5s ease-out forwards`,
              animationDelay: `${particle.delay}s`,
              transform: `rotate(${particle.id * 30}deg)`,
            }}
          >
            <div className="w-2 h-2 bg-pink-400 rounded-full shadow-[0_0_10px_rgba(244,114,182,0.8)]" />
          </div>
        ))}

        {/* Floating Hearts */}
        {[0, 1, 2].map((i) => (
          <div
            key={`float-${i}`}
            className="absolute top-1/2 left-1/2"
            style={{
              animation: `floatHeart ${2 + i * 0.3}s ease-out forwards`,
              animationDelay: `${i * 0.2}s`,
              left: `${50 + (i - 1) * 20}%`,
            }}
          >
            <Heart
              className="w-6 h-6 text-pink-400 fill-pink-400 opacity-80"
              strokeWidth={2}
            />
          </div>
        ))}

        {/* Text Label */}
        <div
          className="absolute top-full mt-4 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
          style={{ animation: 'fadeInOut 2s ease-in-out forwards' }}
        >
          <div className="bg-gradient-to-r from-pink-500/20 to-red-500/20 backdrop-blur-xl px-6 py-2 rounded-full border border-pink-500/30">
            <p className="text-sm font-light text-pink-200 tracking-wider">
              Heart Detected ♥
            </p>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes heartSparkle {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) translateY(-100px) scale(1);
            opacity: 0;
          }
        }

        @keyframes floatHeart {
          0% {
            transform: translateY(0) scale(0);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: translateY(-150px) scale(1);
            opacity: 0;
          }
        }

        @keyframes fadeInOut {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(10px);
          }
          20% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
          80% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
};

export default HeartEffect;
