/**
 * PerformancePage
 * Vendor performance analytics and metrics dashboard
 * Redesigned following industry best practices (Uber, DoorDash, Amazon Seller Central)
 */

import { useState, useMemo } from 'react';
import { mockPerformanceMetrics, mockVolumeTrend, mockVendorIssues } from '@/vendor/mocks/performance.mock';
import { 
  TrendingUp, 
  TrendingDown, 
  Award, 
  Target, 
  CheckCircle, 
  Clock, 
  Package,
  AlertTriangle,
  ChevronRight,
  Info,
  Download,
  Zap,
  ThumbsUp,
} from 'lucide-react';
import { Button } from '../../../../app/components/ui/button';
import { Badge } from '../../../../app/components/ui/badge';
import { DateRangePicker, type DateRange } from '../../../components/common/DateRangePicker';
import { OrderVolumeChart } from '../components/OrderVolumeChart';
import { formatCurrency } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';
import { generatePerformanceReport } from '../../../utils/documentDownload';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

export function PerformancePage() {
  // Date range filter - default to last 30 days
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const start = new Date();
    start.setDate(start.getDate() - 29);
    start.setHours(0, 0, 0, 0);
    return { from: start, to: end };
  });

  const [selectedPeriod, setSelectedPeriod] = useState('30days');

  // Calculate performance tier
  const getPerformanceTier = (score: number) => {
    if (score >= 90) return { name: 'Gold', color: 'text-warning-700', bgColor: 'bg-warning-50', borderColor: 'border-warning-200' };
    if (score >= 80) return { name: 'Silver', color: 'text-neutral-600', bgColor: 'bg-neutral-50', borderColor: 'border-neutral-300' };
    if (score >= 70) return { name: 'Bronze', color: 'text-orange-700', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' };
    return { name: 'Standard', color: 'text-neutral-700', bgColor: 'bg-neutral-100', borderColor: 'border-neutral-200' };
  };

  const tier = getPerformanceTier(mockPerformanceMetrics.overallScore);

  // Calculate trend (mock previous period data)
  const previousScore = 88;
  const scoreTrend = mockPerformanceMetrics.overallScore - previousScore;

  // Platform benchmarks
  const platformBenchmarks = {
    acceptanceRate: 85,
    onTimeDelivery: 90,
    responseTime: 5.0,
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Performance</h1>
        <p className="text-neutral-600 mt-1">
          Track your metrics and improve your standing
        </p>
      </div>

      {/* Performance Tier Banner */}
      <div className={`border-2 ${tier.borderColor} ${tier.bgColor} rounded-xl p-6`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-white border-2 border-warning-300 flex items-center justify-center">
                <Award className="w-8 h-8 text-warning-600" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className={`text-2xl font-bold ${tier.color}`}>{tier.name} Partner</h2>
                {scoreTrend > 0 && (
                  <Badge className="bg-success-100 text-success-700 border-success-200">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +{scoreTrend} pts
                  </Badge>
                )}
              </div>
              <p className="text-neutral-700 mb-3">
                You're performing {mockPerformanceMetrics.overallScore >= 90 ? 'exceptionally well' : 'well'}! Keep up the great work to maintain your {tier.name} status.
              </p>
              <div className="flex items-center gap-6 text-sm">
                <div>
                  <span className="text-neutral-600">Performance Score</span>
                  <div className="text-2xl font-bold text-neutral-900 mt-1">{mockPerformanceMetrics.overallScore}/100</div>
                </div>
                <div className="h-12 w-px bg-neutral-300" />
                <div>
                  <span className="text-neutral-600">This Period Earnings</span>
                  <div className="text-2xl font-bold text-neutral-900 mt-1">{formatCurrency(mockPerformanceMetrics.totalRevenue)}</div>
                </div>
                <div className="h-12 w-px bg-neutral-300" />
                <div>
                  <span className="text-neutral-600">Orders Completed</span>
                  <div className="text-2xl font-bold text-neutral-900 mt-1">{mockPerformanceMetrics.totalOrdersCompleted}</div>
                </div>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              generatePerformanceReport({
                vendorName: 'Chauhan Cement Suppliers',
                reportPeriod: `${formatDate(dateRange.from)} to ${formatDate(dateRange.to)}`,
                overallScore: mockPerformanceMetrics.overallScore,
                rating: mockPerformanceMetrics.rating,
                acceptanceRate: mockPerformanceMetrics.acceptanceRate,
                onTimeDeliveryRate: mockPerformanceMetrics.onTimeDeliveryRate,
                averageResponseTime: mockPerformanceMetrics.averageResponseTime,
                ordersCompleted: mockPerformanceMetrics.ordersCompleted,
                totalRevenue: mockPerformanceMetrics.totalRevenue,
              });
            }}
            className="border-2 flex-shrink-0"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[200px] h-10 border-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
          {selectedPeriod === 'custom' && (
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
            />
          )}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Acceptance Rate */}
        <MetricCard
          icon={CheckCircle}
          label="Acceptance Rate"
          value={`${mockPerformanceMetrics.acceptanceRate.toFixed(1)}%`}
          target={90}
          current={mockPerformanceMetrics.acceptanceRate}
          benchmark={platformBenchmarks.acceptanceRate}
          description={`${mockPerformanceMetrics.offersAccepted} of ${mockPerformanceMetrics.offersReceived} offers accepted`}
          trend="+2.3%"
          trendDirection="up"
        />

        {/* On-Time Delivery */}
        <MetricCard
          icon={Package}
          label="On-Time Delivery"
          value={`${mockPerformanceMetrics.onTimeDeliveryRate.toFixed(1)}%`}
          target={95}
          current={mockPerformanceMetrics.onTimeDeliveryRate}
          benchmark={platformBenchmarks.onTimeDelivery}
          description={`${mockPerformanceMetrics.ordersOnTime} of ${mockPerformanceMetrics.ordersDelivered} on time`}
          trend="+1.4%"
          trendDirection="up"
        />

        {/* Response Time */}
        <MetricCard
          icon={Clock}
          label="Avg Response Time"
          value={`${mockPerformanceMetrics.averageResponseTime.toFixed(1)}m`}
          target={5}
          current={mockPerformanceMetrics.averageResponseTime}
          benchmark={platformBenchmarks.responseTime}
          description={`Range: ${mockPerformanceMetrics.fastestResponseTime.toFixed(1)}m - ${mockPerformanceMetrics.slowestResponseTime.toFixed(1)}m`}
          trend="-0.8m"
          trendDirection="up"
          invertColors
        />
      </div>

      {/* Actionable Insights */}
      <div className="bg-primary-50 border-2 border-primary-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Zap className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-neutral-900 mb-2">Ways to Improve</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-neutral-700">
                  <span className="font-medium">Accept more offers:</span> Your acceptance rate of {mockPerformanceMetrics.acceptanceRate.toFixed(1)}% is good, but reaching 95% will boost your score and order priority.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-neutral-700">
                  <span className="font-medium">Respond faster:</span> Average {mockPerformanceMetrics.averageResponseTime.toFixed(1)}m is excellent. Keep it under 5 minutes to maintain Gold tier.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-neutral-700">
                  <span className="font-medium">On-time delivery:</span> You're doing great at {mockPerformanceMetrics.onTimeDeliveryRate.toFixed(1)}%! Just {Math.max(0, 95 - mockPerformanceMetrics.onTimeDeliveryRate).toFixed(0)}% more to hit the 95% target.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="bg-white border-2 border-neutral-200 rounded-xl p-6">
        <h3 className="font-semibold text-neutral-900 mb-4">How Your Score is Calculated</h3>
        <div className="space-y-4">
          <ScoreBreakdownRow
            label="Acceptance Rate"
            weight={30}
            score={mockPerformanceMetrics.acceptanceRate}
            maxScore={100}
          />
          <ScoreBreakdownRow
            label="On-Time Delivery"
            weight={40}
            score={mockPerformanceMetrics.onTimeDeliveryRate}
            maxScore={100}
          />
          <ScoreBreakdownRow
            label="Response Time"
            weight={30}
            score={85}
            maxScore={100}
          />
        </div>
        <div className="mt-6 pt-6 border-t-2 border-neutral-200">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-neutral-900">Overall Score</span>
            <span className="text-2xl font-bold text-neutral-900">{mockPerformanceMetrics.overallScore}/100</span>
          </div>
        </div>
      </div>

      {/* Order Volume Chart */}
      <div>
        <OrderVolumeChart
          data={mockVolumeTrend}
          title="Order Volume & Revenue Trend"
          subtitle="Last 3 months"
        />
      </div>

      {/* Recent Issues (if any) */}
      {mockVendorIssues.length > 0 && (
        <div className="bg-white border-2 border-neutral-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-neutral-900">Recent Issues</h3>
            <Badge variant="outline" className="text-neutral-600">
              {mockVendorIssues.filter(i => i.status !== 'resolved').length} Open
            </Badge>
          </div>
          <div className="space-y-3">
            {mockVendorIssues.slice(0, 3).map((issue) => (
              <IssueRow key={issue.id} issue={issue} />
            ))}
          </div>
          {mockVendorIssues.length > 3 && (
            <Button variant="ghost" size="sm" className="w-full mt-4 text-primary-600 hover:text-primary-700">
              View All Issues
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// Metric Card Component
interface MetricCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  target: number;
  current: number;
  benchmark: number;
  description: string;
  trend?: string;
  trendDirection?: 'up' | 'down';
  invertColors?: boolean;
}

function MetricCard({
  icon: Icon,
  label,
  value,
  target,
  current,
  benchmark,
  description,
  trend,
  trendDirection,
  invertColors = false,
}: MetricCardProps) {
  const isAboveBenchmark = invertColors 
    ? current <= benchmark 
    : current >= benchmark;
  
  const isAboveTarget = invertColors
    ? current <= target
    : current >= target;

  const statusColor = isAboveTarget 
    ? 'text-success-600' 
    : current >= benchmark 
    ? 'text-warning-600' 
    : 'text-error-600';

  const progressPercentage = Math.min((current / target) * 100, 100);

  return (
    <div className="bg-white border-2 border-neutral-200 rounded-xl p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <p className="text-sm text-neutral-600">{label}</p>
            <p className="text-2xl font-bold text-neutral-900 mt-0.5">{value}</p>
          </div>
        </div>
        {trend && (
          <Badge variant="outline" className={`${
            trendDirection === 'up' 
              ? 'bg-success-50 text-success-700 border-success-200' 
              : 'bg-error-50 text-error-700 border-error-200'
          }`}>
            {trendDirection === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            {trend}
          </Badge>
        )}
      </div>
      
      <p className="text-xs text-neutral-600 mb-3">{description}</p>
      
      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-neutral-600 mb-1">
          <span>Target: {target}{invertColors ? 'm' : '%'}</span>
          <span className={statusColor}>
            {isAboveTarget ? <ThumbsUp className="w-3 h-3 inline mr-1" /> : <Target className="w-3 h-3 inline mr-1" />}
            {isAboveTarget ? 'Target met' : `${Math.abs(current - target).toFixed(1)} to go`}
          </span>
        </div>
        <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${
              isAboveTarget ? 'bg-success-500' : 'bg-warning-500'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Benchmark comparison */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-neutral-600">Platform avg:</span>
        <span className={isAboveBenchmark ? 'text-success-700 font-medium' : 'text-neutral-700'}>
          {benchmark}{invertColors ? 'm' : '%'}
        </span>
        {isAboveBenchmark && (
          <Badge variant="outline" className="bg-success-50 text-success-700 border-success-200 text-[10px] px-1.5 py-0">
            Above average
          </Badge>
        )}
      </div>
    </div>
  );
}

// Score Breakdown Row
interface ScoreBreakdownRowProps {
  label: string;
  weight: number;
  score: number;
  maxScore: number;
}

function ScoreBreakdownRow({ label, weight, score, maxScore }: ScoreBreakdownRowProps) {
  const percentage = (score / maxScore) * 100;
  const weightedScore = (score / maxScore) * weight;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-neutral-900">{label}</span>
          <span className="text-xs text-neutral-500">({weight}% weight)</span>
        </div>
        <span className="text-sm font-semibold text-neutral-900">{score.toFixed(1)}/{maxScore}</span>
      </div>
      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary-600 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-end mt-1">
        <span className="text-xs text-neutral-600">Contributes {weightedScore.toFixed(1)} pts to overall score</span>
      </div>
    </div>
  );
}

// Issue Row Component
interface IssueRowProps {
  issue: any;
}

function IssueRow({ issue }: IssueRowProps) {
  const severityConfig = {
    minor: { icon: Info, color: 'text-primary-600', bgColor: 'bg-primary-50' },
    warning: { icon: AlertTriangle, color: 'text-warning-600', bgColor: 'bg-warning-50' },
    major: { icon: AlertTriangle, color: 'text-error-600', bgColor: 'bg-error-50' },
  };

  const config = severityConfig[issue.severity as keyof typeof severityConfig] || severityConfig.minor;
  const SeverityIcon = config.icon;

  return (
    <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
      <div className={`w-8 h-8 rounded-lg ${config.bgColor} flex items-center justify-center flex-shrink-0`}>
        <SeverityIcon className={`w-4 h-4 ${config.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-sm font-medium text-neutral-900">{issue.description}</p>
          <Badge variant="outline" className={`flex-shrink-0 text-xs ${
            issue.status === 'resolved' 
              ? 'bg-success-50 text-success-700 border-success-200' 
              : 'bg-warning-50 text-warning-700 border-warning-200'
          }`}>
            {issue.status === 'resolved' ? 'Resolved' : 'Open'}
          </Badge>
        </div>
        <p className="text-xs text-neutral-600">Order {issue.orderId} • {formatDate(issue.reportedAt)}</p>
        {issue.resolution && (
          <p className="text-xs text-neutral-600 mt-1">{issue.resolution}</p>
        )}
      </div>
    </div>
  );
}