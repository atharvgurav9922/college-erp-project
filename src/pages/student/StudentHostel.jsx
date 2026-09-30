import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import confetti from 'canvas-confetti';
import {
  BedDouble,
  Building,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Send,
  Wifi,
  Coffee,
  Shield,
  FileText
} from 'lucide-react';

export const StudentHostel = () => {
  const { currentUser } = useAuth();
  const { hostelApplications, applyHostel, addHostelComplaint, hostelComplaints } = useERP();
  const { addToast } = useToast();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);

  // Application form
  const [appForm, setAppForm] = useState({
    preferredType: 'Double AC',
    preferredBlock: 'Block A (Boys)',
    reason: 'Campus resident semester renewal. Distance from hometown exceeds 60km.'
  });

  // Complaint form
  const [complaintForm, setComplaintForm] = useState({
    category: 'Air Conditioning',
    title: '',
    description: '',
    priority: 'Medium'
  });

  const myApplication = hostelApplications.find(
    (a) => a.studentId === (currentUser?.id || 'STU-001')
  );

  const isAllocated = currentUser?.hostelStatus === 'Allocated' || myApplication?.status === 'Approved';
  const assignedRoomNo = myApplication?.assignedRoom || currentUser?.hostelDetails?.roomNo || 'A-304';

  const handleApplyHostel = (e) => {
    e.preventDefault();
    applyHostel({
      studentId: currentUser?.id || 'STU-001',
      studentName: currentUser?.name || 'Alex Rivera',
      rollNumber: currentUser?.rollNumber || '2022-CSE-045',
      department: currentUser?.department || 'Computer Science & Engineering',
      gender: 'Male',
      preferredType: appForm.preferredType,
      preferredBlock: appForm.preferredBlock,
      reason: appForm.reason
    });

    setIsApplyModalOpen(false);
    try {
      confetti({ particleCount: 50, spread: 60 });
    } catch (e) {}
    addToast('Hostel application submitted to Chief Warden for review!', 'success');
  };

  const handleLodgeComplaint = (e) => {
    e.preventDefault();
    if (!complaintForm.title || !complaintForm.description) {
      addToast('Please provide complaint title and description', 'error');
      return;
    }
    addHostelComplaint({
      studentName: currentUser?.name || 'Alex Rivera',
      rollNumber: currentUser?.rollNumber || '2022-CSE-045',
      roomNo: assignedRoomNo,
      category: complaintForm.category,
      title: complaintForm.title,
      description: complaintForm.description,
      priority: complaintForm.priority
    });
    setIsComplaintModalOpen(false);
    setComplaintForm({ category: 'Air Conditioning', title: '', description: '', priority: 'Medium' });
    addToast('Maintenance complaint registered with Hostel Warden office', 'success');
  };

  const myComplaints = hostelComplaints.filter(
    (c) => c.rollNumber === (currentUser?.rollNumber || '2022-CSE-045')
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Hostel & Residential Life</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Room allocation, amenities, curfew regulations, and maintenance tickets
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isAllocated ? (
            <button
              onClick={() => setIsComplaintModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs sm:text-sm font-semibold rounded-xl transition cursor-pointer"
            >
              <AlertCircle className="w-4 h-4" />
              Lodge Room Complaint
            </button>
          ) : (
            <button
              onClick={() => setIsApplyModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-indigo-600/30 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Apply for Hostel Room
            </button>
          )}
        </div>
      </div>

      {/* Main Room Card or Application Status */}
      {isAllocated ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Allocated Room Dossier */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 shadow-soft p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-2xl">
                  <BedDouble className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Room {assignedRoomNo}
                    </span>
                    <Badge variant="success">Allocated</Badge>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 font-display mt-1">
                    {currentUser?.hostelDetails?.block || 'Block A (Aryabhata Boys Hostel)'}
                  </h2>
                  <p className="text-xs text-slate-500">Floor 3 • Double Occupancy Air-Conditioned</p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-slate-400 block font-medium">Bed Assignment</span>
                <span className="text-base font-bold text-slate-800">Bed No: 01</span>
              </div>
            </div>

            {/* Room Features */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                <Wifi className="w-5 h-5 text-indigo-600 shrink-0" />
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Wi-Fi</span>
                  <span className="text-xs font-bold text-slate-800">CampusMesh-A</span>
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                <Coffee className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Mess Plan</span>
                  <span className="text-xs font-bold text-slate-800">Standard 4-Meal</span>
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                <Clock className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Night Curfew</span>
                  <span className="text-xs font-bold text-slate-800">10:00 PM</span>
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                <Shield className="w-5 h-5 text-indigo-600 shrink-0" />
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Warden Office</span>
                  <span className="text-xs font-bold text-slate-800">Ground Floor</span>
                </div>
              </div>
            </div>

            {/* Mess Schedule & Regulations */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 font-display">Daily Mess Timings</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-700 block">Breakfast</span>
                  <span className="text-slate-500 mt-0.5 block">07:30 AM - 09:00 AM</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-700 block">Lunch</span>
                  <span className="text-slate-500 mt-0.5 block">12:30 PM - 02:00 PM</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-700 block">Dinner</span>
                  <span className="text-slate-500 mt-0.5 block">07:30 PM - 09:30 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Active Maintenance Complaints */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 shadow-soft p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 font-display">
                  My Maintenance Tickets
                </h3>
                <span className="text-xs font-bold text-slate-500">{myComplaints.length} Filed</span>
              </div>

              <div className="space-y-3">
                {myComplaints.map((c) => (
                  <div key={c.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Badge variant="primary" size="xs">{c.category}</Badge>
                      <Badge
                        variant={c.status === 'Resolved' ? 'success' : c.status === 'In Progress' ? 'warning' : 'default'}
                        size="xs"
                      >
                        {c.status}
                      </Badge>
                    </div>
                    <p className="text-xs font-bold text-slate-800">{c.title}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{c.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsComplaintModalOpen(true)}
              className="w-full mt-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Report New Issue
            </button>
          </div>
        </div>
      ) : (
        /* Not Allocated State */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft p-8 text-center max-w-2xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <BedDouble className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              {myApplication ? 'Hostel Room Application Submitted' : 'No Active Hostel Allotment'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
              {myApplication
                ? `Your application for ${myApplication.preferredType} in ${myApplication.preferredBlock} is currently ${myApplication.status.toUpperCase()}.`
                : 'You are currently registered as a Day Scholar. You can apply for on-campus accommodation at any time.'}
            </p>
          </div>

          {myApplication && (
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 text-xs text-amber-800 text-left max-w-md mx-auto space-y-1">
              <p><strong>Application ID:</strong> {myApplication.id}</p>
              <p><strong>Preferred Type:</strong> {myApplication.preferredType}</p>
              <p><strong>Submission Date:</strong> {myApplication.appliedDate}</p>
              <p><strong>Status:</strong> <Badge variant={myApplication.status === 'Approved' ? 'success' : 'warning'}>{myApplication.status}</Badge></p>
            </div>
          )}

          {!myApplication && (
            <button
              onClick={() => setIsApplyModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition text-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Submit Hostel Application
            </button>
          )}
        </div>
      )}

      {/* Apply for Hostel Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Hostel Room Booking Application"
        subtitle="Submit your preference to the Chief Hostel Warden"
      >
        <form onSubmit={handleApplyHostel} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Hostel Block</label>
            <select
              value={appForm.preferredBlock}
              onChange={(e) => setAppForm({ ...appForm, preferredBlock: e.target.value })}
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none"
            >
              <option value="Block A (Boys)">Block A (Aryabhata Boys Hostel)</option>
              <option value="Block B (Girls)">Block B (Gargi Girls Hostel)</option>
              <option value="Block C (Deluxe PG)">Block C (International & PG Block)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Room Preference</label>
            <select
              value={appForm.preferredType}
              onChange={(e) => setAppForm({ ...appForm, preferredType: e.target.value })}
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none"
            >
              <option value="Double AC">Double Occupancy (AC)</option>
              <option value="Single Deluxe AC">Single Deluxe (AC & Attached Bath)</option>
              <option value="Double Non-AC">Double Occupancy (Non-AC)</option>
              <option value="Triple Non-AC">Triple Occupancy (Economy)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Reason / Distance Statement *</label>
            <textarea
              rows={3}
              required
              value={appForm.reason}
              onChange={(e) => setAppForm({ ...appForm, reason: e.target.value })}
              placeholder="State your domicile distance from campus or specific academic reasons..."
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

      {/* Lodge Complaint Modal */}
      <Modal
        isOpen={isComplaintModalOpen}
        onClose={() => setIsComplaintModalOpen(false)}
        title="Lodge Hostel Maintenance Complaint"
        subtitle={`Room ${assignedRoomNo} Maintenance Ticket`}
      >
        <form onSubmit={handleLodgeComplaint} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={complaintForm.category}
                onChange={(e) => setComplaintForm({ ...complaintForm, category: e.target.value })}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none"
              >
                <option value="Air Conditioning">Air Conditioning / Cooling</option>
                <option value="Electrical">Electrical / Switch / Lights</option>
                <option value="Plumbing">Plumbing / Bathroom</option>
                <option value="Wi-Fi / Internet">Wi-Fi / Internet Connectivity</option>
                <option value="Carpentry">Carpentry / Furniture</option>
                <option value="Cleanliness">Room Cleanliness & Hygiene</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
              <select
                value={complaintForm.priority}
                onChange={(e) => setComplaintForm({ ...complaintForm, priority: e.target.value })}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none"
              >
                <option value="Low">Low (Routine)</option>
                <option value="Medium">Medium (Within 24h)</option>
                <option value="Urgent">Urgent (Immediate attention)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Summary *</label>
            <input
              type="text"
              required
              value={complaintForm.title}
              onChange={(e) => setComplaintForm({ ...complaintForm, title: e.target.value })}
              placeholder="e.g. AC unit leaking condensation water"
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Description *</label>
            <textarea
              rows={3}
              required
              value={complaintForm.description}
              onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })}
              placeholder="Provide exact details of the defect or malfunction..."
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-rose-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsComplaintModalOpen(false)}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs sm:text-sm font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-md shadow-rose-600/30 transition cursor-pointer"
            >
              Submit Ticket
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
