import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { LayoutDashboard, Coffee, ShoppingBag, Calendar } from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import AdminMenu from './AdminMenu';
import AdminOrders from './AdminOrders';
import AdminReservations from './AdminReservations';

const links = [
  { to: '', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: 'menu', label: 'Menu', icon: Coffee },
  { to: 'orders', label: 'Orders', icon: ShoppingBag },
  { to: 'reservations', label: 'Reservations', icon: Calendar }
];

export default function Admin() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-[220px_1fr] gap-8">
      <aside className="glass rounded-3xl p-4 h-fit md:sticky md:top-24">
        <h2 className="font-display text-xl font-bold px-2 py-2">Admin</h2>
        <nav className="flex md:flex-col gap-1 mt-2">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.end}
              className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-xl text-sm ${isActive ? 'bg-coffee-800 text-cream' : 'hover:bg-coffee-200/40'}`}>
              <l.icon size={16}/> {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div>
        <Routes>
          <Route index element={<AdminDashboard/>}/>
          <Route path="menu" element={<AdminMenu/>}/>
          <Route path="orders" element={<AdminOrders/>}/>
          <Route path="reservations" element={<AdminReservations/>}/>
          <Route path="*" element={<Navigate to=""/>}/>
        </Routes>
      </div>
    </section>
  );
}