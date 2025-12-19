import { useEffect, useState } from 'react';

export function isMobile() {
  return window.innerWidth < 640;
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    document.documentElement.clientWidth < 640,
  );
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(document.documentElement.clientWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
}
