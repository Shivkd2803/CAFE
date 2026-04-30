import { createContext, useContext, useEffect, useMemo, useState } from 'react';
const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem('cart') || '[]'));
  useEffect(() => localStorage.setItem('cart', JSON.stringify(items)), [items]);

  const add = (item, qty = 1) => {
    setItems((prev) => {
      const i = prev.findIndex((p) => p._id === item._id);
      if (i >= 0) { const copy = [...prev]; copy[i].qty += qty; return copy; }
      return [...prev, { ...item, qty }];
    });
  };
  const remove = (id) => setItems((p) => p.filter((i) => i._id !== id));
  const updateQty = (id, qty) => setItems((p) => p.map((i) => i._id === id ? { ...i, qty: Math.max(1, qty) } : i));
  const clear = () => setItems([]);

  const totals = useMemo(() => {
    const itemsPrice = items.reduce((s, i) => s + i.price * i.qty, 0);
    const taxPrice = +(itemsPrice * 0.05).toFixed(2);
    const deliveryPrice = items.length ? 40 : 0;
    const totalPrice = +(itemsPrice + taxPrice + deliveryPrice).toFixed(2);
    return { itemsPrice, taxPrice, deliveryPrice, totalPrice };
  }, [items]);

  return (
    <CartContext.Provider value={{ items, add, remove, updateQty, clear, totals }}>
      {children}
    </CartContext.Provider>
  );
};