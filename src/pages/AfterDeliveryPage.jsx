// ✅ src/pages/AfterDeliveryPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Camera, X } from "lucide-react";
import { motion } from "framer-motion";

export default function AfterDeliveryPage() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  // Feedback states
  const [itemsRating, setItemsRating] = useState(0);
  const [deliveryRating, setDeliveryRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [photos, setPhotos] = useState([]);

  // Popup & final earned points
  const [showPointsPopup, setShowPointsPopup] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);

  // ✅ Hooks moved to top - stable order
  const basePoints = useMemo(() => {
    if (!order) return { points: 0, spent: 0 }; // prevent crash on first render
    let pts = 0;
    const spent = order.totalAmount - (order.deliveryCharge || 0);
    pts += Math.floor(spent / 10);
    const past = parseInt(localStorage.getItem("completedOrders") || "0");
    const num = past + 1;
    if (num === 1) pts += 10;
    else if (num === 2) pts += 5;
    else if (num === 3) pts += 1;
    const key = new Date().getMonth() + "_" + new Date().getFullYear();
    const mo = parseInt(localStorage.getItem("MONTH_ORDERS_" + key) || "0") + 1;
    localStorage.setItem("MONTH_ORDERS_" + key, mo);
    if (mo === 5) pts += 50;
    return { points: pts, spent };
  }, [order]);

  // ✅ Now safe: no conditional return above this line
  useEffect(() => {
    const savedOrder = localStorage.getItem("currentOrder");
    if (!savedOrder) {
      navigate("/home");
      return;
    }
    setOrder(JSON.parse(savedOrder));

    if (!localStorage.getItem("loyaltyPoints")) localStorage.setItem("loyaltyPoints", "0");
    if (!localStorage.getItem("completedOrders")) localStorage.setItem("completedOrders", "0");
  }, []);

  // ✅ Normal conditional checks can be below hooks
  if (!order) return null;

  const handleStarClick = (type, value) => {
    if (type === "items") setItemsRating(value);
    if (type === "delivery") setDeliveryRating(value);
  };

  const handleReviewChange = (e) => setReviewText(e.target.value);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file || photos.length >= 3) return;
    const reader = new FileReader();
    reader.onload = () => setPhotos(prev => [...prev, reader.result]);
    reader.readAsDataURL(file);
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const feedbackBonus = () => {
    let bonus = 0;
    if (itemsRating > 0 && deliveryRating > 0 && reviewText.trim().length > 0) {
      bonus += 2;
      if (photos.length > 0) bonus += 2;
    }
    return bonus;
  };

  const handleSubmitFeedback = () => {
    const finalPoints = basePoints.points + feedbackBonus();
    const existing = parseInt(localStorage.getItem("loyaltyPoints") || "0");
    localStorage.setItem("loyaltyPoints", existing + finalPoints);

    const totalOrders = parseInt(localStorage.getItem("completedOrders") || "0");
    localStorage.setItem("completedOrders", totalOrders + 1);

    setEarnedPoints(finalPoints);
    setShowPointsPopup(true);
  };

  const closePopup = () => {
    setShowPointsPopup(false);
    navigate("/home");
  };

  const isSubmitDisabled = !(itemsRating > 0 && deliveryRating > 0 && reviewText.trim().length > 0);

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center p-5">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">🙏 How was your order?</h1>

      <div className="bg-white shadow-md rounded-2xl w-full max-w-md p-5 mb-4">

        {/* ⭐ ITEMS RATING */}
        <div className="mb-4">
          <p className="font-semibold mb-2">Rate Items</p>
          <div className="flex gap-1">
            {[1,2,3,4,5].map((star) => (
              <Star key={star}
                className={`w-8 h-8 cursor-pointer ${
                  star <= itemsRating ? "text-amber-400 fill-amber-400" : "text-gray-300"
                }`}
                onClick={() => handleStarClick("items", star)}
              />
            ))}
          </div>
        </div>

        {/* 🚚 DELIVERY RATING */}
        <div className="mb-4">
          <p className="font-semibold mb-2">Rate Delivery</p>
          <div className="flex gap-1">
            {[1,2,3,4,5].map((star) => (
              <Star key={star}
                className={`w-8 h-8 cursor-pointer ${
                  star <= deliveryRating ? "text-amber-400 fill-amber-400" : "text-gray-300"
                }`}
                onClick={() => handleStarClick("delivery", star)}
              />
            ))}
          </div>
        </div>

        {/* 📝 REVIEW */}
        <div className="mb-4">
          <p className="font-semibold mb-2">Write a review</p>
          <textarea
            value={reviewText}
            onChange={handleReviewChange}
            className="w-full border border-gray-300 rounded-xl p-3 h-24"
            placeholder="Share your experience..."
          />
        </div>

        {/* 📸 PHOTO UPLOAD */}
        <div className="mb-4">
          <p className="font-semibold mb-2 flex items-center gap-2 text-orange-500">Upload Photo <Camera className="w-5 h-5"/></p>
          {photos.length < 3 && (
            <label className="w-full border border-dashed border-orange-400 rounded-xl p-5 flex flex-col items-center cursor-pointer bg-orange-50">
              <Camera className="w-8 h-8 text-orange-400 mb-2"/>
              <span className="text-sm text-gray-600">Tap to upload ({photos.length}/3)</span>
              <input type="file" accept="image/*" hidden onChange={handlePhotoUpload}/>
            </label>
          )}
          <div className="grid grid-cols-3 gap-2 mt-3">
            {photos.map((p, i) => (
              <div key={i} className="relative">
                <img src={p} className="rounded-xl w-full h-24 object-cover shadow"/>
                <button onClick={() => removePhoto(i)} className="absolute top-0 right-0 bg-white rounded-full p-1 shadow">
                  <X className="w-4 h-4 text-red-500"/>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 🎯 POINTS PREVIEW */}
        <div className="mb-3 bg-orange-100 p-3 rounded-xl text-center">
          <p className="text-lg font-bold text-orange-700">Loyalty Points for this order: {basePoints.points}</p>
          <p className="text-xs text-gray-600">(For spend ₹{basePoints.spent} only, Review and get bonus points)</p>
        </div>

        {/* ✅ SUBMIT BUTTON */}
        <button
          onClick={handleSubmitFeedback}
          disabled={isSubmitDisabled}
          className={`w-full py-3 rounded-2xl font-bold shadow transition ${
            isSubmitDisabled
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-orange-500 text-white cursor-pointer active:scale-95"
          }`}
        >
          Submit Feedback
        </button>
        {/* 🛒 NEW CONTINUE SHOPPING BUTTON */}
<button
  onClick={() => navigate("/home")}
  className="w-full mt-3 py-3 rounded-2xl font-semibold shadow border border-orange-500 text-white bg-orange-500 active:scale-95 transition"
>
  Continue Shopping
</button>
      </div>


{/* 🎉 FINAL POINTS POPUP */}
{showPointsPopup && (
  <div className="fixed inset-0 bg-orange-50 bg-opacity-50 flex justify-center items-center z-50">
    {/* Gradient border wrapper */}
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.7, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="rounded-2xl p-[4px] shadow-xl"
      style={{ background: "linear-gradient(45deg, orange, #ffd700)" }}
    >
      {/* Inner content box */}
      <div className="bg-white rounded-2xl p-6 text-center w-80 relative z-10">
        <h2 className="text-xl font-bold mb-2">🎉 Feedback Submitted!</h2>
        <p className="text-sm text-gray-600 mb-1">Total loyalty points gained:</p>
        <p className="text-4xl font-extrabold text-orange-500 mb-3">+{earnedPoints}</p>

        <button
          onClick={closePopup}
          className="px-4 py-2 bg-orange-500 text-white rounded-xl font-bold shadow active:scale-95 transition"
        >
          Continue
        </button>
      </div>
    </motion.div>
  </div>
)}

    </div>
  );
}
