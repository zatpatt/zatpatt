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
  Crown,
  Link,
  Receipt,
  Volume2,
  Vibrate,
  VolumeX,
  CircleHelp,
  Headset,
  Star,
  AlertCircle,
  FileText,
  Rss,
  Flame,
  Package,
  Banknote,
} from "lucide-react";
import { motion } from "framer-motion";
import { DarkModeContext } from "../context/DarkModeContext.jsx";
export default function SettingsPage() {
  const navigate = useNavigate();

  // Toggle states
  const [devices, setDevices] = useState(JSON.parse(localStorage.getItem("loggedDevices")) || []);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true" || false);
  const [notifications, setNotifications] = useState(localStorage.getItem("notifications") === "true");
  const [orderUpdates, setOrderUpdates] = useState(localStorage.getItem("orderUpdates") === "true");
  const [rewardAlerts, setRewardAlerts] = useState(localStorage.getItem("rewardAlerts") === "true");
  const [promoNotifications, setPromoNotifications] = useState(localStorage.getItem("promoNotifications") === "true");
  const [appUpdates, setAppUpdates] = useState(localStorage.getItem("appUpdates") === "true");

  const [showAppLockPopup, setShowAppLockPopup] = useState(false);

  const [passcodeMessage, setPasscodeMessage] = useState(null);

  const [showBugPopup, setShowBugPopup] = useState(false);
  const [bugTitle, setBugTitle] = useState("");
  const [bugDescription, setBugDescription] = useState("");
  const [bugError, setBugError] = useState(null);
  const [bugSuccess, setBugSuccess] = useState(null);

  const [showVersionPopup, setShowVersionPopup] = useState(false);

  const [appLock, setAppLock] = useState(localStorage.getItem("appLock") === "true" || false);
 
  const openAppStore = () => {
  const iosURL = "https://apps.apple.com/app/idYOUR_APP_ID"; // Replace with your iOS app id
  const androidURL = "https://play.google.com/store/apps/details?id=YOUR_PACKAGE_NAME"; // Replace with your Android package name

  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  if (/android/i.test(userAgent)) {
    window.open(androidURL, "_blank");
  } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    window.open(iosURL, "_blank");
  } else {
    // Default fallback
    window.open(androidURL, "_blank");
  }
};

  // Add at the top with other useStates
const [appSoundMode, setAppSoundMode] = useState(
  localStorage.getItem("appSoundMode") || "sound" // default to 'sound'
);

const handleSoundModeChange = (mode) => {
  setAppSoundMode(mode);
  localStorage.setItem("appSoundMode", mode);

  // Optional: API call to persist preference
  updateSetting("appSoundMode", mode);
};

const SoundModeSelector = () => (
  <div className="bg-orange-50 p-4 rounded-xl shadow flex justify-between items-center">
    <span className="font-semibold">
      <Volume2 className="inline mr-1 text-black" /> App Sound / Vibration</span>
    <div className="flex gap-1">
      {["sound", "vibration", "silent"].map((mode) => (
        <button
          key={mode}
          onClick={() => handleSoundModeChange(mode)}
          className={`px-3 py-1 rounded-full font-semibold transition ${
            appSoundMode === mode
              ? "bg-orange-500 text-white shadow"
              : "bg-gray-200 text-gray-700 hover:bg-orange-100"
          }`}
        >
          {mode === "sound" ? "🔊" : mode === "vibration" ? "📳" : "🔕"}
        </button>
      ))}
    </div>
  </div>
);

  const [showContactPopup, setShowContactPopup] = useState(false);
  const [showSubPopup, setShowSubPopup] = useState(false);
  
  const [showDarkModePopup, setShowDarkModePopup] = useState(false);
  const [showLanguagePopup, setShowLanguagePopup] = useState(false);
 
