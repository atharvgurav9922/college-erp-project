import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../../components/common/Badge';
import { AlertCircle, CheckCircle2, Clock, Wrench, Search, Filter } from 'lucide-react';

export const HostelComplaints = () => {
  const { hostelComplaints, updateHostelComplaintStatus } = useERP();
  const { addToast } = useToast();

  const [activeStatus, setActiveStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredComplaints = hostelComplaints.filter((c) => {
    const matchesStatus = activeStatus === 'ALL' || c.status === activeStatus;
    const matchesSearch =
      searchTerm.trim() === '' ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.roomNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = (complaintId, newStatus) => {
    updateHostelComplaintStatus(complaintId, newStatus);
    addToast(`Ticket status updated to "${newStatus}"`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-display">Student Maintenance & Complaints Desk</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review, assign maintenance personnel, and resolve room defects reported by hostellers
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft">
        <div className="flex flex-wrap gap-1.5">
          {['ALL', 'Open', 'In Progress', 'Resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setActiveStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeStatus === st
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st === 'ALL' ? 'All Tickets' : st}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tickets by room, title, student..."
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {filteredComplaints.length > 0 ? (
          filteredComplaints.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-soft space-y-3 hover:shadow-md transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Room {c.roomNo}
                    </span>
                    <Badge variant="primary" size="xs">{c.category}</Badge>
                    <Badge
                      variant={c.priority === 'Urgent' ? 'danger' : c.priority === 'High' ? 'warning' : 'default'}
                      size="xs"
                    >
                      {c.priority} Priority
                    </Badge>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 font-display mt-1.5">
                    {c.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-slate-400 font-medium">Status:</span>
                  <select
                    value={c.status}
                    onChange={(e) => handleStatusChange(c.id, e.target.value)}
                    className="text-xs font-bold bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-1.5 outline-none cursor-pointer"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {c.description}
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
                <span>
                  Reported by: <strong className="text-slate-700">{c.studentName}</strong> ({c.rollNumber})
                </span>
                <span>Submitted: {c.submittedDate}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-bold text-slate-700">No complaints matching filter</p>
          </div>
        )}
      </div>
    </div>
  );
};
