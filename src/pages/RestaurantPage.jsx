// src/pages/RestaurantPage.jsx

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { motion } from "framer-motion";
import ShimmerLoader from "../components/ShimmerLoader";
import { getMerchantMenu } from "../services/merchantMenuApi";
import {
  addToCartApi,
  updateCartApi,
  goToCartApi,
} from "../services/cartApi";

/*
  RestaurantPage.jsx
  - Full accordion category UI (only one open at a time)
  - Top "Recommended" strip (5-6 items) visible/open by default
  - Item detail modal
  - + / - quantity controls integrated with localStorage cart
  - Bottom "Go to Cart" bar (no checkout)
  - Uses uploaded demo image path for placeholders:
    /mnt/data/2844d68d-ced3-46d2-9586-a884205db1dd.png
*/

export default function RestaurantPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const demoUploadedImage = "/mnt/data/2844d68d-ced3-46d2-9586-a884205db1dd.png";

  const [loading, setLoading] = useState(true);
  const [restaurantData, setRestaurantData] = useState(null);

  // accordion state: which category id is open (only one at a time)
  const [openCategory, setOpenCategory] = useState(null);

  // menu search/filter/sort
  const [query, setQuery] = useState("");
  const [vegOnlyFilter, setVegOnlyFilter] = useState("All"); // All / Veg / NonVeg
  const [sortBy, setSortBy] = useState("recommended");

  const [showReplacePopup, setShowReplacePopup] = useState(false);
  const [pendingItem, setPendingItem] = useState(null);

  const cartMerchantId = localStorage.getItem("cartMerchantId");
  const cartMerchantName = localStorage.getItem("cartMerchantName");

  // cart (persisted in localStorage)
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cartItems") || "[]");
    } catch {
      return [];
    }
  });

  // ✅ KEEP CART SYNCED WITH LOCAL STORAGE
useEffect(() => {
  localStorage.setItem("cartItems", JSON.stringify(cart));
}, [cart]);



  const getCartItem = (menuId) => {
  return cart.find(c => c.id === menuId);
};

  // item detail modal
  const [detailItem, setDetailItem] = useState(null);

  // refs for smooth scrolling to category if needed later
  const categoryRefs = useRef({});

  // ---------- Demo data ----------
   
  // ---------- Load restaurant + menu ----------
  useEffect(() => {
  const fetchMenu = async () => {
    try {
      setLoading(true);

      const res = await getMerchantMenu(id);

      if (!res.status) {
        alert("Failed to load menu");
        return;
      }

      // 🔁 Backend → UI mapping
      const categories = [
  {
    id: "recommended",
    name: "Recommended",
    items: res.data.map((item) => ({
      id: item.menu_id,
      name: item.menu_name,
     price: Number(item.discounted_price || item.menu_price),
      originalPrice: Number(item.menu_price),
      hasDiscount:
      item.discounted_price &&
      Number(item.discounted_price) < Number(item.menu_price),
      veg: item.is_veg,
      rating: 0,
      desc: item.menu_description || "",
      img:
      item.menu_image && item.menu_image.trim() !== ""
        ? `${import.meta.env.VITE_API_BASE_URL}${item.menu_image}`
        : demoUploadedImage,
      label: item.label, // optional future use
        })),
      },
    ];

      setRestaurantData({
        id,
        name: "Restaurant",
        rating: 4.2,
        time: 30,
        distance: "-",
        banner: "https://images.unsplash.com/photo-1544025162-d76694265947",
        menu: { categories },
      });


      // open Recommended if exists
      const hasRecommended = categories.find(
        (c) => c.id === "recommended"
      );
      setOpenCategory(hasRecommended ? "recommended" : categories[0]?.id);

    } catch (err) {
      console.error(err);
      alert("Server error while loading menu");
    } finally {
      setLoading(false);
    }
  };

  fetchMenu();
}, [id]);


  // persist cart to localStorage
  useEffect(() => {
    const cartCount = cart.reduce((s, it) => s + it.quantity, 0);
  }, [cart]);

  const syncCartUI = (itemId, delta) => {
  setCart(prev => {
    const found = prev.find(p => p.id === itemId);

    if (!found && delta > 0) {
      return [...prev, { id: itemId, quantity: delta }];
    }

    if (!found) return prev;

    const newQty = found.quantity + delta;

    if (newQty <= 0) {
      return prev.filter(p => p.id !== itemId);
    }

    return prev.map(p =>
      p.id === itemId ? { ...p, quantity: newQty } : p
    );
  });
};

