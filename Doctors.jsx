import { useState, useEffect } from 'react';
import { Search, Grid, List, MapPin, Star, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

const DOCTOR_IMAGES = [
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=300&fit=crop',
];

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('grid');
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/doctors').then(r => setDoctors(r.data)).catch(console.error);
  }, []);

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    (d.specialty || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Find a Doctor</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or specialty..."
              className="input-field pl-9 w-64"
            />
          </div>
          <button onClick={() => setView('grid')}
            className={`p-2 rounded-lg border transition-colors ${view === 'grid' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-500 hover:bg-gray-50'}`}>
            <Grid size={16} />
          </button>
          <button onClick={() => setView('list')}
            className={`p-2 rounded-lg border transition-colors ${view === 'list' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-500 hover:bg-gray-50'}`}>
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Grid View */}
      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((doc, i) => (
            <div key={doc._id} className="card overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-56 bg-gray-100 overflow-hidden">
                <img
                  src={DOCTOR_IMAGES[i % DOCTOR_IMAGES.length]}
                  alt={doc.name}
                  className="w-full h-full object-cover"
                  onError={e => e.target.src = 'https://via.placeholder.com/400x300?text=Doctor'}
                />
                <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 text-sm font-bold flex items-center gap-1 shadow">
                  <Star size={13} className="text-yellow-400 fill-yellow-400" />
                  {doc.rating || '4.8'}
                </div>
              </div>
              <div className="p-5">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">{doc.specialty}</p>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{doc.name}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><MapPin size={14} /> {doc.location || 'N/A'}</span>
                  <span>{doc.experience || 0} Years Exp.</span>
                </div>
                <button onClick={() => navigate('/schedule')}
                  className="btn-primary w-full justify-center">
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // List View
        <div className="space-y-4">
          {filtered.map((doc, i) => (
            <div key={doc._id} className="card overflow-hidden hover:shadow-md transition-shadow flex">
              <div className="w-36 h-36 flex-shrink-0 overflow-hidden">
                <img
                  src={DOCTOR_IMAGES[i % DOCTOR_IMAGES.length]}
                  alt={doc.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">{doc.specialty}</p>
                  <h3 className="text-lg font-bold text-gray-900">{doc.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1"><MapPin size={13} /> {doc.location || 'N/A'}</span>
                    <span>{doc.experience || 0} Years Exp.</span>
                    <span className="flex items-center gap-1"><Star size={13} className="text-yellow-400 fill-yellow-400" />{doc.rating}</span>
                  </div>
                </div>
                <button onClick={() => navigate('/schedule')} className="btn-primary">Book Appointment</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Stethoscope size={48} className="mx-auto mb-3 opacity-30" />
          <p>No doctors found</p>
        </div>
      )}
    </div>
  );
}
