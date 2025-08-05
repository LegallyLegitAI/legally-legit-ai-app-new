// Google Analytics 4 event tracking for Legal Launchpad
export interface GAEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export class AnalyticsService {
  private static isGALoaded(): boolean {
    return typeof window !== 'undefined' && typeof window.gtag === 'function';
  }

  // Track when a user reads a guide
  static trackGuideRead(guideTitle: string, guideSlug: string): void {
    if (!this.isGALoaded()) {
      console.log('GA not loaded, would track guide_read:', { guideTitle, guideSlug });
      return;
    }

    window.gtag!('event', 'guide_read', {
      event_category: 'Legal Launchpad',
      event_label: guideTitle,
      custom_parameters: {
        guide_slug: guideSlug,
        page_location: window.location.href,
      }
    });
  }

  // Track when a user clicks a CTA (Call-to-Action)
  static trackCTAClick(ctaType: 'generator' | 'health_check' | 'contact', guideContext?: string): void {
    if (!this.isGALoaded()) {
      console.log('GA not loaded, would track cta_clicked:', { ctaType, guideContext });
      return;
    }

    window.gtag!('event', 'cta_clicked', {
      event_category: 'Legal Launchpad',
      event_label: ctaType,
      custom_parameters: {
        cta_type: ctaType,
        guide_context: guideContext || 'unknown',
        page_location: window.location.href,
      }
    });
  }

  // Track search usage
  static trackSearch(query: string, resultsCount: number): void {
    if (!this.isGALoaded()) {
      console.log('GA not loaded, would track search:', { query, resultsCount });
      return;
    }

    window.gtag!('event', 'search', {
      search_term: query,
      event_category: 'Legal Launchpad',
      custom_parameters: {
        results_count: resultsCount,
        page_location: window.location.href,
      }
    });
  }

  // Track time spent reading a guide
  static trackTimeOnGuide(guideSlug: string, timeInSeconds: number): void {
    if (!this.isGALoaded()) {
      console.log('GA not loaded, would track time_on_guide:', { guideSlug, timeInSeconds });
      return;
    }

    // Only track if user spent more than 30 seconds
    if (timeInSeconds > 30) {
      window.gtag!('event', 'engagement_time', {
        event_category: 'Legal Launchpad',
        event_label: guideSlug,
        value: Math.round(timeInSeconds),
        custom_parameters: {
          guide_slug: guideSlug,
          time_seconds: timeInSeconds,
        }
      });
    }
  }

  // Track download/print actions
  static trackGuideAction(action: 'download' | 'print' | 'share', guideSlug: string): void {
    if (!this.isGALoaded()) {
      console.log('GA not loaded, would track guide_action:', { action, guideSlug });
      return;
    }

    window.gtag!('event', 'guide_action', {
      event_category: 'Legal Launchpad',
      event_label: action,
      custom_parameters: {
        action_type: action,
        guide_slug: guideSlug,
        page_location: window.location.href,
      }
    });
  }
}
