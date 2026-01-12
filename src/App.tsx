import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout";
import { ToastProvider } from "./components/common";
import { ThemeProvider } from "./contexts/ThemeContext";
import Dashboard from "./components/pages/Home/Dashboard";
import EmployeesPage from "./components/pages/Employees/EmployeesPage";
import CalendarPage from "./components/pages/Calendar/CalendarPage";
import AttendancePage from "./components/pages/Attendance/AttendancePage";
import ShiftsPage from "./components/pages/Shifts/ShiftsPage";
import LeavesPage from "./components/pages/Leaves/LeavesPage";
import RequestsPage from "./components/pages/Requests/RequestsPage";
import PayrollPage from "./components/pages/Payroll/PayrollPage";
import TasksPage from "./components/pages/Tasks/TasksPage";
import LettersPage from "./components/pages/Letters/LettersPage";
import MuqeemPage from "./components/pages/Muqeem/MuqeemPage";
import GOSIPage from "./components/pages/GOSI/GOSIPage";
import TameeniPage from "./components/pages/Tameeni/TameeniPage";
import QsalaryPage from "./components/pages/Qsalary/QsalaryPage";
import MudadPage from "./components/pages/Mudad/MudadPage";
import PositionPage from "./components/pages/Position/PositionPage";
import SettingsPage from "./components/pages/Settings/SettingsPage";
import LocationsPage from "./components/pages/Locations/LocationsPage";
import FilesPage from "./components/pages/Files/FilesPage";
import PortalPage from "./components/portal/PortalPage";

function App() {
  return (
    <ThemeProvider>
      <ToastProvider />
      <Router>
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
      </Router>
    </ThemeProvider>
  );
}

export default App;
