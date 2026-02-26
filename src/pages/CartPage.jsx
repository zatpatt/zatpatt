//src/pages/CartPage.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Trash2, Tag, Star, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getCartList,
  updateCartApi,
  removeCartItemApi,
} from "../services/cartApi";
import { getAddressList } from "../services/addressApi";
import { getPromoCodes } from "../services/promoApi";
import { initiatePaymentApi } from "../services/paymentApi";
import { newCartListApi } from "../services/allInOneCartApi";

export default function CartPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [cartItems, setCartItems] = useState([]);
  const [cartSummary, setCartSummary] = useState(null);
  const [merchant, setMerchant] = useState(null);
  const [distanceKm, setDistanceKm] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [isServiceable, setIsServiceable] = useState(true);
  const [serviceMessage, setServiceMessage] = useState("");
  const [pointsInfo, setPointsInfo] = useState(null);
  const [promoInfo, setPromoInfo] = useState(null);
  const promoDiscount = promoInfo?.discount_amount ?? 0;
  const promoCodeApplied = promoInfo?.code ?? null;
  const [promoCodes, setPromoCodes] = useState([]);
  const [selectedPromo, setSelectedPromo] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [selectedPoints, setSelectedPoints] = useState(0); // NUMBER
  const [appliedPromo, setAppliedPromo] = useState(null); // string | null


   const [savedAddress, setSavedAddress] = useState(null);
   
  // ✅ RULE: if Lamination or Binding is in cart, printing must also exist to checkout
// ✅ SAFE — savedAddress now exists
const hasPrint = cartItems.some(item => item.type === "print");

const hasLaminationOrBinding = cartItems.some(
  item => item.type === "lamination" || item.type === "binding"
);

const canCheckout = !hasLaminationOrBinding || hasPrint;

const canProceedToPayment =
  canCheckout &&
  !!savedAddress?.address_id &&
  isServiceable;


const [savedItems, setSavedItems] = useState(() => {
  const stored = localStorage.getItem("savedForLater");
  return stored ? JSON.parse(stored) : [];
});

// const [deliveryCharge, setDeliveryCharge] = useState(0);

// const calculateDeliveryCharge = (subtotal, distance) => {
//   if (subtotal < 50) return 0; // block checkout case (no proceed)

//   // Subtotal slab
//   let slab = 0;
//   if (subtotal >= 1000) slab = 0;
//   else if (subtotal >= 500 && subtotal <= 999) slab = 40;
//   else if (subtotal >= 150 && subtotal <= 499) slab = 50;
//   else if (subtotal >= 50 && subtotal <= 149) slab = 30;

//   // If free delivery
//   if (slab === 0) return 0;

//   // Distance add-on
//   let distAdd = 0;
//   if (distance > 6 && distance <= 10) distAdd = 30;
//   else if (distance > 10 && distance <= 16) distAdd = 40;
//   else if (distance > 16 && distance <= 20) distAdd = 70;
//   else if (distance >= 20) distAdd = 100;

//   return slab + distAdd;
// };

  // ✅ Points source (backend-first, safe fallback)
  const availablePoints = pointsInfo?.available_points ?? 0;
  const usedPoints = pointsInfo?.points_used ?? 0;
  const backendDiscount = pointsInfo?.discount_amount ?? 0;

  // const [promoCode, setPromoCode] = useState("");
  // const [discount, setDiscount] = useState(0);
  // const [redeemPoints, setRedeemPoints] = useState(0);
  const [note, setNote] = useState("");

  // Default ₹5 tip and ₹10 donation
  const [deliveryTip, setDeliveryTip] = useState(5);
  const [donation, setDonation] = useState(10);
  const [customTip, setCustomTip] = useState("");
  const [customDonation, setCustomDonation] = useState("");
  
  const isPromoApplied = promoDiscount > 0;
  const isPointsApplied = usedPoints > 0;

  const redeemOptions = [100, 200, 300, 400, 500, 600, 700, 800, 900];
  const tipOptions = [5, 10, 20, 50];
  const donationOptions = [5, 10, 20, 50];

//   useEffect(() => {
//   const total = cartItems.length
//     ? cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
//     : 0;
//   setSubtotal(total);

