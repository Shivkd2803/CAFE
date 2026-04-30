import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function Checkout() {
  const { items, totals, clear } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: user?.name || '', phone: '', line1: '', city: '', state: '', zip: '' });
  const [loading, setLoading] = useState(false);

  const placeOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) return toast.error('Cart is empty');
    setLoading(true);
    try {
      // 1) Create order in DB
      const { data: order } = await api.post('/orders', {
        items: items.map(i => ({ product: i._id, name: i.name, image: i.image, price: i.price, qty: i.qty })),
        shippingAddress: form,
        ...totals
      });

      // 2) Create Razorpay order
      const { data: rzpOrder } = await api.post('/payment/order', { amount: totals.totalPrice });

      // 3) Open Razorpay
      const options = {
        key: rzpOrder.key,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: 'Brew Haus',
        description: `Order #${order._id.slice(-6)}`,
        order_id: rzpOrder.id,
        prefill: { name: user.name, email: user.email, contact: form.phone },
        theme: { color: '#3E2723' },
        handler: async (response) => {
          try {
            await api.post('/payment/verify', { ...response, orderId: order._id });
            clear();
            toast.success('Payment successful!');
            nav(`/orders/${order._id}`);
          } catch {
            toast.error('Verification failed');
          }
        },
        modal: { ondismiss: () => toast.error('Payment cancelled') }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Could not place order');
    } finally { setLoading(false); }
  };

  return (
    <section className="max-w-5xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-10">
      <form onSubmit={placeOrder} className="space-y-4">
        <h1 className="font-display text-4xl font-bold">Delivery Address</h1>
        {[
          ['name','Full Name'], ['phone','Phone'], ['line1','Address'],
          ['city','City'], ['state','State'], ['zip','PIN Code']
        ].map(([k, l]) => (
          <input key={k} required value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})}
            placeholder={l} className="input"/>
        ))}
        <button disabled={loading} className="btn-primary w-full">
          {loading ? 'Processing…' : `Pay ₹${totals.totalPrice.toFixed(0)}`}
        </button>
      </form>

      <div className="glass rounded-3xl p-6 h-fit">
        <h2 className="font-display text-2xl font-bold mb-4">Order Summary</h2>
        <div className="space-y-2 max-h-72 overflow-y-auto">
          {items.map(i => (
            <div key={i._id} className="flex items-center gap-3 text-sm">
              <img src={i.image} className="w-12 h-12 rounded-lg object-cover" alt=""/>
              <div className="flex-1">
                <p className="font-medium">{i.name}</p>
                <p className="opacity-60 text-xs">x{i.qty}</p>
              </div>
              <p>₹{(i.price * i.qty).toFixed(0)}</p>
            </div>
          ))}
        </div>
        <hr className="my-4 border-coffee-300/30"/>
        <div className="flex justify-between text-sm"><span>Subtotal</span><span>₹{totals.itemsPrice.toFixed(0)}</span></div>
        <div className="flex justify-between text-sm"><span>Tax</span><span>₹{totals.taxPrice.toFixed(0)}</span></div>
        <div className="flex justify-between text-sm"><span>Delivery</span><span>₹{totals.deliveryPrice}</span></div>
        <div className="flex justify-between font-bold text-lg mt-2"><span>Total</span><span>₹{totals.totalPrice.toFixed(0)}</span></div>
      </div>
    </section>
  );
}