# 🏥 MedFlow - Hospital Management System
## Complete Setup Guide

---

## 📋 TABLE OF CONTENTS
1. Prerequisites
2. Project Structure
3. Backend Setup
4. Frontend Setup
5. Database Setup & Seeding
6. Running the Application
7. Login Credentials
8. Features Overview
9. API Reference
10. Troubleshooting

---

## ✅ STEP 1: Prerequisites

Install the following before starting:

### Node.js (v18+)
- Download from: https://nodejs.org
- Verify: `node --version` (should show v18 or higher)
- Verify: `npm --version`

### MongoDB (v6+)
- Download from: https://www.mongodb.com/try/download/community
- OR use MongoDB Atlas (cloud) — free tier available at https://cloud.mongodb.com
- Verify local install: `mongod --version`

### Git (optional)
- Download from: https://git-scm.com

---

## 📁 STEP 2: Project Structure

After setting up, your folder should look like this:

```
medflow/
├── backend/
│   ├── models/
│   │   ├── User.js           ← Doctor/Patient/Admin schema
│   │   └── Appointment.js    ← Appointment schema
│   ├── routes/
│   │   ├── auth.js           ← Login/Register routes
│   │   ├── doctors.js        ← Doctor CRUD routes
│   │   ├── patients.js       ← Patient CRUD routes
│   │   └── appointments.js   ← Appointment routes
│   ├── middleware/
│   │   └── auth.js           ← JWT authentication middleware
│   ├── server.js             ← Main Express server
│   ├── seed.js               ← Database seeder
│   ├── .env                  ← Environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── Navbar.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── PatientDashboard.jsx
    │   │   ├── DoctorDashboard.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   ├── Doctors.jsx
    │   │   ├── Patients.jsx
    │   │   ├── Schedule.jsx
    │   │   └── Records.jsx
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json
```

---

## 🖥️ STEP 3: Backend Setup

### 3.1 — Navigate to backend folder
```bash
cd medflow/backend
```

### 3.2 — Install dependencies
```bash
npm install
```
This installs: express, mongoose, bcryptjs, jsonwebtoken, cors, dotenv, nodemon

### 3.3 — Configure environment variables
Open the `.env` file and check/update these values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/medflow
JWT_SECRET=medflow_super_secret_jwt_key_2025
NODE_ENV=development
```

⚠️ If using MongoDB Atlas (cloud), replace MONGO_URI with your Atlas connection string:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/medflow
```

---

## 🎨 STEP 4: Frontend Setup

### 4.1 — Navigate to frontend folder
```bash
cd medflow/frontend
```

### 4.2 — Install dependencies
```bash
npm install
```
This installs: React, React Router, Axios, Tailwind CSS, Lucide Icons, Vite

---

## 🗄️ STEP 5: Database Setup & Seeding

### 5.1 — Start MongoDB (local)
**Windows:**
```bash
net start MongoDB
```
OR open MongoDB Compass and connect to `mongodb://localhost:27017`

**Mac/Linux:**
```bash
sudo systemctl start mongod
# OR
mongod --dbpath /data/db
```

### 5.2 — Seed the database with sample data
From the `backend` folder, run:
```bash
node seed.js
```

You should see:
```
✅ MongoDB Connected
✅ Database seeded successfully!

📋 LOGIN CREDENTIALS:
Admin:   admin@medflow.com   / password123
Doctor:  arjun@medflow.com   / password123
Patient: rahul@medflow.com   / password123
```

This creates:
- 1 Admin account
- 4 Doctor accounts
- 4 Patient accounts
- 4 Sample appointments

---

## 🚀 STEP 6: Running the Application

You need TWO terminal windows open simultaneously.

### Terminal 1 — Start Backend Server
```bash
cd medflow/backend
npm run dev
```
Expected output:
```
✅ MongoDB Connected
🚀 Server running on http://localhost:5000
```

