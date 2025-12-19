import { Outlet } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import ConfigureApp from './config';
import Header from './header';
import Sidebar from './sidebar';

export default function Layout() {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const width = document.documentElement.clientWidth;
      return width >= 640 && width < 768;
    }
    return false;
  });
  const manuallyCollapsed = useRef(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = document.documentElement.clientWidth;
      const isMob = width < 640;
      setIsMobile(isMob);
      if (manuallyCollapsed.current) {
        return;
      }
      if (width >= 768) {
        setCollapsed(false);
      } else if (width >= 640 && width < 768) {
        setCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleOpenMobileMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCollapsed = (collapsed: boolean) => {
    setCollapsed(collapsed);
    if (collapsed === true) {
      manuallyCollapsed.current = true;
    } else {
      manuallyCollapsed.current = false;
    }
  };

  return (
    <ConfigureApp>
      <div className="min-h-[100svh] flex bg-[var(--ant-color-bg-layout)]">
        <Sidebar collapsed={collapsed} handleCollapsed={handleCollapsed} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} isMobile={isMobile} />
        <div className="min-w-0 flex flex-1 flex-col">
          <Header collapsed={collapsed} onCollapse={handleOpenMobileMenu} />
          <div className="min-h-0 min-w-0 flex-1 p-3 md:p-6 pt-0!">
            <Outlet />
          </div>
        </div>
      </div>
    </ConfigureApp>
  );
}
