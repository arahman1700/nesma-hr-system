import React, { ReactNode, useState } from "react";
import { cn } from "../../utils/cn";
import { ChevronDown, ChevronUp, MoreVertical } from "lucide-react";

interface SectionCardProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  variant?: "default" | "glass" | "outlined" | "gradient";
  headerColor?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  className?: string;
  bodyClassName?: string;
  noPadding?: boolean;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  subtitle,
  icon,
  children,
  actions,
  collapsible = false,
  defaultCollapsed = false,
  variant = "default",
  headerColor = "default",
  className,
  bodyClassName,
  noPadding = false,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const variants = {
    default: `
      bg-[var(--theme-card)]
      border border-[var(--theme-card-border)]
      shadow-[var(--theme-shadow)]
    `,
    glass: `
      bg-white/5
      backdrop-blur-xl
      border border-white/10
    `,
    outlined: `
      bg-transparent
      border-2 border-[var(--theme-border)]
    `,
    gradient: `
      bg-gradient-to-br from-[var(--theme-card)] to-transparent
      border border-[var(--theme-card-border)]
    `,
  };

  const headerColors = {
    default: "border-b-[var(--theme-border)]",
    primary: "bg-[#2E3192]/5 border-b-[#2E3192]/20",
    secondary: "bg-[#80D1E9]/10 border-b-[#80D1E9]/30",
    success: "bg-emerald-500/5 border-b-emerald-500/20",
    warning: "bg-amber-500/5 border-b-amber-500/20",
    danger: "bg-red-500/5 border-b-red-500/20",
  };

  const iconBgColors = {
    default: "bg-[var(--theme-primary-light)]",
    primary: "bg-[#2E3192]/20",
    secondary: "bg-[#80D1E9]/20",
    success: "bg-emerald-500/20",
    warning: "bg-amber-500/20",
    danger: "bg-red-500/20",
  };

  return (
    <div
      className={cn(
        "rounded-2xl overflow-hidden transition-all duration-300",
        variants[variant],
        className,
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "px-6 py-4 border-b flex items-center justify-between",
          headerColors[headerColor],
          collapsible && "cursor-pointer select-none",
        )}
        onClick={collapsible ? () => setIsCollapsed(!isCollapsed) : undefined}
      >
        <div className="flex items-center gap-3">
          {icon && (
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                iconBgColors[headerColor],
              )}
            >
              {icon}
            </div>
          )}
          <div>
            <h3 className="text-lg font-bold text-[var(--theme-text)]">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-[var(--theme-text-muted)]">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {actions}
          {collapsible && (
            <button className="p-1 rounded-lg hover:bg-[var(--theme-surface-hover)] transition-colors">
              {isCollapsed ? (
                <ChevronDown className="w-5 h-5 text-[var(--theme-text-muted)]" />
              ) : (
                <ChevronUp className="w-5 h-5 text-[var(--theme-text-muted)]" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div
        className={cn(
          "transition-all duration-300 overflow-hidden",
          isCollapsed ? "max-h-0" : "max-h-[5000px]",
          !noPadding && "p-6",
          bodyClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
};

// Issue Card (from MITC)
interface IssueCardProps {
  number: number;
  title: string;
  description: string;
  severity?: "critical" | "warning" | "info";
  onClick?: () => void;
}

export const IssueCard: React.FC<IssueCardProps> = ({
  number,
  title,
  description,
  severity = "warning",
  onClick,
}) => {
  const severityStyles = {
    critical: {
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      number: "bg-red-500/20 text-red-500",
    },
    warning: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      number: "bg-amber-500/20 text-amber-500",
    },
    info: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      number: "bg-blue-500/20 text-blue-500",
    },
  };

  const styles = severityStyles[severity];

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl border transition-all duration-200",
        styles.bg,
        styles.border,
        onClick && "cursor-pointer hover:scale-[1.01]",
      )}
      onClick={onClick}
    >
      <span
        className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0",
          styles.number,
        )}
      >
        {number}
      </span>
      <div>
        <p className="font-semibold text-[var(--theme-text)]">{title}</p>
        <p className="text-sm text-[var(--theme-text-secondary)] mt-1">
          {description}
        </p>
      </div>
    </div>
  );
};

// Challenge Card (from MITC)
interface ChallengeCardProps {
  title: string;
  items: string[];
  type?: "security" | "storage" | "supervision" | "custom";
  customColor?: string;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  title,
  items,
  type = "custom",
  customColor,
}) => {
  const typeStyles = {
    security: {
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      title: "text-red-500",
    },
    storage: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      title: "text-amber-500",
    },
    supervision: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
      title: "text-blue-500",
    },
    custom: {
      bg: "bg-[var(--theme-primary-light)]",
      border: "border-[var(--theme-primary)]/30",
      title: "text-[var(--theme-primary)]",
    },
  };

  const styles = typeStyles[type];

  return (
    <div className={cn("p-4 rounded-xl border", styles.bg, styles.border)}>
      <p className={cn("font-semibold mb-3", styles.title)}>{title}</p>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li
            key={index}
            className="text-sm text-[var(--theme-text-secondary)] flex items-start gap-2"
          >
            <span className="text-[var(--theme-text-muted)]">•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Action Box (from MITC timeline)
interface ActionBoxProps {
  count: number;
  title: string;
  subtitle?: string;
  items: string[];
  priority?: "immediate" | "short-term" | "long-term";
}

export const ActionBox: React.FC<ActionBoxProps> = ({
  count,
  title,
  subtitle,
  items,
  priority = "short-term",
}) => {
  const priorityStyles = {
    immediate: {
      border: "border-t-red-500",
      count: "bg-red-500/20 text-red-500",
    },
    "short-term": {
      border: "border-t-amber-500",
      count: "bg-amber-500/20 text-amber-500",
    },
    "long-term": {
      border: "border-t-blue-500",
      count: "bg-blue-500/20 text-blue-500",
    },
  };

  const styles = priorityStyles[priority];

  return (
    <div
      className={cn(
        "bg-[var(--theme-card)] border border-[var(--theme-card-border)] rounded-xl p-4 border-t-4",
        styles.border,
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <span
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm",
            styles.count,
          )}
        >
          {count}
        </span>
        <div>
          <p className="font-semibold text-[var(--theme-text)]">{title}</p>
          {subtitle && (
            <p className="text-xs text-[var(--theme-text-muted)]">{subtitle}</p>
          )}
        </div>
      </div>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li
            key={index}
            className="text-sm text-[var(--theme-text-secondary)] flex items-start gap-2"
          >
            <span className="text-[var(--theme-text-muted)]">•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SectionCard;
