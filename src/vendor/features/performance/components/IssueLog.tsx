/**
 * IssueLog Component
 * Displays vendor issue history with filters
 */

import { useState } from 'react';
import { AlertCircle, AlertTriangle, Info, Calendar, Package, CheckCircle2 } from 'lucide-react';
import { formatDate, formatTime } from '../../../utils/formatDate';
import type { VendorIssue } from '../../../types/performance';
import { Badge } from '../../../../app/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../app/components/ui/select';

interface IssueLogProps {
  issues: VendorIssue[];
}

export function IssueLog({ issues }: IssueLogProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'resolved'>('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'warning' | 'minor' | 'major'>('all');

  // Filter issues
  const filteredIssues = issues.filter((issue) => {
    if (statusFilter !== 'all' && issue.status !== statusFilter) return false;
    if (severityFilter !== 'all' && issue.severity !== severityFilter) return false;
    return true;
  });

  // Sort by date (newest first)
  const sortedIssues = [...filteredIssues].sort(
    (a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()
  );

  // Severity badge config
  const getSeverityBadge = (severity: VendorIssue['severity']) => {
    const config = {
      warning: { 
        label: 'Warning', 
        className: 'bg-[#D2B48C] text-neutral-900',
        icon: AlertTriangle 
      },
      minor: { 
        label: 'Minor', 
        className: 'bg-neutral-100 text-neutral-700 border-neutral-200',
        icon: AlertCircle 
      },
      major: { 
        label: 'Major', 
        className: 'bg-red-100 text-red-800 border-red-200',
        icon: AlertCircle 
      },
    };
    return config[severity];
  };

  // Status badge config
  const getStatusBadge = (status: VendorIssue['status']) => {
    const config = {
      open: { 
        label: 'Open', 
        className: 'bg-red-100 text-red-800 border-red-200' 
      },
      resolved: { 
        label: 'Resolved', 
        className: 'bg-[#2F3E46] text-white' 
      },
    };
    return config[status];
  };

  return (
    <div className="bg-white rounded-lg border border-neutral-200">
      {/* Header with Filters */}
      <div className="p-6 border-b border-neutral-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">Issue Log</h3>
            <p className="text-sm text-neutral-600 mt-1">
              {sortedIssues.length} {sortedIssues.length === 1 ? 'issue' : 'issues'}
              {statusFilter !== 'all' || severityFilter !== 'all' ? ' (filtered)' : ''}
            </p>
          </div>
          <AlertCircle className="size-5 text-[#2F3E46]" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="w-40">
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-40">
            <Select value={severityFilter} onValueChange={(value: any) => setSeverityFilter(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="minor">Minor</SelectItem>
                <SelectItem value="major">Major</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Issue List */}
      <div className="divide-y divide-neutral-200">
        {sortedIssues.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle2 className="size-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-600 font-medium">No issues found</p>
            <p className="text-sm text-neutral-500 mt-1">
              {statusFilter !== 'all' || severityFilter !== 'all' 
                ? 'Try adjusting your filters' 
                : 'Great job maintaining quality standards!'}
            </p>
          </div>
        ) : (
          sortedIssues.map((issue) => {
            const severityConfig = getSeverityBadge(issue.severity);
            const statusConfig = getStatusBadge(issue.status);
            const SeverityIcon = severityConfig.icon;

            return (
              <div key={issue.id} className="p-6 hover:bg-neutral-50 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`mt-0.5 p-2 rounded-lg ${
                    issue.severity === 'major' ? 'bg-red-50' :
                    issue.severity === 'warning' ? 'bg-[#D2B48C]/20' :
                    'bg-neutral-100'
                  }`}>
                    <SeverityIcon className={`size-4 ${
                      issue.severity === 'major' ? 'text-red-700' :
                      issue.severity === 'warning' ? 'text-[#8B7355]' :
                      'text-neutral-600'
                    }`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={severityConfig.className}>
                            {severityConfig.label}
                          </Badge>
                          <Badge className={statusConfig.className}>
                            {statusConfig.label}
                          </Badge>
                        </div>
                        <h4 className="font-medium text-neutral-900">{issue.description}</h4>
                      </div>
                    </div>

                    {/* Order Info */}
                    <div className="text-sm text-neutral-600 mb-2">
                      Order {issue.orderId} • Reported {formatDate(issue.reportedAt)}
                    </div>

                    {/* Resolution */}
                    {issue.resolution && (
                      <div className="mt-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="size-4 text-[#2F3E46] mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-neutral-700 font-medium mb-1">Resolution</p>
                            <p className="text-sm text-neutral-600">{issue.resolution}</p>
                            {issue.resolvedAt && (
                              <p className="text-xs text-neutral-500 mt-1">
                                Resolved {formatDate(issue.resolvedAt)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Summary Footer */}
      {sortedIssues.length > 0 && (
        <div className="p-4 bg-neutral-50 border-t border-neutral-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600">
              Showing {sortedIssues.length} of {issues.length} total issues
            </span>
            <span className="text-neutral-600">
              {issues.filter(i => i.status === 'resolved').length} resolved
            </span>
          </div>
        </div>
      )}
    </div>
  );
}