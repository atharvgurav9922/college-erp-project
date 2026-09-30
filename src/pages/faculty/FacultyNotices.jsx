import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { Badge } from '../../components/common/Badge';
import { Bell, Pin, Calendar, User, Search } from 'lucide-react';

export const FacultyNotices = () => {
  const { notices } = useERP();
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['ALL', 'Academics', 'Events', 'Faculty', 'Hostel', 'Transport'];

  const filteredNotices = notices.filter((n) => {
    const matchesCategory = activeCategory === 'ALL' || n.category === activeCategory;
    const matchesSearch =
      searchTerm.trim() === '' ||
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-display">Faculty Notice Board</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Official academic circulars, exam schedules, and university announcements
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeCategory === cat
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat === 'ALL' ? 'All Notices' : cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search circulars..."
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.map((notice) => (
          <div
            key={notice.id}
            className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all ${
              notice.pinned
                ? 'border-emerald-200 shadow-md bg-gradient-to-r from-white via-emerald-50/20 to-white'
                : 'border-slate-200/80 shadow-soft hover:shadow-md'
            }`}
          >
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                {notice.pinned && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    <Pin className="w-3 h-3" /> Pinned
                  </span>
                )}
                <Badge variant="success" size="xs">
                  {notice.category}
                </Badge>
                <span className="text-[11px] text-slate-400 font-medium">
                  Audience: <strong className="text-slate-600">{notice.target}</strong>
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 font-display">
                {notice.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {notice.content}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
              <span className="flex items-center gap-1.5 font-medium">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Issued by: <span className="text-slate-700">{notice.author}</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {notice.date}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
