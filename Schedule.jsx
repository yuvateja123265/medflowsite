import { useState, useEffect } from 'react';
import { Calendar, Clock, User, ChevronRight } from 'lucide-react';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';

const StatusBadge = ({ status }) => {
  const classes = { Confirmed: 'badge-confirmed', Pending: 'badge-pending', Cancelled: 'badge-cancelled' };
  return <span className={classes[status] || 'badge-pending'}>{status}</span>;
};

const DEPARTMENTS = ['Cardiology', 'Neurology', 'Dermatology', 'Pediatrics', 'Orthopedics', 'General Medicine'];

export default function Schedule() {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({ patientName: '', department: 'Cardiology', doctorId: '', date: '', time: '10:00' });
  const [success, setSuccess] = useState('');

  useEffect(() => {
    API.get('/doctors').then(r => setDoctors(r.data));
    if (user) API.get('/appointments').then(r => setAppointments(r.data)).catch(() => {});
  }, [user]);

  const filteredDocs = doctors.filter(d => d.department === form.department || d.specialty?.includes(form.department));

  const handleBook = async (e) => {
    e.preventDefault();
    const doc = doctors.find(d => d._id === form.doctorId);
    if (!doc) return alert('Please select a doctor');
    try {
      const { data } = await API.post('/appointments', {
        doctorId: form.doctorId,
        doctor: form.doctorId,
        doctorName: doc.name,
        specialty: doc.specialty,
        department: form.department,
        date: form.date,
        time: form.time + ' AM',
        patientName: form.patientName || user?.name
      });
      setAppointments(prev => [data, ...prev]);
      setSuccess('Appointment booked successfully!');
      setForm({ patientName: '', department: 'Cardiology', doctorId: '', date: '', time: '10:00' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Scheduling</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Book Form */}
        <div className="card p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Book New Appointment</h2>
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-5">
              ✓ {success}
            </div>
          )}
          <form onSubmit={handleBook} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Patient Name</label>
              <input
                placeholder="Enter your name"
                value={form.patientName}
                onChange={e => setForm({ ...form, patientName: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Department</label>
              <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value, doctorId: '' })} className="input-field">
                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Doctor</label>
              <select required value={form.doctorId} onChange={e => setForm({ ...form, doctorId: e.target.value })} className="input-field">
                <option value="">-- Select Doctor --</option>
                {doctors.map(d => <option key={d._id} value={d._id}>{d.name} ({d.specialty})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
              <input type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Time</label>
              <input type="time" required value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} className="input-field" />
            </div>
            <button type="submit" className="btn-primary w-full justify-center py-3 text-base">
              Book Appointment
            </button>
          </form>
        </div>

        {/* Upcoming Schedule */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Schedule</h2>
          <div className="space-y-3">
            {appointments.slice(0, 6).map(apt => (
              <div key={apt._id} className="card p-4 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Calendar size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{apt.doctorName}</p>
                    <p className="text-xs text-gray-500 mb-1">{apt.specialty}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Clock size={11} /> {apt.time}</span>
                      <span className="flex items-center gap-1"><User size={11} /> {apt.patientName}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={apt.status} />
                  <ChevronRight size={16} className="text-gray-300" />
                </div>
              </div>
            ))}
            {appointments.length === 0 && (
              <div className="text-center py-12 text-gray-400 card">No upcoming appointments</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
