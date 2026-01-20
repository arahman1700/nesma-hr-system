import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "../../utils/cn";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoHome = (): void => {
    window.location.href = "/";
  };

  toggleDetails = (): void => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="max-w-lg w-full">
            {/* Error Card */}
            <div className="bg-white rounded-2xl shadow-large border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-error-500 to-error-600 p-6 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  Something went wrong
                </h2>
                <p className="text-white/80 text-sm">
                  An unexpected error occurred. Please try again.
                </p>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Error Message */}
                <div className="bg-error-50 border border-error-100 rounded-xl p-4 mb-4">
                  <p className="text-error-700 text-sm font-medium">
                    {this.state.error?.message || "Unknown error"}
                  </p>
                </div>

                {/* Details Toggle */}
                <button
                  onClick={this.toggleDetails}
                  className="w-full flex items-center justify-between p-3 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors mb-4"
                  aria-expanded={this.state.showDetails}
                >
                  <span>Technical Details</span>
                  {this.state.showDetails ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {/* Error Details */}
                {this.state.showDetails && this.state.errorInfo && (
                  <div className="bg-gray-50 rounded-xl p-4 mb-4 overflow-auto max-h-48">
                    <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={this.handleRetry}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all",
                      "bg-primary text-white hover:bg-primary-hover",
                      "focus:outline-none focus:ring-2 focus:ring-primary/50"
                    )}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                  </button>
                  <button
                    onClick={this.handleGoHome}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all",
                      "bg-gray-100 text-gray-700 hover:bg-gray-200",
                      "focus:outline-none focus:ring-2 focus:ring-gray-300"
                    )}
                  >
                    <Home className="w-4 h-4" />
                    Go Home
                  </button>
                </div>
              </div>
            </div>

            {/* Help Text */}
            <p className="text-center text-sm text-gray-500 mt-4">
              If the problem persists, please contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
