import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import { DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { Plus, Edit2, Trash2, Eye, Mail, Phone, GraduationCap } from 'lucide-react';

export const StudentsManagement = () => {
  const { students, addStudent, updateStudent, deleteStudent, departments } = useERP();
  const { addToast } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState(null);

  // Form State
  const initialForm = {
    name: '',
    rollNumber: '',
    email: '',
    phone: '',
    department: departments[0]?.name || 'Computer Science & Engineering',
    semester: '6th Semester',
    cgpa: 3.5,
    gender: 'Male',
    hostelStatus: 'None',
    hostelRoom: '',
    transportStatus: 'None',
    transportBus: ''
  };
  const [formData, setFormData] = useState(initialForm);

  const handleOpenAdd = () => {
    setFormData(initialForm);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (student) => {
    setSelectedStudent(student);
    setFormData({ ...student });
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (student) => {
    setSelectedStudent(student);
    setIsDeleteModalOpen(true);
  };

  const handleOpenView = (student) => {
    setSelectedStudent(student);
    setIsViewModalOpen(true);
  };

  const handleSaveAdd = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.rollNumber || !formData.email) {
      addToast('Please fill in required fields (Name, Roll Number, Email)', 'error');
      return;
    }
    try {
      await addStudent({
        ...formData,
        cgpa: Number(formData.cgpa) || 3.5
      });
      setIsAddModalOpen(false);
      addToast(`Successfully enrolled student ${formData.name}!`, 'success');
    } catch (err) {
      addToast(`Failed to save student: ${err.message}`, 'error');
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return;
    try {
      await updateStudent(selectedStudent.id || selectedStudent._id, {
        ...formData,
        cgpa: Number(formData.cgpa)
      });
      setIsEditModalOpen(false);
      addToast(`Updated record for ${formData.name}`, 'success');
    } catch (err) {
      addToast(`Failed to update student: ${err.message}`, 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedStudent) return;
    try {
      await deleteStudent(selectedStudent.id || selectedStudent._id);
      addToast(`Student ${selectedStudent.name} deleted from records`, 'info');
    } catch (err) {
      addToast(`Failed to delete student: ${err.message}`, 'error');
    }
  };

  // Columns definition
  const columns = [
    {
      header: 'Student Name',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
            {row.name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-slate-900">{row.name}</p>
            <p className="text-xs text-slate-400">{row.email}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Roll Number',
      accessor: 'rollNumber',
      render: (row) => (
        <span className="font-mono text-xs font-semibold px-2 py-1 bg-slate-100 rounded text-slate-700">
          {row.rollNumber}
        </span>
      )
    },
    {
      header: 'Department',
      accessor: 'department',
      render: (row) => <span className="text-slate-700 text-xs font-medium">{row.department}</span>
    },
    {
      header: 'Semester',
      accessor: 'semester',
      render: (row) => <Badge variant="primary">{row.semester}</Badge>
    },
    {
      header: 'CGPA',
      accessor: 'cgpa',
      render: (row) => (
        <span className="font-bold text-xs text-slate-800 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
          {row.cgpa ? Number(row.cgpa).toFixed(2) : 'N/A'}
        </span>
      )
    },
    {
      header: 'Hostel',
      accessor: 'hostelStatus',
      render: (row) => (
        <Badge
          variant={
            row.hostelStatus === 'Allocated'
              ? 'success'
              : row.hostelStatus === 'Applied'
                ? 'warning'
                : 'default'
          }
        >
          {row.hostelStatus === 'Allocated' ? row.hostelRoom || 'Allocated' : row.hostelStatus}
        </Badge>
      )
    },
    {
      header: 'Transport',
      accessor: 'transportStatus',
      render: (row) => (
        <Badge
          variant={
            row.transportStatus === 'Allocated'
              ? 'info'
              : row.transportStatus === 'Applied'
                ? 'warning'
                : 'default'
          }
        >
          {row.transportStatus === 'Allocated' ? row.transportBus || 'Bus' : row.transportStatus}
        </Badge>
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
            title="Edit Student"
            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenDelete(row)}
            title="Delete Student"
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
      label: 'Semester',
      key: 'semester',
      options: ['2nd Semester', '4th Semester', '6th Semester', '8th Semester']
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Students Directory</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage student registrations, academic standing, and residential allocations
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl transition shadow-md shadow-indigo-600/30"
        >
          <Plus className="w-4 h-4" />
          Add New Student
        </button>
      </div>

      {/* Main Data Table */}
      <DataTable
        title="All Enrolled Students"
        subtitle={`Total of ${students.length} students recorded`}
        columns={columns}
        data={students}
        searchPlaceholder="Search by name, roll no, email..."
        searchKeys={['name', 'rollNumber', 'email', 'department']}
        filterOptions={filterOptions}
      />

      {/* Add / Edit Student Modal */}
      <Modal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
        }}
        title={isAddModalOpen ? 'Enrol New Student' : `Edit Student: ${formData.name}`}
        subtitle="Fill in student academic and personal credentials"
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
                placeholder="e.g. Maya Lin"
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Roll Number *
              </label>
              <input
                type="text"
                required
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                placeholder="e.g. 2023-CSE-099"
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
                placeholder="student@campus.edu"
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
                Semester
              </label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              >
                <option value="1st Semester">1st Semester</option>
                <option value="2nd Semester">2nd Semester</option>
                <option value="3rd Semester">3rd Semester</option>
                <option value="4th Semester">4th Semester</option>
                <option value="5th Semester">5th Semester</option>
                <option value="6th Semester">6th Semester</option>
                <option value="7th Semester">7th Semester</option>
                <option value="8th Semester">8th Semester</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                CGPA (0 - 10.0)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10.0"
                value={formData.cgpa}
                onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
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
              {isAddModalOpen ? 'Create Student' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Student Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Student Profile Overview"
        maxWidth="max-w-lg"
      >
        {selectedStudent && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-bold text-xl flex items-center justify-center shadow-md shadow-indigo-500/20">
                {selectedStudent.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedStudent.name}</h3>
                <p className="text-xs font-mono text-slate-500 font-semibold">{selectedStudent.rollNumber}</p>
                <Badge variant="primary" size="xs" className="mt-1">
                  {selectedStudent.semester}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-slate-400 block font-medium">Department</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{selectedStudent.department}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-slate-400 block font-medium">CGPA</span>
                <span className="font-bold text-emerald-700 mt-0.5 block">{selectedStudent.cgpa} / 4.0</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-slate-400 block font-medium">Hostel Room</span>
                <span className="font-bold text-slate-800 mt-0.5 block">
                  {selectedStudent.hostelRoom || 'Not Allocated (Day Scholar)'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-slate-400 block font-medium">Transport Bus</span>
                <span className="font-bold text-slate-800 mt-0.5 block">
                  {selectedStudent.transportBus || 'No Bus Pass'}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{selectedStudent.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{selectedStudent.phone || 'No phone recorded'}</span>
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
        title="Delete Student Record"
        message={`Are you sure you want to delete ${selectedStudent?.name} (${selectedStudent?.rollNumber})? This will remove all their associated records.`}
        confirmText="Delete Student"
      />
    </div>
  );
};
