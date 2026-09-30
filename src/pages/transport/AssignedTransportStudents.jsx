import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/common/Badge';
import { Bus, MapPin, Phone, Mail } from 'lucide-react';

export const AssignedTransportStudents = () => {
  const { students, buses } = useERP();

  // Filter students who have allocated bus
  const transportStudents = students.filter(
    (s) => s.transportStatus === 'Allocated' || s.transportBus
  );

  const columns = [
    {
      header: 'Commuter Student',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-800 font-bold text-xs flex items-center justify-center">
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
      header: 'Allocated Bus',
      accessor: 'transportBus',
      render: (row) => (
        <span className="font-mono text-xs font-bold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-lg border border-cyan-200">
          {row.transportBus || 'Bus-01'}
        </span>
      )
    },
    {
      header: 'Department',
      accessor: 'department',
      render: (row) => <span className="text-xs text-slate-600 font-medium">{row.department}</span>
    },
    {
      header: 'Contact Phone',
      accessor: 'phone',
      render: (row) => <span className="text-xs text-slate-600 font-medium">{row.phone || '+1 (555) 018-4412'}</span>
    },
    {
      header: 'Pass Status',
      render: () => <Badge variant="info">Verified Pass</Badge>
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-display">Bus Commuter Students</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Complete passenger manifest and student bus pass registrations
        </p>
      </div>

      <DataTable
        title="Active Student Commuters"
        subtitle={`Total of ${transportStudents.length} students holding active passes`}
        columns={columns}
        data={transportStudents}
        searchPlaceholder="Search by student name, roll no, bus..."
        searchKeys={['name', 'rollNumber', 'transportBus', 'department']}
        filterOptions={[
          {
            label: 'Bus',
            key: 'transportBus',
            options: buses.map((b) => b.busNo)
          }
        ]}
      />
    </div>
  );
};
