require('dotenv').config();
const mongoose = require('mongoose');
const models = require('./models');

// Load generated URI from parts or use raw URI
let mongoUri = process.env.MONGODB_URI;
if (mongoUri && mongoUri.includes('${')) {
  mongoUri = mongoUri
    .replace('${MONGO_USERNAME}', process.env.MONGO_USERNAME)
    .replace('${MONGO_PASSWORD}', process.env.MONGO_PASSWORD)
    .replace('${MONGO_CLUSTER}', process.env.MONGO_CLUSTER);
}

const seedDatabase = async () => {
  try {
    if (!mongoUri) throw new Error("MONGODB_URI is not defined in .env");
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas. Starting seed...');

    // Dynamic import to support ES modules in CommonJS script
    const mockDataUrl = 'file:///' + require('path').resolve(__dirname, '../src/data/mockData.js').replace(/\\/g, '/');
    const mockData = await import(mockDataUrl);

    // Clear existing data
    for (const model of Object.values(models)) {
      await model.deleteMany({});
    }
    console.log('🧹 Cleared existing database records.');

    // Seed Data
    if (mockData.MOCK_USERS) await models.User.insertMany(mockData.MOCK_USERS);
    if (mockData.INITIAL_DEPARTMENTS) await models.Department.insertMany(mockData.INITIAL_DEPARTMENTS);
    if (mockData.INITIAL_STUDENTS) await models.Student.insertMany(mockData.INITIAL_STUDENTS);
    if (mockData.INITIAL_FACULTY) await models.Faculty.insertMany(mockData.INITIAL_FACULTY);
    if (mockData.INITIAL_NOTICES) await models.Notice.insertMany(mockData.INITIAL_NOTICES);
    if (mockData.INITIAL_STUDENT_ATTENDANCE) await models.Attendance.insertMany(mockData.INITIAL_STUDENT_ATTENDANCE);
    if (mockData.INITIAL_STUDENT_MARKS) await models.Marks.insertMany(mockData.INITIAL_STUDENT_MARKS);
    if (mockData.INITIAL_HOSTEL_ROOMS) await models.Room.insertMany(mockData.INITIAL_HOSTEL_ROOMS);
    if (mockData.INITIAL_HOSTEL_APPLICATIONS) await models.HostelApplication.insertMany(mockData.INITIAL_HOSTEL_APPLICATIONS);
    if (mockData.INITIAL_HOSTEL_COMPLAINTS) await models.Complaint.insertMany(mockData.INITIAL_HOSTEL_COMPLAINTS);
    if (mockData.INITIAL_BUSES) await models.Bus.insertMany(mockData.INITIAL_BUSES);
    if (mockData.INITIAL_ROUTES) await models.Route.insertMany(mockData.INITIAL_ROUTES);
    if (mockData.INITIAL_TRANSPORT_APPLICATIONS) await models.TransportApplication.insertMany(mockData.INITIAL_TRANSPORT_APPLICATIONS);

    console.log('🌱 Database seeded successfully with all mock data!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
