import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import api from '../utils/api';
import MenuCard from '../components/MenuCard';
import { CardSkeleton } from '../components/Skeleton';

const cats = ['All', 'Coffee', 'Tea', 'Snacks', 'Desserts', 'Beverages'];

export default function Menu() {
  const [items, setItems] = useState([]);
  const [cat, setCat] = useState('All');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/menu', { params: { category: cat, q } })
      .then(r => setItems(r.data))
      .finally(() => setLoading(false));
  }, [cat, q]);

  return (
    <>
      <Helmet><title>Menu — Brew Haus</title></Helmet>
      <section className="max-w-7xl mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="uppercase tracking-widest text-xs opacity-70">Our Menu</p>
          <h1 className="font-display text-5xl font-bold mt-2">Crafted with care</h1>
        </motion.div>

        <div className="mt-10 flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" size={18}/>
            <input value={q} onChange={e => setQ(e.target.value)}
              placeholder="Search drinks, snacks…"
              className="input pl-11"/>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {cats.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${cat === c
                  ? 'bg-coffee-800 text-cream'
                  : 'bg-white/60 dark:bg-coffee-800/60 hover:bg-coffee-200/60'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-10">
          {loading
            ? [...Array(8)].map((_, i) => <CardSkeleton key={i}/>)
            : items.length === 0
              ? <p className="col-span-full text-center opacity-60 py-20">No items found.</p>
              : items.map(i => <MenuCard key={i._id} item={i}/>)}
        </div>
      </section>
    </>
  );
}