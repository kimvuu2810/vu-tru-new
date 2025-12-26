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

// Extend Navigator for iOS detection
interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

/**
 * Detect if running on iOS (iPhone/iPad)
 */
const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

/**
 * Check if running in standalone mode (PWA)
 */
const isStandalone = (): boolean => {
  const nav = navigator as NavigatorWithStandalone;
  return (
    nav.standalone === true ||
    window.matchMedia('(display-mode: standalone)').matches
  );
};

/**
 * Hook để quản lý fullscreen mode với cross-browser support
 * Hỗ trợ iOS Safari (với fake fullscreen), Android Chrome, và các browsers khác
 * @returns {isFullscreen, toggleFullscreen, exitFullscreen, isSupported, useFakeFullscreen}
 */
export const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [useFakeFullscreen, setUseFakeFullscreen] = useState(false);

  // Detect if fullscreen is supported
  useEffect(() => {
    const doc = document as DocumentWithFullscreen;
    const elem = document.documentElement as HTMLElementWithFullscreen;

    const hasFullscreenAPI = !!(
      elem.requestFullscreen ||
      elem.webkitRequestFullscreen ||
      elem.mozRequestFullScreen ||
      elem.msRequestFullscreen
    );

    // iOS Safari doesn't support Fullscreen API on iPhone (only iPad 16.4+)
    // Use fake fullscreen for iOS devices
    const isiOSDevice = isIOS();
    const shouldUseFake = isiOSDevice && !hasFullscreenAPI;

    setIsSupported(hasFullscreenAPI || shouldUseFake);
    setUseFakeFullscreen(shouldUseFake);

    if (shouldUseFake) {
      console.info('iOS detected: Using fake fullscreen mode. For true fullscreen, add to Home Screen.');
    } else if (!hasFullscreenAPI) {
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

  // Toggle fullscreen (with fake fullscreen fallback for iOS)
  const toggleFullscreen = useCallback(async () => {
    if (!isSupported) {
      console.warn('Fullscreen not supported');
      return;
    }

    try {
      // Use fake fullscreen for iOS
      if (useFakeFullscreen) {
        const isCurrentlyFullscreen = document.body.classList.contains('fake-fullscreen');

        if (!isCurrentlyFullscreen) {
          // Enter fake fullscreen
          document.body.classList.add('fake-fullscreen');
          // Scroll to top to hide Safari address bar
          window.scrollTo(0, 1);
          setIsFullscreen(true);
        } else {
          // Exit fake fullscreen
          document.body.classList.remove('fake-fullscreen');
          setIsFullscreen(false);
        }
        return;
      }

      // Use real fullscreen API
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
  }, [isSupported, useFakeFullscreen, getFullscreenElement, requestFullscreen, exitFullscreenInternal]);

  // Exit fullscreen (public API)
  const exitFullscreen = useCallback(async () => {
    try {
      // Handle fake fullscreen
      if (useFakeFullscreen) {
        if (document.body.classList.contains('fake-fullscreen')) {
          document.body.classList.remove('fake-fullscreen');
          setIsFullscreen(false);
        }
        return;
      }

      // Handle real fullscreen
      if (getFullscreenElement()) {
        await exitFullscreenInternal();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Exit fullscreen error:', error);
    }
  }, [useFakeFullscreen, getFullscreenElement, exitFullscreenInternal]);

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

  return { isFullscreen, toggleFullscreen, exitFullscreen, isSupported, useFakeFullscreen };
};
