// src/ScrollToTop.jsx

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();
    
    useEffect(() => {
        // Store the current scroll position
        const currentScroll = window.scrollY;
        
        // Only scroll to top if we're actually changing pages
        if (currentScroll === 0 || window.history.action === 'PUSH') {
            window.scrollTo(0, 0);
        }
    }, [pathname]);

    return null;
};

export default ScrollToTop;