//   // const maxRedeem = Math.min(Math.floor(total * 0.3), currentPoints);
//   // if (redeemPoints > maxRedeem) {
//   //   setRedeemPoints(maxRedeemOptions(maxRedeem));
//   // }

//   if (redeemPoints > 0 && discount > 0) setDiscount(0);

//   localStorage.setItem("cartItems", JSON.stringify(cartItems));
//   localStorage.setItem("currentPoints", currentPoints);
// }, [cartItems, redeemPoints, discount, currentPoints]);

const refreshCart = async ({
  points = selectedPoints,
  promo = appliedPromo,
  tip = deliveryTip,
} = {}) => {

  const cartType = localStorage.getItem("cartType");

  if (!savedAddress?.address_id) return;

  let res;

  if (cartType === "qc") {
    // 🔵 QC FLOW
    res = await newCartListApi({
      address_id: savedAddress.address_id,
      use_points: points,
      tip,
      code: promo,
    });
  } else {
    // 🟠 RESTAURANT FLOW
    res = await getCartList({
      address_id: savedAddress.address_id,
      use_points: points,
      tip,
      code: promo,
    });
  }

  if (!res?.status) return;

  setPointsInfo(res.points || null);
  setPromoInfo(res.promo || null);
  setCartSummary(res.summary || null);

  setCartItems(
    (res.items || []).map((i) => ({
      id: i.cart_item_id,
      name: i.name,
      image: i.image,
      unitPrice: i.unit_price,
      quantity: i.quantity,
      total: i.total_price,
      type: i.type,
    }))
  );

  setDeliveryFee(res.delivery?.delivery_fee ?? 0);
  setDistanceKm(res.delivery?.distance_km ?? 0);
  setIsServiceable(res.delivery?.is_serviceable ?? true);
  setServiceMessage(res.delivery?.message ?? "");
};

useEffect(() => {
  if (!savedAddress?.address_id) return;

  refreshCart({
    tip: deliveryTip,
  });
}, [deliveryTip]);

useEffect(() => {
  if (!savedAddress?.address_id) return;

  refreshCart({
    donationAmount: donation,
  });
}, [donation]);

 useEffect(() => {
  const fetchAddresses = async () => {
    try {
      const res = await getAddressList();

      if (!res.status || !res.addresses?.length) {
        setSavedAddress(null);
        return;
      }

      // 1️⃣ Priority: previously selected address
      const selectedId = JSON.parse(
        localStorage.getItem("selectedAddressId")
      );

      let address =
        res.addresses.find(a => a.address_id === selectedId) ||
        res.addresses.find(a => a.is_default) ||
        res.addresses[0];

      const fullAddress = `${address.building}, ${address.area}, ${address.landmark}, ${address.city}`;

      setSavedAddress({
        ...address,
        phone: address.mobile,
        fullAddress,
      });
    } catch (err) {
      console.error("Address list fetch failed", err);
      setSavedAddress(null);
    }
  };

  fetchAddresses();
}, [location]);

const increaseQty = async (item) => {
  const cartType = localStorage.getItem("cartType");

  if (cartType === "qc") {
    await newAddToCartApi({
      productIds: [item.id],
      quantity: item.quantity + 1,
    });
  } else {
    await updateCartApi({
      cart_item_id: item.id,
      quantity: item.quantity + 1,
    });
  }

  await refreshCart();
};

const decreaseQty = async (item) => {
  const cartType = localStorage.getItem("cartType");

  if (cartType === "qc") {
    await newAddToCartApi({
      productIds: [item.id],
      quantity: item.quantity - 1,
    });
  } else {
    await updateCartApi({
      cart_item_id: item.id,
      quantity: item.quantity - 1,
    });
  }

  await refreshCart();
};


const removeItem = async (item) => {
  try {
    await removeCartItemApi({
      cart_item_id: item.id,
    });
    await refreshCart();
  } catch (err) {
    console.error("Remove item failed", err);
  }
};


useEffect(() => {
  if (!savedAddress?.address_id) return;

  setLoading(true);

  refreshCart().finally(() => {
    setLoading(false);
  });

}, [savedAddress]);


// useEffect(() => {
//   const fetchCart = async () => {
//     try {
//       setLoading(true);

//      const res = await getCartList({
//   address_id: savedAddress?.address_id || null,
//   use_points: selectedPoints || 0,
//   code: appliedPromo || null,
// });