// Reusable Coming Soon Popup
  const ComingSoonPopup = ({ title, icon, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-5"
    >
      <h2 className="text-xl font-bold text-orange-500 text-center mb-2">
        {icon} {title}
      </h2>
      <p className="text-sm text-gray-600 text-center mb-4">
        This feature is under development.<br/>
        Stay tuned for exciting updates! 🎉
      </p>
      <div className="flex justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-t-orange-500 border-gray-200 rounded-full"></div>
      </div>
      <p className="text-xs text-gray-500 text-center mt-3">
        Coming Soon • Premium Feature
      </p>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onClose}
        className="mt-4 w-full py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 font-semibold"
      >
        Close
      </motion.button>
    </motion.div>
  </motion.div>
);

  const [showPayPopup, setShowPayPopup] = useState(false);
  const [selectedPay, setSelectedPay] = useState(localStorage.getItem("paymentMethod") || "COD");

  const [receipts, setReceipts] = useState(JSON.parse(localStorage.getItem("orderReceipts")) || []);
  
  const downloadReceiptPDF = (receipt) => {
  // We use jsPDF (install later when needed)
  import("jspdf").then(({ default: jsPDF }) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Order Receipt", 14, 20);

    doc.setFontSize(10);
    doc.text(`Order ID: ${receipt.orderId}`, 14, 35);
    doc.text(`Customer: ${receipt.customer}`, 14, 42);
    doc.text(`Phone: ${receipt.phone}`, 14, 49);
    doc.text(`Total Paid: ₹${receipt.amount}`, 14, 56);
    doc.text(`Payment Method: ${receipt.method}`, 14, 63);
    doc.text(`Date: ${receipt.date}`, 14, 70);

    doc.text("Items:", 14, 82);
    let y = 90;
    receipt.items.forEach(i => {
      doc.text(`${i.name}  x${i.qty}  — ₹${i.price}`, 20, y);
      y += 6;
    });

    doc.save(`receipt_${receipt.orderId}.pdf`);
  }).catch(() => alert("Install jsPDF to enable PDF download"));
};

const saveReceipt = (order) => {
  const newReceipt = {
    orderId: order.orderId,
    customer: order.customer,
    phone: order.phone,
    amount: order.amount,
    method: order.method,
    date: new Date().toLocaleString(),
    items: order.items // [{name, qty, price}]
  };

  let stored = JSON.parse(localStorage.getItem("orderReceipts")) || [];
  stored.push(newReceipt);
  localStorage.setItem("orderReceipts", JSON.stringify(stored));
};

  const [showPasscodePopup, setShowPasscodePopup] = useState(false);
  const [passcode, setPasscode] = useState(localStorage.getItem("appPasscode") || "");
  const [inputPasscode, setInputPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState(null);

  const [gender, setGender] = useState(localStorage.getItem("gender") || "");
  const [birthday, setBirthday] = useState(localStorage.getItem("birthday") || "");
  const [showBirthdayPopup, setShowBirthdayPopup] = useState(false);
  const [showGenderPopup, setShowGenderPopup] = useState(false);

useEffect(() => {
  if (passcodeMessage) {
    const timer = setTimeout(() => setPasscodeMessage(null), 3000);
    return () => clearTimeout(timer);
  }
}, [passcodeMessage]);

  useEffect(() => {
  const currentDevice = {
    id: new Date().getTime() % 100, // 00–99 range
    name: navigator.userAgent.includes("Android") ? "📱 Android Phone"
          : navigator.userAgent.includes("iPhone") ? "🍎 iPhone"
          : navigator.userAgent.includes("Windows") ? "💻 Windows PC"
          : "📟 Other Device",
    loginTime: new Date().toLocaleString(),
    activeNow: true,
  };

  // Reset "activeNow" for all first
  let stored = JSON.parse(localStorage.getItem("loggedDevices")) || [];
  stored = stored.map(d => ({ ...d, activeNow: false }));

  // Check if already exists
  if (!stored.find(d => d.name === currentDevice.name)) {
    stored.push(currentDevice);
  } else {
    // Update login time if same device logs again
    stored = stored.map(d =>
      d.name === currentDevice.name ? { ...d, loginTime: currentDevice.loginTime, activeNow: true } : d
    );
  }

  localStorage.setItem("loggedDevices", JSON.stringify(stored));
  setDevices(stored);
}, []);

const logoutDevice = (deviceId) => {
  const updated = devices.filter(d => d.id !== deviceId);
  localStorage.setItem("loggedDevices", JSON.stringify(updated));
  setDevices(updated);
};

  useEffect(() => {
  const isLocked = localStorage.getItem("appLock") === "true";
  const savedPasscode = localStorage.getItem("appPasscode");
  if (isLocked && savedPasscode) {
    setShowPasscodePopup(true); // always ask when opening if lock is active
  }
}, []);

  useEffect(() => {
  localStorage.setItem("gender", gender);
  localStorage.setItem("birthday", birthday);
}, [gender, birthday]);

  // New helper function to save toggle changes locally and via API
const updateSetting = async (key, value) => {
  // Update localStorage
  localStorage.setItem(key, value.toString());

  // Placeholder API call
  try {
    // Replace URL with your backend endpoint
    const response = await fetch("https://your-backend.com/api/updateSettings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "Authorization": "Bearer YOUR_TOKEN" // if required
      },
      body: JSON.stringify({
        key: key,
        value: value,
        userId: localStorage.getItem("userId") || "demoUser"
      }),
    });

    const data = await response.json();
    console.log("API response:", data);
  } catch (err) {
    console.error("API call failed:", err);
  }
};

