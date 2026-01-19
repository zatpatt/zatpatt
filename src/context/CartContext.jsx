import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  // -----------------------------
  // CART ITEMS
  // -----------------------------
  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cartItems")) || [];
    } catch {
      return [];
    }
  });

  // -----------------------------
  // CART MERCHANT (ONE STORE RULE)
  // -----------------------------
  const [cartMerchantId, setCartMerchantId] = useState(() => {
    return localStorage.getItem("cartMerchantId");
  });

  // -----------------------------
  // ADD TO CART FEEDBACK
  // -----------------------------
  const [showAddedSheet, setShowAddedSheet] = useState(false);
  const [lastAdded, setLastAdded] = useState(null);

  // -----------------------------
  // REPLACE CART MODAL STATE
  // -----------------------------
  const [replaceCartProduct, setReplaceCartProduct] = useState(null);

  // -----------------------------
  // RECENTLY VIEWED
  // -----------------------------
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    } catch {
      return [];
    }
  });

  // -----------------------------
  // LOCAL STORAGE SYNC
  // -----------------------------
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (cartMerchantId) {
      localStorage.setItem("cartMerchantId", cartMerchantId);
    } else {
      localStorage.removeItem("cartMerchantId");
    }
  }, [cartMerchantId]);

  useEffect(() => {
    localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  // -----------------------------
  // ADD TO CART (WITH MERCHANT CHECK)
  // -----------------------------
  const addToCart = (product, qty = 1) => {
    // 🔒 One merchant per cart rule
    if (cartMerchantId && cartMerchantId !== product.merchantId) {
      // trigger replace-cart modal
      setReplaceCartProduct({ product, qty });
      return;
    }

    setCartMerchantId(product.merchantId);

    setCartItems((prev) => {
      const found = prev.find(
        (p) => p.id === product.id && p.category === product.category
      );

      if (found) {
        return prev.map((p) =>
          p.id === product.id && p.category === product.category
            ? { ...p, qty: p.qty + qty }
            : p
        );
      }

      return [...prev, { ...product, qty }];
    });

    setLastAdded({ ...product, qty });
    setShowAddedSheet(true);
    setTimeout(() => setShowAddedSheet(false), 2000);
  };

  // -----------------------------
  // CONFIRM CART REPLACEMENT
  // -----------------------------
  const confirmReplaceCart = () => {
    if (!replaceCartProduct) return;

    const { product, qty } = replaceCartProduct;

    setCartItems([{ ...product, qty }]);
    setCartMerchantId(product.merchantId);
    setLastAdded({ ...product, qty });
    setShowAddedSheet(true);

    setReplaceCartProduct(null);
    setTimeout(() => setShowAddedSheet(false), 2000);
  };

  // -----------------------------
  // CANCEL CART REPLACEMENT
  // -----------------------------
  const cancelReplaceCart = () => {
    setReplaceCartProduct(null);
  };

  // -----------------------------
  // REMOVE / UPDATE / CLEAR
  // -----------------------------
  const removeFromCart = (id, category) => {
    setCartItems((prev) =>
      prev.filter((p) => !(p.id === id && p.category === category))
    );
  };

  const updateQty = (id, category, qty) => {
    if (qty <= 0) {
      removeFromCart(id, category);
      return;
    }
    setCartItems((prev) =>
      prev.map((p) =>
        p.id === id && p.category === category ? { ...p, qty } : p
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setCartMerchantId(null);
  };

  // -----------------------------
  // RECENTLY VIEWED
  // -----------------------------
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
      return [newItem, ...filtered].slice(0, 12);
    });
  };

  // -----------------------------
  // CONTEXT PROVIDER
  // -----------------------------
  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartMerchantId,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,

        // replace cart flow
        replaceCartProduct,
        confirmReplaceCart,
        cancelReplaceCart,

        // UI helpers
        showAddedSheet,
        setShowAddedSheet,
        lastAdded,

        // recently viewed
        recentlyViewed,
        addToRecentlyViewed,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
