import { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const StatusBadge = ({ status }) => {
  const classes = { Active: 'badge-active', Pending: 'badge-pending', Discharged: 'badge-discharged' };
  return <span className={classes[status] || 'badge-pending'}>{status}</span>;
};

export default function Patients() {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: 'password123', age: '', gender: 'Male', contact: '', status: 'Active' });

  useEffect(() => {
    if (user?.role === 'admin') {
      API.get('/patients').then(r => setPatients(r.data)).catch(console.error);
    }
  }, [user]);

  const filtered = patients.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.contact?.includes(search)
  );

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/patients', { ...form, role: 'patient' });
      setPatients(prev => [...prev, data]);
      setShowModal(false);
      setForm({ name: '', email: '', password: 'password123', age: '', gender: 'Male', contact: '', status: 'Active' });
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding patient');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this patient?')) return;
    await API.delete(`/patients/${id}`);
    setPatients(prev => prev.filter(p => p._id !== id));
  };

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 text-center text-gray-400">
        <p className="text-lg">Access restricted to administrators only.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage patient records and admissions</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <UserPlus size={18} /> Add New Patient
        </button>
      </div>

      {/* Table Card */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
          <h2 className="font-bold text-gray-900">All Patients</h2>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search patients..." className="input-field pl-8 text-sm py-2 w-56" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['ID', 'Name', 'Age/Gender', 'Contact', 'Last Visit', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p, i) => (
                <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-blue-600 font-medium">#{101 + i}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                  <td className="px-6 py-4 text-gray-600">{p.age || '-'} / {p.gender || '-'}</td>
                  <td className="px-6 py-4 text-gray-600">{p.contact || '-'}</td>
                  <td className="px-6 py-4 text-gray-600">{p.createdAt?.split('T')[0] || '-'}</td>
                  <td className="px-6 py-4"><StatusBadge status={p.status || 'Active'} /></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="text-gray-400 hover:text-blue-600 transition-colors"><Pencil size={16} /></button>
                      <button onClick={() => handleDelete(p._id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-10 text-gray-400">No patients found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm text-gray-500">Showing 1 to {filtered.length} of {filtered.length} entries</span>
          <div className="flex gap-2">
            <button className="btn-outline text-sm py-1.5 px-3">Previous</button>
            <button className="bg-blue-600 text-white text-sm py-1.5 px-3 rounded-lg">1</button>
            <button className="btn-outline text-sm py-1.5 px-3">Next</button>
          </div>
        </div>
      </div>

      {/* Add Patient Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Patient</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <input required placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field" />
              <input required type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input-field" />
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="Age" value={form.age} onChange={e => setForm({...form, age: e.target.value})} className="input-field" />
                <select value={form.gender} onChange={e => setForm({...form, gender: e.target.value})} className="input-field">
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <input placeholder="Contact Number" value={form.contact} onChange={e => setForm({...form, contact: e.target.value})} className="input-field" />
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="input-field">
                <option>Active</option><option>Pending</option><option>Discharged</option>
              </select>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1 justify-center">Cancel</button>
                <button type="submit" className="btn-primary flex-1 justify-center">Add Patient</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
