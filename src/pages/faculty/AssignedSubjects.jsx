import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { Badge } from '../../components/common/Badge';
import { BookOpen, Users, GraduationCap, Clock, Award, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AssignedSubjects = () => {
  const { students } = useERP();
  const [selectedSubject, setSelectedSubject] = useState('CS601: Database Systems');
  const [searchStudent, setSearchStudent] = useState('');

  const subjects = [
    {
      code: 'CS601',
      name: 'Database Systems',
      semester: '6th Semester',
      credits: 4,
      department: 'Computer Science & Engineering',
      totalClasses: 36,
      syllabus: 'Relational Algebra, SQL, Normalization, Query Optimization, Concurrency Control, NoSQL',
      description: 'Comprehensive study of relational database models, transaction management, and indexing.'
    },
    {
      code: 'CS603',
      name: 'Computer Networks',
      semester: '6th Semester',
      credits: 4,
      department: 'Computer Science & Engineering',
      totalClasses: 38,
      syllabus: 'OSI & TCP/IP models, Data Link Layer, Routing Algorithms, Transport Layer Protocols, Sockets',
      description: 'Foundations of internet protocols, routing strategies, network security, and socket programming.'
    },
    {
      code: 'CS605',
      name: 'Web Architectures & Cloud',
      semester: '6th Semester',
      credits: 3,
      department: 'Computer Science & Engineering',
      totalClasses: 32,
      syllabus: 'REST APIs, Microservices, Client-Side Frameworks, Serverless Architectures, CI/CD',
      description: 'Modern scalable full-stack web applications, microservices deployment, and cloud pipelines.'
    }
  ];

  const currentSubjectObj = subjects.find((s) => `${s.code}: ${s.name}` === selectedSubject) || subjects[0];

  // Filter students for CSE 6th Semester
  const enrolledStudents = students.filter(
    (s) =>
      s.department.includes('Computer Science') &&
      (searchStudent.trim() === '' ||
        s.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
        s.rollNumber.toLowerCase().includes(searchStudent.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Assigned Teaching Subjects</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Course syllabus, enrolled student roster, and evaluation plans
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/faculty/attendance"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold rounded-xl transition shadow-md shadow-emerald-600/20"
          >
            Mark Attendance
          </Link>
          <Link
            to="/faculty/marks"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl transition shadow-md shadow-indigo-600/20"
          >
            Enter Marks
          </Link>
        </div>
      </div>

      {/* Subject Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {subjects.map((sub) => {
          const isSelected = `${sub.code}: ${sub.name}` === selectedSubject;
          return (
            <button
              key={sub.code}
              onClick={() => setSelectedSubject(`${sub.code}: ${sub.name}`)}
              className={`text-left p-5 rounded-2xl border transition-all ${
                isSelected
                  ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                  : 'bg-white border-slate-200/80 shadow-soft hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
                  {sub.code}
                </span>
                <Badge variant="primary" size="xs">
                  {sub.credits} Credits
                </Badge>
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">{sub.name}</h3>
              <p className="text-xs text-slate-500 mt-1">{sub.semester}</p>
            </button>
          );
        })}
      </div>

      {/* Selected Subject Details & Enrolled Students */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Course Overview */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-soft p-5 sm:p-6 space-y-4">
          <div>
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
              Course Details
            </span>
            <h2 className="text-lg font-bold text-slate-900 font-display mt-1">
              {currentSubjectObj.name}
            </h2>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              {currentSubjectObj.description}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Department</span>
              <span className="font-bold text-slate-700">{currentSubjectObj.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Semester</span>
              <span className="font-bold text-slate-700">{currentSubjectObj.semester}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Lectures Conducted</span>
              <span className="font-bold text-slate-700">{currentSubjectObj.totalClasses} Hours</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Syllabus Outline
            </h4>
            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
              {currentSubjectObj.syllabus}
            </p>
          </div>
        </div>

        {/* Right Column: Enrolled Students */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-soft p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-display">
                Enrolled Class Roster ({enrolledStudents.length} Students)
              </h2>
              <p className="text-xs text-slate-500">Students registered in {currentSubjectObj.name}</p>
            </div>

            <div className="relative min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
                placeholder="Search students..."
                className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[11px]">
                  <th className="pb-3">Student</th>
                  <th className="pb-3">Roll No</th>
                  <th className="pb-3">Semester</th>
                  <th className="pb-3">CGPA</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enrolledStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3 font-semibold text-slate-800 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                        {s.name.charAt(0)}
                      </div>
                      {s.name}
                    </td>
                    <td className="py-3 font-mono text-xs text-slate-600">{s.rollNumber}</td>
                    <td className="py-3 text-slate-600">{s.semester}</td>
                    <td className="py-3 font-bold text-emerald-700">{s.cgpa}</td>
                    <td className="py-3">
                      <Badge variant="success" size="xs">
                        Enrolled
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
