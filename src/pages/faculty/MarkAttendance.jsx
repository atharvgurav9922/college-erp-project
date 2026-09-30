import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../../components/common/Badge';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  Calendar,
  BookOpen,
  Users,
  CheckCheck,
  Save,
  Clock
} from 'lucide-react';

export const MarkAttendance = () => {
  const { students, submitAttendanceBatch } = useERP();
  const { addToast } = useToast();

  const [selectedSubject, setSelectedSubject] = useState('CS601');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const subjectList = [
    { code: 'CS601', name: 'Database Systems' },
    { code: 'CS603', name: 'Computer Networks' },
    { code: 'CS605', name: 'Web Architectures & Cloud' }
  ];

  // Map of studentId -> 'Present' | 'Absent' | 'Late'
  const [attendanceMap, setAttendanceMap] = useState(() => {
    const initial = {};
    students.forEach((s) => {
      initial[s.id] = 'Present';
    });
    return initial;
  });

  const handleToggleStatus = (studentId, status) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleMarkAll = (status) => {
    const updated = {};
    students.forEach((s) => {
      updated[s.id] = status;
    });
    setAttendanceMap(updated);
    addToast(`Marked all students as ${status}`, 'info');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitAttendanceBatch({
      subjectCode: selectedSubject,
      date: selectedDate,
      attendanceMap
    });

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
    } catch (e) {}

    addToast(`Attendance saved successfully for ${selectedSubject} on ${selectedDate}!`, 'success');
  };

  // Tallies
  const total = students.length;
  const presentCount = Object.values(attendanceMap).filter((v) => v === 'Present').length;
  const absentCount = Object.values(attendanceMap).filter((v) => v === 'Absent').length;
  const attendanceRate = total ? Math.round((presentCount / total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Mark Student Attendance</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Record lecture participation for your assigned engineering courses
          </p>
        </div>
      </div>

      {/* Control Bar: Subject & Date selector + quick batch actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Subject Dropdown */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Select Course
            </label>
            <div className="relative">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="text-xs sm:text-sm bg-slate-50 border border-slate-200 text-slate-800 font-semibold rounded-xl px-3 py-2 pr-8 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none cursor-pointer"
              >
                {subjectList.map((sub) => (
                  <option key={sub.code} value={sub.code}>
                    {sub.code}: {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Lecture Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-xs sm:text-sm bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-xl px-3 py-2 outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Quick batch mark actions */}
        <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0">
          <button
            type="button"
            onClick={() => handleMarkAll('Present')}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-xl border border-emerald-200 transition"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark All Present
          </button>
          <button
            type="button"
            onClick={() => handleMarkAll('Absent')}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl border border-rose-200 transition"
          >
            <XCircle className="w-3.5 h-3.5" />
            Mark All Absent
          </button>
        </div>
      </div>

      {/* Live Attendance Stats Ticker */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft">
          <span className="text-xs font-semibold text-slate-400">Total Enrolled</span>
          <p className="text-xl font-bold text-slate-900 mt-1">{total} Students</p>
        </div>
        <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200/60 shadow-soft">
          <span className="text-xs font-semibold text-emerald-600">Present</span>
          <p className="text-xl font-bold text-emerald-700 mt-1">{presentCount}</p>
        </div>
        <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-200/60 shadow-soft">
          <span className="text-xs font-semibold text-rose-600">Absent</span>
          <p className="text-xl font-bold text-rose-700 mt-1">{absentCount}</p>
        </div>
        <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-200/60 shadow-soft">
          <span className="text-xs font-semibold text-indigo-600">Attendance Rate</span>
          <p className="text-xl font-bold text-indigo-700 mt-1">{attendanceRate}%</p>
        </div>
      </div>

      {/* Attendance Roster Table */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-display">Student Attendance Roster</h2>
            <p className="text-xs text-slate-500 mt-0.5">Toggle status for each individual student</p>
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-emerald-600/30 transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Save Attendance
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-semibold uppercase text-[11px]">
              <tr>
                <th className="px-6 py-3.5">Roll No</th>
                <th className="px-6 py-3.5">Student Name</th>
                <th className="px-6 py-3.5">Department</th>
                <th className="px-6 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((student) => {
                const currentStatus = attendanceMap[student.id] || 'Present';
                return (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-mono font-bold text-slate-700 text-xs">
                      {student.rollNumber}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <span>{student.name}</span>
                        <p className="text-[11px] text-slate-400 font-normal">{student.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-xs">{student.department}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(student.id, 'Present')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                            currentStatus === 'Present'
                              ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/30'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Present
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(student.id, 'Absent')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                            currentStatus === 'Absent'
                              ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-600/30'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Attendance updates are dynamically reflected in student dashboards.
          </span>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-emerald-600/30 transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Submit Attendance
          </button>
        </div>
      </form>
    </div>
  );
};
