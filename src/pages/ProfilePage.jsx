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
  Heart,
  Star,
  } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFavorites } from "../context/FavoritesContext";
import { MapPin } from "lucide-react";


/**
 ProfilePage with enhanced Recent Orders:
 - show 3 recent orders on profile
 - "View More Orders" opens modal with search/filter/sort
 - clicking an order opens Order Details modal
 - Live Tracking button navigates to /order-tracking/:id if not delivered
 - If delivered, shows Delivered + Rate & Review button
 - Review once submitted disables review button (persisted)
 - Orders saved in localStorage under key: "user_orders"
*/

const ORDERS_KEY = "user_orders";

function sampleOrders() {
  // sample order data (if none in localStorage)
  return [
    {
      id: "ORD-20251106-001",
      store: "Spicy Hub",
      date: "2025-11-06T18:23:00Z",
      amount: 220,
      items: [{ name: "Butter Chicken", qty: 1 }, { name: "Naan", qty: 2 }],
      status: "delivered", // pending | preparing | out_for_delivery | delivered | cancelled
      delivery: {
        trackingId: "TRK-1001",
        etaMins: 12,
      },
      rated: false,
      rating: null,
      review: "",
    },
    {
      id: "ORD-20251105-003",
      store: "Sweet Treats",
      date: "2025-11-05T13:11:00Z",
      amount: 180,
      items: [{ name: "Cupcake Box", qty: 1 }],
      status: "out_for_delivery",
      delivery: {
        trackingId: "TRK-1000",
        etaMins: 6,
      },
      rated: false,
      rating: null,
      review: "",
    },
    {
      id: "ORD-20251104-007",
      store: "Vasind Katta",
      date: "2025-11-04T20:30:00Z",
      amount: 200,
      items: [{ name: "Thali", qty: 1 }],
      status: "preparing",
      delivery: {
        trackingId: "TRK-0998",
        etaMins: 20,
      },
      rated: false,
      rating: null,
      review: "",
    },
    {
      id: "ORD-20251103-002",
      store: "Mitra A Biryani",
      date: "2025-11-03T19:15:00Z",
      amount: 160,
      items: [{ name: "Biryani", qty: 1 }],
      status: "delivered",
      delivery: {
        trackingId: "TRK-0997",
        etaMins: 0,
      },
      rated: true,
      rating: 5,
      review: "Delicious!",
    },
    {
      id: "ORD-20251101-009",
      store: "Velvet Scoops",
      date: "2025-11-01T14:10:00Z",
      amount: 120,
      items: [{ name: "Ice Cream", qty: 2 }],
      status: "cancelled",
      delivery: {
        trackingId: "TRK-0990",
        etaMins: 0,
      },
      rated: false,
      rating: null,
      review: "",
    },
  ];
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // basic profile state (kept from your earlier code)
  const [email, setEmail] = useState(localStorage.getItem("userEmail") || "");
  const [phone] = useState(localStorage.getItem("userPhone") || "");
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");
  const [tempName, setTempName] = useState(userName);
  const [tempEmail, setTempEmail] = useState(email);
  const [profileImage, setProfileImage] = useState(localStorage.getItem("profileImage") || null);
  const [editing, setEditing] = useState(false);
  const [totalPoints, setTotalPoints] = useState(
    parseInt(localStorage.getItem("SpinAndWin_totalPoints") || "120", 10)
  );

  // Favorites + savedLater (kept)
  const { favorites, removeFavorite } = useFavorites();
  const [savedLater, setSavedLater] = useState(JSON.parse(localStorage.getItem("savedForLater") || "[]"));

  useEffect(() => {
    localStorage.setItem("savedForLater", JSON.stringify(savedLater));
  }, [savedLater]);

  // Orders state: load from localStorage or seed samples
  const [orders, setOrders] = useState(() => {
    try {
      const raw = localStorage.getItem(ORDERS_KEY);
      if (!raw) {
        const seed = sampleOrders();
        localStorage.setItem(ORDERS_KEY, JSON.stringify(seed));
        return seed;
      }
      return JSON.parse(raw);
    } catch (e) {
      const seed = sampleOrders();
      localStorage.setItem(ORDERS_KEY, JSON.stringify(seed));
      return seed;
    }
  });

  // persist orders
  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders]);

  // show either 3 recent or all in modal
  const [showAllOrdersModal, setShowAllOrdersModal] = useState(false);

  // order details modal
  const [selectedOrder, setSelectedOrder] = useState(null);

  // review box state
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  // list modal controls: search, filter, sort
  const [searchQ, setSearchQ] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all | pending | preparing | out_for_delivery | delivered | cancelled
  const [sortKey, setSortKey] = useState("date_desc"); // date_desc, date_asc, amount_desc, amount_asc

  // keep profile persistence (small)
  useEffect(() => {
    localStorage.setItem("userName", userName);
  }, [userName]);
  useEffect(() => {
    localStorage.setItem("userEmail", email);
  }, [email]);
  useEffect(() => {
    if (profileImage) localStorage.setItem("profileImage", profileImage);
  }, [profileImage]);

  // listen to points updates across app
  useEffect(() => {
    const handler = () => {
      const pts = parseInt(localStorage.getItem("SpinAndWin_totalPoints") || "0", 10);
      setTotalPoints(pts);
    };
    window.addEventListener("pointsUpdated", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("pointsUpdated", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  // utility: get ordered list by date desc
  const sortedByDateDesc = (list) =>
    [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // ----- Recent orders preview (3 most recent) -----
  const recentThree = sortedByDateDesc(orders).slice(0, 3);

  // ----- View / open order detail -----
  const openOrder = (order) => {
    setSelectedOrder(order);
    setReviewText(order.review || "");
    setReviewRating(order.rating || 5);
  };

  // navigate to order tracking page if allowed
  const goToTracking = (order) => {
    if (!order) return;
    // Only allow tracking if not delivered or cancelled
    if (order.status === "delivered" || order.status === "cancelled") {
      // nothing to do
      return;
    }
    // navigate to order-tracking page with order id (you should implement route)
    navigate(`/order-tracking/${encodeURIComponent(order.id)}`, { state: { order } });
  };

  // submit review and mark order.rated true
  const submitReview = (orderId) => {
    if (!orderId) return;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              rated: true,
              rating: reviewRating,
              review: reviewText.trim(),
            }
          : o
      )
    );
    // close details modal after review
    setSelectedOrder(null);

    // Optional: add points for rating (2 points per rules)
    const pointsKey = "SpinAndWin_totalPoints";
    const curPts = parseInt(localStorage.getItem(pointsKey) || "0", 10);
    const newPts = curPts + 2; // reward for rating
    localStorage.setItem(pointsKey, newPts.toString());
    window.dispatchEvent(new Event("pointsUpdated"));
  };

  // remove saved later helper
  const removeSavedLater = (id) => {
    const updated = savedLater.filter((item) => item.id !== id);
    setSavedLater(updated);
    localStorage.setItem("savedForLater", JSON.stringify(updated));
  };

 const addSavedToCart = (item) => {
  const cart = JSON.parse(localStorage.getItem("cartItems") || "[]");

  // Add to cart (qty 1 if not exists)
  cart.push({ ...item, qty: 1 });

  localStorage.setItem("cartItems", JSON.stringify(cart));

  // Remove from saved list
  const updated = savedLater.filter((s) => s.id !== item.id);
  setSavedLater(updated);
  localStorage.setItem("savedForLater", JSON.stringify(updated));

  window.dispatchEvent(new Event("storage"));
};

  // search / filter / sort logic for modal
  const filteredSortedOrders = () => {
    let list = [...orders];

    if (searchQ.trim()) {
      const q = searchQ.trim().toLowerCase();
      list = list.filter(
        (o) =>
          o.store.toLowerCase().includes(q) ||
          o.id.toLowerCase().includes(q) ||
          (o.items || []).some((it) => (it.name || "").toLowerCase().includes(q))
      );
    }

    if (filterStatus !== "all") {
      list = list.filter((o) => o.status === filterStatus);
    }

    if (sortKey === "date_desc") list.sort((a, b) => new Date(b.date) - new Date(a.date));
    else if (sortKey === "date_asc") list.sort((a, b) => new Date(a.date) - new Date(b.date));
    else if (sortKey === "amount_desc") list.sort((a, b) => b.amount - a.amount);
    else if (sortKey === "amount_asc") list.sort((a, b) => a.amount - b.amount);

    return list;
  };

  // small helpers for display
  const niceDate = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString();
    } catch {
      return iso;
    }
  };

  // profile image upload
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProfileImage(reader.result);
    reader.readAsDataURL(file);
  };

  // edit profile
  const handleEditClick = () => {
    setTempName(userName);
    setTempEmail(email);
    setEditing(true);
  };
  const handleCancel = () => {
    setEditing(false);
    setTempName(userName);
    setTempEmail(email);
  };
  const handleSave = () => {
    setUserName(tempName);
    setEmail(tempEmail);
    setEditing(false);
    localStorage.setItem("userName", tempName);
    localStorage.setItem("userEmail", tempEmail);
  };

  // other quick actions
  const handleQuickAction = (path) => navigate(path);
  const handleSettings = () => navigate("/settings");
  const handleLogout = () => {
    // keep orders etc but clear auth
    localStorage.removeItem("authToken");
    navigate("/");
  };

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
        transition={{ duration: 0.4 }}
      >
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center relative">
          <div className="relative w-24 h-24 mb-4">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
            ) : (
              <div className="w-24 h-24 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center text-4xl">
                <User size={50} />
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-orange-500 rounded-full p-2 shadow-md hover:bg-orange-600 transition"
            >
              <Camera className="w-4 h-4 text-white" />
            </button>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          </div>

          {editing ? (
            <div className="w-full space-y-2 mb-4">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="w-full border border-orange-300 rounded-xl px-3 py-2"
                placeholder="Enter Name"
              />
              <input
                type="email"
                value={tempEmail}
                onChange={(e) => setTempEmail(e.target.value)}
                className="w-full border border-orange-300 rounded-xl px-3 py-2"
                placeholder="Enter Email"
              />
              <input type="text" value={phone} disabled className="w-full border bg-gray-100 rounded-xl px-3 py-2 cursor-not-allowed" />
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold">{userName || "Your Name"}</h2>
              <p className="text-gray-500 text-sm">{email || "No email added yet"}</p>
              <p className="text-gray-500 text-sm mb-4">{phone}</p>
            </>
          )}

          <div className="bg-gradient-to-r from-orange-400 to-amber-400 text-white px-4 py-2 rounded-xl shadow mb-4 w-full">
            Total Points: <span className="font-bold">{totalPoints}</span>
          </div>

          {editing ? (
            <div className="flex gap-4 w-full">
              <motion.button whileTap={{ scale: 0.95 }} onClick={handleSave} className="bg-orange-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-orange-600 transition w-full">
                Save
              </motion.button>
              <motion.button whileTap={{ scale: 0.95 }} onClick={handleCancel} className="bg-white text-orange-500 px-6 py-2 rounded-full shadow-md hover:bg-orange-50 transition w-full">
                Cancel
              </motion.button>
            </div>
          ) : (
            <motion.button whileTap={{ scale: 0.95 }} onClick={handleEditClick} className="bg-orange-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-orange-600 transition mb-3 w-full">
              Edit Profile
            </motion.button>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleQuickAction("/dailylogin")} className="flex items-center justify-center gap-2 bg-white px-4 py-2 rounded-xl shadow hover:bg-orange-50 w-full">
            🎯 Daily Login
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleQuickAction("/spinandwin")} className="flex items-center justify-center gap-2 bg-white px-4 py-2 rounded-xl shadow hover:bg-orange-50 w-full">
            🎡 Spin & Win
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleQuickAction("/referafriend")} className="flex items-center justify-center gap-2 bg-white px-4 py-2 rounded-xl shadow hover:bg-orange-50 w-full">
            🤝 Refer a Friend
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleQuickAction("/rewards")} className="flex items-center justify-center gap-2 bg-white px-4 py-2 rounded-xl shadow hover:bg-orange-50 w-full">
            🎁 Rewards
          </motion.button>
        </div>

        {/* Recent Orders */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">🛒 Recent Orders</h3>
          <div className="space-y-2">
            {recentThree.length === 0 ? (
              <div className="text-gray-500 p-4 rounded-xl bg-white">No recent orders</div>
            ) : (
              recentThree.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    onClick={() => openOrder(order)}
                    className="w-full text-left bg-white p-3 rounded-xl shadow flex justify-between items-start gap-3"
                  >
                    <div>
                      <div className="font-semibold">{order.store}</div>
                      <div className="text-xs text-gray-500">{niceDate(order.date)}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {order.items?.map((it) => `${it.name} x${it.qty}`).join(" • ")}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">₹{order.amount}</div>
                      <div className="text-xs mt-2">
                        {order.status === "delivered" ? (
                          <span className="text-green-600 font-medium">Delivered</span>
                        ) : order.status === "cancelled" ? (
                          <span className="text-red-500 font-medium">Cancelled</span>
                        ) : order.status === "out_for_delivery" ? (
                          <span className="text-orange-600 font-medium">Out for delivery</span>
                        ) : (
                          <span className="text-gray-500">{order.status}</span>
                        )}
                      </div>
                    </div>
                  </button>
                </motion.div>
              ))
            )}
          </div>

        {orders.length > 3 && (
  <button
    onClick={() => navigate("/allorders")}
    className="mt-2 text-orange-500 font-medium hover:underline"
  >
    View More Orders
  </button>
)}

        </div>

        {/* Favorites & Saved for Later (kept minimal) */}
       {/* Favorites Section */}
