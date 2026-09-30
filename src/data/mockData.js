// Comprehensive Initial Seed Data for College ERP

export const INITIAL_ROLES = [
  { id: 'admin', name: 'Administrator', badgeColor: 'bg-rose-100 text-rose-700 border-rose-200' },
  { id: 'faculty', name: 'Faculty Member', badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { id: 'student', name: 'Student', badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  { id: 'warden', name: 'Hostel Warden', badgeColor: 'bg-amber-100 text-amber-700 border-amber-200' },
  { id: 'transport', name: 'Transport Manager', badgeColor: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
];

export const MOCK_USERS = [
  {
    id: 'USR-ADMIN-01',
    name: 'Dr. Arthur Vance',
    email: 'admin@campus.edu',
    password: 'admin123',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    designation: 'Chief Administrator & Registrar',
    department: 'Administration',
    phone: '+1 (555) 019-2831'
  },
  {
    id: 'USR-FAC-01',
    name: 'Dr. Sarah Jenkins',
    email: 'faculty@campus.edu',
    password: 'faculty123',
    role: 'faculty',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    designation: 'Associate Professor',
    department: 'Computer Science & Engineering',
    employeeId: 'FAC-CSE-104',
    phone: '+1 (555) 014-9923',
    assignedSubjects: ['CS601: Database Systems', 'CS603: Computer Networks', 'CS605: Web Architectures']
  },
  {
    id: 'USR-STU-01',
    name: 'Alex Rivera',
    email: 'student@campus.edu',
    password: 'student123',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    rollNumber: '2022-CSE-045',
    department: 'Computer Science & Engineering',
    semester: '6th Semester',
    batch: '2022 - 2026',
    cgpa: 3.84,
    phone: '+1 (555) 018-4412',
    address: '452 Elm Street, Maplewood, NJ',
    bloodGroup: 'O+ve',
    mentor: 'Dr. Sarah Jenkins',
    hostelStatus: 'Allocated', // 'None' | 'Applied' | 'Allocated'
    hostelDetails: {
      block: 'Block A (Aryabhata Boys)',
      roomNo: 'A-304',
      roomType: 'Double Occupancy (AC)',
      bedNo: 'Bed 1'
    },
    transportStatus: 'Allocated', // 'None' | 'Applied' | 'Allocated'
    transportDetails: {
      busNo: 'Bus-04',
      route: 'North Metro Express',
      stop: 'Oakwood Station (7:45 AM)',
      passNumber: 'TRP-2024-045'
    }
  },
  {
    id: 'USR-WARDEN-01',
    name: 'Col. Rajesh Sharma',
    email: 'warden@campus.edu',
    password: 'warden123',
    role: 'warden',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    designation: 'Chief Hostel Warden',
    department: 'Residential Life & Hostels',
    phone: '+1 (555) 017-8834',
    office: 'Central Hostel Complex, Ground Floor'
  },
  {
    id: 'USR-TRANS-01',
    name: 'Vikram Mehta',
    email: 'transport@campus.edu',
    password: 'transport123',
    role: 'transport',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    designation: 'Director of Transport & Logistics',
    department: 'Fleet Management Services',
    phone: '+1 (555) 012-7711',
    office: 'Logistics Center, Bay 3'
  }
];

export const INITIAL_DEPARTMENTS = [
  {
    id: 'DEP-CSE',
    name: 'Computer Science & Engineering',
    code: 'CSE',
    hod: 'Dr. Robert Miller',
    facultyCount: 18,
    studentCount: 320,
    established: 2004,
    description: 'Leading in AI, Cloud Computing, Cyber Security, and Software Systems.'
  },
  {
    id: 'DEP-ECE',
    name: 'Electronics & Communication Engineering',
    code: 'ECE',
    hod: 'Dr. Sunita Rao',
    facultyCount: 14,
    studentCount: 240,
    established: 2005,
    description: 'Specializing in VLSI, Embedded Systems, IoT, and Signal Processing.'
  },
  {
    id: 'DEP-MECH',
    name: 'Mechanical & Automation Engineering',
    code: 'MECH',
    hod: 'Dr. James Anderson',
    facultyCount: 12,
    studentCount: 180,
    established: 2006,
    description: 'Focused on Robotics, Thermal Dynamics, CAD/CAM, and Material Science.'
  },
  {
    id: 'DEP-CIVIL',
    name: 'Civil & Infrastructure Engineering',
    code: 'CIVIL',
    hod: 'Dr. Priya Nair',
    facultyCount: 10,
    studentCount: 150,
    established: 2008,
    description: 'Sustainable Infrastructure, Structural Engineering, and Urban Planning.'
  },
  {
    id: 'DEP-IT',
    name: 'Information Technology & Data Science',
    code: 'IT',
    hod: 'Dr. Michael Chang',
    facultyCount: 15,
    studentCount: 260,
    established: 2010,
    description: 'Big Data Analytics, Cloud Platforms, and Intelligent Systems.'
  }
];

export const INITIAL_STUDENTS = [
  {
    id: 'STU-001',
    name: 'Alex Rivera',
    rollNumber: '2022-CSE-045',
    email: 'alex.rivera@campus.edu',
    phone: '+1 (555) 018-4412',
    department: 'Computer Science & Engineering',
    semester: '6th Semester',
    cgpa: 3.84,
    gender: 'Male',
    hostelStatus: 'Allocated',
    hostelRoom: 'A-304',
    transportStatus: 'Allocated',
    transportBus: 'Bus-04',
    status: 'Active'
  },
  {
    id: 'STU-002',
    name: 'Sophia Chen',
    rollNumber: '2022-CSE-012',
    email: 'sophia.chen@campus.edu',
    phone: '+1 (555) 019-3321',
    department: 'Computer Science & Engineering',
    semester: '6th Semester',
    cgpa: 3.92,
    gender: 'Female',
    hostelStatus: 'Allocated',
    hostelRoom: 'B-201',
    transportStatus: 'None',
    transportBus: null,
    status: 'Active'
  },
  {
    id: 'STU-003',
    name: 'Marcus Williams',
    rollNumber: '2022-CSE-078',
    email: 'marcus.w@campus.edu',
    phone: '+1 (555) 014-7782',
    department: 'Computer Science & Engineering',
    semester: '6th Semester',
    cgpa: 3.45,
    gender: 'Male',
    hostelStatus: 'None',
    hostelRoom: null,
    transportStatus: 'Allocated',
    transportBus: 'Bus-01',
    status: 'Active'
  },
  {
    id: 'STU-004',
    name: 'Elena Rostova',
    rollNumber: '2022-ECE-033',
    email: 'elena.r@campus.edu',
    phone: '+1 (555) 016-5541',
    department: 'Electronics & Communication Engineering',
    semester: '6th Semester',
    cgpa: 3.78,
    gender: 'Female',
    hostelStatus: 'Allocated',
    hostelRoom: 'B-105',
    transportStatus: 'None',
    transportBus: null,
    status: 'Active'
  },
  {
    id: 'STU-005',
    name: 'David Patel',
    rollNumber: '2023-MECH-019',
    email: 'david.patel@campus.edu',
    phone: '+1 (555) 013-6629',
    department: 'Mechanical & Automation Engineering',
    semester: '4th Semester',
    cgpa: 3.60,
    gender: 'Male',
    hostelStatus: 'Applied',
    hostelRoom: null,
    transportStatus: 'Applied',
    transportBus: null,
    status: 'Active'
  },
  {
    id: 'STU-006',
    name: 'Aisha Al-Mansoor',
    rollNumber: '2023-CIVIL-041',
    email: 'aisha.m@campus.edu',
    phone: '+1 (555) 011-8890',
    department: 'Civil & Infrastructure Engineering',
    semester: '4th Semester',
    cgpa: 3.88,
    gender: 'Female',
    hostelStatus: 'Allocated',
    hostelRoom: 'B-308',
    transportStatus: 'None',
    transportBus: null,
    status: 'Active'
  },
  {
    id: 'STU-007',
    name: 'Lucas Dupont',
    rollNumber: '2021-IT-008',
    email: 'lucas.d@campus.edu',
    phone: '+1 (555) 015-1176',
    department: 'Information Technology & Data Science',
    semester: '8th Semester',
    cgpa: 3.52,
    gender: 'Male',
    hostelStatus: 'None',
    hostelRoom: null,
    transportStatus: 'Allocated',
    transportBus: 'Bus-02',
    status: 'Active'
  },
  {
    id: 'STU-008',
    name: 'Ananya Roy',
    rollNumber: '2022-CSE-089',
    email: 'ananya.roy@campus.edu',
    phone: '+1 (555) 019-9944',
    department: 'Computer Science & Engineering',
    semester: '6th Semester',
    cgpa: 3.71,
    gender: 'Female',
    hostelStatus: 'None',
    hostelRoom: null,
    transportStatus: 'Applied',
    transportBus: null,
    status: 'Active'
  }
];

export const INITIAL_FACULTY = [
  {
    id: 'FAC-001',
    name: 'Dr. Sarah Jenkins',
    employeeId: 'FAC-CSE-104',
    email: 'faculty@campus.edu',
    phone: '+1 (555) 014-9923',
    department: 'Computer Science & Engineering',
    designation: 'Associate Professor',
    qualification: 'Ph.D. in Distributed Computing (MIT)',
    assignedSubjects: [
      { code: 'CS601', name: 'Database Systems', semester: '6th Sem', credits: 4 },
      { code: 'CS603', name: 'Computer Networks', semester: '6th Sem', credits: 4 },
      { code: 'CS605', name: 'Web Architectures', semester: '6th Sem', credits: 3 }
    ],
    experience: '9 Years',
    status: 'Active'
  },
  {
    id: 'FAC-002',
    name: 'Dr. Robert Miller',
    employeeId: 'FAC-CSE-101',
    email: 'r.miller@campus.edu',
    phone: '+1 (555) 017-2244',
    department: 'Computer Science & Engineering',
    designation: 'Professor & Head of Department',
    qualification: 'Ph.D. in Artificial Intelligence (Stanford)',
    assignedSubjects: [
      { code: 'CS602', name: 'Machine Learning', semester: '6th Sem', credits: 4 },
      { code: 'CS801', name: 'Deep Neural Systems', semester: '8th Sem', credits: 4 }
    ],
    experience: '16 Years',
    status: 'Active'
  },
  {
    id: 'FAC-003',
    name: 'Dr. Sunita Rao',
    employeeId: 'FAC-ECE-201',
    email: 'sunita.rao@campus.edu',
    phone: '+1 (555) 018-3355',
    department: 'Electronics & Communication Engineering',
    designation: 'Professor & HOD',
    qualification: 'Ph.D. in VLSI Signal Processing',
    assignedSubjects: [
      { code: 'EC601', name: 'Digital Signal Processing', semester: '6th Sem', credits: 4 }
    ],
    experience: '14 Years',
    status: 'Active'
  },
  {
    id: 'FAC-004',
    name: 'Prof. Kevin Walker',
    employeeId: 'FAC-MECH-302',
    email: 'k.walker@campus.edu',
    phone: '+1 (555) 012-4466',
    department: 'Mechanical & Automation Engineering',
    designation: 'Assistant Professor',
    qualification: 'M.Tech in Robotics & Mechatronics',
    assignedSubjects: [
      { code: 'ME401', name: 'Kinematics & Dynamics', semester: '4th Sem', credits: 4 }
    ],
    experience: '6 Years',
    status: 'Active'
  },
  {
    id: 'FAC-005',
    name: 'Dr. Priya Nair',
    employeeId: 'FAC-CIV-401',
    email: 'priya.nair@campus.edu',
    phone: '+1 (555) 013-5577',
    department: 'Civil & Infrastructure Engineering',
    designation: 'Associate Professor & HOD',
    qualification: 'Ph.D. in Structural Engineering',
    assignedSubjects: [
      { code: 'CV401', name: 'Structural Analysis II', semester: '4th Sem', credits: 4 }
    ],
    experience: '11 Years',
    status: 'Active'
  }
];

export const INITIAL_NOTICES = [
  {
    id: 'NOT-01',
    title: 'Mid-Semester Examinations Schedule - Spring 2026',
    category: 'Academics',
    target: 'All Students & Faculty',
    date: '2026-08-25',
    author: 'Office of the Dean (Academics)',
    pinned: true,
    content: 'The Mid-Semester examinations for all UG & PG programs are scheduled to commence from September 15, 2026. Detailed seating matrix and timetable are now available on the portal.'
  },
  {
    id: 'NOT-02',
    title: 'Annual TechFest "INNOVEX 2026" Registrations Open',
    category: 'Events',
    target: 'All Students',
    date: '2026-08-22',
    author: 'Student Affairs Council',
    pinned: true,
    content: 'Get ready for the biggest national level hackathon and robotics showdown! Register your teams before September 5th to participate and win prizes worth $20,000.'
  },
  {
    id: 'NOT-03',
    title: 'Hostel Curfew Timings & Mess Advisory for Fall Term',
    category: 'Hostel',
    target: 'Hostel Residents',
    date: '2026-08-18',
    author: 'Chief Hostel Warden',
    pinned: false,
    content: 'All hostel inmates are reminded that night curfew is 10:00 PM on weekdays. Special weekend outing passes must be requested 24 hours in advance via the ERP portal.'
  },
  {
    id: 'NOT-04',
    title: 'New Route Added: Bus 05 for South Corridor Extension',
    category: 'Transport',
    target: 'Transport Users',
    date: '2026-08-15',
    author: 'Transport & Fleet Department',
    pinned: false,
    content: 'To accommodate increasing demand, Bus 05 will begin operations covering Highlands Park, Silver Springs, and South Ridge starting next Monday.'
  },
  {
    id: 'NOT-05',
    title: 'Faculty Research Grant Applications - Quarter 3',
    category: 'Faculty',
    target: 'All Faculty',
    date: '2026-08-10',
    author: 'R&D Cell',
    pinned: false,
    content: 'Faculty members are invited to submit research proposals for seed funding up to $15,000. Priority will be given to interdisciplinary AI and sustainability projects.'
  }
];

export const INITIAL_STUDENT_ATTENDANCE = [
  {
    subjectCode: 'CS601',
    subjectName: 'Database Systems',
    faculty: 'Dr. Sarah Jenkins',
    totalClasses: 36,
    attendedClasses: 33,
    percentage: 91.6,
    status: 'Excellent',
    recentLogs: [
      { date: '2026-08-26', status: 'Present' },
      { date: '2026-08-24', status: 'Present' },
      { date: '2026-08-21', status: 'Present' },
      { date: '2026-08-19', status: 'Absent' },
      { date: '2026-08-17', status: 'Present' }
    ]
  },
  {
    subjectCode: 'CS602',
    subjectName: 'Machine Learning',
    faculty: 'Dr. Robert Miller',
    totalClasses: 34,
    attendedClasses: 29,
    percentage: 85.3,
    status: 'Good',
    recentLogs: [
      { date: '2026-08-25', status: 'Present' },
      { date: '2026-08-22', status: 'Absent' },
      { date: '2026-08-20', status: 'Present' },
      { date: '2026-08-18', status: 'Present' }
    ]
  },
  {
    subjectCode: 'CS603',
    subjectName: 'Computer Networks',
    faculty: 'Dr. Sarah Jenkins',
    totalClasses: 38,
    attendedClasses: 34,
    percentage: 89.4,
    status: 'Good',
    recentLogs: [
      { date: '2026-08-26', status: 'Present' },
      { date: '2026-08-23', status: 'Present' },
      { date: '2026-08-21', status: 'Present' },
      { date: '2026-08-16', status: 'Present' }
    ]
  },
  {
    subjectCode: 'CS604',
    subjectName: 'Software Engineering & Agile',
    faculty: 'Prof. Kevin Walker',
    totalClasses: 30,
    attendedClasses: 23,
    percentage: 76.6,
    status: 'Borderline',
    recentLogs: [
      { date: '2026-08-24', status: 'Present' },
      { date: '2026-08-22', status: 'Absent' },
      { date: '2026-08-19', status: 'Absent' },
      { date: '2026-08-15', status: 'Present' }
    ]
  },
  {
    subjectCode: 'CS605',
    subjectName: 'Web Architectures & Cloud',
    faculty: 'Dr. Sarah Jenkins',
    totalClasses: 32,
    attendedClasses: 30,
    percentage: 93.7,
    status: 'Excellent',
    recentLogs: [
      { date: '2026-08-25', status: 'Present' },
      { date: '2026-08-23', status: 'Present' },
      { date: '2026-08-20', status: 'Present' }
    ]
  }
];

export const INITIAL_STUDENT_MARKS = [
  {
    subjectCode: 'CS601',
    subjectName: 'Database Systems',
    credits: 4,
    internal1: 28, // out of 30
    internal2: 27, // out of 30
    assignment: 19, // out of 20
    finalExam: 88, // out of 100
    totalScore: 91,
    grade: 'A+',
    gradePoint: 10
  },
  {
    subjectCode: 'CS602',
    subjectName: 'Machine Learning',
    credits: 4,
    internal1: 26,
    internal2: 25,
    assignment: 18,
    finalExam: 82,
    totalScore: 84,
    grade: 'A',
    gradePoint: 9
  },
  {
    subjectCode: 'CS603',
    subjectName: 'Computer Networks',
    credits: 4,
    internal1: 29,
    internal2: 28,
    assignment: 20,
    finalExam: 85,
    totalScore: 88,
    grade: 'A',
    gradePoint: 9
  },
  {
    subjectCode: 'CS604',
    subjectName: 'Software Engineering & Agile',
    credits: 3,
    internal1: 24,
    internal2: 23,
    assignment: 17,
    finalExam: 76,
    totalScore: 78,
    grade: 'B+',
    gradePoint: 8
  },
  {
    subjectCode: 'CS605',
    subjectName: 'Web Architectures & Cloud',
    credits: 3,
    internal1: 30,
    internal2: 29,
    assignment: 20,
    finalExam: 92,
    totalScore: 94,
    grade: 'A+',
    gradePoint: 10
  }
];

export const INITIAL_TIMETABLE = {
  Monday: [
    { time: '09:00 - 10:00 AM', subject: 'Database Systems', room: 'Lab 402', faculty: 'Dr. Sarah Jenkins' },
    { time: '10:00 - 11:00 AM', subject: 'Computer Networks', room: 'Room 301', faculty: 'Dr. Sarah Jenkins' },
    { time: '11:15 - 12:15 PM', subject: 'Machine Learning', room: 'Auditorium 2', faculty: 'Dr. Robert Miller' },
    { time: '01:30 - 03:30 PM', subject: 'Database Systems Practical Lab', room: 'Computer Lab 3', faculty: 'Dr. Sarah Jenkins' }
  ],
  Tuesday: [
    { time: '09:00 - 10:00 AM', subject: 'Software Engineering', room: 'Room 302', faculty: 'Prof. Kevin Walker' },
    { time: '10:00 - 11:00 AM', subject: 'Web Architectures', room: 'Room 301', faculty: 'Dr. Sarah Jenkins' },
    { time: '11:15 - 12:15 PM', subject: 'Computer Networks', room: 'Room 301', faculty: 'Dr. Sarah Jenkins' },
    { time: '02:00 - 04:00 PM', subject: 'Web Architectures Project Studio', room: 'Innovation Lab', faculty: 'Dr. Sarah Jenkins' }
  ],
  Wednesday: [
    { time: '09:00 - 10:00 AM', subject: 'Machine Learning', room: 'Auditorium 2', faculty: 'Dr. Robert Miller' },
    { time: '10:00 - 11:00 AM', subject: 'Database Systems', room: 'Room 301', faculty: 'Dr. Sarah Jenkins' },
    { time: '11:15 - 01:15 PM', subject: 'Machine Learning Lab', room: 'AI Research Lab', faculty: 'Dr. Robert Miller' },
    { time: '02:30 - 03:30 PM', subject: 'Open Elective / Library Hour', room: 'Central Library', faculty: 'Staff' }
  ],
  Thursday: [
    { time: '09:00 - 10:00 AM', subject: 'Software Engineering', room: 'Room 302', faculty: 'Prof. Kevin Walker' },
    { time: '10:00 - 11:00 AM', subject: 'Web Architectures', room: 'Room 301', faculty: 'Dr. Sarah Jenkins' },
    { time: '11:15 - 12:15 PM', subject: 'Database Systems Tutorial', room: 'Room 205', faculty: 'Dr. Sarah Jenkins' },
    { time: '01:30 - 03:30 PM', subject: 'Networking & Socket Lab', room: 'Networks Lab', faculty: 'Dr. Sarah Jenkins' }
  ],
  Friday: [
    { time: '09:00 - 10:00 AM', subject: 'Computer Networks', room: 'Room 301', faculty: 'Dr. Sarah Jenkins' },
    { time: '10:00 - 11:00 AM', subject: 'Machine Learning', room: 'Auditorium 2', faculty: 'Dr. Robert Miller' },
    { time: '11:15 - 12:15 PM', subject: 'Industry Seminar / Guest Lecture', room: 'Main Seminar Hall', faculty: 'Guest Faculty' },
    { time: '02:00 - 04:00 PM', subject: 'Clubs & Extracurricular Activities', room: 'Activity Center', faculty: 'Council' }
  ]
};

export const INITIAL_HOSTEL_ROOMS = [
  { id: 'RM-101', roomNo: 'A-101', block: 'Block A (Boys)', floor: 1, type: 'Double AC', capacity: 2, occupied: 2, status: 'Occupied', residents: ['STU-003', 'STU-007'] },
  { id: 'RM-102', roomNo: 'A-102', block: 'Block A (Boys)', floor: 1, type: 'Double Non-AC', capacity: 2, occupied: 1, status: 'Available', residents: ['STU-009'] },
  { id: 'RM-201', roomNo: 'A-201', block: 'Block A (Boys)', floor: 2, type: 'Triple Non-AC', capacity: 3, occupied: 3, status: 'Occupied', residents: ['STU-010', 'STU-011', 'STU-012'] },
  { id: 'RM-304', roomNo: 'A-304', block: 'Block A (Boys)', floor: 3, type: 'Double AC', capacity: 2, occupied: 2, status: 'Occupied', residents: ['STU-001', 'STU-013'] },
  { id: 'RM-305', roomNo: 'A-305', block: 'Block A (Boys)', floor: 3, type: 'Single Deluxe AC', capacity: 1, occupied: 0, status: 'Available', residents: [] },
  { id: 'RM-401', roomNo: 'A-401', block: 'Block A (Boys)', floor: 4, type: 'Double Non-AC', capacity: 2, occupied: 0, status: 'Maintenance', residents: [] },

  { id: 'RM-B101', roomNo: 'B-101', block: 'Block B (Girls)', floor: 1, type: 'Double AC', capacity: 2, occupied: 2, status: 'Occupied', residents: ['STU-014', 'STU-015'] },
  { id: 'RM-B105', roomNo: 'B-105', block: 'Block B (Girls)', floor: 1, type: 'Double Non-AC', capacity: 2, occupied: 1, status: 'Available', residents: ['STU-004'] },
  { id: 'RM-B201', roomNo: 'B-201', block: 'Block B (Girls)', floor: 2, type: 'Double AC', capacity: 2, occupied: 2, status: 'Occupied', residents: ['STU-002', 'STU-016'] },
  { id: 'RM-B308', roomNo: 'B-308', block: 'Block B (Girls)', floor: 3, type: 'Triple AC', capacity: 3, occupied: 1, status: 'Available', residents: ['STU-006'] },
  { id: 'RM-B309', roomNo: 'B-309', block: 'Block B (Girls)', floor: 3, type: 'Single Deluxe AC', capacity: 1, occupied: 0, status: 'Available', residents: [] }
];

export const INITIAL_HOSTEL_APPLICATIONS = [
  {
    id: 'HAPP-101',
    studentId: 'STU-005',
    studentName: 'David Patel',
    rollNumber: '2023-MECH-019',
    department: 'Mechanical & Automation Engineering',
    gender: 'Male',
    preferredType: 'Double AC',
    preferredBlock: 'Block A (Boys)',
    reason: 'Outstation student from California. Need quiet on-campus accommodation for project work.',
    appliedDate: '2026-08-20',
    status: 'Pending' // 'Pending' | 'Approved' | 'Rejected'
  },
  {
    id: 'HAPP-102',
    studentId: 'STU-008',
    studentName: 'Ananya Roy',
    rollNumber: '2022-CSE-089',
    department: 'Computer Science & Engineering',
    gender: 'Female',
    preferredType: 'Double AC',
    preferredBlock: 'Block B (Girls)',
    reason: 'Commute distance exceeds 45km. Seeking hostel for 6th semester.',
    appliedDate: '2026-08-22',
    status: 'Pending'
  },
  {
    id: 'HAPP-099',
    studentId: 'STU-001',
    studentName: 'Alex Rivera',
    rollNumber: '2022-CSE-045',
    department: 'Computer Science & Engineering',
    gender: 'Male',
    preferredType: 'Double AC',
    preferredBlock: 'Block A (Boys)',
    reason: 'Campus resident semester renewal.',
    appliedDate: '2026-08-01',
    status: 'Approved',
    assignedRoom: 'A-304'
  }
];

export const INITIAL_HOSTEL_COMPLAINTS = [
  {
    id: 'CMP-01',
    studentName: 'Alex Rivera',
    rollNumber: '2022-CSE-045',
    roomNo: 'A-304',
    category: 'Air Conditioning',
    title: 'AC unit dripping water on study desk',
    description: 'The split AC unit in Room A-304 has water leakage from the condenser side since yesterday evening.',
    submittedDate: '2026-08-24',
    priority: 'High',
    status: 'In Progress' // 'Open' | 'In Progress' | 'Resolved'
  },
  {
    id: 'CMP-02',
    studentName: 'Sophia Chen',
    rollNumber: '2022-CSE-012',
    roomNo: 'B-201',
    category: 'Wi-Fi / Internet',
    title: 'Weak Wi-Fi signal in 2nd floor corner rooms',
    description: 'The access point near B-201 keeps disconnecting frequently during study hours.',
    submittedDate: '2026-08-25',
    priority: 'Medium',
    status: 'Open'
  },
  {
    id: 'CMP-03',
    studentName: 'Aisha Al-Mansoor',
    rollNumber: '2023-CIVIL-041',
    roomNo: 'B-308',
    category: 'Electrical',
    title: 'Reading lamp socket sparking',
    description: 'The switch board near bed 2 is loose and needs replacement.',
    submittedDate: '2026-08-21',
    priority: 'Urgent',
    status: 'Resolved'
  }
];

export const INITIAL_BUSES = [
  {
    id: 'BUS-01',
    busNo: 'Bus-01',
    regNumber: 'NY-CAMP-1092',
    capacity: 45,
    occupiedSeats: 38,
    driverName: 'Robert Vance Sr.',
    driverPhone: '+1 (555) 019-1122',
    assignedRoute: 'Route 1: Downtown & Central Station',
    status: 'Active', // 'Active' | 'Maintenance' | 'Inactive'
    model: 'Volvo EcoHybrid 45-Seater',
    fuelStatus: '85%'
  },
  {
    id: 'BUS-02',
    busNo: 'Bus-02',
    regNumber: 'NY-CAMP-1095',
    capacity: 45,
    occupiedSeats: 41,
    driverName: 'Harpreet Singh',
    driverPhone: '+1 (555) 018-7733',
    assignedRoute: 'Route 2: Westend Suburbs & Tech Park',
    status: 'Active',
    model: 'Mercedes-Benz Tourismo',
    fuelStatus: '92%'
  },
  {
    id: 'BUS-03',
    busNo: 'Bus-03',
    regNumber: 'NY-CAMP-1102',
    capacity: 35,
    occupiedSeats: 29,
    driverName: 'Carlos Ramirez',
    driverPhone: '+1 (555) 014-6644',
    assignedRoute: 'Route 3: Eastern Hills & University Heights',
    status: 'Active',
    model: 'Isuzu EcoBus 35',
    fuelStatus: '70%'
  },
  {
    id: 'BUS-04',
    busNo: 'Bus-04',
    regNumber: 'NY-CAMP-1118',
    capacity: 50,
    occupiedSeats: 44,
    driverName: 'Tariq Johnson',
    driverPhone: '+1 (555) 012-9955',
    assignedRoute: 'Route 4: North Metro Express',
    status: 'Active',
    model: 'Scania Metroliner 50',
    fuelStatus: '95%'
  },
  {
    id: 'BUS-05',
    busNo: 'Bus-05',
    regNumber: 'NY-CAMP-1120',
    capacity: 40,
    occupiedSeats: 0,
    driverName: 'David Lee',
    driverPhone: '+1 (555) 015-3388',
    assignedRoute: 'Route 5: South Corridor Extension',
    status: 'Maintenance',
    model: 'Volvo EcoHybrid 40',
    fuelStatus: '45%'
  }
];

export const INITIAL_ROUTES = [
  {
    id: 'RT-01',
    routeNumber: 'Route 1',
    name: 'Downtown & Central Station',
    assignedBus: 'Bus-01',
    startPoint: 'Central Metro Hub',
    endPoint: 'Campus Main Gate',
    totalDistance: '22 km',
    morningPickup: '07:15 AM',
    eveningDrop: '05:30 PM',
    stops: [
      { name: 'Central Metro Hub', time: '07:15 AM' },
      { name: 'City Hall Square', time: '07:25 AM' },
      { name: 'Grand Avenue Mall', time: '07:40 AM' },
      { name: 'Pine Street Junction', time: '07:55 AM' },
      { name: 'Campus Gate 1', time: '08:20 AM' }
    ]
  },
  {
    id: 'RT-02',
    routeNumber: 'Route 2',
    name: 'Westend Suburbs & Tech Park',
    assignedBus: 'Bus-02',
    startPoint: 'Westend Square',
    endPoint: 'Campus Main Gate',
    totalDistance: '28 km',
    morningPickup: '07:05 AM',
    eveningDrop: '05:30 PM',
    stops: [
      { name: 'Westend Square', time: '07:05 AM' },
      { name: 'Skyline Plaza', time: '07:20 AM' },
      { name: 'Silicon Tech Park Gate 2', time: '07:35 AM' },
      { name: 'Riverdale Crossway', time: '07:50 AM' },
      { name: 'Campus Gate 1', time: '08:25 AM' }
    ]
  },
  {
    id: 'RT-03',
    routeNumber: 'Route 3',
    name: 'Eastern Hills & University Heights',
    assignedBus: 'Bus-03',
    startPoint: 'Sunrise Boulevard',
    endPoint: 'Campus Main Gate',
    totalDistance: '19 km',
    morningPickup: '07:20 AM',
    eveningDrop: '05:30 PM',
    stops: [
      { name: 'Sunrise Boulevard', time: '07:20 AM' },
      { name: 'Highland Gardens', time: '07:35 AM' },
      { name: 'Cedar Ridge Circle', time: '07:50 AM' },
      { name: 'Campus Gate 1', time: '08:15 AM' }
    ]
  },
  {
    id: 'RT-04',
    routeNumber: 'Route 4',
    name: 'North Metro Express',
    assignedBus: 'Bus-04',
    startPoint: 'North Terminal',
    endPoint: 'Campus Main Gate',
    totalDistance: '25 km',
    morningPickup: '07:10 AM',
    eveningDrop: '05:30 PM',
    stops: [
      { name: 'North Terminal Metro', time: '07:10 AM' },
      { name: 'Oakwood Station', time: '07:30 AM' },
      { name: 'Summit Hill Overpass', time: '07:45 AM' },
      { name: 'Campus Gate 2', time: '08:20 AM' }
    ]
  }
];

export const INITIAL_TRANSPORT_APPLICATIONS = [
  {
    id: 'TAPP-201',
    studentId: 'STU-005',
    studentName: 'David Patel',
    rollNumber: '2023-MECH-019',
    department: 'Mechanical & Automation Engineering',
    preferredRoute: 'Route 1: Downtown & Central Station',
    preferredStop: 'Grand Avenue Mall',
    appliedDate: '2026-08-21',
    reason: 'Relocating to Grand Avenue with family.',
    status: 'Pending'
  },
  {
    id: 'TAPP-202',
    studentId: 'STU-008',
    studentName: 'Ananya Roy',
    rollNumber: '2022-CSE-089',
    department: 'Computer Science & Engineering',
    preferredRoute: 'Route 4: North Metro Express',
    preferredStop: 'Oakwood Station',
    appliedDate: '2026-08-23',
    reason: 'Daily travel convenience from North region.',
    status: 'Pending'
  },
  {
    id: 'TAPP-190',
    studentId: 'STU-001',
    studentName: 'Alex Rivera',
    rollNumber: '2022-CSE-045',
    department: 'Computer Science & Engineering',
    preferredRoute: 'Route 4: North Metro Express',
    preferredStop: 'Oakwood Station (7:45 AM)',
    appliedDate: '2026-08-02',
    status: 'Approved',
    assignedBus: 'Bus-04',
    assignedStop: 'Oakwood Station'
  }
];
