// src/pages/ReferaFriendPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Users, ArrowLeft, Share2, Copy, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**********************************************************************
 * Referral System — FINAL PRODUCTION VERSION
 * --------------------------------------------------------------
 * USER RULES:
 * 1) Each user gets a unique code valid for 6 months.
 * 2) Max 10 referrals per month. After that → NO POINTS AWARDED.
 * 3) Friend Signup: +50 points
 * 4) Friend’s 1st order: +10 points
 * 5) Friend’s 2nd order: +5 points
 * 6) Friend’s 3rd order: +1 point
 * 7) Self-referrals blocked.
 *
 * This page ONLY shows UI and referral table.
 * The functions below MUST be called from your Signup & Order flow:
 *
 * 👉 processReferralSignup(friendId)
 * 👉 processReferralOrder(friendId)
 *********************************************************************/

const REF_KEY = "zat_referral_info"; // { code, createdAt, expiresAt }
const REF_LIST_KEY = "zat_referrals_list"; // [{ id, referredId, date, orders, pointsEarned }]
const POINTS_KEY = "global_reward_points"; // points balance for this user

// Generate unique referral code
const generateCode = () =>
  `ZAT${Date.now().toString(36).toUpperCase()}${Math.random()
    .toString(36)
    .substring(2, 6)
    .toUpperCase()}`;

// Helper mask
const mask = (id = "") => {
  if (!id) return "—";
  if (id.includes("@")) {
    const [u, d] = id.split("@");
    return `${u.slice(0, 2)}***@${d}`;
  }
  return `${id.slice(0, 2)}*****${id.slice(-2)}`;
};

// Toast helper
function toastId() {
  return Math.random().toString(36).substring(2, 7);
}

