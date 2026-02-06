/**
 * Performance Monitoring Module
 * Track and report performance metrics across the platform
 * Integrated into all pages
 */

class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.enabled = true;
        this.init();
    }

    /**
     * Initialize performance monitoring
     */
    init() {
        if (!window.PerformanceObserver) {
            return;
        }

        this.capturePageLoadMetrics();
        this.captureResourceMetrics();
        this.captureLongTasks();
        this.captureMemoryMetrics();
    }

    /**
     * Capture page load timing metrics
     */
    capturePageLoadMetrics() {
        if (!window.performance || !window.performance.timing) return;

        window.addEventListener('load', () => {
            setTimeout(() => {
                const timing = window.performance.timing;
                const navigation = window.performance.navigation;

                this.metrics.pageLoad = {
                    navigationStart: timing.navigationStart,
                    responseEnd: timing.responseEnd,
                    domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
                    pageLoadTime: timing.loadEventEnd - timing.navigationStart,
                    resourcesLoadTime: timing.responseEnd - timing.fetchStart,
                    redirectTime: timing.redirectEnd - timing.redirectStart,
                    dnsTime: timing.domainLookupEnd - timing.domainLookupStart,
                    tcpTime: timing.connectEnd - timing.connectStart,
                    requestTime: timing.responseStart - timing.requestStart,
                    responseTime: timing.responseEnd - timing.responseStart,
                    renderTime: timing.domInteractive - timing.responseEnd
                };

                this.logMetrics('Page Load Metrics', this.metrics.pageLoad);
            }, 0);
        });
    }

    /**
     * Capture resource loading metrics
     */
    captureResourceMetrics() {
        if (!window.performance || !window.performance.getEntriesByType) return;

        window.addEventListener('load', () => {
            const resources = window.performance.getEntriesByType('resource');
            this.metrics.resources = {
                count: resources.length,
                totalDuration: resources.reduce((sum, r) => sum + r.duration, 0),
                byType: {}
            };

            // Group resources by type
            resources.forEach(resource => {
                const type = resource.initiatorType || 'other';
                if (!this.metrics.resources.byType[type]) {
                    this.metrics.resources.byType[type] = {
                        count: 0,
                        totalSize: 0,
                        totalDuration: 0
                    };
                }
                this.metrics.resources.byType[type].count++;
                this.metrics.resources.byType[type].totalDuration += resource.duration;
                this.metrics.resources.byType[type].totalSize += resource.transferSize || 0;
            });

            this.logMetrics('Resource Metrics', this.metrics.resources);
        });
    }

    /**
     * Capture long tasks (tasks taking > 50ms)
     */
    captureLongTasks() {
        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                this.metrics.longTasks = entries.map(entry => ({
                    name: entry.name,
                    duration: entry.duration,
                    startTime: entry.startTime
                }));

                if (entries.length > 0) {
                    this.logMetrics('Long Tasks Detected', this.metrics.longTasks);
                }
            });

            observer.observe({ entryTypes: ['longtask'] });
        } catch (e) {
            // Long tasks API not available
        }
    }

    /**
     * Capture memory metrics (if available)
     */
    captureMemoryMetrics() {
        if (!window.performance || !window.performance.memory) return;

        setInterval(() => {
            this.metrics.memory = {
                jsHeapSizeLimit: this.formatBytes(window.performance.memory.jsHeapSizeLimit),
                totalJSHeapSize: this.formatBytes(window.performance.memory.totalJSHeapSize),
                usedJSHeapSize: this.formatBytes(window.performance.memory.usedJSHeapSize),
                percentUsed: (
                    (window.performance.memory.usedJSHeapSize / window.performance.memory.jsHeapSizeLimit) * 100
                ).toFixed(2) + '%'
            };
        }, 5000);
    }

    /**
     * Measure function execution time
     */
    measureFunction(functionName, fn) {
        const start = performance.now();
        const result = fn();
        const duration = performance.now() - start;

        if (!this.metrics.functionMetrics) {
            this.metrics.functionMetrics = {};
        }

        if (!this.metrics.functionMetrics[functionName]) {
            this.metrics.functionMetrics[functionName] = [];
        }

        this.metrics.functionMetrics[functionName].push({
            duration: duration.toFixed(2),
            timestamp: new Date().toISOString()
        });

        return result;
    }

    /**
     * Measure async function execution time
     */
    async measureAsyncFunction(functionName, fn) {
        const start = performance.now();
        const result = await fn();
        const duration = performance.now() - start;

        if (!this.metrics.functionMetrics) {
            this.metrics.functionMetrics = {};
        }

        if (!this.metrics.functionMetrics[functionName]) {
            this.metrics.functionMetrics[functionName] = [];
        }

        this.metrics.functionMetrics[functionName].push({
            duration: duration.toFixed(2),
            timestamp: new Date().toISOString()
        });

        return result;
    }

    /**
     * Get all collected metrics
     */
    getMetrics() {
        return this.metrics;
    }

    /**
     * Get specific metric
     */
    getMetric(key) {
        return this.metrics[key];
    }

    /**
     * Send metrics to server (optional)
     */
    sendMetrics(endpoint) {
        if (!this.enabled) return;

        fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                url: window.location.href,
                metrics: this.metrics,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent
            })
        }).catch(err => console.error('Failed to send metrics:', err));
    }

    /**
     * Log metrics to console
     */
    logMetrics(title, data) {
        // Check if running in development mode (only in browser, not Node.js)
        if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') {
            console.group(`📊 ${title}`);
            console.table(data);
            console.groupEnd();
        }
    }

    /**
     * Format bytes to readable size
     */
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    }

    /**
     * Generate performance report
     */
    generateReport() {
        const report = {
            generatedAt: new Date().toISOString(),
            url: window.location.href,
            metrics: this.metrics,
            summary: {
                overallScore: this.calculateOverallScore(),
                warnings: this.getPerformanceWarnings(),
                recommendations: this.getRecommendations()
            }
        };

        return report;
    }

    /**
     * Calculate overall performance score (0-100)
     */
    calculateOverallScore() {
        let score = 100;

        // Deduct for slow page load
        if (this.metrics.pageLoad) {
            if (this.metrics.pageLoad.pageLoadTime > 3000) score -= 20;
            else if (this.metrics.pageLoad.pageLoadTime > 2000) score -= 10;
        }

        // Deduct for long tasks
        if (this.metrics.longTasks && this.metrics.longTasks.length > 5) {
            score -= 15;
        }

        // Deduct for high memory usage
        if (this.metrics.memory && parseFloat(this.metrics.memory.percentUsed) > 80) {
            score -= 10;
        }

        return Math.max(0, Math.min(100, score));
    }

    /**
     * Get performance warnings
     */
    getPerformanceWarnings() {
        const warnings = [];

        if (this.metrics.pageLoad?.pageLoadTime > 3000) {
            warnings.push('⚠️ Page load time > 3 seconds');
        }

        if (this.metrics.longTasks?.length > 0) {
            warnings.push(`⚠️ ${this.metrics.longTasks.length} long tasks detected`);
        }

        if (this.metrics.memory?.percentUsed > 80) {
            warnings.push('⚠️ High memory usage detected');
        }

        return warnings;
    }

    /**
     * Get performance recommendations
     */
    getRecommendations() {
        const recommendations = [];

        if (this.metrics.pageLoad?.pageLoadTime > 2000) {
            recommendations.push('💡 Consider lazy loading resources');
            recommendations.push('💡 Optimize images and assets');
        }

        if (this.metrics.longTasks?.length > 0) {
            recommendations.push('💡 Break long tasks into smaller chunks');
            recommendations.push('💡 Use web workers for CPU-intensive tasks');
        }

        if (this.metrics.resources?.count > 50) {
            recommendations.push('💡 Consider bundling/combining resources');
        }

        return recommendations;
    }

    /**
     * Disable monitoring
     */
    disable() {
        this.enabled = false;
    }

    /**
     * Enable monitoring
     */
    enable() {
        this.enabled = true;
    }
}

// Initialize and expose globally
window.PerformanceMonitor = PerformanceMonitor;
window.performanceMonitor = new PerformanceMonitor();

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceMonitor;
}
