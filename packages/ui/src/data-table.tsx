import { cn } from './utils';
import React from 'react';

interface DataTableProps<T> {
  columns: {
    key: string;
    header: string;
    sortable?: boolean;
    render?: (item: T) => React.ReactNode;
  }[];
  data: T[];
  keyField: keyof T;
  loading?: boolean;
  onRowClick?: (item: T) => void;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyField,
  loading,
  onRowClick,
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn('overflow-x-auto rounded-xl border border-surface-container', className)}>
      <table className="w-full">
        <thead>
          <tr className="bg-surface-gray border-b border-surface-container">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-label-sm text-on-surface-variant font-semibold"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-12 text-on-surface-variant">
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-12 text-on-surface-variant">
                No data found
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr
                key={String(item[keyField])}
                className={cn(
                  'border-b border-surface-container/50 hover:bg-surface-container/20 transition-colors',
                  onRowClick && 'cursor-pointer',
                )}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-body-md text-on-surface">
                    {col.render ? col.render(item) : String(item[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
