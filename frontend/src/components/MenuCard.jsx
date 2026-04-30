import { motion } from 'framer-motion';
import { Plus, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function MenuCard({ item }) {
  const { add } = useCart();
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="glass rounded-3xl overflow-hidden group">
      <Link to={`/menu/${item._id}`} className="block relative h-52 overflow-hidden">
        <img src={item.image} alt={item.name} loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition duration-700"/>
        <div className="absolute top-3 left-3 px-3 py-1 bg-coffee-900/70 text-cream text-xs rounded-full backdrop-blur">
          {item.category}
        </div>
        {item.rating > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-cream/90 rounded-full text-xs">
            <Star size={12} className="fill-yellow-500 text-yellow-500"/> {item.rating.toFixed(1)}
          </div>
        )}
      </Link>
      <div className="p-5">
        <Link to={`/menu/${item._id}`}>
          <h3 className="font-display text-lg font-semibold">{item.name}</h3>
        </Link>
        <p className="text-sm opacity-70 line-clamp-2 mt-1">{item.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold">₹{item.price}</span>
          <button
            onClick={() => { add(item); toast.success('Added to cart'); }}
            className="p-2 rounded-full bg-coffee-800 text-cream hover:scale-110 transition">
            <Plus size={16}/>
          </button>
        </div>
      </div>
    </motion.div>
  );
}