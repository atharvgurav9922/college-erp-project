import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ERPProvider } from './context/ERPContext';
import { ToastProvider } from './context/ToastContext';
import { DashboardLayout } from './layouts/DashboardLayout';

// Auth
import { LoginPage } from './components/auth/LoginPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { StudentsManagement } from './pages/admin/StudentsManagement';
import { FacultyManagement } from './pages/admin/FacultyManagement';
import { DepartmentsManagement } from './pages/admin/DepartmentsManagement';
import { NoticesManagement } from './pages/admin/NoticesManagement';
import { AdminHostelTransportOverview } from './pages/admin/AdminHostelTransportOverview';

// Faculty Pages
import { FacultyDashboard } from './pages/faculty/FacultyDashboard';
import { AssignedSubjects } from './pages/faculty/AssignedSubjects';
import { MarkAttendance } from './pages/faculty/MarkAttendance';
import { EnterMarks } from './pages/faculty/EnterMarks';
import { FacultyNotices } from './pages/faculty/FacultyNotices';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentProfile } from './pages/student/StudentProfile';
import { StudentAttendance } from './pages/student/StudentAttendance';
import { StudentTimetable } from './pages/student/StudentTimetable';
import { StudentMarks } from './pages/student/StudentMarks';
import { StudentHostel } from './pages/student/StudentHostel';
import { StudentTransport } from './pages/student/StudentTransport';
import { StudentNotices } from './pages/student/StudentNotices';

// Hostel Warden Pages
import { HostelDashboard } from './pages/hostel/HostelDashboard';
import { HostelRooms } from './pages/hostel/HostelRooms';
import { HostelApplications } from './pages/hostel/HostelApplications';
import { HostelStudents } from './pages/hostel/HostelStudents';
import { HostelComplaints } from './pages/hostel/HostelComplaints';

// Transport Manager Pages
import { TransportDashboard } from './pages/transport/TransportDashboard';
import { ManageBuses } from './pages/transport/ManageBuses';
import { ManageRoutes } from './pages/transport/ManageRoutes';
import { TransportApplications } from './pages/transport/TransportApplications';
import { AssignedTransportStudents } from './pages/transport/AssignedTransportStudents';

// Root Router Redirect Helper
const RootRedirect = () => {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  switch (role) {
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'faculty':
      return <Navigate to="/faculty" replace />;
    case 'student':
      return <Navigate to="/student" replace />;
    case 'warden':
      return <Navigate to="/hostel" replace />;
    case 'transport':
      return <Navigate to="/transport" replace />;
    default:
      return <Navigate to="/admin" replace />;
  }
};

function App() {
  return (
    <AuthProvider>
      <ERPProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Login Route */}
              <Route path="/login" element={<LoginPage />} />

              {/* Protected Dashboard Layout */}
              <Route path="/" element={<DashboardLayout />}>
                <Route index element={<RootRedirect />} />

                {/* 1. Admin Portal */}
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="admin/students" element={<StudentsManagement />} />
                <Route path="admin/faculty" element={<FacultyManagement />} />
                <Route path="admin/departments" element={<DepartmentsManagement />} />
                <Route path="admin/notices" element={<NoticesManagement />} />
                <Route path="admin/infrastructure" element={<AdminHostelTransportOverview />} />

                {/* 2. Faculty Portal */}
                <Route path="faculty" element={<FacultyDashboard />} />
                <Route path="faculty/subjects" element={<AssignedSubjects />} />
                <Route path="faculty/attendance" element={<MarkAttendance />} />
                <Route path="faculty/marks" element={<EnterMarks />} />
                <Route path="faculty/notices" element={<FacultyNotices />} />

                {/* 3. Student Portal */}
                <Route path="student" element={<StudentDashboard />} />
                <Route path="student/profile" element={<StudentProfile />} />
                <Route path="student/attendance" element={<StudentAttendance />} />
                <Route path="student/timetable" element={<StudentTimetable />} />
                <Route path="student/marks" element={<StudentMarks />} />
                <Route path="student/hostel" element={<StudentHostel />} />
                <Route path="student/transport" element={<StudentTransport />} />
                <Route path="student/notices" element={<StudentNotices />} />

                {/* 4. Hostel Warden Portal */}
                <Route path="hostel" element={<HostelDashboard />} />
                <Route path="hostel/rooms" element={<HostelRooms />} />
                <Route path="hostel/applications" element={<HostelApplications />} />
                <Route path="hostel/students" element={<HostelStudents />} />
                <Route path="hostel/complaints" element={<HostelComplaints />} />

                {/* 5. Transport Manager Portal */}
                <Route path="transport" element={<TransportDashboard />} />
                <Route path="transport/buses" element={<ManageBuses />} />
                <Route path="transport/routes" element={<ManageRoutes />} />
                <Route path="transport/applications" element={<TransportApplications />} />
                <Route path="transport/students" element={<AssignedTransportStudents />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </ERPProvider>
    </AuthProvider>
  );
}

export default App;