const goToCart = async () => {
  const selected =
    JSON.parse(localStorage.getItem("selectedAddress")) ||
    JSON.parse(localStorage.getItem("defaultAddress"));

  if (!selected?.address_id) {
    alert("Please add delivery address first");
    navigate("/address");
    return;
  }

  try {
    const res = await goToCartApi();

    if (!res.status) {
      alert("Unable to open cart");
      return;
    }

    // 🔐 Store cart snapshot (optional but recommended)
    localStorage.setItem(
      "activeCart",
      JSON.stringify({
        cart_id: res.cart_id,
        merchant: res.merchant,
        summary: res.summary,
      })
    );

    navigate("/cart");
  } catch (err) {
    console.error("Go to cart failed", err);
    alert("Unable to open cart. Try again.");
  }
};


const addToCart = async (item) => {
  const currentRestaurantId = String(id); // ✅ normalize
  const existingMerchantId = String(
    localStorage.getItem("cartMerchantId") || ""
  );

  // 🛑 Show popup ONLY if cart belongs to ANOTHER restaurant
  if (
    cart.length > 0 &&
    existingMerchantId &&
    existingMerchantId !== currentRestaurantId
  ) {
    setPendingItem(item);
    setShowReplacePopup(true);
    return;
  }

  const currentQty = quantityOf(item.id);

  try {
    syncCartUI(item.id, 1);

    await addToCartApi({
      menuIds: [item.id],
      productIds: [],
      quantity: currentQty + 1,
    });

    // ✅ Save merchant id ONCE and consistently
    localStorage.setItem("cartMerchantId", currentRestaurantId);
    localStorage.setItem("cartMerchantName", restaurantData.name);
  } catch (err) {
    syncCartUI(item.id, -1);
    alert("Failed to add item");
  }
};

useEffect(() => {
  if (cart.length === 0) {
    localStorage.removeItem("cartMerchantId");
    localStorage.removeItem("cartMerchantName");
  }
}, [cart]);


const confirmReplaceCart = async () => {
  try {
    // 🔥 Clear frontend cart
    setCart([]);
    localStorage.removeItem("cartItems");

    // 🔥 Clear backend cart
    await goToCartApi(); // backend resets cart session

    // 🔥 Reset merchant
    localStorage.setItem("cartMerchantId", id);
    localStorage.setItem("cartMerchantName", restaurantData.name);

    setShowReplacePopup(false);

    // 🔁 Add item after clearing
    if (pendingItem) {
      await addToCart(pendingItem);
      setPendingItem(null);
    }
  } catch (err) {
    console.error(err);
    alert("Failed to replace cart");
  }
};

const cancelReplaceCart = () => {
  setShowReplacePopup(false);
  setPendingItem(null);
};


