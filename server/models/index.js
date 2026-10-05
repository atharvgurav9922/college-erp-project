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
  department: { type: String }
}, { timestamps: true });

// --- Department ---
const departmentSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: { type: String, required: true },
  code: { type: String, required: true },
  hod: { type: String },
  facultyCount: { type: Number },
  studentCount: { type: Number },
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
  cgpa: { type: Number },
  gender: { type: String },
  bloodGroup: { type: String },
  mentor: { type: String },
  hostelStatus: { type: String },
  hostelRoom: { type: String },
  transportStatus: { type: String },
  transportBus: { type: String },
  status: { type: String }
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
  status: { type: String },
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
  category: { type: String },
  target: { type: String },
  date: { type: String },
  author: { type: String },
  pinned: { type: Boolean, default: false },
  content: { type: String }
}, { timestamps: true });

// --- Attendance ---
const attendanceSchema = new mongoose.Schema({
  studentId: { type: String },
  subjectCode: { type: String },
  subjectName: { type: String },
  faculty: { type: String },
  totalClasses: { type: Number },
  attendedClasses: { type: Number },
  percentage: { type: Number },
  status: { type: String },
  recentLogs: [{
    date: String,
    status: String
  }]
}, { timestamps: true });

// --- Marks ---
const marksSchema = new mongoose.Schema({
  studentId: { type: String },
  subjectCode: { type: String },
  subjectName: { type: String },
  credits: { type: Number },
  internal1: { type: Number },
  internal2: { type: Number },
  assignment: { type: Number },
  finalExam: { type: Number },
  totalScore: { type: Number },
  grade: { type: String },
  gradePoint: { type: Number }
}, { timestamps: true });

// --- Hostel Room ---
const roomSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  roomNo: { type: String },
  block: { type: String },
  floor: { type: Number },
  type: { type: String },
  capacity: { type: Number },
  occupied: { type: Number },
  status: { type: String },
  residents: [String] // Array of student IDs
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
  status: { type: String },
  assignedRoom: { type: String }
}, { timestamps: true });

// --- Complaint ---
const complaintSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  studentName: { type: String },
  rollNumber: { type: String },
  roomNo: { type: String },
  category: { type: String },
  title: { type: String },
  description: { type: String },
  submittedDate: { type: String },
  priority: { type: String },
  status: { type: String }
}, { timestamps: true });

// --- Bus ---
const busSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  busNo: { type: String },
  regNumber: { type: String },
  capacity: { type: Number },
  occupiedSeats: { type: Number },
  driverName: { type: String },
  driverPhone: { type: String },
  assignedRoute: { type: String },
  status: { type: String },
  model: { type: String },
  fuelStatus: { type: String }
}, { timestamps: true });

// --- Route ---
const routeSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  routeNumber: { type: String },
  name: { type: String },
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
  status: { type: String },
  assignedBus: { type: String },
  assignedStop: { type: String }
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
};
