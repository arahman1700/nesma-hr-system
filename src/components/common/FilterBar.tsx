import React, { useState, useCallback } from "react";
import { cn } from "../../utils/cn";
import { useTheme } from "../../contexts/ThemeContext";
import {
  Search,
  X,
  ChevronDown,
  Filter,
  Calendar,
  RotateCcw,
  Check,
  Building2,
  MapPin,
  Users,
  Briefcase,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

// ============================================
// TYPES
// ============================================
export interface FilterOption {
  value: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
  color?: string;
}

export interface FilterConfig {
  id: string;
  label: string;
  type: "select" | "multi-select" | "date" | "date-range" | "search";
  options?: FilterOption[];
  placeholder?: string;
  icon?: React.ReactNode;
  color?: string; // gradient color for the filter button
}

export type FilterValue =
  | string
  | string[]
  | { from?: string; to?: string }
  | null;

export interface ActiveFilter {
  filterId: string;
  value: FilterValue;
  label: string;
}

export interface FilterBarProps {
  filters: FilterConfig[];
  activeFilters: ActiveFilter[];
  onFilterChange: (filterId: string, value: FilterValue) => void;
  onClearFilter: (filterId: string) => void;
  onClearAll: () => void;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  className?: string;
  showSearch?: boolean;
  showFilterCount?: boolean;
  compact?: boolean;
  variant?: "default" | "colorful" | "minimal";
}

// ============================================
// COLOR PRESETS FOR FILTERS
// ============================================
const filterColors = {
  department: {
    gradient: "from-blue-500 to-indigo-600",
    glow: "rgba(59, 130, 246, 0.3)",
  },
  location: {
    gradient: "from-emerald-500 to-teal-600",
    glow: "rgba(16, 185, 129, 0.3)",
  },
  status: {
    gradient: "from-purple-500 to-violet-600",
    glow: "rgba(139, 92, 246, 0.3)",
  },
  type: {
    gradient: "from-amber-500 to-orange-600",
    glow: "rgba(245, 158, 11, 0.3)",
  },
  date: {
    gradient: "from-rose-500 to-pink-600",
    glow: "rgba(244, 63, 94, 0.3)",
  },
  default: {
    gradient: "from-gray-500 to-gray-600",
    glow: "rgba(107, 114, 128, 0.3)",
  },
};

const getFilterColor = (id: string) => {
  return filterColors[id as keyof typeof filterColors] || filterColors.default;
};

// ============================================
// COLORFUL FILTER DROPDOWN COMPONENT
// ============================================
interface ColorfulFilterDropdownProps {
  config: FilterConfig;
  value: string | string[] | null;
  onChange: (value: string | string[] | null) => void;
  isGlass: boolean;
  isDark: boolean;
}

const ColorfulFilterDropdown: React.FC<ColorfulFilterDropdownProps> = ({
  config,
  value,
  onChange,
  isGlass,
  isDark,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isMulti = config.type === "multi-select";
  const selectedValues = isMulti
    ? Array.isArray(value)
      ? value
      : []
    : value
      ? [value as string]
      : [];

  const hasSelection = selectedValues.length > 0;
  const colorConfig = getFilterColor(config.id);

  const getSelectedLabel = () => {
    if (selectedValues.length === 0) return config.placeholder || config.label;
    if (selectedValues.length === 1) {
      const option = config.options?.find((o) => o.value === selectedValues[0]);
      return option?.label || selectedValues[0];
    }
    return `${selectedValues.length} selected`;
  };

  const handleSelect = (optionValue: string) => {
    if (isMulti) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue];
      onChange(newValues.length > 0 ? newValues : null);
    } else {
      onChange(optionValue === value ? null : optionValue);
      setIsOpen(false);
    }
  };

  // Get icon based on filter type
  const getFilterIcon = () => {
    if (config.icon) return config.icon;
    switch (config.id) {
      case "department":
        return <Building2 className="w-4 h-4" />;
      case "location":
        return <MapPin className="w-4 h-4" />;
      case "status":
        return <Users className="w-4 h-4" />;
      case "type":
        return <Briefcase className="w-4 h-4" />;
      default:
        return <Filter className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "relative flex items-center gap-2 px-4 py-2.5 rounded-xl",
          "text-sm font-medium transition-all duration-300",
          "min-w-[160px] justify-between overflow-hidden",
          hasSelection
            ? "text-white"
            : isGlass || isDark
              ? "text-white/80"
              : "text-gray-700",
          isOpen && "ring-2 ring-white/30",
        )}
        style={{
          background: hasSelection
            ? `linear-gradient(135deg, var(--tw-gradient-stops))`
            : isGlass || isDark
              ? "rgba(255,255,255,0.1)"
              : "white",
          boxShadow:
            hasSelection && isHovered
              ? `0 8px 25px ${colorConfig.glow}`
              : hasSelection
                ? `0 4px 15px ${colorConfig.glow}`
                : isGlass || isDark
                  ? "none"
                  : "0 1px 3px rgba(0,0,0,0.1)",
          border: hasSelection
            ? "none"
            : isGlass || isDark
              ? "1px solid rgba(255,255,255,0.15)"
              : "1px solid #e5e7eb",
        }}
      >
        {/* Gradient background when selected */}
        {hasSelection && (
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-r",
              colorConfig.gradient,
            )}
          />
        )}

        {/* Shine effect on hover */}
        <div
          className={cn(
            "absolute inset-0 -translate-x-full",
            "bg-gradient-to-r from-transparent via-white/20 to-transparent",
            "transition-transform duration-700 ease-out",
            isHovered && "translate-x-full",
          )}
        />

        {/* Content */}
        <span className="relative z-10 flex items-center gap-2">
          <span
            className={cn(
              "flex items-center justify-center w-6 h-6 rounded-lg",
              hasSelection
                ? "bg-white/20"
                : isGlass || isDark
                  ? "bg-white/10"
                  : "bg-gray-100",
            )}
          >
            {getFilterIcon()}
          </span>
          <span className="truncate max-w-[100px]">{getSelectedLabel()}</span>
        </span>

        <ChevronDown
          className={cn(
            "relative z-10 w-4 h-4 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div
            className={cn(
              "absolute top-full left-0 mt-2 z-50",
              "min-w-[220px] max-h-[300px] overflow-auto",
              "rounded-xl shadow-2xl",
              "border animate-in fade-in slide-in-from-top-2 duration-200",
              isGlass && "bg-gray-900/95 backdrop-blur-xl border-white/20",
              !isGlass && isDark && "bg-gray-800 border-gray-700",
              !isGlass && !isDark && "bg-white border-gray-200",
            )}
          >
            {/* Header */}
            <div
              className={cn(
                "sticky top-0 px-4 py-3 border-b",
                isGlass || isDark
                  ? "border-white/10 bg-inherit"
                  : "border-gray-100 bg-white",
              )}
            >
              <p
                className={cn(
                  "text-xs font-semibold uppercase tracking-wider",
                  isGlass || isDark ? "text-white/50" : "text-gray-400",
                )}
              >
                {config.label}
              </p>
            </div>

            {/* Options */}
            {config.options?.map((option) => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3",
                    "text-sm text-left transition-all duration-150",
                    isGlass && [
                      "text-white/90 hover:bg-white/10",
                      isSelected && "bg-white/15",
                    ],
                    !isGlass &&
                      isDark && [
                        "text-gray-200 hover:bg-gray-700/50",
                        isSelected && "bg-primary/20",
                      ],
                    !isGlass &&
                      !isDark && [
                        "text-gray-700 hover:bg-gray-50",
                        isSelected && "bg-primary/10",
                      ],
                  )}
                >
                  {isMulti && (
                    <div
                      className={cn(
                        "w-5 h-5 rounded-md border-2 flex items-center justify-center",
                        "transition-all duration-200",
                        isSelected
                          ? cn(
                              "border-transparent bg-gradient-to-r",
                              colorConfig.gradient,
                            )
                          : isGlass
                            ? "border-white/30"
                            : isDark
                              ? "border-gray-600"
                              : "border-gray-300",
                      )}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                  )}
                  {option.icon && (
                    <span
                      className={cn(
                        "flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center",
                        isGlass || isDark ? "bg-white/10" : "bg-gray-100",
                      )}
                    >
                      {option.icon}
                    </span>
                  )}
                  <span className="flex-1 font-medium">{option.label}</span>
                  {option.count !== undefined && (
                    <span
                      className={cn(
                        "text-xs px-2 py-1 rounded-full font-semibold",
                        isGlass
                          ? "bg-white/10 text-white/60"
                          : isDark
                            ? "bg-gray-700 text-gray-400"
                            : "bg-gray-100 text-gray-500",
                      )}
                    >
                      {option.count}
                    </span>
                  )}
                  {!isMulti && isSelected && (
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full bg-gradient-to-r",
                        colorConfig.gradient,
                      )}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

// ============================================
// COLORFUL DATE FILTER COMPONENT
// ============================================
interface ColorfulDateFilterProps {
  config: FilterConfig;
  value: string | { from?: string; to?: string } | null;
  onChange: (value: string | { from?: string; to?: string } | null) => void;
  isGlass: boolean;
  isDark: boolean;
}

const ColorfulDateFilter: React.FC<ColorfulDateFilterProps> = ({
  config,
  value,
  onChange,
  isGlass,
  isDark,
}) => {
  const isRange = config.type === "date-range";
  const dateValue = typeof value === "string" ? value : "";
  const rangeValue =
    typeof value === "object" && value !== null ? value : { from: "", to: "" };
  const colorConfig = getFilterColor("date");
  const hasValue = isRange ? rangeValue.from || rangeValue.to : dateValue;

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div
          className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2",
            "w-6 h-6 rounded-lg flex items-center justify-center",
            hasValue
              ? cn("bg-gradient-to-r", colorConfig.gradient)
              : isGlass || isDark
                ? "bg-white/10"
                : "bg-gray-100",
          )}
        >
          <Calendar
            className={cn(
              "w-3.5 h-3.5",
              hasValue
                ? "text-white"
                : isGlass || isDark
                  ? "text-white/50"
                  : "text-gray-400",
            )}
          />
        </div>
        <input
          type="date"
          value={isRange ? rangeValue.from || "" : dateValue}
          onChange={(e) =>
            isRange
              ? onChange({ ...rangeValue, from: e.target.value })
              : onChange(e.target.value || null)
          }
          className={cn(
            "pl-12 pr-4 py-2.5 rounded-xl text-sm font-medium",
            "border transition-all duration-200",
            "focus:outline-none focus:ring-2",
            hasValue && "ring-2",
            isGlass && [
              "bg-white/10 backdrop-blur-xl border-white/20",
              "text-white placeholder-white/50",
              hasValue ? "ring-rose-500/50" : "focus:ring-rose-500/30",
            ],
            !isGlass &&
              isDark && [
                "bg-gray-800/50 border-gray-700",
                "text-gray-200",
                hasValue ? "ring-rose-500/50" : "focus:ring-rose-500/30",
              ],
            !isGlass &&
              !isDark && [
                "bg-white border-gray-200",
                "text-gray-700",
                hasValue
                  ? "ring-rose-500/30 border-rose-200"
                  : "focus:ring-rose-500/20",
              ],
          )}
        />
      </div>
      {isRange && (
        <>
          <span
            className={cn(
              "text-sm font-medium",
              isGlass || isDark ? "text-white/50" : "text-gray-400",
            )}
          >
            to
          </span>
          <input
            type="date"
            value={rangeValue.to || ""}
            onChange={(e) => onChange({ ...rangeValue, to: e.target.value })}
            className={cn(
              "px-4 py-2.5 rounded-xl text-sm font-medium",
              "border transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-rose-500/30",
              isGlass && [
                "bg-white/10 backdrop-blur-xl border-white/20",
                "text-white placeholder-white/50",
              ],
              !isGlass &&
                isDark && ["bg-gray-800/50 border-gray-700", "text-gray-200"],
              !isGlass &&
                !isDark && ["bg-white border-gray-200", "text-gray-700"],
            )}
          />
        </>
      )}
    </div>
  );
};

