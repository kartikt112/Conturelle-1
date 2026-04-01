'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('conturelle-wishlist');
      if (saved) setWishlist(JSON.parse(saved));
    } catch (e) { /* ignore */ }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('conturelle-wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, isLoaded]);

  const addToWishlist = useCallback((item) => {
    setWishlist(prev => {
      if (prev.some(i => i.slug === item.slug)) return prev;
      return [...prev, { slug: item.slug, name: item.name, image: item.image, price: item.price, salePrice: item.salePrice }];
    });
  }, []);

  const removeFromWishlist = useCallback((slug) => {
    setWishlist(prev => prev.filter(i => i.slug !== slug));
  }, []);

  const toggleWishlist = useCallback((item) => {
    setWishlist(prev => {
      if (prev.some(i => i.slug === item.slug)) {
        return prev.filter(i => i.slug !== item.slug);
      }
      return [...prev, { slug: item.slug, name: item.name, image: item.image, price: item.price, salePrice: item.salePrice }];
    });
  }, []);

  const isInWishlist = useCallback((slug) => {
    return wishlist.some(i => i.slug === slug);
  }, [wishlist]);

  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider value={{
      wishlist, wishlistCount, isLoaded,
      addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
}
