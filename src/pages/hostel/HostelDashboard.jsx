import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useERP } from '../../context/ERPContext';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { Link } from 'react-router-dom';
import {
  BedDouble,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Building,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export const HostelDashboard = () => {
  const { currentUser } = useAuth();
  const { hostelRooms, hostelApplications, hostelComplaints, students } = useERP();

  // Metrics
  const totalRooms = hostelRooms.length;
  const totalBeds = hostelRooms.reduce((sum, r) => sum + r.capacity, 0);
  const occupiedBeds = hostelRooms.reduce((sum, r) => sum + r.occupied, 0);
  const availableBeds = totalBeds - occupiedBeds;
  const occupancyPct = totalBeds ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  const pendingApps = hostelApplications.filter((a) => a.status === 'Pending').length;
  const openComplaints = hostelComplaints.filter((c) => c.status !== 'Resolved').length;

  const hostelStudents = students.filter((s) => s.hostelStatus === 'Allocated');

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-900 via-amber-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-amber-800/40 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <Badge variant="warning" className="mb-3 bg-amber-500/20 text-amber-300 border-amber-500/30">
            Hostel Administration & Warden Portal
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display">
            Hostel Management Console
          </h1>
          <p className="mt-2 text-amber-100/80 text-sm leading-relaxed">
            Overseeing residential halls, student allocations, room inventory, and maintenance requests across all campus blocks.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/hostel/applications"
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs sm:text-sm font-semibold rounded-xl transition shadow-md shadow-amber-600/30"
            >
              <FileText className="w-4 h-4" />
              Review Applications ({pendingApps} Pending)
            </Link>
            <Link
              to="/hostel/rooms"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-white text-xs sm:text-sm font-semibold rounded-xl border border-amber-700/40 transition"
            >
              <BedDouble className="w-4 h-4" />
              Room Grid & Inventory
            </Link>
          </div>
        </div>

        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Rooms"
          value={totalRooms}
          subtitle="Across 3 blocks"
          icon={Building}
          iconBg="bg-amber-50 text-amber-600"
          gradient="from-amber-500 to-amber-600"
        />
        <StatCard
          title="Occupied Beds"
          value={`${occupiedBeds} Beds`}
          subtitle={`${occupancyPct}% Occupancy`}
          icon={BedDouble}
          trend={`${availableBeds} Vacant`}
          trendLabel=""
          iconBg="bg-indigo-50 text-indigo-600"
          gradient="from-indigo-500 to-indigo-600"
        />
        <StatCard
          title="Hostel Residents"
          value={hostelStudents.length}
          subtitle="Registered hostellers"
          icon={Users}
          iconBg="bg-emerald-50 text-emerald-600"
          gradient="from-emerald-500 to-emerald-600"
        />
        <StatCard
          title="Pending Applications"
          value={pendingApps}
          subtitle="Awaiting allocation"
          icon={Clock}
          iconBg="bg-purple-50 text-purple-600"
          gradient="from-purple-500 to-purple-600"
        />
        <StatCard
          title="Active Complaints"
          value={openComplaints}
          subtitle="Requires attention"
          icon={AlertCircle}
          iconBg="bg-rose-50 text-rose-600"
          gradient="from-rose-500 to-rose-600"
        />
      </div>

      {/* Split Grid: Pending Applications & Active Complaints */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Applications waiting for room assignment */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-soft p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-display">
                  Pending Room Applications
                </h2>
                <p className="text-xs text-slate-500">Student requests requiring room allotment</p>
              </div>
              <Link to="/hostel/applications" className="text-xs font-semibold text-amber-600 hover:underline">
                View All →
              </Link>
            </div>

            {hostelApplications.filter((a) => a.status === 'Pending').length > 0 ? (
              <div className="space-y-3">
                {hostelApplications
                  .filter((a) => a.status === 'Pending')
                  .slice(0, 3)
                  .map((app) => (
                    <div
                      key={app.id}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs sm:text-sm text-slate-900">{app.studentName}</span>
                          <span className="font-mono text-xs text-slate-400">({app.rollNumber})</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Preference: <strong className="text-slate-700">{app.preferredType}</strong> • {app.preferredBlock}
                        </p>
                      </div>

                      <Link
                        to="/hostel/applications"
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-xl shadow-sm transition text-center"
                      >
                        Assign Room
                      </Link>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="py-8 text-center bg-slate-50 rounded-xl border border-slate-100">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="font-bold text-xs text-slate-700">All applications processed!</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Complaints Desk */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-soft p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-display">
                Urgent Maintenance Tickets
              </h2>
              <p className="text-xs text-slate-500">Student reported issues</p>
            </div>
            <Link to="/hostel/complaints" className="text-xs font-semibold text-amber-600 hover:underline">
              Desk →
            </Link>
          </div>

          <div className="space-y-3">
            {hostelComplaints.slice(0, 3).map((c) => (
              <div key={c.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Room {c.roomNo}</span>
                  <Badge variant={c.status === 'Resolved' ? 'success' : c.status === 'In Progress' ? 'warning' : 'danger'} size="xs">
                    {c.status}
                  </Badge>
                </div>
                <p className="font-medium text-slate-700">{c.title}</p>
                <p className="text-[11px] text-slate-400">{c.submittedDate}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
