// src/pages/RecentOrdersPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Heart, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RecentOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const pastOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(pastOrders);
  }, []);

  const addToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    localStorage.setItem("cart", JSON.stringify([...cart, item]));
    navigate("/cart");
  };

  const toggleFavorite = (item) => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const exists = favorites.find(fav => fav.id === item.id);
    let updated;

    if (exists) {
      updated = favorites.filter(fav => fav.id !== item.id);
    } else {
      updated = [...favorites, item];
    }

    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center">
      
      <header className="bg-orange-500 text-white py-4 w-full flex justify-center relative shadow-lg">
        <button onClick={() => navigate(-1)} className="absolute left-4 top-3 bg-white p-2 rounded-full shadow">
          <ArrowLeft className="text-orange-500 w-5 h-5"/>
        </button>
        <h1 className="text-xl font-bold">🕒 Recent Orders</h1>
      </header>

      <div className="w-full max-w-lg p-5 mt-4">
        <AnimatePresence>
          {orders.length === 0 ? (
            <p className="text-center text-gray-400 mt-10 font-bold text-lg">No orders yet</p>
          ) : (
            orders.map(item => (
              <motion.div
                key={item.id}
                className="bg-white p-4 rounded-2xl shadow-md mb-3 flex justify-between items-center border border-orange-200"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
              >
                
                <div>
                  <p className="font-bold text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-500">₹{item.amount}</p>
                  <p className="text-xs text-gray-400">Order ID: {item.orderNumber}</p>
                </div>

                <div className="flex gap-3 items-center">
                  <button onClick={() => toggleFavorite(item)}>
                    <Heart className="text-orange-500 fill-orange-500 w-5 h-5"/>
                  </button>
                  <button onClick={() => toggleFavorite(item)}>
                    <Star className="text-orange-500 fill-orange-500 w-5 h-5"/>
                  </button>

                  <button
                    onClick={() => addToCart(item)}
                    className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm shadow flex items-center gap-1 hover:bg-gray-300 active:scale-95 transition"
                  >
                    <ShoppingCart className="w-4 h-4"/> Add to Cart
                  </button>
                </div>

              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
      
    </div>
  );
}
