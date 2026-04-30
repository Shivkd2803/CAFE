import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Edit2, Trash2, Plus, X } from 'lucide-react';
import api from '../../utils/api';

const empty = { name: '', description: '', price: 0, image: '', category: 'Coffee', isFeatured: false };

export default function AdminMenu() {
  const [items, setItems] = useState([]);
  const [edit, setEdit] = useState(null);

  const load = () => api.get('/menu').then(r => setItems(r.data));
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    try {
      if (edit._id) await api.put(`/menu/${edit._id}`, edit);
      else await api.post('/menu', edit);
      toast.success('Saved');
      setEdit(null); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const del = async (id) => {
    if (!confirm('Delete this item?')) return;
    await api.delete(`/menu/${id}`);
    toast.success('Deleted'); load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-3xl font-bold">Menu items</h1>
        <button onClick={() => setEdit(empty)} className="btn-primary"><Plus size={16}/> New</button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(i => (
          <div key={i._id} className="glass rounded-2xl overflow-hidden">
            <img src={i.image} className="h-36 w-full object-cover" alt=""/>
            <div className="p-4">
              <p className="font-semibold">{i.name}</p>
              <p className="text-xs opacity-60">{i.category} · ₹{i.price}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => setEdit(i)} className="btn-ghost !py-1 !px-3 text-xs"><Edit2 size={12}/> Edit</button>
                <button onClick={() => del(i._id)} className="btn-ghost !py-1 !px-3 text-xs text-red-500"><Trash2 size={12}/> Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {edit && (
        <div className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4">
          <form onSubmit={save} className="bg-cream dark:bg-coffee-800 rounded-3xl p-6 w-full max-w-lg space-y-3 relative">
            <button type="button" onClick={() => setEdit(null)} className="absolute top-4 right-4"><X/></button>
            <h2 className="font-display text-2xl font-bold">{edit._id ? 'Edit' : 'New'} item</h2>
            <input required placeholder="Name" value={edit.name} onChange={e => setEdit({...edit, name: e.target.value})} className="input"/>
            <textarea required placeholder="Description" value={edit.description} onChange={e => setEdit({...edit, description: e.target.value})} className="input" rows={3}/>
            <input required type="number" placeholder="Price" value={edit.price} onChange={e => setEdit({...edit, price: +e.target.value})} className="input"/>
            <input required placeholder="Image URL" value={edit.image} onChange={e => setEdit({...edit, image: e.target.value})} className="input"/>
            <select value={edit.category} onChange={e => setEdit({...edit, category: e.target.value})} className="input">
              {['Coffee','Tea','Snacks','Desserts','Beverages'].map(c => <option key={c}>{c}</option>)}
            </select>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!edit.isFeatured} onChange={e => setEdit({...edit, isFeatured: e.target.checked})}/>
              Featured on home
            </label>
            <button className="btn-primary w-full">Save</button>
          </form>
        </div>
      )}
    </div>
  );
}