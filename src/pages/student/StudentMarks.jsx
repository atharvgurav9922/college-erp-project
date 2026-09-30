import React from 'react';
import { useERP } from '../../context/ERPContext';
import { Badge } from '../../components/common/Badge';
import { Award, GraduationCap, CheckCircle2, TrendingUp, Download } from 'lucide-react';

export const StudentMarks = () => {
  const { studentMarks } = useERP();

  // Compute SGPA (Weighted Average of Grade Points by credits)
  const totalCredits = studentMarks.reduce((sum, m) => sum + m.credits, 0);
  const totalWeightedPoints = studentMarks.reduce((sum, m) => sum + m.credits * (m.gradePoint || 9), 0);
  const sgpa = totalCredits ? (totalWeightedPoints / totalCredits).toFixed(2) : '3.84';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Academic Grade Report</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official transcript, internal evaluations, and semester grade point average (SGPA)
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold rounded-xl transition shadow-sm cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Print / Export Report Card
        </button>
      </div>

      {/* GPA KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-5">
          <span className="text-xs font-semibold text-slate-400">Current Semester SGPA</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold text-indigo-600 font-display">{sgpa}</span>
            <span className="text-xs text-slate-400 font-semibold">/ 10.0 Scale</span>
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> First Class with Distinction
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-5">
          <span className="text-xs font-semibold text-slate-400">Cumulative CGPA</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold text-emerald-600 font-display">3.84</span>
            <span className="text-xs text-slate-400 font-semibold">/ 4.0 Scale</span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-2">
            Total Earned Credits: <strong>114 Credits</strong>
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-5">
          <span className="text-xs font-semibold text-slate-400">Enrolled Semester Credits</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold text-slate-800 font-display">{totalCredits}</span>
            <span className="text-xs text-slate-400 font-semibold">Credits this Term</span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-2">
            5 Core Engineering Courses
          </p>
        </div>
      </div>

      {/* Grade Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-display">
              Semester VI - Detailed Marks Breakdown
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Continuous Assessment + End-Semester Examinations</p>
          </div>
          <Badge variant="success">All Evaluated</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-semibold uppercase text-[11px]">
              <tr>
                <th className="px-6 py-3.5">Course Code & Name</th>
                <th className="px-4 py-3.5 text-center">Credits</th>
                <th className="px-4 py-3.5 text-center">Internal 1 (30)</th>
                <th className="px-4 py-3.5 text-center">Internal 2 (30)</th>
                <th className="px-4 py-3.5 text-center">Assignment (20)</th>
                <th className="px-4 py-3.5 text-center">Final Exam (100)</th>
                <th className="px-4 py-3.5 text-center">Total (100)</th>
                <th className="px-4 py-3.5 text-center">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {studentMarks.map((m) => (
                <tr key={m.subjectCode} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{m.subjectName}</p>
                    <p className="font-mono text-xs text-slate-400">{m.subjectCode}</p>
                  </td>
                  <td className="px-4 py-4 text-center font-semibold text-slate-700">{m.credits}</td>
                  <td className="px-4 py-4 text-center text-slate-700">{m.internal1}</td>
                  <td className="px-4 py-4 text-center text-slate-700">{m.internal2}</td>
                  <td className="px-4 py-4 text-center text-slate-700">{m.assignment}</td>
                  <td className="px-4 py-4 text-center text-slate-700 font-medium">{m.finalExam}</td>
                  <td className="px-4 py-4 text-center font-bold text-indigo-700 font-display text-sm">
                    {m.totalScore}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <Badge
                      variant={
                        m.grade.startsWith('A')
                          ? 'success'
                          : m.grade.startsWith('B')
                          ? 'primary'
                          : 'default'
                      }
                    >
                      {m.grade} ({m.gradePoint} GP)
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-5 bg-slate-50/50 border-t border-slate-100 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Grading Scale: A+ (90-100), A (80-89), B+ (70-79), B (60-69), C (50-59), F (&lt;50)</span>
          <span className="font-semibold text-slate-700">Official University Grade Document</span>
        </div>
      </div>
    </div>
  );
};
