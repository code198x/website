/**
 * Performance Monitoring System
 * Tracks Core Web Vitals and custom performance metrics
 */

import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from "web-vitals";

interface PerformanceData extends Metric {
  timestamp: number;
  url: string;
  userAgent: string;
  connectionType?: string;
}

class PerformanceMonitor {
  private data: PerformanceData[] = [];
  private isEnabled: boolean;

  constructor() {
    // Enable by default in development for dashboard functionality
    // Disable in production unless explicitly enabled
    this.isEnabled =
      !import.meta.env.PROD || import.meta.env.VITE_ENABLE_PERF_MONITORING === "true";

    if (this.isEnabled) {
      this.init();
    }
  }

  private init() {
    // Track Core Web Vitals
    onCLS(this.handleMetric.bind(this));
    onFCP(this.handleMetric.bind(this));
    onINP(this.handleMetric.bind(this));
    onLCP(this.handleMetric.bind(this));
    onTTFB(this.handleMetric.bind(this));

    // Track custom navigation metrics
    this.trackNavigationTiming();

    // Track resource loading performance
    this.trackResourceTiming();

    // Track JavaScript errors that might impact performance
    this.trackErrors();

    // Export data periodically
    this.setupDataExport();
  }

  private handleMetric(metric: Metric) {
    const performanceData: PerformanceData = {
      ...metric,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      connectionType: this.getConnectionType(),
    };

    this.data.push(performanceData);

    // Log to console in development
    if (!import.meta.env.PROD) {
      this.logMetric(performanceData);
    }

    // Dispatch custom event for dashboard
    window.dispatchEvent(
      new CustomEvent("web-vital", {
        detail: performanceData,
      })
    );

    // Send to analytics (placeholder for future implementation)
    this.sendToAnalytics(performanceData);
  }

  private getConnectionType(): string | undefined {
    // @ts-ignore - NetworkInformation is experimental
    const connection =
      navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return connection?.effectiveType || connection?.type;
  }

  private logMetric(data: PerformanceData) {
    const { name, value, rating } = data;
    const color = rating === "good" ? "green" : rating === "needs-improvement" ? "orange" : "red";

    console.log(
      `%c📊 ${name}: ${Math.round(value)}ms (${rating})`,
      `color: ${color}; font-weight: bold;`
    );
  }

  private trackNavigationTiming() {
    if ("performance" in window && "getEntriesByType" in performance) {
      const navigationEntries = performance.getEntriesByType(
        "navigation"
      ) as PerformanceNavigationTiming[];

      if (navigationEntries.length > 0) {
        const nav = navigationEntries[0];

        // Track custom metrics
        const customMetrics = {
          domContentLoaded: nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart,
          loadComplete: nav.loadEventEnd - nav.loadEventStart,
          domInteractive: nav.domInteractive - nav.navigationStart,
          dnsLookup: nav.domainLookupEnd - nav.domainLookupStart,
          tcpConnect: nav.connectEnd - nav.connectStart,
          serverResponse: nav.responseEnd - nav.requestStart,
          domProcessing: nav.domComplete - nav.responseEnd,
        };

        Object.entries(customMetrics).forEach(([name, value]) => {
          if (value > 0) {
            this.handleMetric({
              name: name as any,
              value,
              rating: this.getRating(name, value),
              delta: 0,
              entries: [],
              id: `${name}-${Date.now()}`,
              navigationType: "navigate",
            });
          }
        });
      }
    }
  }

  private trackResourceTiming() {
    if ("performance" in window && "getEntriesByType" in performance) {
      const resourceEntries = performance.getEntriesByType(
        "resource"
      ) as PerformanceResourceTiming[];

      // Track slow resources (>1s)
      const slowResources = resourceEntries.filter((resource) => resource.duration > 1000);

      slowResources.forEach((resource) => {
        console.warn(
          `⚠️ Slow resource detected: ${resource.name} took ${Math.round(resource.duration)}ms`
        );
      });

      // Track total resource sizes
      const totalSize = resourceEntries.reduce((acc, resource) => {
        return acc + (resource.transferSize || 0);
      }, 0);

      if (totalSize > 0) {
        console.log(`📦 Total resources: ${Math.round(totalSize / 1024)}KB`);
      }
    }
  }

  private trackErrors() {
    window.addEventListener("error", (event) => {
      console.error("🚨 JavaScript Error:", event.error);
      // Could impact performance metrics
    });

    window.addEventListener("unhandledrejection", (event) => {
      console.error("🚨 Unhandled Promise Rejection:", event.reason);
    });
  }

  private setupDataExport() {
    // Export data every 30 seconds
    setInterval(() => {
      if (this.data.length > 0) {
        this.exportData();
      }
    }, 30000);

    // Export on page unload
    window.addEventListener("beforeunload", () => {
      if (this.data.length > 0) {
        this.exportData();
      }
    });
  }

  private exportData() {
    if (!import.meta.env.PROD) {
      // In development, just log to console
      console.table(this.data);
    }

    // Store in localStorage for analysis
    const existingData = JSON.parse(localStorage.getItem("performance-data") || "[]");
    const allData = [...existingData, ...this.data];

    // Keep only last 100 entries
    const trimmedData = allData.slice(-100);
    localStorage.setItem("performance-data", JSON.stringify(trimmedData));

    // Clear current data
    this.data = [];
  }

  private sendToAnalytics(data: PerformanceData) {
    // Placeholder for future analytics integration
    // Could send to Google Analytics, Mixpanel, etc.
    if (import.meta.env.VITE_ANALYTICS_ENDPOINT) {
      fetch(import.meta.env.VITE_ANALYTICS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        keepalive: true,
      }).catch(console.error);
    }
  }

  private getRating(metricName: string, value: number): "good" | "needs-improvement" | "poor" {
    // Simple rating system for custom metrics
    const thresholds: Record<string, [number, number]> = {
      domContentLoaded: [1600, 3000],
      loadComplete: [2500, 4000],
      domInteractive: [1600, 3000],
      dnsLookup: [100, 300],
      tcpConnect: [100, 300],
      serverResponse: [200, 500],
      domProcessing: [1500, 3000],
    };

    const [good, poor] = thresholds[metricName] || [1000, 2500];

    if (value <= good) return "good";
    if (value <= poor) return "needs-improvement";
    return "poor";
  }

  // Public API for manual performance tracking
  public markStart(name: string) {
    performance.mark(`${name}-start`);
  }

  public markEnd(name: string) {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);

    const measure = performance.getEntriesByName(name)[0];
    if (measure) {
      console.log(`⏱️ ${name}: ${Math.round(measure.duration)}ms`);
    }
  }

  public getStoredData(): PerformanceData[] {
    return JSON.parse(localStorage.getItem("performance-data") || "[]");
  }

  public clearStoredData() {
    localStorage.removeItem("performance-data");
    console.log("🗑️ Performance data cleared");
  }
}

// Initialize performance monitoring
const performanceMonitor = new PerformanceMonitor();

// Export for global access
declare global {
  interface Window {
    performanceMonitor: PerformanceMonitor;
  }
}

window.performanceMonitor = performanceMonitor;

export default performanceMonitor;
