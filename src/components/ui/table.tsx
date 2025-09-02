"use client";

import {
  ChevronDown,
  ChevronUp,
  Filter,
  MoreHorizontal,
  Search,
} from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton, SkeletonAvatar } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type DataTableColumn<T> = {
  key: keyof T;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
};

export type DataTableProps<T> = {
  data: T[];
  columns: DataTableColumn<T>[];
  className?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  itemsPerPage?: number;
  showPagination?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  compact?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  emptyIcon?: string;
  onRowClick?: (row: T, index: number) => void;
  variant?: "default" | "minimal" | "bordered";
  size?: "sm" | "default" | "lg";
};

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  className,
  searchable = true,
  searchPlaceholder = "Search...",
  itemsPerPage = 10,
  showPagination = true,
  striped = false,
  hoverable = true,
  bordered = true,
  compact = false,
  loading = false,
  emptyMessage = "No data available",
  emptyIcon = "📊",
  onRowClick,
  variant = "default",
  size = "default",
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>(
    {}
  );

  const filteredData = useMemo(() => {
    let filtered = [...data];

    if (search) {
      filtered = filtered.filter((row) =>
        columns.some((column) => {
          const value = row[column.key];
          return value?.toString().toLowerCase().includes(search.toLowerCase());
        })
      );
    }

    Object.entries(columnFilters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((row) => {
          const rowValue = row[key as keyof T];
          return rowValue
            ?.toString()
            .toLowerCase()
            .includes(value.toLowerCase());
        });
      }
    });

    return filtered;
  }, [data, search, columnFilters, columns]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  const paginatedData = useMemo(() => {
    if (!showPagination) return sortedData;

    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage, showPagination]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (key: keyof T) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleColumnFilter = (key: string, value: string) => {
    setColumnFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1);
  };

  const clearColumnFilter = (key: string) => {
    setColumnFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push("ellipsis");
      pageNumbers.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pageNumbers.push(1);
      pageNumbers.push("ellipsis");
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      pageNumbers.push("ellipsis");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push("ellipsis");
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };
  if (loading) {
    return (
      <div
        className={cn(
          "w-full overflow-hidden rounded-ele bg-card",
          bordered && "border border-border",
          className
        )}
      >
        <div className="p-6">
          {}
          {searchable && (
            <div className="mb-6">
              <Skeleton className="h-10 w-full max-w-sm" />
            </div>
          )}

          {}
          <div className="overflow-hidden rounded-ele border border-border">
            {}
            <div
              className={cn(
                "bg-muted/20",
                size === "sm" && "p-3",
                size === "default" && "p-4",
                size === "lg" && "p-6"
              )}
            >
              <div className="flex gap-4">
                {columns.map((_, index) => (
                  <div
                    className={cn(
                      "flex-1",
                      index === 0 && "min-w-48",
                      index === columns.length - 1 && "max-w-24"
                    )}
                    key={index}
                  >
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ))}
              </div>
            </div>

            {}
            {Array.from({ length: itemsPerPage || 5 }).map((_, rowIndex) => (
              <div
                className={cn(
                  "border-border border-t bg-card",
                  size === "sm" && "p-3",
                  size === "default" && "p-4",
                  size === "lg" && "p-6"
                )}
                key={rowIndex}
              >
                <div className="flex gap-4">
                  {columns.map((_, colIndex) => (
                    <div
                      className={cn(
                        "flex-1",
                        colIndex === 0 && "min-w-48",
                        colIndex === columns.length - 1 && "max-w-24"
                      )}
                      key={colIndex}
                    >
                      {colIndex === 0 ? (
                        <div className="flex items-center gap-3">
                          <SkeletonAvatar size="sm" />
                          <div className="flex flex-1 flex-col gap-1">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        </div>
                      ) : colIndex === columns.length - 1 ? (
                        <div className="flex justify-end">
                          <Skeleton className="h-8 w-8 rounded-ele" />
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1">
                          <Skeleton
                            className={cn(
                              "h-4",
                              rowIndex % 2 === 0 ? "w-3/4" : "w-1/2"
                            )}
                          />
                          {rowIndex % 3 === 0 && (
                            <Skeleton className="h-3 w-1/3" />
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {}
          {showPagination && (
            <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
              <Skeleton className="h-4 w-48" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-20 rounded-ele" />
                <Skeleton className="h-9 w-9 rounded-ele" />
                <Skeleton className="h-9 w-9 rounded-ele" />
                <Skeleton className="h-9 w-9 rounded-ele" />
                <Skeleton className="h-9 w-16 rounded-ele" />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-ele bg-card",
        bordered && "border border-border",
        variant === "minimal" && "border-none bg-transparent",
        className
      )}
    >
      {}
      {searchable && (
        <div className="flex flex-col items-start gap-4 p-6 pb-4 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-auto sm:max-w-sm sm:flex-1">
            <Input
              className="w-full"
              clearable
              leftIcon={<Search />}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              onClear={() => {
                setSearch("");
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              value={search}
            />
          </div>
          {Object.keys(columnFilters).length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted-foreground text-sm">
                Active filters:
              </span>
              {Object.entries(columnFilters).map(([key, value]) => (
                <Badge
                  className="text-xs"
                  key={key}
                  onClick={() => clearColumnFilter(key)}
                  variant="secondary"
                >
                  {key}: {value} ×
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}

      {}
      <div
        className={cn(
          "overflow-hidden",
          variant === "bordered" && "rounded-ele border border-border",
          variant === "minimal" && "border-none",
          !searchable && variant !== "minimal" && "rounded-ele"
        )}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead
              className={cn(
                "bg-muted/20",
                variant === "minimal" && "border-border border-b bg-transparent"
              )}
            >
              <tr>
                {columns.map((column) => (
                  <th
                    className={cn(
                      "text-left font-semibold text-foreground",
                      size === "sm" && "px-3 py-2 text-xs",
                      size === "default" && "px-4 py-3 text-sm",
                      size === "lg" && "px-6 py-4 text-base",
                      column.sortable &&
                        "cursor-pointer transition-colors hover:rounded-ele hover:bg-muted/30",
                      column.align === "center" && "text-center",
                      column.align === "right" && "text-right",
                      column.width && `w-[${column.width}]`
                    )}
                    key={String(column.key)}
                    onClick={() => column.sortable && handleSort(column.key)}
                    style={column.width ? { width: column.width } : undefined}
                  >
                    <div
                      className={cn(
                        "flex items-center gap-2",
                        column.align === "center" && "justify-center",
                        column.align === "right" && "justify-end"
                      )}
                    >
                      <span>{column.header}</span>
                      {column.sortable && (
                        <div className="flex flex-col">
                          <ChevronUp
                            className={cn(
                              "h-3 w-3 transition-colors",
                              sortConfig.key === column.key &&
                                sortConfig.direction === "asc"
                                ? "text-primary"
                                : "text-muted-foreground/40"
                            )}
                          />
                          <ChevronDown
                            className={cn(
                              "-mt-1 h-3 w-3 transition-colors",
                              sortConfig.key === column.key &&
                                sortConfig.direction === "desc"
                                ? "text-primary"
                                : "text-muted-foreground/40"
                            )}
                          />
                        </div>
                      )}
                      {column.filterable && (
                        <div className="relative">
                          <Filter className="h-3 w-3 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>
                    {}
                    {column.filterable && (
                      <div className="mt-2">
                        <Input
                          className="text-xs"
                          onChange={(e) =>
                            handleColumnFilter(
                              String(column.key),
                              e.target.value
                            )
                          }
                          onClick={(e) => e.stopPropagation()}
                          placeholder="Filter..."
                          size="sm"
                          value={columnFilters[String(column.key)] || ""}
                        />
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-card">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    className={cn(
                      "bg-card text-center text-muted-foreground",
                      size === "sm" && "px-3 py-8",
                      size === "default" && "px-4 py-12",
                      size === "lg" && "px-6 py-16"
                    )}
                    colSpan={columns.length}
                  >
                    <div className="flex flex flex-col flex-col items-center gap-3">
                      <div className="text-4xl opacity-50">{emptyIcon}</div>
                      <div className="font-medium">{emptyMessage}</div>
                      <div className="text-sm opacity-75">
                        Try adjusting your search or filter criteria
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, index) => (
                  <tr
                    className={cn(
                      "border-border border-t bg-card transition-colors",
                      striped && index % 2 === 0 && "bg-muted/10",
                      hoverable && "hover:bg-muted/20",
                      onRowClick && "cursor-pointer",
                      "group"
                    )}
                    key={index}
                    onClick={() => onRowClick?.(row, index)}
                  >
                    {columns.map((column) => (
                      <td
                        className={cn(
                          "text-foreground",
                          size === "sm" && "px-3 py-2 text-xs",
                          size === "default" && "px-4 py-3 text-sm",
                          size === "lg" && "px-6 py-4 text-base",
                          column.align === "center" && "text-center",
                          column.align === "right" && "text-right"
                        )}
                        key={String(column.key)}
                      >
                        {column.render
                          ? column.render(row[column.key], row)
                          : String(row[column.key] ?? "")}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {}
      {showPagination && totalPages > 1 && (
        <div className="flex flex-col items-center justify-between gap-4 border-border border-t bg-card p-6 pt-4 sm:flex-row">
          <div className="order-2 text-muted-foreground text-sm sm:order-1">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, sortedData.length)} of{" "}
            {sortedData.length} results
          </div>
          <div className="order-1 flex items-center gap-2 sm:order-2">
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              size="sm"
              variant="outline"
            >
              Previous
            </Button>
            <div className="hidden items-center gap-1 sm:flex">
              {generatePageNumbers().map((pageNumber, index) => {
                if (pageNumber === "ellipsis") {
                  return (
                    <Button
                      className="cursor-default"
                      disabled
                      key={`ellipsis-${index}`}
                      size="sm"
                      variant="ghost"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  );
                }

                return (
                  <Button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber as number)}
                    size="sm"
                    variant={currentPage === pageNumber ? "default" : "ghost"}
                  >
                    {pageNumber}
                  </Button>
                );
              })}
            </div>
            <Button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              size="sm"
              variant="outline"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
