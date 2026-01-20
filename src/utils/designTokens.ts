/**
 * NESMA HR System - Unified Design Tokens
 * Version: 2.0.0 | January 2026
 *
 * This file contains all design tokens for consistent UI across the application.
 * Import and use these tokens instead of hardcoding values.
 */

// ============================================
// COLORS - NESMA Brand 2025
// ============================================
export const COLORS = {
  // Primary - NESMA Blue
  primary: {
    DEFAULT: "#2E3192",
    hover: "#252880",
    light: "#e8e9f5",
    50: "#f0f0fa",
    100: "#e0e1f5",
    200: "#c1c3eb",
    300: "#9295d9",
    400: "#6367c7",
    500: "#2E3192",
    600: "#252880",
    700: "#1c1f6e",
    800: "#13165c",
    900: "#0a0d4a",
  },
  // Secondary - Cyan
  secondary: {
    DEFAULT: "#80D1E9",
    hover: "#6bc4de",
    light: "#e0f5f7",
    50: "#f0fafb",
    100: "#e0f5f7",
    200: "#b3e8f2",
    300: "#80D1E9",
    400: "#5cc4e0",
    500: "#38b7d7",
    600: "#2c92ac",
    700: "#206d81",
  },
  // Dark Navy
  dark: {
    DEFAULT: "#0E2841",
    light: "#203366",
    50: "#e6eaed",
    100: "#c0c9d1",
    200: "#96a4b3",
    300: "#6c7f95",
    400: "#4d637f",
    500: "#2e4769",
    600: "#293f5d",
    700: "#0E2841",
  },
  // Status Colors
  success: {
    DEFAULT: "#10B981",
    light: "#d1fae5",
    50: "#ecfdf5",
    500: "#10B981",
    600: "#059669",
  },
  warning: {
    DEFAULT: "#F59E0B",
    light: "#fef3c7",
    50: "#fffbeb",
    500: "#F59E0B",
    600: "#d97706",
  },
  error: {
    DEFAULT: "#EF4444",
    light: "#fee2e2",
    50: "#fef2f2",
    500: "#EF4444",
    600: "#dc2626",
  },
  info: {
    DEFAULT: "#3B82F6",
    light: "#dbeafe",
    50: "#eff6ff",
    500: "#3B82F6",
    600: "#2563eb",
  },
  // Neutral
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },
} as const;

// ============================================
// BORDER RADIUS - Unified Scale
// ============================================
export const BORDER_RADIUS = {
  none: "rounded-none",     // 0px
  xs: "rounded",            // 4px
  sm: "rounded-lg",         // 8px
  md: "rounded-xl",         // 12px
  lg: "rounded-2xl",        // 16px - Default for cards
  xl: "rounded-3xl",        // 24px
  full: "rounded-full",     // 9999px
} as const;

// ============================================
// ICON SIZES - Unified Scale
// ============================================
export const ICON_SIZES = {
  xs: {
    container: "w-6 h-6",
    icon: "w-3 h-3",
  },
  sm: {
    container: "w-8 h-8",
    icon: "w-4 h-4",
  },
  md: {
    container: "w-10 h-10",
    icon: "w-5 h-5",
  },
  lg: {
    container: "w-12 h-12",
    icon: "w-6 h-6",
  },
  xl: {
    container: "w-14 h-14",
    icon: "w-7 h-7",
  },
  "2xl": {
    container: "w-16 h-16",
    icon: "w-8 h-8",
  },
} as const;

// Standalone icon sizes (without container)
export const ICON_ONLY_SIZES = {
  "2xs": "w-3 h-3",    // 12px
  xs: "w-3.5 h-3.5",   // 14px
  sm: "w-4 h-4",       // 16px
  md: "w-5 h-5",       // 20px
  lg: "w-6 h-6",       // 24px
  xl: "w-7 h-7",       // 28px
  "2xl": "w-8 h-8",    // 32px
  "3xl": "w-9 h-9",    // 36px
  "4xl": "w-10 h-10",  // 40px
} as const;

