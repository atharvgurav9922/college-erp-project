import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useERP } from '../../context/ERPContext';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { Link } from 'react-router-dom';
import {
  Bus,
  MapPin,
  Users,
  Clock,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Fuel,
  Phone
} from 'lucide-react';

export const TransportDashboard = () => {
  const { currentUser } = useAuth();
  const { buses, routes, transportApplications, students } = useERP();

  // Metrics
  const totalBuses = buses.length;
  const activeBuses = buses.filter((b) => b.status === 'Active').length;
  const totalSeats = buses.reduce((sum, b) => sum + b.capacity, 0);
  const occupiedSeats = buses.reduce((sum, b) => sum + b.occupiedSeats, 0);
  const ridershipPct = totalSeats ? Math.round((occupiedSeats / totalSeats) * 100) : 0;

  const pendingApps = transportApplications.filter((a) => a.status === 'Pending').length;
  const assignedStudents = students.filter((s) => s.transportStatus === 'Allocated');

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-cyan-900 via-sky-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-cyan-800/40 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <Badge variant="info" className="mb-3 bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
            Transport & Fleet Logistics Portal
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display">
            Transit Fleet Operations
          </h1>
          <p className="mt-2 text-cyan-100/80 text-sm leading-relaxed">
            Managing university bus fleets, scheduled metropolitan transit routes, driver allocations, and student transport passes.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/transport/applications"
              className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs sm:text-sm font-semibold rounded-xl transition shadow-md shadow-cyan-600/30"
            >
              <FileText className="w-4 h-4" />
              Review Pass Requests ({pendingApps} Pending)
            </Link>
            <Link
              to="/transport/buses"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-white text-xs sm:text-sm font-semibold rounded-xl border border-cyan-700/40 transition"
            >
              <Bus className="w-4 h-4" />
              Manage Fleet & Buses
            </Link>
          </div>
        </div>

        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Buses"
          value={totalBuses}
          subtitle={`${activeBuses} Active in service`}
          icon={Bus}
          iconBg="bg-cyan-50 text-cyan-600"
          gradient="from-cyan-500 to-cyan-600"
        />
        <StatCard
          title="Fleet Ridership"
          value={`${occupiedSeats} / ${totalSeats}`}
          subtitle={`${ridershipPct}% Capacity utilized`}
          icon={Users}
          trend={`${totalSeats - occupiedSeats} Seats`}
          trendLabel="available"
          iconBg="bg-indigo-50 text-indigo-600"
          gradient="from-indigo-500 to-indigo-600"
        />
        <StatCard
          title="Active Routes"
          value={routes.length}
          subtitle="City-wide transit"
          icon={MapPin}
          iconBg="bg-emerald-50 text-emerald-600"
          gradient="from-emerald-500 to-emerald-600"
        />
        <StatCard
          title="Pass Holders"
          value={assignedStudents.length}
          subtitle="Registered commuters"
          icon={ShieldCheck}
          iconBg="bg-purple-50 text-purple-600"
          gradient="from-purple-500 to-purple-600"
        />
        <StatCard
          title="Pending Applications"
          value={pendingApps}
          subtitle="Awaiting pass issue"
          icon={Clock}
          iconBg="bg-amber-50 text-amber-600"
          gradient="from-amber-500 to-amber-600"
        />
      </div>

      {/* Split Grid: Fleet Status & Pending Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Fleet List */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-soft p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-display">
                Active Transit Fleet
              </h2>
              <p className="text-xs text-slate-500">Real-time bus occupancy & drivers</p>
            </div>
            <Link to="/transport/buses" className="text-xs font-semibold text-cyan-600 hover:underline">
              View All Buses →
            </Link>
          </div>

          <div className="space-y-3">
            {buses.map((bus) => (
              <div
                key={bus.id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-100/60 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-800 font-bold text-xs flex items-center justify-center shrink-0">
                    <Bus className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-mono">{bus.busNo}</h4>
                      <Badge variant={bus.status === 'Active' ? 'success' : 'warning'} size="xs">
                        {bus.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{bus.assignedRoute}</p>
                  </div>
                </div>

                <div className="text-left sm:text-right text-xs">
                  <p className="font-bold text-slate-700">{bus.occupiedSeats} / {bus.capacity} Seats</p>
                  <p className="text-[11px] text-slate-400">Driver: {bus.driverName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Pending Applications */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-soft p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-display">
                  Pending Pass Requests
                </h2>
                <p className="text-xs text-slate-500">Student commuter applications</p>
              </div>
              <Link to="/transport/applications" className="text-xs font-semibold text-cyan-600 hover:underline">
                Process →
              </Link>
            </div>

            {transportApplications.filter((a) => a.status === 'Pending').length > 0 ? (
              <div className="space-y-3">
                {transportApplications
                  .filter((a) => a.status === 'Pending')
                  .slice(0, 3)
                  .map((app) => (
                    <div key={app.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{app.studentName}</span>
                        <span className="font-mono text-[11px] text-slate-400">{app.rollNumber}</span>
                      </div>
                      <p className="text-slate-600">{app.preferredRoute}</p>
                      <p className="text-[11px] text-slate-400">Stop: {app.preferredStop}</p>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="py-8 text-center bg-slate-50 rounded-xl border border-slate-100">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="font-bold text-xs text-slate-700">All pass requests processed!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
