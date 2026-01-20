import React from "react";
import {
  FileX,
  Users,
  Calendar,
  ClipboardList,
  Search,
  Inbox,
  FolderOpen,
  Bell,
  Clock,
  FileText,
  TrendingUp,
  LucideIcon,
} from "lucide-react";
import { cn } from "../../utils/cn";

type EmptyStateVariant =
  | "default"
  | "search"
  | "employees"
  | "calendar"
  | "tasks"
  | "notifications"
  | "files"
  | "requests"
  | "attendance"
  | "reports";

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title?: string;
  description?: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  compact?: boolean;
}

const variantConfig: Record<
  EmptyStateVariant,
  { icon: LucideIcon; title: string; description: string }
> = {
  default: {
    icon: Inbox,
    title: "No data available",
    description: "There's nothing to display here yet.",
  },
  search: {
    icon: Search,
    title: "No results found",
    description: "Try adjusting your search or filter criteria.",
  },
  employees: {
    icon: Users,
    title: "No employees found",
    description: "Add your first employee to get started.",
  },
  calendar: {
    icon: Calendar,
    title: "No events scheduled",
    description: "Your calendar is empty. Schedule an event to see it here.",
  },
  tasks: {
    icon: ClipboardList,
    title: "No tasks available",
    description: "All tasks have been completed or none have been created yet.",
  },
  notifications: {
    icon: Bell,
    title: "No notifications",
    description: "You're all caught up! No new notifications.",
  },
  files: {
    icon: FolderOpen,
    title: "No files uploaded",
    description: "Upload documents to store them securely.",
  },
  requests: {
    icon: FileX,
    title: "No requests",
    description: "There are no pending requests at this time.",
  },
  attendance: {
    icon: Clock,
    title: "No attendance records",
    description: "Attendance data will appear here once recorded.",
  },
  reports: {
    icon: TrendingUp,
    title: "No reports available",
    description: "Generate reports to view analytics and insights.",
  },
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  variant = "default",
  title,
  description,
  icon,
  action,
  secondaryAction,
  className,
  compact = false,
}) => {
  const config = variantConfig[variant];
  const Icon = icon || config.icon;
  const displayTitle = title || config.title;
  const displayDescription = description || config.description;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "py-8 px-4" : "py-16 px-6",
        className
      )}
      role="status"
      aria-label={displayTitle}
    >
      {/* Icon Container */}
      <div
        className={cn(
          "flex items-center justify-center rounded-full bg-gray-100",
          compact ? "w-12 h-12 mb-3" : "w-20 h-20 mb-4"
        )}
      >
        <Icon
          className={cn(
            "text-gray-400",
            compact ? "w-6 h-6" : "w-10 h-10"
          )}
        />
      </div>

      {/* Title */}
      <h3
        className={cn(
          "font-semibold text-gray-800",
          compact ? "text-base mb-1" : "text-lg mb-2"
        )}
      >
        {displayTitle}
      </h3>

      {/* Description */}
      <p
        className={cn(
          "text-gray-500 max-w-sm",
          compact ? "text-sm" : "text-base mb-6"
        )}
      >
        {displayDescription}
      </p>

      {/* Actions */}
      {(action || secondaryAction) && !compact && (
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          {action && (
            <button
              onClick={action.onClick}
              className={cn(
                "px-5 py-2.5 rounded-xl font-medium transition-all",
                "bg-primary text-white hover:bg-primary-hover",
                "focus:outline-none focus:ring-2 focus:ring-primary/50"
              )}
            >
              {action.label}
            </button>
          )}
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className={cn(
                "px-5 py-2.5 rounded-xl font-medium transition-all",
                "bg-gray-100 text-gray-700 hover:bg-gray-200",
                "focus:outline-none focus:ring-2 focus:ring-gray-300"
              )}
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// Specific Empty State Components for common use cases
export const SearchEmptyState: React.FC<{
  searchTerm?: string;
  onClear?: () => void;
}> = ({ searchTerm, onClear }) => (
  <EmptyState
    variant="search"
    title={searchTerm ? `No results for "${searchTerm}"` : "No results found"}
    description="Try adjusting your search or filter to find what you're looking for."
    action={onClear ? { label: "Clear Search", onClick: onClear } : undefined}
  />
);

export const TableEmptyState: React.FC<{
  title?: string;
  description?: string;
  onAdd?: () => void;
  addLabel?: string;
}> = ({ title, description, onAdd, addLabel = "Add New" }) => (
  <EmptyState
    variant="default"
    title={title || "No data available"}
    description={description || "There's nothing to display in this table yet."}
    action={onAdd ? { label: addLabel, onClick: onAdd } : undefined}
    compact
  />
);

export default EmptyState;