### Terminal 2 — Start Frontend
```bash
cd medflow/frontend
npm run dev
```
Expected output:
```
  VITE v4.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

### 6.3 — Open the app
Visit: **http://localhost:5173** in your browser

---

## 🔑 STEP 7: Login Credentials

| Role    | Email                  | Password    | Access                        |
|---------|------------------------|-------------|-------------------------------|
| Admin   | admin@medflow.com      | password123 | Full system access            |
| Doctor  | arjun@medflow.com      | password123 | Doctor dashboard, appointments|
| Doctor  | priya@medflow.com      | password123 | Doctor dashboard, appointments|
| Patient | rahul@medflow.com      | password123 | Patient dashboard, booking    |
| Patient | priyap@medflow.com     | password123 | Patient dashboard, booking    |

---

## 🎯 STEP 8: Features Overview

### 🔐 Login Page (`/login`)
- Role-based login (Admin, Doctor, Patient)
- JWT token authentication
- Auto-redirects to correct dashboard

### 👤 Patient Dashboard (`/dashboard`)
- View upcoming appointments count
- View all personal appointments
- Cancel appointments
- Book new appointments

### 👨‍⚕️ Doctor Dashboard (`/doctor-dashboard`)
- Today's stats (total, seen, pending, cancelled)
- View all assigned appointments
- Confirm or decline pending appointments

### 🏥 Admin Dashboard (`/admin`)
- System-wide statistics
- Quick access to manage doctors & patients
- System status panel

### 🔍 Find Doctors (`/doctors`)
- Grid and List view toggle
- Search by name or specialty
- Doctor cards with ratings, location, experience
- Book appointment button

### 📋 Patient Management (`/patients`) — Admin only
- View all patients in a table
- Search patients
- Add new patients (modal form)
- Edit and delete patients

### 📅 Scheduling (`/schedule`)
- Book new appointment form (select department → doctor → date/time)
- View upcoming schedule list with status badges

### 📁 Records (`/records`)
- View medical records
- Download records (UI ready)

---

## 🌐 STEP 9: API Reference

### Auth
| Method | Endpoint          | Description       |
|--------|-------------------|-------------------|
| POST   | /api/auth/login   | Login user        |
| POST   | /api/auth/register| Register user     |

### Doctors
| Method | Endpoint          | Access       |
|--------|-------------------|--------------|
| GET    | /api/doctors      | Public       |
| POST   | /api/doctors      | Admin only   |
| PUT    | /api/doctors/:id  | Admin only   |
| DELETE | /api/doctors/:id  | Admin only   |

### Patients
| Method | Endpoint          | Access       |
|--------|-------------------|--------------|
| GET    | /api/patients     | Admin only   |
| POST   | /api/patients     | Admin only   |
| DELETE | /api/patients/:id | Admin only   |

### Appointments
| Method | Endpoint              | Access              |
|--------|-----------------------|---------------------|
| GET    | /api/appointments     | Auth (role-filtered)|
| POST   | /api/appointments     | Auth users          |
| PUT    | /api/appointments/:id | Auth users          |
| DELETE | /api/appointments/:id | Auth users          |

---

## 🔧 STEP 10: Troubleshooting

### ❌ "Cannot connect to MongoDB"
- Make sure MongoDB service is running
- Check MONGO_URI in `.env` is correct
- Try: `mongod` in terminal to start manually

### ❌ "Port 5000 already in use"
```bash
# Find process using port 5000
npx kill-port 5000
```
Or change PORT in `.env` to 5001

### ❌ "Module not found" errors
```bash
# Run in the affected folder
npm install
```

### ❌ CORS errors in browser
- Make sure backend is running on port 5000
- Check vite.config.js proxy settings
- Ensure frontend runs on port 5173

### ❌ Login fails with correct credentials
- Re-run the seed: `node seed.js`
- Check MongoDB is running and seeded
- Verify .env JWT_SECRET is set

### ❌ Blank page on frontend
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
npm run dev
```

---

## 📦 Production Build

When ready to deploy:
```bash
# Build frontend
cd frontend
npm run build

# The dist/ folder contains your production-ready frontend
# Deploy backend to services like Railway, Render, or Heroku
# Deploy MongoDB to MongoDB Atlas
```

---

## 🛠️ Tech Stack Summary

| Layer     | Technology              |
|-----------|-------------------------|
| Frontend  | React 18 + Vite         |
| Styling   | Tailwind CSS            |
| Icons     | Lucide React            |
| Routing   | React Router v6         |
| HTTP      | Axios                   |
| Backend   | Node.js + Express       |
| Database  | MongoDB + Mongoose      |
| Auth      | JWT + bcryptjs          |

---

**🎉 You're all set! Visit http://localhost:5173 and log in!**

