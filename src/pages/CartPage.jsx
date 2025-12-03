// ✅ src/pages/CartPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Trash2, Tag, Star, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const navigate = useNavigate();
  const location = useLocation();
  

  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem("cartItems");
    return stored
      ? JSON.parse(stored)
      : [
  
        ];
  });
  
  // ✅ RULE: if Lamination or Binding is in cart, printing must also exist to checkout
const hasPrint = cartItems.some(item => item.category === "print");
const hasLaminationOrBinding = cartItems.some(
  item => item.category === "lamination" || item.category === "binding"
);
const canCheckout = !hasLaminationOrBinding || hasPrint;
 
const [savedItems, setSavedItems] = useState(() => {
  const stored = localStorage.getItem("savedForLater");
  return stored ? JSON.parse(stored) : [];
});

const [deliveryCharge, setDeliveryCharge] = useState(0);

const calculateDeliveryCharge = (subtotal, distance) => {
  if (subtotal < 50) return 0; // block checkout case (no proceed)

  // Subtotal slab
  let slab = 0;
  if (subtotal >= 1000) slab = 0;
  else if (subtotal >= 500 && subtotal <= 999) slab = 40;
  else if (subtotal >= 150 && subtotal <= 499) slab = 50;
  else if (subtotal >= 50 && subtotal <= 149) slab = 30;

  // If free delivery
  if (slab === 0) return 0;

  // Distance add-on
  let distAdd = 0;
  if (distance > 6 && distance <= 10) distAdd = 30;
  else if (distance > 10 && distance <= 16) distAdd = 40;
  else if (distance > 16 && distance <= 20) distAdd = 70;
  else if (distance >= 20) distAdd = 100;

  return slab + distAdd;
};

  const [subtotal, setSubtotal] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [redeemPoints, setRedeemPoints] = useState(0);
  const [savedAddress, setSavedAddress] = useState(null);
  const [note, setNote] = useState("");

  // Default ₹5 tip and ₹10 donation
  const [deliveryTip, setDeliveryTip] = useState(5);
  const [donation, setDonation] = useState(10);
  const [customTip, setCustomTip] = useState("");
  const [customDonation, setCustomDonation] = useState("");

  const [currentPoints, setCurrentPoints] = useState(() => {
   
    const storedPoints = localStorage.getItem("currentPoints");
    return storedPoints ? Number(storedPoints) : 1000;
  });

  const redeemOptions = [100, 200, 300, 400, 500, 600, 700, 800, 900];
  const tipOptions = [5, 10, 20, 50];
  const donationOptions = [5, 10, 20, 50];

  useEffect(() => {
  const total = cartItems.length
    ? cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    : 0;
  setSubtotal(total);

  const maxRedeem = Math.min(Math.floor(total * 0.3), currentPoints);
  if (redeemPoints > maxRedeem) {
    setRedeemPoints(maxRedeemOptions(maxRedeem));
  }

  if (redeemPoints > 0 && discount > 0) setDiscount(0);

  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  localStorage.setItem("currentPoints", currentPoints);
}, [cartItems, redeemPoints, discount, currentPoints]);

  useEffect(() => {
    const getSavedAddress = () => {
      const selected = JSON.parse(localStorage.getItem("selectedAddress"));
      const def = JSON.parse(localStorage.getItem("defaultAddress"));
      const all = JSON.parse(localStorage.getItem("addresses"));
      const address = selected || def || (all?.length ? all[0] : null);
      if (!address) return null;

      const fullAddress =
        address.fullAddress ||
        `${address.building || ""}, ${address.area || ""}, ${address.landmark || ""}, ${address.city || ""}`.replace(
          /,\s*,/g,
          ","
        );

      return { ...address, fullAddress: fullAddress.trim() };
    };

    setSavedAddress(getSavedAddress());
  }, [location]);

  const increaseQty = (id) =>
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
    );

  const decreaseQty = (id) =>
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item))
    );

const removeItem = (id) => {
  const updatedCart = cartItems.filter((item) => item.id !== id);
  setCartItems(updatedCart);
  localStorage.setItem("cartItems", JSON.stringify(updatedCart));

  // Reset totals if cart is now empty
  if (updatedCart.length === 0) {
    setSubtotal(0);
    setDeliveryCharge(0);
    setDiscount(0);
    setRedeemPoints(0);
    setDeliveryTip(5);
    setDonation(10);
  }
};

