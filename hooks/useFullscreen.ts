import { useState, useEffect, useCallback } from 'react';

/**
 * Hook để quản lý fullscreen mode
 * @returns {isFullscreen, toggleFullscreen, exitFullscreen}
 */
export const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Check fullscreen state
  const checkFullscreen = useCallback(() => {
    setIsFullscreen(!!document.fullscreenElement);
  }, []);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        // Enter fullscreen
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        // Exit fullscreen
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  }, []);

  // Exit fullscreen
  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Exit fullscreen error:', error);
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    document.addEventListener('fullscreenchange', checkFullscreen);

    return () => {
      document.removeEventListener('fullscreenchange', checkFullscreen);
    };
  }, [checkFullscreen]);

  // Keyboard shortcut: F key
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [toggleFullscreen]);

  return { isFullscreen, toggleFullscreen, exitFullscreen };
};
