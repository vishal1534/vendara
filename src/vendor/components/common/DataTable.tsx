/**
 * Data Table Component
 * Reusable table with sorting, filtering, and pagination
 * Following Vendara design standards with best practices
 */

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../app/components/ui/table';
import { Button } from '../../../app/components/ui/button';
import { Input } from '../../../app/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../app/components/ui/select';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  align?: 'left' | 'right' | 'center';  // Column alignment
  width?: string;  // Column width (e.g., '120px', 'auto', '20%')
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  pageSize?: number;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  loading?: boolean;
  stickyHeader?: boolean;
  getRowClassName?: (item: T) => string;
  pageSizeOptions?: number[];
  showPageSizeSelector?: boolean;
  showPaginationInfo?: boolean;
  showFirstLastButtons?: boolean;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchable = true,
  searchPlaceholder = 'Search...',
  pageSize: initialPageSize = 10,
  emptyMessage = 'No data available',
  onRowClick,
  loading = false,
  stickyHeader = true,
  getRowClassName,
  pageSizeOptions = [10, 20, 50, 100],
  showPageSizeSelector = true,
  showPaginationInfo = true,
  showFirstLastButtons = true,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  const filteredData = searchQuery
    ? data.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : data;

  const sortedData = sortConfig
    ? [...filteredData].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === bValue) return 0;

        const comparison = aValue < bValue ? -1 : 1;
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      })
    : filteredData;

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  const handleSort = (key: string) => {
    setSortConfig((current) => {
      if (!current || current.key !== key) {
        return { key, direction: 'asc' };
      }
      if (current.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return null;
    });
  };

  const getAlignmentClass = (align?: 'left' | 'right' | 'center') => {
    switch (align) {
      case 'right':
        return 'text-right';
      case 'center':
        return 'text-center';
      default:
        return 'text-left';
    }
  };

  const getSortIcon = (columnKey: string) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-neutral-400" />;
    }
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className="ml-2 h-4 w-4 text-primary-700 font-bold" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4 text-primary-700 font-bold" />
    );
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      {searchable && (
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9"
            />
          </div>
          <div className="text-sm text-neutral-600">
            {filteredData.length} {filteredData.length === 1 ? 'result' : 'results'}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="border-2 border-neutral-200 rounded-xl overflow-hidden bg-white">
        <div className={stickyHeader ? 'overflow-x-auto' : 'overflow-x-auto'}>
          <Table>
            <TableHeader className={stickyHeader ? 'sticky top-0 z-10 bg-surface-2' : ''}>
              <TableRow className="bg-surface-2 hover:bg-surface-2 border-b-2 border-neutral-200">
                {columns.map((column) => {
                  const isActiveSortColumn = sortConfig?.key === column.key;
                  return (
                    <TableHead 
                      key={column.key}
                      className={`${getAlignmentClass(column.align)} text-xs font-semibold uppercase tracking-wider px-6 py-4 ${
                        isActiveSortColumn ? 'text-primary-700' : 'text-neutral-600'
                      }`}
                      style={{ width: column.width }}
                    >
                      {column.sortable ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort(column.key)}
                          className={`-ml-3 h-9 font-semibold uppercase hover:bg-neutral-200 ${getAlignmentClass(column.align)} ${
                            isActiveSortColumn ? 'text-primary-700' : 'text-neutral-600'
                          }`}
                        >
                          {column.label}
                          {getSortIcon(column.key)}
                        </Button>
                      ) : (
                        <span className="font-semibold uppercase">{column.label}</span>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-neutral-200 border-t-primary-600 rounded-full animate-spin" />
                      <p className="text-sm text-neutral-500">Loading...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-12 h-12 text-neutral-300" />
                      <p className="text-neutral-600 font-medium">{emptyMessage}</p>
                      {searchQuery && (
                        <p className="text-sm text-neutral-500">
                          Try adjusting your search query
                        </p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item, index) => (
                  <TableRow 
                    key={index} 
                    onClick={() => onRowClick && onRowClick(item)}
                    className={`
                      ${onRowClick ? 'cursor-pointer hover:bg-neutral-50' : 'hover:bg-neutral-50/50'}
                      transition-colors
                      ${getRowClassName ? getRowClassName(item) : ''}
                    `}
                  >
                    {columns.map((column) => (
                      <TableCell 
                        key={column.key}
                        className={`${getAlignmentClass(column.align)} px-6 py-4`}
                      >
                        {column.render ? column.render(item) : item[column.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          {showPaginationInfo && (
            <div className="flex items-center gap-4">
              <div className="text-sm text-neutral-600">
                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">{Math.min(startIndex + pageSize, sortedData.length)}</span> of{' '}
                <span className="font-medium">{sortedData.length}</span>
              </div>
              {showPageSizeSelector && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-600">Rows per page:</span>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(value) => {
                      const newPageSize = parseInt(value, 10);
                      setCurrentPage(1);
                      setPageSize(newPageSize);
                    }}
                  >
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {pageSizeOptions.map((option) => (
                        <SelectItem key={option} value={option.toString()}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}
          <div className="flex items-center gap-2">
            {showFirstLastButtons && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="h-8 px-2"
                title="First page"
              >
                <ChevronsLeft className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <div className="text-sm font-medium text-neutral-700 px-2">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
            {showFirstLastButtons && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="h-8 px-2"
                title="Last page"
              >
                <ChevronsRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      )}
      
      {/* Results count for single page */}
      {!loading && totalPages <= 1 && sortedData.length > 0 && (
        <div className="px-2 text-sm text-neutral-600">
          Showing <span className="font-medium">{sortedData.length}</span>{' '}
          {sortedData.length === 1 ? 'result' : 'results'}
        </div>
      )}
    </div>
  );
}