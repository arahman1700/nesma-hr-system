import React from "react";
import { cn } from "../../utils/cn";
import { useTheme } from "../../contexts/ThemeContext";

// Animation types
export type IconAnimation =
  | "none"
  | "float"
  | "pulse"
  | "bounce"
  | "spin"
  | "shake"
  | "pop"
  | "wiggle"
  | "heartbeat"
  | "ring"
  | "flip"
  | "tada";

// Icon box variants
export type IconBoxVariant =
  | "solid"
  | "gradient"
  | "glass"
  | "outline"
  | "glow"
  | "neon";

// Color presets
export type IconColorPreset =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "purple"
  | "pink"
  | "cyan"
  | "emerald"
  | "amber"
  | "rose";

// Icon sizes
export type IconSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

interface AnimatedIconProps {
  icon: React.ReactNode;
  animation?: IconAnimation;
  animateOnHover?: boolean;
  variant?: IconBoxVariant;
  color?: IconColorPreset;
  size?: IconSize;
  rounded?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
  iconClassName?: string;
  onClick?: () => void;
  showGlow?: boolean;
  pulse?: boolean; // Continuous pulse for status indicators
}

// Color configurations
const colorConfig: Record<
  IconColorPreset,
  {
    solid: string;
    gradient: { from: string; to: string };
    text: string;
    glow: string;
    neon: string;
  }
> = {
  primary: {
    solid: "bg-[#2E3192]",
    gradient: { from: "#2E3192", to: "#0E2841" },
    text: "text-[#2E3192]",
    glow: "rgba(46, 49, 146, 0.5)",
    neon: "#2E3192",
  },
  secondary: {
    solid: "bg-[#80D1E9]",
    gradient: { from: "#80D1E9", to: "#2E3192" },
    text: "text-[#80D1E9]",
    glow: "rgba(128, 209, 233, 0.5)",
    neon: "#80D1E9",
  },
  success: {
    solid: "bg-emerald-500",
    gradient: { from: "#10B981", to: "#059669" },
    text: "text-emerald-500",
    glow: "rgba(16, 185, 129, 0.5)",
    neon: "#10B981",
  },
  warning: {
    solid: "bg-amber-500",
    gradient: { from: "#F59E0B", to: "#D97706" },
    text: "text-amber-500",
    glow: "rgba(245, 158, 11, 0.5)",
    neon: "#F59E0B",
  },
  danger: {
    solid: "bg-rose-500",
    gradient: { from: "#EF4444", to: "#DC2626" },
    text: "text-rose-500",
    glow: "rgba(239, 68, 68, 0.5)",
    neon: "#EF4444",
  },
  info: {
    solid: "bg-blue-500",
    gradient: { from: "#3B82F6", to: "#2563EB" },
    text: "text-blue-500",
    glow: "rgba(59, 130, 246, 0.5)",
    neon: "#3B82F6",
  },
  purple: {
    solid: "bg-purple-500",
    gradient: { from: "#A855F7", to: "#7C3AED" },
    text: "text-purple-500",
    glow: "rgba(168, 85, 247, 0.5)",
    neon: "#A855F7",
  },
  pink: {
    solid: "bg-pink-500",
    gradient: { from: "#EC4899", to: "#DB2777" },
    text: "text-pink-500",
    glow: "rgba(236, 72, 153, 0.5)",
    neon: "#EC4899",
  },
  cyan: {
    solid: "bg-cyan-500",
    gradient: { from: "#06B6D4", to: "#0891B2" },
    text: "text-cyan-500",
    glow: "rgba(6, 182, 212, 0.5)",
    neon: "#06B6D4",
  },
  emerald: {
    solid: "bg-emerald-500",
    gradient: { from: "#10B981", to: "#047857" },
    text: "text-emerald-500",
    glow: "rgba(16, 185, 129, 0.5)",
    neon: "#10B981",
  },
  amber: {
    solid: "bg-amber-500",
    gradient: { from: "#F59E0B", to: "#B45309" },
    text: "text-amber-500",
    glow: "rgba(245, 158, 11, 0.5)",
    neon: "#F59E0B",
  },
  rose: {
    solid: "bg-rose-500",
    gradient: { from: "#F43F5E", to: "#E11D48" },
    text: "text-rose-500",
    glow: "rgba(244, 63, 94, 0.5)",
    neon: "#F43F5E",
  },
};

