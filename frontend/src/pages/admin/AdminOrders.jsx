import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { useSocket } from '../../hooks/useSocket';
import { getSocket } from '../../hooks/useSocket';

const statuses = ['placed','preparing','out_for_delivery','delivered','cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const load = () => api.get('/orders/admin').then(r => setOrders(r.data));
  useEffect(() => {
    load();
    getSocket().emit('joinAdmin');
  }, []);

  useSocket({
    'order:new': (o) => { setOrders(prev => [o, ...prev]); toast.success('🛎️ New order received'); }
  });

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    toast.success('Updated');
    load();
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">Orders</h1>
      <div className="space-y-3">
        {orders.map(o => (
          <div key={o._id} className="glass rounded-2xl p-4 flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <p className="font-semibold">#{o._id.slice(-6)} · {o.user?.name}</p>
              <p className="text-xs opacity-60">{new Date(o.createdAt).toLocaleString()} · {o.items.length} items · ₹{o.totalPrice.toFixed(0)}</p>
              <p className="text-xs opacity-60">Payment: {o.paymentStatus}</p>
            </div>
            <select value={o.status} onChange={e => updateStatus(o._id, e.target.value)} className="input !py-2 !w-auto">
              {statuses.map(s => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}