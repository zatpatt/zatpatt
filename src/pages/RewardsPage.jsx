import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Gift, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RewardsPage() {
  const navigate = useNavigate();
  const [totalPoints, setTotalPoints] = useState(120);

  const rules = [
    "💰 Earn 1 point for every ₹10 you spend on your orders.",
    "⭐ Rate your orders and get 2 bonus points each time.",
    "🤝 Refer a friend and earn 50 points for every successful referral.",
    "🔥 Complete 5+ orders in a month to unlock a 50-point streak bonus.",
    "📅 Log in daily to earn extra points and keep your streak active.",
    "🎉 Get 10 points on your first order, 5 points on your second, and 1 point on your third.",
    "🎡 Try your luck with Spin & Win for surprise bonus rewards every day!",
  ];

  useEffect(() => {
    const points = parseInt(localStorage.getItem("SpinAndWin_totalPoints") || "120", 10);
    setTotalPoints(points);
  }, []);

  const handleSpin = () => navigate("/spinandwin");
  const handleRefer = () => navigate("/referafriend");
  const handleDailyLogin = () => navigate("/dailylogin");

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col relative items-center">
      {/* Header */}
      <header className="bg-orange-500 text-white py-4 px-7 shadow-lg w-full relative flex items-center justify-center">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute left-5 top-3 p-2 rounded-full bg-white shadow hover:bg-gray-100 transition"
        >
          <ArrowLeft className="w-5 h-5 text-orange-500" />
        </button>

        {/* Title */}
        <h1 className="text-xl font-bold text-center">Rewards & Points</h1>

        {/* Gift Outline Icon (white, empty) */}
        <Gift
          className="absolute right-5 top-3"
          size={24}
          strokeWidth={2}
          color="white"
          fill="none"
        />
      </header>

      <motion.div
        className="flex-1 p-6 relative z-10 w-full max-w-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          <motion.h2
            className="text-2xl font-semibold text-orange-600 mb-3"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            🏆 How to Earn Reward Points
          </motion.h2>

          <p className="text-gray-600 mb-8">
            You can earn reward points through various activities on Zatpatt!
          </p>

          {/* Reward Points Card */}
          <div className="mx-auto mt-5 bg-gradient-to-r from-orange-400 to-amber-400 text-white p-5 rounded-2xl shadow-md flex justify-between items-center w-full sm:w-[90%]">
            <div>
              <h3 className="text-sm opacity-90">Your Reward Points</h3>
              <p className="text-3xl font-bold">{totalPoints}</p>
            </div>
            <button
              onClick={() => alert("Redeem feature coming soon!")}
              className="bg-white text-orange-600 text-sm font-semibold px-3 py-2 rounded-xl shadow hover:bg-orange-50 transition"
            >
              Redeem
            </button>
          </div>

          {/* Rules Card */}
          <div className="mt-10 text-left">
            <motion.div
              className="w-full p-[2px] rounded-xl bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="bg-white rounded-xl p-6 sm:p-8 space-y-3">
                <h3 className="text-xl font-semibold text-orange-600 mb-4">
                  📜 Rules & How to Earn Points
                </h3>

                {rules.map((rule, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <span className="text-orange-500 font-semibold">{index + 1}️⃣</span>
                    <span className="text-gray-700 leading-relaxed">{rule}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Action Buttons */}
<div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={handleSpin}
    className="bg-orange-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-orange-600 transition text-sm w-full"
  >
    🎡 Spin & Win
  </motion.button>

  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={handleRefer}
    className="bg-orange-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-orange-600 transition text-sm w-full"
  >
    🎯 Refer a Friend & Earn
  </motion.button>

  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={handleDailyLogin}
    className="bg-orange-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-orange-600 transition text-sm w-full"
  >
    📅 Daily Login
  </motion.button>
</div>
        </div>
      </motion.div>
    </div>
  );
}