// Icon sizes with CSS selector format (for wrapping elements)
export const ICON_CHILD_SIZES = {
  "2xs": "[&>svg]:w-3 [&>svg]:h-3",
  xs: "[&>svg]:w-3.5 [&>svg]:h-3.5",
  sm: "[&>svg]:w-4 [&>svg]:h-4",
  md: "[&>svg]:w-5 [&>svg]:h-5",
  lg: "[&>svg]:w-6 [&>svg]:h-6",
  xl: "[&>svg]:w-7 [&>svg]:h-7",
  "2xl": "[&>svg]:w-8 [&>svg]:h-8",
  "3xl": "[&>svg]:w-9 [&>svg]:h-9",
  "4xl": "[&>svg]:w-10 [&>svg]:h-10",
} as const;

// ============================================
// SPACING - Unified Scale
// ============================================
export const SPACING = {
  // Padding
  padding: {
    xs: "p-2",
    sm: "p-3",
    md: "p-4",
    lg: "p-5",
    xl: "p-6",
    "2xl": "p-8",
  },
  // Card specific padding
  card: {
    sm: "p-4",
    md: "p-5",
    lg: "p-6",
  },
  // Gap
  gap: {
    xs: "gap-1",
    sm: "gap-2",
    md: "gap-3",
    lg: "gap-4",
    xl: "gap-6",
  },
} as const;

// ============================================
// SHADOWS - NESMA Brand
// ============================================
export const SHADOWS = {
  none: "shadow-none",
  xs: "shadow-[0_1px_2px_rgba(14,40,65,0.05)]",
  sm: "shadow-[0_2px_8px_rgba(14,40,65,0.06)]",
  md: "shadow-[0_4px_12px_rgba(14,40,65,0.08)]",
  lg: "shadow-[0_8px_24px_rgba(14,40,65,0.12)]",
  xl: "shadow-[0_16px_40px_rgba(14,40,65,0.16)]",
  glow: "shadow-[0_0_40px_rgba(128,209,233,0.3)]",
  primary: "shadow-[0_4px_20px_rgba(46,49,146,0.25)]",
  card: "shadow-[0_2px_8px_rgba(14,40,65,0.06)]",
  cardHover: "shadow-[0_8px_24px_rgba(14,40,65,0.12)]",
} as const;

// ============================================
// TRANSITIONS
// ============================================
export const TRANSITIONS = {
  fast: "transition-all duration-150 ease-out",
  normal: "transition-all duration-300 ease-out",
  slow: "transition-all duration-500 ease-out",
} as const;

// ============================================
// GRADIENTS - NESMA Brand
// ============================================
export const GRADIENTS = {
  primary: "bg-gradient-to-r from-[#2E3192] to-[#0E2841]",
  primaryHover: "bg-gradient-to-r from-[#252880] to-[#0a1d32]",
  secondary: "bg-gradient-to-r from-[#80D1E9] to-[#5BC0DE]",
  header: "bg-gradient-to-r from-[#2E3192] via-[#203366] to-[#0E2841]",
  sidebar: "bg-gradient-to-b from-[#0E2841] to-[#162d4a]",
  card: "bg-gradient-to-br from-white to-gray-50",
  cardDark: "bg-gradient-to-br from-[#1a365d] to-[#0E2841]",
} as const;

// ============================================
// COMPONENT TOKENS
// ============================================
export const COMPONENT_TOKENS = {
  // Card tokens
  card: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.card.lg,
    shadow: SHADOWS.card,
    shadowHover: SHADOWS.cardHover,
  },
  // Button tokens
  button: {
    borderRadius: {
      xs: BORDER_RADIUS.sm,
      sm: BORDER_RADIUS.sm,
      md: BORDER_RADIUS.md,
      lg: BORDER_RADIUS.md,
      xl: BORDER_RADIUS.lg,
    },
  },
  // Input tokens
  input: {
    borderRadius: BORDER_RADIUS.md,
    padding: "px-4 py-2.5",
  },
  // Table tokens
  table: {
    borderRadius: BORDER_RADIUS.lg,
    headerPadding: "px-4 py-4",
    cellPadding: "px-4 py-3",
  },
  // Sidebar tokens
  sidebar: {
    iconSize: ICON_ONLY_SIZES.md,
    itemPadding: "px-3 py-2.5",
    borderRadius: BORDER_RADIUS.md,
  },
  // Modal tokens
  modal: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.padding.xl,
  },
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get CSS custom property for a color
 */