// Updated handleToggle
const handleToggle = (key, currentValue, setter) => {
  const newValue = !currentValue;
  setter(newValue);

  // Save locally + API
  updateSetting(key, newValue);

  // Optional frontend debug logs
  switch (key) {
    case "notifications":
      console.log("Push / Email / SMS toggled:", newValue);
      break;
    case "orderUpdates":
      console.log("Order Updates toggled:", newValue);
      break;
    case "rewardAlerts":
      console.log("Rewards Notifications toggled:", newValue);
      break;
    case "promoNotifications":
      console.log("Promotions & Offers toggled:", newValue);
      break;
    case "appUpdates":
      console.log("App Updates / News toggled:", newValue);
      break;
    default:
      break;
  }
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
            <AnimatedButton onClick={() => navigate("/profile")}><User className="inline mr-2 text-black" /> Edit Profile</AnimatedButton>
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
             <Gift className="inline mr-2 text-black" /> Reward Points / Loyalty Program
            </AnimatedButton>
            <AnimatedButton onClick={() => setShowSubPopup(true)}>
            <Crown className="inline mr-2 text-black" /> Subscription Management
             </AnimatedButton>
              <AnimatedButton onClick={() => navigate("/referafriend")}>
             <Link className="inline mr-2 text-black" /> Referral Program
            </AnimatedButton>
          </div>
        </div>

        {/* 3. Security & Privacy */}
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <Lock className="text-orange-500" />
            <h2 className="text-lg font-semibold">Security & Privacy</h2>
          </div>
      
  <AnimatedButton onClick={() => setShowAppLockPopup(true)} className="mt-3">
  <Lock className="inline mr-2 text-black" /> Enable App Lock
</AnimatedButton>

  <div className="bg-orange-50 rounded-2xl shadow-lg p-5">
  <div className="flex items-center gap-2 mb-3">
   <Smartphone className="inline mr-2 text-black" />
    <h2 className="text-lg font-semibold">Login Activity / Devices</h2>
  </div>

  <div className="space-y-3">
    {devices.length === 0 && (
      <p className="text-xs text-gray-500">No devices logged in.</p>
    )}

    {devices.map(device => (
      <div key={device.id} className="flex justify-between items-center bg-orange-100 px-3 py-2 rounded-xl shadow">
        <div>
          <p className="text-sm font-semibold">{device.name}</p>
          <p className="text-xs text-gray-500">
            {device.loginTime} {device.activeNow && "🟢 Active now"}
          </p>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => logoutDevice(device.id)}
          className="text-red-500 text-xs font-semibold"
        >
          Logout
        </motion.button>
      </div>
    ))}
  </div>
</div>
        </div>

        {/* 4. Payment & Billing */}
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="text-orange-500" />
            <h2 className="text-lg font-semibold">Payment & Billing</h2>
          </div>
          <div className="space-y-3">
            <AnimatedButton onClick={() => setShowPayPopup(true)}>
  <Banknote className="inline mr-2 text-black" /> Manage Payment Methods
   <div className="space-y-3"></div>
  {selectedPay && (
    <span className="text-orange-500 font-bold text-sm ml-2">
      ({selectedPay === "COD" ? "💵 COD" : selectedPay})
    </span>
  )}
