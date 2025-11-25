// src/pages/ProfilePage.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Settings,
  LogOut,
  CreditCard,
  Shield,
  Camera,
} from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // User data
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "John Doe");
  const [email, setEmail] = useState(localStorage.getItem("userEmail") || "johndoe@example.com");
  const [phone, setPhone] = useState(localStorage.getItem("userPhone") || "+91 9876543210");
  const [totalPoints, setTotalPoints] = useState(parseInt(localStorage.getItem("SpinAndWin_totalPoints") || "120", 10));
  const [walletBalance, setWalletBalance] = useState(parseInt(localStorage.getItem("walletBalance") || "250", 10));
  const [profileImage, setProfileImage] = useState(localStorage.getItem("profileImage") || null);
  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [tempEmail, setTempEmail] = useState(email);
  const [tempPhone, setTempPhone] = useState(phone);

  const [badges] = useState([
    { name: "Frequent Buyer", icon: "⭐" },
    { name: "Lucky Spinner", icon: "🎡" },
    { name: "Referral Master", icon: "🤝" },
  ]);

  const [recentOrders] = useState([
    { id: 1, name: "Velvet Scoops", date: "2025-11-01", amount: 120 },
    { id: 2, name: "Mitra A Biryani", date: "2025-11-03", amount: 160 },
    { id: 3, name: "Vasind Katta", date: "2025-11-04", amount: 200 },
    { id: 4, name: "Sweet Treats", date: "2025-11-05", amount: 180 },
    { id: 5, name: "Spicy Hub", date: "2025-11-06", amount: 220 },
  ]);
  const [showAllOrders, setShowAllOrders] = useState(false);

  // Persist data to localStorage
  useEffect(() => { localStorage.setItem("userName", userName); }, [userName]);
  useEffect(() => { localStorage.setItem("userEmail", email); }, [email]);
  useEffect(() => { localStorage.setItem("userPhone", phone); }, [phone]);
  useEffect(() => { localStorage.setItem("SpinAndWin_totalPoints", totalPoints); }, [totalPoints]);
  useEffect(() => { localStorage.setItem("walletBalance", walletBalance); }, [walletBalance]);
  useEffect(() => { if(profileImage) localStorage.setItem("profileImage", profileImage); }, [profileImage]);

  // Ensure login flag is set
  useEffect(() => { localStorage.setItem("isLoggedIn", "true"); }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setProfileImage(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = () => setEditing(true);
  const handleCancel = () => {
    setEditing(false);
    setTempName(userName);
    setTempEmail(email);
    setTempPhone(phone);
  };
  const handleSave = () => {
    setUserName(tempName);
    setEmail(tempEmail);
    setPhone(tempPhone);
    setEditing(false);
  };

  const handleQuickAction = (path) => navigate(path);
  const handleSettings = () => navigate("/settings");
  const handleLogout = () => {
    localStorage.clear();
    navigate("/"); // redirect to login page
  };
  const handleDeleteAccount = () => alert("Delete Account feature coming soon!");

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col relative items-center">
      {/* Header */}
      <header className="bg-orange-500 text-white py-4 px-7 shadow-lg w-full relative flex items-center justify-center">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-5 top-3 p-2 rounded-full bg-white shadow hover:bg-gray-100 transition"
        >
          <ArrowLeft className="w-5 h-5 text-orange-500" />
        </button>
        <h1 className="text-xl font-bold text-center">👤 Profile</h1>
      </header>

      <motion.div
        className="flex-1 w-full max-w-3xl p-6 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center relative">
          <div className="relative w-24 h-24 mb-4">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center text-4xl">
                <User size={50} />
              </div>
            )}
            <button
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-0 right-0 bg-orange-500 rounded-full p-2 shadow-md hover:bg-orange-600 transition"
            >
              <Camera className="w-4 h-4 text-white" />
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {editing ? (
            <div className="w-full space-y-2 mb-4">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="w-full border border-orange-300 rounded-xl px-3 py-1"
              />
              <input
                type="email"
                value={tempEmail}
                onChange={(e) => setTempEmail(e.target.value)}
                className="w-full border border-orange-300 rounded-xl px-3 py-1"
              />
              <input
                type="text"
                value={tempPhone}
                onChange={(e) => setTempPhone(e.target.value)}
                className="w-full border border-orange-300 rounded-xl px-3 py-1"
              />
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold">{userName}</h2>
              <p className="text-gray-500 text-sm">{email}</p>
              <p className="text-gray-500 text-sm mb-4">{phone}</p>
            </>
          )}

          <div className="bg-gradient-to-r from-orange-400 to-amber-400 text-white px-4 py-2 rounded-xl shadow mb-4 w-full">
            Total Points: <span className="font-bold">{totalPoints}</span>
          </div>
          <div className="bg-white border border-orange-100 shadow p-4 rounded-xl mb-4 w-full flex justify-between items-center">
            <div>
              <h3 className="text-sm text-gray-500">Wallet Balance</h3>
              <p className="text-lg font-bold">₹{walletBalance}</p>
            </div>
            <CreditCard className="text-orange-500" />
          </div>

          {editing ? (
            <div className="flex gap-4 w-full">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="bg-orange-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-orange-600 transition w-full"
              >
                Save
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleCancel}
                className="bg-white text-orange-500 px-6 py-2 rounded-full shadow-md hover:bg-orange-50 transition w-full"
              >
                Cancel
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleEditClick}
              className="bg-orange-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-orange-600 transition mb-3 w-full"
            >
              Edit Profile
            </motion.button>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleQuickAction("/dailylogin")}
            className="flex items-center justify-center gap-2 bg-white px-4 py-2 rounded-xl shadow hover:bg-orange-50 w-full"
          >
            🎯 Daily Login
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleQuickAction("/spinandwin")}
            className="flex items-center justify-center gap-2 bg-white px-4 py-2 rounded-xl shadow hover:bg-orange-50 w-full"
          >
            🎡 Spin & Win
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleQuickAction("/referafriend")}
            className="flex items-center justify-center gap-2 bg-white px-4 py-2 rounded-xl shadow hover:bg-orange-50 w-full"
          >
            🤝 Refer a Friend
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleQuickAction("/rewards")}
            className="flex items-center justify-center gap-2 bg-white px-4 py-2 rounded-xl shadow hover:bg-orange-50 w-full"
          >
            🎁 Rewards
          </motion.button>
        </div>

        {/* Badges */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">🏅 Badges & Achievements</h3>
          <div className="flex flex-wrap gap-3">
            {badges.map((badge, idx) => (
              <div
                key={idx}
                className="bg-orange-100 text-orange-500 px-3 py-1 rounded-full text-sm flex items-center gap-1 shadow"
              >
                {badge.icon} {badge.name}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">🛒 Recent Orders</h3>
          <div className="space-y-2">
            {(showAllOrders ? recentOrders : recentOrders.slice(0, 3)).map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-3 rounded-xl shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{order.name}</p>
                  <p className="text-gray-500 text-sm">{order.date}</p>
                </div>
                <p className="font-bold">₹{order.amount}</p>
              </motion.div>
            ))}
          </div>

          {recentOrders.length > 3 && (
            <button
              onClick={() => setShowAllOrders(!showAllOrders)}
              className="mt-2 text-orange-500 font-medium hover:underline"
            >
              {showAllOrders ? "Show Less" : "View More Orders"}
            </button>
          )}
        </div>

        {/* Settings & Security */}
        <div className="mt-6 space-y-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSettings}
            className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl shadow hover:bg-orange-50 w-full"
          >
            <Settings className="text-orange-500" /> Settings
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl shadow hover:bg-orange-50 w-full"
          >
            <LogOut className="text-orange-500" /> Logout
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleDeleteAccount}
            className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl shadow hover:bg-red-50 text-red-500 w-full"
          >
            <Shield className="text-red-500" /> Delete Account
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
