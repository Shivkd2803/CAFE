import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created!');
      nav('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed');
    } finally { setLoading(false); }
  };

  return (
    <section className="min-h-[80vh] grid place-items-center px-6">
      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        onSubmit={submit} className="glass rounded-3xl p-8 w-full max-w-md space-y-4">
        <h1 className="font-display text-3xl font-bold">Join the Haus</h1>
        <p className="opacity-70 text-sm">Create your account in seconds.</p>
        <input required placeholder="Full Name" value={form.name}
          onChange={e => setForm({...form, name: e.target.value})} className="input"/>
        <input type="email" required placeholder="Email" value={form.email}
          onChange={e => setForm({...form, email: e.target.value})} className="input"/>
        <input type="password" required minLength={6} placeholder="Password (min 6 chars)" value={form.password}
          onChange={e => setForm({...form, password: e.target.value})} className="input"/>
        <button disabled={loading} className="btn-primary w-full">{loading ? 'Creating…' : 'Create Account'}</button>
        <p className="text-sm text-center opacity-70">Already a member? <Link to="/login" className="underline">Sign in</Link></p>
      </motion.form>
    </section>
  );
}