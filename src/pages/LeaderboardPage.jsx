// src/pages/LeaderboardPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Medal, Package, Star, Users } from "lucide-react";
import Confetti from "react-confetti";
import { motion, AnimatePresence } from "framer-motion";

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const confettiRef = useRef(null);

  const tabs = [
    { key: "Orders", label: "Orders", icon: <Package size={20} /> },
    { key: "Points", label: "Points", icon: <Star size={20} /> },
    { key: "Referrals", label: "Referrals", icon: <Users size={20} /> },
  ];

  const [activeTab, setActiveTab] = useState("Orders");
  const [leaderboardData, setLeaderboardData] = useState({});
  const [displayData, setDisplayData] = useState({});
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [showNewMonthBanner, setShowNewMonthBanner] = useState(false);
  const [highlightUserIndex, setHighlightUserIndex] = useState(null);

  const currentUser = "Sai"; // Replace with dynamic user

  const getMonthKey = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  };

  // Handle window resize for confetti
  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initialize leaderboard and handle monthly reset
  useEffect(() => {
    const monthKey = getMonthKey();
    const savedData = JSON.parse(localStorage.getItem("LeaderboardData") || "{}");
    const updatedData = {};
    let newMonthDetected = false;

    tabs.forEach((tab) => {
      if (!savedData[tab.key] || savedData[tab.key].month !== monthKey) {
        // Reset leaderboard for new month
        updatedData[tab.key] = {
          month: monthKey,
          users: [
            { name: "Sai", points: 0, avatar: "" },
            { name: "Riya", points: 0, avatar: "" },
            { name: "Aman", points: 0, avatar: "" },
          ],
        };
        newMonthDetected = true;
      } else {
        updatedData[tab.key] = savedData[tab.key];
      }
    });

    setLeaderboardData(updatedData);

    // Initialize displayData for animation
    const initialDisplay = {};
    tabs.forEach((tab) => {
      initialDisplay[tab.key] = updatedData[tab.key].users.map((u) => ({ ...u }));
    });
    setDisplayData(initialDisplay);

    localStorage.setItem("LeaderboardData", JSON.stringify(updatedData));

    if (newMonthDetected) {
      setShowNewMonthBanner(true);
      animateReset(initialDisplay);
      setTimeout(() => setShowNewMonthBanner(false), 4000);
    }
  }, []);

  // Animate reset of points/count to 0
  const animateReset = (initialDisplay) => {
    const steps = 50;
    const intervalTime = 16;

    tabs.forEach((tab) => {
      initialDisplay[tab.key].forEach((user, idx) => {
        const start = user.points;
        let stepCount = 0;

        const interval = setInterval(() => {
          stepCount++;
          const newPoints = Math.floor(start * (1 - stepCount / steps));
          setDisplayData((prev) => {
            const copy = { ...prev };
            copy[tab.key][idx].points = newPoints;
            return copy;
          });
          if (stepCount >= steps) clearInterval(interval);
        }, intervalTime);
      });
    });
  };

  // Update counts/points for user
  const updateUserData = (tabKey, name, value) => {
    setLeaderboardData((prev) => {
      const newData = { ...prev };
      const users = newData[tabKey].users.map((user) =>
        user.name === name ? { ...user, points: user.points + value } : user
      );
      users.sort((a, b) => b.points - a.points);
      newData[tabKey].users = users;
      localStorage.setItem("LeaderboardData", JSON.stringify(newData));

      // Animate displayData
      users.forEach((user, idx) => {
        const displayPoints = displayData[tabKey]?.[idx]?.points || 0;
        animatePoints(tabKey, idx, displayPoints, user.points);
      });

      // Highlight current user
      const userIndex = users.findIndex((u) => u.name === name);
      setHighlightUserIndex(userIndex);

      // Confetti for top 3
      if (userIndex >= 0 && userIndex < 3) {
        if (confettiRef.current) confettiRef.current.start();
        setTimeout(() => confettiRef.current && confettiRef.current.stop(), 3000);
      }

      return newData;
    });
  };

  const animatePoints = (tabKey, idx, from, to) => {
    const steps = 50;
    const intervalTime = 16;
    let currentStep = 0;
    const increment = (to - from) / steps;

    const interval = setInterval(() => {
      currentStep++;
      const newPoints = Math.floor(from + increment * currentStep);
      setDisplayData((prev) => {
        const copy = { ...prev };
        copy[tabKey][idx].points = newPoints;
        return copy;
      });
      if (currentStep >= steps) clearInterval(interval);
    }, intervalTime);
  };

  const renderLeaderboard = () => {
    const users = displayData[activeTab] || [];
    const maxPoints = users.length > 0 ? Math.max(...users.map((u) => u.points)) || 1 : 1;
    const currentUserIndex = users.findIndex((u) => u.name === currentUser);

    const getLabel = () => {
      switch (activeTab) {
        case "Orders":
          return users.length > 0 ? "orders" : "";
        case "Referrals":
          return users.length > 0 ? "friends" : "";
        default:
          return "pts";
      }
    };

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          {users.map((user, i) => (
            <motion.div
              key={user.name}
              layout
              animate={
                highlightUserIndex === i
                  ? {
                      scale: [1, 1.05, 1],
                      boxShadow: [
                        "0 0 5px rgba(255,165,0,0.4)",
                        "0 0 15px rgba(255,165,0,0.8)",
                        "0 0 5px rgba(255,165,0,0.4)",
                      ],
                    }
                  : {}
              }
              transition={{ duration: 0.8 }}
              className={`flex items-center justify-between p-4 mb-4 rounded-2xl shadow-md ${
                user.name === currentUser ? "bg-orange-50" : "bg-white"
              }`}
            >
              <div className="flex items-center gap-4 w-full">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-500 font-bold">{user.name[0]}</span>
                  )}
                  {/* Top 3 badges */}
                  {i === 0 && (
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                      className="absolute -top-2 -right-2 bg-yellow-400 w-5 h-5 rounded-full flex items-center justify-center"
                    >
                      <Medal className="w-3 h-3 text-white" />
                    </motion.div>
                  )}
                  {i === 1 && (
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                      className="absolute -top-2 -right-2 bg-gray-400 w-5 h-5 rounded-full flex items-center justify-center"
                    >
                      <Medal className="w-3 h-3 text-white" />
                    </motion.div>
                  )}
                  {i === 2 && (
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                      className="absolute -top-2 -right-2 bg-orange-500 w-5 h-5 rounded-full flex items-center justify-center"
                    >
                      <Medal className="w-3 h-3 text-white" />
                    </motion.div>
                  )}
                </div>
                <div className="flex-1 ml-2">
                  <p className="font-semibold text-gray-800">{user.name}</p>
                  <div className="w-full h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                    <motion.div
                      className="h-2 rounded-full bg-orange-500"
                      animate={{ width: `${(user.points / maxPoints) * 100}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>
              </div>
              <span className="font-bold text-orange-500 ml-2">
                {user.points} {getLabel()}
              </span>
            </motion.div>
          ))}

          {currentUserIndex >= 3 && (
            <div className="flex justify-between items-center p-4 rounded-2xl shadow-md bg-orange-50 mt-2">
              <span className="font-semibold text-gray-800">Your Rank: {currentUserIndex + 1}</span>
              <span className="font-bold text-orange-500">
                {users[currentUserIndex]?.points || 0} {getLabel()}
              </span>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen bg-[#fff9f4] relative pb-24">
      <Confetti ref={confettiRef} width={windowSize.width} height={windowSize.height} recycle={false} />

      {/* New Month Banner */}
      <AnimatePresence>
        {showNewMonthBanner && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50"
          >
            🎉 New Month, New Leaderboard!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-orange-500 text-white py-4 px-6 shadow-lg flex items-center relative justify-center">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 bg-white text-orange-500 p-2 rounded-full shadow hover:bg-gray-100 transition"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">Leaderboard</h1>
      </header>

      {/* Leaderboard */}
      <div className="p-6">{renderLeaderboard()}</div>

      {/* Footer Tabs */}
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-t flex justify-around py-3 border-t border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex flex-col items-center text-center font-semibold transition ${
              activeTab === tab.key
                ? "text-orange-500 border-t-2 border-orange-500"
                : "text-gray-500"
            }`}
          >
            {tab.icon}
            <span className="text-xs mt-1">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