<div className="mt-6">
  <h3 className="text-lg font-semibold mb-3 text-orange-500 flex items-center gap-2">
    <Heart className="w-5 h-5 fill-orange-500 text-orange-500" /> Favorites
  </h3>

  <div className="space-y-2">
    {favorites.slice(-3).map((fav) => (
      <motion.div
        key={fav.id}
        className="bg-white p-3 rounded-xl shadow flex justify-between items-center border border-orange-200"
      >
        <div className="text-left">
          <p className="font-semibold text-sm text-gray-800 flex items-center gap-2">
            {fav.name}
            <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
              {fav.type === "restaurant" ? "Restaurant" : "Product"}
            </span>
          </p>

          {fav.type === "product" && (
            <p className="text-xs font-bold text-orange-600">₹{fav.amount}</p>
          )}
        </div>

        <button
          onClick={() => removeFavorite(fav.id)}
          className="px-3 py-1 bg-gray-200 text-gray-600 rounded-lg text-xs font-bold"
        >
          Remove
        </button>
      </motion.div>
    ))}
  </div>

  {favorites.length > 3 && (
    <button
      onClick={() => navigate("/favorites")}
      className="mt-3 bg-white border border-orange-500 text-orange-500 text-sm font-semibold py-2 px-4 rounded-xl shadow hover:bg-orange-50 transition w-full"
    >
      View All Favorites
    </button>
  )}
