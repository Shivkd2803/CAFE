import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const loc = useLocation();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const u = await login(form.email, form.password);
      toast.success(`Welcome back, ${u.name.split(' ')[0]}!`);
      nav(loc.state?.from || (u.role === 'admin' ? '/admin' : '/dashboard'));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <section className="min-h-[80vh] grid place-items-center px-6">
      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        onSubmit={submit} className="glass rounded-3xl p-8 w-full max-w-md space-y-4">
        <h1 className="font-display text-3xl font-bold">Welcome back ☕</h1>
        <p className="opacity-70 text-sm">Sign in to continue.</p>
        <input type="email" required placeholder="Email"
          value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input"/>
        <input type="password" required placeholder="Password" minLength={6}
          value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="input"/>
        <button disabled={loading} className="btn-primary w-full">{loading ? 'Signing in…' : 'Sign In'}</button>
        <p className="text-sm text-center opacity-70">No account? <Link to="/register" className="underline">Sign up</Link></p>
      </motion.form>
    </section>
  );
}