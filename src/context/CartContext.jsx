import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch { return []; }
  });

  useEffect(() => { localStorage.setItem('cart', JSON.stringify(items)); }, [items]);

  const addItem = (product, quantity) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === product.id);
      if (existing) return prev.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + quantity } : i);
      const price = quantity >= product.wholesaleMinQty ? product.wholesalePrice : product.unitPrice;
      return [...prev, { productId: product.id, name: product.name, unitPrice: product.unitPrice, wholesalePrice: product.wholesalePrice, wholesaleMinQty: product.wholesaleMinQty, image: product.images?.[0]?.imageUrl, quantity, price }];
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) return removeItem(productId);
    setItems(prev => prev.map(i => {
      if (i.productId !== productId) return i;
      const price = quantity >= i.wholesaleMinQty ? i.wholesalePrice : i.unitPrice;
      return { ...i, quantity, price };
    }));
  };

  const removeItem = (productId) => setItems(prev => prev.filter(i => i.productId !== productId));
  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, updateQuantity, removeItem, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
