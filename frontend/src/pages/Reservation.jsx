import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const times = ['09:00', '10:30', '12:00', '13:30', '15:00', '17:00', '18:30', '20:00', '21:30'];

export default function Reservation() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user.name, phone: '', date: '', time: '', guests: 2, notes: ''
  });
  const [list, setList] = useState([]);

  const load = async () => {
    const { data } = await api.get('/reservations/me');
    setList(data);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reservations', form);
      toast.success('Reservation requested!');
      setForm({ ...form, phone: '', date: '', time: '', guests: 2, notes: '' });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-10">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <p className="uppercase tracking-widest text-xs opacity-70">Reserve</p>
        <h1 className="font-display text-5xl font-bold mt-2">Book your table</h1>
        <p className="opacity-70 mt-3 max-w-md">Reserve a window seat, sip slow, and stay a while.</p>

        <form onSubmit={submit} className="glass rounded-3xl p-6 mt-8 space-y-3">
          <input required placeholder="Name" value={form.name}
            onChange={e => setForm({...form, name: e.target.value})} className="input"/>
          <input required placeholder="Phone" value={form.phone}
            onChange={e => setForm({...form, phone: e.target.value})} className="input"/>
          <div className="grid grid-cols-2 gap-3">
            <input required type="date" min={new Date().toISOString().slice(0,10)} value={form.date}
              onChange={e => setForm({...form, date: e.target.value})} className="input"/>
            <select required value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="input">
              <option value="">Time</option>
              {times.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <input required type="number" min={1} max={20} placeholder="Guests" value={form.guests}
            onChange={e => setForm({...form, guests: +e.target.value})} className="input"/>
          <textarea placeholder="Special requests (optional)" value={form.notes}
            onChange={e => setForm({...form, notes: e.target.value})} className="input" rows={3}/>
          <button className="btn-primary w-full">Reserve Table</button>
        </form>
      </motion.div>

      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
        <h2 className="font-display text-3xl font-bold mb-4">Your reservations</h2>
        <div className="space-y-3">
          {list.length === 0 && <p className="opacity-60">No reservations yet.</p>}
          {list.map(r => (
            <div key={r._id} className="glass rounded-2xl p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">{new Date(r.date).toLocaleDateString()} · {r.time}</p>
                <p className="text-sm opacity-70">{r.guests} guests</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full ${
                r.status === 'confirmed' ? 'bg-green-500/20 text-green-700'
                : r.status === 'cancelled' ? 'bg-red-500/20 text-red-700'
                : 'bg-yellow-500/20 text-yellow-700'}`}>{r.status}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}