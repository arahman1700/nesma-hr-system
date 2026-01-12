import React, { useState } from "react";
import { cn } from "../../utils/cn";
import {
  Download,
  FileSpreadsheet,
  FileText,
  ChevronDown,
  Loader2,
  FileType,
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
} from "docx";
import { saveAs } from "file-saver";
import { useTheme } from "../../contexts/ThemeContext";

export interface ExportData {
  headers: string[];
  rows: (string | number)[][];
  title?: string;
  filename?: string;
}

interface ExportButtonProps {
  data: ExportData;
  className?: string;
  variant?: "default" | "icon" | "minimal";
  size?: "sm" | "md" | "lg";
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  className,
  variant = "default",
  size = "md",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-2",
    lg: "text-base px-4 py-2.5",
  };

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const exportToExcel = async () => {
    setIsExporting(true);
    try {
      const ws = XLSX.utils.aoa_to_sheet([data.headers, ...data.rows]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, data.title || "Data");

      // Auto-size columns
      const colWidths = data.headers.map((header, i) => {
        const maxLength = Math.max(
          header.length,
          ...data.rows.map((row) => String(row[i] || "").length),
        );
        return { wch: Math.min(maxLength + 2, 50) };
      });
      ws["!cols"] = colWidths;

      XLSX.writeFile(wb, `${data.filename || "export"}.xlsx`);
    } finally {
      setIsExporting(false);
      setIsOpen(false);
    }
  };

  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF({
        orientation: data.headers.length > 5 ? "landscape" : "portrait",
      });

      // Add title
      if (data.title) {
        doc.setFontSize(16);
        doc.setTextColor(46, 49, 146); // NESMA primary color
        doc.text(data.title, 14, 20);
      }

      // Add date
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Generated: ${new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}`,
        14,
        data.title ? 28 : 20,
      );

      // Add table
      autoTable(doc, {
        head: [data.headers],
        body: data.rows.map((row) => row.map((cell) => String(cell))),
        startY: data.title ? 35 : 25,
        styles: {
          fontSize: 9,
          cellPadding: 4,
          lineColor: [229, 231, 235],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: [46, 49, 146],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          halign: "center",
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        margin: { top: 10, left: 14, right: 14 },
      });

      // Add footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
          `Page ${i} of ${pageCount} - NESMA HR System`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: "center" },
        );
      }

      doc.save(`${data.filename || "export"}.pdf`);
    } finally {
      setIsExporting(false);
      setIsOpen(false);
    }
  };

  const exportToWord = async () => {
    setIsExporting(true);
    try {
      // Create header row
      const headerRow = new TableRow({
        children: data.headers.map(
          (header) =>
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: header,
                      bold: true,
                      color: "FFFFFF",
                      size: 22,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
              shading: { fill: "2E3192" },
              margins: { top: 100, bottom: 100, left: 100, right: 100 },
            }),
        ),
      });

      // Create data rows
      const dataRows = data.rows.map(
        (row, rowIndex) =>
          new TableRow({
            children: row.map(
              (cell) =>
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: String(cell),
                          size: 20,
                        }),
                      ],
                    }),
                  ],
                  shading: { fill: rowIndex % 2 === 0 ? "FFFFFF" : "F8FAFC" },
                  margins: { top: 80, bottom: 80, left: 100, right: 100 },
                }),
            ),
          }),
      );

      // Create the document
      const doc = new Document({
        sections: [
          {
            children: [
              // Title
              new Paragraph({
                text: data.title || "Export",
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.LEFT,
                spacing: { after: 200 },
              }),
              // Date
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Generated: ${new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`,
                    color: "666666",
                    size: 20,
                  }),
                ],
                spacing: { after: 400 },
              }),
              // Table
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [headerRow, ...dataRows],
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" },
                  bottom: {
                    style: BorderStyle.SINGLE,
                    size: 1,
                    color: "E5E7EB",
                  },
                  left: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" },
                  right: {
                    style: BorderStyle.SINGLE,
                    size: 1,
                    color: "E5E7EB",
                  },
                  insideHorizontal: {
                    style: BorderStyle.SINGLE,
                    size: 1,
                    color: "E5E7EB",
                  },
                  insideVertical: {
                    style: BorderStyle.SINGLE,
                    size: 1,
                    color: "E5E7EB",
                  },
                },
              }),
              // Footer
              new Paragraph({
                children: [
                  new TextRun({
                    text: "NESMA HR System",
                    color: "999999",
                    size: 18,
                    italics: true,
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { before: 400 },
              }),
            ],
          },
        ],
      });

      // Generate and save
      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${data.filename || "export"}.docx`);
    } finally {
      setIsExporting(false);
      setIsOpen(false);
    }
  };

  // Dropdown menu component
  const DropdownMenu = () => (
    <>
      <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      <div
        className={cn(
          "absolute right-0 mt-2 w-48 z-50",
          "rounded-xl shadow-lg border overflow-hidden",
          "animate-scaleIn origin-top-right",
          isDark
            ? "bg-[#0E2841] border-white/10"
            : "bg-white border-gray-100",
        )}
      >
        <div
          className={cn(
            "px-4 py-2 border-b",
            isDark ? "border-white/10" : "border-gray-100",
          )}
        >
          <p
            className={cn(
              "text-xs font-semibold uppercase tracking-wider",
              isDark ? "text-gray-500" : "text-gray-400",
            )}
          >
            Export Format
          </p>
        </div>

        {/* Excel Button */}
        <button
          onClick={exportToExcel}
          disabled={isExporting}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors",
            isDark
              ? "text-gray-300 hover:bg-white/5"
              : "text-gray-700 hover:bg-gray-50",
          )}
        >
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              isDark ? "bg-green-500/20" : "bg-green-100",
            )}
          >
            <FileSpreadsheet className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-left">
            <p className="font-medium">Excel</p>
            <p className={cn("text-xs", isDark ? "text-gray-500" : "text-gray-400")}>
              .xlsx format
            </p>
          </div>
        </button>

        {/* Word Button */}
        <button
          onClick={exportToWord}
          disabled={isExporting}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors border-t",
            isDark
              ? "text-gray-300 hover:bg-white/5 border-white/5"
              : "text-gray-700 hover:bg-gray-50 border-gray-50",
          )}
        >
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              isDark ? "bg-blue-500/20" : "bg-blue-100",
            )}
          >
            <FileType className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-left">
            <p className="font-medium">Word</p>
            <p className={cn("text-xs", isDark ? "text-gray-500" : "text-gray-400")}>
              .docx format
            </p>
          </div>
        </button>

        {/* PDF Button */}
        <button
          onClick={exportToPDF}
          disabled={isExporting}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors border-t",
            isDark
              ? "text-gray-300 hover:bg-white/5 border-white/5"
              : "text-gray-700 hover:bg-gray-50 border-gray-50",
          )}
        >
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              isDark ? "bg-red-500/20" : "bg-red-100",
            )}
          >
            <FileText className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-left">
            <p className="font-medium">PDF</p>
            <p className={cn("text-xs", isDark ? "text-gray-500" : "text-gray-400")}>
              .pdf format
            </p>
          </div>
        </button>
      </div>
    </>
  );

  if (variant === "icon") {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "p-2 rounded-xl transition-all duration-200",
            isDark
              ? "text-gray-400 hover:text-[#80D1E9] hover:bg-white/5"
              : "text-gray-500 hover:text-[#2E3192] hover:bg-[#2E3192]/5",
            "focus:outline-none focus:ring-2 focus:ring-[#2E3192]/20",
            className,
          )}
          title="Export Data"
        >
          {isExporting ? (
            <Loader2 className={cn(iconSizes[size], "animate-spin")} />
          ) : (
            <Download className={iconSizes[size]} />
          )}
        </button>

        {isOpen && <DropdownMenu />}
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className="relative inline-block">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center gap-1.5 transition-colors text-sm font-medium",
            isDark
              ? "text-gray-400 hover:text-[#80D1E9]"
              : "text-gray-500 hover:text-[#2E3192]",
            className,
          )}
        >
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>

        {isOpen && <DropdownMenu />}
      </div>
    );
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className={cn(
          "flex items-center gap-2 rounded-xl font-medium",
          "focus:outline-none focus:ring-2 focus:ring-[#2E3192]/20",
          "transition-all duration-200",
          isDark
            ? "bg-white/5 border border-white/10 text-gray-300 hover:border-[#80D1E9]/30 hover:text-[#80D1E9]"
            : "bg-white border border-gray-200 text-gray-700 hover:border-[#2E3192]/30 hover:text-[#2E3192]",
          sizeClasses[size],
          className,
        )}
      >
        {isExporting ? (
          <Loader2 className={cn(iconSizes[size], "animate-spin")} />
        ) : (
          <Download className={iconSizes[size]} />
        )}
        <span>Export</span>
        <ChevronDown className={cn(iconSizes[size], "opacity-50")} />
      </button>

      {isOpen && <DropdownMenu />}
    </div>
  );
};

export default ExportButton;
