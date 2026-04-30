import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Check, Clock } from 'lucide-react';
import api from '../utils/api';
import Loader from '../components/Loader';
import { useSocket } from '../hooks/useSocket';

const steps = ['placed', 'preparing', 'out_for_delivery', 'delivered'];

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  const load = async () => {
    const { data } = await api.get(`/orders/${id}`);
    setOrder(data);
  };
  useEffect(() => { load(); const t = setInterval(load, 15000); return () => clearInterval(t); }, [id]);
  useSocket({ 'order:update': (o) => o._id === id && setOrder(o) });

  if (!order) return <Loader/>;
  const idx = steps.indexOf(order.status);

  return (
    <section className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl font-bold">Order #{order._id.slice(-6)}</h1>
      <p className="opacity-70 mt-1">{new Date(order.createdAt).toLocaleString()}</p>

      {/* Tracker */}
      <div className="glass rounded-3xl p-6 mt-8">
        <div className="flex justify-between items-center">
          {steps.map((s, i) => (
            <div key={s} className="flex-1 flex flex-col items-center relative">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${i <= idx ? 'bg-coffee-800 text-cream' : 'bg-coffee-200 dark:bg-coffee-700'}`}>
                {i < idx ? <Check size={16}/> : i === idx ? <Clock size={16}/> : i+1}
              </div>
              <p className="text-xs mt-2 capitalize text-center">{s.replace('_',' ')}</p>
              {i < steps.length - 1 && <div className={`absolute top-5 left-1/2 w-full h-0.5 ${i < idx ? 'bg-coffee-800' : 'bg-coffee-200 dark:bg-coffee-700'}`}/>}
            </div>
          ))}
        </div>
      </div>

      {/* Items */}
      <div className="glass rounded-3xl p-6 mt-6">
        <h2 className="font-semibold mb-4">Items</h2>
        {order.items.map((i, k) => (
          <div key={k} className="flex items-center gap-3 py-2 border-b last:border-0 border-coffee-300/20">
            <img src={i.image} className="w-14 h-14 rounded-lg object-cover" alt=""/>
            <div className="flex-1">
              <p className="font-medium">{i.name}</p>
              <p className="text-xs opacity-60">x{i.qty}</p>
            </div>
            <p>₹{(i.price * i.qty).toFixed(0)}</p>
          </div>
        ))}
        <div className="flex justify-between font-bold text-lg mt-4">
          <span>Total</span><span>₹{order.totalPrice.toFixed(0)}</span>
        </div>
        <p className="text-sm mt-2">Payment: <span className={`font-semibold ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>{order.paymentStatus}</span></p>
      </div>

      {/* Address */}
      <div className="glass rounded-3xl p-6 mt-6">
        <h2 className="font-semibold mb-2">Delivering to</h2>
        <p className="text-sm opacity-80">{order.shippingAddress.name} · {order.shippingAddress.phone}</p>
        <p className="text-sm opacity-80">{order.shippingAddress.line1}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
      </div>
    </section>
  );
}