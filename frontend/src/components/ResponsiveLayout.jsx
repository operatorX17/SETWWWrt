import React, { useState, useEffect } from 'react';

const ResponsiveLayout = ({ children, mobileComponent, desktopComponent }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // If specific mobile/desktop components are provided, use them
  if (mobileComponent && desktopComponent) {
    return isMobile ? mobileComponent : desktopComponent;
  }

  // Otherwise, return children with mobile-first responsive classes
  return (
    <div className={isMobile ? 'mobile-layout' : 'desktop-layout'}>
      {children}
    </div>
  );
};

export default ResponsiveLayout;