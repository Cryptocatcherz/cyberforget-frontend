// Mobile Keyboard Viewport Fix Utility
// Fixes blank space issues when keyboard opens/closes on mobile

let initialViewportHeight = null;
let isKeyboardDetected = false;
let viewportChangeTimeout = null;

// Set CSS custom property for viewport height
const setViewportHeight = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

// Detect if keyboard is likely open based on viewport change
const detectKeyboard = () => {
  if (!initialViewportHeight) {
    initialViewportHeight = window.innerHeight;
    return;
  }
  
  const currentHeight = window.innerHeight;
  const heightDifference = initialViewportHeight - currentHeight;
  const threshold = initialViewportHeight * 0.25; // 25% height change threshold
  
  const keyboardIsOpen = heightDifference > threshold;
  
  if (keyboardIsOpen !== isKeyboardDetected) {
    isKeyboardDetected = keyboardIsOpen;
    
    // Update body classes
    if (keyboardIsOpen) {
      document.body.classList.add('keyboard-open');
      document.body.classList.add('keyboard-detected');
    } else {
      document.body.classList.remove('keyboard-open');
      
      // Remove keyboard-detected class after a delay to prevent flash
      clearTimeout(viewportChangeTimeout);
      viewportChangeTimeout = setTimeout(() => {
        document.body.classList.remove('keyboard-detected');
      }, 300);
    }
    
    // Force viewport height recalculation
    setViewportHeight();
    
    // Dispatch custom event for components that need to react
    const event = new CustomEvent('keyboardToggle', {
      detail: { isOpen: keyboardIsOpen, height: currentHeight }
    });
    window.dispatchEvent(event);
  }
};

// Debounced resize handler
let resizeTimeout = null;
const handleResize = () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    detectKeyboard();
    setViewportHeight();
  }, 100);
};

// Initialize the keyboard detection system
export const initKeyboardViewportFix = () => {
  // Only run on mobile devices
  if (window.innerWidth > 768) return;
  
  // Set initial viewport height
  initialViewportHeight = window.innerHeight;
  setViewportHeight();
  
  // Listen for viewport changes
  window.addEventListener('resize', handleResize, { passive: true });
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      initialViewportHeight = window.innerHeight;
      setViewportHeight();
    }, 500);
  }, { passive: true });
  
  // Handle focus events on inputs (keyboard likely to open)
  document.addEventListener('focusin', (e) => {
    if (e.target.matches('input, textarea, select, [contenteditable]')) {
      // Small delay to allow keyboard to appear
      setTimeout(detectKeyboard, 300);
    }
  });
  
  // Handle blur events on inputs (keyboard likely to close)
  document.addEventListener('focusout', (e) => {
    if (e.target.matches('input, textarea, select, [contenteditable]')) {
      // Small delay to allow keyboard to disappear
      setTimeout(detectKeyboard, 300);
    }
  });
  
  // Visual viewport API support (better detection on modern browsers)
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', () => {
      const currentHeight = window.visualViewport.height;
      const heightDifference = initialViewportHeight - currentHeight;
      const threshold = initialViewportHeight * 0.25;
      
      const keyboardIsOpen = heightDifference > threshold;
      
      if (keyboardIsOpen !== isKeyboardDetected) {
        isKeyboardDetected = keyboardIsOpen;
        
        if (keyboardIsOpen) {
          document.body.classList.add('keyboard-open');
          document.body.classList.add('keyboard-detected');
        } else {
          document.body.classList.remove('keyboard-open');
          setTimeout(() => {
            document.body.classList.remove('keyboard-detected');
          }, 300);
        }
        
        setViewportHeight();
      }
    });
  }
  
  console.log('🔧 Keyboard viewport fix initialized');
};

// Cleanup function
export const cleanupKeyboardViewportFix = () => {
  window.removeEventListener('resize', handleResize);
  clearTimeout(resizeTimeout);
  clearTimeout(viewportChangeTimeout);
  
  // Remove classes
  document.body.classList.remove('keyboard-open', 'keyboard-detected');
  
  // Reset viewport height
  document.documentElement.style.removeProperty('--vh');
};

// Export utilities for manual control
export const forceKeyboardDetection = () => {
  detectKeyboard();
};

export const isKeyboardOpen = () => {
  return isKeyboardDetected;
};

// Default export
export default {
  init: initKeyboardViewportFix,
  cleanup: cleanupKeyboardViewportFix,
  forceDetection: forceKeyboardDetection,
  isOpen: isKeyboardOpen
};