import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useERP } from '../../context/ERPContext';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Users,
  CheckSquare,
  Award,
  Bell,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const FacultyDashboard = () => {
  const { currentUser } = useAuth();
  const { students, notices, timetable } = useERP();

  const assignedSubjects = currentUser?.assignedSubjects || [
    'CS601: Database Systems',
    'CS603: Computer Networks',
    'CS605: Web Architectures'
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-emerald-800/40 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <Badge variant="success" className="mb-3 bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
            Faculty Academic Portal
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display">
            Welcome, {currentUser?.name || 'Dr. Sarah Jenkins'}
          </h1>
          <p className="mt-2 text-emerald-100/80 text-sm leading-relaxed">
            Department of {currentUser?.department || 'Computer Science & Engineering'} • {currentUser?.designation || 'Associate Professor'}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/faculty/attendance"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold rounded-xl transition shadow-md shadow-emerald-600/30"
            >
              <CheckSquare className="w-4 h-4" />
              Mark Today's Attendance
            </Link>
            <Link
              to="/faculty/marks"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-white text-xs sm:text-sm font-semibold rounded-xl border border-emerald-700/40 transition"
            >
              <Award className="w-4 h-4" />
              Enter Marks & Grades
            </Link>
          </div>
        </div>

        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Courses"
          value={assignedSubjects.length}
          subtitle="Spring 2026 Term"
          icon={BookOpen}
          iconBg="bg-emerald-50 text-emerald-600"
          gradient="from-emerald-500 to-teal-600"
        />
        <StatCard
          title="Enrolled Students"
          value={students.length}
          subtitle="Across your subjects"
          icon={Users}
          iconBg="bg-indigo-50 text-indigo-600"
          gradient="from-indigo-500 to-indigo-600"
        />
        <StatCard
          title="Avg Class Attendance"
          value="89.4%"
          subtitle="Optimal engagement"
          icon={CheckSquare}
          trend="+2.1%"
          trendLabel="vs last month"
          iconBg="bg-amber-50 text-amber-600"
          gradient="from-amber-500 to-amber-600"
        />
        <StatCard
          title="Pending Mark Submissions"
          value="1 Course"
          subtitle="Mid-Term Evaluations"
          icon={Award}
          iconBg="bg-rose-50 text-rose-600"
          gradient="from-rose-500 to-rose-600"
        />
      </div>

      {/* Split Grid: Today's Schedule & Assigned Subjects */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Today's Lectures */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-soft p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-display">
                Today's Teaching Schedule
              </h2>
              <p className="text-xs text-slate-500">Upcoming lecture slots and laboratory sessions</p>
            </div>
            <Badge variant="primary">Monday</Badge>
          </div>

          <div className="space-y-3">
            {timetable.Monday?.map((slot, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-100/60 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">{slot.subject}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Location: <span className="font-semibold text-slate-700">{slot.room}</span></p>
                  </div>
                </div>

                <div className="text-right flex sm:flex-col items-center sm:items-end justify-between">
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                    {slot.time}
                  </span>
                  <Link
                    to="/faculty/attendance"
                    className="text-[11px] font-semibold text-emerald-600 hover:underline mt-1"
                  >
                    Take Attendance →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Assigned Courses & Notices */}
        <div className="lg:col-span-5 space-y-6">
          {/* Courses Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 font-display">
                Assigned Subjects
              </h2>
              <Link to="/faculty/subjects" className="text-xs font-semibold text-indigo-600 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {assignedSubjects.map((sub, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">{sub}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">B.Tech 6th Semester • 4 Credits</p>
                  </div>
                  <Badge variant="success" size="xs">
                    Active
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Notices Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-5 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-slate-900 font-display">
                Faculty Circulars
              </h2>
              <Link to="/faculty/notices" className="text-xs font-semibold text-indigo-600 hover:underline">
                Notice Board
              </Link>
            </div>

            <div className="space-y-2.5">
              {notices.slice(0, 2).map((n) => (
                <div key={n.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="primary" size="xs">{n.category}</Badge>
                    <span className="text-slate-400 text-[10px]">{n.date}</span>
                  </div>
                  <p className="font-bold text-slate-800 line-clamp-1">{n.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