//       if (!res || !res.status) return;
//       setPointsInfo(res.points || null);
//       setPromoInfo(res.promo || null);

//       // ✅ Always show cart
//       setCartItems(
//         (res.items || []).map((i) => ({
//           id: i.cart_item_id,
//           name: i.name,
//           image: i.image,
//           actualPrice: i.actual_price,
//           unitPrice: i.unit_price,
//           quantity: i.quantity,
//           total: i.total_price,
//           type: i.type,
//         }))
//       );

//       setCartSummary(res.summary || null);

//       const delivery = res.delivery || {};

//       setDeliveryFee(delivery.delivery_fee ?? 0);
//       setDistanceKm(delivery.distance_km ?? 0);

//       if (delivery.is_serviceable === false) {
//         setIsServiceable(false);
//         setServiceMessage(
//           delivery.message || "This location is not serviceable."
//         );
//       } else {
//         setIsServiceable(true);
//         setServiceMessage("");
//       }
//     } catch (err) {
//       console.error("Cart fetch error", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchCart();
// }, [savedAddress]);

const applyPromo = async () => {
  if (!selectedPromo) return alert("Select a promo code");

  setSelectedPoints(0);
  setAppliedPromo(selectedPromo);

  await refreshCart({
    points: 0,
    promo: selectedPromo,
  });
};


useEffect(() => {
  const fetchPromos = async () => {
    try {
      const res = await getPromoCodes();
      if (res?.status) {
        setPromoCodes(res.data || []);
      }
    } catch (e) {
      console.error("Promo fetch failed", e);
    }
  };

  fetchPromos();
}, []);


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
    // setSubtotal(0);
    // setDeliveryCharge(0);
    // setDiscount(0);
    // setRedeemPoints(0);
    setDeliveryTip(5);
    setDonation(10);
  }
};

  // const applyPromo = () => {
  //   if (redeemPoints > 0) return alert("Cannot apply promo code while redeeming points.");
  //   if (promoCode.toUpperCase() === "DISCOUNT50") {
  //     setDiscount(50);
  //     alert("Promo Applied! ₹50 discount added.");
  //   } else {
  //     alert("Invalid Promo Code!");
  //     setDiscount(0);
  //   }
  // };

  // const maxRedeemOptions = (maxRedeem) => {
  //   const validOptions = redeemOptions.filter((p) => p <= maxRedeem);
  //   return validOptions.length ? validOptions[validOptions.length - 1] : 0;
  // };

//  const redeemPointsHandler = async () => {
//   if (promoDiscount > 0) {
//     alert("Cannot redeem points while a promo code is applied.");
//     return;
//   }

//   setUsePoints(true);
//   await refreshCart(true); // ✅ force backend to apply points
// };

const handleRedeemPoints = async (points) => {
  if (appliedPromo) {
    alert("Remove promo code to redeem points");
    return;
  }

  setSelectedPromo("");
  setAppliedPromo(null);
  setSelectedPoints(points);

  await refreshCart({
    points,
    promo: null,
  });
};


//  const handleCheckout = () => {
//   if (subtotal < 50) return alert("Order below ₹50 cannot checkout!");
//   if (!canCheckout) return alert("You must add a Print order before checking out Lamination/Binding!");

//   if (!savedAddress) {
//     alert("Please add your delivery address!");
//     return navigate("/address");
//   }

//   const dist = savedAddress?.distance || 0;
//   const charge = calculateDeliveryCharge(subtotal, dist);

//   const final = Math.max(
//     subtotal + charge + deliveryTip + donation - discount - Math.min(redeemPoints, maxRedeem),
//     0
//   );

//   const orderData = {
//     cartItems,
//     subtotal,
//     deliveryTip,
//     donation,
//     redeemPoints,
//     discount,
//     deliveryCharge: charge,
//     handlingFee: 0,
//     gst: 0,
//     totalAmount: final,
//     address: savedAddress,
//     note,
//   };

//   localStorage.setItem("currentOrder", JSON.stringify(orderData));
//   navigate("/payment");
// };

