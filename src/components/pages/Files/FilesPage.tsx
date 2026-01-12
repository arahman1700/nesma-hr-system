import React, { useState, useMemo } from "react";
import {
  FolderOpen,
  Plus,
  Download,
  Search,
  Upload,
  File,
  FileText,
  Image,
  FileSpreadsheet,
  Folder,
  MoreVertical,
  Trash2,
  Edit,
  Eye,
  Share2,
  Grid,
  List,
  ChevronRight,
  Home,
  Clock,
  User,
  Filter,
} from "lucide-react";
import { Button } from "../../common/Button";
import { Card, StatCard } from "../../common/Card";
import { Input } from "../../common/Input";
import { Select } from "../../common/Select";
import { Badge } from "../../common/Badge";
import { Modal } from "../../common/Modal";
import { Avatar } from "../../common/Avatar";
import { employees } from "../../../data";
import { cn } from "../../../utils/cn";
import { format } from "date-fns";

type ViewType = "grid" | "list";
type FileType = "pdf" | "doc" | "xls" | "img" | "folder";

const fileTypeIcons: Record<FileType, React.ReactNode> = {
  pdf: <FileText className="w-6 h-6 text-error" />,
  doc: <FileText className="w-6 h-6 text-secondary" />,
  xls: <FileSpreadsheet className="w-6 h-6 text-success" />,
  img: <Image className="w-6 h-6 text-warning" />,
  folder: <Folder className="w-6 h-6 text-primary" />,
};

const fileTypeColors: Record<FileType, string> = {
  pdf: "bg-error-50",
  doc: "bg-secondary-50",
  xls: "bg-success-50",
  img: "bg-warning-50",
  folder: "bg-primary-light",
};

// Mock files data
const files = [
  {
    id: "folder-001",
    name: "Employee Documents",
    type: "folder",
    size: 0,
    items: 45,
    uploadedBy: "HR Admin",
    uploadedAt: "2024-01-15",
    category: "Company",
  },
  {
    id: "folder-002",
    name: "Policies",
    type: "folder",
    size: 0,
    items: 12,
    uploadedBy: "HR Admin",
    uploadedAt: "2024-01-14",
    category: "Company",
  },
  {
    id: "folder-003",
    name: "Templates",
    type: "folder",
    size: 0,
    items: 8,
    uploadedBy: "HR Admin",
    uploadedAt: "2024-01-13",
    category: "Company",
  },
  {
    id: "file-001",
    name: "Employment Contract Template.pdf",
    type: "pdf",
    size: 256000,
    uploadedBy: "HR Admin",
    uploadedAt: "2024-01-12",
    category: "Employment",
  },
  {
    id: "file-002",
    name: "Leave Policy 2024.docx",
    type: "doc",
    size: 128000,
    uploadedBy: "HR Admin",
    uploadedAt: "2024-01-11",
    category: "Company",
  },
  {
    id: "file-003",
    name: "Salary Report Jan 2024.xlsx",
    type: "xls",
    size: 512000,
    uploadedBy: "Finance",
    uploadedAt: "2024-01-10",
    category: "Company",
  },
  {
    id: "file-004",
    name: "Company Logo.png",
    type: "img",
    size: 64000,
    uploadedBy: "Marketing",
    uploadedAt: "2024-01-09",
    category: "Company",
  },
  {
    id: "file-005",
    name: "Employee Handbook.pdf",
    type: "pdf",
    size: 1024000,
    uploadedBy: "HR Admin",
    uploadedAt: "2024-01-08",
    category: "Company",
  },
  {
    id: "file-006",
    name: "NDA Template.pdf",
    type: "pdf",
    size: 180000,
    uploadedBy: "Legal",
    uploadedAt: "2024-01-07",
    category: "Legal",
  },
  {
    id: "file-007",
    name: "Attendance Report.xlsx",
    type: "xls",
    size: 320000,
    uploadedBy: "HR Admin",
    uploadedAt: "2024-01-06",
    category: "Company",
  },
];

