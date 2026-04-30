import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../hooks/useSocket';
import { Coffee } from 'lucide-react';

const statusColor = {
  placed: 'bg-blue-500/20 text-blue-700',
  preparing: 'bg-yellow-500/20 text-yellow-700',
  out_for_delivery: 'bg-orange-500/20 text-orange-700',
  delivered: 'bg-green-500/20 text-green-700',
  cancelled: 'bg-red-500/20 text-red-700'
};

export default function Dashboard() {
  const { user, setUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('orders');
  const [profile, setProfile] = useState({ name: user.name, phone: user.phone || '' });

  const load = async () => {
    const { data } = await api.get('/orders/user');
    setOrders(data);
  };
  useEffect(() => {
    load();
    const s = require && import('socket.io-client');
  }, []);

  useSocket({
    'order:update': (o) => {
      setOrders(prev => prev.map(x => x._id === o._id ? o : x));
      toast.success(`Order #${o._id.slice(-6)} → ${o.status}`);
    }
  });

  const saveProfile = async (e) => {
    e.preventDefault();
    const { data } = await api.put('/users/profile', profile);
    setUser({ ...user, ...data });
    toast.success('Profile updated');
  };

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl font-bold">Hi, {user.name.split(' ')[0]} 👋</h1>
      <p className="opacity-70 mt-1">Manage your orders and profile here.</p>

      <div className="flex gap-2 mt-8">
        {['orders', 'profile'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-full text-sm font-medium capitalize ${tab === t ? 'bg-coffee-800 text-cream' : 'glass'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'orders' && (
        <div className="mt-6 space-y-3">
          {orders.length === 0 && (
            <div className="glass rounded-3xl p-12 text-center">
              <Coffee size={40} className="mx-auto opacity-50 mb-3"/>
              <p className="opacity-70">No orders yet. <Link to="/menu" className="underline">Order something delicious</Link>.</p>
            </div>
          )}
          {orders.map(o => (
            <Link key={o._id} to={`/orders/${o._id}`}
              className="glass rounded-2xl p-5 flex items-center justify-between hover:scale-[1.01] transition">
              <div>
                <p className="font-semibold">Order #{o._id.slice(-6)}</p>
                <p className="text-xs opacity-60">{new Date(o.createdAt).toLocaleString()}</p>
                <p className="text-sm mt-1 opacity-80">{o.items.length} items · ₹{o.totalPrice.toFixed(0)}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full ${statusColor[o.status]}`}>{o.status.replace('_',' ')}</span>
            </Link>
          ))}
        </div>
      )}

      {tab === 'profile' && (
        <form onSubmit={saveProfile} className="glass rounded-3xl p-6 mt-6 max-w-lg space-y-4">
          <input className="input" placeholder="Name" value={profile.name}
            onChange={e => setProfile({...profile, name: e.target.value})}/>
          <input className="input" placeholder="Phone" value={profile.phone}
            onChange={e => setProfile({...profile, phone: e.target.value})}/>
          <input className="input opacity-60" disabled value={user.email}/>
          <button className="btn-primary">Save</button>
        </form>
      )}
    </section>
  );
}