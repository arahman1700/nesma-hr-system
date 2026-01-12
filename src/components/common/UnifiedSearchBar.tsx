import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Filter,
  ChevronDown,
  Calendar,
  Building2,
  MapPin,
  Users,
  Briefcase,
  Clock,
  Tag,
  Check,
  RotateCcw,
  Sparkles,
  Command,
  ArrowRight,
  History,
  Star,
  Zap,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { useTheme } from "../../contexts/ThemeContext";

// ============================================
// TYPES
// ============================================
export interface SearchSuggestion {
  id: string;
  label: string;
  type: "recent" | "suggested" | "popular";
  icon?: React.ReactNode;
}

export interface QuickFilter {
  id: string;
  label: string;
  icon?: React.ReactNode;
  color?: string;
  count?: number;
}

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface FilterConfig {
  id: string;
  label: string;
  icon?: React.ReactNode;
  options: FilterOption[];
  multiple?: boolean;
  color?: "blue" | "green" | "amber" | "purple" | "pink";
}

export interface UnifiedSearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onFilterChange?: (filters: Record<string, string | string[]>) => void;
  filters?: FilterConfig[];
  quickFilters?: QuickFilter[];
  suggestions?: SearchSuggestion[];
  recentSearches?: string[];
  className?: string;
  showAdvanced?: boolean;
  showQuickFilters?: boolean;
  variant?: "default" | "expanded" | "minimal";
}

// Color configurations
const colorConfig = {
  blue: {
    gradient: "from-blue-500 to-indigo-600",
    light: "bg-blue-500/10",
    text: "text-blue-500",
    border: "border-blue-500/30",
    glow: "rgba(59, 130, 246, 0.3)",
  },
  green: {
    gradient: "from-emerald-500 to-teal-600",
    light: "bg-emerald-500/10",
    text: "text-emerald-500",
    border: "border-emerald-500/30",
    glow: "rgba(16, 185, 129, 0.3)",
  },
  amber: {
    gradient: "from-amber-500 to-orange-600",
    light: "bg-amber-500/10",
    text: "text-amber-500",
    border: "border-amber-500/30",
    glow: "rgba(245, 158, 11, 0.3)",
  },
  purple: {
    gradient: "from-purple-500 to-violet-600",
    light: "bg-purple-500/10",
    text: "text-purple-500",
    border: "border-purple-500/30",
    glow: "rgba(139, 92, 246, 0.3)",
  },
  pink: {
    gradient: "from-rose-500 to-pink-600",
    light: "bg-rose-500/10",
    text: "text-rose-500",
    border: "border-rose-500/30",
    glow: "rgba(244, 63, 94, 0.3)",
  },
};