export default function ReferaFriendPage() {
  const navigate = useNavigate();

  /**************** STATE ****************/
  const [me, setMe] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(REF_KEY));
    } catch {
      return null;
    }
  });

  const [refs, setRefs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(REF_LIST_KEY)) || [];
    } catch {
      return [];
    }
  });

  const [points, setPoints] = useState(() => {
    const p = localStorage.getItem(POINTS_KEY);
    return p ? Number(p) : 0;
  });

  const [toasts, setToasts] = useState([]);

  /**************** TOAST SYSTEM ****************/
  const showToast = (msg, type = "info", time = 3000) => {
    const id = toastId();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, time);
  };

  /**************** INIT — CREATE REFERRAL CODE IF NOT EXISTS ****************/
  useEffect(() => {
    if (!me) {
      const code = generateCode();
      const createdAt = Date.now();
      const expiresAt = new Date(createdAt);
      expiresAt.setMonth(expiresAt.getMonth() + 6);

      const data = { code, createdAt, expiresAt: expiresAt.getTime() };
      localStorage.setItem(REF_KEY, JSON.stringify(data));
      setMe(data);
    }
  }, [me]);

  /**************** PERSIST DATA ****************/
  useEffect(() => {
    localStorage.setItem(REF_LIST_KEY, JSON.stringify(refs));
  }, [refs]);

  useEffect(() => {
    localStorage.setItem(POINTS_KEY, points);
  }, [points]);

  /**************** DERIVED ****************/
  const codeValid = useMemo(() => {
    if (!me) return false;
    return Date.now() <= me.expiresAt;
  }, [me]);

  const referralsThisMonth = useMemo(() => {
    const n = new Date();
    return refs.filter((r) => {
      const d = new Date(r.date);
      return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
    }).length;
  }, [refs]);

  /**************** SHARE HANDLERS ****************/
  const shareMessage = (code) =>
    `Join me on Zatpatt! Use my referral code ${code} to earn rewards: ${window.location.origin}/signup?ref=${code}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(me.code);
    showToast("Copied to clipboard ✓", "success");
  };

  const handleNativeShare = () => {
    if (!navigator.share) return showToast("Native share not supported", "error");
    navigator
      .share({ text: shareMessage(me.code) })
      .then(() => showToast("Shared!", "success"))
      .catch(() => {});
  };

  const shareWhatsApp = () =>
    window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage(me.code))}`, "_blank");

  const shareSMS = () =>
    (window.location.href = `sms:?&body=${encodeURIComponent(shareMessage(me.code))}`);

  /**************************************************************
   *    🔥 EXPOSED FUNCTIONS TO CALL FROM SIGNUP / ORDER FLOW 🔥
   **************************************************************/

  // 1) When friend signs up with ref=? REFERRAL CODE
  window.processReferralSignup = (friendId) => {
    if (!me) return;

    // block self-referral
    const myId = localStorage.getItem("user_account_id") || "ME";
    if (friendId === myId) {
      showToast("Self-referral blocked", "error");
      return;
    }

    // monthly hard limit enforcement
    if (referralsThisMonth >= 10) {
      showToast("Monthly referral limit reached — no points awarded", "error");
      return;
    }

    // prevent duplicate friends
    if (refs.some((r) => r.referredId === friendId)) {
      showToast("This user already used your code", "error");
      return;
    }

    const entry = {
      id: `REF-${Date.now().toString(36)}`,
      referredId: friendId,
      date: Date.now(),
      orders: 0,
      pointsEarned: 50,
    };

    setRefs((s) => [entry, ...s]);
    setPoints((p) => p + 50);
    showToast("+50 points earned!", "success");
  };

  // 2) When referred friend completes an order
  window.processReferralOrder = (friendId) => {
    setRefs((prev) =>
      prev.map((r) => {
        if (r.referredId !== friendId) return r;

        const newOrders = r.orders + 1;
        let award = 0;
        if (newOrders === 1) award = 10;
        else if (newOrders === 2) award = 5;
        else if (newOrders === 3) award = 1;

        if (award > 0) {
          setPoints((p) => p + award);
          showToast(`Referral order reward: +${award} pts`, "success");
        }

        return { ...r, orders: newOrders, pointsEarned: r.pointsEarned + award };
      })
    );
  };

  /**************** EXPORT CSV ****************/
  const exportCSV = () => {
    if (!refs.length) return showToast("No referrals", "error");

    const header = ["#", "Referred", "Date", "Orders", "Points"];
    const rows = refs.map((r, i) => [
      i + 1,
      r.referredId,
      new Date(r.date).toLocaleString(),
      r.orders,
      r.pointsEarned,
    ]);

    const csv = [header, ...rows]
      .map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "referrals.csv";
    a.click();
    URL.revokeObjectURL(url);

    showToast("CSV exported", "success");
  };

  /**************** UI ****************/
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col">
      {/* Header */}
      <header className="bg-orange-500 text-white py-4 px-6 shadow-lg flex items-center justify-center relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-3 left-5 p-2 rounded-full bg-white shadow"
        >
          <ArrowLeft className="w-5 h-5 text-orange-500" />
        </button>

        <h1 className="text-xl font-bold">Refer & Earn</h1>
        <Users className="absolute right-5 top-3 text-white w-6 h-6" />
      </header>

      <motion.div
        className="flex-1 p-6 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Referral Card */}
        <div className="w-full max-w-3xl p-[2px] rounded-xl bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 shadow">
          <div className="bg-white rounded-xl p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-orange-600 text-center">
              Invite friends & earn rewards
            </h2>
            <p className="text-gray-700 text-center mt-2">
              Your referral code is valid for 6 months.
            </p>

            <div className="flex justify-center items-center gap-3 mt-5">
              <span
                className={`px-4 py-2 rounded-lg text-lg font-semibold ${
                  codeValid ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-600"
                }`}
              >
                {me?.code}
              </span>

              <button
                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white shadow"
                onClick={handleCopy}
              >
                <Copy size={16} /> Copy
              </button>

              <button
                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white shadow"
                onClick={handleNativeShare}
              >
                <Share2 size={16} /> Share
              </button>
            </div>

            {/* Share buttons */}
            <div className="flex justify-center gap-3 mt-3">
              <button
                onClick={shareWhatsApp}
                className="px-4 py-2 bg-green-500 text-white rounded-xl shadow hover:bg-green-600"
              >
                WhatsApp
              </button>
              <button
                onClick={shareSMS}
                className="px-4 py-2 bg-blue-500 text-white rounded-xl shadow hover:bg-blue-600"
              >
                SMS
              </button>
            </div>

            <div className="mt-4 text-center text-sm text-gray-600">
              Max <b>10 referrals</b> earn points per month.
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mt-5 text-center">
              <div className="bg-orange-50 p-3 rounded-xl">
                <p className="text-xs text-gray-500">Your Points</p>
                <p className="text-xl font-bold text-orange-600">{points}</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-xl">
                <p className="text-xs text-gray-500">Total Referrals</p>
                <p className="text-xl font-bold text-orange-600">{refs.length}</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-xl">
                <p className="text-xs text-gray-500">This Month</p>
                <p className="text-xl font-bold text-orange-600">{referralsThisMonth}</p>
              </div>
            </div>

            {/* Export */}
            <div className="flex justify-center mt-5">
              <button
                onClick={exportCSV}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white shadow"
              >
                <Download size={16} /> Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Referral Table */}
        <div className="w-full max-w-3xl mt-6 bg-white p-5 rounded-xl shadow">
          <h3 className="font-semibold mb-3">Your Referrals</h3>

          {refs.length === 0 ? (
            <p className="text-gray-500 text-center py-5">No referrals yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600 border-b">
                    <th className="py-2">#</th>
                    <th className="py-2">Referred</th>
                    <th className="py-2">Date</th>
                    <th className="py-2">Orders</th>
                    <th className="py-2">Points</th>
                  </tr>
                </thead>

                <tbody>
                  {refs.map((r, i) => (
                    <tr key={r.id} className="border-b">
                      <td className="py-2">{i + 1}</td>
                      <td className="py-2">{mask(r.referredId)}</td>
                      <td className="py-2">
                        {new Date(r.date).toLocaleDateString()}
                      </td>
                      <td className="py-2">{r.orders}</td>
                      <td className="py-2">{r.pointsEarned}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>

      {/* Toast UI */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-2 rounded-xl shadow text-sm 
              ${
                t.type === "success"
                  ? "bg-green-100 text-green-800"
                  : t.type === "error"
                  ? "bg-red-100 text-red-800"
                  : "bg-white text-gray-700"
              }`}
          >
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}
