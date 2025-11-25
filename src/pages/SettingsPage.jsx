// src/pages/SettingsPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  ArrowLeft,
  LogOut,
  Shield,
  User,
  Bell,
  Moon,
  Globe,
  Info,
  MessageCircle,
  Lock,
  CreditCard,
  Gift,
  Calendar,
  MapPin,
  Smartphone,
} from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const navigate = useNavigate();

  // Toggle states
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true" || false);
  const [notifications, setNotifications] = useState(localStorage.getItem("notifications") === "true" || true);
  const [orderUpdates, setOrderUpdates] = useState(localStorage.getItem("orderUpdates") === "true" || true);
  const [rewardAlerts, setRewardAlerts] = useState(localStorage.getItem("rewardAlerts") === "true" || true);
  const [promoNotifications, setPromoNotifications] = useState(localStorage.getItem("promoNotifications") === "true" || true);
  const [appUpdates, setAppUpdates] = useState(localStorage.getItem("appUpdates") === "true" || true);
  const [appLock, setAppLock] = useState(localStorage.getItem("appLock") === "true" || false);

  const [gender, setGender] = useState(localStorage.getItem("gender") || "");
const [birthday, setBirthday] = useState(localStorage.getItem("birthday") || "");
const [showBirthdayPopup, setShowBirthdayPopup] = useState(false);
const [showGenderPopup, setShowGenderPopup] = useState(false);
useEffect(() => {
  localStorage.setItem("gender", gender);
  localStorage.setItem("birthday", birthday);
}, [gender, birthday]);

  const handleToggle = (key, value, setter) => {
    setter(!value);
    localStorage.setItem(key, (!value).toString());
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/"); // redirect to login
  };

  const handleDeleteAccount = () => alert("Delete Account feature coming soon!");

  // Animated button wrapper
  const AnimatedButton = ({ children, onClick, className }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`w-full text-left px-4 py-3 bg-orange-50 rounded-xl shadow hover:bg-orange-100 transition ${className}`}
    >
      {children}
    </motion.button>
  );

  // Modern toggle switch component
  const ToggleSwitch = ({ label, value, setter }) => (
    <div className="flex justify-between items-center bg-orange-50 px-4 py-3 rounded-xl shadow">
      <span>{label}</span>
      <button
        onClick={() => handleToggle(label, value, setter)}
        className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${value ? "bg-orange-500" : "bg-gray-300"}`}
      >
        <span
          className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${value ? "translate-x-6" : "translate-x-0"}`}
        ></span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col items-center">
      {/* Header */}
      <header className="bg-orange-500 text-white py-4 px-7 shadow-lg w-full relative flex items-center justify-center sticky top-0 z-50">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-5 top-3 p-2 rounded-full bg-white shadow hover:bg-gray-100 transition"
        >
          <ArrowLeft className="w-5 h-5 text-orange-500" />
        </button>
        <h1 className="text-xl font-bold text-center">⚙️ Settings</h1>
      </header>

      <div className="flex-1 w-full max-w-3xl p-6 space-y-6">

        {/* 1. Personal Info & Profile */}
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <User className="text-orange-500" />
            <h2 className="text-lg font-semibold">Personal Info & Profile</h2>
            <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full text-xs">New</span>
          </div>
          <div className="space-y-3">
            <AnimatedButton onClick={() => navigate("/profile")}>Edit Profile</AnimatedButton>
            <AnimatedButton onClick={() => setShowBirthdayPopup(true)}>
  <Calendar className="inline mr-2" /> Birthday {birthday && <span className="text-gray-500 text-sm ml-2">🎉 {birthday}</span>}
</AnimatedButton>
            <AnimatedButton onClick={() => setShowGenderPopup(true)}>
  ⚧ Gender {gender && <span className="text-gray-500 text-sm ml-2"> {gender}</span>}
</AnimatedButton>
           <AnimatedButton onClick={() => navigate("/address")}>
  <MapPin className="inline mr-2" /> Location / Address