// Size configurations
const sizeConfig: Record<
  IconSize,
  { box: string; icon: string; padding: string }
> = {
  xs: { box: "w-7 h-7", icon: "w-3.5 h-3.5", padding: "p-1.5" },
  sm: { box: "w-9 h-9", icon: "w-4 h-4", padding: "p-2" },
  md: { box: "w-11 h-11", icon: "w-5 h-5", padding: "p-2.5" },
  lg: { box: "w-14 h-14", icon: "w-6 h-6", padding: "p-3" },
  xl: { box: "w-16 h-16", icon: "w-7 h-7", padding: "p-3.5" },
  "2xl": { box: "w-20 h-20", icon: "w-9 h-9", padding: "p-4" },
};

// Rounded configurations
const roundedConfig: Record<string, string> = {
  sm: "rounded-lg",
  md: "rounded-xl",
  lg: "rounded-2xl",
  xl: "rounded-3xl",
  full: "rounded-full",
};

// Animation class mappings
const animationClasses: Record<IconAnimation, string> = {
  none: "",
  float: "icon-animate-float",
  pulse: "icon-animate-pulse",
  bounce: "icon-animate-bounce",
  spin: "icon-animate-spin",
  shake: "icon-animate-shake",
  pop: "icon-animate-pop",
  wiggle: "icon-animate-wiggle",
  heartbeat: "icon-animate-heartbeat",
  ring: "icon-animate-ring",
  flip: "icon-animate-flip",
  tada: "icon-animate-tada",
};

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  icon,
  animation = "none",
  animateOnHover = true,
  variant = "solid",
  color = "primary",
  size = "md",
  rounded = "xl",
  className,
  iconClassName,
  onClick,
  showGlow = false,
  pulse = false,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company" || theme === "glass";
  const isGlass = theme === "glass";

  const colors = colorConfig[color];
  const sizes = sizeConfig[size];

  // Get variant styles
  const getVariantStyles = (): {
    className: string;
    style: React.CSSProperties;
  } => {
    switch (variant) {
      case "gradient":
        return {
          className: "text-white",
          style: {
            background: `linear-gradient(135deg, ${colors.gradient.from} 0%, ${colors.gradient.to} 100%)`,
          },
        };
      case "glass":
        return {
          className: cn(
            "text-white backdrop-blur-md",
            "bg-white/10 border border-white/20",
            isGlass && "bg-white/5",
          ),
          style: {},
        };
      case "outline":
        return {
          className: cn(
            "bg-transparent border-2",
            isDark ? "border-current" : `border-current`,
            colors.text,
          ),
          style: {},
        };
      case "glow":
        return {
          className: cn("text-white", isDark ? "bg-white/10" : colors.solid),
          style: {
            boxShadow: `0 0 20px ${colors.glow}, 0 0 40px ${colors.glow}`,
          },
        };
      case "neon":
        return {
          className: "bg-transparent",
          style: {
            color: colors.neon,
            textShadow: `0 0 10px ${colors.neon}, 0 0 20px ${colors.neon}, 0 0 30px ${colors.neon}`,
            border: `2px solid ${colors.neon}`,
            boxShadow: `0 0 10px ${colors.neon}, inset 0 0 10px ${colors.neon}20`,
          },
        };
      case "solid":
      default:
        return {
          className: cn(
            "text-white",
            isDark ? `${colors.solid}/80` : colors.solid,
          ),
          style: {},
        };
    }
  };

  const variantStyles = getVariantStyles();

  // Render icon with proper sizing
  const renderIcon = () => {
    if (React.isValidElement(icon)) {
      const iconElement = icon as React.ReactElement<{ className?: string }>;
      return React.cloneElement(iconElement, {
        className: cn(sizes.icon, iconClassName, iconElement.props.className),
      });
    }
    return icon;
  };

  return (
    <div
      className={cn(
        // Base styles
        "icon-box relative flex items-center justify-center",
        "transition-all duration-300 ease-out",
        "overflow-hidden",

        // Size and shape
        sizes.box,
        sizes.padding,
        roundedConfig[rounded],

        // Variant styles
        variantStyles.className,

        // Animation
        animateOnHover ? animationClasses[animation] : "",
        !animateOnHover && animation !== "none" && animationClasses[animation],

        // Glow effect
        showGlow && "icon-box-glow",

        // Pulse effect for status indicators
        pulse && "animate-pulse",

        // Clickable
        onClick && "cursor-pointer hover:scale-110",

        // Premium shine effect
        "before:absolute before:inset-0",
        "before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-transparent",
        "before:opacity-0 before:transition-opacity before:duration-300",
        "hover:before:opacity-100",

        className,
      )}
      style={variantStyles.style}
      onClick={onClick}
    >
      {/* Icon */}
      <span className="relative z-10">{renderIcon()}</span>

      {/* Glow ring for neon variant */}
      {variant === "neon" && (
        <span
          className="absolute inset-0 rounded-inherit opacity-50"
          style={{
            background: `radial-gradient(circle at center, ${colors.neon}20 0%, transparent 70%)`,
          }}
        />
      )}
    </div>
  );
};

