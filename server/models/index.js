const mongoose = require('mongoose');

// --- User Roles / Base ---
const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['admin', 'faculty', 'student', 'warden', 'transport'] },
  avatar: { type: String },
  phone: { type: String },
  department: { type: String },
  rollNumber: { type: String },
  designation: { type: String },
  employeeId: { type: String },
  batch: { type: String },
  cgpa: { type: Number },
  bloodGroup: { type: String },
  mentor: { type: String },
  address: { type: String },
  hostelStatus: { type: String },
  hostelDetails: {
    block: String,
    roomNo: String,
    roomType: String,
    bedNo: String
  },
  transportStatus: { type: String },
  transportDetails: {
    busNo: String,
    route: String,
    stop: String,
    passNumber: String
  }
}, { timestamps: true });

// --- Department ---
const departmentSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: { type: String, required: true },
  code: { type: String, required: true },
  hod: { type: String },
  facultyCount: { type: Number, default: 0 },
  studentCount: { type: Number, default: 0 },
  established: { type: Number },
  description: { type: String }
}, { timestamps: true });

// --- Student ---
const studentSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  address: { type: String },
  department: { type: String },
  semester: { type: String },
  batch: { type: String },
  cgpa: { type: Number, default: 3.5 },
  gender: { type: String },
  bloodGroup: { type: String },
  mentor: { type: String },
  hostelStatus: { type: String, default: 'None' },
  hostelRoom: { type: String, default: null },
  hostelDetails: {
    block: String,
    roomNo: String,
    roomType: String,
    bedNo: String
  },
  transportStatus: { type: String, default: 'None' },
  transportBus: { type: String, default: null },
  transportDetails: {
    busNo: String,
    route: String,
    stop: String,
    passNumber: String
  },
  status: { type: String, default: 'Active' }
}, { timestamps: true });

// --- Faculty ---
const facultySchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  department: { type: String },
  designation: { type: String },
  qualification: { type: String },
  experience: { type: String },
  status: { type: String, default: 'Active' },
  assignedSubjects: [{
    code: String,
    name: String,
    semester: String,
    credits: Number
  }]
}, { timestamps: true });

// --- Notice ---
const noticeSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  title: { type: String, required: true },
  category: { type: String, default: 'Academics' },
  target: { type: String, default: 'All Students' },
  date: { type: String },
  author: { type: String },
  pinned: { type: Boolean, default: false },
  content: { type: String }
}, { timestamps: true });

// --- Attendance ---
const attendanceSchema = new mongoose.Schema({
  studentId: { type: String },
  subjectCode: { type: String, required: true },
  subjectName: { type: String },
  faculty: { type: String },
  totalClasses: { type: Number, default: 0 },
  attendedClasses: { type: Number, default: 0 },
  percentage: { type: Number, default: 100 },
  status: { type: String, default: 'Good' },
  recentLogs: [{
    date: String,
    status: String
  }]
}, { timestamps: true });

// --- Marks ---
const marksSchema = new mongoose.Schema({
  studentId: { type: String },
  subjectCode: { type: String, required: true },
  subjectName: { type: String },
  credits: { type: Number, default: 4 },
  internal1: { type: Number, default: 0 },
  internal2: { type: Number, default: 0 },
  assignment: { type: Number, default: 0 },
  finalExam: { type: Number, default: 0 },
  totalScore: { type: Number, default: 0 },
  grade: { type: String, default: 'B' },
  gradePoint: { type: Number, default: 7 }
}, { timestamps: true });

// --- Hostel Room ---
const roomSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  roomNo: { type: String, required: true },
  block: { type: String },
  floor: { type: Number },
  type: { type: String },
  capacity: { type: Number, default: 2 },
  occupied: { type: Number, default: 0 },
  status: { type: String, default: 'Available' },
  residents: [String]
}, { timestamps: true });

// --- Hostel Application ---
const hostelApplicationSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  studentId: { type: String },
  studentName: { type: String },
  rollNumber: { type: String },
  department: { type: String },
  gender: { type: String },
  preferredType: { type: String },
  preferredBlock: { type: String },
  reason: { type: String },
  appliedDate: { type: String },
  status: { type: String, default: 'Pending' },
  assignedRoom: { type: String },
  rejectionReason: { type: String }
}, { timestamps: true });

// --- Complaint ---
const complaintSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  studentName: { type: String },
  rollNumber: { type: String },
  roomNo: { type: String },
  category: { type: String },
  title: { type: String, required: true },
  description: { type: String },
  submittedDate: { type: String },
  priority: { type: String, default: 'Medium' },
  status: { type: String, default: 'Open' }
}, { timestamps: true });

// --- Bus ---
const busSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  busNo: { type: String, required: true },
  regNumber: { type: String },
  capacity: { type: Number, default: 40 },
  occupiedSeats: { type: Number, default: 0 },
  driverName: { type: String },
  driverPhone: { type: String },
  assignedRoute: { type: String },
  status: { type: String, default: 'Active' },
  model: { type: String },
  fuelStatus: { type: String, default: '100%' }
}, { timestamps: true });

// --- Route ---
const routeSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  routeNumber: { type: String, required: true },
  name: { type: String, required: true },
  assignedBus: { type: String },
  startPoint: { type: String },
  endPoint: { type: String },
  totalDistance: { type: String },
  morningPickup: { type: String },
  eveningDrop: { type: String },
  stops: [{
    name: String,
    time: String
  }]
}, { timestamps: true });

// --- Transport Application ---
const transportApplicationSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  studentId: { type: String },
  studentName: { type: String },
  rollNumber: { type: String },
  department: { type: String },
  preferredRoute: { type: String },
  preferredStop: { type: String },
  appliedDate: { type: String },
  reason: { type: String },
  status: { type: String, default: 'Pending' },
  assignedBus: { type: String },
  assignedStop: { type: String },
  rejectionReason: { type: String }
}, { timestamps: true });

// --- Timetable ---
const timetableSchema = new mongoose.Schema({
  day: { type: String, required: true, unique: true },
  slots: [{
    time: String,
    subject: String,
    room: String,
    faculty: String
  }]
}, { timestamps: true });

module.exports = {
  User: mongoose.model('User', userSchema),
  Department: mongoose.model('Department', departmentSchema),
  Student: mongoose.model('Student', studentSchema),
  Faculty: mongoose.model('Faculty', facultySchema),
  Notice: mongoose.model('Notice', noticeSchema),
  Attendance: mongoose.model('Attendance', attendanceSchema),
  Marks: mongoose.model('Marks', marksSchema),
  Room: mongoose.model('Room', roomSchema),
  HostelApplication: mongoose.model('HostelApplication', hostelApplicationSchema),
  Complaint: mongoose.model('Complaint', complaintSchema),
  Bus: mongoose.model('Bus', busSchema),
  Route: mongoose.model('Route', routeSchema),
  TransportApplication: mongoose.model('TransportApplication', transportApplicationSchema),
  Timetable: mongoose.model('Timetable', timetableSchema)
};
