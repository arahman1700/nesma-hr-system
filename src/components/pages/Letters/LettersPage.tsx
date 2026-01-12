import React, { useState, useMemo } from "react";
import {
  Mail,
  Plus,
  Download,
  Search,
  Eye,
  Edit,
  Trash2,
  Send,
  FileText,
  Printer,
  Copy,
  Clock,
  CheckCircle,
  Globe,
} from "lucide-react";
import { Button } from "../../common/Button";
import { Card } from "../../common/Card";
import { ColoredStatsCard } from "../../common/ColoredStatsCard";
import { Input } from "../../common/Input";
import { Select } from "../../common/Select";
import { Badge } from "../../common/Badge";
import { Table } from "../../common/Table";
import { Avatar } from "../../common/Avatar";
import { Modal } from "../../common/Modal";
import { useTheme } from "../../../contexts/ThemeContext";
import { employees } from "../../../data";
import { cn } from "../../../utils/cn";
import { format } from "date-fns";

type LetterType =
  | "Salary Certificate"
  | "Employment Certificate"
  | "Experience Letter"
  | "NOC"
  | "Offer Letter"
  | "Termination Letter"
  | "Warning Letter"
  | "Promotion Letter"
  | "Custom";
type LetterStatus = "Draft" | "Generated" | "Sent";

const letterTypeColors: Record<LetterType, string> = {
  "Salary Certificate": "#10B981",
  "Employment Certificate": "#3B82F6",
  "Experience Letter": "#8B5CF6",
  NOC: "#F59E0B",
  "Offer Letter": "#14B8A6",
  "Termination Letter": "#EF4444",
  "Warning Letter": "#F97316",
  "Promotion Letter": "#EC4899",
  Custom: "#6B7280",
};

// Mock letters data
const letters = [
  {
    id: "LTR-001",
    type: "Salary Certificate",
    subject: "Salary Certificate for Bank",
    employeeId: "emp-001",
    employeeName: "Ahmed Al-Rashid",
    status: "Generated",
    createdBy: "HR Admin",
    createdAt: "2024-01-15",
    language: "Both",
  },
  {
    id: "LTR-002",
    type: "Employment Certificate",
    subject: "Employment Verification",
    employeeId: "emp-002",
    employeeName: "Sara Abdullah",
    status: "Sent",
    createdBy: "HR Admin",
    createdAt: "2024-01-14",
    sentTo: "sara@email.com",
    language: "English",
  },
  {
    id: "LTR-003",
    type: "NOC",
    subject: "No Objection Certificate",
    employeeId: "emp-003",
    employeeName: "Mohammed Hassan",
    status: "Draft",
    createdBy: "HR Admin",
    createdAt: "2024-01-13",
    language: "Arabic",
  },
  {
    id: "LTR-004",
    type: "Experience Letter",
    subject: "Experience Certificate",
    employeeId: "emp-004",
    employeeName: "Fatima Al-Zahrani",
    status: "Generated",
    createdBy: "HR Admin",
    createdAt: "2024-01-12",
    language: "Both",
  },
  {
    id: "LTR-005",
    type: "Promotion Letter",
    subject: "Promotion to Senior Engineer",
    employeeId: "emp-005",
    employeeName: "Khalid Ibrahim",
    status: "Sent",
    createdBy: "HR Admin",
    createdAt: "2024-01-11",
    language: "English",
  },
];

const letterTemplates = [
  {
    id: "tpl-001",
    name: "Salary Certificate - English",
    type: "Salary Certificate",
    language: "English",
  },
  {
    id: "tpl-002",
    name: "Salary Certificate - Arabic",
    type: "Salary Certificate",
    language: "Arabic",
  },
  {
    id: "tpl-003",
    name: "Employment Certificate - English",
    type: "Employment Certificate",
    language: "English",
  },
  {
    id: "tpl-004",
    name: "Experience Letter - Both",
    type: "Experience Letter",
    language: "Both",
  },
  { id: "tpl-005", name: "NOC - Arabic", type: "NOC", language: "Arabic" },
];

