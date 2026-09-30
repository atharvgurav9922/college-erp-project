import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import { DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { Plus, Edit2, Trash2, Bus, Phone, Users, Fuel } from 'lucide-react';

export const ManageBuses = () => {
  const { buses, addBus, updateBus, deleteBus, routes } = useERP();
  const { addToast } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);

  const initialForm = {
    busNo: '',
    regNumber: '',
    model: 'Volvo EcoHybrid 45',
    capacity: 45,
    occupiedSeats: 0,
    driverName: '',
    driverPhone: '',
    assignedRoute: routes[0]?.name || 'Route 1: Downtown & Central',
    status: 'Active'
  };
  const [formData, setFormData] = useState(initialForm);

  const handleOpenAdd = () => {
    setFormData(initialForm);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (bus) => {
    setSelectedBus(bus);
    setFormData({ ...bus });
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (bus) => {
    setSelectedBus(bus);
    setIsDeleteModalOpen(true);
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    if (!formData.busNo || !formData.driverName) {
      addToast('Please provide bus number and driver details', 'error');
      return;
    }
    addBus({
      ...formData,
      capacity: Number(formData.capacity) || 45
    });
    setIsAddModalOpen(false);
    addToast(`Bus ${formData.busNo} added to university fleet!`, 'success');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!selectedBus) return;
    updateBus(selectedBus.id, {
      ...formData,
      capacity: Number(formData.capacity),
      occupiedSeats: Number(formData.occupiedSeats)
    });
    setIsEditModalOpen(false);
    addToast(`Updated details for ${formData.busNo}`, 'success');
  };

  const handleConfirmDelete = () => {
    if (!selectedBus) return;
    deleteBus(selectedBus.id);
    addToast(`Bus ${selectedBus.busNo} decommissioned from fleet`, 'info');
  };

  const columns = [
    {
      header: 'Bus Identifier',
      accessor: 'busNo',
      render: (row) => (
        <div>
          <span className="font-mono text-sm font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
            {row.busNo}
          </span>
          <p className="text-[11px] text-slate-400 mt-0.5">{row.regNumber}</p>
        </div>
      )
    },
    {
      header: 'Model / Vehicle',
      accessor: 'model',
      render: (row) => <span className="text-xs text-slate-700 font-medium">{row.model || 'Standard Shuttle'}</span>
    },
    {
      header: 'Assigned Route',
      accessor: 'assignedRoute',
      render: (row) => <span className="text-xs text-slate-800 font-semibold">{row.assignedRoute}</span>
    },
    {
      header: 'Driver & Contact',
      accessor: 'driverName',
      render: (row) => (
        <div className="text-xs">
          <p className="font-bold text-slate-800">{row.driverName}</p>
          <p className="text-slate-400 font-mono">{row.driverPhone}</p>
        </div>
      )
    },
    {
      header: 'Seat Capacity',
      accessor: 'capacity',
      render: (row) => (
        <span className="text-xs font-bold text-slate-700">
          {row.occupiedSeats} / {row.capacity} Seats
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <Badge
          variant={row.status === 'Active' ? 'success' : row.status === 'Maintenance' ? 'warning' : 'default'}
        >
          {row.status}
        </Badge>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition"
            title="Edit Bus"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenDelete(row)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
            title="Delete Bus"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Bus Fleet Management</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Maintain university transit vehicles, driver assignments, and seat capacities
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-cyan-600/30 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add New Bus
        </button>
      </div>

      <DataTable
        title="Fleet Roster"
        subtitle={`Total of ${buses.length} vehicles registered`}
        columns={columns}
        data={buses}
        searchPlaceholder="Search by bus number, driver, route..."
        searchKeys={['busNo', 'regNumber', 'driverName', 'assignedRoute', 'status']}
        filterOptions={[
          {
            label: 'Status',
            key: 'status',
            options: ['Active', 'Maintenance', 'Inactive']
          }
        ]}
      />

      {/* Add / Edit Bus Modal */}
      <Modal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
        }}
        title={isAddModalOpen ? 'Register New University Bus' : `Edit Bus ${formData.busNo}`}
        subtitle="Specify vehicle details and assign driver"
      >
        <form onSubmit={isAddModalOpen ? handleSaveAdd : handleSaveEdit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Bus Number *</label>
              <input
                type="text"
                required
                value={formData.busNo}
                onChange={(e) => setFormData({ ...formData, busNo: e.target.value })}
                placeholder="e.g. Bus-06"
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none font-mono focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Registration No *</label>
              <input
                type="text"
                required
                value={formData.regNumber}
                onChange={(e) => setFormData({ ...formData, regNumber: e.target.value })}
                placeholder="e.g. NY-CAMP-1150"
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none font-mono focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Vehicle Model</label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="e.g. Volvo EcoHybrid 45"
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Seating Capacity</label>
              <input
                type="number"
                min="10"
                max="80"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Driver Name *</label>
              <input
                type="text"
                required
                value={formData.driverName}
                onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                placeholder="e.g. Samuel Green"
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Driver Phone *</label>
              <input
                type="text"
                required
                value={formData.driverPhone}
                onChange={(e) => setFormData({ ...formData, driverPhone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Route</label>
              <select
                value={formData.assignedRoute}
                onChange={(e) => setFormData({ ...formData, assignedRoute: e.target.value })}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none"
              >
                {routes.map((r) => (
                  <option key={r.id} value={`${r.routeNumber}: ${r.name}`}>
                    {r.routeNumber}: {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Fleet Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none"
              >
                <option value="Active">Active</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Inactive">Inactive</option>
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
              className="px-5 py-2 text-xs sm:text-sm font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl shadow-md shadow-cyan-600/30 transition cursor-pointer"
            >
              {isAddModalOpen ? 'Add Bus' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Decommission Bus"
        message={`Are you sure you want to delete ${selectedBus?.busNo} from the active fleet roster?`}
        confirmText="Delete Bus"
      />
    </div>
  );
};
