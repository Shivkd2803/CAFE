import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, updateQty, remove, totals } = useCart();
  const nav = useNavigate();

  if (items.length === 0)
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-4xl font-bold">Your cart is empty</h1>
        <p className="opacity-70 mt-2">Time to brew some happiness.</p>
        <Link to="/menu" className="btn-primary mt-6">Browse Menu</Link>
      </div>
    );

  return (
    <section className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <h1 className="font-display text-4xl font-bold mb-6">Your Cart</h1>
        {items.map(i => (
          <motion.div key={i._id} layout className="glass p-4 rounded-2xl flex items-center gap-4">
            <img src={i.image} className="w-20 h-20 rounded-xl object-cover" alt=""/>
            <div className="flex-1">
              <h3 className="font-semibold">{i.name}</h3>
              <p className="text-sm opacity-60">₹{i.price} each</p>
            </div>
            <div className="flex items-center glass rounded-full">
              <button onClick={() => updateQty(i._id, i.qty - 1)} className="p-2"><Minus size={14}/></button>
              <span className="px-3 text-sm">{i.qty}</span>
              <button onClick={() => updateQty(i._id, i.qty + 1)} className="p-2"><Plus size={14}/></button>
            </div>
            <p className="font-bold w-20 text-right">₹{(i.price * i.qty).toFixed(0)}</p>
            <button onClick={() => remove(i._id)} className="p-2 text-red-500"><Trash2 size={16}/></button>
          </motion.div>
        ))}
      </div>
      <div className="glass rounded-3xl p-6 h-fit sticky top-24">
        <h2 className="font-display text-2xl font-bold mb-4">Summary</h2>
        <Row k="Items" v={`₹${totals.itemsPrice.toFixed(0)}`}/>
        <Row k="Tax (5%)" v={`₹${totals.taxPrice.toFixed(0)}`}/>
        <Row k="Delivery" v={`₹${totals.deliveryPrice}`}/>
        <hr className="border-coffee-300/30 my-3"/>
        <Row k="Total" v={`₹${totals.totalPrice.toFixed(0)}`} bold/>
        <button onClick={() => nav('/checkout')} className="btn-primary w-full mt-6">Checkout</button>
      </div>
    </section>
  );
}

const Row = ({ k, v, bold }) => (
  <div className={`flex justify-between py-1 ${bold ? 'font-bold text-lg' : 'text-sm opacity-80'}`}>
    <span>{k}</span><span>{v}</span>
  </div>
);