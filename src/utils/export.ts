/**
 * Export Utility Functions
 * Provides functions for exporting data to various formats:
 * - PDF (using jsPDF)
 * - Excel (using xlsx)
 * - Word (using docx)
 * - Image (using html2canvas)
 * - PowerPoint (using pptxgenjs)
 */

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  Document,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  HeadingLevel,
  Packer,
  WidthType,
  AlignmentType,
  BorderStyle,
} from "docx";
import html2canvas from "html2canvas";
import pptxgen from "pptxgenjs";

// ============================================
// Types
// ============================================

export interface ExportColumn {
  header: string;
  key: string;
  width?: number;
}

export interface ExportOptions {
  filename: string;
  title?: string;
  subtitle?: string;
  columns: ExportColumn[];
  data: Record<string, unknown>[];
  orientation?: "portrait" | "landscape";
  companyName?: string;
  logo?: string;
}

export interface ImageExportOptions {
  element: HTMLElement;
  filename: string;
  format?: "png" | "jpeg";
  quality?: number;
  scale?: number;
  backgroundColor?: string;
}

export interface ChartExportOptions {
  element: HTMLElement;
  filename: string;
  title?: string;
  format?: "pdf" | "png" | "pptx";
}

// ============================================
// PDF Export
// ============================================

export const exportToPDF = (options: ExportOptions): void => {
  const {
    filename,
    title,
    subtitle,
    columns,
    data,
    orientation = "portrait",
    companyName = "NESMA HR System",
  } = options;

  const doc = new jsPDF({
    orientation,
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let yPosition = 20;

  // Company Name Header
  doc.setFontSize(10);
  doc.setTextColor(91, 76, 204); // Primary color
  doc.text(companyName, pageWidth - 15, 10, { align: "right" });

  // Title
  if (title) {
    doc.setFontSize(18);
    doc.setTextColor(31, 41, 55);
    doc.text(title, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 8;
  }

  // Subtitle
  if (subtitle) {
    doc.setFontSize(11);
    doc.setTextColor(107, 114, 128);
    doc.text(subtitle, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;
  }

  // Date
  doc.setFontSize(9);
  doc.setTextColor(156, 163, 175);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 15, yPosition);
  yPosition += 10;

  // Table
  const headers = columns.map((col) => col.header);
  const rows = data.map((row) =>
    columns.map((col) => {
      const value = row[col.key];
      return value !== undefined && value !== null ? String(value) : "";
    }),
  );

  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: yPosition,
    styles: {
      fontSize: 9,
      cellPadding: 3,
      lineColor: [229, 231, 235],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [91, 76, 204],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    columnStyles: columns.reduce(
      (acc, col, index) => {
        if (col.width) {
          acc[index] = { cellWidth: col.width };
        }
        return acc;
      },
      {} as Record<number, { cellWidth: number }>,
    ),
    didDrawPage: (data) => {
      // Footer
      const pageCount = doc.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(156, 163, 175);
      doc.text(
        `Page ${data.pageNumber} of ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: "center" },
      );
    },
  });

  doc.save(`${filename}.pdf`);
};

// ============================================
// Excel Export
// ============================================

export const exportToExcel = (options: ExportOptions): void => {
  const {
    filename,
    title,
    columns,
    data,
    companyName = "NESMA HR System",
  } = options;

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();

  // Prepare data with headers
  const headers = columns.map((col) => col.header);
  const rows = data.map((row) =>
    columns.map((col) => {
      const value = row[col.key];
      return value !== undefined && value !== null ? value : "";
    }),
  );

  // Create worksheet data
  const wsData: (string | number | boolean | Date | unknown)[][] = [];

  // Add company name
  wsData.push([companyName]);
  wsData.push([]); // Empty row

  // Add title if provided
  if (title) {
    wsData.push([title]);
    wsData.push([]); // Empty row
  }

  // Add generation date
  wsData.push([`Generated: ${new Date().toLocaleString()}`]);
  wsData.push([]); // Empty row

  // Add headers and data
  wsData.push(headers);
  rows.forEach((row) => wsData.push(row));

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Set column widths
  const colWidths = columns.map((col) => ({
    wch: col.width || Math.max(col.header.length, 15),
  }));
  ws["!cols"] = colWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, "Data");

  // Generate and download
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `${filename}.xlsx`);
};

// ============================================
// Word Export
// ============================================

export const exportToWord = async (options: ExportOptions): Promise<void> => {
  const {
    filename,
    title,
    subtitle,
    columns,
    data,
    companyName = "NESMA HR System",
  } = options;

  // Create table rows
  const headerRow = new TableRow({
    children: columns.map(
      (col) =>
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: col.header,
                  bold: true,
                  color: "FFFFFF",
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          shading: {
            fill: "5B4CCC",
          },
        }),
    ),
    tableHeader: true,
  });

  const dataRows = data.map(
    (row, index) =>
      new TableRow({
        children: columns.map(
          (col) =>
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: String(row[col.key] ?? ""),
                    }),
                  ],
                }),
              ],
              shading: {
                fill: index % 2 === 0 ? "FFFFFF" : "F9FAFB",
              },
            }),
        ),
      }),
  );

  const table = new Table({
    rows: [headerRow, ...dataRows],
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" },
      left: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" },
      right: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" },
    },
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Company Name
          new Paragraph({
            children: [
              new TextRun({
                text: companyName,
                color: "5B4CCC",
                size: 20,
              }),
            ],
            alignment: AlignmentType.RIGHT,
          }),
          new Paragraph({ children: [] }), // Spacer

          // Title
          ...(title
            ? [
                new Paragraph({
                  text: title,
                  heading: HeadingLevel.HEADING_1,
                  alignment: AlignmentType.CENTER,
                }),
              ]
            : []),

          // Subtitle
          ...(subtitle
            ? [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: subtitle,
                      color: "6B7280",
                      size: 22,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ]
            : []),

          new Paragraph({ children: [] }), // Spacer

          // Date
          new Paragraph({
            children: [
              new TextRun({
                text: `Generated: ${new Date().toLocaleString()}`,
                color: "9CA3AF",
                size: 18,
              }),
            ],
          }),

          new Paragraph({ children: [] }), // Spacer

          // Table
          table,
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${filename}.docx`);
};

// ============================================
// Image Export (HTML to Image)
// ============================================

export const exportToImage = async (
  options: ImageExportOptions,
): Promise<void> => {
  const {
    element,
    filename,
    format = "png",
    quality = 1,
    scale = 2,
    backgroundColor = "#ffffff",
  } = options;

  const canvas = await html2canvas(element, {
    scale,
    backgroundColor,
    useCORS: true,
    logging: false,
  });

  const link = document.createElement("a");
  link.download = `${filename}.${format}`;

  if (format === "jpeg") {
    link.href = canvas.toDataURL("image/jpeg", quality);
  } else {
    link.href = canvas.toDataURL("image/png");
  }

  link.click();
};

// ============================================
// PowerPoint Export
// ============================================

export const exportToPowerPoint = async (
  options: ExportOptions,
): Promise<void> => {
  const {
    filename,
    title,
    subtitle,
    columns,
    data,
    companyName = "NESMA HR System",
  } = options;

  const pptx = new pptxgen();

  // Set presentation properties
  pptx.author = companyName;
  pptx.title = title || "Data Export";
  pptx.subject = subtitle || "";

  // Title slide
  const titleSlide = pptx.addSlide();
  titleSlide.addText(companyName, {
    x: 0.5,
    y: 0.3,
    w: "90%",
    h: 0.5,
    fontSize: 12,
    color: "5B4CCC",
    align: "right",
  });

  if (title) {
    titleSlide.addText(title, {
      x: 0.5,
      y: 2,
      w: "90%",
      h: 1,
      fontSize: 36,
      bold: true,
      color: "1F2937",
      align: "center",
    });
  }

  if (subtitle) {
    titleSlide.addText(subtitle, {
      x: 0.5,
      y: 3.2,
      w: "90%",
      h: 0.5,
      fontSize: 18,
      color: "6B7280",
      align: "center",
    });
  }

  titleSlide.addText(`Generated: ${new Date().toLocaleString()}`, {
    x: 0.5,
    y: 5,
    w: "90%",
    h: 0.3,
    fontSize: 10,
    color: "9CA3AF",
    align: "center",
  });

  // Data slides (split data into chunks if necessary)
  const rowsPerSlide = 10;
  const chunks: Record<string, unknown>[][] = [];

  for (let i = 0; i < data.length; i += rowsPerSlide) {
    chunks.push(data.slice(i, i + rowsPerSlide));
  }

  chunks.forEach((chunk, chunkIndex) => {
    const dataSlide = pptx.addSlide();

    // Header
    dataSlide.addText(
      `${title || "Data"} (${chunkIndex + 1}/${chunks.length})`,
      {
        x: 0.5,
        y: 0.3,
        w: "90%",
        h: 0.5,
        fontSize: 18,
        bold: true,
        color: "1F2937",
      },
    );

    // Table data
    const tableData: pptxgen.TableRow[] = [];

    // Header row
    const headerRow: pptxgen.TableCell[] = columns.map((col) => ({
      text: col.header,
      options: {
        bold: true,
        fill: { color: "5B4CCC" },
        color: "FFFFFF",
        align: "center" as const,
        fontSize: 10,
      },
    }));
    tableData.push(headerRow);

    // Data rows
    chunk.forEach((row, rowIndex) => {
      const dataRow: pptxgen.TableCell[] = columns.map((col) => ({
        text: String(row[col.key] ?? ""),
        options: {
          fill: { color: rowIndex % 2 === 0 ? "FFFFFF" : "F9FAFB" },
          fontSize: 9,
        },
      }));
      tableData.push(dataRow);
    });

    dataSlide.addTable(tableData, {
      x: 0.5,
      y: 1,
      w: 9,
      colW: columns.map(() => 9 / columns.length),
      border: { type: "solid", pt: 0.5, color: "E5E7EB" },
    });
  });

  // Save
  await pptx.writeFile({ fileName: `${filename}.pptx` });
};

// ============================================
// Chart Export
// ============================================

export const exportChart = async (
  options: ChartExportOptions,
): Promise<void> => {
  const { element, filename, title, format = "png" } = options;

  if (format === "png") {
    await exportToImage({
      element,
      filename,
      format: "png",
      scale: 2,
    });
  } else if (format === "pdf") {
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    if (title) {
      pdf.setFontSize(16);
      pdf.setTextColor(31, 41, 55);
      pdf.text(title, pageWidth / 2, 15, { align: "center" });
    }

    const imgWidth = pageWidth - 40;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const yPos = title ? 25 : 15;

    pdf.addImage(
      imgData,
      "PNG",
      20,
      yPos,
      imgWidth,
      Math.min(imgHeight, pageHeight - yPos - 20),
    );
    pdf.save(`${filename}.pdf`);
  } else if (format === "pptx") {
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const pptx = new pptxgen();

    const slide = pptx.addSlide();

    if (title) {
      slide.addText(title, {
        x: 0.5,
        y: 0.3,
        w: "90%",
        h: 0.5,
        fontSize: 18,
        bold: true,
        color: "1F2937",
        align: "center",
      });
    }

    slide.addImage({
      data: imgData,
      x: 0.5,
      y: title ? 1 : 0.5,
      w: 9,
      h: title ? 4.5 : 5,
    });

    await pptx.writeFile({ fileName: `${filename}.pptx` });
  }
};

// ============================================
// Utility Functions
// ============================================

/**
 * Format currency value
 */
export const formatCurrencyForExport = (
  value: number,
  currency = "SAR",
): string => {
  return new Intl.NumberFormat("en-SA", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value);
};

/**
 * Format date for export
 */
export const formatDateForExport = (
  date: Date | string,
  format = "short",
): string => {
  const d = typeof date === "string" ? new Date(date) : date;

  if (format === "short") {
    return d.toLocaleDateString("en-GB");
  } else if (format === "long") {
    return d.toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } else {
    return d.toISOString().split("T")[0];
  }
};

/**
 * Format percentage for export
 */
export const formatPercentageForExport = (
  value: number,
  decimals = 1,
): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Generate filename with timestamp
 */
export const generateFilename = (prefix: string): string => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  return `${prefix}_${timestamp}`;
};

// ============================================
// Quick Export Functions
// ============================================

/**
 * Quick export to all formats
 */
export const exportAll = async (
  options: ExportOptions,
  formats: ("pdf" | "excel" | "word" | "pptx")[] = ["pdf", "excel"],
): Promise<void> => {
  const promises: Promise<void>[] = [];

  if (formats.includes("pdf")) {
    promises.push(Promise.resolve(exportToPDF(options)));
  }

  if (formats.includes("excel")) {
    promises.push(Promise.resolve(exportToExcel(options)));
  }

  if (formats.includes("word")) {
    promises.push(exportToWord(options));
  }

  if (formats.includes("pptx")) {
    promises.push(exportToPowerPoint(options));
  }

  await Promise.all(promises);
};

export default {
  exportToPDF,
  exportToExcel,
  exportToWord,
  exportToImage,
  exportToPowerPoint,
  exportChart,
  exportAll,
  formatCurrencyForExport,
  formatDateForExport,
  formatPercentageForExport,
  generateFilename,
};
