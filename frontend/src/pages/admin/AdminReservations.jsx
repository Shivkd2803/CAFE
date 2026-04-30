import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

export default function AdminReservations() {
  const [list, setList] = useState([]);
  const load = () => api.get('/reservations').then(r => setList(r.data));
  useEffect(() => { load(); }, []);
  const update = async (id, status) => {
    await api.put(`/reservations/${id}`, { status });
    toast.success('Updated'); load();
  };
  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">Reservations</h1>
      <div className="space-y-3">
        {list.map(r => (
          <div key={r._id} className="glass rounded-2xl p-4 flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <p className="font-semibold">{r.name} · {r.guests} guests</p>
              <p className="text-xs opacity-60">{new Date(r.date).toLocaleDateString()} · {r.time} · {r.phone}</p>
              {r.notes && <p className="text-xs italic opacity-70">"{r.notes}"</p>}
            </div>
            <select value={r.status} onChange={e => update(r._id, e.target.value)} className="input !py-2 !w-auto">
              <option value="pending">pending</option>
              <option value="confirmed">confirmed</option>
              <option value="cancelled">cancelled</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}