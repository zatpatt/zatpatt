// ✅ src/pages/OrderSuccessPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import Confetti from "react-confetti";

export default function OrderSuccessPage() {
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    const savedOrder = localStorage.getItem("currentOrder");
    if (!savedOrder) {
      navigate("/home");
      return;
    }
    const orderData = JSON.parse(savedOrder);
    setOrder(orderData);

    // Generate order ID (mock)
    const randomId = "ORD" + Math.floor(100000 + Math.random() * 900000);
    setOrderId(randomId);
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
    paymentMethod,
    paymentStatus,
    deliveryCharges = 50, // default delivery charges
  } = order;

  const estimatedTime = "30-45 mins"; // You can make this dynamic

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-start p-5">
      {/* Confetti */}
      <Confetti numberOfPieces={250} recycle={false} />

      {/* Success Icon */}
      <div className="bg-white rounded-full p-6 shadow-lg mt-10">
        <Check className="w-16 h-16 text-green-500" />
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mt-5">Order Placed Successfully!</h1>
      <p className="text-gray-500 mt-1">
        Payment: {paymentMethod === "cod" ? "Cash on Delivery" : "Paid Online"} ({paymentStatus})
      </p>
      <p className="text-gray-500 mt-1">
        Order ID: <span className="font-semibold">{orderId}</span>
      </p>

      {/* Order Summary Card */}
      <div className="bg-white shadow-md rounded-2xl w-full max-w-md mt-6 p-5">
        <h2 className="font-bold text-lg mb-3">🛒 Order Summary</h2>
        <div className="space-y-2">
          {cartItems?.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>{item.name} x{item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="border-t mt-3 pt-3 space-y-1 text-gray-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Charges</span>
            <span>{deliveryCharges > 0 ? `₹${deliveryCharges}` : "Free Delivery"}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Tip</span>
            <span>₹{deliveryTip}</span>
          </div>
          <div className="flex justify-between">
            <span>Donation</span>
            <span>₹{donation}</span>
          </div>
          {redeemPoints > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Redeem Points</span>
              <span>-₹{redeemPoints}</span>
            </div>
          )}
          {discount > 0 && (
            <div className="flex justify-between text-red-500">
              <span>Discount</span>
              <span>-₹{discount}</span>
            </div>
          )}
        </div>

        <div className="flex justify-between font-bold text-lg mt-3 border-t pt-3">
          <span>Total</span>
          <span>₹{totalAmount}</span>
        </div>

        <div className="mt-4 text-gray-600">
          <p className="font-semibold">Delivery Address:</p>
          <p>{address?.fullAddress || "N/A"}</p>
          <p>Estimated Delivery Time: {estimatedTime}</p>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col gap-3 mt-6 w-full max-w-md">
        <button
          onClick={() => navigate("/order-tracking")}
          className="w-full bg-orange-500 text-white py-3 rounded-2xl font-bold shadow hover:bg-orange-600 transition"
        >
          Track Order
        </button>
        <button
          onClick={() => navigate("/home")}
          className="w-full bg-white border border-orange-500 text-orange-500 py-3 rounded-2xl font-bold shadow hover:bg-orange-50 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
