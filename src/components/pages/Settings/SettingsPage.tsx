import React, { useState } from "react";
import {
  Settings,
  Building2,
  Globe,
  Bell,
  Shield,
  Users,
  Calendar,
  Clock,
  Mail,
  Phone,
  MapPin,
  Save,
  Upload,
  FileText,
  Palette,
  Key,
} from "lucide-react";
import { Button } from "../../common/Button";
import { Card } from "../../common/Card";
import { Input } from "../../common/Input";
import { Select } from "../../common/Select";
import { Tabs, TabPanel } from "../../common/Tabs";
import { cn } from "../../../utils/cn";

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("company");

  const tabs = [
    {
      id: "company",
      label: "Company",
      icon: <Building2 className="w-4 h-4" />,
    },
    {
      id: "localization",
      label: "Localization",
      icon: <Globe className="w-4 h-4" />,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell className="w-4 h-4" />,
    },
    { id: "security", label: "Security", icon: <Shield className="w-4 h-4" /> },
    {
      id: "permissions",
      label: "Permissions",
      icon: <Key className="w-4 h-4" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Company Settings</h1>
          <p className="text-gray-500 mt-1">
            Manage your company configuration
          </p>
        </div>
        <Button>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="separated" />

      {/* Company Tab */}
      <TabPanel id="company" activeTab={activeTab}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-6">
            <h3 className="font-semibold text-gray-800 mb-6">
              Company Information
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Company Name (English)"
                  defaultValue="NESMA HR"
                  placeholder="Enter company name"
                />
                <Input
                  label="Company Name (Arabic)"
                  defaultValue="نسمة للموارد البشرية"
                  placeholder="أدخل اسم الشركة"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="CR Number"
                  defaultValue="1010123456"
                  placeholder="Commercial registration number"
                />
                <Input
                  label="VAT Number"
                  defaultValue="300123456789012"
                  placeholder="VAT registration number"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="MOI Number"
                  defaultValue="MOI-123456"
                  placeholder="Ministry of Interior number"
                />
                <Input
                  label="Unified Number"
                  defaultValue="7001234567"
                  placeholder="Unified number"
                />
              </div>
              <Input
                label="Address"
                defaultValue="King Fahd Road, Al Olaya District"
                placeholder="Company address"
                icon={<MapPin className="w-4 h-4" />}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input label="City" defaultValue="Riyadh" placeholder="City" />
                <Input
                  label="Country"
                  defaultValue="Saudi Arabia"
                  placeholder="Country"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Phone"
                  defaultValue="+966 11 234 5678"
                  placeholder="Phone number"
                  icon={<Phone className="w-4 h-4" />}
                />
                <Input
                  label="Email"
                  type="email"
                  defaultValue="info@nesma-hr.com"
                  placeholder="Company email"
                  icon={<Mail className="w-4 h-4" />}
                />
              </div>
              <Input
                label="Website"
                defaultValue="https://nesma-hr.com"
                placeholder="Company website"
                icon={<Globe className="w-4 h-4" />}
              />
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Company Logo</h3>
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 bg-primary rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-4xl">N</span>
                </div>
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Logo
                </Button>
                <p className="text-xs text-gray-500 mt-2">PNG, JPG up to 2MB</p>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-gray-800 mb-4">
                Representative
              </h3>
              <div className="space-y-4">
                <Input
                  label="Name"
                  defaultValue="Abdulrahman Hussein"
                  placeholder="Representative name"
                />
                <Input
                  label="Email"
                  type="email"
                  defaultValue="a.hussein@nesma-hr.com"
                  placeholder="Email"
                />
                <Input
                  label="Phone"
                  defaultValue="+966 50 123 4567"
                  placeholder="Phone"
                />
              </div>
            </Card>
          </div>
        </div>
      </TabPanel>

      {/* Localization Tab */}
      <TabPanel id="localization" activeTab={activeTab}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold text-gray-800 mb-6">
              Regional Settings
            </h3>
            <div className="space-y-4">
              <Select
                label="Timezone"
                options={[
                  { value: "Asia/Riyadh", label: "(GMT+03:00) Riyadh" },
                  { value: "Asia/Dubai", label: "(GMT+04:00) Dubai" },
                  { value: "Asia/Jeddah", label: "(GMT+03:00) Jeddah" },
                ]}
                defaultValue="Asia/Riyadh"
              />
              <Select
                label="Currency"
                options={[
                  { value: "SAR", label: "Saudi Riyal (SAR)" },
                  { value: "AED", label: "UAE Dirham (AED)" },
                  { value: "USD", label: "US Dollar (USD)" },
                ]}
                defaultValue="SAR"
              />
              <Select
                label="Date Format"
                options={[
                  { value: "dd/MM/yyyy", label: "DD/MM/YYYY" },
                  { value: "MM/dd/yyyy", label: "MM/DD/YYYY" },
                  { value: "yyyy-MM-dd", label: "YYYY-MM-DD" },
                ]}
                defaultValue="dd/MM/yyyy"
              />
              <Select
                label="Time Format"
                options={[
                  { value: "12", label: "12-hour (AM/PM)" },
                  { value: "24", label: "24-hour" },
                ]}
                defaultValue="12"
              />
              <Select
                label="Week Starts On"
                options={[
                  { value: "sunday", label: "Sunday" },
                  { value: "monday", label: "Monday" },
                  { value: "saturday", label: "Saturday" },
                ]}
                defaultValue="sunday"
              />
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-gray-800 mb-6">Working Hours</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Start Time" type="time" defaultValue="08:00" />
                <Input label="End Time" type="time" defaultValue="17:00" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Working Days
                </label>
                <div className="flex flex-wrap gap-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day, index) => (
                      <button
                        key={day}
                        className={cn(
                          "px-4 py-2 rounded-lg border text-sm font-medium transition-colors",
                          index < 5
                            ? "bg-primary text-white border-primary"
                            : "bg-white text-gray-600 border-gray-200 hover:border-primary",
                        )}
                      >
                        {day}
                      </button>
                    ),
                  )}
                </div>
              </div>

              <Input
                label="Fiscal Year Start"
                type="date"
                defaultValue="2024-01-01"
              />
            </div>
          </Card>

          <Card className="p-6 lg:col-span-2">
            <h3 className="font-semibold text-gray-800 mb-6">
              Language Settings
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Default Language"
                options={[
                  { value: "en", label: "English" },
                  { value: "ar", label: "Arabic" },
                ]}
                defaultValue="en"
              />
              <Select
                label="Secondary Language"
                options={[
                  { value: "ar", label: "Arabic" },
                  { value: "en", label: "English" },
                ]}
                defaultValue="ar"
              />
            </div>
          </Card>
        </div>
      </TabPanel>

      {/* Notifications Tab */}
      <TabPanel id="notifications" activeTab={activeTab}>
        <Card className="p-6">
          <h3 className="font-semibold text-gray-800 mb-6">
            Notification Preferences
          </h3>
          <div className="space-y-6">
            {[
              {
                id: "leave",
                label: "Leave Requests",
                desc: "Notify when employees submit leave requests",
              },
              {
                id: "attendance",
                label: "Attendance Alerts",
                desc: "Notify about late arrivals and absences",
              },
              {
                id: "documents",
                label: "Document Expiry",
                desc: "Notify before documents expire",
              },
              {
                id: "payroll",
                label: "Payroll Updates",
                desc: "Notify about payroll processing",
              },
              {
                id: "birthdays",
                label: "Birthdays",
                desc: "Notify about employee birthdays",
              },
              {
                id: "approvals",
                label: "Pending Approvals",
                desc: "Notify about pending approval requests",
              },
            ].map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div>
                  <p className="font-medium text-gray-800">{item.label}</p>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-primary rounded"
                      defaultChecked
                    />
                    <span className="text-sm text-gray-600">Email</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-primary rounded"
                      defaultChecked
                    />
                    <span className="text-sm text-gray-600">Push</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-primary rounded"
                    />
                    <span className="text-sm text-gray-600">SMS</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </TabPanel>

      {/* Security Tab */}
      <TabPanel id="security" activeTab={activeTab}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold text-gray-800 mb-6">
              Password Policy
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-800">Minimum Length</p>
                  <p className="text-sm text-gray-500">
                    Minimum password characters
                  </p>
                </div>
                <Input type="number" defaultValue="8" className="w-20" />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-800">Require Uppercase</p>
                  <p className="text-sm text-gray-500">
                    At least one uppercase letter
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="w-5 h-5 text-primary rounded"
                  defaultChecked
                />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-800">Require Numbers</p>
                  <p className="text-sm text-gray-500">At least one number</p>
                </div>
                <input
                  type="checkbox"
                  className="w-5 h-5 text-primary rounded"
                  defaultChecked
                />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-800">
                    Require Special Characters
                  </p>
                  <p className="text-sm text-gray-500">
                    At least one special character
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="w-5 h-5 text-primary rounded"
                />
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-800">
                    Password Expiry (Days)
                  </p>
                  <p className="text-sm text-gray-500">
                    Force password change after days
                  </p>
                </div>
                <Input type="number" defaultValue="90" className="w-20" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-gray-800 mb-6">
              Session Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-800">
                    Session Timeout (Minutes)
                  </p>
                  <p className="text-sm text-gray-500">
                    Auto logout after inactivity
                  </p>
                </div>
                <Input type="number" defaultValue="30" className="w-20" />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-800">
                    Two-Factor Authentication
                  </p>
                  <p className="text-sm text-gray-500">
                    Require 2FA for all users
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="w-5 h-5 text-primary rounded"
                />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-800">IP Restriction</p>
                  <p className="text-sm text-gray-500">
                    Restrict access to specific IPs
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="w-5 h-5 text-primary rounded"
                />
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-800">Login Attempts</p>
                  <p className="text-sm text-gray-500">
                    Max failed attempts before lockout
                  </p>
                </div>
                <Input type="number" defaultValue="5" className="w-20" />
              </div>
            </div>
          </Card>
        </div>
      </TabPanel>

      {/* Permissions Tab */}
      <TabPanel id="permissions" activeTab={activeTab}>
        <Card className="p-6">
          <h3 className="font-semibold text-gray-800 mb-6">Role Permissions</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">
                    Permission
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-600">
                    Owner
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-600">
                    Admin
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-600">
                    HR Manager
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-600">
                    Manager
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-600">
                    Employee
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  "View Employees",
                  "Add Employees",
                  "Edit Employees",
                  "Delete Employees",
                  "View Payroll",
                  "Process Payroll",
                  "Approve Leaves",
                  "Manage Attendance",
                  "Access Reports",
                  "System Settings",
                ].map((permission, index) => (
                  <tr key={permission} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-800">{permission}</td>
                    <td className="text-center py-3 px-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-primary rounded"
                        defaultChecked
                      />
                    </td>
                    <td className="text-center py-3 px-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-primary rounded"
                        defaultChecked
                      />
                    </td>
                    <td className="text-center py-3 px-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-primary rounded"
                        defaultChecked={index < 7}
                      />
                    </td>
                    <td className="text-center py-3 px-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-primary rounded"
                        defaultChecked={index < 4 || index === 6}
                      />
                    </td>
                    <td className="text-center py-3 px-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-primary rounded"
                        defaultChecked={index === 0}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </TabPanel>
    </div>
  );
};

export default SettingsPage;