</AnimatedButton>
          </div>
        </div>

        {/* 2. Subscription & Rewards */}
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <Gift className="text-orange-500" />
            <h2 className="text-lg font-semibold">Subscription & Rewards</h2>
            <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded-full text-xs">Premium</span>
          </div>
          <div className="space-y-3">
            <AnimatedButton onClick={() => navigate("/rewards")}>
              Reward Points / Loyalty Program
            </AnimatedButton>
            <AnimatedButton onClick={() => alert("Subscription Management coming soon!")}>
              Subscription Management
            </AnimatedButton>
            <AnimatedButton onClick={() => navigate("/referafriend")}>
              Referral Program
            </AnimatedButton>
          </div>
        </div>

        {/* 3. Security & Privacy */}
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <Lock className="text-orange-500" />
            <h2 className="text-lg font-semibold">Security & Privacy</h2>
          </div>
          <div className="space-y-3">
            <ToggleSwitch label="App Lock / Passcode" value={appLock} setter={setAppLock} />
            <AnimatedButton onClick={() => alert("Login Activity / Devices coming soon!")}>
              <Smartphone className="inline mr-2" /> Login Activity / Devices
            </AnimatedButton>
          </div>
        </div>

        {/* 4. Payment & Billing */}
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="text-orange-500" />
            <h2 className="text-lg font-semibold">Payment & Billing</h2>
          </div>
          <div className="space-y-3">
            <AnimatedButton onClick={() => alert("Manage Payment Methods coming soon!")}>
              Manage Payment Methods
            </AnimatedButton>
            <AnimatedButton onClick={() => alert("Payment History / Receipts coming soon!")}>
              Payment History / Receipts
            </AnimatedButton>
          </div>
        </div>

        {/* 5. Notifications */}
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="text-orange-500" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>
          <div className="space-y-3">
            <ToggleSwitch label="Push / Email / SMS" value={notifications} setter={setNotifications} />
            <ToggleSwitch label="Order Updates" value={orderUpdates} setter={setOrderUpdates} />
            <ToggleSwitch label="Rewards Notifications" value={rewardAlerts} setter={setRewardAlerts} />
            <ToggleSwitch label="Promotions & Offers" value={promoNotifications} setter={setPromoNotifications} />
            <ToggleSwitch label="App Updates / News" value={appUpdates} setter={setAppUpdates} />
          </div>
        </div>

        {/* 6. App Preferences */}
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <Moon className="text-orange-500" />
            <h2 className="text-lg font-semibold">App Preferences</h2>
          </div>
          <div className="space-y-3">
            <ToggleSwitch label="Dark Mode" value={darkMode} setter={setDarkMode} />
            <AnimatedButton onClick={() => alert("Language Settings coming soon!")}>
              Language Settings
            </AnimatedButton>
            <AnimatedButton onClick={() => alert("App Sounds / Vibration coming soon!")}>
              App Sounds / Vibration
            </AnimatedButton>
          </div>
        </div>

        {/* 7. Help & Support */}
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="text-orange-500" />
            <h2 className="text-lg font-semibold">Help & Support</h2>
          </div>
          <div className="space-y-3">
            <AnimatedButton onClick={() => alert("FAQ coming soon!")}>FAQ</AnimatedButton>
            <AnimatedButton onClick={() => alert("Contact Support coming soon!")}>Contact Support</AnimatedButton>
            <AnimatedButton onClick={() => alert("Rate Us / Feedback coming soon!")}>Rate Us / Feedback</AnimatedButton>
            <AnimatedButton onClick={() => alert("Report a Bug coming soon!")}>Report a Bug</AnimatedButton>
          </div>
        </div>

        {/* 8. About */}
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <Info className="text-orange-500" />
            <h2 className="text-lg font-semibold">About</h2>
          </div>
          <div className="space-y-3">
            <AnimatedButton onClick={() => alert("Version 1.0.0")}>Version Info</AnimatedButton>
            <AnimatedButton onClick={() => alert("Terms & Conditions coming soon!")}>Terms & Conditions</AnimatedButton>
            <AnimatedButton onClick={() => alert("Privacy Policy coming soon!")}>Privacy Policy</AnimatedButton>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleLogout} className="w-full flex items-center gap-3 bg-white px-4 py-3 rounded-xl shadow hover:bg-orange-50 transition">
              <LogOut className="text-orange-500" /> Logout
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleDeleteAccount} className="w-full flex items-center gap-3 bg-white px-4 py-3 rounded-xl shadow hover:bg-red-50 text-red-500 transition">
              <Shield className="text-red-500" /> Delete Account
            </motion.button>
          </div>
        </div>

      </div>
      {/* Gender Selection Popup */}
{showGenderPopup && (
  <div className="fixed inset-0 bg-orange-100 bg-opacity-70 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-lg p-6 w-80">
      <h2 className="text-lg font-semibold text-orange-600 mb-4 text-center">Select Gender</h2>
      <div className="space-y-3">
        <button onClick={() => { setGender("👩 Female"); setShowGenderPopup(false); }} className="w-full py-2 rounded-xl bg-pink-100 hover:bg-pink-200">
          👩 Female
        </button>
        <button onClick={() => { setGender("👨 Male"); setShowGenderPopup(false); }} className="w-full py-2 rounded-xl bg-blue-100 hover:bg-blue-200">
          👨 Male
        </button>
        <button onClick={() => { setGender("🤫 Prefer not to say"); setShowGenderPopup(false); }} className="w-full py-2 rounded-xl bg-gray-100 hover:bg-gray-200">
          🤫 Prefer not to say
        </button>
        <button onClick={() => setShowGenderPopup(false)} className="mt-4 w-full py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600">
          Close
        </button>
      </div>
    </div>
  </div>
)}
{/* Birthday Date Picker Popup */}
{showBirthdayPopup && (
  <div className="fixed inset-0 bg-orange-100 bg-opacity-70 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-lg p-6 w-80">
      <h2 className="text-lg font-semibold text-orange-600 mb-4 text-center">🎂 Select Your Birthdate</h2>
      <input
        type="date"
        value={birthday}
        onChange={(e) => setBirthday(e.target.value)}
        className="w-full border border-gray-300 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
      <div className="flex justify-between mt-5">
        <button
          onClick={() => setShowBirthdayPopup(false)}
          className="w-[48%] py-2 bg-gray-100 rounded-xl hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          onClick={() => setShowBirthdayPopup(false)}
          className="w-[48%] py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
