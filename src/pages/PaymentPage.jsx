// ✅ src/pages/PaymentPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Wallet, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PaymentPage() {
  const navigate = useNavigate();

  const [order, setOrder] = useState(() => {
    const savedOrder = localStorage.getItem("currentOrder");
    return savedOrder ? JSON.parse(savedOrder) : null;
  });

  const [selectedPayment, setSelectedPayment] = useState("cod"); // default COD
  const [ripple, setRipple] = useState({ x: 0, y: 0, show: false });

  useEffect(() => {
    if (!order) navigate("/cart");
  }, [order]);

  if (!order) return null;

  const { subtotal, deliveryTip, donation, redeemPoints, discount } = order;

  const finalAmount = Math.max(
    subtotal + 50 + deliveryTip + donation - discount - redeemPoints,
    0
  );

  const handlePayment = () => {
  if (selectedPayment === "online") {
    const isSuccess = window.confirm(
      `Proceed to pay ₹${finalAmount} online? Click OK to simulate success.`
    );
    if (!isSuccess) return alert("Payment failed. Please try again.");
  }

  const updatedOrder = {
    ...order,
    paymentMethod: selectedPayment,
    paymentStatus: selectedPayment === "cod" ? "pending" : "paid",
    totalAmount: finalAmount,
  };

  // Save the updated order
  localStorage.setItem("currentOrder", JSON.stringify(updatedOrder));

  // ✅ Clear the cart now that order is placed
  localStorage.setItem("cartItems", JSON.stringify([]));

  // ✅ Deduct redeemed points from current points
  const remainingPoints = (order.currentPoints || 0) - (order.redeemPoints || 0);
  localStorage.setItem("currentPoints", remainingPoints);

  // Redirect to Order Success page
  navigate("/order-success");
};


  const paymentOptions = [
    {
      id: "cod",
      label: "Cash on Delivery",
      icon: "₹",
      description: "Pay with cash upon delivery",
    },
    {
      id: "online",
      label: "Online Payment",
      icon: <CreditCard className="w-5 h-5 text-orange-500" />,
      description: "Card, UPI, Netbanking",
    },
    {
      id: "wallet",
      label: "App Wallet",
      icon: <Wallet className="w-5 h-5 text-orange-500" />,
      description: "Pay using your wallet balance",
    },
  ];

  const createRipple = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setRipple({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      show: true,
    });
    setTimeout(() => setRipple({ ...ripple, show: false }), 400);
  };

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col">
      {/* Header */}
      <header className="bg-orange-500 text-white py-4 px-6 flex items-center shadow">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-white text-orange-500 mr-4 hover:bg-gray-100 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">💳 Select Payment</h1>
      </header>

      {/* Payment Methods */}
      <div className="flex-1 p-4 space-y-4 relative">
        {paymentOptions.map((option) => (
          <div key={option.id} className="relative">
            <button
              onClick={(e) => {
                setSelectedPayment(option.id);
                createRipple(e);
              }}
              className="w-full flex items-center justify-between p-4 rounded-2xl border border-gray-300 bg-white shadow-md overflow-hidden relative transition-transform hover:scale-105"
            >
              <div className="flex items-center gap-3 relative z-10">
                {option.icon === "₹" ? (
                  <span className="text-orange-500 font-bold text-lg">₹</span>
                ) : (
                  option.icon
                )}
                <div className="text-left">
                  <p className="font-semibold">{option.label}</p>
                  <p className="text-gray-500 text-sm">{option.description}</p>
                </div>
              </div>

              {/* Animated checkmark */}
              <AnimatePresence>
                {selectedPayment === option.id && (
                  <motion.div
                    key="check"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="text-green-500"
                  >
                    <Check className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Ripple Effect */}
              {ripple.show && (
                <motion.span
                  initial={{ scale: 0, opacity: 0.5 }}
                  animate={{ scale: 4, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  style={{ top: ripple.y, left: ripple.x }}
                  className="absolute w-10 h-10 rounded-full bg-orange-300 pointer-events-none"
                />
              )}
            </button>

            {/* Animated Highlight */}
            {selectedPayment === option.id && (
              <motion.div
                layoutId="highlight"
                className="absolute inset-0 rounded-2xl border-2 border-orange-500 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Fixed Bottom Total & Confirm */}
      <motion.div
        key={selectedPayment}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="border-t p-5 bg-white shadow-xl sticky bottom-0"
      >
        <div className="flex justify-between font-bold text-lg mb-3">
          <span>Total Payable</span>
          <span>₹{finalAmount}</span>
        </div>
        <button
          onClick={handlePayment}
          className="w-full bg-gradient-to-r from-orange-400 to-amber-400 text-white py-3 rounded-2xl font-bold shadow hover:from-orange-500 hover:to-amber-500 transition"
        >
          {selectedPayment === "cod" ? "Place Order (COD)" : "Pay Now"}
        </button>
      </motion.div>
    </div>
  );
}
