/**
 * Export Utility Functions
 * CSV export helpers for admin portal
 */

import { toast } from 'sonner';

export function exportToCSV(
  data: any[],
  headers: string[],
  fileName: string
) {
  const rows = data.map(item => headers.map(header => {
    const value = item[header];
    // Handle values that might contain commas
    if (typeof value === 'string' && value.includes(',')) {
      return `"${value}"`;
    }
    return value || '';
  }));

  const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  
  URL.revokeObjectURL(url);
  toast.success(`${fileName} exported successfully`);
}
