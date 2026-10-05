import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../../components/common/Modal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { Badge } from '../../components/common/Badge';
import { Plus, Edit2, Trash2, Building2, Users, GraduationCap, Calendar } from 'lucide-react';

export const DepartmentsManagement = () => {
  const { departments, addDepartment, updateDepartment, deleteDepartment, students, faculty } = useERP();
  const { addToast } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);

  const initialForm = {
    name: '',
    code: '',
    hod: '',
    established: 2012,
    description: '',
    facultyCount: 10,
    studentCount: 150
  };
  const [formData, setFormData] = useState(initialForm);

  const handleOpenAdd = () => {
    setFormData(initialForm);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (dept) => {
    setSelectedDept(dept);
    setFormData({ ...dept });
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (dept) => {
    setSelectedDept(dept);
    setIsDeleteModalOpen(true);
  };

  const handleSaveAdd = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.code || !formData.hod) {
      addToast('Please enter Department Name, Code, and HOD', 'error');
      return;
    }
    try {
      await addDepartment({
        ...formData,
        facultyCount: Number(formData.facultyCount) || 12,
        studentCount: Number(formData.studentCount) || 180,
        established: Number(formData.established) || 2020
      });
      setIsAddModalOpen(false);
      addToast(`Department ${formData.name} established!`, 'success');
    } catch (err) {
      addToast(`Failed to add department: ${err.message}`, 'error');
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!selectedDept) return;
    try {
      await updateDepartment(selectedDept.id || selectedDept._id, {
        ...formData,
        facultyCount: Number(formData.facultyCount),
        studentCount: Number(formData.studentCount)
      });
      setIsEditModalOpen(false);
      addToast(`Updated ${formData.name} department info`, 'success');
    } catch (err) {
      addToast(`Failed to update department: ${err.message}`, 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedDept) return;
    try {
      await deleteDepartment(selectedDept.id || selectedDept._id);
      addToast(`Department ${selectedDept.name} deleted`, 'info');
    } catch (err) {
      addToast(`Failed to delete department: ${err.message}`, 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Academic Departments</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Overview and administrative control of faculties and disciplines
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl transition shadow-md shadow-indigo-600/30"
        >
          <Plus className="w-4 h-4" />
          Add Department
        </button>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => {
          // Dynamic calculation of actual student and faculty counts in mock store
          const actualStudents = students.filter((s) => s.department === dept.name).length;
          const actualFaculty = faculty.filter((f) => f.department === dept.name).length;

          return (
            <div
              key={dept.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-6 flex flex-col justify-between hover:shadow-md transition-all group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
                      {dept.code}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base font-display">
                        {dept.name}
                      </h3>
                      <p className="text-xs text-indigo-600 font-medium mt-0.5">
                        Est. {dept.established}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(dept)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenDelete(dept)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-500 mt-4 line-clamp-2 leading-relaxed">
                  {dept.description || 'Dedicated to advancing student expertise and high-impact research.'}
                </p>

                <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase">Head of Department (HOD)</p>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">{dept.hod}</p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-center">
                <div className="p-2 rounded-xl bg-slate-50">
                  <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>Faculty</span>
                  </div>
                  <span className="font-bold text-slate-900 text-sm">{actualFaculty || dept.facultyCount}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50">
                  <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Students</span>
                  </div>
                  <span className="font-bold text-slate-900 text-sm">{actualStudents || dept.studentCount}</span>
                </div>
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
        title={isAddModalOpen ? 'Create New Department' : `Edit Department: ${formData.name}`}
      >
        <form onSubmit={isAddModalOpen ? handleSaveAdd : handleSaveEdit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Department Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Electrical & Power Engineering"
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Code *</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="e.g. EE"
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Established Year</label>
              <input
                type="number"
                value={formData.established}
                onChange={(e) => setFormData({ ...formData, established: e.target.value })}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Head of Department (HOD) *</label>
            <input
              type="text"
              required
              value={formData.hod}
              onChange={(e) => setFormData({ ...formData, hod: e.target.value })}
              placeholder="e.g. Dr. Walter White"
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Overview Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Summary of research domains, laboratories and academic curriculum..."
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-indigo-500"
            />
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
              {isAddModalOpen ? 'Create Department' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Department"
        message={`Are you sure you want to delete ${selectedDept?.name}?`}
        confirmText="Delete Department"
      />
    </div>
  );
};
