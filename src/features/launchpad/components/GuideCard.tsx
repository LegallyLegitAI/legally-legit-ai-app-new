import React from 'react';
import { Link } from 'react-router-dom';
import { GuideContent } from '../services/contentService';
import { AnalyticsService } from '../services/analyticsService';

interface GuideCardProps {
  guide: GuideContent;
  searchScore?: number;
}

const GuideCard: React.FC<GuideCardProps> = ({ guide, searchScore }) => {
  const handleCardClick = () => {
    AnalyticsService.trackGuideRead(guide.meta.title, guide.slug);
  };

  const getReadingTime = (content: string): string => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-AU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
              <Link 
                to={`/launchpad/${guide.slug}`}
                onClick={handleCardClick}
                className="hover:text-blue-600 transition-colors"
              >
                {guide.meta.title}
              </Link>
            </h3>
            
            {/* Meta information */}
            <div className="flex items-center text-sm text-gray-500 space-x-4 mb-3">
              {guide.meta.datePublished && (
                <span>{formatDate(guide.meta.datePublished)}</span>
              )}
              <span>{getReadingTime(guide.content)}</span>
              {guide.meta.author && (
                <span>by {guide.meta.author}</span>
              )}
            </div>
          </div>
          
          {/* Search score badge (only shown in search results) */}
          {searchScore !== undefined && (
            <div className="ml-4 flex-shrink-0">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {Math.round((1 - searchScore) * 100)}% match
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {guide.meta.description}
        </p>

        {/* Tags */}
        {guide.meta.tags && guide.meta.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {guide.meta.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {tag}
              </span>
            ))}
            {guide.meta.tags.length > 3 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                +{guide.meta.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Read More Button */}
        <div className="flex items-center justify-between">
          <Link
            to={`/launchpad/${guide.slug}`}
            onClick={handleCardClick}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm group"
          >
            Read Guide
            <svg 
              className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          
          {/* Quick actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => AnalyticsService.trackGuideAction('share', guide.slug)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="Share guide"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideCard;
