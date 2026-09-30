import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { Plus, Edit2, Trash2, BedDouble, Search, Filter, Users, Wrench } from 'lucide-react';

export const HostelRooms = () => {
  const { hostelRooms, addHostelRoom, updateHostelRoom, deleteHostelRoom } = useERP();
  const { addToast } = useToast();

  const [activeBlock, setActiveBlock] = useState('ALL');
  const [activeStatus, setActiveStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const initialForm = {
    roomNo: '',
    block: 'Block A (Boys)',
    floor: 1,
    type: 'Double AC',
    capacity: 2,
    occupied: 0,
    status: 'Available'
  };
  const [formData, setFormData] = useState(initialForm);

  const blocks = ['ALL', 'Block A (Boys)', 'Block B (Girls)', 'Block C (Deluxe)'];

  const filteredRooms = hostelRooms.filter((r) => {
    const matchesBlock = activeBlock === 'ALL' || r.block.includes(activeBlock.replace(' (Boys)', '').replace(' (Girls)', '').replace(' (Deluxe)', ''));
    const matchesStatus = activeStatus === 'ALL' || r.status === activeStatus;
    const matchesSearch =
      searchTerm.trim() === '' ||
      r.roomNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesBlock && matchesStatus && matchesSearch;
  });

  const handleOpenAdd = () => {
    setFormData(initialForm);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (room) => {
    setSelectedRoom(room);
    setFormData({ ...room });
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (room) => {
    setSelectedRoom(room);
    setIsDeleteModalOpen(true);
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    if (!formData.roomNo) {
      addToast('Please enter room number', 'error');
      return;
    }
    addHostelRoom({
      ...formData,
      floor: Number(formData.floor) || 1,
      capacity: Number(formData.capacity) || 2
    });
    setIsAddModalOpen(false);
    addToast(`Room ${formData.roomNo} added to inventory!`, 'success');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!selectedRoom) return;
    updateHostelRoom(selectedRoom.id, {
      ...formData,
      floor: Number(formData.floor),
      capacity: Number(formData.capacity),
      occupied: Number(formData.occupied)
    });
    setIsEditModalOpen(false);
    addToast(`Room ${formData.roomNo} updated successfully`, 'success');
  };

  const handleConfirmDelete = () => {
    if (!selectedRoom) return;
    deleteHostelRoom(selectedRoom.id);
    addToast(`Room ${selectedRoom.roomNo} removed from hostel registry`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Room Inventory Management</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Visual room occupancy matrix across hostel blocks and floors
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-amber-600/30 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add New Room
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft">
        <div className="flex flex-wrap items-center gap-2">
          {blocks.map((block) => (
            <button
              key={block}
              onClick={() => setActiveBlock(block)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeBlock === block
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {block === 'ALL' ? 'All Blocks' : block}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={activeStatus}
            onChange={(e) => setActiveStatus(e.target.value)}
            className="text-xs sm:text-sm bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-1.5 outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="Available">Available Only</option>
            <option value="Occupied">Occupied Only</option>
            <option value="Maintenance">Maintenance</option>
          </select>

          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search room no..."
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredRooms.map((room) => {
          const isFull = room.occupied >= room.capacity;
          const isAvailable = room.status === 'Available' && !isFull;
          const isMaintenance = room.status === 'Maintenance';

          return (
            <div
              key={room.id}
              className={`bg-white rounded-2xl border p-5 shadow-soft hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden ${
                isAvailable
                  ? 'border-emerald-200 hover:border-emerald-300'
                  : isMaintenance
                  ? 'border-amber-200 hover:border-amber-300'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-extrabold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                      {room.roomNo}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Fl {room.floor}</span>
                  </div>

                  <Badge
                    variant={isAvailable ? 'success' : isMaintenance ? 'warning' : 'default'}
                    size="xs"
                  >
                    {room.status}
                  </Badge>
                </div>

                <p className="text-xs font-bold text-slate-800">{room.type}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{room.block}</p>

                {/* Occupancy bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-500">Occupancy</span>
                    <span className={isAvailable ? 'text-emerald-600' : 'text-slate-700'}>
                      {room.occupied} / {room.capacity} Beds
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isAvailable ? 'bg-emerald-500' : isMaintenance ? 'bg-amber-500' : 'bg-slate-600'
                      }`}
                      style={{ width: `${Math.min(100, (room.occupied / room.capacity) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(room)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition"
                  title="Edit Room"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleOpenDelete(room)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Delete Room"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
        }}
        title={isAddModalOpen ? 'Add Hostel Room' : `Edit Room ${formData.roomNo}`}
        subtitle="Manage room configuration and capacity"
      >
        <form onSubmit={isAddModalOpen ? handleSaveAdd : handleSaveEdit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Room Number *</label>
              <input
                type="text"
                required
                value={formData.roomNo}
                onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })}
                placeholder="e.g. A-306"
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none font-mono focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Floor</label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Hostel Block</label>
            <select
              value={formData.block}
              onChange={(e) => setFormData({ ...formData, block: e.target.value })}
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none"
            >
              <option value="Block A (Boys)">Block A (Boys - Aryabhata)</option>
              <option value="Block B (Girls)">Block B (Girls - Gargi)</option>
              <option value="Block C (Deluxe)">Block C (Deluxe International)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Room Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none"
              >
                <option value="Single Deluxe AC">Single Deluxe AC</option>
                <option value="Double AC">Double AC</option>
                <option value="Double Non-AC">Double Non-AC</option>
                <option value="Triple AC">Triple AC</option>
                <option value="Triple Non-AC">Triple Non-AC</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Capacity (Beds)</label>
              <input
                type="number"
                min="1"
                max="6"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Current Occupied</label>
              <input
                type="number"
                min="0"
                max={formData.capacity}
                value={formData.occupied}
                onChange={(e) => setFormData({ ...formData, occupied: e.target.value })}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none"
              >
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
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
              className="px-5 py-2 text-xs sm:text-sm font-semibold bg-amber-600 hover:bg-amber-500 text-white rounded-xl shadow-md shadow-amber-600/30 transition cursor-pointer"
            >
              {isAddModalOpen ? 'Add Room' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Room from Inventory"
        message={`Are you sure you want to delete Room ${selectedRoom?.roomNo}?`}
        confirmText="Delete Room"
      />
    </div>
  );
};
