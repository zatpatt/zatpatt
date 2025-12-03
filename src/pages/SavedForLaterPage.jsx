// src/pages/SavedForLaterPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Search, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";

export default function SavedForLaterPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [savedForLater, setSavedForLater] = useState([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [toast, setToast] = useState(false);

  // Load saved items
  useEffect(() => {
    setSavedForLater(JSON.parse(localStorage.getItem("savedForLater")) || []);
  }, []);

  // Persist
  useEffect(() => {
    localStorage.setItem("savedForLater", JSON.stringify(savedForLater));
  }, [savedForLater]);

  // FILTER
  const filtered = savedForLater.filter((item) =>
    item.name?.toLowerCase().includes(query.toLowerCase())
  );

  // SORT
  const sorted = [...filtered].sort((a, b) => {
  if (sortBy === "newest")
    return ("" + b.id).localeCompare("" + a.id);

  if (sortBy === "oldest")
    return ("" + a.id).localeCompare("" + b.id);

  if (sortBy === "name")
    return a.name.localeCompare(b.name);

  return 0;
});

  // MOVE TO CART
  const moveToCart = (item) => {
    addToCart(item, 1);

    const updated = savedForLater.filter((s) => s.id !== item.id);
    setSavedForLater(updated);

    setToast(true);
    setTimeout(() => setToast(false), 2000);
  };

  // REMOVE
  const removeItem = (id) => {
    const updated = savedForLater.filter((item) => item.id !== id);
    setSavedForLater(updated);
  };

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center relative">

      {/* HEADER */}
      <header className="bg-orange-500 text-white py-4 w-full flex justify-center relative shadow-lg">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-3 bg-white p-2 rounded-full shadow"
        >
          <ArrowLeft className="text-orange-500 w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Star className="w-5 h-5 fill-orange-500 text-white" /> Saved for Later
        </h1>
      </header>

      {/* CONTROLS */}
      <div className="w-full max-w-lg p-4 space-y-3">

        {/* Search */}
        <div className="flex items-center bg-white px-3 py-2 rounded-xl shadow border border-orange-100 gap-2">
          <Search className="text-orange-400 w-5 h-5" />
          <input
            placeholder="Search items..."
            className="flex-1 outline-none text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Sort */}
        <div className="flex justify-between items-center bg-white px-3 py-2 rounded-xl shadow border border-orange-50">
          <label className="text-sm font-semibold text-gray-600">Sort:</label>
          <select
            className="text-sm bg-orange-50 px-2 py-1 rounded-lg border border-orange-200"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name (A–Z)</option>
          </select>
        </div>

      </div>

      {/* LIST */}
      <div className="w-full max-w-lg p-4">
        <AnimatePresence>
          {sorted.length === 0 ? (
            <p className="text-center text-gray-400 mt-10 font-bold">
              No saved items found
            </p>
          ) : (
            sorted.map((item) => (
              <motion.div
                key={item.id}
                className="bg-white p-4 rounded-xl shadow-md mb-3 flex justify-between items-center border border-orange-100"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {/* LEFT */}
                <div>
                  <p className="font-bold">{item.name}</p>

                  {item.type === "product" && (
                    <p className="text-xs text-gray-500">Product • ₹{item.amount}</p>
                  )}

                  {item.type === "restaurant" && (
                    <p className="text-xs text-gray-500">Restaurant</p>
                  )}
                </div>

                {/* ACTIONS */}
                <div className="flex gap-3 items-center">

                  {/* Move to cart */}
                  <button
                    onClick={() => moveToCart(item)}
                    className="flex items-center gap-1 bg-orange-500 text-white px-4 py-1 rounded-xl text-sm shadow"
                  >
                    <ShoppingCart size={16} />
                    Move to Cart
                  </button>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                  >
                    Remove
                  </button>

                </div>

              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="fixed bottom-4 bg-green-600 text-white px-4 py-2 rounded-xl shadow-lg text-sm"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
          >
            ✅ Item moved to cart
          </motion.div>
        )}
      </AnimatePresence>

      {/* CART BUTTON */}
      <button
        onClick={() => navigate("/cart")}
        className="fixed bottom-20 right-6 bg-orange-500 text-white p-4 rounded-full shadow-lg"
      >
        <ShoppingCart className="w-6 h-6" />
      </button>
    </div>
  );
}
