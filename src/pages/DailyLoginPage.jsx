import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";

export default function DailyLoginPage() {
  const navigate = useNavigate();
  const [loginStreak, setLoginStreak] = useState(0);
  const [lastLogin, setLastLogin] = useState(null);
  const [timeLeft, setTimeLeft] = useState("23:59:59");
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const dailyRewards = [
    { day: 1, reward: "+5 Points" },
    { day: 2, reward: "+10 Points" },
    { day: 3, reward: "+15 Points" },
    { day: 4, reward: "+20 Points" },
    { day: 5, reward: "+25 Points" },
    { day: 6, reward: "+50 Points" },
    { day: 7, reward: "🎁 Mystery Box" },
  ];

  const formatDate = (timestamp) => new Date(timestamp).toISOString().split("T")[0];

  useEffect(() => {
    const savedStreak = parseInt(localStorage.getItem("loginStreak") || "0", 10);
    const savedLastLogin = parseInt(localStorage.getItem("lastLogin") || "0", 10);
    setLoginStreak(savedStreak);
    setLastLogin(savedLastLogin);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const nextMidnight = new Date();
      nextMidnight.setHours(24, 0, 0, 0);
      const remaining = nextMidnight - now;

      const hrs = String(Math.floor(remaining / (1000 * 60 * 60))).padStart(2, "0");
      const mins = String(Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0");
      const secs = String(Math.floor((remaining % (1000 * 60)) / 1000)).padStart(2, "0");
      setTimeLeft(`${hrs}:${mins}:${secs}`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDailyLogin = () => {
    const today = formatDate(Date.now());
    const lastLoginDay = lastLogin ? formatDate(lastLogin) : null;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = formatDate(yesterday);

    let newStreak = 1;

    if (lastLoginDay === today) return; // Already claimed today
    if (lastLoginDay === yesterdayStr) {
      newStreak = loginStreak + 1 > 7 ? 1 : loginStreak + 1; // Loop weekly
    } else {
      newStreak = 1; // Missed day → reset
    }

    setLoginStreak(newStreak);
    setLastLogin(Date.now());
    localStorage.setItem("loginStreak", newStreak.toString());
    localStorage.setItem("lastLogin", Date.now().toString());

    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
  };

  const currentDay = () => {
    const today = formatDate(Date.now());
    const lastLoginDay = lastLogin ? formatDate(lastLogin) : null;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = formatDate(yesterday);

    if (!lastLoginDay) return 1;
    if (lastLoginDay === today) return null;
    if (lastLoginDay === yesterdayStr) return loginStreak + 1 > 7 ? 1 : loginStreak + 1;
    return 1;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col items-center relative">
      {/* Header */}
      <header className="bg-orange-500 text-white py-4 px-6 shadow-lg flex items-center justify-center relative w-full">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-3 left-5 z-20 p-2 rounded-full bg-white shadow hover:bg-gray-100 transition"
        >
          <ArrowLeft className="w-5 h-5 text-orange-500" />
        </button>
        <h1 className="text-lg font-bold text-white">Daily Login</h1>
        <div className="absolute top-3 right-5 bg-white px-4 py-1 rounded-full flex items-center gap-2 shadow-md">
          <span className="text-orange-600 font-semibold">{loginStreak}</span>
          <span className="text-sm text-gray-500">days</span>
        </div>
      </header>

      {/* Main Daily Login Box */}
      <div className="mt-10 bg-white shadow-md rounded-2xl p-6 w-[90%] sm:w-[70%] text-center">
        <h2 className="text-xl font-bold text-orange-600 mb-6">🎯 Claim Your Daily Reward</h2>

        {/* Day Boxes */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {dailyRewards.map((item) => {
            const claimed =
              loginStreak > item.day ||
              (loginStreak === item.day && lastLogin && formatDate(lastLogin) === formatDate(Date.now()));
            const glow = currentDay() === item.day;
            return (
              <div
                key={item.day}
                className={`p-4 rounded-xl shadow-md border-2 ${
                  claimed
                    ? "bg-orange-500 text-white border-orange-600"
                    : glow
                    ? "bg-orange-100 text-gray-700 border-yellow-400 animate-pulse"
                    : "bg-orange-100 text-gray-700 border-transparent"
                }`}
              >
                <p className="font-semibold mb-2">Day {item.day}</p>
                <p className="text-sm">{item.reward}</p>
                {claimed && <p className="text-xs mt-1">✅ Claimed</p>}
                {glow && !claimed && <p className="text-xs mt-1 text-yellow-600 font-semibold">🎉 Today!</p>}
              </div>
            );
          })}
        </div>

        <p className="text-gray-500 mb-4">Next daily reward available in: <b>{timeLeft}</b></p>
        <button
          onClick={handleDailyLogin}
          disabled={lastLogin && formatDate(lastLogin) === formatDate(Date.now())}
          className={`px-8 py-3 rounded-full font-semibold text-white shadow-md text-sm transition ${
            lastLogin && formatDate(lastLogin) === formatDate(Date.now())
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {lastLogin && formatDate(lastLogin) === formatDate(Date.now()) ? "Already Claimed" : "Claim Reward"}
        </button>
      </div>

      {/* Rules Section */}
      <div className="mt-8 mb-10 text-center bg-orange-100 border border-orange-300 rounded-xl p-4 w-[85%] sm:w-[60%] shadow-md">
        <h3 className="text-orange-600 font-bold mb-2 text-lg">📝 Daily Login Rules</h3>
        <ul className="text-gray-700 text-sm leading-relaxed">
          <li>🎯 Only 1 reward can be claimed per day</li>
          <li>💰 Next day becomes active at 12 AM</li>
          <li>⚠️ Missed a day → streak resets to Day 1</li>
          <li>🔁 After Day 7, streak loops back to Day 1</li>
        </ul>
      </div>

      {/* Confetti */}
      {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} />}
    </div>
  );
}
