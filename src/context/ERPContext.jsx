import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
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
  const [isLoading, setIsLoading] = useState(true);
  const [isDbConnected, setIsDbConnected] = useState(false);

  // Sync to local fallback storage whenever state updates
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

  // Load latest data from MongoDB Atlas on mount or refresh
  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const results = await Promise.allSettled([
        api.getStudents(),
        api.getFaculty(),
        api.getDepartments(),
        api.getNotices(),
        api.getAttendance(),
        api.getMarks(),
        api.getTimetable(),
        api.getHostelRooms(),
        api.getHostelApplications(),
        api.getHostelComplaints(),
        api.getBuses(),
        api.getRoutes(),
        api.getTransportApplications()
      ]);

      let anySuccess = false;

      if (results[0].status === 'fulfilled' && Array.isArray(results[0].value)) {
        setStudents(results[0].value);
        anySuccess = true;
      }
      if (results[1].status === 'fulfilled' && Array.isArray(results[1].value)) {
        setFaculty(results[1].value);
        anySuccess = true;
      }
      if (results[2].status === 'fulfilled' && Array.isArray(results[2].value)) {
        setDepartments(results[2].value);
        anySuccess = true;
      }
      if (results[3].status === 'fulfilled' && Array.isArray(results[3].value)) {
        setNotices(results[3].value);
        anySuccess = true;
      }
      if (results[4].status === 'fulfilled' && Array.isArray(results[4].value)) {
        setStudentAttendance(results[4].value);
        anySuccess = true;
      }
      if (results[5].status === 'fulfilled' && Array.isArray(results[5].value)) {
        setStudentMarks(results[5].value);
        anySuccess = true;
      }
      if (results[6].status === 'fulfilled' && results[6].value && typeof results[6].value === 'object') {
        setTimetable(results[6].value);
        anySuccess = true;
      }
      if (results[7].status === 'fulfilled' && Array.isArray(results[7].value)) {
        setHostelRooms(results[7].value);
        anySuccess = true;
      }
      if (results[8].status === 'fulfilled' && Array.isArray(results[8].value)) {
        setHostelApplications(results[8].value);
        anySuccess = true;
      }
      if (results[9].status === 'fulfilled' && Array.isArray(results[9].value)) {
        setHostelComplaints(results[9].value);
        anySuccess = true;
      }
      if (results[10].status === 'fulfilled' && Array.isArray(results[10].value)) {
        setBuses(results[10].value);
        anySuccess = true;
      }
      if (results[11].status === 'fulfilled' && Array.isArray(results[11].value)) {
        setRoutes(results[11].value);
        anySuccess = true;
      }
      if (results[12].status === 'fulfilled' && Array.isArray(results[12].value)) {
        setTransportApplications(results[12].value);
        anySuccess = true;
      }

      setIsDbConnected(anySuccess);
    } catch (error) {
      console.warn('Backend fetch note: using local cache while server starts up', error);
      setIsDbConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

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
  const addStudent = async (studentData) => {
    const payload = {
      ...studentData,
      id: `STU-${Date.now().toString().slice(-4)}`,
      hostelStatus: studentData.hostelStatus || 'None',
      hostelRoom: studentData.hostelRoom || null,
      transportStatus: studentData.transportStatus || 'None',
      transportBus: studentData.transportBus || null,
      status: 'Active'
    };

    try {
      const saved = await api.createStudent(payload);
      const studentToAdd = saved || payload;
      setStudents((prev) => [studentToAdd, ...prev]);
      return studentToAdd;
    } catch (error) {
      console.error('Error adding student to MongoDB:', error);
      throw error;
    }
  };

  const updateStudent = async (id, updates) => {
    try {
      const updated = await api.updateStudent(id, updates);
      setStudents((prev) => prev.map((s) => ((s.id === id || s._id === id) ? { ...s, ...(updated || updates) } : s)));
      return updated;
    } catch (error) {
      console.error('Error updating student in MongoDB:', error);
      throw error;
    }
  };

  const deleteStudent = async (id) => {
    try {
      await api.deleteStudent(id);
      setStudents((prev) => prev.filter((s) => s.id !== id && s._id !== id));
    } catch (error) {
      console.error('Error deleting student from MongoDB:', error);
      throw error;
    }
  };

  // --- Faculty Actions ---
  const addFaculty = async (facultyData) => {
    const payload = {
      ...facultyData,
      id: `FAC-${Date.now().toString().slice(-4)}`,
      status: 'Active',
      assignedSubjects: facultyData.assignedSubjects || []
    };

    try {
      const saved = await api.createFaculty(payload);
      const facultyToAdd = saved || payload;
      setFaculty((prev) => [facultyToAdd, ...prev]);
      return facultyToAdd;
    } catch (error) {
      console.error('Error adding faculty to MongoDB:', error);
      throw error;
    }
  };

  const updateFaculty = async (id, updates) => {
    try {
      const updated = await api.updateFaculty(id, updates);
      setFaculty((prev) => prev.map((f) => ((f.id === id || f._id === id) ? { ...f, ...(updated || updates) } : f)));
      return updated;
    } catch (error) {
      console.error('Error updating faculty in MongoDB:', error);
      throw error;
    }
  };

  const deleteFaculty = async (id) => {
    try {
      await api.deleteFaculty(id);
      setFaculty((prev) => prev.filter((f) => f.id !== id && f._id !== id));
    } catch (error) {
      console.error('Error deleting faculty from MongoDB:', error);
      throw error;
    }
  };

  // --- Department Actions ---
  const addDepartment = async (deptData) => {
    const payload = {
      ...deptData,
      id: `DEP-${(deptData.code || 'GEN').toUpperCase()}`
    };

    try {
      const saved = await api.createDepartment(payload);
      const deptToAdd = saved || payload;
      setDepartments((prev) => [...prev, deptToAdd]);
      return deptToAdd;
    } catch (error) {
      console.error('Error adding department to MongoDB:', error);
      throw error;
    }
  };

  const updateDepartment = async (id, updates) => {
    try {
      const updated = await api.updateDepartment(id, updates);
      setDepartments((prev) => prev.map((d) => ((d.id === id || d._id === id) ? { ...d, ...(updated || updates) } : d)));
      return updated;
    } catch (error) {
      console.error('Error updating department in MongoDB:', error);
      throw error;
    }
  };

  const deleteDepartment = async (id) => {
    try {
      await api.deleteDepartment(id);
      setDepartments((prev) => prev.filter((d) => d.id !== id && d._id !== id));
    } catch (error) {
      console.error('Error deleting department from MongoDB:', error);
      throw error;
    }
  };

  // --- Notice Actions ---
  const addNotice = async (noticeData) => {
    const payload = {
      ...noticeData,
      id: `NOT-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0]
    };

    try {
      const saved = await api.createNotice(payload);
      const noticeToAdd = saved || payload;
      setNotices((prev) => [noticeToAdd, ...prev]);
      return noticeToAdd;
    } catch (error) {
      console.error('Error adding notice to MongoDB:', error);
      throw error;
    }
  };

  const updateNotice = async (id, updates) => {
    try {
      const updated = await api.updateNotice(id, updates);
      setNotices((prev) => prev.map((n) => ((n.id === id || n._id === id) ? { ...n, ...(updated || updates) } : n)));
      return updated;
    } catch (error) {
      console.error('Error updating notice in MongoDB:', error);
      throw error;
    }
  };

  const deleteNotice = async (id) => {
    try {
      await api.deleteNotice(id);
      setNotices((prev) => prev.filter((n) => n.id !== id && n._id !== id));
    } catch (error) {
      console.error('Error deleting notice from MongoDB:', error);
      throw error;
    }
  };

  // --- Attendance Actions ---
  const submitAttendanceBatch = async ({ subjectCode, date, attendanceMap }) => {
    try {
      const updated = await api.submitAttendanceBatch({ subjectCode, date, attendanceMap });
      setStudentAttendance((prev) => {
        const index = prev.findIndex((item) => item.subjectCode === subjectCode);
        if (index >= 0) {
          const next = [...prev];
          next[index] = updated;
          return next;
        }
        return [updated, ...prev];
      });
      return updated;
    } catch (error) {
      console.error('Error submitting attendance to MongoDB:', error);
      throw error;
    }
  };

  // --- Marks Actions ---
  const updateStudentSubjectMarks = async (subjectCode, updatedScores) => {
    try {
      const updated = await api.updateSubjectMarks(subjectCode, updatedScores);
      setStudentMarks((prev) => {
        const index = prev.findIndex((m) => m.subjectCode === subjectCode);
        if (index >= 0) {
          const next = [...prev];
          next[index] = updated;
          return next;
        }
        return [updated, ...prev];
      });
      return updated;
    } catch (error) {
      console.error('Error updating marks in MongoDB:', error);
      throw error;
    }
  };

  // --- Hostel Actions ---
  const applyHostel = async (applicationData) => {
    const payload = {
      ...applicationData,
      id: `HAPP-${Date.now().toString().slice(-4)}`,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };

    try {
      const saved = await api.applyHostel(payload);
      const appToAdd = saved || payload;
      setHostelApplications((prev) => [appToAdd, ...prev]);

      // Update student status in local state & MongoDB
      await updateStudent(applicationData.studentId, { hostelStatus: 'Applied' });
      return appToAdd;
    } catch (error) {
      console.error('Error applying for hostel in MongoDB:', error);
      throw error;
    }
  };

  const approveHostelApplication = async (appId, assignedRoomNo) => {
    try {
      await api.approveHostelApplication(appId, assignedRoomNo);

      setHostelApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: 'Approved', assignedRoom: assignedRoomNo } : a))
      );

      const app = hostelApplications.find((a) => a.id === appId);
      if (app) {
        setHostelRooms((prev) =>
          prev.map((room) => {
            if (room.roomNo === assignedRoomNo) {
              const newOccupied = (room.occupied || 0) + 1;
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

        await updateStudent(app.studentId, {
          hostelStatus: 'Allocated',
          hostelRoom: assignedRoomNo
        });
      }
    } catch (error) {
      console.error('Error approving hostel application in MongoDB:', error);
      throw error;
    }
  };

  const rejectHostelApplication = async (appId, rejectionReason) => {
    try {
      await api.rejectHostelApplication(appId, rejectionReason);

      setHostelApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: 'Rejected', rejectionReason } : a))
      );

      const app = hostelApplications.find((a) => a.id === appId);
      if (app) {
        await updateStudent(app.studentId, { hostelStatus: 'None' });
      }
    } catch (error) {
      console.error('Error rejecting hostel application in MongoDB:', error);
      throw error;
    }
  };

  const addHostelRoom = async (roomData) => {
    const payload = {
      ...roomData,
      id: `RM-${Date.now().toString().slice(-4)}`,
      occupied: 0,
      status: 'Available',
      residents: []
    };

    try {
      const saved = await api.createHostelRoom(payload);
      const roomToAdd = saved || payload;
      setHostelRooms((prev) => [...prev, roomToAdd]);
      return roomToAdd;
    } catch (error) {
      console.error('Error adding hostel room to MongoDB:', error);
      throw error;
    }
  };

  const updateHostelRoom = async (id, updates) => {
    try {
      const updated = await api.updateHostelRoom(id, updates);
      setHostelRooms((prev) => prev.map((r) => ((r.id === id || r._id === id) ? { ...r, ...(updated || updates) } : r)));
      return updated;
    } catch (error) {
      console.error('Error updating hostel room in MongoDB:', error);
      throw error;
    }
  };

  const deleteHostelRoom = async (id) => {
    try {
      await api.deleteHostelRoom(id);
      setHostelRooms((prev) => prev.filter((r) => r.id !== id && r._id !== id));
    } catch (error) {
      console.error('Error deleting hostel room from MongoDB:', error);
      throw error;
    }
  };

  const addHostelComplaint = async (complaintData) => {
    const payload = {
      ...complaintData,
      id: `CMP-${Date.now().toString().slice(-4)}`,
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'Open'
    };

    try {
      const saved = await api.createHostelComplaint(payload);
      const cmpToAdd = saved || payload;
      setHostelComplaints((prev) => [cmpToAdd, ...prev]);
      return cmpToAdd;
    } catch (error) {
      console.error('Error adding hostel complaint to MongoDB:', error);
      throw error;
    }
  };

  const updateHostelComplaintStatus = async (id, newStatus) => {
    try {
      const updated = await api.updateHostelComplaintStatus(id, newStatus);
      setHostelComplaints((prev) =>
        prev.map((c) => ((c.id === id || c._id === id) ? { ...c, status: newStatus, ...(updated || {}) } : c))
      );
      return updated;
    } catch (error) {
      console.error('Error updating complaint in MongoDB:', error);
      throw error;
    }
  };

  // --- Transport Actions ---
  const applyTransport = async (applicationData) => {
    const payload = {
      ...applicationData,
      id: `TAPP-${Date.now().toString().slice(-4)}`,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };

    try {
      const saved = await api.applyTransport(payload);
      const appToAdd = saved || payload;
      setTransportApplications((prev) => [appToAdd, ...prev]);

      await updateStudent(applicationData.studentId, { transportStatus: 'Applied' });
      return appToAdd;
    } catch (error) {
      console.error('Error applying for transport in MongoDB:', error);
      throw error;
    }
  };

  const approveTransportApplication = async (appId, assignedBusNo, assignedStop) => {
    try {
      await api.approveTransportApplication(appId, assignedBusNo, assignedStop);

      setTransportApplications((prev) =>
        prev.map((a) =>
          a.id === appId
            ? { ...a, status: 'Approved', assignedBus: assignedBusNo, assignedStop }
            : a
        )
      );

      const app = transportApplications.find((a) => a.id === appId);
      if (app) {
        setBuses((prev) =>
          prev.map((bus) => {
            if (bus.busNo === assignedBusNo) {
              return { ...bus, occupiedSeats: Math.min(bus.capacity, (bus.occupiedSeats || 0) + 1) };
            }
            return bus;
          })
        );

        await updateStudent(app.studentId, {
          transportStatus: 'Allocated',
          transportBus: assignedBusNo
        });
      }
    } catch (error) {
      console.error('Error approving transport application in MongoDB:', error);
      throw error;
    }
  };

  const rejectTransportApplication = async (appId, reason) => {
    try {
      await api.rejectTransportApplication(appId, reason);

      setTransportApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: 'Rejected', rejectionReason: reason } : a))
      );

      const app = transportApplications.find((a) => a.id === appId);
      if (app) {
        await updateStudent(app.studentId, { transportStatus: 'None' });
      }
    } catch (error) {
      console.error('Error rejecting transport application in MongoDB:', error);
      throw error;
    }
  };

  const addBus = async (busData) => {
    const payload = {
      ...busData,
      id: `BUS-${Date.now().toString().slice(-4)}`,
      occupiedSeats: 0,
      fuelStatus: '100%'
    };

    try {
      const saved = await api.createBus(payload);
      const busToAdd = saved || payload;
      setBuses((prev) => [...prev, busToAdd]);
      return busToAdd;
    } catch (error) {
      console.error('Error adding bus to MongoDB:', error);
      throw error;
    }
  };

  const updateBus = async (id, updates) => {
    try {
      const updated = await api.updateBus(id, updates);
      setBuses((prev) => prev.map((b) => ((b.id === id || b._id === id) ? { ...b, ...(updated || updates) } : b)));
      return updated;
    } catch (error) {
      console.error('Error updating bus in MongoDB:', error);
      throw error;
    }
  };

  const deleteBus = async (id) => {
    try {
      await api.deleteBus(id);
      setBuses((prev) => prev.filter((b) => b.id !== id && b._id !== id));
    } catch (error) {
      console.error('Error deleting bus from MongoDB:', error);
      throw error;
    }
  };

  const addRoute = async (routeData) => {
    const payload = {
      ...routeData,
      id: `RT-${Date.now().toString().slice(-4)}`
    };

    try {
      const saved = await api.createRoute(payload);
      const routeToAdd = saved || payload;
      setRoutes((prev) => [...prev, routeToAdd]);
      return routeToAdd;
    } catch (error) {
      console.error('Error adding route to MongoDB:', error);
      throw error;
    }
  };

  const updateRoute = async (id, updates) => {
    try {
      const updated = await api.updateRoute(id, updates);
      setRoutes((prev) => prev.map((r) => ((r.id === id || r._id === id) ? { ...r, ...(updated || updates) } : r)));
      return updated;
    } catch (error) {
      console.error('Error updating route in MongoDB:', error);
      throw error;
    }
  };

  const deleteRoute = async (id) => {
    try {
      await api.deleteRoute(id);
      setRoutes((prev) => prev.filter((r) => r.id !== id && r._id !== id));
    } catch (error) {
      console.error('Error deleting route from MongoDB:', error);
      throw error;
    }
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
        isLoading,
        isDbConnected,
        refreshData: fetchAllData,
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
