export { Button, IconButton, ButtonGroup } from "./Button";
export { Input } from "./Input";
export { Select } from "./Select";
export { Modal } from "./Modal";
export { Table } from "./Table";
export {
  Card,
  KPICard,
  StatCard,
  GlassCard,
  DepartmentCard,
  ChartCard,
} from "./Card";
export {
  Badge,
  StatusBadge,
  PriorityBadge,
  CountBadge,
  TagBadge,
  FeatureBadge,
} from "./Badge";
export { Tabs, TabPanel } from "./Tabs";
export { Avatar, AvatarGroup } from "./Avatar";
export { DatePicker } from "./DatePicker";
export {
  ToastProvider,
  showToast,
  Skeleton,
  CardSkeleton,
  TableSkeleton,
  StatsSkeleton,
} from "./Toast";

// New components
export {
  AnimatedCounter,
  CurrencyCounter,
  PercentageCounter,
  CompactCounter,
} from "./AnimatedCounter";
export { ProgressBar, ProgressRow, CircularProgress } from "./ProgressBar";
export { ScrollIndicator } from "./ScrollIndicator";
export { ParticlesBackground, PortalBackground } from "./ParticlesBackground";
export { MetricCard, GlassMetricCard } from "./MetricCard";
export {
  SectionCard,
  IssueCard,
  ChallengeCard,
  ActionBox,
} from "./SectionCard";
export { ThemeToggle } from "./ThemeToggle";
export {
  ConfirmDialog,
  DeleteConfirmDialog,
  ApproveConfirmDialog,
  RejectConfirmDialog,
} from "./ConfirmDialog";

// Export components
export { ExportButton } from "./ExportButton";
export { StatsCard, MiniStat, DESIGN_TOKENS } from "./StatsCard";
export {
  IconBox,
  StatIcon,
  ServiceLogo,
  gradients,
  iconColors,
} from "./IconBox";

// Animated Icon components
export {
  AnimatedIcon,
  IconBadge,
  StatusIcon,
  FloatingIcon,
} from "./AnimatedIcon";
export type {
  IconAnimation,
  IconBoxVariant,
  IconColorPreset,
  IconSize,
} from "./AnimatedIcon";

// Colored Stats Cards
export {
  ColoredStatsCard,
  MiniColoredCard,
  StatsGrid,
  cardColors,
} from "./ColoredStatsCard";
export type { CardColor, ColoredStatsCardProps } from "./ColoredStatsCard";

// Filter Bar
export { FilterBar, QuickFilterBar } from "./FilterBar";
export type {
  FilterConfig,
  FilterOption,
  ActiveFilter,
  FilterValue,
  FilterBarProps,
  QuickFilterOption,
  QuickFilterBarProps,
} from "./FilterBar";

// Interactive Map with Leaflet
export {
  InteractiveMap,
  LocationList,
  NESMA_LOCATIONS,
} from "./InteractiveMap";
export type {
  MapLocation,
  InteractiveMapProps,
  LocationListProps,
} from "./InteractiveMap";

// HR Dashboard Cards - Advanced stats
export {
  HRStatCard,
  EmployeeTypeCard,
  DemographicsCard,
  TenureCard,
  AttendanceRateCard,
  HRDashboardGrid,
} from "./HRDashboardCards";
export type { HRStats } from "./HRDashboardCards";

// Data Export Modal
export { DataExportModal, createExportData } from "./DataExportModal";
export type {
  ExportFormat,
  ExportData,
  DataExportModalProps,
} from "./DataExportModal";

// AI Assistant (Abbas)
export { AIAssistant } from "./AIAssistant";

// Quick Actions Section
export { QuickActionsSection, MiniQuickActions } from "./QuickActionsSection";

// Keyboard Shortcuts
export { KeyboardShortcuts } from "./KeyboardShortcuts";

// Notification System
export {
  NotificationProvider,
  NotificationBell,
  useNotifications,
} from "./NotificationSystem";
export type {
  Notification,
  NotificationType,
  NotificationCategory,
} from "./NotificationSystem";

// Enhanced UI Components
export {
  Skeleton as EnhancedSkeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonTable,
  EnhancedStat,
  EnhancedTableRow,
  ContextMenu,
  EmptyState as EnhancedEmptyState,
  ProgressIndicator,
  EnhancedAvatar,
  Tooltip,
  commonTableActions,
} from "./EnhancedUI";

// Error Boundary
export { ErrorBoundary } from "./ErrorBoundary";

// Empty State Component
export { EmptyState, SearchEmptyState, TableEmptyState } from "./EmptyState";

// Page Loader
export { PageLoader, PageSkeleton } from "./PageLoader";