export const FilesPage: React.FC = () => {
  const [viewType, setViewType] = useState<ViewType>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [currentPath, setCurrentPath] = useState<string[]>(["Home"]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<(typeof files)[0] | null>(
    null,
  );

  // Calculate statistics
  const stats = useMemo(() => {
    const totalFiles = files.filter((f) => f.type !== "folder").length;
    const totalFolders = files.filter((f) => f.type === "folder").length;
    const totalSize = files.reduce((acc, f) => acc + f.size, 0);
    return { totalFiles, totalFolders, totalSize };
  }, []);

  // Filter files
  const filteredFiles = useMemo(() => {
    return files.filter((file) => {
      const matchesSearch = file.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || file.category === selectedCategory;
      const matchesType = selectedType === "all" || file.type === selectedType;
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [searchQuery, selectedCategory, selectedType]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "-";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getFileType = (filename: string): FileType => {
    const ext = filename.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return "pdf";
    if (["doc", "docx"].includes(ext || "")) return "doc";
    if (["xls", "xlsx"].includes(ext || "")) return "xls";
    if (["jpg", "jpeg", "png", "gif"].includes(ext || "")) return "img";
    return "doc";
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Files</h1>
          <p className="text-gray-500 mt-1">
            Manage company documents and files
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Folder className="w-4 h-4 mr-2" />
            New Folder
          </Button>
          <Button onClick={() => setShowUploadModal(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Files
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Files"
          value={stats.totalFiles}
          icon={<File className="w-6 h-6" />}
          color="primary"
        />
        <StatCard
          title="Folders"
          value={stats.totalFolders}
          icon={<Folder className="w-6 h-6" />}
          color="secondary"
        />
        <StatCard
          title="Total Size"
          value={formatFileSize(stats.totalSize)}
          icon={<FolderOpen className="w-6 h-6" />}
          color="success"
        />
        <StatCard
          title="Storage Used"
          value="2.5 GB / 10 GB"
          icon={<FolderOpen className="w-6 h-6" />}
          color="warning"
        />
      </div>

      {/* Breadcrumb & Controls */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 flex-1">
            <button
              onClick={() => setCurrentPath(["Home"])}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Home className="w-4 h-4 text-gray-600" />
            </button>
            {currentPath.map((path, index) => (
              <React.Fragment key={path}>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <button
                  onClick={() =>
                    setCurrentPath(currentPath.slice(0, index + 1))
                  }
                  className={cn(
                    "px-2 py-1 rounded-lg text-sm font-medium transition-colors",
                    index === currentPath.length - 1
                      ? "text-primary bg-primary-light"
                      : "text-gray-600 hover:bg-gray-100",
                  )}
                >
                  {path}
                </button>
              </React.Fragment>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-48 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              options={[
                { value: "all", label: "All Categories" },
                { value: "Company", label: "Company" },
                { value: "Employment", label: "Employment" },
                { value: "Legal", label: "Legal" },
                { value: "Personal", label: "Personal" },
              ]}
              className="w-36"
            />
            <div className="flex items-center bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewType("grid")}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  viewType === "grid" ? "bg-white shadow-sm" : "text-gray-600",
                )}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewType("list")}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  viewType === "list" ? "bg-white shadow-sm" : "text-gray-600",
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Files Grid View */}
      {viewType === "grid" && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group"
              onClick={() => {
                if (file.type === "folder") {
                  setCurrentPath([...currentPath, file.name]);
                } else {
                  setSelectedFile(file);
                  setShowPreviewModal(true);
                }
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    fileTypeColors[file.type as FileType],
                  )}
                >
                  {fileTypeIcons[file.type as FileType]}
                </div>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="p-1 hover:bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <h4
                className="font-medium text-gray-800 text-sm truncate mb-1"
                title={file.name}
              >
                {file.name}
              </h4>
              <p className="text-xs text-gray-500">
                {file.type === "folder"
                  ? `${file.items} items`
                  : formatFileSize(file.size)}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Files List View */}
      {viewType === "list" && (
        <Card className="p-0 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">
                  Name
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">
                  Category
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">
                  Size
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">
                  Uploaded By
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">
                  Date
                </th>
                <th className="text-right py-3 px-4 font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.map((file) => (
                <tr
                  key={file.id}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    if (file.type === "folder") {
                      setCurrentPath([...currentPath, file.name]);
                    } else {
                      setSelectedFile(file);
                      setShowPreviewModal(true);
                    }
                  }}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          fileTypeColors[file.type as FileType],
                        )}
                      >
                        {fileTypeIcons[file.type as FileType]}
                      </div>
                      <span className="font-medium text-gray-800">
                        {file.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge className="bg-gray-100 text-gray-600">
                      {file.category}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {file.type === "folder"
                      ? `${file.items} items`
                      : formatFileSize(file.size)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {file.uploadedBy}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {format(new Date(file.uploadedAt), "MMM d, yyyy")}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Share"
                      >
                        <Share2 className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 hover:bg-error-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-error" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Files"
        size="md"
      >
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-primary transition-colors">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">
              Drag and drop files here, or click to browse
            </p>
            <p className="text-sm text-gray-400">Maximum file size: 10MB</p>
            <input type="file" className="hidden" multiple />
            <Button variant="outline" className="mt-4">
              Browse Files
            </Button>
          </div>
          <Select
            label="Category"
            options={[
              { value: "Company", label: "Company" },
              { value: "Employment", label: "Employment" },
              { value: "Legal", label: "Legal" },
              { value: "Personal", label: "Personal" },
            ]}
          />
          <Select
            label="Assign to Employee (Optional)"
            options={[
              { value: "", label: "None - Company Wide" },
              ...employees.map((e) => ({ value: e.id, label: e.fullName })),
            ]}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowUploadModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowUploadModal(false)}>
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </div>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        title="File Details"
        size="md"
      >
        {selectedFile && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "w-16 h-16 rounded-xl flex items-center justify-center",
                  fileTypeColors[selectedFile.type as FileType],
                )}
              >
                {fileTypeIcons[selectedFile.type as FileType]}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  {selectedFile.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium text-gray-800">
                  {selectedFile.category}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium text-gray-800 uppercase">
                  {selectedFile.type}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Uploaded By</p>
                <div className="flex items-center gap-2 mt-1">
                  <User className="w-4 h-4 text-gray-400" />
                  <p className="font-medium text-gray-800">
                    {selectedFile.uploadedBy}
                  </p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Upload Date</p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <p className="font-medium text-gray-800">
                    {format(new Date(selectedFile.uploadedAt), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowPreviewModal(false)}
              >
                Close
              </Button>
              <Button variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FilesPage;
