// src/pages/ProductPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, Star, ShoppingCart, Tag, Plus, Minus } from "lucide-react";
import { CATEGORY_DATA } from "../data/CategoryData";
import { useCart } from "../context/CartContext";
import ComboOffers from "../components/ComboOffers";

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { category, id } = useParams();
  const loc = useLocation();
  const itemFromState = loc.state?.item;
  const { addToCart, addToRecentlyViewed } = useCart();
  const [qty, setQty] = useState(1);
  const [loading] = useState(false);
  const items = CATEGORY_DATA[decodeURIComponent(category)] || [];
  const product = itemFromState || items.find((p) => p.id === decodeURIComponent(id));

  useEffect(() => {
    if (product) addToRecentlyViewed(product);
  }, [product]);

  const combos = useMemo(() => {
    // simple hard-coded combos; replace with backend combos
    if (!product) return [];
    return [
      {
        id: "combo-1",
        title: "Breakfast Combo",
        items: [{ name: product.name, price: product.price }, { name: "Maggi", price: 14 }],
        price: product.price + 14,
      },
      {
        id: "combo-2",
        title: "Snack Combo",
        items: [{ name: product.name, price: product.price }, { name: "KurKure", price: 20 }],
        price: product.price + 20,
      },
    ];
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Product not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf6] pb-36">
      <header className="bg-orange-500 text-white py-4 px-4 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-3 bg-white/90 text-orange-500 p-2 rounded-full">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-lg font-bold">{product.name}</h1>
      </header>

      <main className="p-4 space-y-4">
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="h-48 bg-gray-100 rounded-lg overflow-hidden mb-3 flex items-center justify-center">
            {product.img ? <img src={product.img} alt={product.name} className="w-full h-full object-cover" /> : <div className="text-gray-400">No image</div>}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold">{product.name}</div>
              <div className="text-xs text-gray-500 mt-1">{product.desc}</div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold">₹{product.price}</div>
              <div className="text-xs text-green-600 flex items-center gap-1"><Star size={14} />{product.rating}</div>
            </div>
          </div>

          {/* qty + add to cart */}
          <div className="mt-4 flex items-center gap-3">
            <div className="flex items-center bg-gray-100 rounded-lg px-2">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2"><Minus size={14} /></button>
              <div className="px-3 font-semibold">{qty}</div>
              <button onClick={() => setQty(qty + 1)} className="p-2"><Plus size={14} /></button>
            </div>

            <button
              onClick={() => {
                addToCart({ ...product, category: decodeURIComponent(category) }, qty);
              }}
              className="ml-auto bg-orange-500 text-white px-5 py-3 rounded-2xl font-semibold flex items-center gap-2"
            >
              <ShoppingCart /> Add {qty}
            </button>
          </div>
        </div>

        {/* Combo offers */}
        <ComboOffers combos={combos} onAdd={(combo) => addToCart({ id: combo.id, name: combo.title, price: combo.price, img: product.img, category: decodeURIComponent(category) }, 1)} />

        {/* reviews placeholder */}
        <div className="bg-white rounded-2xl p-4 shadow">
          <h3 className="font-semibold">Customer reviews</h3>
          <div className="mt-3 text-sm text-gray-600">
            <div className="flex items-center gap-2"><Star size={14} className="text-yellow-500" /> 4.5 — 150 ratings</div>
            <p className="mt-2">Good quality, fresh and nicely packed.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
