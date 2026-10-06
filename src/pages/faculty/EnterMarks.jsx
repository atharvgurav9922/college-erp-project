import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../../components/common/Badge';
import confetti from 'canvas-confetti';
import { Award, Save, Calculator, CheckCircle2, Search } from 'lucide-react';

export const EnterMarks = () => {
  const { students, studentMarks, updateStudentSubjectMarks } = useERP();
  const { addToast } = useToast();

  const [selectedSubject, setSelectedSubject] = useState('CS601');
  const [searchTerm, setSearchTerm] = useState('');

  const subjectList = [
    { code: 'CS601', name: 'Database Systems' },
    { code: 'CS602', name: 'Machine Learning' },
    { code: 'CS603', name: 'Computer Networks' },
    { code: 'CS605', name: 'Web Architectures & Cloud' }
  ];

  // Local state for score inputs mapped by studentId
  const [scores, setScores] = useState({
    'STU-001': { internal1: 28, internal2: 27, assignment: 19, finalExam: 88 },
    'STU-002': { internal1: 30, internal2: 29, assignment: 20, finalExam: 94 },
    'STU-003': { internal1: 22, internal2: 24, assignment: 16, finalExam: 72 },
    'STU-004': { internal1: 25, internal2: 26, assignment: 18, finalExam: 80 },
    'STU-005': { internal1: 23, internal2: 21, assignment: 17, finalExam: 74 },
    'STU-006': { internal1: 29, internal2: 28, assignment: 19, finalExam: 90 },
    'STU-007': { internal1: 21, internal2: 20, assignment: 15, finalExam: 70 },
    'STU-008': { internal1: 26, internal2: 25, assignment: 18, finalExam: 83 }
  });

  const handleScoreChange = (studentId, field, val) => {
    const num = Math.max(0, Number(val) || 0);
    setScores((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { internal1: 0, internal2: 0, assignment: 0, finalExam: 0 }),
        [field]: num
      }
    }));
  };

  const calculateTotalAndGrade = (s) => {
    const i1 = s?.internal1 || 0;
    const i2 = s?.internal2 || 0;
    const asg = s?.assignment || 0;
    const fin = s?.finalExam || 0;

    // Formula: 30% internal average + 20% assignment + 50% final exam
    const internalAvg = (i1 + i2) / 2; // out of 30
    const total = Math.round(internalAvg + asg + (fin / 100) * 50);

    let grade = 'F';
    let gradePoint = 0;
    if (total >= 90) { grade = 'A+'; gradePoint = 10; }
    else if (total >= 80) { grade = 'A'; gradePoint = 9; }
    else if (total >= 70) { grade = 'B+'; gradePoint = 8; }
    else if (total >= 60) { grade = 'B'; gradePoint = 7; }
    else if (total >= 50) { grade = 'C'; gradePoint = 6; }
    else { grade = 'F'; gradePoint = 0; }

    return { total, grade, gradePoint };
  };

  // Sync marks from DB/context whenever selected subject or studentMarks changes
  React.useEffect(() => {
    const existing = studentMarks.find((m) => m.subjectCode === selectedSubject);
    if (existing) {
      setScores((prev) => ({
        ...prev,
        'STU-001': {
          internal1: existing.internal1 ?? 28,
          internal2: existing.internal2 ?? 27,
          assignment: existing.assignment ?? 19,
          finalExam: existing.finalExam ?? 88
        }
      }));
    }
  }, [selectedSubject, studentMarks]);

  const handleSaveMarks = async (e) => {
    e.preventDefault();
    // Update student marks for selected subject
    const alexScores = scores['STU-001'] || { internal1: 25, internal2: 25, assignment: 18, finalExam: 80 };
    try {
      await updateStudentSubjectMarks(selectedSubject, alexScores);

      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.8 }
        });
      } catch (e) {}

      addToast(`Marks for ${selectedSubject} successfully updated and published to student grade cards!`, 'success');
    } catch (err) {
      addToast(`Failed to update marks: ${err.message}`, 'error');
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      searchTerm.trim() === '' ||
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Student Marks & Evaluation</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Input continuous assessments, internal exams, assignments, and semester grades
          </p>
        </div>
      </div>

      {/* Course & Filter bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Select Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="text-xs sm:text-sm bg-slate-50 border border-slate-200 text-slate-800 font-semibold rounded-xl px-3 py-2 pr-8 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none cursor-pointer"
            >
              {subjectList.map((sub) => (
                <option key={sub.code} value={sub.code}>
                  {sub.code}: {sub.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Search Student
            </label>
            <div className="relative min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name/roll..."
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSaveMarks}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-indigo-600/30 transition cursor-pointer"
        >
          <Save className="w-4 h-4" />
          Save & Publish All
        </button>
      </div>

      {/* Marks Matrix Table */}
      <form onSubmit={handleSaveMarks} className="bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-semibold uppercase text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Student</th>
                <th className="px-4 py-3.5 text-center">Internal 1 (30)</th>
                <th className="px-4 py-3.5 text-center">Internal 2 (30)</th>
                <th className="px-4 py-3.5 text-center">Assignment (20)</th>
                <th className="px-4 py-3.5 text-center">Final Exam (100)</th>
                <th className="px-4 py-3.5 text-center">Total (100)</th>
                <th className="px-4 py-3.5 text-center">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student) => {
                const s = scores[student.id] || { internal1: 25, internal2: 25, assignment: 18, finalExam: 80 };
                const { total, grade, gradePoint } = calculateTotalAndGrade(s);

                return (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-900">{student.name}</p>
                      <p className="font-mono text-xs text-slate-400">{student.rollNumber}</p>
                    </td>

                    {/* Internal 1 */}
                    <td className="px-4 py-4 text-center">
                      <input
                        type="number"
                        min="0"
                        max="30"
                        value={s.internal1}
                        onChange={(e) => handleScoreChange(student.id, 'internal1', e.target.value)}
                        className="w-16 text-center text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-200 rounded-lg py-1.5 focus:border-indigo-500 outline-none"
                      />
                    </td>

                    {/* Internal 2 */}
                    <td className="px-4 py-4 text-center">
                      <input
                        type="number"
                        min="0"
                        max="30"
                        value={s.internal2}
                        onChange={(e) => handleScoreChange(student.id, 'internal2', e.target.value)}
                        className="w-16 text-center text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-200 rounded-lg py-1.5 focus:border-indigo-500 outline-none"
                      />
                    </td>

                    {/* Assignment */}
                    <td className="px-4 py-4 text-center">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={s.assignment}
                        onChange={(e) => handleScoreChange(student.id, 'assignment', e.target.value)}
                        className="w-16 text-center text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-200 rounded-lg py-1.5 focus:border-indigo-500 outline-none"
                      />
                    </td>

                    {/* Final Exam */}
                    <td className="px-4 py-4 text-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={s.finalExam}
                        onChange={(e) => handleScoreChange(student.id, 'finalExam', e.target.value)}
                        className="w-16 text-center text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-200 rounded-lg py-1.5 focus:border-indigo-500 outline-none"
                      />
                    </td>

                    {/* Calculated Total */}
                    <td className="px-4 py-4 text-center font-bold text-slate-800 font-display text-sm">
                      {total} / 100
                    </td>

                    {/* Calculated Grade */}
                    <td className="px-4 py-4 text-center">
                      <Badge
                        variant={
                          grade.startsWith('A')
                            ? 'success'
                            : grade.startsWith('B')
                            ? 'primary'
                            : grade === 'C'
                            ? 'warning'
                            : 'danger'
                        }
                      >
                        {grade} ({gradePoint} GP)
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Calculated score automatically factors Internal Average (30%), Assignments (20%), and Semester Exam (50%).
          </span>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-indigo-600/30 transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Save & Publish Marks
          </button>
        </div>
      </form>
    </div>
  );
};
