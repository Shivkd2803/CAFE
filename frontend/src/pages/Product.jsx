import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Plus, Minus, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

export default function Product() {
  const { id } = useParams();
  const { add } = useCart();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [qty, setQty] = useState(1);
  const [form, setForm] = useState({ rating: 5, comment: '' });

  const load = async () => {
    const { data } = await api.get(`/menu/${id}`);
    setItem(data);
    const { data: rs } = await api.get(`/reviews/${id}`);
    setReviews(rs);
  };
  useEffect(() => { load(); }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reviews', { productId: id, ...form });
      toast.success('Review posted');
      setForm({ rating: 5, comment: '' });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not post');
    }
  };

  if (!item) return <Loader/>;

  return (
    <>
      <Helmet><title>{item.name} — Brew Haus</title></Helmet>
      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <img src={item.image} alt={item.name} className="rounded-3xl w-full aspect-square object-cover shadow-2xl"/>
        </motion.div>
        <div>
          <p className="uppercase tracking-widest text-xs opacity-70">{item.category}</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold mt-2">{item.name}</h1>
          <div className="flex items-center gap-2 mt-3">
            <Star className="fill-yellow-500 text-yellow-500" size={16}/>
            <span className="text-sm">{item.rating?.toFixed(1) || '—'} ({item.numReviews || 0} reviews)</span>
          </div>
          <p className="mt-6 leading-relaxed opacity-80">{item.description}</p>
          <p className="mt-6 text-3xl font-bold">₹{item.price}</p>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center glass rounded-full">
              <button onClick={() => setQty(q => Math.max(1, q-1))} className="p-3"><Minus size={16}/></button>
              <span className="px-4 font-semibold">{qty}</span>
              <button onClick={() => setQty(q => q+1)} className="p-3"><Plus size={16}/></button>
            </div>
            <button onClick={() => { add(item, qty); toast.success('Added to cart'); }} className="btn-primary">
              <ShoppingBag size={18}/> Add to Cart
            </button>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="font-display text-3xl font-bold mb-6">Reviews</h2>
        {user && (
          <form onSubmit={submitReview} className="glass p-6 rounded-3xl mb-8 space-y-3">
            <div className="flex gap-2">
              {[1,2,3,4,5].map(n => (
                <button type="button" key={n} onClick={() => setForm({...form, rating: n})}>
                  <Star className={n <= form.rating ? 'fill-yellow-500 text-yellow-500' : 'text-coffee-400'}/>
                </button>
              ))}
            </div>
            <textarea required value={form.comment} onChange={e => setForm({...form, comment: e.target.value})}
              placeholder="Share your experience…" rows={3} className="input"/>
            <button className="btn-primary">Post Review</button>
          </form>
        )}
        <div className="space-y-4">
          {reviews.length === 0 && <p className="opacity-60">No reviews yet. Be the first!</p>}
          {reviews.map(r => (
            <div key={r._id} className="glass p-5 rounded-2xl">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{r.user?.name}</p>
                <div className="flex gap-1">
                  {[...Array(r.rating)].map((_, i) => <Star key={i} size={14} className="fill-yellow-500 text-yellow-500"/>)}
                </div>
              </div>
              <p className="opacity-80 mt-2 text-sm">{r.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}