</AnimatedButton>
  <div className="bg-orange-50 rounded-2xl shadow-lg p-5">
  <div className="flex items-center gap-2 mb-3">
   <Receipt className="inline mr-2 text-black" />
    <h2 className="text-lg font-semibold">Payment History / Receipts</h2>
  </div>

  <div className="space-y-3">
    {receipts.length === 0 && (
      <p className="text-xs text-gray-500">No receipts saved yet.</p>
    )}

    {receipts.map(receipt => (
      <div key={receipt.orderId} className="bg-orange-50 px-4 py-3 rounded-xl shadow">
        <p className="text-sm font-semibold">{receipt.customer}</p>
        <p className="text-xs text-gray-500">{receipt.date}</p>
        <p className="text-xs">₹{receipt.amount} • {receipt.method}</p>

        <div className="mt-2 flex gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => downloadReceiptPDF(receipt)}
            className="bg-orange-500 text-white px-3 py-1 rounded-lg text-xs font-semibold w-full"
          >
            Download PDF
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const updated = receipts.filter(r => r.orderId !== receipt.orderId);
              localStorage.setItem("orderReceipts", JSON.stringify(updated));
              setReceipts(updated);
            }}
            className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-semibold w-full"
          >
            Delete
          </motion.button>
        </div>
      </div>
    ))}
  </div>
</div>
        </div>
        </div>

{/* 5. Notifications */}
<div className="bg-white rounded-2xl shadow-lg p-5">
  <div className="flex items-center gap-2 mb-3">
    <Bell className="text-orange-500" />
    <h2 className="text-lg font-semibold">Notifications</h2>
  </div>
  <div className="space-y-3">
    <ToggleSwitch
      label={<><Bell className="inline mr-2 text-black" /> Push / Email / SMS</>}
      value={notifications}
      setter={(val) => handleToggle("notifications", notifications, setNotifications)}
    />
    <ToggleSwitch
      label={<><Package className="inline mr-2 text-black" /> Order Updates</>}
      value={orderUpdates}
      setter={(val) => handleToggle("orderUpdates", orderUpdates, setOrderUpdates)}
    />
    <ToggleSwitch
      label={<><Gift className="inline mr-2 text-black" /> Rewards Notifications</>}
      value={rewardAlerts}
      setter={(val) => handleToggle("rewardAlerts", rewardAlerts, setRewardAlerts)}
    />
    <ToggleSwitch
      label={<><Flame className="inline mr-2 text-black" /> Offers / Promotions</>}
      value={promoNotifications}
      setter={(val) => handleToggle("promoNotifications", promoNotifications, setPromoNotifications)}
    />
    <ToggleSwitch
      label={<><Rss className="inline mr-2 text-black" /> App Updates / News</>}
      value={appUpdates}
      setter={(val) => handleToggle("appUpdates", appUpdates, setAppUpdates)}
    />
  </div>
</div>

        {/* 6. App Preferences */}
<div className="bg-white rounded-2xl shadow-lg p-5">
  <div className="flex items-center gap-2 mb-3">
    <Moon className="text-orange-500" />
    <h2 className="text-lg font-semibold">App Preferences</h2>
  </div>
  <div className="space-y-3">
    <AnimatedButton onClick={() => setShowDarkModePopup(true)}>
     <Moon className="inline mr-2 text-black-500" /> Dark Mode
    </AnimatedButton>
    <AnimatedButton onClick={() => setShowLanguagePopup(true)}>
   <Globe className="inline mr-2 text-black" /> Language Settings
    </AnimatedButton>
   <div className="space-y-3">
<SoundModeSelector />
</div>
  </div>