</div>

      {/* Saved for Later */}
<div className="mt-6">
  <h3 className="text-lg font-semibold mb-3 text-orange-500 flex items-center gap-2">
    <Star className="w-5 h-5 text-orange-500 fill-orange-500" /> Saved for Later
  </h3>

  <div className="space-y-2">
    {savedLater.slice(0, 3).map((item) => (
      <motion.div
        key={item.id}
        className="bg-white p-3 rounded-xl shadow flex justify-between items-center border border-orange-200"
      >
        {/* LEFT */}
        <div className="text-left">
          <p className="font-semibold text-sm text-gray-800">{item.name}</p>

          {item.type === "product" && (
            <p className="text-xs font-bold text-orange-600">₹{item.amount}</p>
          )}

          {item.type === "restaurant" && (
            <p className="text-xs font-bold text-gray-500">Restaurant</p>
          )}
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex gap-2 items-center">
          {/* MOVE TO CART */}
          <button
            onClick={() => addSavedToCart(item)}
            className="bg-orange-500 text-white px-3 py-1 rounded-lg text-xs font-bold"
          >
            Move to Cart
          </button>

          {/* REMOVE */}
          <button
            onClick={() => removeSavedLater(item.id)}
            className="text-gray-500 font-medium text-xs hover:text-gray-700"
          >
            Remove
          </button>
        </div>
      </motion.div>
    ))}
  </div>

  {savedLater.length > 3 && (
    <button
      onClick={() => navigate("/saved")}
      className="mt-3 bg-white border border-orange-500 text-orange-500 text-sm font-semibold py-2 px-4 rounded-xl shadow hover:bg-orange-50 transition"
    >
      View All Saved Items
    </button>
  )}
