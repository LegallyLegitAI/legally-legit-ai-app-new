import Fuse from 'fuse.js';
import { GuideContent } from './contentService';

export interface SearchResult {
  item: GuideContent;
  score?: number;
  matches?: readonly Fuse.FuseResultMatch[];
}

export class SearchService {
  private fuse: Fuse<GuideContent>;

  constructor(guides: GuideContent[]) {
    // Configure Fuse.js for optimal search
    const options: Fuse.IFuseOptions<GuideContent> = {
      keys: [
        { name: 'meta.title', weight: 0.4 },
        { name: 'meta.description', weight: 0.3 },
        { name: 'content', weight: 0.2 },
        { name: 'meta.tags', weight: 0.1 },
      ],
      threshold: 0.3, // Lower threshold = more strict matching
      includeScore: true,
      includeMatches: true,
      minMatchCharLength: 2,
      shouldSort: true,
      ignoreLocation: true, // Don't consider position of match in text
      ignoreFieldNorm: true, // Don't normalize field length
    };

    this.fuse = new Fuse(guides, options);
  }

  search(query: string): SearchResult[] {
    if (!query.trim()) {
      return [];
    }

    const results = this.fuse.search(query);
    
    return results.map(result => ({
      item: result.item,
      score: result.score || 0,
      matches: result.matches,
    }));
  }

  // Get suggestions for autocomplete
  getSuggestions(query: string, maxSuggestions: number = 5): string[] {
    if (!query.trim() || query.length < 2) {
      return [];
    }

    const results = this.search(query);
    const suggestions = new Set<string>();

    results.forEach(result => {
      if (suggestions.size >= maxSuggestions) return;
      
      // Add title words that match
      const titleWords = result.item.meta.title.toLowerCase().split(' ');
      titleWords.forEach(word => {
        if (word.includes(query.toLowerCase()) && word.length > 2) {
          suggestions.add(word);
        }
      });

      // Add tag matches
      result.item.meta.tags?.forEach(tag => {
        if (tag.toLowerCase().includes(query.toLowerCase()) && tag.length > 2) {
          suggestions.add(tag);
        }
      });
    });

    return Array.from(suggestions).slice(0, maxSuggestions);
  }
}
