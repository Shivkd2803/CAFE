import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Coffee, ShoppingBag, Sun, Moon, Menu as MenuIcon, X, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const { dark, setDark } = useTheme();
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const count = items.reduce((s, i) => s + i.qty, 0);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/menu', label: 'Menu' },
    { to: '/reservation', label: 'Reserve' }
  ];

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 glass border-b border-coffee-200/40">
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Coffee className="text-coffee-800 dark:text-cream" />
          <span className="font-display text-xl font-bold tracking-wide">Brew Haus</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <NavLink key={l.to} to={l.to}
              className={({ isActive }) => `text-sm font-medium hover:text-coffee-600 transition ${isActive ? 'text-coffee-800 dark:text-cream' : 'text-coffee-700/80 dark:text-cream/70'}`}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button onClick={() => setDark(!dark)} className="p-2 rounded-full hover:bg-coffee-200/40 dark:hover:bg-coffee-700/40 transition">
            {dark ? <Sun size={18}/> : <Moon size={18}/>}
          </button>
          <Link to="/cart" className="relative p-2 rounded-full hover:bg-coffee-200/40 dark:hover:bg-coffee-700/40 transition">
            <ShoppingBag size={18}/>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-coffee-800 text-cream text-[10px] w-5 h-5 rounded-full flex items-center justify-center">{count}</span>
            )}
          </Link>
          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="btn-ghost !py-2 !px-4 text-sm">
                <User size={16}/> {user.name.split(' ')[0]}
              </Link>
              <button onClick={() => { logout(); nav('/'); }} className="p-2 rounded-full hover:bg-coffee-200/40 dark:hover:bg-coffee-700/40">
                <LogOut size={18}/>
              </button>
            </div>
          ) : (
            <Link to="/login" className="hidden md:inline-flex btn-primary !py-2 !px-5 text-sm">Sign In</Link>
          )}
          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <X/> : <MenuIcon/>}
          </button>
        </div>
      </div>
      {open && (
        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="md:hidden border-t border-coffee-200/40 px-5 py-4 flex flex-col gap-3">
          {links.map(l => <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)}>{l.label}</NavLink>)}
          {user ? (
            <>
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} onClick={() => setOpen(false)}>Dashboard</Link>
              <button onClick={() => { logout(); setOpen(false); nav('/'); }} className="text-left">Logout</button>
            </>
          ) : (
            <Link to="/login" className="btn-primary text-center" onClick={() => setOpen(false)}>Sign In</Link>
          )}
        </motion.div>
      )}
    </motion.header>
  );
}