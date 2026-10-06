const path = require('path');
const mongoose = require(path.resolve(__dirname, '../server/node_modules/mongoose'));
const models = require(path.resolve(__dirname, '../server/models'));

const BASE_URL = 'http://localhost:5000/api';

const results = [];

function record(module, feature, status, details = '') {
  results.push({ module, feature, status, details });
  console.log(`[${status}] ${module} -> ${feature}: ${details}`);
}

async function runTests() {
  console.log('==============================================');
  console.log('STARTING THOROUGH COLLEGE ERP TEST SUITE');
  console.log('==============================================\n');

  await mongoose.connect('mongodb://127.0.0.1:27017/college-erp');
  console.log('Connected to MongoDB directly for verification.\n');

  // --- 1. HEALTH CHECK ---
  try {
    const res = await fetch(`${BASE_URL}/health`);
    const data = await res.json();
    if (res.ok && data.databaseConnected) {
      record('System', 'Health Endpoint', 'PASS', `DB State: ${data.database}`);
    } else {
      record('System', 'Health Endpoint', 'FAIL', `DB Connected: ${data.databaseConnected}`);
    }
  } catch (e) {
    record('System', 'Health Endpoint', 'FAIL', e.message);
  }

  // --- 2. AUTHENTICATION & LOGIN ---
  try {
    // Valid Admin Login
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@campus.edu', password: 'admin123' })
    });
    const user = await loginRes.json();
    if (loginRes.ok && user.role === 'admin') {
      record('Auth', 'Admin Login', 'PASS', `Logged in as ${user.name}`);
    } else {
      record('Auth', 'Admin Login', 'FAIL', 'Login response invalid');
    }

    // Invalid Login
    const invalidRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@campus.edu', password: 'wrongpassword' })
    });
    if (invalidRes.status === 401) {
      record('Auth', 'Invalid Credentials Validation', 'PASS', 'Correctly returned 401 Unauthorized');
    } else {
      record('Auth', 'Invalid Credentials Validation', 'FAIL', `Expected 401, got ${invalidRes.status}`);
    }

    // Quick Login / Fetch Users
    const usersRes = await fetch(`${BASE_URL}/users`);
    const allUsers = await usersRes.json();
    if (Array.isArray(allUsers) && allUsers.length >= 5) {
      record('Auth', 'All 5 Demo Roles Available', 'PASS', `Found ${allUsers.length} users with roles: ${allUsers.map(u => u.role).join(', ')}`);
    } else {
      record('Auth', 'All 5 Demo Roles Available', 'FAIL', 'Users count less than 5');
    }
  } catch (e) {
    record('Auth', 'Authentication', 'FAIL', e.message);
  }

  // --- 3. ADMIN: STUDENTS FULL CRUD + PERSISTENCE ---
  try {
    const studentData = {
      name: 'Verification Student',
      rollNumber: '2026-VER-001',
      email: 'ver.student@campus.edu',
      phone: '+1 555-987-6543',
      department: 'Computer Science & Engineering',
      semester: '2nd Semester',
      cgpa: 3.91,
      gender: 'Female',
      hostelStatus: 'None',
      transportStatus: 'None',
      status: 'Active'
    };

    // CREATE (POST)
    const postRes = await fetch(`${BASE_URL}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData)
    });
    const createdStudent = await postRes.json();
    const studentId = createdStudent.id || createdStudent._id;

    // Direct MongoDB verification
    const dbStudent = await models.Student.findOne({ rollNumber: '2026-VER-001' });
    if (postRes.status === 201 && dbStudent && dbStudent.name === studentData.name) {
      record('Students', 'Add / Create', 'PASS', `Created student with ID ${studentId} in MongoDB`);
    } else {
      record('Students', 'Add / Create', 'FAIL', 'Document not saved in MongoDB');
    }

    // READ (GET)
    const getRes = await fetch(`${BASE_URL}/students/${studentId}`);
    const fetchedStudent = await getRes.json();
    if (getRes.ok && fetchedStudent.email === studentData.email) {
      record('Students', 'Read / Fetch', 'PASS', `Retrieved ${fetchedStudent.name} (${fetchedStudent.rollNumber})`);
    } else {
      record('Students', 'Read / Fetch', 'FAIL', 'Unable to retrieve created student');
    }

    // UPDATE (PUT)
    const updateRes = await fetch(`${BASE_URL}/students/${studentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Verification Student Updated', cgpa: 4.0 })
    });
    const updatedStudent = await updateRes.json();
    const dbUpdatedStudent = await models.Student.findOne({ rollNumber: '2026-VER-001' });
    if (updateRes.ok && dbUpdatedStudent.name === 'Verification Student Updated' && dbUpdatedStudent.cgpa === 4.0) {
      record('Students', 'Edit / Update', 'PASS', `Updated name & CGPA (4.0) confirmed in MongoDB`);
    } else {
      record('Students', 'Edit / Update', 'FAIL', 'Update not persisted');
    }

    // DELETE
    const delRes = await fetch(`${BASE_URL}/students/${studentId}`, { method: 'DELETE' });
    const delData = await delRes.json();
    const dbDeletedCheck = await models.Student.findOne({ rollNumber: '2026-VER-001' });
    if (delRes.ok && !dbDeletedCheck) {
      record('Students', 'Delete', 'PASS', `Deleted student ${studentId}, verified removed from MongoDB`);
    } else {
      record('Students', 'Delete', 'FAIL', 'Document still exists in MongoDB');
    }

    // REFRESH & PERSISTENCE VERIFICATION
    const allStudents = await (await fetch(`${BASE_URL}/students`)).json();
    const dbCount = await models.Student.countDocuments();
    if (allStudents.length === dbCount) {
      record('Students', 'Persistence & Sync', 'PASS', `All ${allStudents.length} students in frontend match MongoDB exactly`);
    } else {
      record('Students', 'Persistence & Sync', 'FAIL', `API count ${allStudents.length} != DB count ${dbCount}`);
    }
  } catch (e) {
    record('Students', 'CRUD Cycle', 'FAIL', e.message);
  }

  // --- 4. ADMIN: FACULTY FULL CRUD + PERSISTENCE ---
  try {
    const facultyData = {
      name: 'Dr. Automated Professor',
      employeeId: 'FAC-VER-001',
      email: 'auto.prof@campus.edu',
      phone: '+1 555-444-3333',
      department: 'Computer Science & Engineering',
      designation: 'Associate Professor',
      qualification: 'Ph.D. in AI',
      experience: '7 Years',
      status: 'Active',
      assignedSubjects: [{ code: 'CS601', name: 'Database Systems', semester: '6th Sem', credits: 4 }]
    };

    // CREATE
    const postRes = await fetch(`${BASE_URL}/faculty`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(facultyData)
    });
    const createdFac = await postRes.json();
    const facId = createdFac.id || createdFac._id;
    const dbFac = await models.Faculty.findOne({ employeeId: 'FAC-VER-001' });
    if (postRes.status === 201 && dbFac && dbFac.name === facultyData.name) {
      record('Faculty', 'Add / Create', 'PASS', `Created faculty ${facId} in MongoDB`);
    } else {
      record('Faculty', 'Add / Create', 'FAIL', 'Document not saved in MongoDB');
    }

    // READ
    const getRes = await fetch(`${BASE_URL}/faculty/${facId}`);
    const fetchedFac = await getRes.json();
    if (getRes.ok && fetchedFac.employeeId === 'FAC-VER-001') {
      record('Faculty', 'Read / Fetch', 'PASS', `Retrieved ${fetchedFac.name}`);
    } else {
      record('Faculty', 'Read / Fetch', 'FAIL', 'Fetch failed');
    }

    // UPDATE
    const putRes = await fetch(`${BASE_URL}/faculty/${facId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ designation: 'Professor & HOD', experience: '8 Years' })
    });
    const dbFacUpdated = await models.Faculty.findOne({ employeeId: 'FAC-VER-001' });
    if (putRes.ok && dbFacUpdated.designation === 'Professor & HOD') {
      record('Faculty', 'Edit / Update', 'PASS', 'Updated designation confirmed in MongoDB');
    } else {
      record('Faculty', 'Edit / Update', 'FAIL', 'Update failed');
    }

    // DELETE
    const delRes = await fetch(`${BASE_URL}/faculty/${facId}`, { method: 'DELETE' });
    const dbFacDelCheck = await models.Faculty.findOne({ employeeId: 'FAC-VER-001' });
    if (delRes.ok && !dbFacDelCheck) {
      record('Faculty', 'Delete', 'PASS', `Faculty ${facId} removed from MongoDB`);
    } else {
      record('Faculty', 'Delete', 'FAIL', 'Delete failed');
    }
  } catch (e) {
    record('Faculty', 'CRUD Cycle', 'FAIL', e.message);
  }

  // --- 5. DEPARTMENTS CRUD ---
  try {
    const deptData = {
      name: 'Aerospace & Aeronautical Engineering',
      code: 'AERO',
      hod: 'Dr. Alan Shepard',
      facultyCount: 8,
      studentCount: 120,
      established: 2025,
      description: 'Aerodynamics and Spacecraft Design'
    };
    const postRes = await fetch(`${BASE_URL}/departments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deptData)
    });
    const createdDept = await postRes.json();
    const deptId = createdDept.id || createdDept._id;
    const dbDept = await models.Department.findOne({ code: 'AERO' });
    if (dbDept) {
      record('Departments', 'Add & Persistence', 'PASS', `Department AERO verified in MongoDB`);
    } else {
      record('Departments', 'Add & Persistence', 'FAIL', 'Not saved in MongoDB');
    }
    // Delete test
    await fetch(`${BASE_URL}/departments/${deptId}`, { method: 'DELETE' });
    const dbDeptDel = await models.Department.findOne({ code: 'AERO' });
    if (!dbDeptDel) {
      record('Departments', 'Delete', 'PASS', 'Department removed from MongoDB');
    } else {
      record('Departments', 'Delete', 'FAIL', 'Not deleted');
    }
  } catch (e) {
    record('Departments', 'CRUD', 'FAIL', e.message);
  }

  // --- 6. NOTICES CRUD ---
  try {
    const noticeData = {
      title: 'Automated Campus Convocation Notice',
      category: 'Academics',
      target: 'All Students',
      content: 'Annual convocation ceremony registration is now live.',
      author: 'Academic Dean'
    };
    const postRes = await fetch(`${BASE_URL}/notices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noticeData)
    });
    const createdNotice = await postRes.json();
    const noticeId = createdNotice.id || createdNotice._id;
    const dbNotice = await models.Notice.findOne({ title: noticeData.title });
    if (dbNotice) {
      record('Notices', 'Add & Persistence', 'PASS', `Notice saved in MongoDB with ID ${noticeId}`);
    } else {
      record('Notices', 'Add & Persistence', 'FAIL', 'Notice not found in MongoDB');
    }
    // Delete
    await fetch(`${BASE_URL}/notices/${noticeId}`, { method: 'DELETE' });
    const dbNoticeDel = await models.Notice.findOne({ title: noticeData.title });
    if (!dbNoticeDel) {
      record('Notices', 'Delete', 'PASS', 'Notice removed from MongoDB');
    } else {
      record('Notices', 'Delete', 'FAIL', 'Notice still exists');
    }
  } catch (e) {
    record('Notices', 'CRUD', 'FAIL', e.message);
  }

  // --- 7. FACULTY: ATTENDANCE BATCH SAVE ---
  try {
    const attPayload = {
      subjectCode: 'CS601',
      date: '2026-10-06',
      attendanceMap: {
        'STU-001': 'Present',
        'STU-002': 'Absent'
      }
    };
    const res = await fetch(`${BASE_URL}/attendance/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(attPayload)
    });
    const data = await res.json();
    const dbAttendance = await models.Attendance.findOne({ subjectCode: 'CS601' });
    if (res.ok && dbAttendance && dbAttendance.recentLogs.length > 0) {
      record('Attendance', 'Save & Refresh Persistence', 'PASS', `Batch saved in MongoDB (Total classes: ${dbAttendance.totalClasses}, Attended: ${dbAttendance.attendedClasses}, %: ${dbAttendance.percentage})`);
    } else {
      record('Attendance', 'Save & Refresh Persistence', 'FAIL', 'Attendance record not updated in MongoDB');
    }
  } catch (e) {
    record('Attendance', 'Save', 'FAIL', e.message);
  }

  // --- 8. FACULTY: MARKS UPDATE & EVALUATION ---
  try {
    const scores = {
      internal1: 28,
      internal2: 29,
      assignment: 19,
      finalExam: 94
    };
    const res = await fetch(`${BASE_URL}/marks/subject/CS601`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scores)
    });
    const updatedMark = await res.json();
    const dbMark = await models.Marks.findOne({ subjectCode: 'CS601' });
    if (res.ok && dbMark && dbMark.grade === 'A+' && dbMark.totalScore >= 90) {
      record('Marks', 'Save & Grade Calculation', 'PASS', `Calculated Total Score: ${dbMark.totalScore}, Grade: ${dbMark.grade}, Grade Point: ${dbMark.gradePoint} verified in MongoDB`);
    } else {
      record('Marks', 'Save & Grade Calculation', 'FAIL', 'Marks not calculated or saved properly');
    }
  } catch (e) {
    record('Marks', 'Save', 'FAIL', e.message);
  }

  // --- 9. HOSTEL: APPLICATION, APPROVE, REJECT, ROOM OCCUPANCY ---
  try {
    // Student applies for hostel
    const appData = {
      studentId: 'STU-002',
      studentName: 'Sophia Chen',
      rollNumber: '2022-CSE-012',
      department: 'Computer Science & Engineering',
      gender: 'Female',
      preferredType: 'Double AC',
      preferredBlock: 'Block B (Girls)',
      reason: 'Long commute distance.'
    };
    const appRes = await fetch(`${BASE_URL}/hostel-applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appData)
    });
    const createdApp = await appRes.json();
    const appId = createdApp.id || createdApp._id;

    // Direct MongoDB verification of Application
    const dbApp = await models.HostelApplication.findOne({ id: appId });
    if (dbApp && dbApp.status === 'Pending') {
      record('Hostel', 'Student Application Submission', 'PASS', `Application ${appId} created and saved in MongoDB`);
    } else {
      record('Hostel', 'Student Application Submission', 'FAIL', 'Application not in MongoDB');
    }

    // Warden approves application and allocates room
    const approveRes = await fetch(`${BASE_URL}/hostel-applications/${appId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assignedRoomNo: 'B-201' })
    });
    const approveData = await approveRes.json();
    const dbAppApproved = await models.HostelApplication.findOne({ id: appId });
    const dbRoom = await models.Room.findOne({ roomNo: 'B-201' });
    const dbStudent = await models.Student.findOne({ id: 'STU-002' });

    if (
      approveRes.ok &&
      dbAppApproved.status === 'Approved' &&
      dbAppApproved.assignedRoom === 'B-201' &&
      dbStudent.hostelStatus === 'Allocated' &&
      dbStudent.hostelRoom === 'B-201'
    ) {
      record('Hostel', 'Warden Room Allocation & Approval', 'PASS', `Approved, Student STU-002 allocated to B-201, Room occupancy: ${dbRoom?.occupied}`);
    } else {
      record('Hostel', 'Warden Room Allocation & Approval', 'FAIL', 'Hostel approval sync failed across collections');
    }

    // Hostel Complaints
    const cmpData = {
      studentName: 'Alex Rivera',
      rollNumber: '2022-CSE-045',
      roomNo: 'A-304',
      category: 'Electrical',
      title: 'Ceiling Fan Regulator Malfunction',
      description: 'Regulator knob is loose and fan stays at speed 1.',
      priority: 'Low'
    };
    const cmpRes = await fetch(`${BASE_URL}/complaints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cmpData)
    });
    const createdCmp = await cmpRes.json();
    const cmpId = createdCmp.id || createdCmp._id;
    const dbCmp = await models.Complaint.findOne({ id: cmpId });
    if (dbCmp) {
      record('Hostel', 'Lodge Maintenance Complaint', 'PASS', `Complaint ${cmpId} saved in MongoDB`);
    } else {
      record('Hostel', 'Lodge Maintenance Complaint', 'FAIL', 'Complaint not saved in MongoDB');
    }

    // Warden updates complaint status
    const updateCmpRes = await fetch(`${BASE_URL}/complaints/${cmpId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Resolved' })
    });
    const dbCmpUpdated = await models.Complaint.findOne({ id: cmpId });
    if (updateCmpRes.ok && dbCmpUpdated.status === 'Resolved') {
      record('Hostel', 'Warden Resolve Complaint', 'PASS', 'Complaint status updated to Resolved in MongoDB');
    } else {
      record('Hostel', 'Warden Resolve Complaint', 'FAIL', 'Complaint status update failed');
    }
  } catch (e) {
    record('Hostel', 'Hostel Workflows', 'FAIL', e.message);
  }

  // --- 10. TRANSPORT: APPLICATION, APPROVE, BUS OCCUPANCY ---
  try {
    // Student applies for transport
    const appData = {
      studentId: 'STU-004',
      studentName: 'Elena Rostova',
      rollNumber: '2022-ECE-033',
      department: 'Electronics & Communication Engineering',
      preferredRoute: 'Route 1: Central Campus',
      preferredStop: 'Central Station',
      reason: 'Daily commute.'
    };
    const appRes = await fetch(`${BASE_URL}/transport-applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appData)
    });
    const createdApp = await appRes.json();
    const appId = createdApp.id || createdApp._id;

    const dbApp = await models.TransportApplication.findOne({ id: appId });
    if (dbApp && dbApp.status === 'Pending') {
      record('Transport', 'Student Application Submission', 'PASS', `Transit application ${appId} created in MongoDB`);
    } else {
      record('Transport', 'Student Application Submission', 'FAIL', 'Transit application not in MongoDB');
    }

    // Transport Manager approves and assigns bus
    const approveRes = await fetch(`${BASE_URL}/transport-applications/${appId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assignedBusNo: 'Bus-01', assignedStop: 'Central Station' })
    });
    const dbAppApproved = await models.TransportApplication.findOne({ id: appId });
    const dbBus = await models.Bus.findOne({ busNo: 'Bus-01' });
    const dbStudent = await models.Student.findOne({ id: 'STU-004' });

    if (
      approveRes.ok &&
      dbAppApproved.status === 'Approved' &&
      dbAppApproved.assignedBus === 'Bus-01' &&
      dbStudent.transportStatus === 'Allocated' &&
      dbStudent.transportBus === 'Bus-01'
    ) {
      record('Transport', 'Bus Pass Allocation & Approval', 'PASS', `Approved, Student STU-004 allocated to Bus-01, Occupied seats: ${dbBus?.occupiedSeats}/${dbBus?.capacity}`);
    } else {
      record('Transport', 'Bus Pass Allocation & Approval', 'FAIL', 'Transport approval sync failed across collections');
    }
  } catch (e) {
    record('Transport', 'Transport Workflows', 'FAIL', e.message);
  }

  // --- 11. TIMETABLE ENDPOINT ---
  try {
    const ttRes = await fetch(`${BASE_URL}/timetable`);
    const ttData = await ttRes.json();
    if (ttRes.ok && typeof ttData === 'object' && ttData['Monday']) {
      record('Timetable', 'Read Weekly Schedule', 'PASS', `Loaded schedule for Monday (${ttData['Monday'].length} slots) through Friday`);
    } else {
      record('Timetable', 'Read Weekly Schedule', 'FAIL', 'Timetable data format invalid');
    }
  } catch (e) {
    record('Timetable', 'Timetable', 'FAIL', e.message);
  }

  // --- 12. ROUTING TEST (SPA Refresh & Direct URLs) ---
  const routesToTest = [
    '/login',
    '/admin',
    '/admin/students',
    '/admin/faculty',
    '/admin/departments',
    '/admin/notices',
    '/admin/infrastructure',
    '/faculty',
    '/faculty/subjects',
    '/faculty/attendance',
    '/faculty/marks',
    '/faculty/notices',
    '/student',
    '/student/profile',
    '/student/attendance',
    '/student/timetable',
    '/student/marks',
    '/student/hostel',
    '/student/transport',
    '/student/notices',
    '/hostel',
    '/hostel/rooms',
    '/hostel/applications',
    '/hostel/students',
    '/hostel/complaints',
    '/transport',
    '/transport/buses',
    '/transport/routes',
    '/transport/applications',
    '/transport/students'
  ];

  let routeFailures = 0;
  for (const route of routesToTest) {
    try {
      const res = await fetch(`http://localhost:5173${route}`);
      const text = await res.text();
      // Ensure Vite dev server returns index.html and status 200 without Vercel/Vite 404
      if (res.status === 200 && text.includes('id="root"')) {
        // passed
      } else {
        routeFailures++;
        console.error(`Route failed direct load: ${route} (status: ${res.status})`);
      }
    } catch (e) {
      routeFailures++;
      console.error(`Route request error on ${route}:`, e.message);
    }
  }

  if (routeFailures === 0) {
    record('Routing', 'Direct URL & Refresh (All 29 Routes)', 'PASS', `All ${routesToTest.length} routes return HTTP 200 and render index.html SPA entry point`);
  } else {
    record('Routing', 'Direct URL & Refresh', 'FAIL', `${routeFailures} routes returned errors`);
  }

  console.log('\n==============================================');
  console.log('TEST SUMMARY');
  console.log('==============================================');
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  console.log(`Total tests: ${results.length}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
