const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const models = require('../models');

// Safe query helper: checks if string is valid 24-char ObjectId before querying _id
const findQuery = (id) => {
  if (!id) return { _id: null };
  const isObjectId = mongoose.Types.ObjectId.isValid(id) && String(id).length === 24;
  return isObjectId ? { $or: [{ id: id }, { _id: id }] } : { id: id };
};

// Generic CRUD factory
const createCrudRoutes = (Model, idPrefix = 'REC') => {
  const modelRouter = express.Router();

  // GET all
  modelRouter.get('/', async (req, res) => {
    try {
      const docs = await Model.find().sort({ createdAt: -1 });
      res.json(docs);
    } catch (error) {
      console.error(`Error fetching ${Model.modelName}:`, error);
      res.status(500).json({ error: error.message });
    }
  });

  // GET single
  modelRouter.get('/:id', async (req, res) => {
    try {
      const doc = await Model.findOne(findQuery(req.params.id));
      if (!doc) return res.status(404).json({ error: `${Model.modelName} not found` });
      res.json(doc);
    } catch (error) {
      console.error(`Error fetching single ${Model.modelName}:`, error);
      res.status(500).json({ error: error.message });
    }
  });

  // POST create
  modelRouter.post('/', async (req, res) => {
    try {
      const payload = { ...req.body };
      if (!payload.id) {
        payload.id = `${idPrefix}-${Date.now().toString().slice(-4)}`;
      }
      const newDoc = new Model(payload);
      const savedDoc = await newDoc.save();
      res.status(201).json(savedDoc);
    } catch (error) {
      console.error(`Error creating ${Model.modelName}:`, error);
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern || error.keyValue || {})[0] || 'unique field';
        return res.status(400).json({ error: `A record with this ${field} already exists.` });
      }
      res.status(400).json({ error: error.message });
    }
  });

  // PUT update
  modelRouter.put('/:id', async (req, res) => {
    try {
      const updatedDoc = await Model.findOneAndUpdate(
        findQuery(req.params.id),
        { $set: req.body },
        { new: true, runValidators: true }
      );
      if (!updatedDoc) return res.status(404).json({ error: `${Model.modelName} not found` });
      res.json(updatedDoc);
    } catch (error) {
      console.error(`Error updating ${Model.modelName}:`, error);
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern || error.keyValue || {})[0] || 'unique field';
        return res.status(400).json({ error: `A record with this ${field} already exists.` });
      }
      res.status(400).json({ error: error.message });
    }
  });

  // DELETE
  modelRouter.delete('/:id', async (req, res) => {
    try {
      const deletedDoc = await Model.findOneAndDelete(findQuery(req.params.id));
      if (!deletedDoc) return res.status(404).json({ error: `${Model.modelName} not found` });
      res.json({ message: 'Deleted successfully', id: req.params.id });
    } catch (error) {
      console.error(`Error deleting ${Model.modelName}:`, error);
      res.status(500).json({ error: error.message });
    }
  });

  return modelRouter;
};

