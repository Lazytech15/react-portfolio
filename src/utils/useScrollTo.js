import { useCallback } from 'react';

// Custom hook for smooth scrolling
const useScrollTo = (offset = 64) => {
  // Smooth scroll function
  const scrollTo = useCallback((elementId) => {
    const element = document.getElementById(elementId);
    
    if (!element) return;
    
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    // Use requestAnimationFrame for smoother animation
    const startPosition = window.pageYOffset;
    const distance = offsetPosition - startPosition;
    const duration = 800; // milliseconds
    let start = null;
    
    const animation = (currentTime) => {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const progress = Math.min(timeElapsed / duration, 1);
      const easeInOutCubic = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
      window.scrollTo(0, startPosition + distance * easeInOutCubic);
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };
    
    requestAnimationFrame(animation);
  }, [offset]);
  
  // Click handler for navigation links
  const handleLinkClick = useCallback((e) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    
    if (href && href.startsWith('#')) {
      const targetId = href.substring(1);
      scrollTo(targetId);
      
      // Update URL hash without scrolling
      window.history.pushState(null, '', href);
    }
  }, [scrollTo]);
  
  return { scrollTo, handleLinkClick };
};

export default useScrollTo;