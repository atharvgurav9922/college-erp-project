import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { Badge } from '../../components/common/Badge';
import { Calendar, Clock, MapPin, User, BookOpen } from 'lucide-react';

export const StudentTimetable = () => {
  const { timetable } = useERP();
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const [selectedDay, setSelectedDay] = useState('Monday');

  const activeSlots = timetable[selectedDay] || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Academic Timetable</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Weekly class schedule, lecture rooms, and faculty slots • B.Tech CSE Semester 6
          </p>
        </div>

        <Badge variant="primary" className="self-start sm:self-auto">
          Spring 2026 Term
        </Badge>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-soft">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`flex-1 min-w-[100px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition text-center ${
              selectedDay === day
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Slots Timeline for selected day */}
      <div className="space-y-3">
        {activeSlots.map((slot, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-200 hover:shadow-md transition-all group"
          >
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Clock className="w-6 h-6" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                    Period {index + 1}
                  </span>
                  <span className="text-xs text-slate-400 font-medium font-mono">{slot.time}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 font-display mt-1">
                  {slot.subject}
                </h3>
                <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-medium">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {slot.faculty}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                    {slot.room}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <Badge variant="primary" size="sm">
                Scheduled
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