export const getCSSColor = (colorPath: string): string => {
  return `var(--nesma-${colorPath.replace(".", "-")})`;
};

/**
 * Generate CSS variables for colors
 */
export const generateCSSVariables = (): Record<string, string> => {
  const variables: Record<string, string> = {};

  Object.entries(COLORS).forEach(([category, shades]) => {
    if (typeof shades === "object") {
      Object.entries(shades).forEach(([shade, value]) => {
        variables[`--nesma-${category}-${shade}`] = value;
      });
    }
  });

  return variables;
};

// ============================================
// STATUS TYPE COLORS - For pages
// ============================================
export const STATUS_COLORS = {
  // Leave Types
  leave: {
    annual: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" },
    sick: { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" },
    emergency: { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200" },
    maternity: { bg: "bg-pink-100", text: "text-pink-700", border: "border-pink-200" },
    hajj: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200" },
    unpaid: { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200" },
  },
  // Request Types
  request: {
    Leave: { bg: "bg-emerald-100", text: "text-emerald-700", color: "#10B981" },
    Overtime: { bg: "bg-amber-100", text: "text-amber-700", color: "#F59E0B" },
    Document: { bg: "bg-blue-100", text: "text-blue-700", color: "#3B82F6" },
    Equipment: { bg: "bg-violet-100", text: "text-violet-700", color: "#8B5CF6" },
    Transfer: { bg: "bg-pink-100", text: "text-pink-700", color: "#EC4899" },
    Training: { bg: "bg-teal-100", text: "text-teal-700", color: "#14B8A6" },
    Advance: { bg: "bg-red-100", text: "text-red-700", color: "#EF4444" },
    Other: { bg: "bg-gray-100", text: "text-gray-700", color: "#6B7280" },
  },
  // Priority Colors
  priority: {
    low: { bg: "bg-gray-100", text: "text-gray-700", color: "#6B7280" },
    medium: { bg: "bg-blue-100", text: "text-blue-700", color: "#3B82F6" },
    high: { bg: "bg-orange-100", text: "text-orange-700", color: "#F59E0B" },
    urgent: { bg: "bg-red-100", text: "text-red-700", color: "#EF4444" },
  },
  // General Status
  status: {
    active: { bg: "bg-emerald-100", text: "text-emerald-700" },
    inactive: { bg: "bg-gray-100", text: "text-gray-500" },
    pending: { bg: "bg-amber-100", text: "text-amber-700" },
    approved: { bg: "bg-green-100", text: "text-green-700" },
    rejected: { bg: "bg-red-100", text: "text-red-700" },
    expired: { bg: "bg-gray-100", text: "text-gray-500" },
  },
} as const;

// ============================================
// TEXT STYLES
// ============================================
export const TEXT_STYLES = {
  heading: {
    xl: "text-2xl font-bold text-gray-900",
    lg: "text-xl font-semibold text-gray-900",
    md: "text-lg font-semibold text-gray-800",
    sm: "text-base font-medium text-gray-800",
  },
  body: {
    lg: "text-base text-gray-700",
    md: "text-sm text-gray-600",
    sm: "text-xs text-gray-500",
  },
  label: "text-sm font-medium text-gray-700",
  caption: "text-xs text-gray-500",
} as const;

// Default export for convenience
export default {
  COLORS,
  BORDER_RADIUS,
  ICON_SIZES,
  ICON_ONLY_SIZES,
  ICON_CHILD_SIZES,
  SPACING,
  SHADOWS,
  TRANSITIONS,
  GRADIENTS,
  COMPONENT_TOKENS,
  STATUS_COLORS,
  TEXT_STYLES,
};