// Icon Badge - A smaller version for inline use
interface IconBadgeProps {
  icon: React.ReactNode;
  color?: IconColorPreset;
  size?: "xs" | "sm" | "md";
  className?: string;
}

export const IconBadge: React.FC<IconBadgeProps> = ({
  icon,
  color = "primary",
  size = "sm",
  className,
}) => {
  const sizes = {
    xs: "w-5 h-5 [&>svg]:w-3 [&>svg]:h-3",
    sm: "w-6 h-6 [&>svg]:w-3.5 [&>svg]:h-3.5",
    md: "w-8 h-8 [&>svg]:w-4 [&>svg]:h-4",
  };

  const colors = colorConfig[color];

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-lg",
        "bg-gradient-to-br text-white",
        sizes[size],
        className,
      )}
      style={{
        background: `linear-gradient(135deg, ${colors.gradient.from} 0%, ${colors.gradient.to} 100%)`,
      }}
    >
      {icon}
    </span>
  );
};

// Status Icon - For status indicators
interface StatusIconProps {
  status:
    | "online"
    | "offline"
    | "busy"
    | "away"
    | "success"
    | "error"
    | "warning"
    | "info";
  size?: "xs" | "sm" | "md" | "lg";
  pulse?: boolean;
  className?: string;
}

export const StatusIcon: React.FC<StatusIconProps> = ({
  status,
  size = "sm",
  pulse = true,
  className,
}) => {
  const statusColors: Record<string, string> = {
    online: "bg-emerald-500",
    offline: "bg-gray-400",
    busy: "bg-rose-500",
    away: "bg-amber-500",
    success: "bg-emerald-500",
    error: "bg-rose-500",
    warning: "bg-amber-500",
    info: "bg-blue-500",
  };

  const sizes = {
    xs: "w-2 h-2",
    sm: "w-2.5 h-2.5",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  const getStatusDotClass = () => {
    if (status === "online" || status === "success")
      return "status-dot-success";
    if (status === "error" || status === "busy") return "status-dot-danger";
    if (status === "warning" || status === "away") return "status-dot-warning";
    return "status-dot-info";
  };

  return (
    <span
      className={cn(
        "status-dot relative inline-block rounded-full",
        statusColors[status],
        sizes[size],
        pulse && getStatusDotClass(),
        className,
      )}
    >
      {pulse && (
        <span
          className={cn(
            "absolute inset-0 rounded-full animate-ping opacity-75",
            statusColors[status],
          )}
        />
      )}
    </span>
  );
};

// Floating Action Icon - For FABs
interface FloatingIconProps {
  icon: React.ReactNode;
  color?: IconColorPreset;
  onClick?: () => void;
  className?: string;
  tooltip?: string;
}

export const FloatingIcon: React.FC<FloatingIconProps> = ({
  icon,
  color = "primary",
  onClick,
  className,
  tooltip,
}) => {
  const colors = colorConfig[color];

  return (
    <button
      className={cn(
        "w-14 h-14 rounded-full",
        "flex items-center justify-center",
        "text-white shadow-lg",
        "transition-all duration-300",
        "hover:scale-110 hover:shadow-xl",
        "active:scale-95",
        "focus:outline-none focus-premium",
        "[&>svg]:w-6 [&>svg]:h-6",
        className,
      )}
      style={{
        background: `linear-gradient(135deg, ${colors.gradient.from} 0%, ${colors.gradient.to} 100%)`,
        boxShadow: `0 8px 24px ${colors.glow}`,
      }}
      onClick={onClick}
      title={tooltip}
    >
      {icon}
    </button>
  );
};

export default AnimatedIcon;
