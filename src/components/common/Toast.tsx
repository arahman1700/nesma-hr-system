import React from "react";
import { Toaster, toast } from "react-hot-toast";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "../../utils/cn";
import { ICON_ONLY_SIZES, BORDER_RADIUS, SHADOWS } from "../../utils/designTokens";

// Toast Provider Component
export const ToastProvider: React.FC = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "white",
          color: "#1f2937",
          padding: "16px",
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(14, 40, 65, 0.15)",
          border: "1px solid rgba(46, 49, 146, 0.1)",
          maxWidth: "400px",
        },
      }}
    />
  );
};

// Toast utility functions
export const showToast = {
  success: (
    message: string,
    options?: { title?: string; duration?: number },
  ) => {
    toast.custom(
      (t) => (
        <div
          className={cn(
            "flex items-start gap-3 bg-white rounded-2xl p-4 shadow-xl border border-green-100",
            "transition-all duration-300",
            t.visible ? "animate-slideIn" : "opacity-0 translate-x-full",
          )}
        >
          <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <CheckCircle className={cn(ICON_ONLY_SIZES.md, "text-green-600")} />
          </div>
          <div className="flex-1 min-w-0">
            {options?.title && (
              <p className="font-semibold text-gray-800">{options.title}</p>
            )}
            <p className="text-sm text-gray-600">{message}</p>
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className={cn(ICON_ONLY_SIZES.sm, "text-gray-400")} />
          </button>
        </div>
      ),
      { duration: options?.duration || 4000 },
    );
  },

  error: (message: string, options?: { title?: string; duration?: number }) => {
    toast.custom(
      (t) => (
        <div
          className={cn(
            "flex items-start gap-3 bg-white rounded-2xl p-4 shadow-xl border border-red-100",
            "transition-all duration-300",
            t.visible ? "animate-slideIn" : "opacity-0 translate-x-full",
          )}
        >
          <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
            <XCircle className={cn(ICON_ONLY_SIZES.md, "text-red-600")} />
          </div>
          <div className="flex-1 min-w-0">
            {options?.title && (
              <p className="font-semibold text-gray-800">{options.title}</p>
            )}
            <p className="text-sm text-gray-600">{message}</p>
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className={cn(ICON_ONLY_SIZES.sm, "text-gray-400")} />
          </button>
        </div>
      ),
      { duration: options?.duration || 5000 },
    );
  },

  warning: (
    message: string,
    options?: { title?: string; duration?: number },
  ) => {
    toast.custom(
      (t) => (
        <div
          className={cn(
            "flex items-start gap-3 bg-white rounded-2xl p-4 shadow-xl border border-amber-100",
            "transition-all duration-300",
            t.visible ? "animate-slideIn" : "opacity-0 translate-x-full",
          )}
        >
          <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
            <AlertTriangle className={cn(ICON_ONLY_SIZES.md, "text-amber-600")} />
          </div>
          <div className="flex-1 min-w-0">
            {options?.title && (
              <p className="font-semibold text-gray-800">{options.title}</p>
            )}
            <p className="text-sm text-gray-600">{message}</p>
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className={cn(ICON_ONLY_SIZES.sm, "text-gray-400")} />
          </button>
        </div>
      ),
      { duration: options?.duration || 4000 },
    );
  },

  info: (message: string, options?: { title?: string; duration?: number }) => {
    toast.custom(
      (t) => (
        <div
          className={cn(
            "flex items-start gap-3 bg-white rounded-2xl p-4 shadow-xl border border-blue-100",
            "transition-all duration-300",
            t.visible ? "animate-slideIn" : "opacity-0 translate-x-full",
          )}
        >
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <Info className={cn(ICON_ONLY_SIZES.md, "text-blue-600")} />
          </div>
          <div className="flex-1 min-w-0">
            {options?.title && (
              <p className="font-semibold text-gray-800">{options.title}</p>
            )}
            <p className="text-sm text-gray-600">{message}</p>
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className={cn(ICON_ONLY_SIZES.sm, "text-gray-400")} />
          </button>
        </div>
      ),
      { duration: options?.duration || 4000 },
    );
  },

  loading: (message: string) => {
    return toast.loading(message, {
      style: {
        background: "white",
        color: "#1f2937",
        padding: "16px",
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(14, 40, 65, 0.15)",
        border: "1px solid rgba(46, 49, 146, 0.1)",
      },
    });
  },

  dismiss: (toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    },
  ) => {
    return toast.promise(promise, messages, {
      style: {
        background: "white",
        color: "#1f2937",
        padding: "16px",
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(14, 40, 65, 0.15)",
        border: "1px solid rgba(46, 49, 146, 0.1)",
      },
    });
  },
};

// Skeleton Loading Component
export interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "rounded";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = "text",
  width,
  height,
  animation = "pulse",
}) => {
  const variants = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-none",
    rounded: "rounded-xl",
  };

  const animations = {
    pulse: "animate-pulse",
    wave: "skeleton",
    none: "",
  };

  return (
    <div
      className={cn(
        "bg-gray-200",
        variants[variant],
        animations[animation],
        className,
      )}
      style={{
        width: width,
        height: height || (variant === "text" ? "1em" : undefined),
      }}
    />
  );
};

// Card Skeleton
export const CardSkeleton: React.FC<{ className?: string }> = ({
  className,
}) => {
  return (
    <div className={cn("bg-white rounded-2xl p-6 shadow-sm", className)}>
      <div className="flex items-center gap-4 mb-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1">
          <Skeleton variant="text" width="60%" height={20} className="mb-2" />
          <Skeleton variant="text" width="40%" height={16} />
        </div>
      </div>
      <Skeleton variant="rounded" width="100%" height={80} />
    </div>
  );
};

// Table Skeleton
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 4,
}) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-[#2E3192] to-[#0E2841] p-4">
        <div className="flex gap-4">
          {Array(columns)
            .fill(0)
            .map((_, i) => (
              <Skeleton
                key={i}
                variant="text"
                width={`${100 / columns}%`}
                height={20}
                className="bg-white/20"
              />
            ))}
        </div>
      </div>
      <div className="p-4 space-y-4">
        {Array(rows)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="flex gap-4">
              {Array(columns)
                .fill(0)
                .map((_, j) => (
                  <Skeleton
                    key={j}
                    variant="text"
                    width={`${100 / columns}%`}
                    height={16}
                  />
                ))}
            </div>
          ))}
      </div>
    </div>
  );
};

// Stats Skeleton
export const StatsSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-gray-200"
          >
            <div className="flex items-start justify-between mb-4">
              <Skeleton variant="rounded" width={48} height={48} />
            </div>
            <Skeleton variant="text" width="50%" height={16} className="mb-2" />
            <Skeleton variant="text" width="70%" height={32} />
          </div>
        ))}
    </div>
  );
};

export default ToastProvider;
