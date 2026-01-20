import React from "react";
import { cn } from "../../utils/cn";
import { AlertTriangle, Trash2, CheckCircle, Info, X } from "lucide-react";
import { Button } from "./Button";
import { ICON_ONLY_SIZES, BORDER_RADIUS } from "../../utils/designTokens";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "success" | "info";
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const typeConfig = {
    danger: {
      icon: <Trash2 className={ICON_ONLY_SIZES.lg} />,
      iconBg: "bg-red-100 text-red-600",
      confirmVariant: "danger" as const,
    },
    warning: {
      icon: <AlertTriangle className={ICON_ONLY_SIZES.lg} />,
      iconBg: "bg-amber-100 text-amber-600",
      confirmVariant: "primary" as const,
    },
    success: {
      icon: <CheckCircle className={ICON_ONLY_SIZES.lg} />,
      iconBg: "bg-emerald-100 text-emerald-600",
      confirmVariant: "success" as const,
    },
    info: {
      icon: <Info className={ICON_ONLY_SIZES.lg} />,
      iconBg: "bg-blue-100 text-blue-600",
      confirmVariant: "primary" as const,
    },
  };

  const config = typeConfig[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        className={cn(
          "relative w-full max-w-md rounded-2xl overflow-hidden",
          "bg-[var(--theme-surface)] border border-[var(--theme-border)]",
          "shadow-2xl",
          "animate-in fade-in zoom-in-95 duration-200",
        )}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-[var(--theme-surface-hover)] transition-colors"
        >
          <X className={cn(ICON_ONLY_SIZES.md, "text-[var(--theme-text-muted)]")} />
        </button>

        {/* Content */}
        <div className="p-6">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div
              className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center",
                config.iconBg,
              )}
            >
              {config.icon}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-center text-[var(--theme-text)] mb-2">
            {title}
          </h3>

          {/* Message */}
          <p className="text-center text-[var(--theme-text-secondary)] mb-6">
            {message}
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              fullWidth
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelText}
            </Button>
            <Button
              variant={config.confirmVariant}
              fullWidth
              onClick={onConfirm}
              isLoading={isLoading}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Delete confirmation preset
export const DeleteConfirmDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
  isLoading?: boolean;
}> = ({ isOpen, onClose, onConfirm, itemName = "this item", isLoading }) => {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete Confirmation"
      message={`Are you sure you want to delete ${itemName}? This action cannot be undone.`}
      confirmText="Delete"
      cancelText="Cancel"
      type="danger"
      isLoading={isLoading}
    />
  );
};

// Approve confirmation preset
export const ApproveConfirmDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
  isLoading?: boolean;
}> = ({ isOpen, onClose, onConfirm, itemName = "this request", isLoading }) => {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Approve Request"
      message={`Are you sure you want to approve ${itemName}?`}
      confirmText="Approve"
      cancelText="Cancel"
      type="success"
      isLoading={isLoading}
    />
  );
};

// Reject confirmation with reason
interface RejectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  itemName?: string;
  isLoading?: boolean;
}

export const RejectConfirmDialog: React.FC<RejectDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName = "this request",
  isLoading,
}) => {
  const [reason, setReason] = React.useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(reason);
    setReason("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={cn(
          "relative w-full max-w-md rounded-2xl overflow-hidden",
          "bg-[var(--theme-surface)] border border-[var(--theme-border)]",
          "shadow-2xl",
          "animate-in fade-in zoom-in-95 duration-200",
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-[var(--theme-surface-hover)] transition-colors"
        >
          <X className={cn(ICON_ONLY_SIZES.md, "text-[var(--theme-text-muted)]")} />
        </button>

        <div className="p-6">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-red-100 text-red-600">
              <X className={ICON_ONLY_SIZES.lg} />
            </div>
          </div>

          <h3 className="text-xl font-bold text-center text-[var(--theme-text)] mb-2">
            Reject Request
          </h3>

          <p className="text-center text-[var(--theme-text-secondary)] mb-4">
            Please provide a reason for rejecting {itemName}.
          </p>

          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter rejection reason..."
            className={cn(
              "w-full px-4 py-3 rounded-xl border mb-6",
              "bg-[var(--theme-surface)] border-[var(--theme-border)]",
              "text-[var(--theme-text)] placeholder:text-[var(--theme-text-muted)]",
              "focus:outline-none focus:ring-2 focus:ring-[#2E3192]/30 focus:border-[#2E3192]",
              "resize-none",
            )}
            rows={3}
          />

          <div className="flex gap-3">
            <Button
              variant="outline"
              fullWidth
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              fullWidth
              onClick={handleConfirm}
              isLoading={isLoading}
              disabled={!reason.trim()}
            >
              Reject
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
