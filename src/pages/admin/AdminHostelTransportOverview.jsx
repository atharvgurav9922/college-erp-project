import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import {
  BedDouble,
  Bus,
  Users,
  AlertCircle,
  MapPin,
  Phone,
  ShieldCheck,
  CheckCircle,
  Clock,
  Compass
} from 'lucide-react';

export const AdminHostelTransportOverview = () => {
  const { hostelRooms, hostelApplications, hostelComplaints, buses, routes, transportApplications } = useERP();
  const [activeTab, setActiveTab] = useState('hostel'); // 'hostel' | 'transport'

  // Hostel stats
  const totalCapacity = hostelRooms.reduce((sum, r) => sum + r.capacity, 0);
  const totalOccupied = hostelRooms.reduce((sum, r) => sum + r.occupied, 0);
  const availableRooms = hostelRooms.filter((r) => r.status === 'Available').length;
  const pendingHostelApps = hostelApplications.filter((a) => a.status === 'Pending').length;
  const openComplaints = hostelComplaints.filter((c) => c.status !== 'Resolved').length;

  // Transport stats
  const totalSeats = buses.reduce((sum, b) => sum + b.capacity, 0);
  const totalRiders = buses.reduce((sum, b) => sum + b.occupiedSeats, 0);
  const activeBuses = buses.filter((b) => b.status === 'Active').length;
  const pendingTransportApps = transportApplications.filter((a) => a.status === 'Pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-display">
          Campus Infrastructure & Logistics Overview
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          High-level administrative monitoring of residential hostels and transit fleet
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('hostel')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition ${
            activeTab === 'hostel'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <BedDouble className="w-4 h-4" />
          Hostel Infrastructure ({hostelRooms.length} Rooms)
        </button>

        <button
          onClick={() => setActiveTab('transport')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition ${
            activeTab === 'transport'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Bus className="w-4 h-4" />
          Transport & Fleet ({buses.length} Buses)
        </button>
      </div>

      {/* HOSTEL TAB */}
      {activeTab === 'hostel' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Hostel KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Capacity"
              value={`${totalOccupied} / ${totalCapacity}`}
              subtitle="Beds occupied"
              icon={Users}
              trend={`${Math.round((totalOccupied / totalCapacity) * 100)}%`}
              trendLabel="occupancy rate"
              iconBg="bg-indigo-50 text-indigo-600"
              gradient="from-indigo-500 to-indigo-600"
            />
            <StatCard
              title="Available Rooms"
              value={`${availableRooms} Rooms`}
              subtitle="Vacancies open"
              icon={BedDouble}
              iconBg="bg-emerald-50 text-emerald-600"
              gradient="from-emerald-500 to-emerald-600"
            />
            <StatCard
              title="Pending Applications"
              value={pendingHostelApps}
              subtitle="Awaiting warden approval"
              icon={Clock}
              iconBg="bg-amber-50 text-amber-600"
              gradient="from-amber-500 to-amber-600"
            />
            <StatCard
              title="Active Complaints"
              value={openComplaints}
              subtitle="Open / In progress"
              icon={AlertCircle}
              iconBg="bg-rose-50 text-rose-600"
              gradient="from-rose-500 to-rose-600"
            />
          </div>

          {/* Rooms Grid Preview */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-display">
                  Campus Hostel Blocks & Rooms
                </h2>
                <p className="text-xs text-slate-500">Live room occupancy status</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {hostelRooms.map((room) => (
                <div
                  key={room.id}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between transition ${
                    room.status === 'Occupied'
                      ? 'bg-slate-50 border-slate-200'
                      : room.status === 'Available'
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-amber-50/50 border-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-800 font-mono">{room.roomNo}</span>
                    <Badge
                      variant={
                        room.status === 'Occupied'
                          ? 'default'
                          : room.status === 'Available'
                          ? 'success'
                          : 'warning'
                      }
                      size="xs"
                    >
                      {room.status}
                    </Badge>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500">
                    <p className="font-medium truncate">{room.type}</p>
                    <p className="text-slate-400 font-semibold mt-1">
                      {room.occupied}/{room.capacity} Beds
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TRANSPORT TAB */}
      {activeTab === 'transport' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Transport KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Transit Fleet"
              value={`${activeBuses} / ${buses.length}`}
              subtitle="Active university buses"
              icon={Bus}
              iconBg="bg-cyan-50 text-cyan-600"
              gradient="from-cyan-500 to-cyan-600"
            />
            <StatCard
              title="Fleet Capacity"
              value={`${totalRiders} / ${totalSeats}`}
              subtitle="Total seats utilized"
              icon={Users}
              trend={`${Math.round((totalRiders / totalSeats) * 100)}%`}
              trendLabel="ridership"
              iconBg="bg-indigo-50 text-indigo-600"
              gradient="from-indigo-500 to-indigo-600"
            />
            <StatCard
              title="Active Routes"
              value={`${routes.length} Routes`}
              subtitle="Covering metropolitan area"
              icon={MapPin}
              iconBg="bg-emerald-50 text-emerald-600"
              gradient="from-emerald-500 to-emerald-600"
            />
            <StatCard
              title="Pending Pass Requests"
              value={pendingTransportApps}
              subtitle="Awaiting pass issuance"
              icon={Clock}
              iconBg="bg-amber-50 text-amber-600"
              gradient="from-amber-500 to-amber-600"
            />
          </div>

          {/* Buses Fleet Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-5 sm:p-6">
            <h2 className="text-base font-bold text-slate-900 font-display mb-4">
              Fleet Roster & Routes
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[11px]">
                    <th className="pb-3">Bus No</th>
                    <th className="pb-3">Registration</th>
                    <th className="pb-3">Assigned Route</th>
                    <th className="pb-3">Driver & Contact</th>
                    <th className="pb-3">Capacity</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {buses.map((bus) => (
                    <tr key={bus.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3 font-bold text-slate-900 font-mono">{bus.busNo}</td>
                      <td className="py-3 text-slate-600 text-xs">{bus.regNumber}</td>
                      <td className="py-3 text-slate-700 font-medium">{bus.assignedRoute}</td>
                      <td className="py-3">
                        <div className="text-xs">
                          <p className="font-semibold text-slate-800">{bus.driverName}</p>
                          <p className="text-slate-400">{bus.driverPhone}</p>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="font-semibold text-slate-700">
                          {bus.occupiedSeats} / {bus.capacity}
                        </span>
                      </td>
                      <td className="py-3">
                        <Badge
                          variant={
                            bus.status === 'Active'
                              ? 'success'
                              : bus.status === 'Maintenance'
                              ? 'warning'
                              : 'default'
                          }
                          size="xs"
                        >
                          {bus.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
