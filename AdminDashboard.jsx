import { useState, useEffect } from 'react';
import { Users, Activity, Calendar, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ patients: 0, doctors: 0, appointments: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      API.get('/patients'),
      API.get('/doctors'),
      API.get('/appointments')
    ]).then(([p, d, a]) => {
      setStats({ patients: p.data.length, doctors: d.data.length, appointments: a.data.length });
    }).catch(console.error);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome to MedFlow Administration</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/doctors')} className="btn-outline">Manage Doctors</button>
          <button onClick={() => navigate('/patients')} className="btn-outline">Manage Patients</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Patients', value: stats.patients, icon: Users, color: 'text-gray-700', bg: 'bg-gray-100' },
          { label: 'Active Doctors', value: stats.doctors, icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Appointments Today', value: stats.appointments, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Revenue This Month', value: '₹2.4L', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' }
        ].map(s => (
          <div key={s.label} className="card p-6">
            <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center mb-4`}>
              <s.icon size={22} className={s.color} />
            </div>
            <p className={`text-3xl font-bold ${s.color} mb-1`}>{s.value}</p>
            <p className="text-gray-500 text-sm">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button onClick={() => navigate('/doctors')} className="w-full text-left px-4 py-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium text-sm transition-colors">
              → View & Manage Doctors
            </button>
            <button onClick={() => navigate('/patients')} className="w-full text-left px-4 py-3 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 font-medium text-sm transition-colors">
              → View & Manage Patients
            </button>
            <button onClick={() => navigate('/schedule')} className="w-full text-left px-4 py-3 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium text-sm transition-colors">
              → Schedule Appointments
            </button>
          </div>
        </div>
        <div className="card p-6">
          <h3 className="font-bold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-3">
            {[
              { label: 'Database', status: 'Connected', ok: true },
              { label: 'API Server', status: 'Running', ok: true },
              { label: 'Appointments Module', status: 'Active', ok: true }
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-600">{s.label}</span>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${s.ok ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
