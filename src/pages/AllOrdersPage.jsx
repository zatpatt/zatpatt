import React, { useState, useEffect } from "react";
import { ArrowLeft, Search, Filter, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function AllOrdersPage() {
  const navigate = useNavigate();

  // Load orders from localStorage (or dummy for now)
  const [orders, setOrders] = useState(
    JSON.parse(localStorage.getItem("allOrders")) || [
      // Dummy structure (replace with real orders when backend connected)
      {
        id: "ORD-001",
        store: "Velvet Scoops",
        amount: 120,
        date: "2025-11-01",
        status: "delivered",
        rated: false,
        items: [{ name: "Ice Cream", qty: 1 }],
      },
      {
        id: "ORD-002",
        store: "Mitra A Biryani",
        amount: 160,
        date: "2025-11-03",
        status: "out for delivery",
        rated: false,
        items: [{ name: "Biryani", qty: 1 }],
      },
      {
        id: "ORD-003",
        store: "Spicy Hub",
        amount: 220,
        date: "2025-11-05",
        status: "cancelled",
        rated: false,
        items: [{ name: "Paneer Roll", qty: 1 }],
      },
    ]
  );

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  const niceDate = (d) => new Date(d).toDateString();

  // Filter Logic
  const filteredOrders = orders
    .filter((order) => {
      if (filter === "delivered") return order.status === "delivered";
      if (filter === "ongoing")
        return (
          order.status === "preparing" ||
          order.status === "accepted" ||
          order.status === "out for delivery"
        );
      if (filter === "cancelled") return order.status === "cancelled";
      return true;
    })
    .filter((order) =>
      `${order.id} ${order.store} ${order.date}`
        .toLowerCase()
        .includes(query.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "newest") return new Date(b.date) - new Date(a.date);
      if (sort === "oldest") return new Date(a.date) - new Date(b.date);
      if (sort === "price_high") return b.amount - a.amount;
      if (sort === "price_low") return a.amount - b.amount;
    });

  const goToTracking = (order) => navigate("/ordertracking", { state: { order } });

  const submitReview = (id) => {
    const updated = orders.map((o) =>
      o.id === id ? { ...o, rated: true, rating: reviewRating, review: reviewText } : o
    );

    setOrders(updated);
    localStorage.setItem("allOrders", JSON.stringify(updated));

    setSelectedOrder(null);
    setReviewText("");
    setReviewRating(5);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="bg-orange-500 text-white py-4 px-6 shadow-lg flex items-center justify-center relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-5 top-3 p-2 rounded-full bg-white shadow hover:bg-gray-100 transition"
        >
          <ArrowLeft className="w-5 h-5 text-orange-500" />
        </button>
        <h1 className="text-xl font-bold">📦 All Orders</h1>
      </header>

      {/* Search & Filters */}
      <div className="p-4">
        <div className="flex gap-2 mb-3">
          <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow w-full">
            <Search className="text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search order, store, date"
              className="w-full outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <select
            className="bg-white p-2 rounded-xl shadow text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="ongoing">Ongoing</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            className="bg-white p-2 rounded-xl shadow text-sm"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="price_high">Price High → Low</option>
            <option value="price_low">Price Low → High</option>
          </select>
        </div>

        {/* Orders List */}
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-3 rounded-xl shadow flex justify-between items-center"
              onClick={() => setSelectedOrder(order)}
            >
              <div>
                <p className="font-semibold">{order.store}</p>
                <p className="text-gray-500 text-xs">{niceDate(order.date)}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">₹{order.amount}</p>
                <p
                  className={`text-xs mt-1 capitalize ${
                    order.status === "delivered"
                      ? "text-green-600"
                      : order.status === "cancelled"
                      ? "text-red-500"
                      : "text-orange-500"
                  }`}
                >
                  {order.status}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-end justify-center p-4"
          >
            <motion.div
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              exit={{ y: 40 }}
              className="bg-white w-full max-w-lg rounded-t-2xl p-5"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{selectedOrder.store}</p>
                  <p className="text-gray-500 text-xs">{niceDate(selectedOrder.date)}</p>
                  <p className="text-gray-400 text-xs mt-1">{selectedOrder.id}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">₹{selectedOrder.amount}</p>
                  <p className="text-xs capitalize mt-1">{selectedOrder.status}</p>
                </div>
              </div>

              {/* Items */}
              <div className="mt-4">
                <p className="font-medium text-sm mb-2">Items</p>
                {selectedOrder.items.map((it, index) => (
                  <p className="text-sm text-gray-700" key={index}>
                    {it.name} x{it.qty}
                  </p>
                ))}
              </div>

              {/* Buttons */}
              <div className="mt-4 space-y-2">
                {/* Track Order */}
                {selectedOrder.status !== "delivered" &&
                  selectedOrder.status !== "cancelled" && (
                    <button
                      className="bg-orange-500 text-white w-full py-2 rounded-xl"
                      onClick={() => goToTracking(selectedOrder)}
                    >
                      Live Tracking
                    </button>
                  )}

                {/* Rate & Review */}
                {selectedOrder.status === "delivered" && !selectedOrder.rated && (
                  <>
                    <div className="flex items-center gap-3 mt-2">
                      <label>Rating:</label>
                      <select
                        value={reviewRating}
                        onChange={(e) => setReviewRating(Number(e.target.value))}
                        className="border px-2 py-1 rounded"
                      >
                        {[5, 4, 3, 2, 1].map((r) => (
                          <option key={r}>{r}</option>
                        ))}
                      </select>
                    </div>

                    <textarea
                      placeholder="Write your review..."
                      className="border w-full rounded-xl px-3 py-2 mt-2"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                    />

                    <button
                      className="bg-orange-500 text-white w-full py-2 rounded-xl mt-2"
                      onClick={() => submitReview(selectedOrder.id)}
                    >
                      Submit Review
                    </button>
                  </>
                )}

                {selectedOrder.status === "delivered" && selectedOrder.rated && (
                  <p className="flex items-center gap-2 text-orange-500 font-semibold">
                    <Star size={16} /> Rated: {selectedOrder.rating}
                  </p>
                )}

                {/* Close */}
                <button
                  className="bg-gray-200 w-full py-2 rounded-xl mt-2"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