export const LettersPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "company";
  const isGlass = theme === "glass";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<
    (typeof letters)[0] | null
  >(null);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = letters.length;
    const draft = letters.filter((l) => l.status === "Draft").length;
    const generated = letters.filter((l) => l.status === "Generated").length;
    const sent = letters.filter((l) => l.status === "Sent").length;
    return { total, draft, generated, sent };
  }, []);

  // Filter letters
  const filteredLetters = useMemo(() => {
    return letters.filter((letter) => {
      const matchesSearch =
        letter.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        letter.employeeName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType =
        selectedType === "all" || letter.type === selectedType;
      const matchesStatus =
        selectedStatus === "all" || letter.status === selectedStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchQuery, selectedType, selectedStatus]);

  const columns = [
    {
      key: "letter",
      label: "Letter",
      sortable: true,
      render: (letter: (typeof letters)[0]) => (
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: `${letterTypeColors[letter.type as LetterType]}20`,
            }}
          >
            <Mail
              className="w-5 h-5"
              style={{ color: letterTypeColors[letter.type as LetterType] }}
            />
          </div>
          <div>
            <p className="font-medium text-gray-800">{letter.subject}</p>
            <p className="text-xs text-gray-500">#{letter.id}</p>
          </div>
        </div>
      ),
    },
    {
      key: "employee",
      label: "Employee",
      sortable: true,
      render: (letter: (typeof letters)[0]) => (
        <div className="flex items-center gap-2">
          <Avatar name={letter.employeeName} size="sm" />
          <span className="text-sm text-gray-700">{letter.employeeName}</span>
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      render: (letter: (typeof letters)[0]) => (
        <Badge
          style={{
            backgroundColor: `${letterTypeColors[letter.type as LetterType]}20`,
            color: letterTypeColors[letter.type as LetterType],
          }}
        >
          {letter.type}
        </Badge>
      ),
    },
    {
      key: "language",
      label: "Language",
      render: (letter: (typeof letters)[0]) => (
        <div className="flex items-center gap-1">
          <Globe className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{letter.language}</span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (letter: (typeof letters)[0]) => (
        <Badge
          className={cn(
            letter.status === "Draft" && "bg-gray-100 text-gray-600",
            letter.status === "Generated" &&
              "bg-secondary-50 text-secondary-600",
            letter.status === "Sent" && "bg-success-50 text-success-600",
          )}
        >
          <span className="flex items-center gap-1">
            {letter.status === "Draft" && <Clock className="w-3 h-3" />}
            {letter.status === "Generated" && <FileText className="w-3 h-3" />}
            {letter.status === "Sent" && <CheckCircle className="w-3 h-3" />}
            {letter.status}
          </span>
        </Badge>
      ),
    },
    {
      key: "date",
      label: "Date",
      sortable: true,
      render: (letter: (typeof letters)[0]) => (
        <span className="text-sm text-gray-600">
          {format(new Date(letter.createdAt), "MMM d, yyyy")}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (letter: (typeof letters)[0]) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setSelectedLetter(letter);
              setShowPreviewModal(true);
            }}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            title="Preview"
          >
            <Eye className="w-4 h-4 text-gray-500" />
          </button>
          <button
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            title="Download"
          >
            <Download className="w-4 h-4 text-gray-500" />
          </button>
          <button
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            title="Print"
          >
            <Printer className="w-4 h-4 text-gray-500" />
          </button>
          {letter.status !== "Sent" && (
            <button
              className="p-1.5 hover:bg-primary-light rounded-lg transition-colors"
              title="Send"
            >
              <Send className="w-4 h-4 text-primary" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className={cn(
              "text-2xl font-bold",
              isGlass
                ? "text-[#2E3192]"
                : isDark
                  ? "text-white"
                  : "text-gray-900",
            )}
          >
            Letters
          </h1>
          <p
            className={cn(
              "mt-1",
              isGlass
                ? "text-[#2E3192]/70"
                : isDark
                  ? "text-gray-400"
                  : "text-gray-500",
            )}
          >
            Generate and manage employee letters
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Letter
          </Button>
        </div>
      </div>

      {/* Stats Cards - Colored */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ColoredStatsCard
          title="Total Letters"
          value={stats.total}
          icon={<Mail className="w-6 h-6" />}
          color="blue"
          trend={{ value: 8, isPositive: true }}
        />
        <ColoredStatsCard
          title="Draft"
          value={stats.draft}
          icon={<Clock className="w-6 h-6" />}
          color="amber"
        />
        <ColoredStatsCard
          title="Generated"
          value={stats.generated}
          icon={<FileText className="w-6 h-6" />}
          color="purple"
          trend={{ value: 12, isPositive: true }}
        />
        <ColoredStatsCard
          title="Sent"
          value={stats.sent}
          icon={<Send className="w-6 h-6" />}
          color="emerald"
          trend={{ value: 20, isPositive: true }}
        />
      </div>

      {/* Quick Templates */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Quick Generate</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Object.keys(letterTypeColors)
            .slice(0, 6)
            .map((type) => (
              <button
                key={type}
                onClick={() => setShowCreateModal(true)}
                className="p-4 border border-gray-200 rounded-xl hover:border-primary/30 hover:shadow-md transition-all text-center group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{
                    backgroundColor: `${letterTypeColors[type as LetterType]}20`,
                  }}
                >
                  <Mail
                    className="w-6 h-6"
                    style={{ color: letterTypeColors[type as LetterType] }}
                  />
                </div>
                <p className="text-sm font-medium text-gray-700 group-hover:text-primary">
                  {type}
                </p>
              </button>
            ))}
        </div>
      </Card>

      {/* Letters Table */}
      <Card className="p-6">
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search letters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div className="flex gap-3">
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              options={[
                { value: "all", label: "All Types" },
                ...Object.keys(letterTypeColors).map((t) => ({
                  value: t,
                  label: t,
                })),
              ]}
              className="w-48"
            />
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              options={[
                { value: "all", label: "All Status" },
                { value: "Draft", label: "Draft" },
                { value: "Generated", label: "Generated" },
                { value: "Sent", label: "Sent" },
              ]}
              className="w-36"
            />
          </div>
        </div>

        <Table data={filteredLetters} columns={columns} searchable={false} />
      </Card>

      {/* Create Letter Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Letter"
        size="md"
      >
        <div className="space-y-4">
          <Select
            label="Letter Type"
            options={Object.keys(letterTypeColors).map((t) => ({
              value: t,
              label: t,
            }))}
          />
          <Select
            label="Employee"
            options={employees.map((e) => ({ value: e.id, label: e.fullName }))}
          />
          <Input label="Subject" placeholder="Enter letter subject..." />
          <Select
            label="Language"
            options={[
              { value: "English", label: "English" },
              { value: "Arabic", label: "Arabic" },
              { value: "Both", label: "Both (English & Arabic)" },
            ]}
            defaultValue="Both"
          />
          <Select
            label="Template"
            options={letterTemplates.map((t) => ({
              value: t.id,
              label: t.name,
            }))}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button variant="outline">Save as Draft</Button>
            <Button onClick={() => setShowCreateModal(false)}>
              Generate Letter
            </Button>
          </div>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        title="Letter Preview"
        size="lg"
      >
        {selectedLetter && (
          <div className="space-y-6">
            {/* Letter Header */}
            <div className="text-center pb-6 border-b border-gray-200">
              <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">N</span>
              </div>
              <h2 className="text-xl font-bold text-gray-800">NESMA HR</h2>
              <p className="text-sm text-gray-500">
                Human Resources Department
              </p>
            </div>

            {/* Letter Content */}
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="flex justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-500">Reference</p>
                  <p className="font-medium text-gray-800">
                    {selectedLetter.id}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium text-gray-800">
                    {format(new Date(selectedLetter.createdAt), "MMMM d, yyyy")}
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {selectedLetter.subject}
              </h3>

              <div className="space-y-4 text-gray-700">
                <p>To Whom It May Concern,</p>
                <p>
                  This is to certify that{" "}
                  <strong>{selectedLetter.employeeName}</strong> is employed
                  with NESMA HR Company. The employee has been working with us
                  since their date of joining.
                </p>
                <p>
                  This letter is issued upon the request of the employee for
                  official purposes.
                </p>
                <p>
                  For any further information or verification, please contact us
                  at the address mentioned above.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="font-medium text-gray-800">HR Department</p>
                <p className="text-sm text-gray-500">NESMA HR Company</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowPreviewModal(false)}
              >
                Close
              </Button>
              <Button variant="outline">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button>
                <Send className="w-4 h-4 mr-2" />
                Send to Employee
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LettersPage;
