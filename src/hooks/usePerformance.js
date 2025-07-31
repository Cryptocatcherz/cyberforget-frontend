import { useState, useEffect } from 'react';
import performanceService from '../services/performanceService';

export const usePerformance = (componentName) => {
    const [metrics, setMetrics] = useState(performanceService.getMetrics());
    const [resourceMetrics, setResourceMetrics] = useState([]);
    const [longTasks, setLongTasks] = useState([]);

    useEffect(() => {
        // Subscribe to performance updates
        const unsubscribe = performanceService.subscribe((data) => {
            switch (data.type) {
                case 'web-vital':
                    setMetrics(prev => ({
                        ...prev,
                        [data.name]: data.value
                    }));
                    break;
                case 'resource':
                    setResourceMetrics(prev => [...prev, data]);
                    break;
                case 'long-task':
                    setLongTasks(prev => [...prev, data]);
                    break;
                default:
                    break;
            }
        });

        // Log component mount time in development
        if (process.env.NODE_ENV === 'development') {
            const mountTime = performance.now();
            console.log(`[Performance] ${componentName} mounted at ${mountTime.toFixed(2)}ms`);
        }

        return () => {
            unsubscribe();
            // Log component unmount time in development
            if (process.env.NODE_ENV === 'development') {
                const unmountTime = performance.now();
                console.log(`[Performance] ${componentName} unmounted at ${unmountTime.toFixed(2)}ms`);
            }
        };
    }, [componentName]);

    return {
        metrics,
        resourceMetrics,
        longTasks,
        clearResourceMetrics: () => setResourceMetrics([]),
        clearLongTasks: () => setLongTasks([])
    };
}; 