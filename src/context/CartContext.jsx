// src/context/CartContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cartItems")) || [];
    } catch {
      return [];
    }
  });

  const [showAddedSheet, setShowAddedSheet] = useState(false);
  const [lastAdded, setLastAdded] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const addToCart = (product, qty = 1) => {
    setCartItems((prev) => {
      const found = prev.find((p) => p.id === product.id && p.category === product.category);
      if (found) {
        return prev.map((p) =>
          p.id === product.id && p.category === product.category ? { ...p, qty: p.qty + qty } : p
        );
      }
      return [...prev, { ...product, qty }];
    });
    setLastAdded({ ...product, qty });
    setShowAddedSheet(true);
    // auto-hide after 2s
    setTimeout(() => setShowAddedSheet(false), 2000);
  };

  const removeFromCart = (id, category) => {
    setCartItems((prev) => prev.filter((p) => !(p.id === id && p.category === category)));
  };

  const updateQty = (id, category, qty) => {
    setCartItems((prev) => prev.map((p) => (p.id === id && p.category === category ? { ...p, qty } : p)));
  };

  const clearCart = () => setCartItems([]);

  const addToRecentlyViewed = (product) => {
    setRecentlyViewed((prev) => {
      const key = `${product.category}::${product.id}`;
      const filtered = prev.filter((p) => p.key !== key);
      const newItem = {
        key,
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        img: product.img || "",
        ts: Date.now(),
      };
      const next = [newItem, ...filtered].slice(0, 12);
      return next;
    });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        showAddedSheet,
        setShowAddedSheet,
        lastAdded,
        recentlyViewed,
        addToRecentlyViewed,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
