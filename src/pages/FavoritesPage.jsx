//src\pages\FavoritesPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Search, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FavoritesPage() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterType, setFilterType] = useState("all"); // all | restaurant | product

  useEffect(() => {
    setFavorites(JSON.parse(localStorage.getItem("favorites")) || []);
  }, []);

  // Search
  const filtered = favorites.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  // Filter Type
  const filteredByType =
    filterType === "all"
      ? filtered
      : filtered.filter((f) => f.type === filterType);

  // Sort
  const sorted = [...filteredByType].sort((a, b) => {
    if (sortBy === "newest") return b.addedAt - a.addedAt;
    if (sortBy === "oldest") return a.addedAt - b.addedAt;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center">

      {/* HEADER */}
      <header className="bg-orange-500 text-white py-4 w-full flex justify-center relative shadow-lg">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-3 bg-white p-2 rounded-full shadow"
        >
          <ArrowLeft className="text-orange-500 w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold flex items-center gap-2">
          Favorites
        </h1>
      </header>

      {/* SEARCH + FILTER + SORT */}
      <div className="w-full max-w-lg p-4 space-y-3">

        {/* Search */}
        <div className="flex items-center bg-white px-3 py-2 rounded-xl shadow border border-orange-100 gap-2">
          <Search className="text-orange-400 w-5 h-5" />
          <input
            placeholder="Search favorites..."
            className="flex-1 outline-none text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Filter Bar */}
        <div className="bg-white px-3 py-2 rounded-xl shadow border border-orange-100 flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-600">Filter:</span>
          <select
            className="text-sm bg-orange-50 px-2 py-1 rounded-lg border border-orange-200"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="restaurant">Restaurants</option>
            <option value="product">Products</option>
          </select>
        </div>

        {/* Sort */}
        <div className="bg-white px-3 py-2 rounded-xl shadow border border-orange-100 flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-600">Sort:</span>
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

      {/* FAVORITES LIST */}
      <div className="w-full max-w-lg p-4">
        <AnimatePresence>
          {sorted.length === 0 ? (
            <p className="text-center text-gray-400 mt-10 font-bold">
              No favorites found
            </p>
          ) : (
            sorted.map((item) => (
              <motion.div
                key={item.id}
                className="bg-white p-4 rounded-xl shadow-md mb-3 flex justify-between items-center border border-orange-100"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div>
                  <p className="font-bold">{item.name}</p>
                  {item.type === "product" && (
                    <p className="text-xs text-gray-400">
                      Product • ₹{item.amount}
                    </p>
                  )}
                  {item.type === "restaurant" && (
                    <p className="text-xs text-gray-400">Restaurant</p>
                  )}
                </div>

                <button
                  onClick={() => {
                    const updated = favorites.filter((f) => f.id !== item.id);
                    setFavorites(updated);
                    localStorage.setItem("favorites", JSON.stringify(updated));
                  }}
                >
                  {/* Orange filled heart */}
                  <Heart className="w-6 h-6 text-orange-500 fill-orange-500" />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
