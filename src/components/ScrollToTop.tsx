import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll hacia arriba cuando cambie la ruta
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
