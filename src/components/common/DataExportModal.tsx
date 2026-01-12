import React, { useState } from "react";
import {
  X,
  Download,
  FileText,
  Table,
  Mail,
  Eye,
  Check,
  Loader2,
  FileSpreadsheet,
  File,
  Share2,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { useTheme } from "../../contexts/ThemeContext";

// Export format types
export type ExportFormat = "pdf" | "excel" | "word" | "sheets" | "email";

export interface ExportData {
  title: string;
  columns: { key: string; label: string }[];
  data: Record<string, any>[];
  summary?: {
    label: string;
    value: string | number;
  }[];
}

export interface DataExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ExportData;
  onExport?: (format: ExportFormat, data: ExportData) => void;
}

// Official Brand Icons
const PDFIcon = () => (
  <svg viewBox="0 0 32 32" className="w-7 h-7">
    <path
      fill="#E2574C"
      d="M28.681 7.159c-.694-.947-1.662-2.053-2.724-3.116s-2.169-2.03-3.116-2.724C21.534.514 20.418 0 19.636 0H4c-.553 0-1 .447-1 1v30c0 .553.447 1 1 1h24c.553 0 1-.447 1-1V9.364c0-.782-.514-1.898-1.319-2.205z"
    />
    <path
      fill="#B53629"
      d="M28.681 7.159c-.694-.947-1.662-2.053-2.724-3.116-.324-.324-.65-.628-.972-.911V6.75c0 .689.561 1.25 1.25 1.25h3.618c-.283-.322-.587-.648-.911-.972z"
    />
    <path
      fill="#F2F2F2"
      d="M8 22v-1h2.623c.357 0 .658-.127.923-.393.266-.264.393-.565.393-.923s-.127-.659-.393-.923c-.265-.266-.566-.393-.923-.393H9c-.553 0-1 .447-1 1v2.634c0 .553.447 1 1 1h2c.553 0 1-.447 1-1v-.5h-1v.5H9zm6.5-3.634c-.553 0-1 .447-1 1v2.634c0 .553.447 1 1 1h1.5c.553 0 1-.447 1-1v-2.634c0-.553-.447-1-1-1h-1.5zm.5 1h.5v2.634H15v-2.634zm4.5-1c-.553 0-1 .447-1 1v3.634h1v-1.317h1c.553 0 1-.447 1-1v-1.317c0-.553-.447-1-1-1h-1zm0 1h1v1.317h-1v-1.317z"
    />
    <path
      fill="#F15642"
      d="M4 1v30h24V9.364c0-.782-.514-1.898-1.319-2.205-.694-.947-1.662-2.053-2.724-3.116s-2.169-2.03-3.116-2.724C19.534.514 18.418 0 17.636 0H4z"
      opacity=".2"
    />
  </svg>
);

const ExcelIcon = () => (
  <svg viewBox="0 0 32 32" className="w-7 h-7">
    <path
      fill="#185C37"
      d="M28.781 4.405H18.651V0.018L0 2.592V29.41l18.651 2.572V27.59h10.13c0.678 0 1.229-0.549 1.229-1.228V5.633C30.01 4.955 29.459 4.405 28.781 4.405z"
    />
    <path
      fill="#21A366"
      d="M18.651 4.405H28.78c0.678 0 1.23 0.55 1.23 1.228v20.73c0 0.678-0.552 1.227-1.23 1.227H18.651V4.405z"
    />
    <path
      fill="#107C41"
      d="M7.005 18.199L10.482 12l-3.149-6.199h2.732l1.739 4.019c0.161 0.382 0.271 0.666 0.331 0.854h0.022c0.115-0.302 0.241-0.601 0.378-0.896l1.859-3.977h2.51L13.439 12l3.594 6.199h-2.79l-1.988-4.312c-0.084-0.169-0.156-0.348-0.216-0.536h-0.033c-0.054 0.182-0.125 0.359-0.212 0.528l-2.069 4.32H7.005z"
    />
    <path
      fill="#33C481"
      d="M28.781 4.405H18.651v4.086h11.36V5.633C30.01 4.955 29.459 4.405 28.781 4.405z"
    />
    <path fill="#107C41" d="M18.651 12.744h11.36v4.086h-11.36V12.744z" />
    <path fill="#185C37" d="M18.651 21.083h11.36v4.086h-11.36V21.083z" />
  </svg>
);

