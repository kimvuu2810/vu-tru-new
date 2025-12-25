
import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { useHandTracking } from './hooks/useHandTracking';
import MagicParticles from './components/MagicParticles';
import SnowParticles from './components/SnowParticles';
import CelestialBackground from './components/CelestialBackground';
import CelestialCore from './components/CelestialCore';
import Overlay from './components/Overlay';

const App: React.FC = () => {
  const { landmarks, appState, videoRef } = useHandTracking();
  const [expansionFactor, setExpansionFactor] = useState(1);
  
  const hasHands = landmarks && landmarks.length > 0;

  return (
    <div className="w-full h-screen bg-[#020005]">
      <Canvas
        gl={{ antialias: false, stencil: false, alpha: false, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#010003']} />
        
        <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={45} />
        
        <OrbitControls 
          enablePan={false} 
          maxDistance={40} 
          minDistance={10} 
          autoRotate={!hasHands} 
          autoRotateSpeed={0.3}
          minPolarAngle={0.5}
          maxPolarAngle={Math.PI - 0.5}
        />

        <ambientLight intensity={0.1} />
        
        <Suspense fallback={null}>
          <CelestialBackground />
          <MagicParticles 
            landmarks={landmarks} 
            onFactorChange={setExpansionFactor} 
          />
          <CelestialCore expansionFactor={expansionFactor} />
          <SnowParticles expansionFactor={expansionFactor} />
          
          <ContactShadows 
            opacity={0.1} 
            scale={40} 
            blur={2} 
            far={20} 
            color="#000000" 
            position={[0, -10, 0]}
          />
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
      />
    </div>
  );
};

export default App;
