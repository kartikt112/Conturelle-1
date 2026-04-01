'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('conturelle-cart');
      if (saved) setCart(JSON.parse(saved));
    } catch (e) { /* ignore */ }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('conturelle-cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addToCart = useCallback((item) => {
    // item: { slug, name, image, price, originalPrice, color, bandSize, cupSize, qty }
    setCart(prev => {
      const key = `${item.slug}-${item.color}-${item.bandSize || ''}-${item.cupSize || ''}`;
      const existing = prev.find(i =>
        i.slug === item.slug && i.color === item.color &&
        i.bandSize === item.bandSize && i.cupSize === item.cupSize
      );
      if (existing) {
        return prev.map(i => i === existing ? { ...i, qty: i.qty + (item.qty || 1) } : i);
      }
      return [...prev, { ...item, qty: item.qty || 1, id: key }];
    });
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id, qty) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(item => item.id === id ? { ...item, qty } : item));
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const toggleCart = useCallback(() => {
    setIsCartOpen(prev => !prev);
  }, []);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shippingThreshold = 75;
  const amountToFreeShipping = Math.max(0, shippingThreshold - cartSubtotal);
  const hasFreeShipping = cartSubtotal >= shippingThreshold;
  const shippingProgress = Math.min(100, (cartSubtotal / shippingThreshold) * 100);

  return (
    <CartContext.Provider value={{
      cart, cartCount, cartSubtotal, isCartOpen, isLoaded,
      addToCart, removeFromCart, updateQuantity, clearCart,
      toggleCart, openCart, closeCart,
      shippingThreshold, amountToFreeShipping, hasFreeShipping, shippingProgress,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