const WordIcon = () => (
  <svg viewBox="0 0 32 32" className="w-7 h-7">
    <path
      fill="#2B579A"
      d="M28.781 4.405H18.651V0.018L0 2.592V29.41l18.651 2.572V27.59h10.13c0.678 0 1.229-0.549 1.229-1.228V5.633C30.01 4.955 29.459 4.405 28.781 4.405z"
    />
    <path
      fill="#41A5EE"
      d="M18.651 4.405H28.78c0.678 0 1.23 0.55 1.23 1.228v20.73c0 0.678-0.552 1.227-1.23 1.227H18.651V4.405z"
    />
    <path
      fill="#2B579A"
      d="M18.651 8.491h4.086v4.086h-4.086V8.491zm0 6.129h4.086v4.086h-4.086v-4.086zm0 6.129h4.086v4.086h-4.086V20.749zm6.129-12.258h4.086v4.086h-4.086V8.491zm0 6.129h4.086v4.086h-4.086v-4.086zm0 6.129h4.086v4.086h-4.086V20.749z"
    />
    <path
      fill="#FFFFFF"
      d="M5.651 6.199h2.227l1.412 7.447 1.64-7.447h1.885l1.64 7.447 1.412-7.447h2.085l-2.312 11.603h-2.142L11.314 9.93l-2.17 7.872H7.001L5.651 6.199z"
    />
  </svg>
);

const GoogleSheetsIcon = () => (
  <svg viewBox="0 0 32 32" className="w-7 h-7">
    <path
      fill="#23A566"
      d="M28 8L20 0H6a2 2 0 00-2 2v28a2 2 0 002 2h20a2 2 0 002-2V8z"
    />
    <path fill="#1C8B53" d="M20 0v6a2 2 0 002 2h6L20 0z" />
    <path fill="#FFFFFF" d="M24 14H8v12h16V14z" />
    <path
      fill="#23A566"
      d="M8 14h16v2H8v-2zm0 4h5v2H8v-2zm7 0h5v2h-5v-2zm7 0h2v2h-2v-2zm-14 4h5v2H8v-2zm7 0h5v2h-5v-2zm7 0h2v2h-2v-2z"
    />
  </svg>
);

// Brand colors for export buttons
const exportFormats: {
  id: ExportFormat;
  name: string;
  icon: React.ReactNode;
  gradient: string;
  bgColor: string;
  description: string;
}[] = [
  {
    id: "pdf",
    name: "PDF",
    icon: <PDFIcon />,
    gradient: "from-[#E2574C] to-[#B53629]",
    bgColor: "bg-red-500/10",
    description: "Adobe PDF Document",
  },
  {
    id: "excel",
    name: "Excel",
    icon: <ExcelIcon />,
    gradient: "from-[#185C37] to-[#107C41]",
    bgColor: "bg-green-500/10",
    description: "Microsoft Excel Spreadsheet",
  },
  {
    id: "word",
    name: "Word",
    icon: <WordIcon />,
    gradient: "from-[#2B579A] to-[#41A5EE]",
    bgColor: "bg-blue-500/10",
    description: "Microsoft Word Document",
  },
  {
    id: "sheets",
    name: "Google Sheets",
    icon: <GoogleSheetsIcon />,
    gradient: "from-[#23A566] to-[#34A853]",
    bgColor: "bg-emerald-500/10",
    description: "Google Sheets Spreadsheet",
  },
  {
    id: "email",
    name: "Send via Email",
    icon: <Mail className="w-6 h-6" />,
    gradient: "from-purple-500 to-indigo-600",
    bgColor: "bg-purple-500/10",
    description: "Send as email attachment",
  },
];

