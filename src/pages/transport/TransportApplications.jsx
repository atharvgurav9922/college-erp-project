import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import { DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { CheckCircle2, XCircle, Bus, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';

export const TransportApplications = () => {
  const { transportApplications, buses, routes, approveTransportApplication, rejectTransportApplication } = useERP();
  const { addToast } = useToast();

  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  const [assignedBusNo, setAssignedBusNo] = useState(buses[0]?.busNo || 'Bus-01');
  const [assignedStop, setAssignedStop] = useState('');
  const [rejectionReason, setRejectionReason] = useState('Selected transit route is currently at full passenger capacity.');

  const handleOpenApprove = (app) => {
    setSelectedApp(app);
    setAssignedStop(app.preferredStop || 'Designated Terminal');
    setIsApproveModalOpen(true);
  };

  const handleOpenReject = (app) => {
    setSelectedApp(app);
    setIsRejectModalOpen(true);
  };

  const handleConfirmApproval = (e) => {
    e.preventDefault();
    if (!selectedApp || !assignedBusNo) return;

    approveTransportApplication(selectedApp.id, assignedBusNo, assignedStop);
    setIsApproveModalOpen(false);

    try {
      confetti({ particleCount: 50, spread: 60 });
    } catch (e) {}

    addToast(`Bus pass approved for ${selectedApp.studentName}. Allocated ${assignedBusNo}!`, 'success');
  };

  const handleConfirmRejection = (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    rejectTransportApplication(selectedApp.id, rejectionReason);
    setIsRejectModalOpen(false);
    addToast(`Declined bus pass request for ${selectedApp.studentName}`, 'info');
  };

  const columns = [
    {
      header: 'Student Name',
      accessor: 'studentName',
      render: (row) => (
        <div>
          <p className="font-bold text-slate-900">{row.studentName}</p>
          <p className="font-mono text-xs text-slate-500">{row.rollNumber}</p>
        </div>
      )
    },
    {
      header: 'Department',
      accessor: 'department',
      render: (row) => <span className="text-xs text-slate-600 font-medium">{row.department}</span>
    },
    {
      header: 'Requested Route',
      accessor: 'preferredRoute',
      render: (row) => (
        <div>
          <Badge variant="info" size="xs">{row.preferredRoute}</Badge>
          <p className="text-[11px] text-slate-400 mt-0.5">Stop: {row.preferredStop}</p>
        </div>
      )
    },
    {
      header: 'Commute Reason',
      accessor: 'reason',
      render: (row) => (
        <p className="text-xs text-slate-600 max-w-xs truncate" title={row.reason}>
          {row.reason}
        </p>
      )
    },
    {
      header: 'Applied Date',
      accessor: 'appliedDate',
      render: (row) => <span className="text-xs text-slate-500 font-medium">{row.appliedDate}</span>
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <Badge
          variant={row.status === 'Approved' ? 'success' : row.status === 'Rejected' ? 'danger' : 'warning'}
        >
          {row.status === 'Approved' ? `Approved (${row.assignedBus || 'Bus'})` : row.status}
        </Badge>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.status === 'Pending' ? (
            <>
              <button
                onClick={() => handleOpenApprove(row)}
                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-200 transition"
              >
                Approve & Allocate
              </button>
              <button
                onClick={() => handleOpenReject(row)}
                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg border border-rose-200 transition"
              >
                Reject
              </button>
            </>
          ) : (
            <span className="text-xs text-slate-400 font-medium">Processed</span>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-display">Bus Pass Applications</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Approve student transit passes and allocate seat slots on university shuttles
        </p>
      </div>

      <DataTable
        title="Incoming Transit Requests"
        subtitle={`Total of ${transportApplications.length} applications logged`}
        columns={columns}
        data={transportApplications}
        searchPlaceholder="Search by student name, roll no, route..."
        searchKeys={['studentName', 'rollNumber', 'preferredRoute', 'status']}
        filterOptions={[
          {
            label: 'Status',
            key: 'status',
            options: ['Pending', 'Approved', 'Rejected']
          }
        ]}
      />

      {/* Approve & Assign Bus Modal */}
      <Modal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        title="Approve Bus Pass"
        subtitle={`Allocate transit seat for ${selectedApp?.studentName} (${selectedApp?.rollNumber})`}
      >
        <form onSubmit={handleConfirmApproval} className="space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
            <p><strong>Requested Route:</strong> {selectedApp?.preferredRoute}</p>
            <p><strong>Requested Pickup:</strong> {selectedApp?.preferredStop}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Bus to Assign *
            </label>
            <select
              value={assignedBusNo}
              onChange={(e) => setAssignedBusNo(e.target.value)}
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none"
            >
              {buses.map((b) => (
                <option key={b.id} value={b.busNo}>
                  {b.busNo} ({b.assignedRoute} • {b.occupiedSeats}/{b.capacity} Seats)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Confirmed Pickup Point *
            </label>
            <input
              type="text"
              required
              value={assignedStop}
              onChange={(e) => setAssignedStop(e.target.value)}
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsApproveModalOpen(false)}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md shadow-emerald-600/30 transition cursor-pointer"
            >
              Issue Bus Pass
            </button>
          </div>
        </form>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Reject Pass Application"
        subtitle={`Decline request for ${selectedApp?.studentName}`}
      >
        <form onSubmit={handleConfirmRejection} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reason for Rejection *
            </label>
            <textarea
              rows={3}
              required
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-rose-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsRejectModalOpen(false)}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs sm:text-sm font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-md shadow-rose-600/30 transition cursor-pointer"
            >
              Reject Application
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
