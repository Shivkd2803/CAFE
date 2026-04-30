import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Coffee, Leaf, Award } from 'lucide-react';
import api from '../utils/api';
import MenuCard from '../components/MenuCard';
import { CardSkeleton } from '../components/Skeleton';

const testimonials = [
  { name: 'Aanya R.', text: 'The cappuccino here is the best I\'ve ever had. The interior feels like a warm hug.', role: 'Regular' },
  { name: 'Rohan K.', text: 'Beautiful space, attentive staff, and that tiramisu — pure magic.', role: 'Food Blogger' },
  { name: 'Priya S.', text: 'My go-to study spot. Cold brew + croissant + WiFi = productivity heaven.', role: 'Student' }
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/menu?featured=1').then(r => setFeatured(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Helmet>
        <title>Brew Haus — Premium Artisan Cafe</title>
        <meta name="description" content="Hand-crafted coffee, fresh pastries and a cozy aesthetic. Order online or reserve a table at Brew Haus."/>
      </Helmet>

      {/* Hero */}
      <section className="relative h-[92vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=1920" className="w-full h-full object-cover" alt=""/>
          <div className="absolute inset-0 bg-gradient-to-r from-coffee-900/90 via-coffee-900/60 to-transparent"/>
        </div>
        <div className="relative max-w-7xl mx-auto px-6 text-cream">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="uppercase tracking-[0.3em] text-xs mb-4">Artisan Coffee · Est. 2018</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="font-display text-5xl md:text-7xl font-bold leading-tight max-w-3xl">
            Brewed with love.<br/><span className="italic font-light">Served with soul.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="mt-6 text-lg max-w-xl opacity-90">
            From hand-picked beans to slow-poured perfection — every cup tells a story.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className="mt-10 flex flex-wrap gap-4">
            <Link to="/menu" className="btn-primary bg-cream !text-coffee-900 hover:bg-coffee-100">
              Order Now <ArrowRight size={18}/>
            </Link>
            <Link to="/reservation" className="btn-ghost border-cream text-cream hover:bg-cream/10">
              Book a Table
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-8">
        {[
          { icon: Coffee, title: 'Single-Origin Beans', text: 'Sourced from small farms in Chikmagalur and Coorg.' },
          { icon: Leaf, title: 'Sustainable', text: 'Compostable cups, fair trade, zero food waste kitchen.' },
          { icon: Award, title: 'Award-Winning', text: 'India Coffee Awards 2023 — Best Independent Cafe.' }
        ].map((v, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-3xl p-8">
            <v.icon className="text-coffee-700 dark:text-cream mb-4" size={32}/>
            <h3 className="font-display text-xl font-semibold mb-2">{v.title}</h3>
            <p className="opacity-70 text-sm">{v.text}</p>
          </motion.div>
        ))}
      </section>

      {/* Featured menu */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="uppercase tracking-widest text-xs opacity-70">House Specials</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-2">Featured menu</h2>
          </div>
          <Link to="/menu" className="hidden md:inline-flex items-center gap-2 text-sm font-medium hover:text-coffee-600">
            View all <ArrowRight size={14}/>
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? [...Array(4)].map((_, i) => <CardSkeleton key={i}/>)
            : featured.map(i => <MenuCard key={i._id} item={i}/>)}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-coffee-100 dark:bg-coffee-800/50 py-20 mt-10">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-display text-4xl font-bold text-center mb-12">What our guests say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass p-8 rounded-3xl">
                <p className="italic opacity-90 leading-relaxed">"{t.text}"</p>
                <div className="mt-6">
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-xs opacity-60">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <h2 className="font-display text-4xl md:text-5xl font-bold">Ready for your next cup?</h2>
        <p className="opacity-70 mt-4 max-w-xl mx-auto">Skip the queue — order ahead or reserve a window seat overlooking the garden.</p>
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <Link to="/menu" className="btn-primary">Order Online</Link>
          <Link to="/reservation" className="btn-ghost">Reserve a Table</Link>
        </div>
      </section>
    </>
  );
}