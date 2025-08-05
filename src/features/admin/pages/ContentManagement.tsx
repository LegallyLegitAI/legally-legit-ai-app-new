import { useState } from 'react';
import { useContentManager } from '../hooks/useAdminData';
import { Button, Card, CardHeader, CardTitle, CardContent, Input, Textarea } from '@/shared/components';
import type { LaunchpadGuide, ComplianceQA } from '../types';

const ContentManagement = () => {
  const { guides, qas, contentStats, loading, createGuide, updateGuide, deleteGuide, createQA, refetch } = useContentManager();

  if (loading) return <p>Loading content...</p>;

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Content Management</h2>
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Launchpad Guides</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Total: {contentStats.totalGuides}</p>
            <p>Published: {contentStats.publishedGuides}</p>
            <Button className="mt-2">Manage Guides</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Compliance Q&A</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Total: {contentStats.totalQAs}</p>
            <p>Published: {contentStats.publishedQAs}</p>
            <Button className="mt-2">Manage Q&As</Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Add forms for creating/editing content here */}
      <div className="mt-8">
        <h3 className="text-xl font-bold">Create New Content</h3>
        {/* Example form for Launchpad Guide */}
      </div>
    </div>
  );
};

export default ContentManagement;
