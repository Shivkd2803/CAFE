import { Coffee, Instagram, Twitter, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-coffee-900 text-cream/80 mt-20">
      <div className="max-w-7xl mx-auto px-5 py-12 grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Coffee/> <span className="font-display text-xl">Brew Haus</span>
          </div>
          <p className="text-sm leading-relaxed">Crafting premium coffee experiences since 2018. Bean to cup, with love.</p>
        </div>
        <div>
          <h4 className="font-semibold text-cream mb-3">Visit</h4>
          <p className="text-sm">42 Roastery Lane,<br/>Bandra, Mumbai 400050</p>
          <p className="text-sm mt-2">Open daily · 7am – 11pm</p>
        </div>
        <div>
          <h4 className="font-semibold text-cream mb-3">Contact</h4>
          <p className="text-sm">hello@brewhaus.com</p>
          <p className="text-sm">+91 98xxxxxxx0</p>
        </div>
        <div>
          <h4 className="font-semibold text-cream mb-3">Follow</h4>
          <div className="flex gap-3">
            <a className="p-2 rounded-full bg-cream/10 hover:bg-cream/20"><Instagram size={16}/></a>
            <a className="p-2 rounded-full bg-cream/10 hover:bg-cream/20"><Twitter size={16}/></a>
            <a className="p-2 rounded-full bg-cream/10 hover:bg-cream/20"><Facebook size={16}/></a>
          </div>
        </div>
      </div>
      <div className="border-t border-cream/10 py-4 text-center text-xs">© {new Date().getFullYear()} Brew Haus. All rights reserved.</div>
    </footer>
  );
}