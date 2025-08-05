/**
 * Performance monitoring utilities for Legally Legit AI
 * Tracks Core Web Vitals and sends metrics to analytics
 */

import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';

export interface PerformanceMetric {
  name: string;
  value: number;
  id: string;
  delta: number;
  entries: PerformanceEntry[];
}

// Configuration for performance thresholds (Australian market focus)
export const PERFORMANCE_THRESHOLDS = {
  LCP: 2500, // Largest Contentful Paint - Good: < 2.5s
  FID: 100,  // First Input Delay - Good: < 100ms
  CLS: 0.1,  // Cumulative Layout Shift - Good: < 0.1
  FCP: 1800, // First Contentful Paint - Good: < 1.8s
  TTFB: 800  // Time to First Byte - Good: < 800ms
} as const;

/**
 * Sends performance metrics to analytics
 * Replace with your preferred analytics service (GA4, Mixpanel, etc.)
 */
function sendToAnalytics({ name, value, id }: PerformanceMetric): void {
  // For development, log to console
  if (import.meta.env.DEV) {
    const threshold = PERFORMANCE_THRESHOLDS[name as keyof typeof PERFORMANCE_THRESHOLDS];
    const status = threshold && value > threshold ? '❌ POOR' : '✅ GOOD';
    
    console.log(`🚀 Web Vital: ${name}`, {
      value: `${Math.round(value)}${name === 'CLS' ? '' : 'ms'}`,
      status,
      threshold: threshold ? `${threshold}${name === 'CLS' ? '' : 'ms'}` : 'N/A',
      id
    });
  }

  // In production, send to your analytics service
  if (import.meta.env.PROD) {
    // Example: Google Analytics 4
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', name, {
        event_category: 'Web Vitals',
        event_label: id,
        value: Math.round(value * 1000), // GA4 expects integer values
        non_interaction: true,
      });
    }

    // Example: Custom analytics endpoint
    // fetch('/api/analytics/web-vitals', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ name, value, id, timestamp: Date.now() })
    // }).catch(console.error);
  }
}

/**
 * Initialize Web Vitals monitoring
 * Call this once in your main.tsx
 */
export function initPerformanceMonitoring(): void {
  // Core Web Vitals
  onCLS(sendToAnalytics);
  onINP(sendToAnalytics); // INP replaced FID in web-vitals v4
  onLCP(sendToAnalytics);
  
  // Additional useful metrics
  onFCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
}

/**
 * Performance monitoring hook for React components
 * Use this to track specific component performance
 */
export function trackComponentPerformance(componentName: string) {
  const startTime = performance.now();
  
  return {
    finish: () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (import.meta.env.DEV) {
        console.log(`⚛️ Component: ${componentName} rendered in ${Math.round(duration)}ms`);
      }
      
      // Track slow components (> 50ms)
      if (duration > 50) {
        sendToAnalytics({
          name: 'component-render',
          value: duration,
          id: componentName,
          delta: duration,
          entries: []
        } as PerformanceMetric);
      }
    }
  };
}

/**
 * Track API call performance
 */
export function trackAPIPerformance(endpoint: string, startTime: number): void {
  const duration = performance.now() - startTime;
  
  if (import.meta.env.DEV) {
    console.log(`🌐 API: ${endpoint} completed in ${Math.round(duration)}ms`);
  }
  
  // Track slow API calls (> 1000ms)
  if (duration > 1000) {
    sendToAnalytics({
      name: 'api-slow',
      value: duration,
      id: endpoint,
      delta: duration,
      entries: []
    } as PerformanceMetric);
  }
}

/**
 * Australian business hours performance tracking
 * Tracks if performance issues correlate with business hours
 */
export function getAustralianBusinessHours(): string {
  const now = new Date();
  const australianTime = new Date(now.toLocaleString("en-US", {timeZone: "Australia/Sydney"}));
  const hour = australianTime.getHours();
  
  if (hour >= 9 && hour <= 17) {
    return 'business-hours';
  } else if (hour >= 6 && hour <= 22) {
    return 'extended-hours';
  } else {
    return 'off-hours';
  }
}
