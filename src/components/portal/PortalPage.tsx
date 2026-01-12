import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Truck,
  Calculator,
  Briefcase,
  FileText,
  Building2,
  ChevronRight,
  Clock,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { PortalBackground } from "../common/ParticlesBackground";

interface SystemCard {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  status: "active" | "coming-soon";
  features: string[];
  link: string;
  external?: boolean;
}

const systems: SystemCard[] = [
  {
    id: "hr",
    name: "Human Resources",
    nameAr: "الموارد البشرية",
    description:
      "Employee management, attendance, payroll & performance tracking",
    icon: <Users className="w-10 h-10 text-white" />,
    gradient: "linear-gradient(135deg, #2E3192 0%, #0E2841 100%)",
    status: "active",
    features: ["Employees", "Attendance", "Payroll", "Leaves"],
    link: "/",
    external: false,
  },
  {
    id: "scm",
    name: "Supply Chain",
    nameAr: "سلسلة الإمداد",
    description: "Logistics, procurement, warehouse & inventory management",
    icon: <Truck className="w-10 h-10 text-white" />,
    gradient: "linear-gradient(135deg, #10B981 0%, #0E2841 100%)",
    status: "active",
    features: ["Logistics", "Procurement", "Warehouse", "Fleet"],
    link: "/Users/a.rahman/Claude/nesma-dashboard-v02/index.html",
    external: true,
  },
  {
    id: "mitc",
    name: "MITC Reports",
    nameAr: "تقارير MITC",
    description:
      "Material Inventory & Technical Committee reports and dashboards",
    icon: <FileText className="w-10 h-10 text-white" />,
    gradient: "linear-gradient(135deg, #6366F1 0%, #0E2841 100%)",
    status: "active",
    features: ["Executive Summary", "KPIs", "Issues", "Gallery"],
    link: "/Users/a.rahman/Desktop/NIT/MITC/MITC Report and Dashboard/index.html",
    external: true,
  },
  {
    id: "accounting",
    name: "Accounting",
    nameAr: "المحاسبة",
    description: "Financial management, invoicing & expense tracking",
    icon: <Calculator className="w-10 h-10 text-white" />,
    gradient: "linear-gradient(135deg, #F59E0B 0%, #0E2841 100%)",
    status: "coming-soon",
    features: ["Invoices", "Expenses", "Reports", "Budgets"],
    link: "#",
    external: false,
  },
  {
    id: "projects",
    name: "Projects",
    nameAr: "المشاريع",
    description: "Project management, timelines & resource allocation",
    icon: <Briefcase className="w-10 h-10 text-white" />,
    gradient: "linear-gradient(135deg, #EC4899 0%, #0E2841 100%)",
    status: "coming-soon",
    features: ["Tasks", "Timelines", "Resources", "Reports"],
    link: "#",
    external: false,
  },
];

const PortalPage: React.FC = () => {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "Asia/Riyadh",
      };
      setCurrentTime(now.toLocaleTimeString("en-US", options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* Background */}
      <PortalBackground showParticles particleCount={30} />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-6 pt-8 pb-4">
          <nav className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img
                src={`${import.meta.env.BASE_URL}assets/logo-white.svg`}
                alt="NESMA"
                className="h-10 lg:h-12"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <div className="border-l border-white/30 pl-4">
                <h1 className="text-lg font-bold">NESMA</h1>
                <p className="text-xs text-[#80D1E9]">
                  Infrastructure & Technology
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm hidden md:inline">
                Enterprise Portal
              </span>
              <div className="h-6 w-px bg-gray-700 hidden md:block" />
              <div className="flex items-center gap-2 text-[#80D1E9] text-sm">
                <Clock className="w-4 h-4" />
                <span>{currentTime}</span>
              </div>
            </div>
          </nav>
        </header>

        {/* Hero */}
        <section className="container mx-auto px-6 py-16 text-center">
          <div className="fade-in-up stagger-1">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Building2 className="w-8 h-8 text-[#80D1E9]" />
              <span className="text-sm font-semibold text-[#80D1E9] tracking-wider uppercase">
                Enterprise Resource Planning
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 glow-text">
              NESMA <span className="text-[#80D1E9]">ERP Portal</span>
            </h1>
            <p className="text-xl text-gray-400 mb-2">
              Integrated Business Management System
            </p>
            <p className="text-sm text-[#80D1E9]/70">
              Select a module to access dashboards and management tools
            </p>
          </div>
        </section>

        {/* System Cards */}
        <section className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {systems.map((system, index) => (
              <SystemCardComponent
                key={system.id}
                system={system}
                index={index}
              />
            ))}
          </div>
        </section>

        {/* Quick Stats */}
        <section className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickStat value="45" label="Active Employees" />
            <QuickStat value="5" label="Locations" />
            <QuickStat value="10" label="Departments" />
            <QuickStat value="3" label="Active Systems" />
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-8 text-center">
          <div className="border-t border-gray-800 pt-6">
            <p className="text-gray-500 text-sm mb-2">
              NESMA Infrastructure & Technology
            </p>
            <p className="text-gray-600 text-xs">
              Enterprise Resource Planning System
            </p>
            <p className="text-gray-700 text-xs mt-3">
              Version 2.0.0 | January 2026
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

// System Card Component
const SystemCardComponent: React.FC<{ system: SystemCard; index: number }> = ({
  system,
  index,
}) => {
  const CardWrapper = system.external ? "a" : Link;
  const cardProps = system.external
    ? { href: system.link, target: "_blank", rel: "noopener noreferrer" }
    : { to: system.link };

  return (
    <CardWrapper
      {...(cardProps as any)}
      className={cn(
        "glass-card-effect p-8 block text-center min-h-[320px]",
        "fade-in-up",
        `stagger-${(index % 4) + 2}`,
        system.status === "coming-soon" && "opacity-70 cursor-not-allowed",
      )}
      onClick={
        system.status === "coming-soon" ? (e) => e.preventDefault() : undefined
      }
    >
      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{ background: system.gradient }}
        >
          {system.icon}
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold",
            system.status === "active"
              ? "bg-green-500/20 text-green-400"
              : "bg-amber-500/20 text-amber-400",
          )}
        >
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              system.status === "active"
                ? "bg-green-400 pulse-dot"
                : "bg-amber-400",
            )}
          />
          {system.status === "active" ? "Active" : "Coming Soon"}
        </span>
      </div>

      {/* Content */}
      <h3 className="text-2xl font-bold mb-1">{system.name}</h3>
      <p className="text-[#80D1E9] text-sm mb-3">{system.nameAr}</p>
      <p className="text-gray-400 text-sm mb-6">{system.description}</p>

      {/* Features */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {system.features.map((feature) => (
          <span
            key={feature}
            className="px-3 py-1 text-xs rounded-lg bg-white/10 text-white/70"
          >
            {feature}
          </span>
        ))}
      </div>

      {/* Enter Button */}
      {system.status === "active" && (
        <div className="flex items-center justify-center text-[#80D1E9] text-sm font-semibold">
          <span>Enter</span>
          <ChevronRight className="w-5 h-5 ml-1" />
        </div>
      )}
    </CardWrapper>
  );
};

// Quick Stat Component
const QuickStat: React.FC<{ value: string; label: string }> = ({
  value,
  label,
}) => (
  <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
    <p className="text-3xl font-bold text-[#80D1E9]">{value}</p>
    <p className="text-xs text-gray-400 mt-1">{label}</p>
  </div>
);

export default PortalPage;
