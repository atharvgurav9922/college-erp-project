import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { Plus, Edit2, Trash2, MapPin, Clock, Bus, Compass, Navigation } from 'lucide-react';

export const ManageRoutes = () => {
  const { routes, addRoute, updateRoute, deleteRoute, buses } = useERP();
  const { addToast } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);

  const initialForm = {
    routeNumber: 'Route 5',
    name: '',
    assignedBus: buses[0]?.busNo || 'Bus-01',
    startPoint: '',
    endPoint: 'Campus Main Gate',
    totalDistance: '20 km',
    morningPickup: '07:15 AM',
    eveningDrop: '05:30 PM',
    stops: [
      { name: 'City Center Plaza', time: '07:15 AM' },
      { name: 'Green Park Square', time: '07:35 AM' },
      { name: 'Campus Main Gate', time: '08:15 AM' }
    ]
  };
  const [formData, setFormData] = useState(initialForm);

  const handleOpenAdd = () => {
    setFormData({
      ...initialForm,
      routeNumber: `Route ${routes.length + 1}`
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (route) => {
    setSelectedRoute(route);
    setFormData({ ...route });
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (route) => {
    setSelectedRoute(route);
    setIsDeleteModalOpen(true);
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.startPoint) {
      addToast('Please enter route name and starting terminal', 'error');
      return;
    }
    addRoute(formData);
    setIsAddModalOpen(false);
    addToast(`${formData.routeNumber}: ${formData.name} added!`, 'success');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!selectedRoute) return;
    updateRoute(selectedRoute.id, formData);
    setIsEditModalOpen(false);
    addToast(`Updated ${formData.routeNumber}`, 'success');
  };

  const handleConfirmDelete = () => {
    if (!selectedRoute) return;
    deleteRoute(selectedRoute.id);
    addToast(`Route ${selectedRoute.routeNumber} removed`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Bus Routes & Stops</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure transit pathways, pick-up stations, and scheduled morning/evening timings
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-cyan-600/30 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Transit Route
        </button>
      </div>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {routes.map((route) => (
          <div
            key={route.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-6 flex flex-col justify-between hover:shadow-md transition-all space-y-4"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-lg border border-cyan-200">
                      {route.routeNumber}
                    </span>
                    <Badge variant="primary" size="xs">
                      {route.assignedBus}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 font-display mt-2">
                    {route.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {route.startPoint} ➔ {route.endPoint} • <span className="font-semibold text-slate-700">{route.totalDistance}</span>
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(route)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition"
                    title="Edit Route"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenDelete(route)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Delete Route"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Timings */}
              <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Morning Start</span>
                  <span className="font-bold text-slate-800">{route.morningPickup}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Campus Drop</span>
                  <span className="font-bold text-slate-800">08:20 AM</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Evening Return</span>
                  <span className="font-bold text-slate-800">{route.eveningDrop}</span>
                </div>
              </div>

              {/* Stops list */}
              <div className="mt-4 space-y-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Designated Stops ({route.stops?.length || 0})
                </p>
                <div className="space-y-1.5">
                  {route.stops?.map((stop, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50/50 hover:bg-slate-100/50 transition"
                    >
                      <span className="text-slate-700 font-medium flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-cyan-100 text-cyan-800 text-[10px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        {stop.name}
                      </span>
                      <span className="font-mono text-slate-500 font-semibold text-[11px]">{stop.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Route Modal */}
      <Modal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
        }}
        title={isAddModalOpen ? 'Create New Transit Route' : `Edit ${formData.routeNumber}`}
        subtitle="Specify route geography, bus assignment, and stops"
      >
        <form onSubmit={isAddModalOpen ? handleSaveAdd : handleSaveEdit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Route Identifier *</label>
              <input
                type="text"
                required
                value={formData.routeNumber}
                onChange={(e) => setFormData({ ...formData, routeNumber: e.target.value })}
                placeholder="e.g. Route 5"
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Vehicle</label>
              <select
                value={formData.assignedBus}
                onChange={(e) => setFormData({ ...formData, assignedBus: e.target.value })}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none"
              >
                {buses.map((b) => (
                  <option key={b.id} value={b.busNo}>
                    {b.busNo} ({b.driverName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Route Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. South Corridor & Tech City"
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Start Terminal *</label>
              <input
                type="text"
                required
                value={formData.startPoint}
                onChange={(e) => setFormData({ ...formData, startPoint: e.target.value })}
                placeholder="e.g. South Station Terminal"
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Total Distance</label>
              <input
                type="text"
                value={formData.totalDistance}
                onChange={(e) => setFormData({ ...formData, totalDistance: e.target.value })}
                placeholder="e.g. 24 km"
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Morning Start Time</label>
              <input
                type="text"
                value={formData.morningPickup}
                onChange={(e) => setFormData({ ...formData, morningPickup: e.target.value })}
                placeholder="07:15 AM"
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Evening Return Time</label>
              <input
                type="text"
                value={formData.eveningDrop}
                onChange={(e) => setFormData({ ...formData, eveningDrop: e.target.value })}
                placeholder="05:30 PM"
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none"
              />
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
              className="px-5 py-2 text-xs sm:text-sm font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl shadow-md shadow-cyan-600/30 transition cursor-pointer"
            >
              {isAddModalOpen ? 'Create Route' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Transit Route"
        message={`Are you sure you want to delete ${selectedRoute?.routeNumber} (${selectedRoute?.name})?`}
        confirmText="Delete Route"
      />
    </div>
  );
};
