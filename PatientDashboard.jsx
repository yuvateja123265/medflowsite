import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, FileText, User, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const StatusBadge = ({ status }) => {
  const classes = {
    Confirmed: 'badge-confirmed', Pending: 'badge-pending',
    Cancelled: 'badge-cancelled', Completed: 'badge-confirmed'
  };
  return <span className={classes[status] || 'badge-pending'}>{status}</span>;
};

export default function PatientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/appointments').then(r => setAppointments(r.data)).catch(console.error);
  }, []);

  const upcoming = appointments.filter(a => a.status !== 'Cancelled' && a.status !== 'Completed');

  const handleCancel = async (id) => {
    if (!confirm('Cancel this appointment?')) return;
    await API.delete(`/appointments/${id}`);
    setAppointments(prev => prev.filter(a => a._id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back, {user?.name}</p>
        </div>
        <Link to="/schedule" className="btn-primary">+ Book New Appointment</Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
            <Calendar size={22} className="text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{upcoming.length}</p>
            <p className="text-gray-500 text-sm">Upcoming Visits</p>
          </div>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
            <FileText size={22} className="text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">12</p>
            <p className="text-gray-500 text-sm">Medical Records</p>
          </div>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center">
            <User size={22} className="text-yellow-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">Search</p>
            <Link to="/doctors" className="text-blue-600 text-sm hover:underline">Find Doctors</Link>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-lg">My Appointments</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Doctor</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {appointments.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-10 text-gray-400">No appointments found</td></tr>
              ) : appointments.map(apt => (
                <tr key={apt._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{apt.doctorName}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{apt.specialty}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Calendar size={13} className="text-gray-400" />{apt.date}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} className="text-gray-400" />{apt.time}
                    </div>
                  </td>
                  <td className="px-6 py-4"><StatusBadge status={apt.status} /></td>
                  <td className="px-6 py-4">
                    {apt.status !== 'Cancelled' && apt.status !== 'Completed' && (
                      <button onClick={() => handleCancel(apt._id)}
                        className="text-red-500 border border-red-200 hover:bg-red-50 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