// ============================================
// COLORFUL ACTIVE FILTER CHIP
// ============================================
interface ColorfulFilterChipProps {
  filter: ActiveFilter;
  onRemove: () => void;
  isGlass: boolean;
  isDark: boolean;
}

const ColorfulFilterChip: React.FC<ColorfulFilterChipProps> = ({
  filter,
  onRemove,
  isGlass,
  isDark,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const colorConfig = getFilterColor(filter.filterId);

  const getDisplayValue = () => {
    if (Array.isArray(filter.value)) {
      return filter.value.join(", ");
    }
    if (typeof filter.value === "object" && filter.value !== null) {
      return `${filter.value.from || ""} - ${filter.value.to || ""}`;
    }
    return filter.value || "";
  };

  return (
    <div
      className={cn(
        "relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full overflow-hidden",
        "text-sm font-medium text-white",
        "animate-in fade-in slide-in-from-left-2 duration-300",
        "cursor-default",
      )}
      style={{
        boxShadow: isHovered
          ? `0 4px 15px ${colorConfig.glow}`
          : `0 2px 8px ${colorConfig.glow}`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient background */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-r",
          colorConfig.gradient,
        )}
      />

      {/* Shine effect */}
      <div
        className={cn(
          "absolute inset-0 -translate-x-full",
          "bg-gradient-to-r from-transparent via-white/20 to-transparent",
          "transition-transform duration-500",
          isHovered && "translate-x-full",
        )}
      />

      {/* Content */}
      <Sparkles className="relative z-10 w-3 h-3 text-white/70" />
      <span className="relative z-10 text-xs opacity-80">{filter.label}:</span>
      <span className="relative z-10 truncate max-w-[120px] font-semibold">
        {getDisplayValue()}
      </span>
      <button
        type="button"
        onClick={onRemove}
        className={cn(
          "relative z-10 p-1 rounded-full transition-all duration-200",
          "bg-white/20 hover:bg-white/30 hover:scale-110",
        )}
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};

// ============================================
// MAIN FILTER BAR COMPONENT
// ============================================
export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  activeFilters,
  onFilterChange,
  onClearFilter,
  onClearAll,
  onSearch,
  searchPlaceholder = "Search...",
  className,
  showSearch = true,
  showFilterCount = true,
  compact = false,
  variant = "colorful",
}) => {
  const { theme } = useTheme();
  const isGlass = theme === "glass";
  const isDark = theme === "dark" || theme === "company";

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);
      onSearch?.(query);
    },
    [onSearch],
  );

  const getFilterValue = useCallback(
    (filterId: string): FilterValue => {
      const active = activeFilters.find((f) => f.filterId === filterId);
      return active?.value ?? null;
    },
    [activeFilters],
  );

  const handleFilterChange = useCallback(
    (config: FilterConfig, value: FilterValue) => {
      onFilterChange(config.id, value);
    },
    [onFilterChange],
  );

  const filterCount = activeFilters.length;

  return (
    <div
      className={cn(
        "rounded-2xl transition-all duration-300",
        compact ? "p-3" : "p-5",
        isGlass && "bg-white/5 backdrop-blur-xl border border-white/10",
        !isGlass && isDark && "bg-gray-800/50 border border-gray-700/50",
        !isGlass &&
          !isDark &&
          "bg-white border border-gray-200 shadow-lg shadow-gray-200/50",
        className,
      )}
    >
      {/* Main Filter Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Input - Enhanced */}
        {showSearch && (
          <div
            className={cn(
              "relative flex-1 min-w-[220px] max-w-[400px]",
              "transition-all duration-300",
              isSearchFocused && "scale-[1.02]",
            )}
          >
            <div
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2",
                "w-8 h-8 rounded-lg flex items-center justify-center",
                "transition-all duration-300",
                isSearchFocused
                  ? cn("bg-gradient-to-r from-blue-500 to-indigo-600")
                  : isGlass || isDark
                    ? "bg-white/10"
                    : "bg-gray-100",
              )}
            >
              <Search
                className={cn(
                  "w-4 h-4 transition-colors duration-300",
                  isSearchFocused
                    ? "text-white"
                    : isGlass || isDark
                      ? "text-white/50"
                      : "text-gray-400",
                )}
              />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder={searchPlaceholder}
              className={cn(
                "w-full pl-14 pr-10 py-3 rounded-xl text-sm font-medium",
                "border transition-all duration-300",
                "focus:outline-none",
                isSearchFocused && "ring-2",
                isGlass && [
                  "bg-white/10 backdrop-blur-xl border-white/20",
                  "text-white placeholder-white/50",
                  isSearchFocused && "ring-blue-500/30 border-blue-500/50",
                ],
                !isGlass &&
                  isDark && [
                    "bg-gray-800/50 border-gray-700",
                    "text-gray-200 placeholder-gray-500",
                    isSearchFocused && "ring-blue-500/30 border-blue-500/50",
                  ],
                !isGlass &&
                  !isDark && [
                    "bg-gray-50 border-gray-200",
                    "text-gray-700 placeholder-gray-400",
                    isSearchFocused &&
                      "ring-blue-500/20 border-blue-300 bg-white",
                  ],
              )}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  onSearch?.("");
                }}
                className={cn(
                  "absolute right-3 top-1/2 -translate-y-1/2",
                  "w-6 h-6 rounded-full flex items-center justify-center",
                  "transition-all duration-200 hover:scale-110",
                  isGlass || isDark
                    ? "bg-white/10 hover:bg-white/20 text-white/50"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-500",
                )}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Divider */}
        {showSearch && filters.length > 0 && (
          <div
            className={cn(
              "h-10 w-px",
              isGlass ? "bg-white/20" : isDark ? "bg-gray-700" : "bg-gray-200",
            )}
          />
        )}

        {/* Filter Dropdowns - Colorful */}
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((config) => {
            if (config.type === "search") return null;

            const currentValue = getFilterValue(config.id);

            if (config.type === "date" || config.type === "date-range") {
              const dateValue =
                typeof currentValue === "string" ||
                (typeof currentValue === "object" &&
                  !Array.isArray(currentValue))
                  ? currentValue
                  : null;
              return (
                <ColorfulDateFilter
                  key={config.id}
                  config={config}
                  value={dateValue}
                  onChange={(value) => handleFilterChange(config, value)}
                  isGlass={isGlass}
                  isDark={isDark}
                />
              );
            }

            const selectValue =
              typeof currentValue === "string" || Array.isArray(currentValue)
                ? currentValue
                : null;
            return (
              <ColorfulFilterDropdown
                key={config.id}
                config={config}
                value={selectValue}
                onChange={(value) => handleFilterChange(config, value)}
                isGlass={isGlass}
                isDark={isDark}
              />
            );
          })}
        </div>

        {/* Filter Count Badge - Enhanced */}
        {showFilterCount && filterCount > 0 && (
          <div
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl",
              "text-sm font-semibold",
              "bg-gradient-to-r from-violet-500 to-purple-600 text-white",
              "shadow-lg shadow-violet-500/30",
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>{filterCount} Active</span>
          </div>
        )}

        {/* Clear All Button - Enhanced */}
        {filterCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl",
              "text-sm font-medium transition-all duration-200",
              "border-2 border-dashed",
              isGlass && [
                "border-white/30 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/50",
              ],
              !isGlass &&
                isDark && [
                  "border-gray-600 text-gray-400 hover:text-gray-200 hover:bg-gray-700/50 hover:border-gray-500",
                ],
              !isGlass &&
                !isDark && [
                  "border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-100 hover:border-gray-400",
                ],
            )}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Active Filters Row - Colorful Chips */}
      {activeFilters.length > 0 && (
        <div
          className={cn(
            "flex flex-wrap items-center gap-2 mt-4 pt-4",
            "border-t",
            isGlass
              ? "border-white/10"
              : isDark
                ? "border-gray-700/50"
                : "border-gray-100",
          )}
        >
          <span
            className={cn(
              "text-xs font-semibold uppercase tracking-wider",
              isGlass || isDark ? "text-white/40" : "text-gray-400",
            )}
          >
            Active:
          </span>
          {activeFilters.map((filter) => (
            <ColorfulFilterChip
              key={filter.filterId}
              filter={filter}
              onRemove={() => onClearFilter(filter.filterId)}
              isGlass={isGlass}
              isDark={isDark}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================
// QUICK FILTER BAR - Enhanced
// ============================================
export interface QuickFilterOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
  color?: string;
}

export interface QuickFilterBarProps {
  options: QuickFilterOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  className?: string;
}

export const QuickFilterBar: React.FC<QuickFilterBarProps> = ({
  options,
  value,
  onChange,
  className,
}) => {
  const { theme } = useTheme();
  const isGlass = theme === "glass";
  const isDark = theme === "dark" || theme === "company";

  return (
    <div
      className={cn(
        "flex items-center gap-2 p-1.5 rounded-xl",
        isGlass && "bg-white/10 backdrop-blur-xl",
        !isGlass && isDark && "bg-gray-800/50",
        !isGlass && !isDark && "bg-gray-100",
        className,
      )}
    >
      {options.map((option, index) => {
        const isSelected = value === option.value;
        const colors = [
          "from-blue-500 to-indigo-600",
          "from-emerald-500 to-teal-600",
          "from-purple-500 to-violet-600",
          "from-amber-500 to-orange-600",
          "from-rose-500 to-pink-600",
        ];
        const colorClass = colors[index % colors.length];

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(isSelected ? null : option.value)}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2.5 rounded-lg overflow-hidden",
              "text-sm font-medium transition-all duration-300",
              isSelected
                ? "text-white shadow-lg"
                : [
                    isGlass &&
                      "text-white/70 hover:text-white hover:bg-white/10",
                    !isGlass &&
                      isDark &&
                      "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50",
                    !isGlass &&
                      !isDark &&
                      "text-gray-600 hover:text-gray-800 hover:bg-white",
                  ],
            )}
          >
            {isSelected && (
              <div
                className={cn("absolute inset-0 bg-gradient-to-r", colorClass)}
              />
            )}
            {option.icon && (
              <span className="relative z-10">{option.icon}</span>
            )}
            <span className="relative z-10">{option.label}</span>
            {option.count !== undefined && (
              <span
                className={cn(
                  "relative z-10 px-2 py-0.5 rounded-full text-xs font-semibold",
                  isSelected
                    ? "bg-white/20"
                    : isGlass
                      ? "bg-white/10"
                      : isDark
                        ? "bg-gray-700"
                        : "bg-gray-200",
                )}
              >
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default FilterBar;
