// src/components/ComboOffers.jsx
import React from "react";
import { Tag } from "lucide-react";

export default function ComboOffers({ combos = [], onAdd = () => {} }) {
  if (!combos || combos.length === 0) return null;
  return (
    <div className="bg-white rounded-2xl p-4 shadow">
      <h4 className="font-semibold">Combo Offers</h4>
      <div className="mt-3 space-y-3">
        {combos.map((c) => (
          <div key={c.id} className="flex items-center justify-between">
            <div>
              <div className="font-semibold">{c.title}</div>
              <div className="text-xs text-gray-500">{c.items.map((i) => i.name).join(", ")}</div>
            </div>
            <div className="text-right">
              <div className="font-bold">₹{c.price}</div>
              <button onClick={() => onAdd(c)} className="mt-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-lg text-sm flex items-center gap-2">
                <Tag size={14} /> Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
