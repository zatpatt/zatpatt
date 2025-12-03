import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Wallet, ArrowLeft, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PaymentPage() {
  const navigate = useNavigate();

  // ✅ Load order from cart checkout
  const [order, setOrder] = useState(() => {
    const saved = localStorage.getItem("currentOrder");
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedPayment, setSelectedPayment] = useState("cod");
  const [ripple, setRipple] = useState({ x: 0, y: 0, show: false });

  useEffect(() => {
    if (!order) navigate("/cart");
  }, [order]);

  if (!order) return null;

  const { subtotal, deliveryTip, donation, redeemPoints, discount, deliveryCharge, totalAmount } = order;

  // ✅ Force final amount = exact total stored from cart
  const finalAmount = totalAmount ?? 0;

  const handlePayment = () => {
    const updatedOrder = {
      ...order,
      paymentMethod: "cod",
      paymentStatus: "pending",
      totalAmount: finalAmount,
    };

    localStorage.setItem("currentOrder", JSON.stringify(updatedOrder));
    localStorage.setItem("cartItems", JSON.stringify([]));
    const remaining = (order.currentPoints || 0) - (order.redeemPoints || 0);
    localStorage.setItem("currentPoints", Math.max(remaining, 0));

    navigate("/order-success");
  };

  // ✅ Only COD enabled
  const paymentOptions = [
    {
      id: "cod",
      label: "Cash on Delivery",
      icon: "₹",
      description: "Pay with cash upon delivery",
      enabled: true,
    },
    {
      id: "online",
      label: "UPI / Online Payment",
      icon: <CreditCard className="w-5 h-5 text-gray-400" />,
      description: "UPI, Card, Netbanking",
      enabled: false,
    },
    {
      id: "wallet",
      label: "App Wallet",
      icon: <Wallet className="w-5 h-5 text-gray-400" />,
      description: "Use wallet balance",
      enabled: false,
    },
  ];

  const createRipple = (e) => {
    if (!e.currentTarget) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      show: true,
    });
    setTimeout(() => setRipple((r) => ({ ...r, show: false })), 400);
  };

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col">

      {/* Header */}
      <header className="bg-orange-500 text-white py-4 px-5 flex items-center shadow">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-white text-orange-500 mr-3"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold">💳 Select Payment</h1>
      </header>

      {/* Payment Tiles */}
      <div className="flex-1 p-5 space-y-4">
        {paymentOptions.map((option) => (
          <div key={option.id} className="relative">
            <button
              onClick={(e) => {
                if (!option.enabled) return;
                setSelectedPayment(option.id);
                createRipple(e);
              }}
              disabled={!option.enabled}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border border-gray-300 bg-white shadow-md transition ${
                !option.enabled ? "opacity-60 cursor-not-allowed" : "hover:scale-105"
              }`}
            >

              {/* Left Side */}
              <div className="flex items-center gap-3">
                {option.icon === "₹" ? (
                  <span className="text-orange-500 font-bold text-lg">₹</span>
                ) : (
                  option.icon
                )}
                <div className="text-left">
                  <p className="font-semibold">{option.label}</p>
                  <p className="text-gray-500 text-xs">{option.description}</p>
                  {!option.enabled && (
                    <p className="text-orange-500 text-[10px] font-bold mt-1">⏳ Coming Soon</p>
                  )}
                </div>
              </div>

              {/* Right Side */}
              <AnimatePresence>
                {selectedPayment === option.id && option.enabled && (
                  <motion.div
                    key="check"
                    initial={{ x: 15, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 15, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    className="text-green-600"
                  >
                    <Check className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>

              {!option.enabled && (
                <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-[10px] font-bold">
                  Coming Soon
                </span>
              )}

              {/* Ripple */}
              {ripple.show && option.enabled && (
                <motion.span
                  initial={{ scale: 0, opacity: 0.3 }}
                  animate={{ scale: 4, opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  style={{ top: ripple.y, left: ripple.x }}
                  className="absolute w-8 h-8 rounded-full bg-orange-300 pointer-events-none"
                />
              )}

            </button>

            {/* Highlight Border Only for COD */}
            {selectedPayment === option.id && option.enabled && (
              <motion.div
                layoutId="highlight"
                className="absolute inset-0 rounded-2xl border-2 border-orange-500 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Bottom Total + Confirm */}
      <div className="border-t p-5 bg-white shadow-xl sticky bottom-0">
        <div className="flex justify-between font-bold text-lg mb-3">
          <span>💰 Total Payable</span>
          <span className="text-orange-600">₹{finalAmount}</span>
        </div>
        <button
          onClick={handlePayment}
          className="w-full bg-gradient-to-r from-orange-400 to-amber-400 text-white py-3 rounded-2xl font-bold shadow hover:from-orange-500 hover:to-amber-500 transition"
        >
          Place Order (Cash on Delivery)
        </button>
      </div>

    </div>
  );
}