const removeOne = async (item) => {
  const currentQty = quantityOf(item.id);
  if (currentQty <= 0) return;

  try {
    syncCartUI(item.id, -1);

    await addToCartApi({
      menuIds: [item.id],
      productIds: [],
      quantity: currentQty - 1,
    });
  } catch (err) {
    syncCartUI(item.id, 1); // rollback
    alert("Failed to update item");
  }
};


  const quantityOf = (itemId) => {
    const it = cart.find(c => c.id === itemId);
    return it ? it.quantity : 0;
  };


  // filtered categories & items according to search/filter/sort
  const filteredCategories = useMemo(() => {
    if (!restaurantData) return [];
    const cats = (restaurantData.menu.categories || []).map(cat => {
      let items = (cat.items || []).slice();

      // veg filter
      if (vegOnlyFilter === "Veg") items = items.filter(i => i.veg);
      else if (vegOnlyFilter === "NonVeg") items = items.filter(i => !i.veg);

      // query
      if (query.trim()) {
        const q = query.toLowerCase();
        items = items.filter(i => i.name.toLowerCase().includes(q) || (i.desc || "").toLowerCase().includes(q));
      }

      // sort
      if (sortBy === "price-asc") items.sort((a,b) => a.price - b.price);
      else if (sortBy === "price-desc") items.sort((a,b) => b.price - a.price);
      else if (sortBy === "rating") items.sort((a,b) => (b.rating||0) - (a.rating||0));

      return { ...cat, items };
    });

    return cats;
  }, [restaurantData, vegOnlyFilter, query, sortBy]);

  // total items after filters
  const totalFilteredItems = filteredCategories.reduce((s, c) => s + (c.items || []).length, 0);

  // recommended items for top strip (first 5-6)
  const recommendedStrip = useMemo(() => {
    if (!filteredCategories || filteredCategories.length === 0) return [];
    const rec = filteredCategories.find(c => c.id === "recommended");
    if (!rec) return [];
    return rec.items.slice(0, 6);
  }, [filteredCategories]);

  // ---------- UI ----------
  if (loading || !restaurantData) {
    return (
      <div className="min-h-screen bg-[#FFF7ED] p-4">
        <ShimmerLoader />
      </div>
    );
  }

  const cartCount = cart.reduce((s, it) => s + (it.quantity || 0), 0);
  const cartTotal = cart.reduce((s, it) => s + it.quantity, 0);


  const getDiscountPercent = (item) => {
  if (!item.hasDiscount) return 0;

  const percent =
    ((item.originalPrice - item.price) / item.originalPrice) * 100;

  // cap at 90% for UI (backend still controls pricing)
  return Math.min(90, Math.round(percent));
};


  return (
    <div className="min-h-screen bg-[#FFF7ED] pb-32">
      {/* TOP HEADER */}
      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-400 to-amber-400 shadow sticky top-0 z-40">
        <ArrowLeft size={22} onClick={() => navigate(-1)} className="cursor-pointer" />
        <div className="flex-1">
          <h2 className="font-bold text-lg">{restaurantData.name}</h2>
          <p className="text-xs text-black-600 mt-1">
            {restaurantData.rating}★ • {restaurantData.time} min • {restaurantData.distance} km
          </p>
        </div>
      </div>

      {/* BANNER */}
      <img src={restaurantData.banner} alt="banner" className="w-full h-44 object-cover" />

      {/* CONTROLS */}
      <div className="bg-white p-3 mt-3 mx-3 rounded-xl shadow flex flex-col gap-3">
        <div className="flex gap-2">
          <div className="flex items-center gap-2 w-full bg-gray-50 rounded-xl p-2">
            <Search size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dishes..."
              className="bg-transparent w-full outline-none text-sm"
            />
            {query && <button className="text-xs text-gray-500" onClick={() => setQuery("")}>Clear</button>}
          </div>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-sm px-3 py-2 rounded-xl border">
            <option value="recommended">Recommended</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setVegOnlyFilter("All")} className={`px-3 py-2 rounded-full text-sm ${vegOnlyFilter === "All" ? "bg-orange-500 text-white" : "bg-white text-gray-700 border"}`}>All</button>
          <button onClick={() => setVegOnlyFilter("Veg")} className={`px-3 py-2 rounded-full text-sm ${vegOnlyFilter === "Veg" ? "bg-green-600 text-white" : "bg-white text-gray-700 border"}`}>Veg</button>
          <button onClick={() => setVegOnlyFilter("NonVeg")} className={`px-3 py-2 rounded-full text-sm ${vegOnlyFilter === "NonVeg" ? "bg-red-600 text-white" : "bg-white text-gray-700 border"}`}>Non-Veg</button>
        </div>
      </div>

      {/* RECOMMENDED STRIP (top) */}
      {recommendedStrip.length > 0 && (
        <div className="mt-3 px-3">
          <h3 className="text-orange-600 font-bold mb-2">Recommended for you</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
            {recommendedStrip.map(item => (
              <div key={item.id} className="min-w-[220px] bg-white rounded-xl shadow p-3 flex flex-col gap-2">
                <div className="relative">
                <img
                  src={item.img || demoUploadedImage}
                  alt={item.name}
                  className="w-full h-32 object-cover rounded-lg"
                />

                {item.hasDiscount && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow">
                    🔥 {getDiscountPercent(item)}% OFF
                  </span>
                )}
              </div>
                <div className="flex-1">
                {/* Item Name */}
                <h4 className="font-semibold text-sm truncate">
                  {item.name}
                </h4>

                {/* Price */}
                <div className="text-xs mt-1">
                  {item.hasDiscount ? (
                    <>
                      <span className="line-through text-gray-400 mr-1">
                        ₹{item.originalPrice}
                      </span>
                      <span className="text-orange-600 font-semibold">
                        ₹{item.price}
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-700 font-semibold">
                      ₹{item.price}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {item.desc}
                </p>
              </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      // open detail modal
                      setDetailItem(item);
                    }}
                    className="px-3 py-1 border rounded-xl text-sm flex-1"
                  >
                    Details
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeOne(item)}
                      className="px-3 py-1 border rounded-full"
                    >
                      −
                    </button>
                    <div className="px-3">{quantityOf(item.id)}</div>
                    <button
                      onClick={() => addToCart(item)}
                      className="px-3 py-1 bg-orange-500 text-white rounded-full"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ACCORDION CATEGORIES */}
      <div className="mt-4 px-3 pb-28">
        {totalFilteredItems === 0 ? (
          <div className="flex flex-col items-center mt-12 px-6">
            <div className="bg-white rounded-xl p-6 shadow-md w-full max-w-xl text-center">
              <p className="text-orange-600 font-semibold text-lg">No dishes found</p>
              <p className="text-gray-600 mt-2">Try changing filters or search terms.</p>
            </div>
          </div>
        ) : (
                  filteredCategories
          .filter(cat => cat.id !== "recommended")
          .map(cat => {
            const isOpen = openCategory === cat.id;
            return (
              <div key={cat.id} className="mb-4">
                <button
                  onClick={() => setOpenCategory(prev => prev === cat.id ? null : cat.id)}
                  className="w-full bg-white rounded-xl p-3 shadow flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="font-semibold text-gray-800">{cat.name}</div>
                    <div className="text-xs text-gray-500">({cat.items.length})</div>
                  </div>
                  <div className="text-sm text-gray-600">{isOpen ? "▲" : "▼"}</div>
                </button>

                {/* panel */}
                {isOpen && (
                  <div className="mt-3 bg-white rounded-xl shadow p-3">
                    <div className="grid grid-cols-1 gap-3">
                      {cat.items.map(item => (
                        <div key={item.id} className="flex items-center gap-3 border-b last:border-b-0 pb-3 pt-3">
                          <img src={item.img || demoUploadedImage} alt={item.name} className="w-24 h-20 rounded-lg object-cover" />
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold">{item.name}</h4>
                                <p className="text-xs text-gray-500 mt-1">₹{item.price} • {item.rating || "—"}★</p>
                              </div>

                              <div className="flex flex-col items-end gap-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${item.veg ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                  {item.veg ? "Veg" : "Non-Veg"}
                                </span>

                                <div className="flex items-center gap-2">
                                  <button onClick={() => removeOne(item)} className="px-3 py-1 border rounded-full">−</button>
                                  <div className="px-3">{quantityOf(item.id)}</div>
                                  <button onClick={() => addToCart(item)} className="px-3 py-1 bg-orange-500 text-white rounded-full">+</button>
                                </div>
                              </div>
                            </div>

                            <div className="mt-2">
                              <p className="text-xs text-gray-600 line-clamp-2">{item.desc}</p>
                              <button onClick={() => setDetailItem(item)} className="mt-2 text-sm text-orange-600">View details</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ITEM DETAIL MODAL */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-xl shadow p-4">
            <div className="flex items-start justify-between">
              <h3 className="font-bold">{detailItem.name}</h3>
              <button onClick={() => setDetailItem(null)} className="text-gray-500">Close</button>
            </div>

            <img src={detailItem.img || demoUploadedImage} alt={detailItem.name} className="w-full h-44 object-cover rounded-lg mt-3" />
            <p className="text-sm text-gray-600 mt-3">{detailItem.desc || "Delicious item."}</p>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">₹{detailItem.price}</div>
                <div className="text-xs text-gray-500">{detailItem.rating || "—"}★</div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => removeOne(detailItem)} className="px-3 py-1 border rounded-full">−</button>
                <div className="px-3">{quantityOf(detailItem.id)}</div>
                <button onClick={() => addToCart(detailItem)} className="px-4 py-2 bg-orange-500 text-white rounded-xl">Add</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM CART BAR (only Go to Cart) */}
      <div className="fixed left-0 right-0 bottom-0 z-50 p-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between bg-white rounded-2xl p-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 text-orange-700 rounded-full w-12 h-12 flex items-center justify-center font-bold">
              {cartCount}
            </div>
            <div>
              <div className="text-sm font-semibold">Cart</div>
              <div className="text-xs text-gray-500">₹{cartTotal.toFixed(0)} • {cartCount} items</div>
            </div>
          </div>

          <div>
            <button
              onClick={goToCart}
              className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm"
            >
              Go to Cart
            </button>
          </div>
        </div>
      </div>

      {showReplacePopup && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm shadow-xl relative">
      <button
        onClick={cancelReplaceCart}
        className="absolute top-3 right-3 text-gray-400 text-xl"
      >
        ✕
      </button>

      <h3 className="text-lg font-bold mb-2">
        Replace cart item?
      </h3>

      <p className="text-sm text-gray-600 mb-6">
        Your cart contains dishes from{" "}
        <span className="font-semibold">
          {cartMerchantName || "another restaurant"}
        </span>.
        <br />
        Do you want to discard the selection and add dishes from{" "}
        <span className="font-semibold">
          {restaurantData.name}
        </span>?
      </p>

      <div className="flex gap-3">
        <button
          onClick={cancelReplaceCart}
          className="flex-1 py-2 rounded-xl bg-orange-100 text-orange-600 font-semibold"
        >
          okay
        </button>

        {/* <button
          onClick={confirmReplaceCart}
          className="flex-1 py-2 rounded-xl bg-orange-500 text-white font-semibold"
        >
          Yes
        </button> */}
      </div>
    </div>
  </div>
)}

    </div>
  );
}
