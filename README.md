# NESMA HR System

A comprehensive, modern Human Resources Management System built for NESMA Infrastructure & Technology. Features a beautiful glassmorphism design, real-time analytics, and full mobile responsiveness.

![NESMA HR System](https://img.shields.io/badge/NESMA-HR%20System-2E3192?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)

## Features

### Core Modules

- **Dashboard** - Real-time KPIs, charts, and quick actions
- **Employees** - Complete employee management with analytics
- **Attendance** - Track and manage daily attendance
- **Leaves** - Leave requests, balances, and calendar
- **Payroll** - Salary processing, payslips, and reports
- **Requests** - Employee requests management
- **Letters** - Generate official HR letters

### Key Features

- **4 Themes**: Light, Dark, Company (NESMA Brand), Glass Mode
- **AI Assistant (Abbas)** - Smart HR assistant with Arabic support
- **Data Export** - PDF, Excel, Word, Google Sheets, Email
- **Keyboard Shortcuts** - Ctrl+K command palette
- **Real-time Notifications** - Bell notifications system
- **Interactive Map** - Saudi Arabia locations with Leaflet
- **Mobile Responsive** - Fully optimized for all devices

### Design Highlights

- Glassmorphism effects
- Animated statistics cards
- Gradient backgrounds
- Smooth transitions
- Professional color scheme (#2E3192, #80D1E9, #0E2841)

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts
- **Maps**: Leaflet / React-Leaflet
- **Icons**: Lucide React
- **Build**: Vite 7
- **Date Handling**: date-fns

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable components
│   │   ├── AIAssistant.tsx
│   │   ├── ColoredStatsCard.tsx
│   │   ├── DataExportModal.tsx
│   │   ├── FilterBar.tsx
│   │   ├── HRDashboardCards.tsx
│   │   ├── InteractiveMap.tsx
│   │   ├── KeyboardShortcuts.tsx
│   │   ├── NotificationSystem.tsx
│   │   ├── QuickActionsSection.tsx
│   │   └── ...
│   ├── layout/          # Layout components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── MainLayout.tsx
│   ├── pages/           # Page components
│   │   ├── Home/Dashboard.tsx
│   │   ├── Employees/EmployeesPage.tsx
│   │   ├── Attendance/AttendancePage.tsx
│   │   ├── Leaves/LeavesPage.tsx
│   │   ├── Payroll/PayrollPage.tsx
│   │   └── ...
│   └── portal/          # Employee portal
├── contexts/            # React contexts
│   └── ThemeContext.tsx
├── data/                # Mock data
├── utils/               # Utility functions
└── index.css            # Global styles & themes
```

## Theme System

### Available Themes

1. **Light** - Clean white background
2. **Dark** - Dark slate background
3. **Company** - NESMA brand colors
4. **Glass** - Premium glassmorphism

### Keyboard Shortcuts

- `Ctrl/Cmd + K` - Open command palette
- `G + D` - Go to Dashboard
- `G + E` - Go to Employees
- `G + A` - Go to Attendance
- `G + L` - Go to Leaves
- `G + R` - Go to Requests
- `G + C` - Go to Calendar
- `G + S` - Go to Settings
- `?` - Show help

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Deploy automatically

### Netlify

1. Push to GitHub
2. Connect repository in Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`

## Environment Variables

No environment variables required for demo. For production:

```env
VITE_API_URL=your_api_url
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Mobile Support

Fully responsive design optimized for:

- iOS Safari
- Android Chrome
- Tablets (iPad, Android)

## License

Copyright 2024 NESMA Infrastructure & Technology. All rights reserved.

---

Built with by NESMA IT Team