const handleCheckout = () => {
  if (!savedAddress?.address_id) {
    alert("Please add a delivery address");
    return;
  }

  // ✅ Store ONLY preview data
  localStorage.setItem(
    "currentOrder",
    JSON.stringify({
      address_id: savedAddress.address_id,
      use_points: selectedPoints || 0,
      tip: deliveryTip || 0,
      donation,
      code: appliedPromo || null,
      payment_method: "COD",
      remark: note || "",

      // 👇 IMPORTANT: store preview total
      preview_total: cartSummary?.total_amount ?? 0,
    })
  );

  navigate("/payment");
};


useEffect(() => {
  if (promoCodeApplied) {
    setSelectedPromo(promoCodeApplied);
    setAppliedPromo(promoCodeApplied);
  }
}, [promoCodeApplied]);

 if (cartItems.length === 0 && isServiceable) {
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


  const subtotal = cartSummary?.subtotal ?? 0;
  const canUseRedeemPoints = subtotal >= 499;

  const maxRedeem = canUseRedeemPoints
  ? Math.min(Math.floor(subtotal * 0.3), availablePoints)
  : 0;

  const REDEEM_UNLOCK_AMOUNT = 499;

const redeemProgress = Math.min(
  (subtotal / REDEEM_UNLOCK_AMOUNT) * 100,
  100
);

const remainingToUnlock = Math.max(
  REDEEM_UNLOCK_AMOUNT - subtotal,
  0
);

   // ✅ 👉 PASTE THE DELIVERY + DISTANCE CHARGE LOGIC HERE
  const distance = savedAddress?.distance || 0;
  // const charge = cartItems.length ? calculateDeliveryCharge(subtotal, savedAddress?.distance || 0) : 0;

// useEffect(() => {
//   setDeliveryCharge(charge);
// }, [subtotal, savedAddress, cartItems]);

// const totalAmount = cartItems.length
//   ? Math.max(
//       subtotal + deliveryCharge + deliveryTip + donation - discount - Math.min(redeemPoints, maxRedeem),
//       0
//     )
//   : 0;

const pointsLocked = usedPoints > 0;

  const availableRedeemOptions =
  promoDiscount > 0
    ? []
    : redeemOptions.filter((p) => p <= maxRedeem);


  if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Loading cart…</p>
    </div>
  );
}

const gstRate = 0.12;
const gstAmount = Math.round((cartSummary?.subtotal || 0) * gstRate);

// 🔴 Fake inflated delivery (21% more) – UI only
const inflatedDeliveryFee =
  deliveryFee > 0 ? Math.round(deliveryFee * 1.21) : 0;

const isRedeemDisabled = !canUseRedeemPoints || isPromoApplied;


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
  <div
    className={`shadow-md rounded-2xl p-4 m-4 flex justify-between items-start border ${
      isServiceable
        ? "bg-white border-gray-200"
        : "bg-red-50 border-red-400"
    }`}
  >
    <div>
      <h3
        className={`font-semibold flex items-center gap-2 ${
          isServiceable ? "text-gray-800" : "text-red-600"
        }`}
      >
        <MapPin className="w-5 h-5" />
        Delivery Address
      </h3>

      <p
        className={`text-sm mt-1 ${
          isServiceable ? "text-gray-600" : "text-red-600"
        }`}
      >
        {savedAddress.fullAddress}
      </p>

      <p className="text-xs text-gray-500">{savedAddress.phone}</p>

      {!isServiceable && (
        <p className="mt-2 text-sm font-semibold text-red-600">
          ❌ {serviceMessage}
        </p>
      )}
    </div>

    <button
      onClick={() => navigate("/address")}
      className={`px-4 py-2 rounded-xl text-sm transition ${
        isServiceable
          ? "bg-orange-100 text-orange-600 hover:bg-orange-200"
          : "bg-red-100 text-red-600 hover:bg-red-200"
      }`}
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
           <img
              src="/food-placeholder.png"
              alt={item.name}
              className="w-20 h-20 rounded-xl object-cover"
            />
            <div className="flex-1">
              <h2 className="font-semibold text-lg">{item.name}</h2>
              <div className="flex items-center gap-2">
                {item.actualPrice > item.unitPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    ₹{item.actualPrice}
                  </span>
                )}

                <span className="text-sm text-orange-500 font-semibold">
                  ₹{item.unitPrice} each
                </span>
              </div>             

              <div className="flex items-center gap-2 mt-2">
                <button
                onClick={() => decreaseQty(item)}
                className="bg-orange-100 px-3 py-1 rounded-xl"
              >
                -
              </button>

              <span className="px-2">{item.quantity}</span>

              <button
                onClick={() => increaseQty(item)}
                className="bg-orange-100 px-3 py-1 rounded-xl"
              >
                +
              </button>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <p className="font-semibold">₹{item.total}</p>
              {item.actualPrice > item.unitPrice && (
              <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 
                 rounded-full bg-green-50 text-green-700 text-xs font-semibold">
  💸 You saved ₹{(item.actualPrice - item.unitPrice) * item.quantity}
</span>

            )}

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => saveForLater(item)}
                  className="text-blue-500 hover:text-blue-600 transition text-sm flex items-center gap-1"
                >
                  <Star className="w-4 h-4" /> Save
                </button>
                <button
                onClick={() => removeItem(item)}
                className="text-red-500 hover:text-red-600 transition"
              >
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

    {/* ✅ Promo Code Section */}
