// ✅ src/pages/OrderTrackingPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, MessageCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default Leaflet marker
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function OrderTrackingPage() {
  const navigate = useNavigate();
  const mapRef = useRef();

  const [order, setOrder] = useState(null);
  const [statusIndex, setStatusIndex] = useState(0);
  const [countdown, setCountdown] = useState(2700);
  const [storeLocation, setStoreLocation] = useState([28.6139, 77.209]);
  const [deliveryOtp, setDeliveryOtp] = useState("");

  // smooth curve animation route (200+ small points)
  const [smoothRoute, setSmoothRoute] = useState([]);
  const [deliveryLocation, setDeliveryLocation] = useState([28.6139, 77.209]);
  const [bikeRotation, setBikeRotation] = useState(0);

  const statuses = [
    "Merchant Accepted",
    "Preparing",
    "Picked Up",
    "On the Way",
    "Delivered",
  ];

  const statusIcons = {
    "Merchant Accepted": "https://cdn-icons-png.flaticon.com/512/190/190411.png",
    "Preparing": "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
    "Picked Up": "https://cdn-icons-png.flaticon.com/512/2933/2933182.png",
    "On the Way": "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    "Delivered": "https://cdn-icons-png.flaticon.com/512/190/190411.png",
  };

  // ❗ Original route - will convert this to many small curve points
  const route = [
    [28.6139, 77.2090],
    [28.6145, 77.2094],
    [28.6150, 77.2102],
    [28.6157, 77.2109],
    [28.6163, 77.2116],
    [28.6170, 77.2122],
  ];

  // 📌 Helper: convert big route into many small smooth points
  const generateSmoothPoints = (points, total = 300) => {
    let smoothPoints = [];
    for (let i = 0; i < points.length - 1; i++) {
      const [lat1, lng1] = points[i];
      const [lat2, lng2] = points[i + 1];
      for (let j = 0; j < total / (points.length - 1); j++) {
        const t = j / (total / (points.length - 1));
        const lat = lat1 + (lat2 - lat1) * t;
        const lng = lng1 + (lng2 - lng1) * t;
        smoothPoints.push([lat, lng]);
      }
    }
    smoothPoints.push(points[points.length - 1]); // last point
    return smoothPoints;
  };

  // 🚲 Rotating bike icon using divIcon (best for smooth rotation)
  const createBikeIcon = (rotation = 0) =>
  L.divIcon({
    html: `
      <img 
        src="/assets/delivery-bike-orange.png" 
        style="width:70px;height:40px;transform:rotate(${rotation}deg);" 
      />`,
    iconSize: [70, 40],
    iconAnchor: [35, 10], // ✅ 35px right (front center), 10px down from top = front side now leads
    className: "",
  });
  
useEffect(() => {
  if (mapRef.current && statusIndex >= 2) {
    mapRef.current.setView(deliveryLocation, 15, { animate: true });
  }
}, [deliveryLocation]);

  // --- Load order, store location, OTP, status ---
  useEffect(() => {
    const savedOrder = JSON.parse(localStorage.getItem("currentOrder"));
    if (!savedOrder) {
      navigate("/home");
      return;
    }
    setOrder(savedOrder);

    const orderId = savedOrder.id;

    const merchantLoc = JSON.parse(localStorage.getItem("merchantLocation"));
    if (merchantLoc) setStoreLocation(merchantLoc);

    let savedOtp = localStorage.getItem(`ORDER_${orderId}_OTP`);
    if (!savedOtp) {
      savedOtp = String(Math.floor(1000 + Math.random() * 9000));
      localStorage.setItem(`ORDER_${orderId}_OTP`, savedOtp);
    }
    setDeliveryOtp(savedOtp);

    const savedStatus = Number(localStorage.getItem(`ORDER_${orderId}_STATUS`)) || 0;
    setStatusIndex(savedStatus);

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // --- conversion to smooth curve path ONCE ---
  useEffect(() => {
    const sp = generateSmoothPoints(route, 300);
    setSmoothRoute(sp);
    setDeliveryLocation(sp[0]); // start point
  }, []);

  // --- Auto-progress status ---
  useEffect(() => {
    if (!order) return;
    const orderId = order.id;

    const interval = setInterval(() => {
      setStatusIndex((prev) => {
        const next = prev < statuses.length - 1 ? prev + 1 : prev;
        localStorage.setItem(`ORDER_${orderId}_STATUS`, next);
        if (next === statuses.length - 1) {
          setTimeout(() => navigate("/after-delivery"), 1000);
        }
        return next;
      });
    }, 15000);

    return () => clearInterval(interval);
  }, [order]);

  // --- Animate bike on smooth curve points ---
  useEffect(() => {
  if (statusIndex < 2 || smoothRoute.length === 0) return;

  let index = 0;
  const moveBike = () => {
    if (index >= smoothRoute.length - 1) return;
    const [lat1, lng1] = smoothRoute[index];
    const [lat2, lng2] = smoothRoute[index + 1];

    setDeliveryLocation([lat2, lng2]);

    // ✅ rotation based on next tiny point
    const angle = Math.atan2(lat2 - lat1, lng2 - lng1) * 180 / Math.PI;
    setBikeRotation(angle);

    index++;
    requestAnimationFrame(moveBike);
  };

  requestAnimationFrame(moveBike);
}, [statusIndex, smoothRoute]);

  const canCancel = statusIndex === 0;
  const handleCancel = () => {
    if (!canCancel) return;
    if (window.confirm("Are you sure you want to cancel the order?")) {
      if (order) {
        localStorage.removeItem(`ORDER_${order.id}_OTP`);
        localStorage.removeItem(`ORDER_${order.id}_STATUS`);
      }
      localStorage.removeItem("currentOrder");
      navigate("/home");
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const calculateETA = () => {
    const remaining = smoothRoute.length - 1;
    return remaining > 0 ? remaining * 2 : 0;
  };

  if (!order) return null;

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

          {/* store location before delivery starts */}
          {statusIndex < 3 && (
            <Marker position={storeLocation}>
              <Popup>Store Location</Popup>
            </Marker>
          )}

          {/* animated bike marker */}
          {statusIndex >= 3 && (
            <Marker position={deliveryLocation} icon={createBikeIcon(bikeRotation)}>
              <Popup>Delivery Person Here</Popup>
            </Marker>
          )}

          {/* show full smooth route */}
          <Polyline positions={smoothRoute} />
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
                <img src={statusIcons[status]} alt={status} className="w-5 h-5" />
              </motion.div>
              <span
                className={`font-semibold ${
                  idx <= statusIndex ? "text-green-500" : "text-gray-500"
                }`}
              >
                {status}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 text-gray-500 font-semibold">
          Estimated Delivery Time: {formatTime(calculateETA())}
        </div>
      </div>

      {/* Delivery OTP */}
      <div className="bg-white shadow-md rounded-2xl m-4 p-5 text-center">
        <h2 className="font-bold text-lg mb-2">Delivery OTP</h2>
        <p className="text-orange-500 text-2xl font-bold tracking-widest">
          {deliveryOtp}
        </p>
        <p className="text-gray-500 text-sm mt-1">
          Give this OTP to your delivery partner
        </p>
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
          className={`w-full border py-2 rounded-xl font-bold shadow mt-2 transition ${
            canCancel
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
