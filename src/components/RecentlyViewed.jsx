// src/components/RecentlyViewed.jsx
import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function RecentlyViewed({ limit = 6 }) {
  const { recentlyViewed } = useCart();
  const navigate = useNavigate();
  if (!recentlyViewed || recentlyViewed.length === 0) return null;
  return (
    <div className="p-4">
      <h4 className="font-semibold mb-3">Recently Viewed</h4>
      <div className="flex gap-3 overflow-x-auto">
        {recentlyViewed.slice(0, limit).map((p) => (
          <div key={p.key} onClick={() => navigate(`/product/${encodeURIComponent(p.category)}/${encodeURIComponent(p.id)}`)} className="w-28 bg-white p-2 rounded-lg shadow cursor-pointer">
            <div className="h-16 bg-gray-100 mb-2">{p.img ? <img src={p.img} alt={p.name} className="w-full h-full object-cover" /> : null}</div>
            <div className="text-xs font-semibold">{p.name}</div>
            <div className="text-xs text-gray-500">₹{p.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