<div className="bg-white rounded-2xl shadow-md p-5 flex gap-3 items-center">
  <select
    value={selectedPromo}
    onChange={(e) => setSelectedPromo(e.target.value)}
    disabled={selectedPoints > 0}
    className="flex-1 px-4 py-2 rounded-xl border border-gray-300"
  >
    <option value="">Select promo code</option>
    {promoCodes.map((p) => (
      <option key={p.code} value={p.code}>
        {p.code}
      </option>
    ))}
  </select>

  {!isPromoApplied ? (
    <button
      onClick={applyPromo}
      disabled={!selectedPromo}
      className={`px-4 py-2 rounded-xl font-semibold ${
        selectedPromo
          ? "bg-orange-500 text-white"
          : "bg-gray-300 text-gray-500 cursor-not-allowed"
      }`}
    >
      Apply
    </button>
  ) : (
    <button
  onClick={async () => {
    setAppliedPromo(null);
    setSelectedPromo("");
    setSelectedPoints(0);

    await refreshCart({
      promo: null,
      points: 0,
    });
  }}
  className="text-red-500 underline text-sm"
>
  Remove
</button>
  )}
</div>

{selectedPoints > 0 && (
  <div className="mt-2 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2">
    ⚠️ Promo codes are not available when reward points are used.
  </div>
)}


      {/* Redeem Points */}
      <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col gap-3">
        <button className="px-4 py-2 rounded-xl bg-yellow-400 text-orange-700 font-semibold w-fit">
          Current Points: {availablePoints} | Remaining: {availablePoints - usedPoints}
        </button>
        {/* <span className="font-semibold text-gray-700">
          Redeem Points (Min ₹100, Max ₹{Math.floor((cartSummary?.subtotal || 0) * 0.3)})
        </span> */}
       <div className="flex flex-wrap gap-2">
  {redeemOptions
  .filter(
    (point) =>
      point <= availablePoints &&
      point <= maxRedeem
  )
  .map((point) => (
    <button
      key={point}
      disabled={isRedeemDisabled}
      onClick={() => handleRedeemPoints(point)}
      className={`px-4 py-2 rounded-xl font-semibold transition
        ${
          selectedPoints === point
            ? "bg-orange-500 text-white"
            : isRedeemDisabled
            ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-60"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
        }
      `}
    >
      {point}
    </button>
  ))}
{/* 🔓 Redeem Unlock Progress */}
{!canUseRedeemPoints && (
  <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
    <p className="text-xs font-semibold text-orange-700 mb-2">
      🔒 Redeem points unlock at ₹{REDEEM_UNLOCK_AMOUNT}
    </p>

    {/* Progress Bar */}
    <div className="w-full bg-orange-100 rounded-full h-2 overflow-hidden">
      <div
        className="bg-orange-500 h-2 rounded-full transition-all duration-500"
        style={{ width: `${redeemProgress}%` }}
      />
    </div>

    <p className="text-xs text-orange-600 mt-2">
      Add <span className="font-bold">₹{remainingToUnlock}</span> more to unlock redeem points
    </p>
  </div>
)}

{canUseRedeemPoints && (
  <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700 font-semibold">
    🎉 Redeem points unlocked! Use your rewards now.
  </div>
)}

