import { useState, useEffect } from 'react';

export const useBreakpoint = () => {
    // Get the breakpoint value from CSS variables
    const getBreakpointValue = () => {
        const value = getComputedStyle(document.documentElement)
            .getPropertyValue('--mobile-breakpoint')
            .trim();
        return parseInt(value);
    };

    const [isMobile, setIsMobile] = useState(
        window.innerWidth <= getBreakpointValue()
    );

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= getBreakpointValue());
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile;
};
