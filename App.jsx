import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Doctors from './pages/Doctors';
import Patients from './pages/Patients';
import Schedule from './pages/Schedule';
import Records from './pages/Records';

// Protected Route wrapper
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

// Home redirects based on role
const Home = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  if (user.role === 'doctor') return <Navigate to="/doctor-dashboard" replace />;
  return <Navigate to="/dashboard" replace />;
};

function AppRoutes() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<><Navbar /><Home /></>} />
        <Route path="/dashboard" element={<><Navbar /><ProtectedRoute roles={['patient']}><PatientDashboard /></ProtectedRoute></>} />
        <Route path="/doctor-dashboard" element={<><Navbar /><ProtectedRoute roles={['doctor']}><DoctorDashboard /></ProtectedRoute></>} />
        <Route path="/admin" element={<><Navbar /><ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute></>} />
        <Route path="/doctors" element={<><Navbar /><Doctors /></>} />
        <Route path="/patients" element={<><Navbar /><ProtectedRoute roles={['admin']}><Patients /></ProtectedRoute></>} />
        <Route path="/schedule" element={<><Navbar /><ProtectedRoute><Schedule /></ProtectedRoute></>} />
        <Route path="/records" element={<><Navbar /><ProtectedRoute><Records /></ProtectedRoute></>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
