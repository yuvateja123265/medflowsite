import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const StatusBadge = ({ status }) => {
  const classes = { Confirmed: 'badge-confirmed', Pending: 'badge-pending', Cancelled: 'badge-cancelled' };
  return <span className={classes[status] || 'badge-pending'}>{status}</span>;
};

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    API.get('/appointments').then(r => setAppointments(r.data)).catch(console.error);
  }, []);

  const total = appointments.length;
  const seen = appointments.filter(a => a.status === 'Confirmed' || a.status === 'Completed').length;
  const pending = appointments.filter(a => a.status === 'Pending').length;
  const cancelled = appointments.filter(a => a.status === 'Cancelled').length;

  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const handleStatus = async (id, status) => {
    const { data } = await API.put(`/appointments/${id}`, { status });
    setAppointments(prev => prev.map(a => a._id === id ? data : a));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome, {user?.name}</p>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar size={18} className="text-blue-600" />
          <span className="font-medium">{today}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Appointments', value: total, color: 'text-blue-600' },
          { label: 'Patients Seen', value: seen, color: 'text-green-600' },
          { label: 'Pending Requests', value: pending, color: 'text-yellow-500' },
          { label: 'Cancellations', value: cancelled, color: 'text-red-500' }
        ].map(s => (
          <div key={s.label} className="card p-6 text-center">
            <p className={`text-4xl font-bold ${s.color} mb-2`}>{s.value}</p>
            <p className="text-gray-500 text-sm">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Appointments */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-lg">Today's Appointments</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {appointments.length === 0 ? (
            <p className="text-center py-10 text-gray-400">No appointments</p>
          ) : appointments.map(apt => (
            <div key={apt._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
              <div>
                <p className="font-medium text-gray-900">{apt.patientName}</p>
                <p className="text-sm text-gray-500">{apt.time} · {apt.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={apt.status} />
                {apt.status === 'Pending' && (
                  <div className="flex gap-2">
                    <button onClick={() => handleStatus(apt._id, 'Confirmed')}
                      className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700">
                      Confirm
                    </button>
                    <button onClick={() => handleStatus(apt._id, 'Cancelled')}
                      className="text-xs border border-red-200 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50">
                      Decline
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
