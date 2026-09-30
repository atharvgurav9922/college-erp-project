import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import confetti from 'canvas-confetti';
import {
  Bus,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  AlertCircle,
  Plus,
  ShieldCheck,
  Compass,
  FileText
} from 'lucide-react';

export const StudentTransport = () => {
  const { currentUser } = useAuth();
  const { routes, transportApplications, applyTransport, buses } = useERP();
  const { addToast } = useToast();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState(routes[0]?.id || 'RT-01');
  const [selectedStop, setSelectedStop] = useState('');
  const [reason, setReason] = useState('Daily college commuting from North region.');

  const myApplication = transportApplications.find(
    (a) => a.studentId === (currentUser?.id || 'STU-001')
  );

  const isAllocated = currentUser?.transportStatus === 'Allocated' || myApplication?.status === 'Approved';
  const assignedBusNo = myApplication?.assignedBus || currentUser?.transportDetails?.busNo || 'Bus-04';

  const assignedBusObj = buses.find((b) => b.busNo === assignedBusNo) || buses[3];
  const assignedRouteObj = routes.find((r) => r.name.includes('North Metro')) || routes[0];

  const handleApplyTransport = (e) => {
    e.preventDefault();
    const routeObj = routes.find((r) => r.id === selectedRouteId);
    applyTransport({
      studentId: currentUser?.id || 'STU-001',
      studentName: currentUser?.name || 'Alex Rivera',
      rollNumber: currentUser?.rollNumber || '2022-CSE-045',
      department: currentUser?.department || 'Computer Science & Engineering',
      preferredRoute: routeObj?.name || 'North Metro Express',
      preferredStop: selectedStop || routeObj?.stops[0]?.name || 'Central Hub',
      reason
    });

    setIsApplyModalOpen(false);
    try {
      confetti({ particleCount: 50, spread: 60 });
    } catch (e) {}
    addToast('Bus pass application submitted to Transport Department!', 'success');
  };

  const selectedRouteObjForModal = routes.find((r) => r.id === selectedRouteId) || routes[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Campus Bus & Transit Pass</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official shuttle routes, designated pickup points, and bus pass verification
          </p>
        </div>

        {!isAllocated && (
          <button
            onClick={() => setIsApplyModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-indigo-600/30 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Apply for Bus Pass
          </button>
        )}
      </div>

      {isAllocated ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Bus Pass Digital Badge */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/80 shadow-soft p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
                  <Bus className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded border border-cyan-200">
                      {assignedBusNo}
                    </span>
                    <Badge variant="info">Digital Pass Active</Badge>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 font-display mt-1">
                    {assignedBusObj?.assignedRoute || 'Route 4: North Metro Express'}
                  </h2>
                </div>
              </div>
            </div>

            {/* Pass Metadata */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block font-medium">Designated Pickup</span>
                <span className="font-bold text-slate-800 mt-1 block">Oakwood Station (7:30 AM)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block font-medium">Evening Departure</span>
                <span className="font-bold text-slate-800 mt-1 block">Campus Gate 2 (5:30 PM)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block font-medium">Driver in Charge</span>
                <span className="font-bold text-slate-800 mt-1 block">{assignedBusObj?.driverName}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block font-medium">Driver Phone</span>
                <span className="font-bold text-slate-800 mt-1 block">{assignedBusObj?.driverPhone}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-cyan-50/50 border border-cyan-200/80 flex items-center justify-between text-xs text-cyan-900 font-semibold">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-600" />
                <span>Pass ID: TRP-2026-{currentUser?.rollNumber?.slice(-3) || '045'}</span>
              </div>
              <span className="text-[11px] text-cyan-700">Valid: Spring 2026</span>
            </div>
          </div>

          {/* Route Stops Timeline */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/80 shadow-soft p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-display">
              Route Itinerary & Stops
            </h3>
            <p className="text-xs text-slate-500">
              Morning pickup sequence • Please arrive 5 minutes prior to scheduled departure.
            </p>

            <div className="space-y-4 pt-2">
              {assignedRouteObj?.stops?.map((stop, idx) => (
                <div key={idx} className="flex items-start gap-3 relative group">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 border-2 border-indigo-500 text-indigo-600 font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 pb-3 border-b border-slate-100 last:border-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs sm:text-sm font-bold text-slate-900">{stop.name}</p>
                      <span className="text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {stop.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Not Allocated State */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft p-8 text-center max-w-2xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-cyan-50 text-cyan-600 flex items-center justify-center mx-auto">
            <Bus className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              {myApplication ? 'Bus Pass Application Submitted' : 'No Active Bus Pass'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
              {myApplication
                ? `Your application for ${myApplication.preferredRoute} is currently ${myApplication.status.toUpperCase()}.`
                : 'Apply for official university transit to commute easily from across the city.'}
            </p>
          </div>

          {myApplication && (
            <div className="p-4 rounded-2xl bg-cyan-50/50 border border-cyan-200 text-xs text-cyan-800 text-left max-w-md mx-auto space-y-1">
              <p><strong>Application ID:</strong> {myApplication.id}</p>
              <p><strong>Preferred Route:</strong> {myApplication.preferredRoute}</p>
              <p><strong>Pickup Stop:</strong> {myApplication.preferredStop}</p>
              <p><strong>Status:</strong> <Badge variant={myApplication.status === 'Approved' ? 'success' : 'warning'}>{myApplication.status}</Badge></p>
            </div>
          )}

          {!myApplication && (
            <button
              onClick={() => setIsApplyModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition text-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Apply for Bus Pass
            </button>
          )}
        </div>
      )}

      {/* Apply Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Apply for Campus Bus Pass"
        subtitle="Select your preferred route and boarding point"
      >
        <form onSubmit={handleApplyTransport} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Transit Route</label>
            <select
              value={selectedRouteId}
              onChange={(e) => {
                setSelectedRouteId(e.target.value);
                const r = routes.find((rt) => rt.id === e.target.value);
                if (r && r.stops.length > 0) setSelectedStop(r.stops[0].name);
              }}
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none"
            >
              {routes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.routeNumber}: {r.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Boarding Stop</label>
            <select
              value={selectedStop}
              onChange={(e) => setSelectedStop(e.target.value)}
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none"
            >
              {selectedRouteObjForModal?.stops?.map((st, idx) => (
                <option key={idx} value={st.name}>
                  {st.name} ({st.time})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Reason / Commute Address *</label>
            <textarea
              rows={3}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="State your residential boarding neighborhood..."
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsApplyModalOpen(false)}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md shadow-indigo-600/30 transition cursor-pointer"
            >
              Submit Application
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