const saveForLater = (item) => {
  const updatedCart = cartItems.filter((i) => i.id !== item.id);
  setCartItems(updatedCart);
  localStorage.setItem("cartItems", JSON.stringify(updatedCart));

  const existing = savedItems.find((i) => i.name === item.name);
  const updatedSaved = existing
    ? savedItems.map((i) =>
        i.name === item.name ? { ...i, quantity: i.quantity + item.quantity } : i
      )
    : [...savedItems, item];
    
  setSavedItems(updatedSaved);
  localStorage.setItem("savedForLater", JSON.stringify(updatedSaved));

  // Reset totals if cart is now empty
  if (updatedCart.length === 0) {
    setSubtotal(0);
    setDeliveryCharge(0);
    setDiscount(0);
    setRedeemPoints(0);
    setDeliveryTip(5);
    setDonation(10);
  }
};

  const applyPromo = () => {
    if (redeemPoints > 0) return alert("Cannot apply promo code while redeeming points.");
    if (promoCode.toUpperCase() === "DISCOUNT50") {
      setDiscount(50);
      alert("Promo Applied! ₹50 discount added.");
    } else {
      alert("Invalid Promo Code!");
      setDiscount(0);
    }
  };

  const maxRedeemOptions = (maxRedeem) => {
    const validOptions = redeemOptions.filter((p) => p <= maxRedeem);
    return validOptions.length ? validOptions[validOptions.length - 1] : 0;
  };

  const redeemPointsHandler = (points) => {
    if (discount > 0) {
      alert("Cannot redeem points while a promo code is applied.");
      return;
    }
    setRedeemPoints(points);
  };

 const handleCheckout = () => {
  if (subtotal < 50) return alert("Order below ₹50 cannot checkout!");
  if (!canCheckout) return alert("You must add a Print order before checking out Lamination/Binding!");

  if (!savedAddress) {
    alert("Please add your delivery address!");
    return navigate("/address");
  }

  const dist = savedAddress?.distance || 0;
  const charge = calculateDeliveryCharge(subtotal, dist);

  const final = Math.max(
    subtotal + charge + deliveryTip + donation - discount - Math.min(redeemPoints, maxRedeem),
    0
  );

  const orderData = {
    cartItems,
    subtotal,
    deliveryTip,
    donation,
    redeemPoints,
    discount,
    deliveryCharge: charge,
    handlingFee: 0,
    gst: 0,
    totalAmount: final,
    address: savedAddress,
    note,
  };

  localStorage.setItem("currentOrder", JSON.stringify(orderData));
  navigate("/payment");
};


  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50">
        <h1 className="text-2xl font-semibold mb-3">🛒 Your cart is empty!</h1>
        <p className="text-gray-500 mb-5">Add items from the home page to see them here.</p>
        <button
          onClick={() => navigate("/home")}
          className="bg-orange-500 text-white px-6 py-3 rounded-2xl shadow hover:bg-orange-600 transition"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const maxRedeem = Math.min(Math.floor(subtotal * 0.3), currentPoints);
   // ✅ 👉 PASTE THE DELIVERY + DISTANCE CHARGE LOGIC HERE
  const distance = savedAddress?.distance || 0;
  const charge = cartItems.length ? calculateDeliveryCharge(subtotal, savedAddress?.distance || 0) : 0;

useEffect(() => {
  setDeliveryCharge(charge);
}, [subtotal, savedAddress, cartItems]);

