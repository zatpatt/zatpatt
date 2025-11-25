import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";

export default function SpinandWinPage() {
  const navigate = useNavigate();

  const segments = [
    { label: "+5 Points", points: 5, color: "#F97316" },
    { label: "+10 Points", points: 10, color: "#FFF7EB" },
    { label: "+15 Points", points: 15, color: "#FB923C" },
    { label: "+20 Points", points: 20, color: "#FFF7EB" },
    { label: "+25 Points", points: 25, color: "#F97316" },
    { label: "+50 Points", points: 50, color: "#FFF7EB" },
    { label: "+75 Points", points: 75, color: "#FB923C" },
    { label: "+1 Extra Spin", points: 0, color: "#FFF7EB" },
  ];

  const [spinning, setSpinning] = useState(false);
  const [reward, setReward] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showExtraSpinAnim, setShowExtraSpinAnim] = useState(false);
  const [totalPoints, setTotalPoints] = useState(
    parseInt(localStorage.getItem("SpinAndWin_totalPoints") || "120", 10)
  );
  const [displayPoints, setDisplayPoints] = useState(totalPoints);

  const [spinsLeft, setSpinsLeft] = useState(
    parseInt(localStorage.getItem("SpinAndWin_extraSpins") || "0", 10)
  );
  const [lastFreeSpin, setLastFreeSpin] = useState(
    parseInt(localStorage.getItem("SpinAndWin_lastFreeSpin") || "0", 10)
  );
  const [userSpent, setUserSpent] = useState(
    parseInt(localStorage.getItem("SpinAndWin_userSpent") || "0", 10)
  );
  const [spentForSpins, setSpentForSpins] = useState(
    parseInt(localStorage.getItem("SpinAndWin_spentForSpins") || "0", 10)
  );
  const [timeLeft, setTimeLeft] = useState("24:00:00");
  const [progress, setProgress] = useState(0);

  const spinSound = useRef(null);
  const winSound = useRef(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Update window size for confetti
  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initialize progress and check free spin
  useEffect(() => {
    setProgress(((userSpent - spentForSpins) % 500) / 500);

    // Grant free spin if 24h passed
    if (lastFreeSpin) {
      const diff = Date.now() - lastFreeSpin;
      if (diff >= 24 * 60 * 60 * 1000) {
        const newSpins = spinsLeft + 1;
        setSpinsLeft(newSpins);
        localStorage.setItem("SpinAndWin_extraSpins", newSpins);
        setLastFreeSpin(0);
        localStorage.setItem("SpinAndWin_lastFreeSpin", "0");
      }
    }
  }, []);

  // Timer for free spin
  useEffect(() => {
    const interval = setInterval(() => {
      if (!lastFreeSpin) {
        setTimeLeft("00:00:00");
        return;
      }

      const endTime = lastFreeSpin + 24 * 60 * 60 * 1000;
      const diff = endTime - Date.now();

      if (diff <= 0) {
        setTimeLeft("00:00:00");

        // Grant free spin if not already granted
        setSpinsLeft(prev => {
          const newSpins = prev + 1;
          localStorage.setItem("SpinAndWin_extraSpins", newSpins);
          return newSpins;
        });

        // Reset free spin timer
        setLastFreeSpin(0);
        localStorage.setItem("SpinAndWin_lastFreeSpin", "0");
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastFreeSpin]);

  // Spin wheel
  const spinWheel = () => {
    if (spinning || spinsLeft <= 0) return;
    setSpinning(true);
    spinSound.current?.play();

    const segmentAngle = 360 / segments.length;
    const prizeIndex = Math.floor(Math.random() * segments.length);
    const randomExtra = Math.random() * (segmentAngle / 2);
    const stopAngle = prizeIndex * segmentAngle + segmentAngle / 2;
    const totalRotation = 360 * 10 - stopAngle + randomExtra;
    setRotation(totalRotation);

    // Deduct spin
    const updatedSpins = spinsLeft - 1;
    setSpinsLeft(updatedSpins);
    localStorage.setItem("SpinAndWin_extraSpins", updatedSpins);

    // Start 24h timer if it was a free spin
    if (timeLeft === "00:00:00" && lastFreeSpin === 0) {
      const now = Date.now();
      setLastFreeSpin(now);
      localStorage.setItem("SpinAndWin_lastFreeSpin", now.toString());
    }

    setTimeout(() => {
      const wonPoints = segments[prizeIndex].points;
      const wonLabel = segments[prizeIndex].label;

      if (wonLabel === "+1 Extra Spin") {
        const bonusSpins = updatedSpins + 1;
        setSpinsLeft(bonusSpins);
        localStorage.setItem("SpinAndWin_extraSpins", bonusSpins);
        setShowExtraSpinAnim(true);
        setShowConfetti(true);
        setTimeout(() => {
          setShowExtraSpinAnim(false);
          setShowConfetti(false);
        }, 2000);
      }

      setReward(wonLabel);
      const newTotal = totalPoints + wonPoints;
      setTotalPoints(newTotal);
      localStorage.setItem("SpinAndWin_totalPoints", newTotal.toString());

      setSpinning(false);
      setShowConfetti(true);
      winSound.current?.play();
      animatePoints(displayPoints, displayPoints + wonPoints);
      setTimeout(() => setShowConfetti(false), 4000);
    }, 4000);
  };

  const animatePoints = (from, to) => {
    let current = from;
    const increment = (to - from) / 50;
    const interval = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= to) || (increment < 0 && current <= to)) {
        current = to;
        clearInterval(interval);
      }
      setDisplayPoints(Math.floor(current));
    }, 16);
  };

  const radius = windowSize.width > 640 ? 150 : 120;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col items-center relative">
      <audio ref={spinSound} src="/sounds/spin.mp3" preload="auto" />
      <audio ref={winSound} src="/sounds/win.mp3" preload="auto" />

      {/* Header */}
      <header className="bg-orange-500 text-white py-4 px-6 shadow-lg flex items-center justify-center relative w-full">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-3 left-5 z-20 p-2 rounded-full bg-white shadow hover:bg-gray-100 transition"
        >
          <ArrowLeft className="w-5 h-5 text-orange-500" />
        </button>
        <h1 className="text-lg font-bold text-white">Spin & Win</h1>
        <div className="absolute top-3 right-5 bg-gradient-to-r from-orange-400 to-amber-400 px-4 py-1 rounded-full flex items-center gap-2 shadow-md">
          <span className="text-white font-semibold">{displayPoints}</span>
          <span className="text-sm text-white opacity-90">pts</span>
        </div>
      </header>

      {/* Wheel */}
      <div className="mt-10 flex justify-center items-center relative">
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-20">
          <div
            className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[30px] border-transparent"
            style={{
              borderTopColor: "#F97316",
              filter: "drop-shadow(0px 2px 3px rgba(0,0,0,0.3))",
            }}
          ></div>
        </div>

        <motion.div
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ opacity: { repeat: Infinity, duration: 2 } }}
          className="relative w-80 h-80 sm:w-96 sm:h-96 rounded-full flex justify-center items-center shadow-[0_0_30px_rgba(249,115,22,0.6)]"
        >
          <motion.div
            key={rotation}
            animate={{ rotate: rotation }}
            transition={{ duration: 4, ease: [0.1, 0.8, 0.2, 1] }}
            className="w-full h-full rounded-full bg-white flex justify-center items-center relative overflow-hidden"
          >
            {segments.map((seg, i) => {
              const angle = 360 / segments.length;
              const rotation = i * angle;
              return (
                <div
                  key={i}
                  className="absolute w-full h-full top-0 left-0 flex justify-center items-center"
                  style={{ transform: `rotate(${rotation}deg)` }}
                >
                  <div
                    className="absolute top-0 left-1/2 h-[50%] w-[50%] origin-bottom-left"
                    style={{
                      backgroundColor: seg.color,
                      transform: `skewY(-${90 - angle}deg)`,
                      borderTop: "1px solid white",
                      borderLeft: "1px solid white",
                    }}
                  />
                  <span
                    className="absolute font-bold text-sm sm:text-base"
                    style={{
                      transform: `rotate(${angle / 2}deg) translateY(-${radius}px)`,
                      color: seg.color === "#FFF7EB" ? "#F97316" : "#FFFFFF",
                    }}
                  >
                    {seg.label}
                  </span>
                </div>
              );
            })}
          </motion.div>

          {/* Center pulse */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              boxShadow: [
                "0 0 0px rgba(249,115,22,0.4)",
                "0 0 20px rgba(249,115,22,0.6)",
                "0 0 0px rgba(249,115,22,0.4)",
              ],
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute w-10 h-10 bg-orange-500 rounded-full border-4 border-white z-10"
          />
        </motion.div>
      </div>

      {/* Spin Button */}
      <div className="flex flex-col justify-center items-center mt-6 w-[90%] sm:w-[60%]">
        <button
          onClick={spinWheel}
          disabled={spinning || spinsLeft <= 0}
          className={`px-9 py-3 rounded-full font-semibold text-white shadow-md text-sm transition ${
            spinning || spinsLeft <= 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {spinning ? "Spinning..." : "Spin"}
        </button>
        {spinsLeft <= 0 && (
          <p className="text-red-500 text-sm mt-1">
            No spins left! Come back later or earn more.
          </p>
        )}
        <p className="text-sm text-gray-600 mt-2">🎯 Spins Left: {spinsLeft}</p>
        <p className="text-sm text-gray-600 mt-1">⏳ Next Free Spin: {timeLeft}</p>

        {/* Progress Bar */}
        <div className="w-full mt-2">
          <p className="text-sm text-gray-600 mb-1">
            💰 User Spent: ₹{userSpent - spentForSpins} / ₹500 for next spin
          </p>
          <div className="w-full bg-gray-300 h-2 rounded-full">
            <motion.div
              className="bg-green-500 h-2 rounded-full"
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Extra Spin Animation */}
        <AnimatePresence>
          {showExtraSpinAnim && (
            <motion.p
              key="extra-spin"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: -20 }}
              exit={{ opacity: 0, y: -40 }}
              className="text-green-600 font-bold text-sm mt-1"
            >
              +1 Extra Spin!
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Reward Display */}
      <AnimatePresence>
        {reward && (
          <motion.div
            key={reward}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 text-center text-lg font-semibold text-green-600"
          >
            🎉 You won: {reward}!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rules Section */}
      <div className="mt-8 mb-10 text-center bg-orange-100 border border-orange-300 rounded-xl p-4 w-[85%] sm:w-[60%] shadow-md">
        <h3 className="text-orange-600 font-bold mb-2 text-lg">📝 Spin Rules</h3>
        <ul className="text-gray-700 text-sm leading-relaxed">
          <li>🎯 1 Free Spin every 24 hours</li>
          <li>💰 1 Extra Spin for every ₹500 spent</li>
        </ul>
      </div>

      {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} />}
    </div>
  );
}
