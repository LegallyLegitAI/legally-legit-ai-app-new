import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ContentService, GuideContent } from '../services/contentService';
import { AnalyticsService } from '../services/analyticsService';

const GuideDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [guide, setGuide] = useState<GuideContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    if (slug) {
      loadGuide(slug);
      startTime.current = Date.now();
      
      // Track time on page when user leaves
      return () => {
        if (startTime.current && guide) {
          const endTime = Date.now();
          const timeInSeconds = (endTime - startTime.current) / 1000;
          AnalyticsService.trackTimeOnGuide(guide.slug, timeInSeconds);
        }
      };
    }
    return undefined;
  }, [slug, guide]);

  const loadGuide = async (guideSlug: string) => {
    try {
      setIsLoading(true);
      const loadedGuide = await ContentService.getGuideBySlug(guideSlug);
      setGuide(loadedGuide);
      
      if (loadedGuide) {
        // Track that the guide has been read
        AnalyticsService.trackGuideRead(loadedGuide.meta.title, loadedGuide.slug);
      } 
    } catch (error) {
      console.error(`Failed to load guide with slug ${guideSlug}:`, error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCTAClick = (ctaType: 'generator' | 'health_check') => {
    if (guide) {
      AnalyticsService.trackCTAClick(ctaType, guide.slug);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-8">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold mb-4">Guide not found</h1>
        <p className="text-gray-600 mb-6">
          The guide you are looking for does not exist or has been moved.
        </p>
        <Link 
          to="/launchpad"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Legal Launchpad
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs and back link */}
        <div className="mb-8">
          <Link 
            to="/launchpad"
            className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Legal Launchpad
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-8 border-b pb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            {guide.meta.title}
          </h1>
          <div className="flex items-center text-sm text-gray-500 space-x-4">
            {guide.meta.datePublished && (
              <span>Published on {new Date(guide.meta.datePublished).toLocaleDateString('en-AU')}</span>
            )}
            <span>by {guide.meta.author || 'Legally Legit AI'}</span>
          </div>
        </header>

        {/* Article Body */}
        <article className="prose prose-lg max-w-none prose-blue">
          <ReactMarkdown>{guide.content}</ReactMarkdown>
        </article>
        
        {/* Cross-linking to other tools */}
        <div className="mt-12 pt-8 border-t border-dashed">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Ready to take action?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link 
              to="/generator"
              onClick={() => handleCTAClick('generator')}
              className="block p-6 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <h3 className="font-semibold text-lg mb-2 text-blue-800">Document Generator</h3>
              <p className="text-sm text-blue-700">Create your essential legal documents now.</p>
            </Link>
            <Link 
              to="/compliance"
              onClick={() => handleCTAClick('health_check')}
              className="block p-6 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <h3 className="font-semibold text-lg mb-2 text-green-800">Compliance Health Check</h3>
              <p className="text-sm text-green-700">Check your business's compliance status.</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideDetail;
