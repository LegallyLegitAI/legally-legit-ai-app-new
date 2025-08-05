import { MarkdownContent, parseMarkdown } from '@/lib/markdown';

// Import markdown content as text
import guide1 from '../../../../content/launchpad/guide-1.md?raw';
import guide2 from '../../../../content/launchpad/guide-2.md?raw';
import employmentGuide from '../../../../content/launchpad/employment-law-guide.md?raw';
import websiteGuide from '../../../../content/launchpad/website-legals-guide.md?raw';

export interface GuideContent extends MarkdownContent {
  id: string;
  slug: string;
}

// Static content mapping
const contentMap: Record<string, string> = {
  'business-registration': guide1,
  'intellectual-property': guide2,
  'employment-law': employmentGuide,
  'website-legals': websiteGuide,
};

export class ContentService {
  private static guides: GuideContent[] | null = null;

  static async getAllGuides(): Promise<GuideContent[]> {
    if (this.guides) {
      return this.guides;
    }

    this.guides = Object.entries(contentMap).map(([slug, content]) => {
      const parsed = parseMarkdown(content, slug);
      return {
        id: slug,
        slug,
        ...parsed,
      };
    });

    return this.guides;
  }

  static async getGuideBySlug(slug: string): Promise<GuideContent | null> {
    const guides = await this.getAllGuides();
    return guides.find(guide => guide.slug === slug) || null;
  }

  static async searchGuides(query: string): Promise<GuideContent[]> {
    const guides = await this.getAllGuides();
    
    if (!query.trim()) {
      return guides;
    }

    const lowerQuery = query.toLowerCase();
    
    return guides.filter(guide => {
      const searchText = `${guide.meta.title} ${guide.meta.description} ${guide.content} ${guide.meta.tags?.join(' ') || ''}`.toLowerCase();
      return searchText.includes(lowerQuery);
    });
  }
}
