import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import { DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { CheckCircle2, XCircle, BedDouble, Calendar, User, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';

export const HostelApplications = () => {
  const { hostelApplications, hostelRooms, approveHostelApplication, rejectHostelApplication } = useERP();
  const { addToast } = useToast();

  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  // Available rooms for assignment
  const availableRooms = hostelRooms.filter((r) => r.status === 'Available' || r.occupied < r.capacity);
  const [selectedRoomNo, setSelectedRoomNo] = useState(availableRooms[0]?.roomNo || 'A-102');
  const [rejectionReason, setRejectionReason] = useState('Insufficient vacancies in requested block.');

  const handleOpenApprove = (app) => {
    setSelectedApp(app);
    if (availableRooms.length > 0) {
      setSelectedRoomNo(availableRooms[0].roomNo);
    }
    setIsApproveModalOpen(true);
  };

  const handleOpenReject = (app) => {
    setSelectedApp(app);
    setIsRejectModalOpen(true);
  };

  const handleConfirmApproval = async (e) => {
    e.preventDefault();
    if (!selectedApp || !selectedRoomNo) return;

    try {
      await approveHostelApplication(selectedApp.id || selectedApp._id, selectedRoomNo);
      setIsApproveModalOpen(false);

      try {
        confetti({ particleCount: 50, spread: 60 });
      } catch (e) {}

      addToast(`Approved application for ${selectedApp.studentName}. Assigned Room ${selectedRoomNo}!`, 'success');
    } catch (err) {
      addToast(`Failed to approve application: ${err.message}`, 'error');
    }
  };

  const handleConfirmRejection = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      await rejectHostelApplication(selectedApp.id || selectedApp._id, rejectionReason);
      setIsRejectModalOpen(false);
      addToast(`Rejected hostel request for ${selectedApp.studentName}`, 'info');
    } catch (err) {
      addToast(`Failed to reject application: ${err.message}`, 'error');
    }
  };

  const columns = [
    {
      header: 'Student Info',
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
      header: 'Requested Room',
      accessor: 'preferredType',
      render: (row) => (
        <div>
          <Badge variant="primary" size="xs">{row.preferredType}</Badge>
          <p className="text-[11px] text-slate-400 mt-0.5">{row.preferredBlock}</p>
        </div>
      )
    },
    {
      header: 'Application Reason',
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
          {row.status === 'Approved' ? `Approved (${row.assignedRoom || 'Room'})` : row.status}
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
                Approve & Assign
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
        <h1 className="text-2xl font-bold text-slate-900 font-display">Hostel Room Applications</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review incoming accommodation requests and allocate room inventory
        </p>
      </div>

      <DataTable
        title="Student Applications Roster"
        subtitle={`Total of ${hostelApplications.length} applications logged`}
        columns={columns}
        data={hostelApplications}
        searchPlaceholder="Search by student name, roll no..."
        searchKeys={['studentName', 'rollNumber', 'preferredBlock', 'preferredType', 'status']}
        filterOptions={[
          {
            label: 'Status',
            key: 'status',
            options: ['Pending', 'Approved', 'Rejected']
          }
        ]}
      />

      {/* Approve & Assign Room Modal */}
      <Modal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        title="Approve & Assign Room"
        subtitle={`Assign hostel room for ${selectedApp?.studentName} (${selectedApp?.rollNumber})`}
      >
        <form onSubmit={handleConfirmApproval} className="space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
            <p><strong>Requested Type:</strong> {selectedApp?.preferredType}</p>
            <p><strong>Requested Block:</strong> {selectedApp?.preferredBlock}</p>
            <p><strong>Reason:</strong> {selectedApp?.reason}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Available Room to Allocate *
            </label>
            <select
              value={selectedRoomNo}
              onChange={(e) => setSelectedRoomNo(e.target.value)}
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none"
            >
              {availableRooms.map((r) => (
                <option key={r.id} value={r.roomNo}>
                  Room {r.roomNo} ({r.block} • {r.type} • {r.occupied}/{r.capacity} Beds)
                </option>
              ))}
            </select>
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
              Confirm Allotment
            </button>
          </div>
        </form>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Reject Hostel Application"
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