const totalAmount = cartItems.length
  ? Math.max(
      subtotal + deliveryCharge + deliveryTip + donation - discount - Math.min(redeemPoints, maxRedeem),
      0
    )
  : 0;

  const availableRedeemOptions = discount > 0 ? [] : redeemOptions.filter((p) => p <= maxRedeem);

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
      <h1 className="text-xl font-bold">🛒 My Cart</h1>
      <span className="ml-auto bg-white text-orange-500 px-3 py-1 rounded-full text-sm font-semibold">
        {cartItems.length} items
      </span>
    </header>

    {/* Address Section */}
    {savedAddress ? (
      <div className="bg-white shadow-md rounded-2xl p-4 m-4 flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-500" /> Delivery Address
          </h3>
          <p className="text-gray-600 text-sm mt-1">{savedAddress.fullAddress}</p>
          <p className="text-gray-500 text-xs">{savedAddress.phone}</p>
        </div>
        <button
          onClick={() => navigate("/address")}
          className="bg-orange-100 text-orange-600 px-4 py-2 rounded-xl text-sm hover:bg-orange-200 transition"
        >
          Change
        </button>
      </div>
    ) : (
      <div className="bg-white shadow-md rounded-2xl p-4 m-4 text-center">
        <p className="text-gray-500 mb-2">No address found.</p>
        <button
          onClick={() => navigate("/address")}
          className="bg-orange-500 text-white px-5 py-2 rounded-xl shadow hover:bg-orange-600 transition"
        >
          ➕ Add Address
        </button>
      </div>
    )}

    {/* Cart Items */}
    <div className="flex-1 p-6 space-y-4 overflow-y-auto">
      <AnimatePresence>
        {cartItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="bg-white p-4 rounded-2xl shadow flex items-center gap-4 relative"
          >
            <img src={item.img} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
            <div className="flex-1">
              <h2 className="font-semibold text-lg">{item.name}</h2>
              <p className="text-gray-500">₹{item.price} each</p>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => decreaseQty(item.id)}
                  className="bg-orange-100 px-3 py-1 rounded-xl hover:bg-orange-200 transition"
                >
                  -
                </button>
                <span className="px-2">{item.quantity}</span>
                <button
                  onClick={() => increaseQty(item.id)}
                  className="bg-orange-100 px-3 py-1 rounded-xl hover:bg-orange-200 transition"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <p className="font-semibold">₹{item.price * item.quantity}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => saveForLater(item)}
                  className="text-blue-500 hover:text-blue-600 transition text-sm flex items-center gap-1"
                >
                  <Star className="w-4 h-4" /> Save
                </button>
                <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-600 transition">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Note for Merchant */}
      <div className="bg-white rounded-2xl shadow-md p-4 m-4 flex flex-col">
        <label className="font-semibold text-gray-700 mb-2">📝 Note for Restaurant / Merchant</label>
        <textarea
          placeholder="e.g., Please add extra spicy, no onions... (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-2 py-1 text-sm resize-none"
          rows={2}
        />
      </div>

      {/* Promo + Redeem */}
      <div className="bg-white rounded-2xl shadow-md p-5 flex gap-2 items-center">
        <input
          type="text"
          placeholder="Enter promo code"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          disabled={redeemPoints > 0}
          className={`flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
            redeemPoints > 0 ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
        />
        <button
          onClick={applyPromo}
          disabled={redeemPoints > 0}
          className={`bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition ${
            redeemPoints > 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <Tag className="w-4 h-4" /> Apply
        </button>
      </div>

      {/* Redeem Points */}
      <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col gap-3">
        <button className="px-4 py-2 rounded-xl bg-yellow-400 text-orange-700 font-semibold w-fit">
          Current Points: {currentPoints} | Remaining: {currentPoints - redeemPoints}
        </button>
        <span className="font-semibold text-gray-700">
          Redeem Points (Min ₹100, Max ₹{Math.floor(subtotal * 0.3)})
        </span>
        <div className="flex flex-wrap gap-2">
          {availableRedeemOptions.map((point) => (
            <motion.button
              key={point}
              onClick={() => redeemPointsHandler(point)}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              className={`px-4 py-2 rounded-xl font-semibold border transition-transform ${
                redeemPoints === point
                  ? "bg-white text-orange-500 border-orange-500"
                  : "bg-amber-500 text-white hover:bg-amber-600 border-amber-500"
              }`}
            >
              ₹{point}
            </motion.button>
          ))}
          {redeemPoints > 0 && (
            <button
              onClick={() => setRedeemPoints(0)}
              className="px-4 py-2 rounded-xl font-semibold bg-red-100 text-red-500 border border-red-300 hover:bg-red-200"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>

    {/* Scrollable Tip & Donation + Total */}
    <div className="bg-white rounded-t-3xl shadow-xl">
      <div className="max-h-[29vh] overflow-y-auto p-5 space-y-3 text-sm">
        <div className="flex justify-between">
          <span>🧾 Subtotal</span>
          <span className="text-orange-400 font-semibold">₹{subtotal}</span>
        </div>
              <div className="flex justify-between text-gray-500">
          <span>🚚 Delivery Charges</span>
          <span className="text-orange-400 font-semibold">₹{deliveryCharge}</span>
        </div>
       
<div className="flex justify-between text-sm">
  <span className="text-gray-600">📦 Handling Fee</span>
  <span className="flex items-center gap-3">
    <s className="text-red-500 font-medium">₹20</s>
    <span className="text-orange-400 font-semibold">₹0</span>
  </span>
</div>
   <div className="flex justify-between text-gray-500">
    <span>💸 GST</span>
    <span className="text-orange-400 font-semibold">₹0</span>
  </div>
        <div className="flex justify-between text-gray-500">
          <span>🎟️ Promo Discount</span>
         <span className="text-orange-400 font-semibold">-₹{discount}</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>💎 Redeem Points</span>
        <span className="text-orange-400 font-semibold">-₹{redeemPoints}</span>
        </div>

       {/* ✅ Delivery Tip Section */}
<div className="flex flex-col gap-2">
  <div className="flex items-center gap-3 text-gray-500">
    <span>🤝 Delivery Partner Tip</span>
    <div className="flex gap-2 flex-wrap items-center">
      {[5, 10, 20, 30, 50].map((tip) => (
        <button
          key={tip}
          onClick={() => { setDeliveryTip(tip); setCustomTip(""); }}
          className={`px-3 py-1 rounded-xl text-sm font-semibold border transition ${
            deliveryTip === tip
              ? "bg-orange-500 text-white border-orange-500"
              : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
          }`}
        >
          ₹{tip}
        </button>
      ))}
      <input
        type="number"
        placeholder="Other"
        value={customTip}
        onChange={(e) => { setCustomTip(e.target.value); setDeliveryTip(Number(e.target.value)); }}
        className="w-16 px-2 py-1 border border-gray-300 rounded-xl text-sm"
      />
    </div>
  </div>
  {/* Display selected tip & remove button below buttons */}
  {deliveryTip > 0 && (
    <div className="flex items-center gap-2 text-sm text-orange-500 ml-2">
      <span>+₹{deliveryTip} added</span>
      <button
        onClick={() => { setDeliveryTip(0); setCustomTip(""); }}
        className="text-red-500 underline hover:text-red-600"
      >
        Remove
      </button>
    </div>
  )}
</div>

{/* ✅ Donate Section */}
<div className="flex flex-col gap-2 mt-2">
  <div className="flex items-center gap-3 text-gray-500">
    <span>🍱 Donate for a Plate of Food</span>
    <div className="flex gap-2 flex-wrap items-center">
      {[5, 10, 20, 30, 50].map((d) => (
        <button
          key={d}
          onClick={() => { setDonation(d); setCustomDonation(""); }}
          className={`px-3 py-1 rounded-xl text-sm font-semibold border transition ${
            donation === d
              ? "bg-amber-500 text-white border-amber-500"
              : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
          }`}
        >
          ₹{d}
        </button>
      ))}
      <input
        type="number"
        placeholder="Other"
        value={customDonation}
        onChange={(e) => { setCustomDonation(e.target.value); setDonation(Number(e.target.value)); }}
        className="w-16 px-2 py-1 border border-gray-300 rounded-xl text-sm"
      />
    </div>
  </div>
  {/* Display selected donation & remove button below buttons */}
  {donation > 0 && (
    <div className="flex items-center gap-2 text-sm text-orange-500 ml-2">
      <span>+₹{donation} added</span>
      <button
        onClick={() => { setDonation(0); setCustomDonation(""); }}
        className="text-red-500 underline hover:text-red-600"
      >
        Remove
      </button>
    </div>
  )}
</div>

      </div>

      {/* Fixed Total and Checkout */}
      <div className="border-t p-5 flex flex-col gap-3 bg-white rounded-b-3xl">
        <div className="flex justify-between font-bold text-lg">
          <span>💰 Total</span>
         <span className="text-orange-400 font-semibold">₹{totalAmount}</span>
        </div>
       <button
  disabled={!canCheckout}
  onClick={handleCheckout}
  className={`w-full text-white py-3 rounded-2xl font-bold shadow transition ${
    canCheckout
      ? "bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 cursor-pointer"
      : "bg-gray-400 cursor-not-allowed opacity-60"
  }`}
>
  {canCheckout ? "Checkout" : "Printing Required to Checkout ⚠️"}
</button>

      </div>
    </div>
  </div>
);
}