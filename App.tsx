
import React, { useState, Suspense, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { useHandTracking } from './hooks/useHandTracking';
import { usePinchZoom } from './hooks/usePinchZoom';
import { useFullscreen } from './hooks/useFullscreen';
import { useSettings } from './contexts/SettingsContext';
import MagicParticles from './components/MagicParticles';
import SnowParticles from './components/SnowParticles';
import CelestialBackground from './components/CelestialBackground';
import CelestialCore from './components/CelestialCore';
import CameraController from './components/CameraController';
import ScreenshotCapture from './components/ScreenshotCapture';
import Overlay from './components/Overlay';
import ControlPanel from './components/ControlPanel';
import HelpOverlay from './components/HelpOverlay';
import SettingsPanel from './components/SettingsPanel';
import FPSCounter from './components/FPSCounter';
import InnerCore from './components/InnerCore';
import SpeedLines from './components/SpeedLines';
import DepthFog from './components/DepthFog';

const App: React.FC = () => {
  const { landmarks, appState, videoRef } = useHandTracking();
  const [expansionFactor, setExpansionFactor] = useState(1);
  const zoomLevel = usePinchZoom(landmarks);
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const { settings } = useSettings();

  // UI state
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [screenshotFunc, setScreenshotFunc] = useState<(() => void) | null>(null);

  const hasHands = landmarks && landmarks.length > 0;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // H key for Help
      if (e.key === 'h' || e.key === 'H') {
        setShowHelp((prev) => !prev);
      }
      // S key for Screenshot
      if (e.key === 's' || e.key === 'S') {
        if (screenshotFunc) screenshotFunc();
      }
      // ESC key to close overlays
      if (e.key === 'Escape') {
        setShowHelp(false);
        setShowSettings(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [screenshotFunc]);

  const handleScreenshot = useCallback(() => {
    if (screenshotFunc) {
      screenshotFunc();
    }
  }, [screenshotFunc]);

  return (
    <div className="w-full h-screen bg-[#020005]">
      <Canvas
        gl={{ antialias: false, stencil: false, alpha: false, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#010003']} />
        
        <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={45} />
        <CameraController zoomLevel={zoomLevel} />

        <OrbitControls
          enablePan={false}
          maxDistance={40}
          minDistance={10}
          autoRotate={settings.autoRotate && !hasHands}
          autoRotateSpeed={0.3}
          minPolarAngle={0.5}
          maxPolarAngle={Math.PI - 0.5}
        />

        <ambientLight intensity={0.1} />
        
        <Suspense fallback={null}>
          {/* Depth Fog - Dynamic fog based on zoom */}
          <DepthFog zoomLevel={zoomLevel} />

          <CelestialBackground />

          <MagicParticles
            landmarks={landmarks}
            onFactorChange={setExpansionFactor}
          />

          <CelestialCore expansionFactor={expansionFactor} />

          {/* Inner Core - Reveals when zooming in */}
          <InnerCore zoomLevel={zoomLevel} />

          {/* Speed Lines - Shows when zooming fast */}
          <SpeedLines zoomLevel={zoomLevel} />

          <SnowParticles expansionFactor={expansionFactor} />

          <ContactShadows
            opacity={0.1}
            scale={40}
            blur={2}
            far={20}
            color="#000000"
            position={[0, -10, 0]}
          />

          <ScreenshotCapture onCapture={(func) => setScreenshotFunc(() => func)} />
        </Suspense>

        <EffectComposer disableNormalPass>
          <Bloom 
            intensity={2.5} 
            luminanceThreshold={0.2} 
            luminanceSmoothing={0.9} 
            mipmapBlur
          />
          <Noise opacity={0.03} />
          <Vignette eskil={false} offset={0.2} darkness={1.2} />
        </EffectComposer>
      </Canvas>

      <Overlay
        appState={appState}
        videoRef={videoRef}
        landmarks={landmarks}
        zoomLevel={zoomLevel}
      />

      <ControlPanel
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onScreenshot={handleScreenshot}
        onShowHelp={() => setShowHelp(true)}
        onShowSettings={() => setShowSettings(true)}
      />

      <FPSCounter />

      {showHelp && <HelpOverlay onClose={() => setShowHelp(false)} />}
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} landmarks={landmarks} />}
    </div>
  );
};

export default App;
