// Centralized API Service for College ERP

const getBaseUrl = () => {
  let url = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');
  if (url) {
    if (!url.endsWith('/api')) url += '/api';
    return url;
  }
  // In development, default to local backend server
  return import.meta.env.DEV ? 'http://localhost:5000/api' : '/api';
};

export const API_BASE_URL = getBaseUrl();

// Generic HTTP helper with full error detail extraction
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMsg = (data && (data.error || data.message || data.details)) || response.statusText || 'API Request failed';
      const error = new Error(errorMsg);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`API Error on [${options.method || 'GET'}] ${url}:`, error.message);
    throw error;
  }
}

export const api = {
  // Health & Diagnostics
  checkHealth: () => request('/health'),

  // Auth
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  // Users
  getUsers: () => request('/users'),
  updateUser: (id, updates) => request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),

  // Students
  getStudents: () => request('/students'),
  getStudent: (id) => request(`/students/${id}`),
  createStudent: (studentData) => request('/students', { method: 'POST', body: JSON.stringify(studentData) }),
  updateStudent: (id, updates) => request(`/students/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  deleteStudent: (id) => request(`/students/${id}`, { method: 'DELETE' }),

  // Faculty
  getFaculty: () => request('/faculty'),
  createFaculty: (data) => request('/faculty', { method: 'POST', body: JSON.stringify(data) }),
  updateFaculty: (id, updates) => request(`/faculty/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  deleteFaculty: (id) => request(`/faculty/${id}`, { method: 'DELETE' }),

  // Departments
  getDepartments: () => request('/departments'),
  createDepartment: (data) => request('/departments', { method: 'POST', body: JSON.stringify(data) }),
  updateDepartment: (id, updates) => request(`/departments/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  deleteDepartment: (id) => request(`/departments/${id}`, { method: 'DELETE' }),

  // Notices
  getNotices: () => request('/notices'),
  createNotice: (data) => request('/notices', { method: 'POST', body: JSON.stringify(data) }),
  updateNotice: (id, updates) => request(`/notices/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  deleteNotice: (id) => request(`/notices/${id}`, { method: 'DELETE' }),

  // Attendance
  getAttendance: () => request('/attendance'),
  submitAttendanceBatch: (batchData) => request('/attendance/batch', { method: 'POST', body: JSON.stringify(batchData) }),

  // Marks
  getMarks: () => request('/marks'),
  updateSubjectMarks: (subjectCode, scores) => request(`/marks/subject/${subjectCode}`, { method: 'PUT', body: JSON.stringify(scores) }),

  // Timetable
  getTimetable: () => request('/timetable'),
  updateTimetable: (data) => request('/timetable', { method: 'PUT', body: JSON.stringify(data) }),

  // Hostel Rooms
  getHostelRooms: () => request('/rooms'),
  createHostelRoom: (data) => request('/rooms', { method: 'POST', body: JSON.stringify(data) }),
  updateHostelRoom: (id, updates) => request(`/rooms/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  deleteHostelRoom: (id) => request(`/rooms/${id}`, { method: 'DELETE' }),

  // Hostel Applications
  getHostelApplications: () => request('/hostel-applications'),
  applyHostel: (data) => request('/hostel-applications', { method: 'POST', body: JSON.stringify(data) }),
  approveHostelApplication: (id, assignedRoomNo) => request(`/hostel-applications/${id}/approve`, { method: 'POST', body: JSON.stringify({ assignedRoomNo }) }),
  rejectHostelApplication: (id, rejectionReason) => request(`/hostel-applications/${id}/reject`, { method: 'POST', body: JSON.stringify({ rejectionReason }) }),

  // Hostel Complaints
  getHostelComplaints: () => request('/complaints'),
  createHostelComplaint: (data) => request('/complaints', { method: 'POST', body: JSON.stringify(data) }),
  updateHostelComplaintStatus: (id, status) => request(`/complaints/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }),

  // Buses
  getBuses: () => request('/buses'),
  createBus: (data) => request('/buses', { method: 'POST', body: JSON.stringify(data) }),
  updateBus: (id, updates) => request(`/buses/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  deleteBus: (id) => request(`/buses/${id}`, { method: 'DELETE' }),

  // Routes
  getRoutes: () => request('/routes'),
  createRoute: (data) => request('/routes', { method: 'POST', body: JSON.stringify(data) }),
  updateRoute: (id, updates) => request(`/routes/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  deleteRoute: (id) => request(`/routes/${id}`, { method: 'DELETE' }),

  // Transport Applications
  getTransportApplications: () => request('/transport-applications'),
  applyTransport: (data) => request('/transport-applications', { method: 'POST', body: JSON.stringify(data) }),
  approveTransportApplication: (id, assignedBusNo, assignedStop) => request(`/transport-applications/${id}/approve`, { method: 'POST', body: JSON.stringify({ assignedBusNo, assignedStop }) }),
  rejectTransportApplication: (id, reason) => request(`/transport-applications/${id}/reject`, { method: 'POST', body: JSON.stringify({ reason }) })
};

export default api;
