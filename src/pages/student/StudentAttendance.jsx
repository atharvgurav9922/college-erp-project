import React from 'react';
import { useERP } from '../../context/ERPContext';
import { Badge } from '../../components/common/Badge';
import { CheckSquare, AlertTriangle, CheckCircle2, XCircle, Calendar, BookOpen } from 'lucide-react';

export const StudentAttendance = () => {
  const { studentAttendance } = useERP();

  const totalLectures = studentAttendance.reduce((sum, s) => sum + s.totalClasses, 0);
  const attendedLectures = studentAttendance.reduce((sum, s) => sum + s.attendedClasses, 0);
  const overallPct = totalLectures ? ((attendedLectures / totalLectures) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">My Attendance Record</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Subject-wise attendance, minimum 75% examination compliance tracker
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-semibold text-slate-400 block">Overall Score</span>
            <span className="text-2xl font-extrabold text-slate-900 font-display">{overallPct}%</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600 font-bold">
            <CheckSquare className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 75% Requirement Alert */}
      <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
        <div className="text-xs text-emerald-800">
          <span className="font-bold">Exam Eligibility Status: Approved.</span> You are currently maintaining an overall attendance of <strong>{overallPct}%</strong>, exceeding the mandatory 75% university prerequisite.
        </div>
      </div>

      {/* Subject-wise Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {studentAttendance.map((item) => {
          const isHigh = item.percentage >= 85;
          const isWarning = item.percentage < 75;

          return (
            <div
              key={item.subjectCode}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-5 sm:p-6 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-100 rounded text-slate-700">
                      {item.subjectCode}
                    </span>
                    <Badge variant={isHigh ? 'success' : isWarning ? 'danger' : 'primary'} size="xs">
                      {item.percentage >= 75 ? 'Safe' : 'Warning'}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mt-1 font-display">
                    {item.subjectName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{item.faculty}</p>
                </div>

                <div className="text-right">
                  <span className={`text-2xl font-extrabold font-display ${isHigh ? 'text-emerald-600' : isWarning ? 'text-rose-600' : 'text-indigo-600'}`}>
                    {item.percentage}%
                  </span>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    {item.attendedClasses} / {item.totalClasses} Attended
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isHigh ? 'bg-emerald-500' : isWarning ? 'bg-rose-500' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>0%</span>
                  <span className="text-slate-600 font-bold">75% (Min Req)</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Recent Attendance Logs */}
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Recent Lecture Logs
                </h4>
                <div className="flex flex-wrap gap-2">
                  {item.recentLogs?.map((log, idx) => (
                    <div
                      key={idx}
                      className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 ${
                        log.status === 'Present'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {log.status === 'Present' ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <XCircle className="w-3 h-3 text-rose-600" />
                      )}
                      <span>{log.date.slice(5)}</span>
                      <span className="text-[10px] uppercase font-bold">({log.status.charAt(0)})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
