// src/components/CartBottomSheet.jsx
import React from "react";
import { useCart } from "../context/CartContext";
import { CheckCircle, ShoppingCart, X } from "lucide-react";

export default function CartBottomSheet() {
  const { showAddedSheet, lastAdded, cartItems, setShowAddedSheet } = useCart();

  if (!showAddedSheet || !lastAdded) return null;

  return (
    <div className="fixed left-4 right-4 bottom-6 z-50">
      <div className="bg-white rounded-2xl shadow-lg p-4 flex items-center gap-4 animate-slide-up">
        <div className="bg-green-50 rounded-full w-12 h-12 flex items-center justify-center text-green-600">
          <CheckCircle />
        </div>
        <div className="flex-1">
          <div className="font-semibold">{lastAdded.name} added to cart</div>
          <div className="text-xs text-gray-500">Cart: {cartItems.length} item(s)</div>
        </div>
        <button onClick={() => window.location.assign("/cart")} className="bg-orange-500 text-white px-4 py-2 rounded-lg">Go to cart</button>
        <button onClick={() => setShowAddedSheet(false)} className="p-2 text-gray-400"><X /></button>
      </div>
    </div>
  );
}