</div>

        {/* 7. Help & Support */}
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="text-orange-500" />
            <h2 className="text-lg font-semibold">Help & Support</h2>
          </div>
          <div className="space-y-3">
          <AnimatedButton onClick={() => navigate("/faq")}>
            <CircleHelp className="inline mr-2 text-black" />FAQ</AnimatedButton>
          <AnimatedButton onClick={() => navigate("/support-bot")}>
             <MessageCircle className="inline mr-2 text-black-500"/> Support Bot
          </AnimatedButton>
          <AnimatedButton onClick={openAppStore}>
            <Star className="inline mr-2 text-black" /> Rate Us / Feedback
          </AnimatedButton>
         <AnimatedButton onClick={() => setShowBugPopup(true)}>
            <AlertCircle className="inline mr-2 text-black" /> Report a Bug
          </AnimatedButton>
         <AnimatedButton onClick={() => setShowContactPopup(true)}>
            <Headset className="inline mr-2 text-black" /> Contact Support</AnimatedButton>
          </div>
        </div>

        {/* 8. About */}
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <Info className="text-orange-500" />
            <h2 className="text-lg font-semibold">About</h2>
          </div>
          <div className="space-y-3">
          <AnimatedButton onClick={() => setShowVersionPopup(true)}>
            <Smartphone className="inline mr-2 text-black" /> Version Info
          </AnimatedButton>
          <AnimatedButton onClick={() => navigate("/terms")}>
            <FileText className="inline mr-2 text-black" /> Terms & Conditions
          </AnimatedButton>
          <AnimatedButton onClick={() => navigate("/privacy")}>
            <Lock className="inline mr-2 text-black" /> Privacy Policy
          </AnimatedButton>
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
{/* Subscription Coming Soon Popup */}
{showSubPopup && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-5"
    >
      <h2 className="text-xl font-bold text-orange-500 text-center mb-2">
        🎁 Subscription Management
      </h2>
      <p className="text-sm text-gray-600 text-center mb-4">
        This feature is under development.<br/>
        Stay tuned for exciting updates! 🎁🎉
      </p>

      <div className="flex justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-t-orange-500 border-gray-200 rounded-full"></div>
      </div>

      <p className="text-xs text-gray-500 text-center mt-3">
        Coming Soon • Premium Feature
      </p>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowSubPopup(false)}
        className="mt-4 w-full py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 font-semibold"
      >
        Close
      </motion.button>
    </motion.div>
  </motion.div>
)}

{showAppLockPopup && (
  <ComingSoonPopup
    title="App Lock / Passcode"
    icon="🔐"
    onClose={() => setShowAppLockPopup(false)}
  />
)}

{showContactPopup && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
  >
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.85, opacity: 0 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-5 space-y-3"
    >
      <h2 className="text-xl font-bold text-orange-500 text-center">📞 Support</h2>

      <div className="bg-orange-50 p-3 rounded-xl text-sm">
        <p><span className="font-semibold">Helpline:</span> <span className="text-orange-500 font-bold">+91 7264850230</span></p>
        <p><span className="font-semibold">Support Email:</span> <span className="text-orange-500 font-bold">zatpatt@gmail.com</span></p>
      </div>

      <p className="text-xs text-gray-600 text-center">24/7 Support • Fast Resolution</p>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowContactPopup(false)}
        className="w-full py-2 bg-red-50 text-red-600 rounded-xl font-semibold border border-red-200 hover:bg-red-100"
      >
        Close
      </motion.button>
    </motion.div>
  </motion.div>
)}

