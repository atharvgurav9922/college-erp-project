import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import { DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { Plus, Edit2, Trash2, Eye, Mail, Phone, BookOpen } from 'lucide-react';

export const FacultyManagement = () => {
  const { faculty, addFaculty, updateFaculty, deleteFaculty, departments } = useERP();
  const { addToast } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [selectedFaculty, setSelectedFaculty] = useState(null);

  const initialForm = {
    name: '',
    employeeId: '',
    email: '',
    phone: '',
    department: departments[0]?.name || 'Computer Science & Engineering',
    designation: 'Assistant Professor',
    qualification: 'Ph.D. in Computer Science',
    experience: '5 Years'
  };
  const [formData, setFormData] = useState(initialForm);

  const handleOpenAdd = () => {
    setFormData(initialForm);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (f) => {
    setSelectedFaculty(f);
    setFormData({ ...f });
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (f) => {
    setSelectedFaculty(f);
    setIsDeleteModalOpen(true);
  };

  const handleOpenView = (f) => {
    setSelectedFaculty(f);
    setIsViewModalOpen(true);
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.employeeId || !formData.email) {
      addToast('Please fill in required fields', 'error');
      return;
    }
    addFaculty({
      ...formData,
      assignedSubjects: [
        { code: 'CS-GEN', name: 'Core Foundations', semester: '4th Sem', credits: 4 }
      ]
    });
    setIsAddModalOpen(false);
    addToast(`Added faculty member ${formData.name}!`, 'success');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!selectedFaculty) return;
    updateFaculty(selectedFaculty.id, formData);
    setIsEditModalOpen(false);
    addToast(`Updated record for ${formData.name}`, 'success');
  };

  const handleConfirmDelete = () => {
    if (!selectedFaculty) return;
    deleteFaculty(selectedFaculty.id);
    addToast(`Faculty ${selectedFaculty.name} removed`, 'info');
  };

  const columns = [
    {
      header: 'Faculty Member',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
            {row.name.replace('Dr. ', '').replace('Prof. ', '').charAt(0)}
          </div>
          <div>
            <p className="font-bold text-slate-900">{row.name}</p>
            <p className="text-xs text-slate-400">{row.email}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Employee ID',
      accessor: 'employeeId',
      render: (row) => (
        <span className="font-mono text-xs font-semibold px-2 py-1 bg-slate-100 rounded text-slate-700">
          {row.employeeId}
        </span>
      )
    },
    {
      header: 'Department',
      accessor: 'department',
      render: (row) => <span className="text-slate-700 text-xs font-medium">{row.department}</span>
    },
    {
      header: 'Designation',
      accessor: 'designation',
      render: (row) => <Badge variant="primary">{row.designation}</Badge>
    },
    {
      header: 'Experience',
      accessor: 'experience',
      render: (row) => <span className="text-xs font-medium text-slate-600">{row.experience}</span>
    },
    {
      header: 'Assigned Subjects',
      render: (row) => (
        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
          {row.assignedSubjects?.length || 0} Courses
        </span>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleOpenView(row)}
            title="View Details"
            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenEdit(row)}
            title="Edit Faculty"
            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenDelete(row)}
            title="Delete Faculty"
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const filterOptions = [
    {
      label: 'Department',
      key: 'department',
      options: departments.map((d) => d.name)
    },
    {
      label: 'Designation',
      key: 'designation',
      options: ['Professor & Head of Department', 'Associate Professor', 'Assistant Professor', 'Professor & HOD']
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Faculty Directory</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage academic instructors, professors, and subject assignments
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl transition shadow-md shadow-indigo-600/30"
        >
          <Plus className="w-4 h-4" />
          Add Faculty Member
        </button>
      </div>

      {/* Main Data Table */}
      <DataTable
        title="Faculty Roster"
        subtitle={`Total of ${faculty.length} active faculty profiles`}
        columns={columns}
        data={faculty}
        searchPlaceholder="Search by name, ID, department..."
        searchKeys={['name', 'employeeId', 'email', 'department', 'designation']}
        filterOptions={filterOptions}
      />

      {/* Add / Edit Faculty Modal */}
      <Modal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
        }}
        title={isAddModalOpen ? 'Add Faculty Member' : `Edit Faculty: ${formData.name}`}
        subtitle="Specify academic designation and department"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={isAddModalOpen ? handleSaveAdd : handleSaveEdit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Dr. Jennifer Adams"
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Employee ID *
              </label>
              <input
                type="text"
                required
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                placeholder="e.g. FAC-CSE-109"
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="faculty@campus.edu"
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Department
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Designation
              </label>
              <select
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              >
                <option value="Professor & HOD">Professor & HOD</option>
                <option value="Professor">Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Visiting Faculty">Visiting Faculty</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Qualification
              </label>
              <input
                type="text"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                placeholder="e.g. Ph.D. in AI & Robotics"
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Experience
              </label>
              <input
                type="text"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="e.g. 8 Years"
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
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
              {isAddModalOpen ? 'Add Faculty' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Faculty Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Faculty Member Dossier"
        maxWidth="max-w-lg"
      >
        {selectedFaculty && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white font-bold text-xl flex items-center justify-center shadow-md shadow-emerald-500/20">
                {selectedFaculty.name.replace('Dr. ', '').replace('Prof. ', '').charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedFaculty.name}</h3>
                <p className="text-xs font-mono text-slate-500 font-semibold">{selectedFaculty.employeeId}</p>
                <Badge variant="success" size="xs" className="mt-1">
                  {selectedFaculty.designation}
                </Badge>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-slate-400 block font-medium">Department</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{selectedFaculty.department}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-slate-400 block font-medium">Academic Qualification</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{selectedFaculty.qualification}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-slate-400 block font-medium mb-1.5">Assigned Courses</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedFaculty.assignedSubjects?.map((sub, idx) => (
                    <span key={idx} className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium">
                      {typeof sub === 'string' ? sub : `${sub.code}: ${sub.name}`}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{selectedFaculty.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{selectedFaculty.phone || 'No direct phone'}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Remove Faculty Member"
        message={`Are you sure you want to remove ${selectedFaculty?.name} from the active faculty roster?`}
        confirmText="Remove Faculty"
      />
    </div>
  );
};