// Register Standard Resource CRUD
router.use('/students', createCrudRoutes(models.Student, 'STU'));
router.use('/faculty', createCrudRoutes(models.Faculty, 'FAC'));
router.use('/faculties', createCrudRoutes(models.Faculty, 'FAC'));
router.use('/facultys', createCrudRoutes(models.Faculty, 'FAC')); // alias
router.use('/departments', createCrudRoutes(models.Department, 'DEP'));
router.use('/notices', createCrudRoutes(models.Notice, 'NOT'));
router.use('/attendance', createCrudRoutes(models.Attendance, 'ATT'));
router.use('/attendances', createCrudRoutes(models.Attendance, 'ATT'));
router.use('/marks', createCrudRoutes(models.Marks, 'MRK'));
router.use('/markss', createCrudRoutes(models.Marks, 'MRK')); // alias
router.use('/rooms', createCrudRoutes(models.Room, 'RM'));
router.use('/hostel-rooms', createCrudRoutes(models.Room, 'RM'));
router.use('/hostel-applications', createCrudRoutes(models.HostelApplication, 'HAPP'));
router.use('/hostelapplications', createCrudRoutes(models.HostelApplication, 'HAPP'));
router.use('/complaints', createCrudRoutes(models.Complaint, 'CMP'));
router.use('/hostel-complaints', createCrudRoutes(models.Complaint, 'CMP'));
router.use('/buses', createCrudRoutes(models.Bus, 'BUS'));
router.use('/buss', createCrudRoutes(models.Bus, 'BUS')); // alias
router.use('/routes', createCrudRoutes(models.Route, 'RT'));
router.use('/transport-applications', createCrudRoutes(models.TransportApplication, 'TAPP'));
router.use('/transportapplications', createCrudRoutes(models.TransportApplication, 'TAPP'));
router.use('/users', createCrudRoutes(models.User, 'USR'));

