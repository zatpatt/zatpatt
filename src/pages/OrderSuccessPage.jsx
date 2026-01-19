import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import Confetti from "react-confetti";

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("currentOrder");
    if (!saved) {
      navigate("/home");
      return;
    }
    setOrder(JSON.parse(saved));
  }, [navigate]);

  if (!order) return null;

  const {
    order_code,
    payment_method,
    final_amount,
    points_used,
    promo_discount,
    tip,
    shipping_amount,
    items = [],
  } = order;

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center p-5">
      <Confetti numberOfPieces={200} recycle={false} />

      {/* Success Icon */}
      <div className="bg-white rounded-full p-6 shadow-lg mt-10">
        <Check className="w-16 h-16 text-green-500" />
      </div>

      <h1 className="text-2xl font-bold mt-5">Order Placed Successfully 🎉</h1>

      <p className="text-gray-500 mt-1">
        Payment Method: {payment_method}
      </p>

      <p className="text-gray-600 mt-1">
        Order ID: <span className="font-semibold">{order_code}</span>
      </p>

      {/* Items */}
      <div className="bg-white shadow-md rounded-2xl w-full max-w-md mt-6 p-5 text-sm">
        <h2 className="font-bold text-lg mb-3">🛍️ Items Ordered</h2>

        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className="flex justify-between">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span className="font-semibold">
                ₹{item.total_price}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bill Summary */}
      <div className="bg-white shadow-md rounded-2xl w-full max-w-md mt-4 p-5 text-sm space-y-2 text-gray-700">
        <h2 className="font-bold text-lg mb-2">🧾 Bill Summary</h2>

        <div className="flex justify-between">
          <span>Shipping Charges</span>
          <span>₹{shipping_amount}</span>
        </div>

        <div className="flex justify-between">
          <span>Delivery Tip</span>
          <span>₹{tip}</span>
        </div>

        {points_used > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Redeem Points</span>
            <span>-₹{points_used}</span>
          </div>
        )}

        {promo_discount > 0 && (
          <div className="flex justify-between text-red-500">
            <span>Promo Discount</span>
            <span>-₹{promo_discount}</span>
          </div>
        )}

        <div className="flex justify-between font-bold text-lg border-t pt-3 text-orange-600">
          <span>Total Paid</span>
          <span>₹{final_amount}</span>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col gap-3 mt-6 w-full max-w-md">
        <button
          onClick={() => navigate("/order-tracking")}
          className="bg-orange-500 text-white py-3 rounded-xl font-bold shadow"
        >
          Track Order
        </button>

        <button
          onClick={() => navigate("/home")}
          className="bg-white border border-orange-500 text-orange-500 py-3 rounded-xl font-bold shadow"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
