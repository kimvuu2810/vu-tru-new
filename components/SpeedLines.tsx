import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SpeedLinesProps {
  zoomLevel: number;
}

/**
 * Speed Lines - Hiệu ứng vệt tốc độ khi zoom in/out nhanh
 */
const SpeedLines: React.FC<SpeedLinesProps> = ({ zoomLevel }) => {
  const linesRef = useRef<THREE.LineSegments>(null);
  const prevZoomRef = useRef(zoomLevel);
  const speedRef = useRef(0);

  const lineGeometry = useMemo(() => {
    const positions = new Float32Array(100 * 2 * 3); // 100 lines, 2 points each
    const colors = new Float32Array(100 * 2 * 3);

    for (let i = 0; i < 100; i++) {
      const angle = (i / 100) * Math.PI * 2;
      const startRadius = 15;
      const endRadius = 25;

      // Start point (inner)
      positions[i * 6] = Math.cos(angle) * startRadius;
      positions[i * 6 + 1] = Math.sin(angle) * startRadius * 0.5;
      positions[i * 6 + 2] = Math.sin(angle) * startRadius;

      // End point (outer)
      positions[i * 6 + 3] = Math.cos(angle) * endRadius;
      positions[i * 6 + 4] = Math.sin(angle) * endRadius * 0.5;
      positions[i * 6 + 5] = Math.sin(angle) * endRadius;

      // Color (cyan to white)
      const color = new THREE.Color().setHSL(0.5, 1, 0.5 + Math.random() * 0.3);

      // Start color
      colors[i * 6] = color.r;
      colors[i * 6 + 1] = color.g;
      colors[i * 6 + 2] = color.b;

      // End color (more transparent)
      colors[i * 6 + 3] = color.r * 0.3;
      colors[i * 6 + 4] = color.g * 0.3;
      colors[i * 6 + 5] = color.b * 0.3;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    return geometry;
  }, []);

  useFrame(() => {
    if (!linesRef.current) return;

    // Calculate zoom speed
    const zoomDelta = zoomLevel - prevZoomRef.current;
    const currentSpeed = Math.abs(zoomDelta) * 30;

    // Smooth speed
    speedRef.current += (currentSpeed - speedRef.current) * 0.2;
    prevZoomRef.current = zoomLevel;

    // Update visibility and opacity based on speed
    const opacity = Math.min(1, speedRef.current / 2);
    linesRef.current.visible = speedRef.current > 0.1;

    if (linesRef.current.material) {
      (linesRef.current.material as THREE.LineBasicMaterial).opacity = opacity;
    }

    // Rotate lines for motion effect
    linesRef.current.rotation.z += zoomDelta * 0.5;
  });

  return null;
};

export default SpeedLines;
