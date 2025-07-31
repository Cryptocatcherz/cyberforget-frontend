import { getCLS, getFID, getLCP, getFCP, getTTFB } from 'web-vitals';

// Performance thresholds
const THRESHOLDS = {
    CLS: 0.1,    // Good CLS threshold
    FID: 100,    // Good FID threshold (ms)
    LCP: 2500,   // Good LCP threshold (ms)
    FCP: 1800,   // Good FCP threshold (ms)
    TTFB: 800,   // Good TTFB threshold (ms)
    SLOW_REQUEST: 1000,  // Slow request threshold (ms)
    LONG_TASK: 50,      // Long task threshold (ms)
    MEMORY_CHECK_INTERVAL: 30000, // Memory check interval (ms)
};

class PerformanceService {
    constructor() {
        this.metrics = {
            CLS: null, // Cumulative Layout Shift
            FID: null, // First Input Delay
            LCP: null, // Largest Contentful Paint
            FCP: null, // First Contentful Paint
            TTFB: null, // Time to First Byte
        };
        this.observers = new Set();
        this.lastMemoryWarning = 0;
        this.MEMORY_WARNING_THRESHOLD = 0.9; // 90% of heap limit
        this.MEMORY_WARNING_COOLDOWN = 60000; // 1 minute between warnings
    }

    init() {
        // Measure Core Web Vitals
        getCLS(this.handleMetric.bind(this));
        getFID(this.handleMetric.bind(this));
        getLCP(this.handleMetric.bind(this));
        getFCP(this.handleMetric.bind(this));
        getTTFB(this.handleMetric.bind(this));

        // Monitor resource timing
        this.observeResourceTiming();

        // Monitor long tasks
        this.observeLongTasks();

        // Monitor memory usage if available
        this.monitorMemory();
    }

    handleMetric(metric) {
        this.metrics[metric.name] = metric.value;
        
        // Only notify if the metric exceeds threshold
        if (this.isMetricExceedingThreshold(metric)) {
            this.notifyObservers({
                type: 'web-vital',
                name: metric.name,
                value: metric.value,
                id: metric.id,
                exceededThreshold: true
            });

            if (process.env.NODE_ENV === 'development') {
                console.warn(`[Performance] ${metric.name} exceeded threshold:`, metric.value);
            }

            // Send to analytics in production
            if (process.env.NODE_ENV === 'production') {
                this.sendToAnalytics(metric);
            }
        }
    }

    isMetricExceedingThreshold(metric) {
        return metric.value > THRESHOLDS[metric.name];
    }

    observeResourceTiming() {
        // Create observer for resource timing
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                // Only track slow requests
                if (entry.duration > THRESHOLDS.SLOW_REQUEST && 
                    (entry.initiatorType === 'fetch' || entry.initiatorType === 'xmlhttprequest')) {
                    const data = {
                        type: 'resource',
                        name: entry.name,
                        duration: entry.duration,
                        startTime: entry.startTime,
                        initiatorType: entry.initiatorType
                    };

                    this.notifyObservers(data);

                    // Log slow requests in development
                    if (process.env.NODE_ENV === 'development') {
                        console.warn(`[Performance] Slow ${entry.initiatorType} request:`, {
                            url: entry.name,
                            duration: `${entry.duration.toFixed(2)}ms`
                        });
                    }
                }
            });
        });

        observer.observe({ entryTypes: ['resource'] });
    }

    observeLongTasks() {
        // Create observer for long tasks
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                // Only track tasks exceeding threshold
                if (entry.duration > THRESHOLDS.LONG_TASK) {
                    const data = {
                        type: 'long-task',
                        duration: entry.duration,
                        startTime: entry.startTime
                    };

                    this.notifyObservers(data);

                    // Log long tasks in development
                    if (process.env.NODE_ENV === 'development') {
                        console.warn(`[Performance] Long task detected: ${entry.duration.toFixed(2)}ms`);
                    }
                }
            });
        });

        observer.observe({ entryTypes: ['longtask'] });
    }

    monitorMemory() {
        if (performance.memory) {
            setInterval(() => {
                const memory = performance.memory;
                const usedRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit;

                // Only warn if memory usage is high and cooldown has passed
                if (usedRatio > this.MEMORY_WARNING_THRESHOLD && 
                    Date.now() - this.lastMemoryWarning > this.MEMORY_WARNING_COOLDOWN) {
                    
                    const data = {
                        type: 'memory',
                        usedJSHeapSize: memory.usedJSHeapSize,
                        totalJSHeapSize: memory.totalJSHeapSize,
                        jsHeapSizeLimit: memory.jsHeapSizeLimit,
                        usedRatio: usedRatio
                    };

                    this.notifyObservers(data);
                    this.lastMemoryWarning = Date.now();

                    if (process.env.NODE_ENV === 'development') {
                        console.warn('[Performance] High memory usage:', {
                            used: `${(data.usedJSHeapSize / 1048576).toFixed(2)}MB`,
                            total: `${(data.totalJSHeapSize / 1048576).toFixed(2)}MB`,
                            limit: `${(data.jsHeapSizeLimit / 1048576).toFixed(2)}MB`,
                            usedRatio: `${(usedRatio * 100).toFixed(1)}%`
                        });
                    }
                }
            }, THRESHOLDS.MEMORY_CHECK_INTERVAL);
        }
    }

    sendToAnalytics(metric) {
        // Example: Send to Google Analytics
        if (window.gtag) {
            window.gtag('event', metric.name, {
                value: Math.round(metric.value),
                event_category: 'Web Vitals',
                event_label: metric.id,
                non_interaction: true,
            });
        }
    }

    subscribe(callback) {
        this.observers.add(callback);
        return () => this.observers.delete(callback);
    }

    notifyObservers(data) {
        this.observers.forEach(callback => callback(data));
    }

    getMetrics() {
        return { ...this.metrics };
    }
}

export default new PerformanceService(); 