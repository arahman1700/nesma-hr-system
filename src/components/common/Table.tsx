import React, { useState, useMemo } from "react";
import { cn } from "../../utils/cn";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
} from "lucide-react";
import Input from "./Input";
import Select from "./Select";
import { useTheme } from "../../contexts/ThemeContext";
import { BORDER_RADIUS, ICON_ONLY_SIZES, GRADIENTS, SHADOWS, COMPONENT_TOKENS } from "../../utils/designTokens";

// ============================================
// DESIGN TOKENS
// ============================================
const TABLE_TOKENS = {
  borderRadius: BORDER_RADIUS.lg,
  headerRadius: "rounded-t-2xl",
  cellPadding: COMPONENT_TOKENS.table.cellPadding,
  headerPadding: COMPONENT_TOKENS.table.headerPadding,
};

interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (row: T, index?: number) => React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField?: keyof T;
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  pagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  className?: string;
  selectedRows?: string[];
  onSelectRow?: (id: string) => void;
  onSelectAll?: () => void;
  selectable?: boolean;
  striped?: boolean;
  compact?: boolean;
  stickyHeader?: boolean;
  variant?: "default" | "glass" | "minimal";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Table<T extends Record<string, any>>({
  columns,
  data,
  keyField = "id" as keyof T,
  loading = false,
  searchable = true,
  searchPlaceholder = "Search...",
  pagination = true,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
  onRowClick,
  emptyMessage = "No data found",
  className,
  selectedRows = [],
  onSelectRow,
  onSelectAll,
  selectable = false,
  striped = false,
  compact = false,
  stickyHeader = true,
  variant = "default",
}: TableProps<T>) {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";
  const isGlass = theme === "glass";

  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  }, [data, searchTerm]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortColumn] as string | number;
      const bVal = b[sortColumn] as string | number;
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize, pagination]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return;
    const key = String(column.key);
    if (sortColumn === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(key);
      setSortDirection("asc");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };

  const getValue = (row: T, key: keyof T | string): unknown => {
    if (typeof key === "string" && key.includes(".")) {
      return key
        .split(".")
        .reduce(
          (obj: unknown, k) => (obj as Record<string, unknown>)?.[k],
          row,
        );
    }
    return row[key as keyof T];
  };

  const allSelected =
    selectable &&
    selectedRows.length === paginatedData.length &&
    paginatedData.length > 0;

  // Get container styles based on variant
  const getContainerStyles = () => {
    if (isGlass) {
      return "bg-white/[0.03] backdrop-blur-xl border border-white/[0.08]";
    }
    switch (variant) {
      case "glass":
        return isDark
          ? "bg-white/5 backdrop-blur-xl border border-white/10"
          : "bg-white/90 backdrop-blur-xl border border-gray-100";
      case "minimal":
        return isDark
          ? "bg-transparent border border-white/10"
          : "bg-transparent border border-gray-200";
      default:
        return isDark
          ? "bg-[var(--theme-card)] border border-[var(--theme-border)]"
          : "bg-white border border-gray-100";
    }
  };

  return (
    <div
      className={cn(
        TABLE_TOKENS.borderRadius,
        "overflow-hidden shadow-[0_2px_8px_rgba(14,40,65,0.06)]",
        getContainerStyles(),
        className,
      )}
    >
      {/* Search Bar */}
      {searchable && (
        <div
          className={cn(
            "p-4 border-b",
            isDark || isGlass ? "border-white/[0.08]" : "border-gray-100",
          )}
        >
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search
                className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4",
                  isDark || isGlass ? "text-gray-500" : "text-gray-400",
                )}
              />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                aria-label="Search table data"
                className={cn(
                  "w-full pl-10 pr-4 py-2.5 text-sm rounded-xl transition-all",
                  "focus:outline-none focus:ring-2",
                  isGlass
                    ? "bg-white/[0.05] border border-white/[0.1] text-white placeholder:text-white/40 focus:ring-[#80D1E9]/30 focus:border-[#80D1E9]/50"
                    : isDark
                      ? "bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:ring-[#80D1E9]/20 focus:border-[#80D1E9]/30"
                      : "bg-gray-50 border border-gray-200 text-gray-700 placeholder:text-gray-400 focus:ring-[#2E3192]/10 focus:border-[#2E3192]/30",
                )}
              />
            </div>
            <button
              className={cn(
                "p-2.5 rounded-xl transition-all",
                isGlass
                  ? "bg-white/[0.05] border border-white/[0.1] text-white/70 hover:bg-white/[0.1]"
                  : isDark
                    ? "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
                    : "bg-gray-50 border border-gray-200 text-gray-500 hover:bg-gray-100",
              )}
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto" role="region" aria-label="Data table">
        <table className="w-full" role="table">
          <thead
            className={cn(
              "bg-gradient-to-r from-[#2E3192] to-[#0E2841]",
              stickyHeader && "sticky top-0 z-10",
            )}
          >
            <tr>
              {selectable && (
                <th className={cn(TABLE_TOKENS.headerPadding, "w-12")}>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={onSelectAll}
                    className={cn(
                      "w-4 h-4 rounded-md border-2 transition-all cursor-pointer",
                      "bg-white/10 border-white/30 text-[#80D1E9]",
                      "focus:ring-2 focus:ring-white/20",
                      "checked:bg-[#80D1E9] checked:border-[#80D1E9]",
                    )}
                  />
                </th>
              )}
              {columns.map((column, idx) => (
                <th
                  key={String(column.key)}
                  scope="col"
                  style={{ width: column.width }}
                  className={cn(
                    TABLE_TOKENS.headerPadding,
                    "text-left text-xs font-semibold uppercase tracking-wider text-white",
                    column.sortable &&
                      "cursor-pointer select-none hover:bg-white/10 transition-colors",
                    column.align === "center" && "text-center",
                    column.align === "right" && "text-right",
                    idx === 0 && !selectable && "rounded-tl-xl",
                    idx === columns.length - 1 && "rounded-tr-xl",
                    column.className,
                  )}
                  onClick={() => handleSort(column)}
                  aria-sort={
                    sortColumn === String(column.key)
                      ? sortDirection === "asc"
                        ? "ascending"
                        : "descending"
                      : undefined
                  }
                  tabIndex={column.sortable ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (column.sortable && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      handleSort(column);
                    }
                  }}
                >
                  <div
                    className={cn(
                      "flex items-center gap-1.5",
                      column.align === "center" && "justify-center",
                      column.align === "right" && "justify-end",
                    )}
                  >
                    {column.label}
                    {column.sortable && sortColumn === String(column.key) && (
                      <span className="text-[#80D1E9]">
                        {sortDirection === "asc" ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody
            className={cn(
              "divide-y",
              isDark || isGlass ? "divide-white/[0.05]" : "divide-gray-100",
            )}
          >
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-4 py-12 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div
                      className={cn(
                        "w-10 h-10 border-3 border-t-transparent rounded-full animate-spin",
                        isDark || isGlass
                          ? "border-[#80D1E9]"
                          : "border-[#2E3192]",
                      )}
                    />
                    <span
                      className={
                        isDark || isGlass ? "text-gray-400" : "text-gray-500"
                      }
                    >
                      Loading data...
                    </span>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className={cn(
                    "px-4 py-12 text-center",
                    isDark || isGlass ? "text-gray-400" : "text-gray-500",
                  )}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center",
                        isDark || isGlass ? "bg-white/5" : "bg-gray-100",
                      )}
                    >
                      <Search className="w-6 h-6 opacity-50" />
                    </div>
                    {emptyMessage}
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => {
                const rowId = String(row[keyField]);
                const isSelected = selectedRows.includes(rowId);
                const isLastRow = index === paginatedData.length - 1;

                return (
                  <tr
                    key={rowId}
                    onClick={() => onRowClick?.(row)}
                    className={cn(
                      "transition-colors group",
                      onRowClick && "cursor-pointer",
                      isSelected
                        ? isDark || isGlass
                          ? "bg-[#80D1E9]/10"
                          : "bg-[#2E3192]/5"
                        : striped && index % 2 === 1
                          ? isDark || isGlass
                            ? "bg-white/[0.02]"
                            : "bg-gray-50/50"
                          : "",
                      !isSelected &&
                        (isDark || isGlass
                          ? "hover:bg-white/[0.05]"
                          : "hover:bg-gray-50"),
                    )}
                  >
                    {selectable && (
                      <td
                        className={cn(
                          TABLE_TOKENS.cellPadding,
                          isLastRow && "rounded-bl-xl",
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onSelectRow?.(rowId)}
                          onClick={(e) => e.stopPropagation()}
                          className={cn(
                            "w-4 h-4 rounded-md border-2 transition-all cursor-pointer",
                            isDark || isGlass
                              ? "bg-white/5 border-white/20 text-[#80D1E9] focus:ring-[#80D1E9]/20"
                              : "bg-white border-gray-300 text-[#2E3192] focus:ring-[#2E3192]/20",
                          )}
                        />
                      </td>
                    )}
                    {columns.map((column, colIdx) => (
                      <td
                        key={String(column.key)}
                        className={cn(
                          compact ? "px-4 py-2" : TABLE_TOKENS.cellPadding,
                          "text-sm",
                          isDark || isGlass ? "text-gray-300" : "text-gray-700",
                          column.align === "center" && "text-center",
                          column.align === "right" && "text-right",
                          isLastRow &&
                            colIdx === 0 &&
                            !selectable &&
                            "rounded-bl-xl",
                          isLastRow &&
                            colIdx === columns.length - 1 &&
                            "rounded-br-xl",
                          column.className,
                        )}
                      >
                        {column.render
                          ? column.render(row, index)
                          : String(getValue(row, column.key) ?? "-")}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && sortedData.length > 0 && (
        <div
          className={cn(
            "px-4 py-3 border-t flex flex-col sm:flex-row items-center justify-between gap-4",
            isDark || isGlass ? "border-white/[0.08]" : "border-gray-100",
          )}
        >
          <div className="flex items-center gap-4">
            <span
              className={cn(
                "text-sm",
                isDark || isGlass ? "text-gray-400" : "text-gray-500",
              )}
            >
              Showing{" "}
              <span className="font-medium">
                {(currentPage - 1) * pageSize + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * pageSize, sortedData.length)}
              </span>{" "}
              of <span className="font-medium">{sortedData.length}</span>{" "}
              entries
            </span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className={cn(
                "px-3 py-1.5 text-sm rounded-lg border transition-all",
                isGlass
                  ? "bg-white/[0.05] border-white/[0.1] text-white"
                  : isDark
                    ? "bg-white/5 border-white/10 text-white"
                    : "bg-white border-gray-200 text-gray-700",
                "focus:outline-none focus:ring-2",
                isDark || isGlass
                  ? "focus:ring-[#80D1E9]/20"
                  : "focus:ring-[#2E3192]/10",
              )}
            >
              {pageSizeOptions.map((size) => (
                <option
                  key={size}
                  value={size}
                  className={isDark || isGlass ? "bg-gray-800" : ""}
                >
                  {size} per page
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className={cn(
                "p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all",
                isDark || isGlass
                  ? "hover:bg-white/10 text-gray-400 disabled:hover:bg-transparent"
                  : "hover:bg-gray-100 text-gray-600 disabled:hover:bg-transparent",
              )}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page: number;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={cn(
                    "w-10 h-10 rounded-xl text-sm font-medium transition-all",
                    page === currentPage
                      ? "bg-gradient-to-r from-[#2E3192] to-[#0E2841] text-white shadow-lg"
                      : isDark || isGlass
                        ? "hover:bg-white/10 text-gray-400"
                        : "hover:bg-gray-100 text-gray-600",
                  )}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className={cn(
                "p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all",
                isDark || isGlass
                  ? "hover:bg-white/10 text-gray-400 disabled:hover:bg-transparent"
                  : "hover:bg-gray-100 text-gray-600 disabled:hover:bg-transparent",
              )}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;
