import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useERP } from '../../context/ERPContext';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  CheckSquare,
  Award,
  Calendar,
  BedDouble,
  Bus,
  Bell,
  Clock,
  ArrowRight,
  Sparkles,
  BookOpen
} from 'lucide-react';

export const StudentDashboard = () => {
  const { currentUser } = useAuth();
  const { studentAttendance, studentMarks, timetable, notices, hostelApplications, transportApplications } = useERP();

  // Compute Overall Attendance
  const totalClasses = studentAttendance.reduce((sum, s) => sum + s.totalClasses, 0);
  const attendedClasses = studentAttendance.reduce((sum, s) => sum + s.attendedClasses, 0);
  const overallAttendancePct = totalClasses ? ((attendedClasses / totalClasses) * 100).toFixed(1) : '90.0';

  // Hostel status check
  const hostelApp = hostelApplications.find((a) => a.studentId === (currentUser?.id || 'STU-001'));
  const hostelStatus = currentUser?.hostelStatus || (hostelApp?.status === 'Approved' ? 'Allocated' : hostelApp ? 'Applied' : 'None');

  // Transport status check
  const transportApp = transportApplications.find((a) => a.studentId === (currentUser?.id || 'STU-001'));
  const transportStatus = currentUser?.transportStatus || (transportApp?.status === 'Approved' ? 'Allocated' : transportApp ? 'Applied' : 'None');

  return (
    <div className="space-y-6">
      {/* Student Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-800/50 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="primary" className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
              Student Academic Portal
            </Badge>
            <span className="text-xs font-mono text-indigo-300 font-semibold">
              Roll: {currentUser?.rollNumber || '2022-CSE-045'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display">
            Welcome, {currentUser?.name || 'Alex Rivera'}
          </h1>
          <p className="mt-2 text-indigo-100/80 text-sm leading-relaxed">
            {currentUser?.department || 'Computer Science & Engineering'} • {currentUser?.semester || '6th Semester'}
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/student/attendance"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl transition shadow-md shadow-indigo-600/30"
            >
              <CheckSquare className="w-4 h-4" />
              View Attendance ({overallAttendancePct}%)
            </Link>
            <Link
              to="/student/marks"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-white text-xs sm:text-sm font-semibold rounded-xl border border-indigo-700/40 transition"
            >
              <Award className="w-4 h-4" />
              Grade Report & GPA
            </Link>
          </div>
        </div>

        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Attendance"
          value={`${overallAttendancePct}%`}
          subtitle={`${attendedClasses} of ${totalClasses} lectures`}
          icon={CheckSquare}
          trend={Number(overallAttendancePct) >= 75 ? 'Eligible for Exams' : 'Attendance Warning'}
          trendLabel=""
          iconBg="bg-emerald-50 text-emerald-600"
          gradient="from-emerald-500 to-teal-600"
        />
        <StatCard
          title="Current CGPA"
          value={currentUser?.cgpa ? currentUser.cgpa.toFixed(2) : '3.84'}
          subtitle="Out of 10.0 Scale"
          icon={Award}
          trend="Top 5%"
          trendLabel="in Class"
          iconBg="bg-indigo-50 text-indigo-600"
          gradient="from-indigo-500 to-indigo-600"
        />
        <StatCard
          title="Hostel Room"
          value={hostelStatus === 'Allocated' ? currentUser?.hostelDetails?.roomNo || 'A-304' : hostelStatus}
          subtitle={hostelStatus === 'Allocated' ? 'Block A (Aryabhata)' : 'Hostel Status'}
          icon={BedDouble}
          iconBg="bg-amber-50 text-amber-600"
          gradient="from-amber-500 to-amber-600"
        />
        <StatCard
          title="Transport Bus"
          value={transportStatus === 'Allocated' ? currentUser?.transportDetails?.busNo || 'Bus-04' : transportStatus}
          subtitle={transportStatus === 'Allocated' ? 'North Metro Express' : 'Transport Status'}
          icon={Bus}
          iconBg="bg-cyan-50 text-cyan-600"
          gradient="from-cyan-500 to-cyan-600"
        />
      </div>

      {/* Split Grid: Today's Timetable & Subject Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Today's Lectures */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-soft p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-display">
                Today's Class Schedule
              </h2>
              <p className="text-xs text-slate-500">Upcoming classes for Monday</p>
            </div>
            <Link to="/student/timetable" className="text-xs font-semibold text-indigo-600 hover:underline">
              Full Week →
            </Link>
          </div>

          <div className="space-y-3">
            {timetable.Monday?.map((slot, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-100/60 transition flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">{slot.subject}</h4>
                    <p className="text-xs text-slate-500">{slot.faculty} • <span className="font-semibold text-slate-700">{slot.room}</span></p>
                  </div>
                </div>

                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 shrink-0">
                  {slot.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Attendance Progress by Subject */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-soft p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-display">
                Attendance Breakdown
              </h2>
              <p className="text-xs text-slate-500">Subject-wise compliance</p>
            </div>
            <Link to="/student/attendance" className="text-xs font-semibold text-indigo-600 hover:underline">
              Details
            </Link>
          </div>

          <div className="space-y-3">
            {studentAttendance.map((item) => (
              <div key={item.subjectCode} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-700 truncate max-w-[200px]">{item.subjectName}</span>
                  <span className={item.percentage >= 85 ? 'text-emerald-600' : item.percentage >= 75 ? 'text-indigo-600' : 'text-rose-600'}>
                    {item.percentage}% ({item.attendedClasses}/{item.totalClasses})
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.percentage >= 85 ? 'bg-emerald-500' : item.percentage >= 75 ? 'bg-indigo-500' : 'bg-rose-500'
                      }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
