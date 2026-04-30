import { useEffect, useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import api from '../../utils/api';
import { Coffee, IndianRupee, ShoppingBag, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api.get('/orders/admin/stats').then(r => setStats(r.data)); }, []);
  if (!stats) return <p>Loading…</p>;

  const cards = [
    { icon: ShoppingBag, label: 'Total Orders', val: stats.totalOrders },
    { icon: IndianRupee, label: 'Revenue', val: `₹${stats.revenue.toFixed(0)}` },
    { icon: Coffee, label: 'Preparing', val: stats.byStatus.preparing || 0 },
    { icon: Clock, label: 'Out for delivery', val: stats.byStatus.out_for_delivery || 0 }
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Overview</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(c => (
          <div key={c.label} className="glass rounded-2xl p-5">
            <c.icon className="opacity-60" size={20}/>
            <p className="text-xs opacity-60 mt-2">{c.label}</p>
            <p className="font-display text-2xl font-bold">{c.val}</p>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="font-semibold mb-4">Revenue (last 7 days)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={stats.last7}>
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3E2723" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#3E2723" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2}/>
            <XAxis dataKey="date" fontSize={11}/>
            <YAxis fontSize={11}/>
            <Tooltip/>
            <Area type="monotone" dataKey="total" stroke="#3E2723" fill="url(#g)"/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}