{showBugPopup && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4"
    >
      <h2 className="text-xl font-bold text-orange-500 text-center mb-2">
        🐞 Report a Bug
      </h2>
      <p className="text-sm text-gray-600 text-center mb-4">
        Describe any technical issue or suspicious behavior you noticed.
      </p>

      {/* Error / Success Messages */}
      {bugError && <p className="text-xs text-red-600 text-left">{bugError}</p>}
      {bugSuccess && <p className="text-xs text-green-600 text-left">{bugSuccess}</p>}

      {/* Bug Form */}
      <input
        type="text"
        placeholder="Title"
        value={bugTitle}
        onChange={(e) => setBugTitle(e.target.value)}
        className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
      <textarea
        placeholder="Describe the issue in detail..."
        value={bugDescription}
        onChange={(e) => setBugDescription(e.target.value)}
        className="w-full border border-gray-300 rounded-xl px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
      />

      <div className="flex gap-3 mt-2">
        <button
          onClick={() => {
            setShowBugPopup(false);
            setBugTitle("");
            setBugDescription("");
            setBugError(null);
            setBugSuccess(null);
          }}
          className="w-1/2 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 font-semibold"
        >
          Cancel
        </button>

        <button
          onClick={async () => {
            if (!bugTitle.trim() || !bugDescription.trim()) {
              setBugError("Please fill in both title and description!");
              return;
            }

            try {
              // Replace with your actual backend endpoint
              const res = await fetch("https://your-backend.com/api/reportBug", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  userId: localStorage.getItem("userId") || "demoUser",
                  title: bugTitle,
                  description: bugDescription,
                  timestamp: new Date().toISOString()
                }),
              });

              if (res.ok) {
                setBugSuccess("✅ Bug report submitted successfully!");
                setBugTitle("");
                setBugDescription("");
              } else {
                setBugError("Failed to submit. Try again later.");
              }
            } catch (err) {
              console.error(err);
              setBugError("Network error. Please try again.");
            }
          }}
          className="w-1/2 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 font-semibold"
        >
          Submit
        </button>
      </div>
    </motion.div>
  </motion.div>
)}

{showVersionPopup && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-5 text-center"
    >
      <h2 className="text-xl font-bold text-orange-500 mb-2">📱 App Version</h2>
      <p className="text-gray-700 text-sm mb-4">Current version: <span className="font-semibold">1.0.0</span></p>
      <p className="text-xs text-gray-500 mb-4">Release date: 29-Nov-2025</p>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowVersionPopup(false)}
        className="w-full py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 font-semibold"
      >
        Close
      </motion.button>
    </motion.div>
  </motion.div>
)}

{/* Payment Method Popup */}
{showPayPopup && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
  >
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.85, opacity: 0 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-5"
    >
      <h2 className="text-xl font-bold text-orange-500 text-center mb-3">
        💳 Select Payment Method
      </h2>

      <div className="space-y-3">

        {/* COD Option (Only Clickable) */}
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => {
            setSelectedPay("COD");
            localStorage.setItem("paymentMethod", "COD");
            setShowPayPopup(false);
          }}
          className={`w-full py-2 rounded-xl font-semibold flex justify-center items-center gap-2 shadow ${
            selectedPay === "COD"
              ? "bg-orange-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-orange-100 border border-orange-300"
          }`}
        >
          💵 Cash on Delivery (COD)
        </motion.button>

        {/* Other Disabled Options */}
        <motion.button
          whileTap={{ scale: 0.94 }}
          className="w-full py-2 rounded-xl font-semibold bg-gray-200 text-gray-500 shadow cursor-not-allowed flex justify-center items-center gap-2"
        >
          📲 UPI Payment
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.94 }}
          className="w-full py-2 rounded-xl font-semibold bg-gray-200 text-gray-500 shadow cursor-not-allowed flex justify-center items-center gap-2"
        >
          💳 Card Payment
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.94 }}
          className="w-full py-2 rounded-xl font-semibold bg-gray-200 text-gray-500 shadow cursor-not-allowed flex justify-center items-center gap-2"
        >
          👛 Wallet
        </motion.button>

      </div>

      <p className="text-xs text-gray-500 text-center mt-4">Premium payments coming soon… 🚀</p>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowPayPopup(false)}
        className="mt-4 w-full py-2 bg-red-50 text-red-600 rounded-xl font-semibold border border-red-200 hover:bg-red-100"
      >
        Close
      </motion.button>
    </motion.div>
  </motion.div>
)}
{/* Dark Mode Coming Soon Popup */}
{showDarkModePopup && (
  <ComingSoonPopup
    title="Dark Mode"
    icon="🌙"
    onClose={() => setShowDarkModePopup(false)}
  />
)}

{/* Language Settings Coming Soon Popup */}
{showLanguagePopup && (
  <ComingSoonPopup
    title="Language Settings"
    icon="🌐"
    onClose={() => setShowLanguagePopup(false)}
  />
)}
  </div>
  );
}
