import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import Confetti from "react-confetti";

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [orderId, setOrderId] = useState("");

useEffect(() => {
  const saved = localStorage.getItem("currentOrder");
  if (!saved) return navigate("/home");

  const data = JSON.parse(saved);
  setOrder(data);

  // ✅ Check if order ID already exists in localStorage
  let orderId = localStorage.getItem("currentOrderId");
  if (!orderId) {
    const now = new Date();
    const date = String(now.getDate()).padStart(2, "0") +
                 String(now.getMonth() + 1).padStart(2, "0") +
                 now.getFullYear();
    const time = String(now.getHours()).padStart(2, "0") +
                 String(now.getMinutes()).padStart(2, "0") +
                 String(now.getSeconds()).padStart(2, "0");
    const timestamp = `${date}${time}`;

    // Counter logic
    const lastSecond = localStorage.getItem("lastOrderSecond");
    let counter = parseInt(localStorage.getItem("orderCounter") || "0", 10);

    if (lastSecond === timestamp) {
      counter = (counter + 1) % 100;
    } else {
      counter = 0;
      localStorage.setItem("lastOrderSecond", timestamp);
    }
    localStorage.setItem("orderCounter", counter);
    const serial = String(counter).padStart(2, "0");

    orderId = `${timestamp}${serial}`;
    localStorage.setItem("currentOrderId", orderId); // store it
  }

  setOrderId(orderId);
}, []);

  if (!order) return null;

  const {
    cartItems,
    subtotal,
    deliveryTip,
    donation,
    redeemPoints,
    discount,
    totalAmount,
    address,
    deliveryCharge = 0,
    handlingFee = 0,
    gst = 0,
    paymentMethod = "cod",
    paymentStatus = "pending",
  } = order;

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center p-5">
      {/* 🎉 Confetti */}
      <Confetti numberOfPieces={200} recycle={false} />

      {/* ✅ Success Icon */}
      <div className="bg-white rounded-full p-6 shadow-lg mt-10">
        <Check className="w-16 h-16 text-green-500" />
      </div>

      <h1 className="text-2xl font-bold mt-5">Order Placed Successfully!</h1>
      <p className="text-gray-500">Payment: Cash on Delivery ({paymentStatus})</p>
      <p className="text-gray-500">
        Order ID: <span className="font-semibold">{orderId}</span>
      </p>

      {/* 🧾 Bill Summary */}
      <div className="bg-white shadow-md rounded-2xl w-full max-w-md mt-6 p-5 text-sm">
        <h2 className="font-bold text-lg mb-3">🛒 Order Summary</h2>

        {/* Items */}
        <div className="space-y-1">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>{item.name} × {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        {/* Bill Breakdown */}
        <div className="border-t mt-3 pt-3 space-y-1 text-gray-600">
          <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
          <div className="flex justify-between"><span>Delivery Charge</span><span>₹{deliveryCharge}</span></div>
          <div className="flex justify-between"><span>Handling Fee</span><span>₹{handlingFee}</span></div>
          <div className="flex justify-between"><span>GST</span><span>₹{gst}</span></div>
          <div className="flex justify-between"><span>Delivery Tip</span><span>₹{deliveryTip}</span></div>
          <div className="flex justify-between"><span>Donation</span><span>₹{donation}</span></div>
          <div className="flex justify-between text-green-600"><span>Redeem Points</span><span>-₹{redeemPoints}</span></div>
          <div className="flex justify-between text-red-500"><span>Discount</span><span>-₹{discount}</span></div>
        </div>

        {/* Total */}
        <div className="flex justify-between font-bold text-lg mt-3 border-t pt-3 text-orange-600">
          <span>Total</span>
          <span>₹{totalAmount}</span>
        </div>

        {/* Address */}
        <div className="mt-4 text-gray-700 text-xs">
          <p className="font-semibold">📍 Delivery Address:</p>
          <p>{address.fullAddress}</p>
          <p className="mt-1">📱 {address.phone}</p>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col gap-3 mt-6 w-full max-w-md">
        <button onClick={() => navigate("/order-tracking")} className="bg-orange-500 text-white py-3 rounded-xl font-bold shadow">
          Track Order
        </button>
        <button onClick={() => navigate("/home")} className="bg-white border border-orange-500 text-orange-500 py-3 rounded-xl font-bold shadow">
          Back to Home
        </button>
      </div>
    </div>
  );
}
