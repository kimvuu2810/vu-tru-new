import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface AppSettings {
  // Performance
  particleQuality: number; // 0-100
  visualEffects: boolean;

  // Hand Tracking
  detectionSensitivity: number; // 0-100
  gestureSmoothingFactor: number; // 0-1

  // Display
  showHandVisualizer: boolean;
  showZoomIndicator: boolean;
  autoRotate: boolean;
  showTutorial: boolean;

  // Hand Visualizer Position (draggable)
  visualizerPosition: { x: number; y: number };

  // Stats
  showFPS: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  particleQuality: 100,
  visualEffects: true,
  detectionSensitivity: 50,
  gestureSmoothingFactor: 0.1,
  showHandVisualizer: true,
  showZoomIndicator: true,
  autoRotate: true,
  showTutorial: true,
  visualizerPosition: { x: 48, y: 48 }, // bottom-12 right-12 in pixels
  showFPS: false,
};

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};
