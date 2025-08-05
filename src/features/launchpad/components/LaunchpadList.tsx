import React, { useState, useEffect } from 'react';
import { ContentService, GuideContent } from '../services/contentService';
import { SearchResult } from '../services/searchService';
import LaunchpadSearch from './LaunchpadSearch';
import GuideCard from './GuideCard';
import { AnalyticsService } from '../services/analyticsService';

const LaunchpadList: React.FC = () => {
  const [guides, setGuides] = useState<GuideContent[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadGuides();
  }, []);

  const loadGuides = async () => {
    try {
      setIsLoading(true);
      const allGuides = await ContentService.getAllGuides();
      setGuides(allGuides);
    } catch (error) {
      console.error('Failed to load guides:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchResults = (results: SearchResult[]) => {
    setSearchResults(results);
    setIsSearching(results.length > 0);
  };

  const handleCTAClick = (ctaType: 'generator' | 'health_check') => {
    AnalyticsService.trackCTAClick(ctaType, 'launchpad_list');
  };

  const displayGuides = isSearching 
    ? searchResults.map(result => ({ ...result.item, searchScore: result.score }))
    : guides;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading legal guides...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Legal Launchpad
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Your comprehensive guide to Australian business law. Navigate legal requirements, 
            stay compliant, and protect your business with our expert-curated resources.
          </p>
          
          {/* Search */}
          <LaunchpadSearch 
            guides={guides}
            onResults={handleSearchResults}
            placeholder="Search guides by topic, keywords, or legal area..."
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
              Quick Actions
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Generate Legal Documents</h3>
                <p className="text-gray-600 mb-4">Create customised legal documents for your business needs.</p>
                <a
                  href="/generator"
                  onClick={() => handleCTAClick('generator')}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start Generator
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>

              <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 transition-colors">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Compliance Health Check</h3>
                <p className="text-gray-600 mb-4">Assess your business compliance and identify potential risks.</p>
                <a
                  href="/compliance"
                  onClick={() => handleCTAClick('health_check')}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Start Check
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Search Results Info */}
        {isSearching && (
          <div className="mb-6">
            <p className="text-gray-600">
              Found {searchResults.length} guide{searchResults.length !== 1 ? 's' : ''} matching your search
            </p>
          </div>
        )}

        {/* Guides Grid */}
        {displayGuides.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayGuides.map((guide) => (
              <GuideCard
                key={guide.id}
                guide={guide}
                searchScore={(guide as any).searchScore}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isSearching ? 'No guides found' : 'No guides available'}
            </h3>
            <p className="text-gray-600">
              {isSearching 
                ? 'Try adjusting your search terms or browse all guides.' 
                : 'Guides are being prepared and will be available soon.'}
            </p>
            {isSearching && (
              <button
                onClick={() => {
                  setSearchResults([]);
                  setIsSearching(false);
                }}
                className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
              >
                View all guides
              </button>
            )}
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Stay Updated with Legal Changes
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Australian business law is constantly evolving. Subscribe to our newsletter 
            to get updates on new guides, legal changes, and compliance requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaunchpadList;
