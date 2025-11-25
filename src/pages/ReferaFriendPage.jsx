import React from "react";
import { motion } from "framer-motion";
import { Users, ArrowLeft } from "lucide-react"; // ✅ Import ArrowLeft
import { useNavigate } from "react-router-dom";

export default function ReferaFriendPage() {
  const navigate = useNavigate();

  // Dummy referral code
  const referralCode = "ZAT12345";

  // Rules for referral points
  const rules = [
    "🤝 When your friend signs up successfully, you earn 50 points!",
    "🎉 When your friend completes their 1st order successfully, you earn 10 points.",
    "⭐ When your friend completes their 2nd order successfully, you earn 5 points.",
    "🏆 When your friend completes their 3rd order successfully, you earn 1 point.",
  ];

  // Notes
  const notes = [
    "⚠️ Maximum 10 referrals can earn points per month.",
    "📅 Referral code is valid for 6 months from the date of issue.",
    "⛔ Self-referrals are blocked and will not earn points.",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col">
      {/* Header */}
      <header className="bg-orange-500 text-white py-4 px-6 shadow-lg flex items-center justify-center relative">
        {/* Circular Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-3 left-5 z-20 p-2 rounded-full bg-white shadow hover:bg-gray-100 transition"
        >
          <ArrowLeft className="w-5 h-5 text-orange-500" />
        </button>

        <h1 className="text-xl font-bold">🤝 Refer a Friend</h1>
        <Users className="text-white absolute right-5 top-3 w-6 h-6" />
      </header>

      {/* Content */}
      <motion.div
        className="flex-1 p-6 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Referral Card */}
        <div className="w-full max-w-2xl p-[2px] rounded-xl bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 shadow-lg">
          <div className="bg-white rounded-xl p-6 sm:p-8 space-y-6 text-center">
            <h2 className="text-2xl font-semibold text-orange-600">
              Invite Your Friends & Earn Points!
            </h2>
            <p className="text-gray-700">
              Share your referral code with friends and earn points for each successful signup and their first orders!
            </p>

            {/* Referral Code */}
            <div className="flex items-center justify-center gap-3 mt-4">
              <span className="bg-orange-100 text-orange-700 font-semibold px-4 py-2 rounded-lg text-lg select-all">
                {referralCode}
              </span>
              <button
                onClick={() => navigator.clipboard.writeText(referralCode)}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-600 transition"
              >
                Copy
              </button>
            </div>

            {/* Share Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => alert("Share via WhatsApp coming soon!")}
                className="bg-green-500 text-white px-6 py-2.5 rounded-full shadow-md hover:bg-green-600 transition"
              >
                WhatsApp
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => alert("Share via SMS coming soon!")}
                className="bg-blue-500 text-white px-6 py-2.5 rounded-full shadow-md hover:bg-blue-600 transition"
              >
                SMS
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => alert("Share via Other Apps coming soon!")}
                className="bg-purple-500 text-white px-6 py-2.5 rounded-full shadow-md hover:bg-purple-600 transition"
              >
                More
              </motion.button>
            </div>

            {/* Rules Section */}
            <div className="mt-8 text-left">
              <h3 className="text-xl font-semibold text-orange-600 mb-3">
                📜 How to Earn Points
              </h3>
              <ul className="list-decimal list-inside space-y-2 text-gray-700">
                {rules.map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>

              {/* Notes */}
              <div className="mt-4 text-sm text-gray-500 space-y-1">
                {notes.map((note, index) => (
                  <p key={index}>{note}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
