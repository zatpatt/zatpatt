// ✅ src/pages/OrderTrackingPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, MessageCircle, ArrowLeft, Check } from "lucide-react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function OrderTrackingPage() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [statusIndex, setStatusIndex] = useState(0);
  const [countdown, setCountdown] = useState(2700);
  const [deliveryLocation, setDeliveryLocation] = useState([28.6139, 77.209]); // merchant start
  const mapRef = useRef();
const [deliveryOtp, setDeliveryOtp] = useState("");

useEffect(() => {
  const savedOrder = localStorage.getItem("currentOrder");
  if (!savedOrder) {
    navigate("/home");
    return;
  }
  setOrder(JSON.parse(savedOrder));

  // Generate 4-digit random OTP
  setDeliveryOtp(String(Math.floor(1000 + Math.random() * 9000)));

  // ...existing code for status, countdown, animation
}, []);

const statusIcons = {
  "Merchant Accepted": "https://cdn-icons-png.flaticon.com/512/190/190411.png", // example
  "Preparing": "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
  "Picked Up": "https://cdn-icons-png.flaticon.com/512/2933/2933182.png",
  "On the Way": "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  "Delivered": "https://cdn-icons-png.flaticon.com/512/190/190411.png",
};

useEffect(() => {
  if (deliveryOtp) localStorage.setItem("CURRENT_ORDER_OTP", deliveryOtp);
}, [deliveryOtp]);

  const statuses = [
    "Merchant Accepted",
    "Preparing",
    "Picked Up",
    "On the Way",
    "Delivered",
  ];

  // Mock route coordinates
  const route = [
    [28.6139, 77.2090],
    [28.6145, 77.2095],
    [28.6150, 77.2100],
    [28.6155, 77.2105],
    [28.6160, 77.2110],
  ];

  useEffect(() => {
    const savedOrder = localStorage.getItem("currentOrder");
    if (!savedOrder) {
      navigate("/home");
      return;
    }
    setOrder(JSON.parse(savedOrder));

    // Auto progress order status
    const interval = setInterval(() => {
      setStatusIndex((prev) => {
        const next = prev < statuses.length - 1 ? prev + 1 : prev;

        // Redirect to AfterDeliveryPage when Delivered
        if (next === statuses.length - 1) {
          setTimeout(() => navigate("/after-delivery"), 1000); // small delay for animation
        }

        return next;
      });
    }, 15000);

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Smooth marker animation
    let currentIndex = 0;
    let nextIndex = 1;
    let progress = 0;
    const speed = 0.002;

    const animateMarker = () => {
      if (currentIndex >= route.length - 1) return;

      const [lat1, lng1] = route[currentIndex];
      const [lat2, lng2] = route[nextIndex];

      const newLat = lat1 + (lat2 - lat1) * progress;
      const newLng = lng1 + (lng2 - lng1) * progress;
      setDeliveryLocation([newLat, newLng]);

      progress += speed;
      if (progress >= 1) {
        progress = 0;
        currentIndex++;
        nextIndex = currentIndex + 1 < route.length ? currentIndex + 1 : currentIndex;
      }

      requestAnimationFrame(animateMarker);
    };
    requestAnimationFrame(animateMarker);

    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, []);

  if (!order) return null;

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Cancel allowed only if merchant hasn't accepted yet
  const canCancel = statusIndex === 0;

  const handleCancel = () => {
    if (!canCancel) return;
    if (window.confirm("Are you sure you want to cancel the order?")) {
      localStorage.removeItem("currentOrder");
      navigate("/home");
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col">
      {/* Header */}
      <header className="bg-orange-500 text-white py-4 px-6 flex items-center shadow">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-white text-orange-500 mr-4 hover:bg-gray-100 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">🚚 Track Your Order</h1>
      </header>

      {/* Map */}
      <div className="m-4 rounded-2xl overflow-hidden shadow-md h-64">
        <MapContainer
          center={deliveryLocation}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
          whenCreated={(map) => (mapRef.current = map)}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <Marker position={deliveryLocation}>
            <Popup>Delivery Person Here</Popup>
          </Marker>
          <Polyline positions={route} color="orange" />
        </MapContainer>
      </div>

      {/* Order Progress */}
      <div className="bg-white shadow-md rounded-2xl m-4 p-5">
        <h2 className="font-bold text-lg mb-3">Order Progress</h2>
        <div className="relative flex flex-col gap-4 pl-8">
          <div className="absolute top-3 left-5 w-1 h-full bg-gray-300 rounded"></div>
          {statuses.map((status, idx) => (
            <div key={status} className="flex items-center gap-3 relative z-10">
              <motion.div
  className="w-10 h-10 rounded-full flex items-center justify-center border-2"
  initial={{ scale: 0 }}
  animate={{ scale: idx <= statusIndex ? 1 : 0.8 }}
  transition={{ type: "spring", stiffness: 500, damping: 30 }}
  style={{
    borderColor: idx <= statusIndex ? "#16a34a" : "#d1d5db",
    backgroundColor: idx <= statusIndex ? "#16a34a" : "#fff",
  }}
>
  <img
    src={statusIcons[status]}
    alt={status}
    className="w-5 h-5"
  />
</motion.div>
              <span
                className={`font-semibold ${idx <= statusIndex ? "text-green-500" : "text-gray-500"}`}
              >
                {status}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 text-gray-500 font-semibold">
          Estimated Delivery Time: {formatTime(countdown)}
        </div>
      </div>

{/* Delivery OTP */}
<div className="bg-white shadow-md rounded-2xl m-4 p-5 text-center">
  <h2 className="font-bold text-lg mb-2">Delivery OTP</h2>
  <p className="text-orange-500 text-2xl font-bold tracking-widest">{deliveryOtp}</p>
  <p className="text-gray-500 text-sm mt-1">Give this OTP to your delivery partner</p>
</div>

      {/* Contact & Actions */}
      <div className="bg-white shadow-md rounded-2xl m-4 p-5 flex flex-col gap-3">
        <h2 className="font-bold text-lg mb-2">Need Help?</h2>
        <div className="flex gap-3">
          <button className="flex-1 bg-orange-500 text-white py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-orange-600 transition">
            <Phone className="w-5 h-5" /> Call
          </button>
          <button className="flex-1 bg-orange-500 text-white py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-orange-600 transition">
            <MessageCircle className="w-5 h-5" /> Chat
          </button>
        </div>
        <button
          onClick={handleCancel}
          disabled={!canCancel}
          className={`w-full border py-2 rounded-xl font-bold shadow mt-2 transition
            ${canCancel
              ? "bg-white border-red-500 text-red-500 hover:bg-red-50"
              : "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
            }`}
        >
          Cancel Order
        </button>
      </div>
    </div>
  );
}
