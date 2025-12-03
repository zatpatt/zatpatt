// src/pages/DailyLoginPage.jsx
import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";

// POINT STORAGE KEY (same as Rewards Page)
const POINTS_KEY = "spin_rewards_points";

// MYSTERY BOX WEIGHTED REWARDS
const mysteryRewards = [
  { points: 5, weight: 40 },
  { points: 10, weight: 30 },
  { points: 20, weight: 20 },
  { points: 50, weight: 6 },
  { points: 60, weight: 3 },
  { points: 100, weight: 1 },
];

export default function DailyLoginPage() {
  const navigate = useNavigate();

  const [loginStreak, setLoginStreak] = useState(0);
  const [lastLogin, setLastLogin] = useState(null);
  const [timeLeft, setTimeLeft] = useState("23:59:59");
  const [totalPoints, setTotalPoints] = useState(0);

  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [rewardPopup, setRewardPopup] = useState(null); // popup reward display

  const dailyRewards = [
    { day: 1, reward: "+5 Points", points: 5 },
    { day: 2, reward: "+10 Points", points: 10 },
    { day: 3, reward: "+15 Points", points: 15 },
    { day: 4, reward: "+20 Points", points: 20 },
    { day: 5, reward: "+25 Points", points: 25 },
    { day: 6, reward: "+50 Points", points: 50 },
    { day: 7, reward: "🎁 Mystery Box", points: null },
  ];

  const formatDay = (ts) => new Date(ts).toISOString().split("T")[0];

  // Load initial data
  useEffect(() => {
    const streak = parseInt(localStorage.getItem("daily_streak") || "0");
    const last = parseInt(localStorage.getItem("daily_last_login") || "0");
    const pts = parseInt(localStorage.getItem(POINTS_KEY) || "0");

    setLoginStreak(streak);
    setLastLogin(last);
    setTotalPoints(pts);
  }, []);

  // Midnight timer
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);

      const diff = midnight - now;
      const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");

      setTimeLeft(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Confetti window size
  useEffect(() => {
    const resize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Weighted random reward selection
  const getMysteryReward = () => {
    const totalWeight = mysteryRewards.reduce((a, b) => a + b.weight, 0);
    let random = Math.random() * totalWeight;

    for (let r of mysteryRewards) {
      if (random < r.weight) return r.points;
      random -= r.weight;
    }
    return 5;
  };

  // Add points to storage
  const addPoints = (value) => {
    const updated = totalPoints + value;
    setTotalPoints(updated);
    localStorage.setItem(POINTS_KEY, updated.toString());
  };

  const handleDailyLogin = () => {
    const today = formatDay(Date.now());
    const last = lastLogin ? formatDay(lastLogin) : null;

    if (last === today) return;

    // Determine new streak
    const yesterday = formatDay(Date.now() - 86400000);
    let newStreak = last === yesterday ? loginStreak + 1 : 1;
    if (newStreak > 7) newStreak = 1;

    setLoginStreak(newStreak);
    setLastLogin(Date.now());

    localStorage.setItem("daily_streak", newStreak.toString());
    localStorage.setItem("daily_last_login", Date.now().toString());

    let rewardPoints = 0;

    if (newStreak === 7) {
      rewardPoints = getMysteryReward();
      setRewardPopup(`🎁 Mystery Box: +${rewardPoints} Points`);
    } else {
      rewardPoints = dailyRewards[newStreak - 1].points;
      setRewardPopup(`+${rewardPoints} Points Earned`);
    }

    addPoints(rewardPoints);

    // confetti
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3500);
    setTimeout(() => setRewardPopup(null), 3000);
  };

  const currentDay = () => {
    const today = formatDay(Date.now());
    const last = lastLogin ? formatDay(lastLogin) : null;
    const yesterday = formatDay(Date.now() - 86400000);

    if (!last) return 1;
    if (last === today) return null;
    if (last === yesterday) return loginStreak + 1 > 7 ? 1 : loginStreak + 1;
    return 1;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col items-center relative">
      {/* Header */}
      <header className="bg-orange-500 text-white py-4 px-6 shadow-lg flex items-center justify-center w-full relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-5 top-3 bg-white p-2 rounded-full shadow"
        >
          <ArrowLeft className="text-orange-500 w-5 h-5" />
        </button>

        <h1 className="text-lg font-bold">Daily Login</h1>

        <div className="absolute right-5 top-3 bg-white px-4 py-1 rounded-full shadow flex items-center gap-1">
          <span className="text-orange-600 font-semibold">{loginStreak}</span>
          <span className="text-gray-500 text-sm">days</span>
        </div>
      </header>

      {/* Main Box */}
      <div className="mt-10 bg-white rounded-2xl shadow p-6 w-[90%] sm:w-[70%] text-center">
        <h2 className="text-xl font-bold text-orange-600 mb-6">🎯 Claim Your Daily Reward</h2>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {dailyRewards.map((item) => {
            const todayClaimed =
              lastLogin && formatDay(lastLogin) === formatDay(Date.now());
            const isClaimed =
              loginStreak > item.day ||
              (loginStreak === item.day && todayClaimed);
            const highlight = currentDay() === item.day;

            return (
              <div
                key={item.day}
                className={`p-4 rounded-xl border-2 shadow text-sm ${
                  isClaimed
                    ? "bg-orange-500 text-white border-orange-600"
                    : highlight
                    ? "bg-yellow-100 text-gray-700 border-yellow-400 animate-pulse"
                    : "bg-orange-100 text-gray-700"
                }`}
              >
                <p className="font-semibold mb-1">Day {item.day}</p>
                <p>{item.reward}</p>
                {isClaimed && <p className="text-xs mt-1">✔ Claimed</p>}
              </div>
            );
          })}
        </div>

        <p className="text-gray-500 mb-3">Next reward in: <b>{timeLeft}</b></p>

        <button
          onClick={handleDailyLogin}
          disabled={lastLogin && formatDay(lastLogin) === formatDay(Date.now())}
          className={`px-8 py-3 rounded-full text-white font-semibold ${
            lastLogin && formatDay(lastLogin) === formatDay(Date.now())
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {lastLogin && formatDay(lastLogin) === formatDay(Date.now())
            ? "Already Claimed"
            : "Claim Reward"}
        </button>
      </div>

      {/* Popup */}
      {rewardPopup && (
        <div className="fixed bottom-20 bg-orange-600 text-white px-6 py-3 rounded-xl shadow-lg text-lg font-semibold animate-bounce">
          {rewardPopup}
        </div>
      )}

      {/* Rules */}
      <div className="mt-8 mb-10 w-[85%] sm:w-[60%] bg-orange-100 border border-orange-300 p-4 rounded-xl text-center shadow">
        <h3 className="font-bold text-orange-600 mb-2">📝 Daily Login Rules</h3>
        <ul className="text-gray-700 text-sm space-y-1">
          <li>🎯 Only 1 reward per day</li>
          <li>💰 New day unlocks at 12 AM</li>
          <li>⚠️ Missed a day → streak resets</li>
          <li>🔁 After Day 7 → loops back to Day 1</li>
        </ul>
      </div>

      {showConfetti && (
        <Confetti width={windowSize.width} height={windowSize.height} />
      )}
    </div>
  );
}
