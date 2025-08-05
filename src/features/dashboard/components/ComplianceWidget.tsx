import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Button } from '@/shared/components';
import { useAuth } from '@/features/auth';
import { useCompliance } from '@/features/compliance';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const ComplianceWidget: React.FC = () => {
  const { user } = useAuth();
  const { latestAssessment, isLoading } = useCompliance(user?.id || '');

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#22C55E'; // Green for good compliance
    if (score >= 60) return '#F59E0B'; // Yellow for moderate compliance
    return '#EF4444'; // Red for poor compliance
  };

  const score = latestAssessment?.score || 0;
  const scoreColor = getScoreColor(score);

  const data = {
    datasets: [
      {
        data: [score, 100 - score],
        backgroundColor: [scoreColor, '#E5E7EB'],
        borderWidth: 0,
        cutout: '70%',
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    maintainAspectRatio: false,
  };

  const recommendations = latestAssessment?.recommendations?.items || [];
  const topRecommendations = recommendations.slice(0, 3);

  return (
    <Card variant="elevated" className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>🏥 Compliance Health Check</span>
          {score >= 80 && <span className="text-green-600">✅ Healthy</span>}
          {score >= 60 && score < 80 && <span className="text-yellow-600">⚠️ Needs Attention</span>}
          {score < 60 && <span className="text-red-600">🚨 Critical</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-prevent-600"></div>
          </div>
        ) : latestAssessment ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Risk Meter */}
            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48">
                <Doughnut data={data} options={options} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold" style={{ color: scoreColor }}>
                      {score}%
                    </div>
                    <div className="text-sm text-gray-500">Compliance Score</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Last assessed: {new Date(latestAssessment.created_at).toLocaleDateString('en-AU')}
                </p>
              </div>
            </div>

            {/* Next Steps Checklist */}
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold mb-3">🎯 Priority Actions</h3>
              {topRecommendations.length > 0 ? (
                <ul className="space-y-2 flex-1">
                  {topRecommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-orange-500 mt-1">•</span>
                      <span className="text-sm text-gray-700">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex items-center justify-center flex-1">
                  <div className="text-center text-gray-500">
                    <div className="text-4xl mb-2">🎉</div>
                    <p className="text-sm">All compliance areas looking good!</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-semibold mb-2">Get Your Compliance Score</h3>
            <p className="text-gray-600 mb-4">
              Take our 20-question health check to identify compliance risks and get personalized recommendations.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-4 border-t">
        <div className="flex justify-between items-center w-full">
          {latestAssessment ? (
            <>
              <Link to="/compliance">
                <Button variant="outline" size="sm">
                  Retake Assessment
                </Button>
              </Link>
              {recommendations.length > 0 && (
                <Button size="sm" className="bg-prevent-600 hover:bg-prevent-700">
                  Generate Missing Documents
                </Button>
              )}
            </>
          ) : (
            <Link to="/compliance" className="w-full">
              <Button className="w-full bg-prevent-600 hover:bg-prevent-700">
                Start Compliance Check
              </Button>
            </Link>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ComplianceWidget;
