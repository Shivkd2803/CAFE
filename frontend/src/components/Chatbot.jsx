import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X } from 'lucide-react';
import api from '../utils/api';

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ role: 'bot', text: 'Hi ☕ I\'m your barista. Tell me how you feel and I\'ll suggest a drink!' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const text = input;
    setMsgs(m => [...m, { role: 'user', text }]);
    setInput('');
    setLoading(true);
    try {
      const { data } = await api.post('/chat/suggest', { message: text });
      setMsgs(m => [...m, { role: 'bot', text: data.reply }]);
    } catch {
      setMsgs(m => [...m, { role: 'bot', text: 'Hmm, I couldn\'t connect. Try again in a moment.' }]);
    } finally { setLoading(false); }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-coffee-800 text-cream shadow-2xl flex items-center justify-center">
        {open ? <X/> : <MessageCircle/>}
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-24 right-6 z-50 w-[90vw] max-w-sm h-[480px] glass rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            <div className="px-4 py-3 bg-coffee-800 text-cream font-semibold">Brew Haus AI Barista</div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${m.role === 'user' ? 'bg-coffee-800 text-cream' : 'bg-white/80 dark:bg-coffee-700 dark:text-cream'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && <div className="text-xs opacity-60">Brewing a thought…</div>}
            </div>
            <div className="p-3 border-t border-coffee-200/40 flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="I feel tired…"
                className="input !py-2"/>
              <button onClick={send} className="btn-primary !py-2 !px-4"><Send size={16}/></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}