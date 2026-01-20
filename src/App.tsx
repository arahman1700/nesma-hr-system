import { lazy, Suspense } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout";
import { ToastProvider, ErrorBoundary } from "./components/common";
import { ThemeProvider } from "./contexts/ThemeContext";
import { PageLoader } from "./components/common/PageLoader";

// Lazy load all pages for better initial load performance
const Dashboard = lazy(() => import("./components/pages/Home/Dashboard"));
const EmployeesPage = lazy(() => import("./components/pages/Employees/EmployeesPage"));
const CalendarPage = lazy(() => import("./components/pages/Calendar/CalendarPage"));
const AttendancePage = lazy(() => import("./components/pages/Attendance/AttendancePage"));
const ShiftsPage = lazy(() => import("./components/pages/Shifts/ShiftsPage"));
const LeavesPage = lazy(() => import("./components/pages/Leaves/LeavesPage"));
const RequestsPage = lazy(() => import("./components/pages/Requests/RequestsPage"));
const PayrollPage = lazy(() => import("./components/pages/Payroll/PayrollPage"));
const TasksPage = lazy(() => import("./components/pages/Tasks/TasksPage"));
const LettersPage = lazy(() => import("./components/pages/Letters/LettersPage"));
const MuqeemPage = lazy(() => import("./components/pages/Muqeem/MuqeemPage"));
const GOSIPage = lazy(() => import("./components/pages/GOSI/GOSIPage"));
const TameeniPage = lazy(() => import("./components/pages/Tameeni/TameeniPage"));
const QsalaryPage = lazy(() => import("./components/pages/Qsalary/QsalaryPage"));
const MudadPage = lazy(() => import("./components/pages/Mudad/MudadPage"));
const PositionPage = lazy(() => import("./components/pages/Position/PositionPage"));
const SettingsPage = lazy(() => import("./components/pages/Settings/SettingsPage"));
const LocationsPage = lazy(() => import("./components/pages/Locations/LocationsPage"));
const FilesPage = lazy(() => import("./components/pages/Files/FilesPage"));
const PortalPage = lazy(() => import("./components/portal/PortalPage"));

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider />
        <Router>
          <Suspense fallback={<PageLoader message="Loading page..." />}>
            <Routes>
              {/* Portal Page - Standalone */}
              <Route path="/portal" element={<PortalPage />} />

              {/* Main HR System */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="calendar" element={<CalendarPage />} />
                <Route path="attendance" element={<AttendancePage />} />
                <Route path="shifts" element={<ShiftsPage />} />
                <Route path="leaves" element={<LeavesPage />} />
                <Route path="requests" element={<RequestsPage />} />
                <Route path="letters" element={<LettersPage />} />
                <Route path="muqeem" element={<MuqeemPage />} />
                <Route path="payroll" element={<PayrollPage />} />
                <Route path="mudad" element={<MudadPage />} />
                <Route path="qsalary" element={<QsalaryPage />} />
                <Route path="gosi" element={<GOSIPage />} />
                <Route path="tameeni" element={<TameeniPage />} />
                <Route path="employees" element={<EmployeesPage />} />
                <Route path="tasks" element={<TasksPage />} />
                <Route path="position" element={<PositionPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="locations" element={<LocationsPage />} />
                <Route path="files" element={<FilesPage />} />
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
