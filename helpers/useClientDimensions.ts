import { useEffect, useState } from 'react';

const breakpoints = {
  tablet: 768,
  desktop: 1025,
};

function calcDimensions() {
  if (typeof window === 'undefined') return {};

  const width = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0,
  );
  const height = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0,
  );
  const isDesktopWidth = width >= breakpoints.desktop;
  const isTabletWidth = !isDesktopWidth && width >= breakpoints.tablet;
  const isMobileWidth = width < breakpoints.tablet;

  return {
    width,
    height,
    isDesktopWidth,
    isTabletWidth,
    isMobileWidth,
  };
}

export function useClientDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(calcDimensions());
  useEffect(() => {
    function handleResize() {
      setWindowDimensions(calcDimensions());
    }

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}
