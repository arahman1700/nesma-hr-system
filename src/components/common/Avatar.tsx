import React from "react";
import { cn } from "../../utils/cn";
import { User } from "lucide-react";

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "away" | "busy";
  className?: string;
}

const sizeStyles = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-12 h-12 text-lg",
  xl: "w-16 h-16 text-xl",
};

const statusSizeStyles = {
  xs: "w-1.5 h-1.5",
  sm: "w-2 h-2",
  md: "w-2.5 h-2.5",
  lg: "w-3 h-3",
  xl: "w-4 h-4",
};

const statusColors = {
  online: "bg-success",
  offline: "bg-gray-400",
  away: "bg-warning",
  busy: "bg-error",
};

const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = "md",
  status,
  className,
}) => {
  const [imageError, setImageError] = React.useState(false);

  return (
    <div className={cn("relative inline-block overflow-hidden rounded-full", sizeStyles[size], className)}>
      {src && !imageError ? (
        <img
          src={src}
          alt={alt || name || "Avatar"}
          onError={() => setImageError(true)}
          className="w-full h-full rounded-full object-cover bg-gray-100"
        />
      ) : name ? (
        <div className="w-full h-full rounded-full bg-primary flex items-center justify-center font-semibold text-white">
          {getInitials(name)}
        </div>
      ) : (
        <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
          <User className="w-1/2 h-1/2" />
        </div>
      )}
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-2 border-white",
            statusColors[status],
            statusSizeStyles[size],
          )}
        />
      )}
    </div>
  );
};

interface AvatarGroupProps {
  avatars?: Array<{ src?: string; name?: string }>;
  users?: Array<{ src?: string; name?: string }>;
  max?: number;
  size?: AvatarProps["size"];
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  users,
  max = 4,
  size = "md",
}) => {
  const items = avatars || users || [];
  const visibleAvatars = items.slice(0, max);
  const remainingCount = items.length - max;

  return (
    <div className="flex -space-x-2">
      {visibleAvatars.map((avatar, index) => (
        <Avatar
          key={index}
          src={avatar.src}
          name={avatar.name}
          size={size}
          className="ring-2 ring-white"
        />
      ))}
      {remainingCount > 0 && (
        <div
          className={cn(
            "rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-600 ring-2 ring-white",
            sizeStyles[size],
          )}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

export default Avatar;