{subtotal >= 399 && !canUseRedeemPoints && (
  <div className="animate-pulse text-sm text-orange-600 font-semibold">
    ⚡ Almost there! Just ₹{remainingToUnlock} more to unlock rewards
  </div>
)}

  {selectedPoints > 0 && (
    <button
      onClick={async () => {
  setSelectedPoints(0);
  await refreshCart({ points: 0 });
}}
      className="px-4 py-2 rounded-xl font-semibold bg-red-100 text-red-500 border border-red-300"
    >
      Remove
    </button>
  )}
</div>

    </div>  
    {isPromoApplied && (
  <div className="mt-2 bg-orange-50 border border-orange-200 text-orange-700 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2">
    🚫 Reward points are disabled because a promo code is applied.
  </div>
)}
    </div>


    {/* Scrollable Tip & Donation + Total */}
    <div className="bg-white rounded-t-3xl shadow-xl">
      <div className="max-h-[29vh] overflow-y-auto p-5 space-y-3 text-sm">
        <div className="flex justify-between">
          <span>🧾 Subtotal</span>
          <span className="text-orange-400 font-semibold">₹{cartSummary?.subtotal ?? 0}</span>
        </div>
         <div className="flex justify-between items-center text-sm">
  <span className="text-gray-600">
  🚚 Delivery Charges{" "}
  {distanceKm > 0 && (
    <span className="text-xs text-gray-400">
      ({distanceKm} km)
    </span>
  )}
</span>


  <span className="flex items-center gap-2">
    {/* 21% inflated (striked) */}
    {deliveryFee > 0 && (
  <span className="text-red-500 line-through font-medium">
    ₹{inflatedDeliveryFee}
    </span>
  )}

    {/* Actual backend delivery fee */}
    <span className="text-orange-400 font-semibold">
      ₹{deliveryFee}
    </span>
  </span>
</div>
       
<div className="flex justify-between text-sm">
  <span className="text-gray-600">📦 Handling Fee</span>
  <span className="flex items-center gap-3">
    <s className="text-red-500 font-medium">₹20</s>
    <span className="text-orange-400 font-semibold">₹0</span>
  </span>
</div>
  <div className="flex justify-between items-center text-sm">
  <span className="text-gray-600">💸 GST (12%)</span>

  <span className="flex items-center gap-2">
    {/* Striked actual GST */}
    <span className="text-red-500 line-through font-medium">
      ₹{gstAmount}
    </span>

    {/* Applied GST */}
    <span className="text-orange-400 font-semibold">
      ₹0
    </span>
  </span>
</div>

       {promoDiscount > 0 && (
  <div className="flex justify-between text-gray-500">
    <span>🎟️ Promo ({promoCodeApplied})</span>
    <span className="text-orange-400 font-semibold">
      -₹{promoDiscount}
    </span>
  </div>
)}

<div className="flex justify-between text-gray-500">
  <span>💎 Redeem Points</span>
  <span className="text-orange-400 font-semibold">
   -₹{backendDiscount}
  </span>
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
       onChange={(e) => {
        const value = Number(e.target.value);
        setCustomTip(e.target.value);
        setDeliveryTip(isNaN(value) ? 0 : value);
      }}
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

{donation > 0 && (
  <div className="mt-2 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-xl text-sm font-semibold">
    ❤️ Thank you for donating a plate of food!
  </div>
)}
      </div>

      {/* Fixed Total and Checkout */}
      <div className="border-t p-5 flex flex-col gap-3 bg-white rounded-b-3xl">
        <div className="flex justify-between font-bold text-lg">
          <span>💰 Total</span>
         <span className="text-orange-400 font-semibold">₹{cartSummary?.total_amount ?? 0}</span>
        </div>
      <button
    disabled={!canProceedToPayment}
    onClick={handleCheckout}
    className={`w-full text-white py-3 rounded-2xl font-bold shadow transition ${
      canProceedToPayment
      ? "bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500"
      : "bg-gray-400 cursor-not-allowed opacity-60"
  }`}
>
  {!savedAddress
    ? "Add Address to Continue ⚠️"
    : !isServiceable
    ? "Location Not Serviceable 🚫"
    : canCheckout
    ? "Checkout"
    : "Printing Required to Checkout ⚠️"}
</button>

      </div>
    </div>
  </div>
);
}  
