import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('celestial-glow-settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (e) {
        console.error('Failed to parse settings:', e);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('celestial-glow-settings', JSON.stringify(settings));
  }, [settings]);

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
