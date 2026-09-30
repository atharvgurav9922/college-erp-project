import React from 'react';
import { useERP } from '../../context/ERPContext';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Users,
  Building2,
  BedDouble,
  Bus,
  Bell,
  ArrowRight,
  PlusCircle,
  TrendingUp,
  Award
} from 'lucide-react';

export const AdminDashboard = () => {
  const { students, faculty, departments, notices, hostelRooms, buses, hostelApplications, transportApplications } = useERP();

  // Computations
  const totalHostelCapacity = hostelRooms.reduce((acc, r) => acc + r.capacity, 0);
  const totalHostelOccupied = hostelRooms.reduce((acc, r) => acc + r.occupied, 0);
  const hostelOccupancyPct = totalHostelCapacity ? Math.round((totalHostelOccupied / totalHostelCapacity) * 100) : 0;

  const totalBusSeats = buses.reduce((acc, b) => acc + b.capacity, 0);
  const totalBusOccupied = buses.reduce((acc, b) => acc + b.occupiedSeats, 0);
  const transportUtilizationPct = totalBusSeats ? Math.round((totalBusOccupied / totalBusSeats) * 100) : 0;

  const pendingHostelApps = hostelApplications.filter((a) => a.status === 'Pending').length;
  const pendingTransportApps = transportApplications.filter((a) => a.status === 'Pending').length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 overflow-hidden shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-2xl">
          <Badge variant="primary" className="mb-3 bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
            Administrator Command Center
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display">
            Welcome back, System Admin
          </h1>
          <p className="mt-2 text-slate-300 text-sm leading-relaxed">
            Manage academic curricula, faculty allocations, student rosters, hostel infrastructure, and fleet operations with real-time synchronized data.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/admin/students"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl transition shadow-md shadow-indigo-600/30"
            >
              <PlusCircle className="w-4 h-4" />
              Manage Students
            </Link>
            <Link
              to="/admin/notices"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold rounded-xl border border-slate-700 transition"
            >
              <Bell className="w-4 h-4" />
              Broadcast Notice
            </Link>
          </div>
        </div>

        {/* Decorative circle art */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Students"
          value={students.length}
          subtitle="Enrolled Active"
          icon={GraduationCap}
          trend="+12%"
          iconBg="bg-indigo-50 text-indigo-600"
          gradient="from-indigo-500 to-indigo-600"
        />
        <StatCard
          title="Total Faculty"
          value={faculty.length}
          subtitle="Across 5 Depts"
          icon={Users}
          trend="+4%"
          iconBg="bg-emerald-50 text-emerald-600"
          gradient="from-emerald-500 to-emerald-600"
        />
        <StatCard
          title="Departments"
          value={departments.length}
          subtitle="Academic Wings"
          icon={Building2}
          iconBg="bg-purple-50 text-purple-600"
          gradient="from-purple-500 to-purple-600"
        />
        <StatCard
          title="Hostel Occupancy"
          value={`${hostelOccupancyPct}%`}
          subtitle={`${totalHostelOccupied}/${totalHostelCapacity} Beds`}
          icon={BedDouble}
          trend={`${pendingHostelApps} Pending`}
          trendLabel="requests"
          iconBg="bg-amber-50 text-amber-600"
          gradient="from-amber-500 to-amber-600"
        />
        <StatCard
          title="Transport Fleet"
          value={`${buses.length} Buses`}
          subtitle={`${transportUtilizationPct}% utilized`}
          icon={Bus}
          trend={`${pendingTransportApps} Pending`}
          trendLabel="passes"
          iconBg="bg-cyan-50 text-cyan-600"
          gradient="from-cyan-500 to-cyan-600"
        />
        <StatCard
          title="Active Notices"
          value={notices.length}
          subtitle="Published circulars"
          icon={Bell}
          iconBg="bg-rose-50 text-rose-600"
          gradient="from-rose-500 to-rose-600"
        />
      </div>

      {/* Main Content Split: Students Quick Table & Dept Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Students List */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-soft p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-display">
                  Student Enrolment Directory
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Recently enrolled student records
                </p>
              </div>
              <Link
                to="/admin/students"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                View all students <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[11px]">
                    <th className="pb-3">Student</th>
                    <th className="pb-3">Roll No</th>
                    <th className="pb-3">Department</th>
                    <th className="pb-3">Hostel</th>
                    <th className="pb-3">Transport</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.slice(0, 5).map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3 font-semibold text-slate-800 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center">
                          {s.name.charAt(0)}
                        </div>
                        {s.name}
                      </td>
                      <td className="py-3 text-slate-600 font-mono text-xs">{s.rollNumber}</td>
                      <td className="py-3 text-slate-600">{s.department.split(' ')[0]}</td>
                      <td className="py-3">
                        <Badge
                          variant={
                            s.hostelStatus === 'Allocated'
                              ? 'success'
                              : s.hostelStatus === 'Applied'
                              ? 'warning'
                              : 'default'
                          }
                          size="xs"
                        >
                          {s.hostelStatus === 'Allocated' ? s.hostelRoom || 'Allocated' : s.hostelStatus}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <Badge
                          variant={
                            s.transportStatus === 'Allocated'
                              ? 'info'
                              : s.transportStatus === 'Applied'
                              ? 'warning'
                              : 'default'
                          }
                          size="xs"
                        >
                          {s.transportStatus === 'Allocated' ? s.transportBus || 'Pass' : s.transportStatus}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Circulars & Quick Overview */}
        <div className="lg:col-span-4 space-y-6">
          {/* Department Breakdown Widget */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-5 sm:p-6">
            <h2 className="text-sm font-bold text-slate-900 font-display mb-3">
              Department Statistics
            </h2>
            <div className="space-y-3">
              {departments.slice(0, 4).map((d) => (
                <div key={d.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-700">{d.name}</span>
                    <span className="text-slate-500">{d.studentCount} Students</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${Math.min(100, (d.studentCount / 350) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Published Circulars Widget */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-5 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900 font-display">
                Latest Circulars
              </h2>
              <Link to="/admin/notices" className="text-xs font-semibold text-indigo-600 hover:underline">
                Manage
              </Link>
            </div>
            <div className="space-y-3">
              {notices.slice(0, 3).map((n) => (
                <div key={n.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/80 transition">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <Badge variant="primary" size="xs">
                      {n.category}
                    </Badge>
                    <span className="text-slate-400 font-medium">{n.date}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 line-clamp-1">{n.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