</div>

        {/* Settings & Logout */}
        <div className="mt-6 space-y-4">
          <motion.button whileTap={{ scale: 0.95 }} onClick={handleSettings} className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl shadow hover:bg-orange-50 w-full">
            <Settings className="text-orange-500" /> Settings
          </motion.button>

          <motion.button whileTap={{ scale: 0.95 }} onClick={handleLogout} className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl shadow hover:bg-orange-50 w-full">
            <LogOut className="text-orange-500" /> Logout
          </motion.button>

          <motion.button whileTap={{ scale: 0.95 }} onClick={() => { /* show delete modal kept earlier if desired */ alert("Use account delete in settings (demo)"); }} className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl shadow hover:bg-red-50 text-red-500 w-full">
            <Shield className="text-red-500" /> Delete Account
          </motion.button>
        </div>
      </motion.div>

     {/* ========== Order Details Modal ========== */}
<AnimatePresence>
  {selectedOrder && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4"
    >
      <motion.div
        initial={{ y: 60 }}
        animate={{ y: 0 }}
        exit={{ y: 60 }}
        className="bg-white rounded-t-2xl w-full max-w-lg p-5"
      >
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <div className="font-semibold">{selectedOrder.store}</div>
            <div className="text-xs text-gray-500">{niceDate(selectedOrder.date)}</div>
            <div className="text-xs text-gray-500 mt-1">{selectedOrder.id}</div>
          </div>
          <div className="text-right">
            <div className="font-bold">₹{selectedOrder.amount}</div>
            <div className="text-xs mt-2 capitalize">
              {selectedOrder.status}
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="mt-4">
          <div className="text-sm font-medium mb-2">Items</div>
          <ul className="text-sm text-gray-700 space-y-1">
            {selectedOrder.items?.map((it, idx) => (
              <li key={idx}>
                {it.name} x{it.qty}
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
          {/* Live Tracking (not delivered) */}
          {selectedOrder.status !== "delivered" &&
          selectedOrder.status !== "cancelled" ? (
            <button
              onClick={() => goToTracking(selectedOrder)}
              className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-xl"
            >
              Live Tracking
            </button>
          ) : null}

          {/* Delivered */}
          {selectedOrder.status === "delivered" && (
            <div className="flex-1 flex flex-col items-start gap-1">
              <span className="text-green-600 font-semibold text-sm">
                Delivered
              </span>
              <span className="text-xs text-gray-500">
                Delivered on: {niceDate(selectedOrder.date)}
              </span>
            </div>
          )}

          {/* Rate & Review */}
          {selectedOrder.status === "delivered" && !selectedOrder.rated && (
            <button
              className="bg-white border border-orange-500 text-orange-500 px-4 py-2 rounded-xl"
            >
              Rate & Review
            </button>
          )}

          {/* Already Rated */}
          {selectedOrder.status === "delivered" && selectedOrder.rated && (
            <div className="flex items-center gap-1 text-yellow-500">
              <Star size={14} /> {selectedOrder.rating}
            </div>
          )}
        </div>

        {/* Review Box (only when delivered & unrated) */}
        {selectedOrder.status === "delivered" && !selectedOrder.rated && (
          <div className="mt-4">
            <div className="text-sm font-medium">Write a review</div>

            <div className="flex items-center gap-2 mt-2">
              <label className="text-sm text-gray-600">Rating:</label>
              <select
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
                className="px-3 py-1 border rounded"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r} ★
                  </option>
                ))}
              </select>
            </div>

            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full border rounded-xl px-3 py-2 mt-2"
              placeholder="Write your feedback..."
            />

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => submitReview(selectedOrder.id)}
                className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-xl"
              >
                Submit Review
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex-1 bg-gray-100 px-4 py-2 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Close button for delivered/cancelled when NOT reviewing */}
        {(selectedOrder.status === "delivered" ||
          selectedOrder.status === "cancelled") &&
          selectedOrder.rated && (
            <div className="mt-5">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full bg-gray-100 px-4 py-2 rounded-xl"
              >
                Close
              </button>
            </div>
          )}

        {/* Close button for non-delivered orders */}
        {selectedOrder.status !== "delivered" &&
          selectedOrder.status !== "cancelled" && (
            <div className="mt-5">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full bg-gray-100 px-4 py-2 rounded-xl"
              >
                Close
              </button>
            </div>
          )}
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

      {/* ========== All Orders Modal (search/filter/sort) ========== */}
      <AnimatePresence>
        {showAllOrdersModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 pt-16">
            <motion.div initial={{ y: -20 }} animate={{ y: 0 }} exit={{ y: -20 }} className="bg-white rounded-xl w-full max-w-3xl p-5 max-h-[85vh] overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold">All Orders</h3>
                  <p className="text-xs text-gray-500">Search, filter & sort your orders</p>
                </div>
                <button onClick={() => setShowAllOrdersModal(false)} className="text-sm text-gray-500">Close</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
                <input value={searchQ} onChange={(e) => setSearchQ(e.target.value)} placeholder="Search by store, id, item" className="px-3 py-2 border rounded-xl" />
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 border rounded-xl">
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="out_for_delivery">Out for delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <select value={sortKey} onChange={(e) => setSortKey(e.target.value)} className="px-3 py-2 border rounded-xl">
                  <option value="date_desc">Newest first</option>
                  <option value="date_asc">Oldest first</option>
                  <option value="amount_desc">Amount High → Low</option>
                  <option value="amount_asc">Amount Low → High</option>
                </select>
              </div>

              <div className="space-y-3">
                {filteredSortedOrders().length === 0 ? (
                  <div className="text-gray-500 p-4 rounded-xl bg-gray-50">No orders found</div>
                ) : (
                  filteredSortedOrders().map((o) => (
                    <div key={o.id} className="bg-white p-3 rounded-xl shadow flex justify-between items-start gap-3">
                      <div>
                        <div className="font-semibold">{o.store}</div>
                        <div className="text-xs text-gray-500">{niceDate(o.date)}</div>
                        <div className="text-xs text-gray-500 mt-1">{o.id}</div>
                        <div className="text-xs mt-2 text-gray-600">{o.items?.map((it) => `${it.name} x${it.qty}`).join(" • ")}</div>
                      </div>

                      <div className="text-right flex flex-col items-end gap-2">
                        <div className="font-bold">₹{o.amount}</div>
                        <div className="text-xs">
                          {o.status === "delivered" ? <span className="text-green-600">Delivered</span> :
                            o.status === "cancelled" ? <span className="text-red-500">Cancelled</span> :
                              <span className="text-orange-500">{o.status}</span>}
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => openOrder(o)} className="px-3 py-1 rounded-xl bg-white border text-sm">View</button>
                          {o.status !== "delivered" && o.status !== "cancelled" && (
                            <button onClick={() => goToTracking(o)} className="px-3 py-1 rounded-xl bg-orange-500 text-white text-sm">Track</button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
