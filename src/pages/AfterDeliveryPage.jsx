// ✅ src/pages/AfterDeliveryPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";

export default function AfterDeliveryPage() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  // Ratings
  const [itemsRating, setItemsRating] = useState(0);
  const [deliveryRating, setDeliveryRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    const savedOrder = localStorage.getItem("currentOrder");
    if (!savedOrder) {
      navigate("/home");
      return;
    }
    setOrder(JSON.parse(savedOrder));
  }, []);

  if (!order) return null;

  const handleStarClick = (type, value) => {
    if (type === "items") setItemsRating(value);
    if (type === "delivery") setDeliveryRating(value);
  };

  const handleSubmitFeedback = () => {
    alert("Thank you for your feedback! 🎉");

    // Add loyalty points (mock)
    const loyaltyPoints = order.totalAmount ? Math.floor(order.totalAmount / 10) : 10;
    const existingPoints = parseInt(localStorage.getItem("loyaltyPoints") || "0");
    localStorage.setItem("loyaltyPoints", existingPoints + loyaltyPoints);

    navigate("/home");
  };

  const handleReorder = () => {
    alert("Order added to cart for reorder!");
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center p-5">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">🙏 How was your order?</h1>

      {/* Ratings */}
      <div className="bg-white shadow-md rounded-2xl w-full max-w-md p-5 mb-4">
        <div className="mb-4">
          <p className="font-semibold mb-2">Rate Items</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-8 h-8 cursor-pointer ${
                  star <= itemsRating ? "text-yellow-400" : "text-gray-300"
                }`}
                onClick={() => handleStarClick("items", star)}
              />
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p className="font-semibold mb-2">Rate Delivery</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-8 h-8 cursor-pointer ${
                  star <= deliveryRating ? "text-yellow-400" : "text-gray-300"
                }`}
                onClick={() => handleStarClick("delivery", star)}
              />
            ))}
          </div>
        </div>

        {/* Optional Review */}
        <div className="mb-4">
          <p className="font-semibold mb-2">Write a review (optional)</p>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Share your experience..."
          />
        </div>

        {/* Loyalty Points Info */}
        <p className="text-orange-500 font-semibold mb-3">
          You earned {Math.floor(order.totalAmount / 10)} loyalty points for this order!
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleSubmitFeedback}
            className="w-full bg-gradient-to-r from-orange-400 to-amber-400 text-white py-3 rounded-2xl font-bold shadow hover:from-orange-500 hover:to-amber-500 transition"
          >
            Submit Feedback
          </button>
          <button
            onClick={handleReorder}
            className="w-full bg-white border border-orange-500 text-orange-500 py-3 rounded-2xl font-bold shadow hover:bg-orange-50 transition"
          >
            Reorder / Save for Later
          </button>
        </div>
      </div>
    </div>
  );
}
