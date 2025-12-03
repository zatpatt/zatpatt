// src/pages/SpinandWinPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";

/**
 * Spin & Win — Option B (Claim free spin via modal; do NOT auto-spin)
 *
 * LocalStorage keys used:
 *  - SpinAndWin_totalPoints          : total reward points
 *  - SpinAndWin_spinsLeft           : available spins (including extra spins earned)
 *  - SpinAndWin_lastFreeClaim       : timestamp when user last CLAIMED a free spin (ms)
 *  - SpinAndWin_userSpent           : total rupees the user has spent (used to award spins per ₹500)
 *  - SpinAndWin_spentForSpinsMarked : amount already counted toward awarding extra spins (multiples of 500)
 *
 * Behavior:
 *  - Free spin eligibility: (lastFreeClaim === 0) || (Date.now() - lastFreeClaim >= 24h)
 *    * free spin is NOT automatically added. The user must "Claim" it from the modal.
 *  - Extra spins: for every ₹500 spent we award 1 spin (applied once, tracked by spentForSpinsMarked).
 *  - Extra Spin wheel segment gives +1 spin when hit.
 *  - Weighted probabilities implemented via weights array.
 *  - All notifications use a custom modal / inline UI (no alert()).
 */

const LS = {
  points: "SpinAndWin_totalPoints",
  spins: "SpinAndWin_spinsLeft",
  lastFree: "SpinAndWin_lastFreeClaim",
  userSpent: "SpinAndWin_userSpent",
  spentMarked: "SpinAndWin_spentForSpinsMarked",
};

const HOUR24 = 24 * 60 * 60 * 1000;

