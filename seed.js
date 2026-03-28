const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Appointment = require('./models/Appointment');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  await User.deleteMany({});
  await Appointment.deleteMany({});
  console.log('Cleared existing data');

  // Use plain password — User model pre-save hook hashes it ONCE correctly
  const plain = 'password123';

  // Admin
  await User.create({ name: 'Admin User', email: 'admin@medflow.com', password: plain, role: 'admin' });

  // Doctors — use User.create() (not insertMany) so pre-save hook fires
  const d1 = await User.create({ name: 'Dr. Arjun Mehta', email: 'arjun@medflow.com', password: plain, role: 'doctor', specialty: 'Cardiologist', department: 'Cardiology', location: 'Mumbai', experience: 15, rating: 4.8 });
  const d2 = await User.create({ name: 'Dr. Priya Sharma', email: 'priya@medflow.com', password: plain, role: 'doctor', specialty: 'Neurologist', department: 'Neurology', location: 'Delhi', experience: 10, rating: 4.9 });
  const d3 = await User.create({ name: 'Dr. Rajesh Gupta', email: 'rajesh@medflow.com', password: plain, role: 'doctor', specialty: 'Dermatologist', department: 'Dermatology', location: 'Bangalore', experience: 8, rating: 4.7 });
  const d4 = await User.create({ name: 'Dr. Neha Verma', email: 'neha@medflow.com', password: plain, role: 'doctor', specialty: 'Pediatrician', department: 'Pediatrics', location: 'Chennai', experience: 12, rating: 4.6 });

  // Patients
  const p1 = await User.create({ name: 'Rahul Sharma', email: 'rahul@medflow.com', password: plain, role: 'patient', age: 45, gender: 'Male', contact: '(555) 123-4567', status: 'Active' });
  const p2 = await User.create({ name: 'Priya Patel', email: 'priyap@medflow.com', password: plain, role: 'patient', age: 32, gender: 'Female', contact: '(555) 987-6543', status: 'Pending' });
  const p3 = await User.create({ name: 'Amit Singh', email: 'amit@medflow.com', password: plain, role: 'patient', age: 28, gender: 'Male', contact: '(555) 456-7890', status: 'Active' });
  const p4 = await User.create({ name: 'Anjali Gupta', email: 'anjali@medflow.com', password: plain, role: 'patient', age: 56, gender: 'Female', contact: '(555) 246-8135', status: 'Discharged' });

  // Appointments
  await Appointment.insertMany([
    { patient: p1._id, patientName: 'Rahul Sharma', doctor: d1._id, doctorName: 'Dr. Arjun Mehta', specialty: 'Cardiologist', department: 'Cardiology', date: '2025-06-15', time: '10:00 AM', status: 'Confirmed' },
    { patient: p1._id, patientName: 'Rahul Sharma', doctor: d2._id, doctorName: 'Dr. Priya Sharma', specialty: 'Neurologist', department: 'Neurology', date: '2025-07-20', time: '02:00 PM', status: 'Pending' },
    { patient: p2._id, patientName: 'Priya Patel', doctor: d2._id, doctorName: 'Dr. Priya Sharma', specialty: 'Neurologist', department: 'Neurology', date: '2025-06-15', time: '11:00 AM', status: 'Pending' },
    { patient: p3._id, patientName: 'Amit Singh', doctor: d3._id, doctorName: 'Dr. Rajesh Gupta', specialty: 'Dermatologist', department: 'Dermatology', date: '2025-06-15', time: '02:00 PM', status: 'Cancelled' },
  ]);

  console.log('✅ Database seeded successfully!');
  console.log('\n📋 LOGIN CREDENTIALS:');
  console.log('Admin:   admin@medflow.com   / password123');
  console.log('Doctor:  arjun@medflow.com   / password123');
  console.log('Patient: rahul@medflow.com   / password123');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
