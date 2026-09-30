import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { Plus, Edit2, Trash2, Pin, Calendar, User, Search, Bell } from 'lucide-react';

export const NoticesManagement = () => {
  const { notices, addNotice, updateNotice, deleteNotice } = useERP();
  const { addToast } = useToast();

  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);

  const initialForm = {
    title: '',
    category: 'Academics',
    target: 'All Students & Faculty',
    content: '',
    pinned: false,
    author: 'Office of the Dean'
  };
  const [formData, setFormData] = useState(initialForm);

  const categories = ['ALL', 'Academics', 'Events', 'Hostel', 'Transport', 'Faculty'];

  const filteredNotices = notices.filter((n) => {
    const matchesCategory = activeCategory === 'ALL' || n.category === activeCategory;
    const matchesSearch =
      searchTerm.trim() === '' ||
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenAdd = () => {
    setFormData(initialForm);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (notice) => {
    setSelectedNotice(notice);
    setFormData({ ...notice });
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (notice) => {
    setSelectedNotice(notice);
    setIsDeleteModalOpen(true);
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      addToast('Please provide a title and notice content', 'error');
      return;
    }
    addNotice(formData);
    setIsAddModalOpen(false);
    addToast('Notice published successfully across all student and faculty portals!', 'success');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!selectedNotice) return;
    updateNotice(selectedNotice.id, formData);
    setIsEditModalOpen(false);
    addToast('Notice updated successfully', 'success');
  };

  const handleConfirmDelete = () => {
    if (!selectedNotice) return;
    deleteNotice(selectedNotice.id);
    addToast('Notice archived and removed', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Campus Notices & Circulars</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Broadcast official announcements, academic schedules, hostel & fleet advisories
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl transition shadow-md shadow-indigo-600/30"
        >
          <Plus className="w-4 h-4" />
          Publish Notice
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat === 'ALL' ? 'All Notices' : cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search circulars..."
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.length > 0 ? (
          filteredNotices.map((notice) => (
            <div
              key={notice.id}
              className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all ${
                notice.pinned
                  ? 'border-indigo-200 shadow-md bg-gradient-to-r from-white via-indigo-50/20 to-white'
                  : 'border-slate-200/80 shadow-soft hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {notice.pinned && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md">
                        <Pin className="w-3 h-3" /> Pinned
                      </span>
                    )}
                    <Badge variant="primary" size="xs">
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

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(notice)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenDelete(notice)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
                <span className="flex items-center gap-1.5 font-medium">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Posted by: <span className="text-slate-700">{notice.author}</span>
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {notice.date}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-bold text-slate-700">No notices found</p>
            <p className="text-xs text-slate-400 mt-1">Try selecting a different category or clear search</p>
          </div>
        )}
      </div>

      {/* Add / Edit Notice Modal */}
      <Modal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
        }}
        title={isAddModalOpen ? 'Publish New Campus Circular' : 'Edit Notice'}
        subtitle="Notices appear in all Student & Faculty dashboards"
      >
        <form onSubmit={isAddModalOpen ? handleSaveAdd : handleSaveEdit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Schedule for End-Semester Practical Exams"
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none"
              >
                <option value="Academics">Academics</option>
                <option value="Events">Events</option>
                <option value="Hostel">Hostel</option>
                <option value="Transport">Transport</option>
                <option value="Faculty">Faculty</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Audience</label>
              <select
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none"
              >
                <option value="All Students & Faculty">All Students & Faculty</option>
                <option value="All Students">All Students</option>
                <option value="All Faculty">All Faculty</option>
                <option value="Hostel Residents">Hostel Residents</option>
                <option value="Transport Users">Transport Users</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Issuing Authority</label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="e.g. Office of the Dean (Academics)"
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Notice Content *</label>
            <textarea
              rows={4}
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Enter complete circular text..."
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="pinnedCheck"
              checked={formData.pinned}
              onChange={(e) => setFormData({ ...formData, pinned: e.target.checked })}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="pinnedCheck" className="text-xs font-semibold text-slate-700 cursor-pointer">
              Pin this notice to top of feed
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
              }}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md shadow-indigo-600/30 transition"
            >
              {isAddModalOpen ? 'Publish Notice' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Archive Notice"
        message={`Are you sure you want to delete notice "${selectedNotice?.title}"?`}
        confirmText="Delete Notice"
      />
    </div>
  );
};