export default function SpinandWinPage() {
  const navigate = useNavigate();

  // segments with labels, points (0 for extra spin), and color
  const segments = [
    { id: "p5", label: "+5 Points", points: 5, color: "#F97316" },
    { id: "p10", label: "+10 Points", points: 10, color: "#FFF7EB" },
    { id: "p15", label: "+15 Points", points: 15, color: "#FB923C" },
    { id: "p20", label: "+20 Points", points: 20, color: "#FFF7EB" },
    { id: "p25", label: "+25 Points", points: 25, color: "#F97316" },
    { id: "p50", label: "+50 Points", points: 50, color: "#FFF7EB" },
    { id: "p75", label: "+75 Points", points: 75, color: "#FB923C" },
    { id: "extra", label: "+1 Extra Spin", points: 0, color: "#FFF7EB" },
  ];

  // Weights => higher weight = more likely
  // Map indices to segments array order
  // Make small numbers higher for common rewards
  const weights = [18, 18, 18, 18, 9, 7, 3, 2]; // sums to 93 for variety

  // state
  const [totalPoints, setTotalPoints] = useState(() =>
    parseInt(localStorage.getItem(LS.points) || "120", 10)
  );
  const [displayPoints, setDisplayPoints] = useState(totalPoints);

  const [spinsLeft, setSpinsLeft] = useState(() =>
    parseInt(localStorage.getItem(LS.spins) || "0", 10)
  );
  const [lastFreeClaim, setLastFreeClaim] = useState(() =>
    parseInt(localStorage.getItem(LS.lastFree) || "0", 10)
  );

  const [userSpent, setUserSpent] = useState(() =>
    parseInt(localStorage.getItem(LS.userSpent) || "0", 10)
  );
  const [spentMarked, setSpentMarked] = useState(() =>
    parseInt(localStorage.getItem(LS.spentMarked) || "0", 10)
  );

  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [rewardText, setRewardText] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showModal, setShowModal] = useState(null); // { type, title, body, onConfirm, confirmText }
  const spinSound = useRef(null);
  const winSound = useRef(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // update window size for confetti
  useEffect(() => {
    const onResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // persist key changes
  useEffect(() => localStorage.setItem(LS.points, String(totalPoints)), [totalPoints]);
  useEffect(() => localStorage.setItem(LS.spins, String(spinsLeft)), [spinsLeft]);
  useEffect(() => localStorage.setItem(LS.lastFree, String(lastFreeClaim)), [lastFreeClaim]);
  useEffect(() => localStorage.setItem(LS.userSpent, String(userSpent)), [userSpent]);
  useEffect(() => localStorage.setItem(LS.spentMarked, String(spentMarked)), [spentMarked]);

  // when component mounts, award spins from userSpent if new thresholds crossed
  useEffect(() => {
    // calculate how many new extra spins should be awarded based on userSpent vs spentMarked
    const alreadyAwardedUnits = Math.floor(spentMarked / 500);
    const currentUnits = Math.floor(userSpent / 500);
    const newUnits = Math.max(0, currentUnits - alreadyAwardedUnits);
    if (newUnits > 0) {
      const newSpins = spinsLeft + newUnits;
      setSpinsLeft(newSpins);
      // mark those rupees as accounted for
      const newMarked = spentMarked + newUnits * 500;
      setSpentMarked(newMarked);
      // show a toast/modal informing the user (non-blocking)
      setShowModal({
        type: "info",
        title: "Extra Spin(s) Earned",
        body: `You've earned ${newUnits} extra spin(s) for spending ₹${newUnits * 500}. Go spin!`,
        confirmText: "OK",
        onConfirm: () => setShowModal(null),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // helper: weighted random index
  const weightedIndex = (weightsArr) => {
    const total = weightsArr.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < weightsArr.length; i++) {
      if (r < weightsArr[i]) return i;
      r -= weightsArr[i];
    }
    return weightsArr.length - 1;
  };

  // animate points from -> to
  const animatePoints = (from, to) => {
    let current = from;
    const steps = 40;
    const increment = (to - from) / steps;
    const t = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= to) || (increment < 0 && current <= to)) {
        setDisplayPoints(to);
        clearInterval(t);
      } else {
        setDisplayPoints(Math.floor(current));
      }
    }, 12);
  };

  // Claim free spin modal (Option B). Called when user clicks "Use Now".
  const claimFreeSpin = () => {
    // add 1 spin but do NOT auto-spin (Option B)
    const newSpins = spinsLeft + 1;
    setSpinsLeft(newSpins);
    const now = Date.now();
    setLastFreeClaim(now);
    // persist done by effect
    setShowModal({
      type: "info",
      title: "Free spin added",
      body: "A free spin was added to your account. Tap Spin to use it.",
      confirmText: "OK",
      onConfirm: () => setShowModal(null),
    });
  };

  // check eligibility for free spin (returns boolean)
  const freeSpinEligible = () => {
    if (!lastFreeClaim) return true; // never claimed -> eligible
    return Date.now() - lastFreeClaim >= HOUR24;
  };

  // When the user clicks main Spin button
  const onSpinClick = () => {
    // if currently spinning: ignore
    if (spinning) return;

    // If have spins, start spin
    if (spinsLeft > 0) {
      startSpin();
      return;
    }

    // no spins left: check free eligibility
    if (freeSpinEligible()) {
      // show Claim Free Spin modal (Option B: add spin but do not auto spin)
      setShowModal({
        type: "confirmFree",
        title: "Free Spin Available",
        body: "You have 1 free spin available. Claim it now? (You will need to tap Spin again to use it.)",
        confirmText: "Use Now",
        cancelText: "Cancel",
        onConfirm: () => {
          claimFreeSpin();
        },
        onCancel: () => setShowModal(null),
      });
      return;
    }

    // otherwise show a gentle info modal suggesting how to earn spins
    setShowModal({
      type: "info",
      title: "No Spins Available",
      body:
        "No spins left. Earn spins by:\n• Hitting the +1 Extra Spin segment on the wheel\n• Earning 1 extra spin for every ₹500 you spend",
      confirmText: "Got it",
      onConfirm: () => setShowModal(null),
    });
  };

  // actual spin procedure
  const startSpin = () => {
    if (spinning) return;
    if (spinsLeft <= 0) {
      // should be prevented earlier
      return;
    }

    setSpinning(true);
    spinSound.current?.play?.();

    // choose prize via weights
    const prizeIndex = weightedIndex(weights);
    const segmentAngle = 360 / segments.length;
    // calculate rotation so the wheel slows down to that prize
    const randomOffset = Math.random() * (segmentAngle * 0.5) - (segmentAngle * 0.25);
    const stopAngle = prizeIndex * segmentAngle + segmentAngle / 2 + randomOffset;
    // multiple rotations + computed stop
    const fullRotations = 360 * 8;
    const totalRotation = fullRotations - stopAngle;
    setRotation((r) => r + totalRotation);

    // deduct one spin now
    setSpinsLeft((s) => {
      const newVal = Math.max(0, s - 1);
      // persisted by useEffect
      return newVal;
    });

    // on spin end (after animation duration)
    setTimeout(() => {
      const seg = segments[prizeIndex];

      // If extra spin segment
      if (seg.id === "extra") {
        // award one extra spin
        setSpinsLeft((s) => {
          const newVal = s + 1; // was already decremented, so effectively net 0 or +1 depending
          localStorage.setItem(LS.spins, String(newVal));
          return newVal;
        });

        // Show modal/toast for extra spin (no points)
        setRewardText("+1 Extra Spin");
        setShowConfetti(true);
        winSound.current?.play?.();
        animatePoints(displayPoints, displayPoints); // no point change
        setTimeout(() => setShowConfetti(false), 3000);
      } else {
        // regular points awarded
        const won = seg.points || 0;
        const newTotal = totalPoints + won;
        setTotalPoints(newTotal);
        localStorage.setItem(LS.points, String(newTotal));
        setRewardText(seg.label);
        setShowConfetti(true);
        winSound.current?.play?.();
        animatePoints(displayPoints, newTotal);
        setTimeout(() => setShowConfetti(false), 3500);
      }

      // minor UI finish
      setSpinning(false);

      // Show a modal summarizing the win (no alert)
      setShowModal({
        type: "result",
        title: "You won!",
        body: seg.id === "extra" ? "You got +1 extra spin. Try again!" : `You won ${seg.label}!`,
        confirmText: "Nice",
        onConfirm: () => setShowModal(null),
      });
    }, 4400); // match animation (approx)
  };

  // small utility to format next free spin countdown (if lastFreeClaim exists)
  const remainingForNextFree = () => {
    if (!lastFreeClaim) return "00:00:00";
    const diff = HOUR24 - (Date.now() - lastFreeClaim);
    if (diff <= 0) return "00:00:00";
    const hrs = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // small "simulate spend" helper for demo/testing (you can remove in prod)
  const addSpendForDemo = (amt) => {
    const newSpent = userSpent + amt;
    setUserSpent(newSpent);
    // check awarding extra spins for new threshold
    const alreadyUnits = Math.floor(spentMarked / 500);
    const newUnits = Math.floor(newSpent / 500) - alreadyUnits;
    if (newUnits > 0) {
      const newSpins = spinsLeft + newUnits;
      setSpinsLeft(newSpins);
      setSpentMarked(spentMarked + newUnits * 500);
      setShowModal({
        type: "info",
        title: "Extra Spin(s) Earned",
        body: `You've earned ${newUnits} extra spin(s) for spending ₹${newUnits * 500}.`,
        confirmText: "OK",
        onConfirm: () => setShowModal(null),
      });
    }
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
      <div className="mt-8 flex justify-center items-center relative w-full">
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-20">
          <div
            className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[30px] border-transparent"
            style={{
              borderTopColor: "#F97316",
              filter: "drop-shadow(0px 2px 3px rgba(0,0,0,0.3))",
            }}
          />
        </div>

        <motion.div
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
              const rotationDeg = i * angle;
              return (
                <div
                  key={seg.id}
                  className="absolute w-full h-full top-0 left-0 flex justify-center items-center"
                  style={{ transform: `rotate(${rotationDeg}deg)` }}
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
              scale: [1, 1.08, 1],
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

      {/* Controls */}
      <div className="flex flex-col justify-center items-center mt-6 w-[90%] sm:w-[60%]">
        <button
          onClick={onSpinClick}
          disabled={spinning}
          className={`px-9 py-3 rounded-full font-semibold text-white shadow-md text-sm transition ${
            spinning ? "bg-gray-400 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {spinning ? "Spinning..." : "Spin"}
        </button>

        <p className="text-sm text-gray-600 mt-3">🎯 Spins Left: <strong>{spinsLeft}</strong></p>
        <p className="text-sm text-gray-600 mt-1">⏳ Next Free Spin: {freeSpinEligible() ? "Available" : remainingForNextFree()}</p>

        {/* Progress bar for ₹500 spent */}
        <div className="w-full mt-4">
          <p className="text-sm text-gray-600 mb-1">💰 Spent: ₹{userSpent} (every ₹500 = 1 spin)</p>
          <div className="w-full bg-gray-300 h-2 rounded-full">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${((userSpent % 500) / 500) * 100}%` }}
            />
          </div>
        </div>

        {/* small demo buttons (optional) */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => addSpendForDemo(120)}
            className="px-3 py-1 rounded-xl bg-white border"
          >
            +₹120 (demo)
          </button>
          <button
            onClick={() => addSpendForDemo(400)}
            className="px-3 py-1 rounded-xl bg-white border"
          >
            +₹400 (demo)
          </button>
        </div>
      </div>

      {/* Reward text */}
      <AnimatePresence>
        {rewardText && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-4 text-center text-lg font-semibold text-green-600"
          >
            🎉 {rewardText}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confetti */}
      {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} />}

      {/* Modal (custom) */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-orange-50 bg-opacity-40"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-orange-300 rounded-2xl p-5 w-full max-w-md"
            >
              <h3 className="text-lg font-semibold mb-2">{showModal.title}</h3>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap mb-4">{showModal.body}</pre>

              <div className="flex justify-end gap-3">
                {showModal.cancelText && (
                  <button
                    onClick={() => {
                      showModal.onCancel?.();
                    }}
                    className="px-4 py-2 rounded-xl border"
                  >
                    {showModal.cancelText}
                  </button>
                )}
                <button
                  onClick={() => {
                    typeof showModal.onConfirm === "function" && showModal.onConfirm();
                  }}
                  className="px-4 py-2 rounded-xl bg-orange-500 text-white"
                >
                  {showModal.confirmText || "OK"}
                </button>
              </div>
            </motion.div>
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
    </div>
  );
}