// --- Custom Timetable Endpoints ---
router.get('/timetable', async (req, res) => {
  try {
    const docs = await models.Timetable.find();
    // Format as { Monday: [...], Tuesday: [...] }
    const timetableMap = {};
    docs.forEach(doc => {
      timetableMap[doc.day] = doc.slots;
    });
    res.json(timetableMap);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/timetable', async (req, res) => {
  try {
    const timetableMap = req.body;
    for (const [day, slots] of Object.entries(timetableMap)) {
      await models.Timetable.findOneAndUpdate(
        { day },
        { day, slots },
        { upsert: true, new: true }
      );
    }
    res.json({ message: 'Timetable updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// --- Custom Attendance Batch Submit ---
router.post('/attendance/batch', async (req, res) => {
  try {
    const { subjectCode, date, attendanceMap } = req.body;
    if (!subjectCode || !date) {
      return res.status(400).json({ error: 'subjectCode and date are required' });
    }
    const isPresent = attendanceMap && attendanceMap['STU-001'] !== 'Absent';
    let doc = await models.Attendance.findOne({ subjectCode });
    if (doc) {
      const newTotal = (doc.totalClasses || 0) + 1;
      const newAttended = isPresent ? (doc.attendedClasses || 0) + 1 : (doc.attendedClasses || 0);
      const newLogs = [{ date, status: isPresent ? 'Present' : 'Absent' }, ...(doc.recentLogs || [])];
      doc.totalClasses = newTotal;
      doc.attendedClasses = newAttended;
      doc.percentage = Number(((newAttended / newTotal) * 100).toFixed(1));
      doc.recentLogs = newLogs.slice(0, 10);
      await doc.save();
    } else {
      doc = new models.Attendance({
        subjectCode,
        subjectName: subjectCode,
        totalClasses: 1,
        attendedClasses: isPresent ? 1 : 0,
        percentage: isPresent ? 100 : 0,
        status: isPresent ? 'Good' : 'Borderline',
        recentLogs: [{ date, status: isPresent ? 'Present' : 'Absent' }]
      });
      await doc.save();
    }
    res.json(doc);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// --- Custom Marks Subject Update ---
router.put('/marks/subject/:subjectCode', async (req, res) => {
  try {
    const { subjectCode } = req.params;
    const scores = req.body;
    let doc = await models.Marks.findOne({ subjectCode });
    if (!doc) {
      doc = new models.Marks({ subjectCode, ...scores });
    } else {
      Object.assign(doc, scores);
    }

    const internalTotal = (Number(doc.internal1) || 0) + (Number(doc.internal2) || 0);
    const assignmentTotal = Number(doc.assignment) || 0;
    const finalScore = Number(doc.finalExam) || 0;
    const totalScore = Math.round((internalTotal / 60) * 30 + assignmentTotal + (finalScore / 100) * 50);

    let grade = 'B';
    let gradePoint = 7;
    if (totalScore >= 90) { grade = 'A+'; gradePoint = 10; }
    else if (totalScore >= 80) { grade = 'A'; gradePoint = 9; }
    else if (totalScore >= 70) { grade = 'B+'; gradePoint = 8; }
    else if (totalScore >= 60) { grade = 'B'; gradePoint = 7; }
    else if (totalScore >= 50) { grade = 'C'; gradePoint = 6; }
    else { grade = 'F'; gradePoint = 0; }

    doc.totalScore = totalScore;
    doc.grade = grade;
    doc.gradePoint = gradePoint;
    await doc.save();

    res.json(doc);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// --- Custom Hostel Application Approve & Reject ---
router.post('/hostel-applications/:id/approve', async (req, res) => {
  try {
    const { assignedRoomNo } = req.body;
    const app = await models.HostelApplication.findOne(findQuery(req.params.id));
    if (!app) return res.status(404).json({ error: 'Hostel application not found' });

    app.status = 'Approved';
    app.assignedRoom = assignedRoomNo;
    await app.save();

    // Update Room occupancy
    if (assignedRoomNo) {
      const room = await models.Room.findOne({ roomNo: assignedRoomNo });
      if (room) {
        room.occupied = (room.occupied || 0) + 1;
        room.status = room.occupied >= room.capacity ? 'Occupied' : 'Available';
        if (!room.residents) room.residents = [];
        if (!room.residents.includes(app.studentId)) room.residents.push(app.studentId);
        await room.save();
      }
    }

    // Update Student
    if (app.studentId) {
      await models.Student.findOneAndUpdate(
        findQuery(app.studentId),
        { hostelStatus: 'Allocated', hostelRoom: assignedRoomNo }
      );
    }

    res.json({ message: 'Hostel application approved', application: app });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/hostel-applications/:id/reject', async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    const app = await models.HostelApplication.findOne(findQuery(req.params.id));
    if (!app) return res.status(404).json({ error: 'Hostel application not found' });

    app.status = 'Rejected';
    app.rejectionReason = rejectionReason;
    await app.save();

    if (app.studentId) {
      await models.Student.findOneAndUpdate(
        findQuery(app.studentId),
        { hostelStatus: 'None' }
      );
    }

    res.json({ message: 'Hostel application rejected', application: app });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// --- Custom Transport Application Approve & Reject ---
router.post('/transport-applications/:id/approve', async (req, res) => {
  try {
    const { assignedBusNo, assignedStop } = req.body;
    const app = await models.TransportApplication.findOne(findQuery(req.params.id));
    if (!app) return res.status(404).json({ error: 'Transport application not found' });

    app.status = 'Approved';
    app.assignedBus = assignedBusNo;
    app.assignedStop = assignedStop;
    await app.save();

    // Update Bus occupancy
    if (assignedBusNo) {
      const bus = await models.Bus.findOne({ busNo: assignedBusNo });
      if (bus) {
        bus.occupiedSeats = Math.min(bus.capacity, (bus.occupiedSeats || 0) + 1);
        await bus.save();
      }
    }

    // Update Student
    if (app.studentId) {
      await models.Student.findOneAndUpdate(
        findQuery(app.studentId),
        { transportStatus: 'Allocated', transportBus: assignedBusNo }
      );
    }

    res.json({ message: 'Transport application approved', application: app });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/transport-applications/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;
    const app = await models.TransportApplication.findOne(findQuery(req.params.id));
    if (!app) return res.status(404).json({ error: 'Transport application not found' });

    app.status = 'Rejected';
    app.rejectionReason = reason;
    await app.save();

    if (app.studentId) {
      await models.Student.findOneAndUpdate(
        findQuery(app.studentId),
        { transportStatus: 'None' }
      );
    }

    res.json({ message: 'Transport application rejected', application: app });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// --- Auth Endpoints ---
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await models.User.findOne({
      email: { $regex: new RegExp(`^${email.trim()}$`, 'i') },
      password: password
    });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.json(user);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
