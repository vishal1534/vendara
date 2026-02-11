/**
 * PerformanceScore Component
 * Displays vendor's overall performance score with circular gauge
 */

import { Award, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';

interface PerformanceScoreProps {
  score: number; // 0-100
  rating: 'poor' | 'fair' | 'good' | 'excellent';
  previousScore?: number; // For trend comparison
  period?: string; // e.g., "Last 30 days"
}

export function PerformanceScore({ 
  score, 
  rating, 
  previousScore,
  period = "Last 30 days" 
}: PerformanceScoreProps) {
  // Calculate trend
  const trend = previousScore ? score - previousScore : null;
  const trendDirection = trend ? (trend > 0 ? 'up' : trend < 0 ? 'down' : 'stable') : null;

  // Rating configuration
  const ratingConfig = {
    excellent: { 
      label: 'Excellent', 
      color: 'bg-[#2F3E46] text-white',
      description: 'Outstanding performance' 
    },
    good: { 
      label: 'Good', 
      color: 'bg-[#4A5C6A] text-white',
      description: 'Strong performance' 
    },
    fair: { 
      label: 'Fair', 
      color: 'bg-[#D2B48C] text-neutral-900',
      description: 'Needs improvement' 
    },
    poor: { 
      label: 'Poor', 
      color: 'bg-red-100 text-red-800 border-red-200',
      description: 'Requires attention' 
    },
  };

  const config = ratingConfig[rating];

  // Calculate circle parameters for SVG gauge
  const size = 200;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const center = size / 2;

  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">Performance Score</h3>
          <p className="text-sm text-neutral-600 mt-1">{period}</p>
        </div>
        <Award className="size-5 text-[#2F3E46]" />
      </div>

      {/* Circular Gauge */}
      <div className="flex flex-col items-center">
        <div className="relative">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth={strokeWidth}
            />
            
            {/* Progress circle */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#2F3E46"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={circumference - progress}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Score in center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-5xl font-bold text-neutral-900">{score}</div>
            <div className="text-sm text-neutral-600 mt-1">out of 100</div>
          </div>
        </div>

        {/* Rating Badge */}
        <Badge className={`mt-6 px-4 py-1.5 text-sm font-medium ${config.color}`}>
          {config.label}
        </Badge>

        {/* Description */}
        <p className="text-sm text-neutral-600 mt-2">{config.description}</p>

        {/* Trend Indicator */}
        {trend !== null && (
          <div className="flex items-center gap-2 mt-4 text-sm">
            {trendDirection === 'up' && (
              <>
                <TrendingUp className="size-4 text-green-600" />
                <span className="text-green-700 font-medium">+{trend.toFixed(1)} from last period</span>
              </>
            )}
            {trendDirection === 'down' && (
              <>
                <TrendingDown className="size-4 text-red-600" />
                <span className="text-red-700 font-medium">{trend.toFixed(1)} from last period</span>
              </>
            )}
            {trendDirection === 'stable' && (
              <>
                <Minus className="size-4 text-neutral-500" />
                <span className="text-neutral-600">No change from last period</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Score Breakdown Info */}
      <div className="mt-6 pt-6 border-t border-neutral-200">
        <p className="text-xs text-neutral-600 leading-relaxed">
          Your performance score is calculated based on acceptance rate (30%), on-time delivery (40%), 
          and response time (30%). Maintain a score above 75 to remain in good standing.
        </p>
      </div>
    </div>
  );
}