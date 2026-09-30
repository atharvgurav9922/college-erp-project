import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_STUDENTS,
  INITIAL_FACULTY,
  INITIAL_DEPARTMENTS,
  INITIAL_NOTICES,
  INITIAL_STUDENT_ATTENDANCE,
  INITIAL_STUDENT_MARKS,
  INITIAL_TIMETABLE,
  INITIAL_HOSTEL_ROOMS,
  INITIAL_HOSTEL_APPLICATIONS,
  INITIAL_HOSTEL_COMPLAINTS,
  INITIAL_BUSES,
  INITIAL_ROUTES,
  INITIAL_TRANSPORT_APPLICATIONS
} from '../data/mockData';

const ERPContext = createContext(null);

const loadStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(`erp_${key}`);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return fallback;
  }
};

export const ERPProvider = ({ children }) => {
  const [students, setStudents] = useState(() => loadStorage('students', INITIAL_STUDENTS));
  const [faculty, setFaculty] = useState(() => loadStorage('faculty', INITIAL_FACULTY));
  const [departments, setDepartments] = useState(() => loadStorage('departments', INITIAL_DEPARTMENTS));
  const [notices, setNotices] = useState(() => loadStorage('notices', INITIAL_NOTICES));
  const [studentAttendance, setStudentAttendance] = useState(() => loadStorage('attendance', INITIAL_STUDENT_ATTENDANCE));
  const [studentMarks, setStudentMarks] = useState(() => loadStorage('marks', INITIAL_STUDENT_MARKS));
  const [timetable, setTimetable] = useState(() => loadStorage('timetable', INITIAL_TIMETABLE));
  const [hostelRooms, setHostelRooms] = useState(() => loadStorage('hostel_rooms', INITIAL_HOSTEL_ROOMS));
  const [hostelApplications, setHostelApplications] = useState(() => loadStorage('hostel_apps', INITIAL_HOSTEL_APPLICATIONS));
  const [hostelComplaints, setHostelComplaints] = useState(() => loadStorage('hostel_complaints', INITIAL_HOSTEL_COMPLAINTS));
  const [buses, setBuses] = useState(() => loadStorage('buses', INITIAL_BUSES));
  const [routes, setRoutes] = useState(() => loadStorage('routes', INITIAL_ROUTES));
  const [transportApplications, setTransportApplications] = useState(() => loadStorage('transport_apps', INITIAL_TRANSPORT_APPLICATIONS));

  // Sync to localStorage
  useEffect(() => { localStorage.setItem('erp_students', JSON.stringify(students)); }, [students]);
  useEffect(() => { localStorage.setItem('erp_faculty', JSON.stringify(faculty)); }, [faculty]);
  useEffect(() => { localStorage.setItem('erp_departments', JSON.stringify(departments)); }, [departments]);
  useEffect(() => { localStorage.setItem('erp_notices', JSON.stringify(notices)); }, [notices]);
  useEffect(() => { localStorage.setItem('erp_attendance', JSON.stringify(studentAttendance)); }, [studentAttendance]);
  useEffect(() => { localStorage.setItem('erp_marks', JSON.stringify(studentMarks)); }, [studentMarks]);
  useEffect(() => { localStorage.setItem('erp_timetable', JSON.stringify(timetable)); }, [timetable]);
  useEffect(() => { localStorage.setItem('erp_hostel_rooms', JSON.stringify(hostelRooms)); }, [hostelRooms]);
  useEffect(() => { localStorage.setItem('erp_hostel_apps', JSON.stringify(hostelApplications)); }, [hostelApplications]);
  useEffect(() => { localStorage.setItem('erp_hostel_complaints', JSON.stringify(hostelComplaints)); }, [hostelComplaints]);
  useEffect(() => { localStorage.setItem('erp_buses', JSON.stringify(buses)); }, [buses]);
  useEffect(() => { localStorage.setItem('erp_routes', JSON.stringify(routes)); }, [routes]);
  useEffect(() => { localStorage.setItem('erp_transport_apps', JSON.stringify(transportApplications)); }, [transportApplications]);

  // Reset to default seed
  const resetToMockData = () => {
    setStudents(INITIAL_STUDENTS);
    setFaculty(INITIAL_FACULTY);
    setDepartments(INITIAL_DEPARTMENTS);
    setNotices(INITIAL_NOTICES);
    setStudentAttendance(INITIAL_STUDENT_ATTENDANCE);
    setStudentMarks(INITIAL_STUDENT_MARKS);
    setTimetable(INITIAL_TIMETABLE);
    setHostelRooms(INITIAL_HOSTEL_ROOMS);
    setHostelApplications(INITIAL_HOSTEL_APPLICATIONS);
    setHostelComplaints(INITIAL_HOSTEL_COMPLAINTS);
    setBuses(INITIAL_BUSES);
    setRoutes(INITIAL_ROUTES);
    setTransportApplications(INITIAL_TRANSPORT_APPLICATIONS);
  };

  // --- Student Actions ---
  const addStudent = (studentData) => {
    const newStudent = {
      ...studentData,
      id: `STU-${Date.now().toString().slice(-4)}`,
      hostelStatus: studentData.hostelStatus || 'None',
      hostelRoom: studentData.hostelRoom || null,
      transportStatus: studentData.transportStatus || 'None',
      transportBus: studentData.transportBus || null,
      status: 'Active'
    };
    setStudents((prev) => [newStudent, ...prev]);
    return newStudent;
  };

  const updateStudent = (id, updates) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteStudent = (id) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  // --- Faculty Actions ---
  const addFaculty = (facultyData) => {
    const newFaculty = {
      ...facultyData,
      id: `FAC-${Date.now().toString().slice(-4)}`,
      status: 'Active',
      assignedSubjects: facultyData.assignedSubjects || []
    };
    setFaculty((prev) => [newFaculty, ...prev]);
    return newFaculty;
  };

  const updateFaculty = (id, updates) => {
    setFaculty((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const deleteFaculty = (id) => {
    setFaculty((prev) => prev.filter((f) => f.id !== id));
  };

  // --- Department Actions ---
  const addDepartment = (deptData) => {
    const newDept = {
      ...deptData,
      id: `DEP-${deptData.code.toUpperCase()}`
    };
    setDepartments((prev) => [...prev, newDept]);
  };

  const updateDepartment = (id, updates) => {
    setDepartments((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
  };

  const deleteDepartment = (id) => {
    setDepartments((prev) => prev.filter((d) => d.id !== id));
  };

  // --- Notice Actions ---
  const addNotice = (noticeData) => {
    const newNotice = {
      ...noticeData,
      id: `NOT-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0]
    };
    setNotices((prev) => [newNotice, ...prev]);
    return newNotice;
  };

  const updateNotice = (id, updates) => {
    setNotices((prev) => prev.map((n) => (n.id === id ? { ...n, ...updates } : n)));
  };

  const deleteNotice = (id) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  };

  // --- Attendance Actions ---
  const submitAttendanceBatch = ({ subjectCode, date, attendanceMap }) => {
    // Update student subject summary
    setStudentAttendance((prev) =>
      prev.map((item) => {
        if (item.subjectCode === subjectCode) {
          const isPresent = attendanceMap['STU-001'] !== 'Absent';
          const newTotal = item.totalClasses + 1;
          const newAttended = isPresent ? item.attendedClasses + 1 : item.attendedClasses;
          const newLogs = [{ date, status: isPresent ? 'Present' : 'Absent' }, ...item.recentLogs];
          return {
            ...item,
            totalClasses: newTotal,
            attendedClasses: newAttended,
            percentage: Number(((newAttended / newTotal) * 100).toFixed(1)),
            recentLogs: newLogs.slice(0, 10)
          };
        }
        return item;
      })
    );
  };

  // --- Marks Actions ---
  const updateStudentSubjectMarks = (subjectCode, updatedScores) => {
    setStudentMarks((prev) =>
      prev.map((m) => {
        if (m.subjectCode === subjectCode) {
          const combined = { ...m, ...updatedScores };
          const internalTotal = (Number(combined.internal1) || 0) + (Number(combined.internal2) || 0); // 60
          const assignmentTotal = Number(combined.assignment) || 0; // 20
          const finalScore = Number(combined.finalExam) || 0; // 100
          const totalScore = Math.round((internalTotal / 60) * 30 + assignmentTotal + (finalScore / 100) * 50);

          let grade = 'B';
          let gradePoint = 7;
          if (totalScore >= 90) { grade = 'A+'; gradePoint = 10; }
          else if (totalScore >= 80) { grade = 'A'; gradePoint = 9; }
          else if (totalScore >= 70) { grade = 'B+'; gradePoint = 8; }
          else if (totalScore >= 60) { grade = 'B'; gradePoint = 7; }
          else if (totalScore >= 50) { grade = 'C'; gradePoint = 6; }
          else { grade = 'F'; gradePoint = 0; }

          return { ...combined, totalScore, grade, gradePoint };
        }
        return m;
      })
    );
  };

  // --- Hostel Actions ---
  const applyHostel = (applicationData) => {
    const newApp = {
      ...applicationData,
      id: `HAPP-${Date.now().toString().slice(-4)}`,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    setHostelApplications((prev) => [newApp, ...prev]);

    // Update student status to Applied
    updateStudent(applicationData.studentId, { hostelStatus: 'Applied' });
    return newApp;
  };

  const approveHostelApplication = (appId, assignedRoomNo) => {
    const app = hostelApplications.find((a) => a.id === appId);
    if (!app) return;

    // Update application
    setHostelApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: 'Approved', assignedRoom: assignedRoomNo } : a))
    );

    // Update Room occupancy
    setHostelRooms((prev) =>
      prev.map((room) => {
        if (room.roomNo === assignedRoomNo) {
          const newOccupied = room.occupied + 1;
          return {
            ...room,
            occupied: newOccupied,
            status: newOccupied >= room.capacity ? 'Occupied' : 'Available',
            residents: [...(room.residents || []), app.studentId]
          };
        }
        return room;
      })
    );

    // Update Student
    updateStudent(app.studentId, {
      hostelStatus: 'Allocated',
      hostelRoom: assignedRoomNo
    });
  };

  const rejectHostelApplication = (appId, rejectionReason) => {
    const app = hostelApplications.find((a) => a.id === appId);
    if (!app) return;

    setHostelApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: 'Rejected', rejectionReason } : a))
    );

    updateStudent(app.studentId, { hostelStatus: 'None' });
  };

  const addHostelRoom = (roomData) => {
    const newRoom = {
      ...roomData,
      id: `RM-${Date.now().toString().slice(-4)}`,
      occupied: 0,
      status: 'Available',
      residents: []
    };
    setHostelRooms((prev) => [...prev, newRoom]);
  };

  const updateHostelRoom = (id, updates) => {
    setHostelRooms((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const deleteHostelRoom = (id) => {
    setHostelRooms((prev) => prev.filter((r) => r.id !== id));
  };

  const addHostelComplaint = (complaintData) => {
    const newComplaint = {
      ...complaintData,
      id: `CMP-${Date.now().toString().slice(-4)}`,
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'Open'
    };
    setHostelComplaints((prev) => [newComplaint, ...prev]);
    return newComplaint;
  };

  const updateHostelComplaintStatus = (id, newStatus) => {
    setHostelComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
  };

  // --- Transport Actions ---
  const applyTransport = (applicationData) => {
    const newApp = {
      ...applicationData,
      id: `TAPP-${Date.now().toString().slice(-4)}`,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    setTransportApplications((prev) => [newApp, ...prev]);

    // Update student status to Applied
    updateStudent(applicationData.studentId, { transportStatus: 'Applied' });
    return newApp;
  };

  const approveTransportApplication = (appId, assignedBusNo, assignedStop) => {
    const app = transportApplications.find((a) => a.id === appId);
    if (!app) return;

    setTransportApplications((prev) =>
      prev.map((a) =>
        a.id === appId
          ? { ...a, status: 'Approved', assignedBus: assignedBusNo, assignedStop }
          : a
      )
    );

    // Update bus occupancy
    setBuses((prev) =>
      prev.map((bus) => {
        if (bus.busNo === assignedBusNo) {
          return { ...bus, occupiedSeats: Math.min(bus.capacity, bus.occupiedSeats + 1) };
        }
        return bus;
      })
    );

    // Update student
    updateStudent(app.studentId, {
      transportStatus: 'Allocated',
      transportBus: assignedBusNo
    });
  };

  const rejectTransportApplication = (appId, reason) => {
    const app = transportApplications.find((a) => a.id === appId);
    if (!app) return;

    setTransportApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: 'Rejected', rejectionReason: reason } : a))
    );

    updateStudent(app.studentId, { transportStatus: 'None' });
  };

  const addBus = (busData) => {
    const newBus = {
      ...busData,
      id: `BUS-${Date.now().toString().slice(-4)}`,
      occupiedSeats: 0,
      fuelStatus: '100%'
    };
    setBuses((prev) => [...prev, newBus]);
  };

  const updateBus = (id, updates) => {
    setBuses((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const deleteBus = (id) => {
    setBuses((prev) => prev.filter((b) => b.id !== id));
  };

  const addRoute = (routeData) => {
    const newRoute = {
      ...routeData,
      id: `RT-${Date.now().toString().slice(-4)}`
    };
    setRoutes((prev) => [...prev, newRoute]);
  };

  const updateRoute = (id, updates) => {
    setRoutes((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const deleteRoute = (id) => {
    setRoutes((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <ERPContext.Provider
      value={{
        students,
        faculty,
        departments,
        notices,
        studentAttendance,
        studentMarks,
        timetable,
        hostelRooms,
        hostelApplications,
        hostelComplaints,
        buses,
        routes,
        transportApplications,
        resetToMockData,
        // Actions
        addStudent,
        updateStudent,
        deleteStudent,
        addFaculty,
        updateFaculty,
        deleteFaculty,
        addDepartment,
        updateDepartment,
        deleteDepartment,
        addNotice,
        updateNotice,
        deleteNotice,
        submitAttendanceBatch,
        updateStudentSubjectMarks,
        applyHostel,
        approveHostelApplication,
        rejectHostelApplication,
        addHostelRoom,
        updateHostelRoom,
        deleteHostelRoom,
        addHostelComplaint,
        updateHostelComplaintStatus,
        applyTransport,
        approveTransportApplication,
        rejectTransportApplication,
        addBus,
        updateBus,
        deleteBus,
        addRoute,
        updateRoute,
        deleteRoute
      }}
    >
      {children}
    </ERPContext.Provider>
  );
};

export const useERP = () => {
  const context = useContext(ERPContext);
  if (!context) {
    throw new Error('useERP must be used within an ERPProvider');
  }
  return context;
};
