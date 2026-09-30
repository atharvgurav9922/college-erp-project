import React from 'react';
import { useERP } from '../../context/ERPContext';
import { DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/common/Badge';
import { Users, BedDouble, Phone, Mail } from 'lucide-react';

export const HostelStudents = () => {
  const { students } = useERP();

  // Filter only students with allocated hostel room
  const hostelStudents = students.filter(
    (s) => s.hostelStatus === 'Allocated' || s.hostelRoom
  );

  const columns = [
    {
      header: 'Resident Student',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">
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
      header: 'Assigned Room',
      accessor: 'hostelRoom',
      render: (row) => (
        <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
          Room {row.hostelRoom || 'A-304'}
        </span>
      )
    },
    {
      header: 'Department',
      accessor: 'department',
      render: (row) => <span className="text-xs text-slate-600 font-medium">{row.department}</span>
    },
    {
      header: 'Semester',
      accessor: 'semester',
      render: (row) => <Badge variant="primary">{row.semester}</Badge>
    },
    {
      header: 'Contact Phone',
      accessor: 'phone',
      render: (row) => <span className="text-xs text-slate-600 font-medium">{row.phone || '+1 (555) 018-4412'}</span>
    },
    {
      header: 'Status',
      render: () => <Badge variant="success">Resident</Badge>
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-display">Hostel Resident Students</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Complete directory of students currently residing across campus hostel blocks
        </p>
      </div>

      <DataTable
        title="Active Resident Roster"
        subtitle={`Total of ${hostelStudents.length} hostel occupants registered`}
        columns={columns}
        data={hostelStudents}
        searchPlaceholder="Search by student name, roll no, room..."
        searchKeys={['name', 'rollNumber', 'hostelRoom', 'department']}
      />
    </div>
  );
};
