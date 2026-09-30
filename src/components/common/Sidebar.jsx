import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Building2,
  Bell,
  Building,
  Bus,
  BookOpen,
  CheckSquare,
  Award,
  Calendar,
  UserCheck,
  BedDouble,
  FileText,
  AlertCircle,
  MapPin,
  LogOut,
  X,
  Sparkles
} from 'lucide-react';

export const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { currentUser, role, logout } = useAuth();
  const navigate = useNavigate();

  const getNavLinks = () => {
    switch (role) {
      case 'admin':
        return [
          { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
          { to: '/admin/students', icon: GraduationCap, label: 'Students' },
          { to: '/admin/faculty', icon: Users, label: 'Faculty' },
          { to: '/admin/departments', icon: Building2, label: 'Departments' },
          { to: '/admin/notices', icon: Bell, label: 'Notices' },
          { to: '/admin/infrastructure', icon: Building, label: 'Hostel & Transport' },
        ];
      case 'faculty':
        return [
          { to: '/faculty', icon: LayoutDashboard, label: 'Dashboard', end: true },
          { to: '/faculty/subjects', icon: BookOpen, label: 'My Subjects' },
          { to: '/faculty/attendance', icon: CheckSquare, label: 'Mark Attendance' },
          { to: '/faculty/marks', icon: Award, label: 'Enter Marks' },
          { to: '/faculty/notices', icon: Bell, label: 'Notices' },
        ];
      case 'student':
        return [
          { to: '/student', icon: LayoutDashboard, label: 'Dashboard', end: true },
          { to: '/student/profile', icon: UserCheck, label: 'My Profile' },
          { to: '/student/attendance', icon: CheckSquare, label: 'Attendance' },
          { to: '/student/timetable', icon: Calendar, label: 'Timetable' },
          { to: '/student/marks', icon: Award, label: 'Marks & GPA' },
          { to: '/student/hostel', icon: BedDouble, label: 'Hostel Services' },
          { to: '/student/transport', icon: Bus, label: 'Transport Pass' },
          { to: '/student/notices', icon: Bell, label: 'Notices' },
        ];
      case 'warden':
        return [
          { to: '/hostel', icon: LayoutDashboard, label: 'Hostel Overview', end: true },
          { to: '/hostel/rooms', icon: BedDouble, label: 'Room Management' },
          { to: '/hostel/applications', icon: FileText, label: 'Room Applications' },
          { to: '/hostel/students', icon: GraduationCap, label: 'Hostel Residents' },
          { to: '/hostel/complaints', icon: AlertCircle, label: 'Complaints Desk' },
        ];
      case 'transport':
        return [
          { to: '/transport', icon: LayoutDashboard, label: 'Transport Overview', end: true },
          { to: '/transport/buses', icon: Bus, label: 'Manage Buses' },
          { to: '/transport/routes', icon: MapPin, label: 'Manage Routes' },
          { to: '/transport/applications', icon: FileText, label: 'Pass Applications' },
          { to: '/transport/students', icon: GraduationCap, label: 'Assigned Students' },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-white tracking-tight text-base font-display flex items-center gap-1.5">
                CampusPulse
              </h1>
              <span className="text-[10px] font-semibold tracking-wider text-indigo-400 uppercase">
                College ERP
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Role Pill */}
        <div className="px-4 py-3 border-b border-slate-800/60 bg-slate-950/20">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={currentUser?.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/40"
            />
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-semibold text-white truncate">{currentUser?.name}</p>
              <p className="text-[11px] text-indigo-300 font-medium capitalize truncate">
                {role === 'warden' ? 'Hostel Warden' : role === 'transport' ? 'Transport Mgr' : role}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Main Navigation
          </p>
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Footer / Logout */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
