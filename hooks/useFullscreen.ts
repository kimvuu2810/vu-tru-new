import { useState, useEffect, useCallback } from 'react';

// Extend Document interface for vendor prefixes
interface DocumentWithFullscreen extends Document {
  webkitFullscreenElement?: Element;
  mozFullScreenElement?: Element;
  msFullscreenElement?: Element;
  webkitExitFullscreen?: () => Promise<void>;
  mozCancelFullScreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
}

// Extend HTMLElement for vendor prefixes
interface HTMLElementWithFullscreen extends HTMLElement {
  webkitRequestFullscreen?: (options?: FullscreenOptions) => Promise<void>;
  mozRequestFullScreen?: (options?: FullscreenOptions) => Promise<void>;
  msRequestFullscreen?: (options?: FullscreenOptions) => Promise<void>;
}

/**
 * Hook để quản lý fullscreen mode với cross-browser support
 * Hỗ trợ iOS Safari, Android Chrome, và các browsers khác
 * @returns {isFullscreen, toggleFullscreen, exitFullscreen, isSupported}
 */
export const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  // Detect if fullscreen is supported
  useEffect(() => {
    const doc = document as DocumentWithFullscreen;
    const elem = document.documentElement as HTMLElementWithFullscreen;

    const supported = !!(
      elem.requestFullscreen ||
      elem.webkitRequestFullscreen ||
      elem.mozRequestFullScreen ||
      elem.msRequestFullscreen
    );

    setIsSupported(supported);

    if (!supported) {
      console.warn('Fullscreen API not supported on this device');
    }
  }, []);

  // Get fullscreen element with vendor prefixes
  const getFullscreenElement = useCallback(() => {
    const doc = document as DocumentWithFullscreen;
    return (
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement
    );
  }, []);

  // Request fullscreen with vendor prefixes
  const requestFullscreen = useCallback(async () => {
    const elem = document.documentElement as HTMLElementWithFullscreen;

    try {
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        await elem.webkitRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        await elem.mozRequestFullScreen();
      } else if (elem.msRequestFullscreen) {
        await elem.msRequestFullscreen();
      }
    } catch (error) {
      console.error('Request fullscreen error:', error);
      throw error;
    }
  }, []);

  // Exit fullscreen with vendor prefixes
  const exitFullscreenInternal = useCallback(async () => {
    const doc = document as DocumentWithFullscreen;

    try {
      if (doc.exitFullscreen) {
        await doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        await doc.webkitExitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        await doc.mozCancelFullScreen();
      } else if (doc.msExitFullscreen) {
        await doc.msExitFullscreen();
      }
    } catch (error) {
      console.error('Exit fullscreen error:', error);
      throw error;
    }
  }, []);

  // Check fullscreen state
  const checkFullscreen = useCallback(() => {
    setIsFullscreen(!!getFullscreenElement());
  }, [getFullscreenElement]);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(async () => {
    if (!isSupported) {
      console.warn('Fullscreen not supported');
      return;
    }

    try {
      if (!getFullscreenElement()) {
        // Enter fullscreen
        await requestFullscreen();
        setIsFullscreen(true);
      } else {
        // Exit fullscreen
        await exitFullscreenInternal();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Fullscreen toggle error:', error);
    }
  }, [isSupported, getFullscreenElement, requestFullscreen, exitFullscreenInternal]);

  // Exit fullscreen (public API)
  const exitFullscreen = useCallback(async () => {
    try {
      if (getFullscreenElement()) {
        await exitFullscreenInternal();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Exit fullscreen error:', error);
    }
  }, [getFullscreenElement, exitFullscreenInternal]);

  // Listen for fullscreen changes (with vendor prefixes)
  useEffect(() => {
    const events = [
      'fullscreenchange',
      'webkitfullscreenchange',
      'mozfullscreenchange',
      'msfullscreenchange',
    ];

    events.forEach((event) => {
      document.addEventListener(event, checkFullscreen);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, checkFullscreen);
      });
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

  return { isFullscreen, toggleFullscreen, exitFullscreen, isSupported };
};