export const DataExportModal: React.FC<DataExportModalProps> = ({
  isOpen,
  onClose,
  data,
  onExport,
}) => {
  const { theme } = useTheme();
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat | null>(
    null,
  );
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [emailAddress, setEmailAddress] = useState("");

  const isDark = theme === "dark" || theme === "company" || theme === "glass";
  const isGlass = theme === "glass";

  if (!isOpen) return null;

  const handleExport = async (format: ExportFormat) => {
    setSelectedFormat(format);

    if (format === "email" && !emailAddress) {
      return;
    }

    setIsExporting(true);

    // Simulate export
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (onExport) {
      onExport(format, data);
    }

    setIsExporting(false);
    setExportSuccess(true);

    setTimeout(() => {
      setExportSuccess(false);
      setSelectedFormat(null);
    }, 2000);
  };

  const modalClasses = cn(
    "fixed inset-0 z-50 flex items-center justify-center p-4",
    "bg-black/50 backdrop-blur-sm",
  );

  const contentClasses = cn(
    "w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl",
    "shadow-2xl transform transition-all duration-300",
    isGlass
      ? "bg-white/10 backdrop-blur-xl border border-white/20"
      : isDark
        ? "bg-gray-900 border border-gray-700"
        : "bg-white border border-gray-200",
  );

  const textColor = isGlass
    ? "text-[#2E3192]"
    : isDark
      ? "text-white"
      : "text-gray-900";
  const mutedColor = isGlass
    ? "text-[#2E3192]/70"
    : isDark
      ? "text-gray-400"
      : "text-gray-500";
  const borderColor = isGlass
    ? "border-[#2E3192]/20"
    : isDark
      ? "border-gray-700"
      : "border-gray-200";

  return (
    <div className={modalClasses} onClick={onClose}>
      <div className={contentClasses} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div
          className={cn(
            "px-6 py-4 border-b flex items-center justify-between",
            borderColor,
          )}
        >
          <div>
            <h2 className={cn("text-xl font-bold", textColor)}>{data.title}</h2>
            <p className={cn("text-sm mt-1", mutedColor)}>
              {data.data.length} records available for export
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                showPreview
                  ? "bg-[#2E3192] text-white"
                  : isGlass
                    ? "bg-white/20 text-[#2E3192]"
                    : isDark
                      ? "bg-gray-700 text-gray-300"
                      : "bg-gray-100 text-gray-700",
              )}
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button
              onClick={onClose}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isGlass
                  ? "hover:bg-white/20 text-[#2E3192]"
                  : isDark
                    ? "hover:bg-gray-700 text-gray-400"
                    : "hover:bg-gray-100 text-gray-500",
              )}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Data Preview */}
          {showPreview && (
            <div
              className={cn(
                "flex-1 p-6 border-b lg:border-b-0 lg:border-r",
                borderColor,
              )}
            >
              <h3
                className={cn(
                  "font-semibold mb-4 flex items-center gap-2",
                  textColor,
                )}
              >
                <Table className="w-5 h-5" />
                Data Preview
              </h3>

              {/* Summary Stats */}
              {data.summary && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {data.summary.map((item, index) => (
                    <div
                      key={index}
                      className={cn(
                        "p-3 rounded-xl",
                        isGlass
                          ? "bg-white/10 border border-white/20"
                          : isDark
                            ? "bg-gray-800"
                            : "bg-gray-50",
                      )}
                    >
                      <p className={cn("text-xs", mutedColor)}>{item.label}</p>
                      <p className={cn("text-lg font-bold", textColor)}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Table Preview */}
              <div className="overflow-x-auto rounded-xl border max-h-[300px]">
                <table className="w-full text-sm">
                  <thead
                    className={cn(
                      "sticky top-0",
                      isGlass
                        ? "bg-[#2E3192]/90"
                        : "bg-gradient-to-r from-[#2E3192] to-[#0e2841]",
                    )}
                  >
                    <tr>
                      {data.columns.map((col) => (
                        <th
                          key={col.key}
                          className="px-4 py-3 text-left text-white font-semibold whitespace-nowrap"
                        >
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody
                    className={
                      isGlass
                        ? "bg-white/5"
                        : isDark
                          ? "bg-gray-800"
                          : "bg-white"
                    }
                  >
                    {data.data.slice(0, 5).map((row, index) => (
                      <tr
                        key={index}
                        className={cn(
                          "border-t transition-colors",
                          borderColor,
                          isGlass
                            ? "hover:bg-white/10"
                            : isDark
                              ? "hover:bg-gray-700"
                              : "hover:bg-gray-50",
                        )}
                      >
                        {data.columns.map((col) => (
                          <td
                            key={col.key}
                            className={cn("px-4 py-3", textColor)}
                          >
                            {row[col.key]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {data.data.length > 5 && (
                <p className={cn("text-xs mt-2 text-center", mutedColor)}>
                  Showing 5 of {data.data.length} records
                </p>
              )}
            </div>
          )}

          {/* Export Options */}
          <div className={cn("p-6", showPreview ? "lg:w-80" : "w-full")}>
            <h3
              className={cn(
                "font-semibold mb-4 flex items-center gap-2",
                textColor,
              )}
            >
              <Download className="w-5 h-5" />
              Export Format
            </h3>

            <div className="space-y-3">
              {exportFormats.map((format) => {
                const isSelected = selectedFormat === format.id;
                const isSuccess = isSelected && exportSuccess;
                const isLoading = isSelected && isExporting;

                return (
                  <div key={format.id}>
                    <button
                      onClick={() => handleExport(format.id)}
                      disabled={isExporting}
                      className={cn(
                        "w-full p-4 rounded-xl border-2 transition-all duration-300",
                        "flex items-center gap-4 group relative overflow-hidden",
                        isSelected
                          ? `border-transparent bg-gradient-to-r ${format.gradient} text-white`
                          : isGlass
                            ? "border-white/20 hover:border-[#2E3192]/50 bg-white/5 hover:bg-white/10"
                            : isDark
                              ? "border-gray-700 hover:border-gray-600 bg-gray-800 hover:bg-gray-750"
                              : "border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50",
                        isExporting &&
                          !isSelected &&
                          "opacity-50 cursor-not-allowed",
                      )}
                    >
                      {/* Icon */}
                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center transition-transform",
                          "group-hover:scale-110",
                          isSelected ? "bg-white/20" : format.bgColor,
                        )}
                      >
                        {isLoading ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : isSuccess ? (
                          <Check className="w-6 h-6" />
                        ) : (
                          format.icon
                        )}
                      </div>

                      {/* Text */}
                      <div className="flex-1 text-left">
                        <p
                          className={cn(
                            "font-semibold",
                            isSelected ? "text-white" : textColor,
                          )}
                        >
                          {format.name}
                        </p>
                        <p
                          className={cn(
                            "text-xs",
                            isSelected ? "text-white/80" : mutedColor,
                          )}
                        >
                          {isSuccess
                            ? "Downloaded successfully!"
                            : format.description}
                        </p>
                      </div>

                      {/* Arrow/Check */}
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                          isSelected
                            ? "bg-white/20"
                            : isGlass
                              ? "bg-[#2E3192]/10 group-hover:bg-[#2E3192]/20"
                              : isDark
                                ? "bg-gray-700 group-hover:bg-gray-600"
                                : "bg-gray-100 group-hover:bg-gray-200",
                        )}
                      >
                        {isSuccess ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Download
                            className={cn(
                              "w-4 h-4 transition-transform group-hover:translate-y-0.5",
                              isSelected
                                ? "text-white"
                                : isGlass
                                  ? "text-[#2E3192]"
                                  : "",
                            )}
                          />
                        )}
                      </div>
                    </button>

                    {/* Email Input */}
                    {format.id === "email" &&
                      selectedFormat === "email" &&
                      !exportSuccess && (
                        <div className="mt-2 pl-4">
                          <input
                            type="email"
                            value={emailAddress}
                            onChange={(e) => setEmailAddress(e.target.value)}
                            placeholder="Enter email address..."
                            className={cn(
                              "w-full px-4 py-2 rounded-lg border text-sm",
                              isGlass
                                ? "bg-white/20 border-white/20 text-[#2E3192] placeholder-[#2E3192]/50"
                                : isDark
                                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                                  : "bg-white border-gray-200 text-gray-900 placeholder-gray-400",
                            )}
                          />
                          <button
                            onClick={() => handleExport("email")}
                            disabled={!emailAddress || isExporting}
                            className={cn(
                              "mt-2 w-full py-2 rounded-lg text-sm font-medium transition-all",
                              emailAddress
                                ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:opacity-90"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed",
                            )}
                          >
                            Send Email
                          </button>
                        </div>
                      )}
                  </div>
                );
              })}
            </div>

            {/* Quick Share */}
            <div className={cn("mt-6 pt-4 border-t", borderColor)}>
              <p
                className={cn(
                  "text-xs font-medium mb-3 flex items-center gap-2",
                  mutedColor,
                )}
              >
                <Share2 className="w-3 h-3" />
                Quick Share
              </p>
              <div className="flex gap-2">
                <button
                  className={cn(
                    "flex-1 p-2 rounded-lg text-xs font-medium transition-colors",
                    isGlass
                      ? "bg-white/10 hover:bg-white/20 text-[#2E3192]"
                      : isDark
                        ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700",
                  )}
                >
                  Copy Link
                </button>
                <button
                  className={cn(
                    "flex-1 p-2 rounded-lg text-xs font-medium transition-colors",
                    isGlass
                      ? "bg-white/10 hover:bg-white/20 text-[#2E3192]"
                      : isDark
                        ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700",
                  )}
                >
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to create export data from any stats card
export const createExportData = (
  title: string,
  items: { label: string; value: any }[],
  details?: Record<string, any>[],
): ExportData => {
  const columns = details
    ? Object.keys(details[0] || {}).map((key) => ({
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "),
      }))
    : [
        { key: "label", label: "Item" },
        { key: "value", label: "Value" },
      ];

  return {
    title,
    columns,
    data:
      details ||
      items.map((item) => ({ label: item.label, value: item.value })),
    summary: items.slice(0, 4).map((item) => ({
      label: item.label,
      value: item.value,
    })),
  };
};

export default DataExportModal;