// ============================================
// FILTER DROPDOWN
// ============================================
interface FilterDropdownProps {
  config: FilterConfig;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  isGlass: boolean;
  isDark: boolean;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  config,
  value,
  onChange,
  isGlass,
  isDark,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];
  const hasSelection = selectedValues.length > 0;
  const colors = colorConfig[config.color || "blue"];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDisplayLabel = () => {
    if (selectedValues.length === 0) return config.label;
    if (selectedValues.length === 1) {
      const option = config.options.find((o) => o.value === selectedValues[0]);
      return option?.label || selectedValues[0];
    }
    return `${selectedValues.length} selected`;
  };

  const handleSelect = (optionValue: string) => {
    if (config.multiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue];
      onChange(newValues);
    } else {
      onChange(optionValue === value ? "" : optionValue);
      setIsOpen(false);
    }
  };

  const getIcon = () => {
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
    <div ref={dropdownRef} className="relative">
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "relative flex items-center gap-2 px-4 py-2.5 rounded-xl",
          "text-sm font-medium transition-all duration-300",
          "min-w-[140px] justify-between overflow-hidden",
          hasSelection ? "text-white" : isGlass || isDark ? "text-white/80" : "text-gray-700"
        )}
        style={{
          background: hasSelection
            ? undefined
            : isGlass || isDark
              ? "rgba(255,255,255,0.08)"
              : "white",
          boxShadow: hasSelection
            ? `0 4px 15px ${colors.glow}`
            : isGlass || isDark
              ? "0 1px 3px rgba(0,0,0,0.2)"
              : "0 1px 3px rgba(0,0,0,0.08)",
          border: hasSelection
            ? "none"
            : isGlass || isDark
              ? "1px solid rgba(255,255,255,0.12)"
              : "1px solid #e5e7eb",
        }}
      >
        {/* Gradient background when selected */}
        {hasSelection && (
          <div className={cn("absolute inset-0 bg-gradient-to-r", colors.gradient)} />
        )}

        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: "-100%" }}
          animate={{ x: isHovered ? "100%" : "-100%" }}
          transition={{ duration: 0.5 }}
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
                  : "bg-gray-100"
            )}
          >
            {getIcon()}
          </span>
          <span className="truncate max-w-[80px]">{getDisplayLabel()}</span>
        </span>

        <ChevronDown
          className={cn(
            "relative z-10 w-4 h-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute top-full left-0 mt-2 z-50",
              "min-w-[200px] max-h-[280px] overflow-auto",
              "rounded-xl shadow-2xl border",
              isGlass
                ? "bg-gray-900/95 backdrop-blur-xl border-white/15"
                : isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
            )}
          >
            {/* Header */}
            <div
              className={cn(
                "sticky top-0 px-4 py-3 border-b backdrop-blur-xl",
                isGlass || isDark ? "border-white/10 bg-inherit" : "border-gray-100 bg-white"
              )}
            >
              <p
                className={cn(
                  "text-xs font-semibold uppercase tracking-wider",
                  isGlass || isDark ? "text-white/50" : "text-gray-400"
                )}
              >
                {config.label}
              </p>
            </div>

            {/* Options */}
            <div className="py-1">
              {config.options.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <motion.button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    whileHover={{ x: 4 }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5",
                      "text-sm text-left transition-all duration-150",
                      isGlass && [
                        "text-white/90 hover:bg-white/10",
                        isSelected && "bg-white/15",
                      ],
                      !isGlass && isDark && [
                        "text-gray-200 hover:bg-gray-700/50",
                        isSelected && "bg-blue-500/20",
                      ],
                      !isGlass && !isDark && [
                        "text-gray-700 hover:bg-gray-50",
                        isSelected && "bg-blue-50",
                      ]
                    )}
                  >
                    {config.multiple && (
                      <div
                        className={cn(
                          "w-5 h-5 rounded-md border-2 flex items-center justify-center",
                          "transition-all duration-200",
                          isSelected
                            ? cn("border-transparent bg-gradient-to-r", colors.gradient)
                            : isGlass
                              ? "border-white/30"
                              : isDark
                                ? "border-gray-600"
                                : "border-gray-300"
                        )}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                    )}
                    {option.icon && (
                      <span
                        className={cn(
                          "flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center",
                          isGlass || isDark ? "bg-white/10" : "bg-gray-100"
                        )}
                      >
                        {option.icon}
                      </span>
                    )}
                    <span className="flex-1 font-medium">{option.label}</span>
                    {option.count !== undefined && (
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full font-medium",
                          isGlass
                            ? "bg-white/10 text-white/60"
                            : isDark
                              ? "bg-gray-700 text-gray-400"
                              : "bg-gray-100 text-gray-500"
                        )}
                      >
                        {option.count}
                      </span>
                    )}
                    {!config.multiple && isSelected && (
                      <div className={cn("w-2 h-2 rounded-full bg-gradient-to-r", colors.gradient)} />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================
// ACTIVE FILTER CHIP
// ============================================
interface ActiveFilterChipProps {
  label: string;
  value: string;
  color?: string;
  onRemove: () => void;
  isGlass: boolean;
  isDark: boolean;
}

const ActiveFilterChip: React.FC<ActiveFilterChipProps> = ({
  label,
  value,
  color = "blue",
  onRemove,
  isGlass,
  isDark,
}) => {
  const colors = colorConfig[color as keyof typeof colorConfig] || colorConfig.blue;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={cn(
        "relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full overflow-hidden",
        "text-sm font-medium text-white"
      )}
      style={{ boxShadow: `0 2px 8px ${colors.glow}` }}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-r", colors.gradient)} />
      <Sparkles className="relative z-10 w-3 h-3 text-white/70" />
      <span className="relative z-10 text-xs opacity-80">{label}:</span>
      <span className="relative z-10 font-semibold">{value}</span>
      <button
        type="button"
        onClick={onRemove}
        className="relative z-10 p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </motion.div>
  );
};

// ============================================
// MAIN UNIFIED SEARCH BAR
// ============================================
export const UnifiedSearchBar: React.FC<UnifiedSearchBarProps> = ({
  placeholder = "Search...",
  onSearch,
  onFilterChange,
  filters = [],
  quickFilters = [],
  suggestions = [],
  recentSearches = [],
  className,
  showAdvanced = true,
  showQuickFilters = true,
  variant = "default",
}) => {
  const { theme } = useTheme();
  const isGlass = theme === "glass";
  const isDark = theme === "dark" || theme === "company";

  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, string | string[]>>({});
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeFiltersCount = Object.values(filterValues).filter(
    (v) => (Array.isArray(v) ? v.length > 0 : v)
  ).length;

  // Handle search
  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);
      onSearch(value);
    },
    [onSearch]
  );

  // Handle filter change
  const handleFilterChange = useCallback(
    (filterId: string, value: string | string[]) => {
      const newFilters = { ...filterValues, [filterId]: value };
      setFilterValues(newFilters);
      onFilterChange?.(newFilters);
    },
    [filterValues, onFilterChange]
  );

  // Clear filter
  const clearFilter = useCallback(
    (filterId: string) => {
      const newFilters = { ...filterValues };
      delete newFilters[filterId];
      setFilterValues(newFilters);
      onFilterChange?.(newFilters);
    },
    [filterValues, onFilterChange]
  );

  // Clear all
  const clearAll = useCallback(() => {
    setQuery("");
    setFilterValues({});
    setActiveQuickFilter(null);
    onSearch("");
    onFilterChange?.({});
  }, [onSearch, onFilterChange]);

  // Quick filter click
  const handleQuickFilterClick = (filterId: string) => {
    setActiveQuickFilter(activeQuickFilter === filterId ? null : filterId);
  };

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div ref={containerRef} className={cn("space-y-4", className)}>
      {/* Main Search Bar */}
      <motion.div
        animate={{ scale: isFocused ? 1.01 : 1 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "relative p-4 rounded-2xl transition-all duration-300",
          isGlass
            ? "bg-white/[0.06] backdrop-blur-2xl border border-white/[0.12]"
            : isDark
              ? "bg-gray-800/60 border border-gray-700/60"
              : "bg-white border border-gray-200 shadow-lg shadow-gray-200/50",
          isFocused && [
            isGlass && "border-white/25 shadow-lg shadow-blue-500/10",
            !isGlass && isDark && "border-blue-500/40 shadow-lg shadow-blue-500/10",
            !isGlass && !isDark && "border-blue-300 shadow-xl shadow-blue-500/10",
          ]
        )}
      >
        <div className="flex items-center gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <div
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2",
                "w-8 h-8 rounded-lg flex items-center justify-center",
                "transition-all duration-300",
                isFocused
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                  : isGlass || isDark
                    ? "bg-white/10"
                    : "bg-gray-100"
              )}
            >
              <Search
                className={cn(
                  "w-4 h-4 transition-colors",
                  isFocused ? "text-white" : isGlass || isDark ? "text-white/50" : "text-gray-400"
                )}
              />
            </div>

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => {
                setIsFocused(true);
                setShowSuggestions(true);
              }}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              className={cn(
                "w-full pl-14 pr-24 py-3 rounded-xl text-sm font-medium",
                "border transition-all duration-300 focus:outline-none",
                isGlass && [
                  "bg-white/[0.04] border-white/10",
                  "text-white placeholder-white/40",
                  "focus:bg-white/[0.08] focus:border-white/20",
                ],
                !isGlass && isDark && [
                  "bg-gray-900/50 border-gray-700",
                  "text-white placeholder-gray-500",
                  "focus:bg-gray-900/70 focus:border-gray-600",
                ],
                !isGlass && !isDark && [
                  "bg-gray-50 border-gray-200",
                  "text-gray-800 placeholder-gray-400",
                  "focus:bg-white focus:border-gray-300",
                ]
              )}
            />

            {/* Keyboard shortcut hint */}
            <div
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2",
                "flex items-center gap-1 px-2 py-1 rounded-md",
                "text-xs font-medium",
                isGlass || isDark
                  ? "bg-white/10 text-white/40"
                  : "bg-gray-100 text-gray-400"
              )}
            >
              <Command className="w-3 h-3" />
              <span>K</span>
            </div>
          </div>

          {/* Divider */}
          {showAdvanced && filters.length > 0 && (
            <div
              className={cn(
                "h-10 w-px",
                isGlass ? "bg-white/15" : isDark ? "bg-gray-700" : "bg-gray-200"
              )}
            />
          )}

          {/* Filter Dropdowns */}
          {showAdvanced && (
            <div className="flex items-center gap-2">
              {filters.map((config) => (
                <FilterDropdown
                  key={config.id}
                  config={config}
                  value={filterValues[config.id] || ""}
                  onChange={(value) => handleFilterChange(config.id, value)}
                  isGlass={isGlass}
                  isDark={isDark}
                />
              ))}
            </div>
          )}

          {/* Clear All */}
          {(query || activeFiltersCount > 0) && (
            <button
              type="button"
              onClick={clearAll}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl",
                "text-sm font-medium transition-all duration-200",
                "border-2 border-dashed",
                isGlass && "border-white/20 text-white/60 hover:text-white hover:bg-white/10",
                !isGlass && isDark && "border-gray-600 text-gray-400 hover:text-gray-200 hover:bg-gray-700/50",
                !isGlass && !isDark && "border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              )}
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>

        {/* Quick Filters */}
        {showQuickFilters && quickFilters.length > 0 && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-dashed border-white/10">
            <span
              className={cn(
                "text-xs font-semibold uppercase tracking-wider mr-2",
                isGlass || isDark ? "text-white/40" : "text-gray-400"
              )}
            >
              <Zap className="w-3 h-3 inline mr-1" />
              Quick:
            </span>
            {quickFilters.map((filter) => (
              <motion.button
                key={filter.id}
                type="button"
                onClick={() => handleQuickFilterClick(filter.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "relative px-3 py-1.5 rounded-lg text-xs font-medium",
                  "transition-all duration-200 overflow-hidden",
                  activeQuickFilter === filter.id
                    ? "text-white"
                    : isGlass || isDark
                      ? "text-white/70 hover:text-white bg-white/5 hover:bg-white/10"
                      : "text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200"
                )}
              >
                {activeQuickFilter === filter.id && (
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-r",
                      filter.color || "from-blue-500 to-indigo-600"
                    )}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {filter.icon}
                  {filter.label}
                  {filter.count !== undefined && (
                    <span
                      className={cn(
                        "px-1.5 py-0.5 rounded text-xs",
                        activeQuickFilter === filter.id
                          ? "bg-white/20"
                          : isGlass || isDark
                            ? "bg-white/10"
                            : "bg-gray-200"
                      )}
                    >
                      {filter.count}
                    </span>
                  )}
                </span>
              </motion.button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Active Filters */}
      <AnimatePresence>
        {activeFiltersCount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap items-center gap-2"
          >
            <span
              className={cn(
                "text-xs font-semibold uppercase tracking-wider",
                isGlass || isDark ? "text-white/40" : "text-gray-400"
              )}
            >
              Active:
            </span>
            {Object.entries(filterValues).map(([key, value]) => {
              if (!value || (Array.isArray(value) && value.length === 0)) return null;
              const config = filters.find((f) => f.id === key);
              const displayValue = Array.isArray(value)
                ? value
                    .map((v) => config?.options.find((o) => o.value === v)?.label || v)
                    .join(", ")
                : config?.options.find((o) => o.value === value)?.label || value;

              return (
                <ActiveFilterChip
                  key={key}
                  label={config?.label || key}
                  value={displayValue}
                  color={config?.color}
                  onRemove={() => clearFilter(key)}
                  isGlass={isGlass}
                  isDark={isDark}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && isFocused && (suggestions.length > 0 || recentSearches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              "absolute left-0 right-0 mt-2 p-2 rounded-xl shadow-2xl border z-50",
              isGlass
                ? "bg-gray-900/95 backdrop-blur-xl border-white/15"
                : isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
            )}
          >
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="mb-2">
                <p
                  className={cn(
                    "text-xs font-semibold uppercase tracking-wider px-3 py-2",
                    isGlass || isDark ? "text-white/40" : "text-gray-400"
                  )}
                >
                  <History className="w-3 h-3 inline mr-1" />
                  Recent
                </p>
                {recentSearches.slice(0, 3).map((search, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSearch(search)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm",
                      "transition-colors",
                      isGlass || isDark
                        ? "text-white/70 hover:bg-white/10"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    <Clock className="w-4 h-4 opacity-50" />
                    {search}
                    <ArrowRight className="w-4 h-4 ml-auto opacity-30" />
                  </button>
                ))}
              </div>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div>
                <p
                  className={cn(
                    "text-xs font-semibold uppercase tracking-wider px-3 py-2",
                    isGlass || isDark ? "text-white/40" : "text-gray-400"
                  )}
                >
                  <Star className="w-3 h-3 inline mr-1" />
                  Suggestions
                </p>
                {suggestions.slice(0, 5).map((suggestion) => (
                  <button
                    key={suggestion.id}
                    type="button"
                    onClick={() => handleSearch(suggestion.label)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm",
                      "transition-colors",
                      isGlass || isDark
                        ? "text-white/70 hover:bg-white/10"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    {suggestion.icon || <Search className="w-4 h-4 opacity-50" />}
                    {suggestion.label}
                    <ArrowRight className="w-4 h-4 ml-auto opacity-30" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UnifiedSearchBar;
