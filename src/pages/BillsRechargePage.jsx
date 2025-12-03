// src/pages/BillsRechargePage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Phone, Tv, Zap, Smartphone } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";

export default function BillsRechargePage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const location = useLocation();

  // Active tab state
  const [tab, setTab] = useState("mobile");
  const [active, setActive] = useState("mobile");

  // ----- MOBILE STATES -----
  const [number, setNumber] = useState("");
  const [operator, setOperator] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("online");
  const cost = Number(amount) || 0;

  // ----- DTH STATES -----
  const [dthName, setDthName] = useState("");
  const [dthAddress, setDthAddress] = useState("");
  const [dthOperator, setDthOperator] = useState("");
  const [dthCustomerId, setDthCustomerId] = useState("");
  const [dthAmount, setDthAmount] = useState("");
  const [dthPaymentMode, setDthPaymentMode] = useState("online");
  const dthCost = Number(dthAmount) || 0;

  // ----- ELECTRICITY STATES -----
  const [elecProvider, setElecProvider] = useState("");
  const [consumerNumber, setConsumerNumber] = useState("");
  const [elecName, setElecName] = useState("");
  const [billFile, setBillFile] = useState(null);
  const [elecAmount, setElecAmount] = useState("");
  const [elecPaymentMode, setElecPaymentMode] = useState("online");
  const elecCost = Number(elecAmount) || 0;

  // Set initial tab if passed via state
  useEffect(() => {
    if (location.state?.activeTab) {
      setTab(location.state.activeTab);
      setActive(location.state.activeTab);
    }
  }, [location.state]);

  // Generic Add to Cart
  const handleAdd = (item) => {
    addToCart(item);
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-[#fff9f4] pb-28">

      {/* Header */}
      <header className="bg-orange-500 text-white py-4 px-4 shadow-md flex items-center">
        <button onClick={() => navigate(-1)} className="mr-3 bg-white/90 text-orange-500 p-2 rounded-full shadow">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-lg font-bold">Recharge & Bill Pay</h1>
      </header>

      {/* Tabs */}
      <div className="mt-5 px-4 flex overflow-x-auto gap-2 pb-3 justify-center">
        {location.state?.activeTab ? null : (
          <div className="flex overflow-x-auto gap-2 pb-3 justify-center">
            {[
              { key: "mobile", label: "Mobile Recharge" },
              { key: "dth", label: "DTH / Cable Recharge" },
              { key: "electricity", label: "Electricity Bill Pay" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setActive(t.key)}
                className={`px-3 py-1 rounded-full text-sm font-semibold shadow transition whitespace-nowrap ${
                  active === t.key ? "bg-orange-500 text-white" : "bg-white text-gray-700"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ----- MOBILE FORM ----- */}
      {active === "mobile" && (
        <motion.div className="bg-white rounded-2xl shadow p-5 w-[90%] max-w-lg text-left mx-auto mt-6 space-y-3">
          <h2 className="text-xl font-bold text-gray-900 text-center">Mobile Recharge</h2>
          <p className="text-sm text-gray-600 text-center mb-3">Fast prepaid recharge</p>

        {/* Mobile Number */}
<div>
  <label className="block text-xs font-semibold mb-1">Mobile Number</label>
  <input
    type="tel"
    value={number}
    onChange={(e) => setNumber(e.target.value.replace(/\D/g, ""))} 
    placeholder="Enter 10-digit mobile number"
    maxLength={10}
    className="w-full border p-2 rounded-xl text-xs shadow-sm"
  />
  {number && number.length !== 10 && (
    <p className="text-red-500 text-[10px] mt-1">⚠ Please enter a valid 10-digit number</p>
  )}
</div>


          {/* Operator */}
          <div>
            <label className="block text-xs font-semibold mb-1">Operator</label>
            <select
              value={operator}
              onChange={(e)=>setOperator(e.target.value)}
              className="w-full border p-2 rounded-xl text-xs shadow-sm"
            >
              <option value="">Select Operator</option>
              <option>Jio</option>
              <option>Airtel</option>
              <option>VI</option>
              <option>BSNL</option>
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold mb-1">Plan or Amount (₹)</label>
            <input
              type="number"
              min={1}
              value={amount}
              onChange={(e)=>setAmount(e.target.value)}
              placeholder="Enter recharge amount"
              className="w-full border p-2 rounded-xl text-xs shadow-sm"
            />
          </div>

          {/* Payment Mode */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setPaymentMode("online")}
              className={`p-2 rounded-xl text-xs font-semibold shadow ${paymentMode==="online"?"bg-orange-500 text-white":"bg-orange-50 text-orange-600"}`}
            >
              Online Pay
            </button>
            <button
              onClick={() => setPaymentMode("cash")}
              className={`p-2 rounded-xl text-xs font-semibold shadow ${paymentMode==="cash"?"bg-orange-500 text-white":"bg-orange-50 text-orange-600"}`}
            >
              Cash Pay
            </button>
          </div>

          {/* Conditional Payment Info */}
          {paymentMode === "online" && (
            <div className="bg-orange-50 p-3 rounded-xl text-xs shadow-sm text-center text-white-500">
              ✅ Pay online to this number:<br/>
              <strong className="text-sm">7264850230</strong>
            </div>
          )}
          {paymentMode === "cash" && (
            <div className="bg-orange-50 p-3 rounded-xl text-xs shadow-sm text-center text-orange-700">
              👤 Cash Payment requires:<br/>
              • Minimum Agent Fee: <strong>₹20.</strong><br/>
              • Home visit is subjected to availability.
            </div>
          )}

 {/* Info Box */}
    <div className="text-left text-sm space-y-1 bg-orange-50 p-3 rounded-xl shadow-sm mb-4">
      <p>• NOTE : Enter the details properly wrong information will not be refunded.</p>
         </div>

          {/* Add to Cart */}
          <div className="flex justify-center">
            <button
              disabled={!number || !operator || !amount}
              onClick={() => handleAdd({
                id: Date.now(),
                name: `Mobile Recharge - ${operator}`,
                category: "mobile",
                price: cost,
                quantity: 1,
                img: "/assets/recharge-icon.png",
              })}
              className={`${number && operator && amount ? "bg-orange-500 hover:bg-orange-600" : "bg-gray-400 cursor-not-allowed"} text-white px-4 py-2 rounded-full text-xs font-semibold shadow`}
            >
              Add to Cart
            </button>
          </div>
        </motion.div>
      )}

      {/* ----- DTH FORM ----- */}
      {active === "dth" && (
        <motion.div className="bg-white rounded-2xl shadow p-5 w-[90%] max-w-lg text-left mx-auto mt-6 space-y-3">
          <h2 className="text-xl font-bold text-gray-900 text-center">DTH / Cable Recharge</h2>
          <p className="text-sm text-gray-600 text-center mb-3">TV & Set-top box recharge</p>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold mb-1">Your Full Name</label>
            <input
              type="text"
              value={dthName}
              onChange={(e)=>setDthName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full border p-2 rounded-xl text-xs shadow-sm"
            />
          </div>

          {/* Operator Type */}
          <div>
            <label className="block text-xs font-semibold mb-1">Select Type</label>
            <select
              value={dthOperator}
              onChange={(e)=>setDthOperator(e.target.value)}
              className="w-full border p-2 rounded-xl text-xs shadow-sm"
            >
              <option value="">Select Operator</option>
              <option>Tata Play</option>
              <option>Airtel Digital TV</option>
              <option>Sun Direct</option>
              <option>DISH TV</option>
              <option>D2H</option>
              <option>GTPL Cable</option>
              </select>
          </div>

          {/* Customer ID */}
          <div>
            <label className="block text-xs font-semibold mb-1">Customer ID</label>
            <input
              type="text"
              value={dthCustomerId}
              onChange={(e)=>setDthCustomerId(e.target.value)}
              placeholder="Enter customer ID"
              className="w-full border p-2 rounded-xl text-xs shadow-sm"
            />
          </div>
          {/* Address */}
          <div>
            <label className="block text-xs font-semibold mb-1">Your Full Address (only for cable)</label>
            <input
              type="text"
              value={dthAddress}
              onChange={(e)=>setDthAddress(e.target.value)}
              placeholder="Enter your full address"
              className="w-full border p-2 rounded-xl text-xs shadow-sm"
            />
          </div>
          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold mb-1">Amount (₹)</label>
            <input
              type="number"
              min={1}
              value={dthAmount}
              onChange={(e)=>setDthAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full border p-2 rounded-xl text-xs shadow-sm"
            />
          </div>

          {/* Payment Mode */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setDthPaymentMode("online")}
              className={`p-2 rounded-xl text-xs font-semibold shadow ${dthPaymentMode==="online"?"bg-orange-500 text-white":"bg-orange-50 text-orange-600"}`}
            >
              Online Pay
            </button>
            <button
              onClick={() => setDthPaymentMode("cash")}
              className={`p-2 rounded-xl text-xs font-semibold shadow ${dthPaymentMode==="cash"?"bg-orange-500 text-white":"bg-orange-50 text-orange-600"}`}
            >
              Cash Pay
            </button>
          </div>

          {/* Conditional Payment Info */}
          {dthPaymentMode === "online" && (
            <div className="bg-orange-50 p-3 rounded-xl text-xs shadow-sm text-center text-white-500">
              ✅ Pay online to this number:<br/>
              <strong className="text-sm">7264850230</strong>
            </div>
          )}
          {dthPaymentMode === "cash" && (
            <div className="bg-orange-50 p-3 rounded-xl text-xs shadow-sm text-center text-orange-700">
              👤 Cash Payment requires:<br/>
              • Minimum Agent Fee: <strong>₹20.</strong><br/>
              • Home visit is subjected to availability.
            </div>
          )}

 {/* Info Box */}
    <div className="text-left text-sm space-y-1 bg-orange-50 p-3 rounded-xl shadow-sm mb-4">
      <p>• NOTE : Enter the details properly wrong information will not be refunded.</p>
         </div>

          {/* Add to Cart */}
          <div className="flex justify-center">
            <button
              disabled={!dthName || !dthOperator || !dthCustomerId || !dthAmount}
              onClick={() => handleAdd({
                id: Date.now(),
                name: `DTH Recharge - ${dthOperator}`,
                category: "dth",
                price: dthCost,
                quantity: 1,
                img: "/assets/recharge-icon.png",
              })}
              className={`${dthName && dthOperator && dthCustomerId && dthAmount ? "bg-orange-500 hover:bg-orange-600" : "bg-gray-400 cursor-not-allowed"} text-white px-4 py-2 rounded-full text-xs font-semibold shadow`}
            >
              Add to Cart
            </button>
          </div>
        </motion.div>
      )}

      {/* ----- ELECTRICITY FORM ----- */}
      {active === "electricity" && (
        <motion.div className="bg-white rounded-2xl shadow p-5 w-[90%] max-w-lg text-left mx-auto mt-6 space-y-3">
          <h2 className="text-xl font-bold text-gray-900 text-center">Electricity Bill Pay</h2>
          <p className="text-sm text-gray-600 text-center mb-3">Pay electricity bills instantly</p>

          {/* Provider */}
          <div>
            <label className="block text-xs font-semibold mb-1">Select Provider</label>
            <select
              value={elecProvider}
              onChange={(e) => setElecProvider(e.target.value)}
              className="w-full border p-2 rounded-xl text-xs shadow-sm"
            >
              <option value="">Select Provider</option>
              <option>Adani Electricity</option>
              <option>Brihan Mumbai Electricity (BEST)</option>
              <option>MahaVitaran - Maharashtra (MSEDCL)</option>
              <option>Tata Power - Mumbai</option>
              <option>Torrent Power - Maharashtra</option>
            </select>
          </div>

          {/* Consumer Number */}
          <div>
            <label className="block text-xs font-semibold mb-1">Consumer Number</label>
            <input
              type="text"
              value={consumerNumber}
              onChange={(e) => setConsumerNumber(e.target.value)}
              placeholder="Enter consumer number"
              className="w-full border p-2 rounded-xl text-xs shadow-sm"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold mb-1">Your Name</label>
            <input
              type="text"
              value={elecName}
              onChange={(e) => setElecName(e.target.value)}
              placeholder="Enter full name"
              className="w-full border p-2 rounded-xl text-xs shadow-sm"
            />
          </div>

          {/* Upload Bill */}
          <div>
            <label className="block text-xs font-semibold mb-1">Upload Bill (optional)</label>
            <input
              type="file"
              accept=".pdf,.jpg,.png"
              onChange={(e) => setBillFile(e.target.files[0])}
              className="w-full border p-2 rounded-xl text-xs shadow-sm"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold mb-1">Amount (₹)</label>
            <input
              type="number"
              min={1}
              value={elecAmount}
              onChange={(e) => setElecAmount(e.target.value)}
              placeholder="Enter bill amount"
              className="w-full border p-2 rounded-xl text-xs shadow-sm"
            />
          </div>

          {/* Payment Mode */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setElecPaymentMode("online")}
              className={`p-2 rounded-xl text-xs font-semibold shadow ${elecPaymentMode==="online"?"bg-orange-500 text-white":"bg-orange-50 text-orange-600"}`}
            >
              Online Pay
            </button>
            <button
              onClick={() => setElecPaymentMode("cash")}
              className={`p-2 rounded-xl text-xs font-semibold shadow ${elecPaymentMode==="cash"?"bg-orange-500 text-white":"bg-orange-50 text-orange-600"}`}
            >
              Cash Pay
            </button>
          </div>

          {/* Conditional Payment Info */}
          {elecPaymentMode === "online" && (
            <div className="bg-orange-50 p-3 rounded-xl text-xs shadow-sm text-center text-white-500">
              ✅ Pay online to this number:<br/>
              <strong className="text-sm">7264850230</strong>
            </div>
          )}
          {elecPaymentMode === "cash" && (
            <div className="bg-orange-50 p-3 rounded-xl text-xs shadow-sm text-center text-orange-700">
              👤 Cash Payment requires:<br/>
              • Minimum Agent Fee: <strong>₹20.</strong><br/>
              • Home visit is subjected to availability.
            </div>
          )}
 {/* Info Box */}
    <div className="text-left text-sm space-y-1 bg-orange-50 p-3 rounded-xl shadow-sm mb-4">
      <p>• NOTE : Enter the details properly wrong information will not be refunded.</p>
         </div>

          {/* Add to Cart */}
          <div className="flex justify-center">
            <button
              disabled={!elecProvider || !consumerNumber || !elecName || !elecAmount}
              onClick={() => handleAdd({
                id: Date.now(),
                name: `Electricity Bill - ${elecProvider}`,
                category: "electricity",
                price: elecCost,
                quantity: 1,
                img: "/assets/recharge-icon.png",
              })}
              className={`${elecProvider && consumerNumber && elecName && elecAmount ? "bg-orange-500 hover:bg-orange-600" : "bg-gray-400 cursor-not-allowed"} text-white px-4 py-2 rounded-full text-xs font-semibold shadow`}
            >
              Add to Cart
            </button>
          </div>
        </motion.div>
      )}

      {/* Fixed Help Button */}
      <div className="fixed left-0 right-0 bottom-0 p-4">
        <div className="max-w-md mx-auto bg-white shadow rounded-2xl p-3 flex justify-between items-center">
          <p className="text-xs font-semibold text-gray-700">Need help with bills?</p>
          <button onClick={() => window.location.href = "tel:7264850230"} className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full shadow flex items-center gap-1">
            <Phone size={12}/> Call Us
          </button>
        </div>
      </div>

    </div>
  );
}
