// src/pages/BookingPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  CreditCard,
  User,
  MessageCircle
} from "lucide-react";

/**
 * Premium Booking page with date/time/address and bottom sheet confirm.
 * Route: /book/:name
 */

export default function BookingPage() {
  const navigate = useNavigate();
  const { name } = useParams();
  const { state } = useLocation(); // provider info optionally
  const serviceName = decodeURIComponent(name || (state?.name ?? "Service"));

  // Timeslots (demo)
  const slots = useMemo(
    () => ["ASAP (15-30 mins)", "10:00 - 10:30", "10:30 - 11:00", "11:00 - 11:30", "Today 2:00 - 3:00"],
    []
  );

  const [selectedSlot, setSelectedSlot] = useState(slots[0]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const [address, setAddress] = useState(() => localStorage.getItem("selectedAddress") || "");
  const [note, setNote] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    // quick UX: focus first field if needed
  }, []);

  const price = state?.price ?? 149;

  const handleConfirm = () => {
    // Create a booking object (mock)
    const booking = {
      id: `BK${Date.now()}`,
      service: serviceName,
      provider: state?.name || null,
      date: selectedDate,
      slot: selectedSlot,
      address,
      note,
      price,
      status: "confirmed",
    };

    // Save booking locally (replace with backend call)
    const existing = JSON.parse(localStorage.getItem("bookings") || "[]");
    existing.unshift(booking);
    localStorage.setItem("bookings", JSON.stringify(existing));

    setShowConfirm(true);
    setTimeout(() => {
      setShowConfirm(false);
      navigate("/order-success", { state: { booking } });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#fff9f4]">
      <header className="bg-orange-500 text-white py-4 px-4 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-3 bg-white/90 text-orange-500 p-2 rounded-full">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-lg font-bold">Book — {serviceName}</h1>
          <p className="text-xs text-orange-100">Confirm time, address and place the booking</p>
        </div>
      </header>

      <main className="p-4 space-y-4 pb-32">
        {/* Provider summary */}
        {state && (
          <div className="bg-white rounded-2xl p-4 shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
              <User size={22} className="text-orange-500" />
            </div>
            <div>
              <div className="font-semibold">{state.name}</div>
              <div className="text-xs text-gray-500">{state.experience} • {state.jobs} jobs</div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-lg font-bold">₹{price}</div>
              <div className="text-xs text-gray-500">Est. {state.eta}</div>
            </div>
          </div>
        )}

        {/* Date picker */}
        <div className="bg-white rounded-2xl p-4 shadow">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Calendar size={16} /> Choose Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="mt-3 w-full border border-gray-200 rounded-lg px-3 py-2"
          />

          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mt-4">
            <Clock size={16} /> Choose Time Slot
          </label>

          <div className="mt-3 grid grid-cols-2 gap-3">
            {slots.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSlot(s)}
                className={`text-sm px-3 py-2 rounded-lg border ${
                  selectedSlot === s ? "bg-orange-500 text-white border-orange-500" : "bg-white text-gray-700"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-2xl p-4 shadow">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <MapPin size={16} /> Delivery / Service Address
          </label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address or select saved address"
            className="mt-3 w-full border border-gray-200 rounded-lg px-3 py-2"
          />
          <div className="text-xs text-gray-400 mt-2">Tip: Save addresses in Address page for quick checkout.</div>
        </div>

        {/* Note */}
        <div className="bg-white rounded-2xl p-4 shadow">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <MessageCircle size={16} /> Note for the professional (optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g., please bring an extra fuse / call before arrival"
            rows={3}
            className="mt-3 w-full border border-gray-200 rounded-lg px-3 py-2"
          />
        </div>
      </main>

      {/* Bottom pay/confirm sheet */}
      <div className="fixed bottom-4 left-4 right-4">
        <div className="bg-white rounded-2xl shadow-lg p-3 flex items-center gap-3">
          <div className="flex-1">
            <div className="text-sm text-gray-500">Total Payable</div>
            <div className="text-lg font-bold">₹{price}</div>
          </div>

          <button
            onClick={() => setShowConfirm(true) || handleConfirmAsync()}
            className="bg-orange-500 text-white px-5 py-3 rounded-2xl font-semibold"
          >
            Confirm & Pay
          </button>
        </div>
      </div>

      {/* Confirmation overlay / bottom sheet */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/30 flex items-end justify-center">
          <div className="w-full max-w-xl bg-white rounded-t-2xl p-6 animate-slide-up">
            <div className="flex items-start gap-4">
              <div className="text-green-600">
                <CheckCircle size={36} />
              </div>
              <div>
                <h3 className="text-lg font-bold">Booking Confirmed</h3>
                <p className="text-sm text-gray-500">Your booking has been placed. Provider will contact you shortly.</p>
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  navigate("/order-success");
                }}
                className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-semibold"
              >
                Go to Orders
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                }}
                className="flex-1 border border-gray-200 py-3 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function handleConfirmAsync() {
    // small helper to mimic delay, then call handleConfirm
    setTimeout(() => {
      handleConfirm();
    }, 600);
  }
}
