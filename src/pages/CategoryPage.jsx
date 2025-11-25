// src/pages/CategoryPage.jsx
import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Star } from "lucide-react";
import { CATEGORY_DATA } from "../data/CategoryData";

export default function CategoryPage() {
  const { name } = useParams();
  const navigate = useNavigate();
  const items = CATEGORY_DATA[name] || [];

  const [sortBy, setSortBy] = useState("none");
  const [filterRating, setFilterRating] = useState(0);
  const [q, setQ] = useState("");
  const [loading] = useState(false); // set true to test skeleton

  const filtered = useMemo(() => {
    let list = items.filter((i) => i.name.toLowerCase().includes(q.toLowerCase()));
    if (filterRating) list = list.filter((i) => i.rating >= filterRating);
    if (sortBy === "low-high") list.sort((a, b) => a.price - b.price);
    if (sortBy === "high-low") list.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [items, sortBy, filterRating, q]);

  return (
    <div className="min-h-screen bg-[#fff9f4] pb-28">
      <header className="bg-orange-500 text-white py-4 px-6 flex items-center shadow-md">
        <button onClick={() => navigate(-1)} className="bg-white text-orange-600 p-2 rounded-full mr-3">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-lg font-bold">{name}</h1>
      </header>

      {/* search + filters */}
      <div className="p-4 space-y-3">
        <div className="flex gap-3">
          <div className="flex items-center bg-white rounded-full px-3 py-2 flex-1 shadow">
            <Search size={16} className="text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={`Search in ${name}`}
              className="ml-3 flex-1 outline-none"
            />
          </div>

          <select className="bg-white px-3 py-2 rounded-lg shadow text-sm" onChange={(e) => setSortBy(e.target.value)}>
            <option value="none">Sort</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>

          <select className="bg-white px-3 py-2 rounded-lg shadow text-sm" onChange={(e) => setFilterRating(Number(e.target.value))}>
            <option value="0">Ratings</option>
            <option value="4">4★ & above</option>
            <option value="3">3★ & above</option>
          </select>
        </div>

        {/* optional chips for quick filters */}
        <div className="flex gap-2 overflow-x-auto">
          <button onClick={() => { setQ(""); setFilterRating(0); setSortBy("none"); }} className="bg-white px-3 py-1 rounded-full text-sm shadow">All</button>
          <button onClick={() => setFilterRating(4)} className="bg-white px-3 py-1 rounded-full text-sm shadow">Top Rated</button>
          <button onClick={() => setSortBy("low-high")} className="bg-white px-3 py-1 rounded-full text-sm shadow">Price Low</button>
        </div>
      </div>

      {/* grid */}
      <div className="px-4 grid grid-cols-2 gap-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-40 rounded-lg" />
          ))
        ) : filtered.length === 0 ? (
          <div className="col-span-2 text-center text-gray-500 py-10">No items found</div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl p-3 shadow hover:shadow-md transition cursor-pointer"
              onClick={() => navigate(`/product/${encodeURIComponent(name)}/${encodeURIComponent(item.id)}`, { state: { item } })}
            >
              <div className="h-28 bg-gray-100 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                {item.img ? <img src={item.img} alt={item.name} className="object-cover w-full h-full" /> : <div className="text-gray-400">No image</div>}
              </div>
              <div className="text-sm font-semibold">{item.name}</div>
              <div className="text-xs text-gray-500">{item.time}</div>
              <div className="mt-2 flex items-center justify-between">
                <div className="font-bold">₹{item.price}</div>
                <div className="flex items-center text-xs text-green-600 gap-1">
                  <Star size={14} /> {item.rating}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
