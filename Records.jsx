import { FileText, Download, Search } from 'lucide-react';

const MOCK_RECORDS = [
  { id: 1, type: 'Blood Test', doctor: 'Dr. Arjun Mehta', date: '2025-05-20', status: 'Normal' },
  { id: 2, type: 'X-Ray Report', doctor: 'Dr. Priya Sharma', date: '2025-04-15', status: 'Review' },
  { id: 3, type: 'ECG Report', doctor: 'Dr. Arjun Mehta', date: '2025-03-10', status: 'Normal' },
  { id: 4, type: 'MRI Scan', doctor: 'Dr. Priya Sharma', date: '2025-02-28', status: 'Abnormal' },
];

export default function Records() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
          <p className="text-gray-500 text-sm mt-1">Your complete health history</p>
        </div>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input placeholder="Search records..." className="input-field pl-9 w-56" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_RECORDS.map(r => (
          <div key={r.id} className="card p-5 flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <FileText size={22} className="text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{r.type}</p>
                <p className="text-sm text-gray-500">{r.doctor}</p>
                <p className="text-xs text-gray-400 mt-0.5">{r.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                r.status === 'Normal' ? 'bg-green-100 text-green-700' :
                r.status === 'Abnormal' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
              }`}>{r.status}</span>
              <button className="text-gray-400 hover:text-blue-600 transition-colors">
                <Download size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
