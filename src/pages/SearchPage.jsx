//src\pages\SearchPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ShoppingCart, X, Search } from "lucide-react";
import { motion } from "framer-motion";
import { searchProductsApi } from "../services/searchApi";
import { addToCartApi, getCartList, goToCartApi } from "../services/cartApi";

// const productsList = [
//   { id: 1, name: "Hyderabadi Biryani", price: 220, img: "https://via.placeholder.com/80" },
//   { id: 2, name: "Paneer Butter Masala", price: 180, img: "https://via.placeholder.com/80" },
//   { id: 3, name: "Eggs (12 pcs)", price: 90, img: "https://via.placeholder.com/80" },
//   { id: 4, name: "Milk 1L", price: 50, img: "https://via.placeholder.com/80" },
//   { id: 5, name: "Maggi Noodles", price: 40, img: "https://via.placeholder.com/80" },
//   { id: 6, name: "Apple (1kg)", price: 150, img: "https://via.placeholder.com/80" },
//   { id: 7, name: "Bread", price: 35, img: "https://via.placeholder.com/80" },
//   { id: 8, name: "Banana (1kg)", price: 60, img: "https://via.placeholder.com/80" },
// ];

export default function SearchPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialQuery = location.state?.query || "";

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [trendingProducts, setTrendingProducts] = useState([]);

  // ------------------- State Variables -------------------
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [recentSearches, setRecentSearches] = useState(() => {
    const stored = localStorage.getItem("recentSearches");
    return stored ? JSON.parse(stored) : [];
  });
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem("cartItems");
    return stored ? JSON.parse(stored) : [];
  });
  const [merchantResults, setMerchantResults] = useState([]);
  const [restaurantResults, setRestaurantResults] = useState([]);
  const [serviceResults, setServiceResults] = useState([]);
  const [emergencyResults, setEmergencyResults] = useState([]);

  // 🔔 Toast
const [toast, setToast] = useState("");

// ⏳ Disable buttons while API pending
const [loadingItemId, setLoadingItemId] = useState(null);

// 🏪 Cart merchant tracking
const cartMerchantId = localStorage.getItem("cartMerchantId");
const cartMerchantName = localStorage.getItem("cartMerchantName");

// 🔁 Replace cart popup
const [showReplacePopup, setShowReplacePopup] = useState(false);
const [pendingItem, setPendingItem] = useState(null);

useEffect(() => {
  const syncCart = async () => {
    try {
      const res = await getCartList({});
      if (!res?.status) return;

      const syncedItems = (res.items || []).map(i => ({
        id: i.menu_id || i.product_id,
        quantity: i.quantity,
        type: i.type,
        merchantName: res.merchant?.name,
      }));

      setCartItems(syncedItems);

      if (res.merchant?.id) {
        localStorage.setItem("cartMerchantId", String(res.merchant.id));
        localStorage.setItem("cartMerchantName", res.merchant.name);
      }
    } catch (e) {
      console.error("Cart sync failed", e);
    }
  };

  syncCart();
}, []);

  // ------------------- Global Search Data -------------------
  // const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
  const storedMerchants = JSON.parse(localStorage.getItem("merchants")) || [];
  const storedRestaurants = JSON.parse(localStorage.getItem("restaurants")) || [];

  const demoServices = [
    "Fruits & Vegetables",
    "Mobile Recharge",
    "Electrician / Plumber / Carpenter",
    "Dog Food",
    "Photo Print",
    "Snake Catcher",
  ];

  const demoEmergency = [
    "Hospital & Ambulance",
    "Jijau Hospital",
    "Vasind Hospital",
    "Fire Helpline",
    "Snake Catcher Vijay",
  ];

  const getQty = (id) =>
  cartItems.find((i) => i.id === id)?.quantity || 0;

  const increaseQty = async (item) => {
  const currentMerchantId = String(item.merchant_id || item.merchantName || "");
  const existingMerchantId = String(
    localStorage.getItem("cartMerchantId") || ""
  );

  // 🛑 Block cross-merchant
  if (
    cartItems.length > 0 &&
    existingMerchantId &&
    existingMerchantId !== currentMerchantId
  ) {
    setPendingItem(item);
    setShowReplacePopup(true);
    return;
  }

  const currentQty = getQty(item.id);
  const newQty = currentQty + 1;

  setLoadingItemId(item.id);

  // Optimistic UI
  setCartItems(prev =>
    prev.some(i => i.id === item.id)
      ? prev.map(i =>
          i.id === item.id ? { ...i, quantity: newQty } : i
        )
      : [...prev, { ...item, quantity: 1 }]
  );

  try {
    await addToCartApi({
      menuIds: item.type === "menu" ? [item.id] : [],
      productIds: item.type === "product" ? [item.id] : [],
      quantity: newQty,
    });

    localStorage.setItem("cartMerchantId", currentMerchantId);
    localStorage.setItem("cartMerchantName", item.merchantName || "");

    // 🔔 Toast
    setToast("Added to cart");
    setTimeout(() => setToast(""), 1500);
  } finally {
    setLoadingItemId(null);
  }
};


const decreaseQty = async (item) => {
  const currentQty = getQty(item.id);
  if (currentQty <= 0) return;

  const newQty = currentQty - 1;

  setCartItems((prev) =>
    newQty === 0
      ? prev.filter((i) => i.id !== item.id)
      : prev.map((i) =>
          i.id === item.id ? { ...i, quantity: newQty } : i
        )
  );

  await addToCartApi({
    menuIds: item.type === "menu" ? [item.id] : [],
    productIds: item.type === "product" ? [item.id] : [],
    quantity: newQty,
  });
};

// const confirmReplaceCart = async () => {
//   try {
//     setCartItems([]);
//     localStorage.removeItem("cartItems");

//     await goToCartApi(); // backend reset

//     localStorage.setItem(
//       "cartMerchantId",
//       String(pendingItem.merchant_id || "")
//     );
//     localStorage.setItem(
//       "cartMerchantName",
//       pendingItem.merchantName || ""
//     );

//     setShowReplacePopup(false);

//     if (pendingItem) {
//       await increaseQty(pendingItem);
//       setPendingItem(null);
//     }
//   } catch (e) {
//     console.error("Replace cart failed", e);
//   }
// };

  // ------------------- Search Effect -------------------
  useEffect(() => {
  if (!searchQuery.trim()) {
    setFilteredProducts([]);
    setMerchantResults([]);
    setRestaurantResults([]);
    setServiceResults([]);
    setEmergencyResults([]);
    return;
  }

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      setApiError("");

      const res = await searchProductsApi(searchQuery);

     if (res?.status) {
  const products = res.products || [];
  const menus = res.menus || [];

  // 🔁 Normalize both into one structure
  const combinedResults = [
    ...products.map(p => ({
      id: p.id,
      name: p.product_name,
      price: Number(p.discounted_price || p.product_price),
      originalPrice: Number(p.product_price),
      image: p.product_image,
      type: "product",
      merchantName: p.merchant_name,
    })),
    ...menus.map(m => ({
      id: m.id,
      name: m.menu_name,
      price: Number(m.discounted_price || m.menu_price),
      originalPrice: Number(m.menu_price),
      image: m.menu_image,
      type: "menu",
      merchantName: m.merchant_name,
      description: m.menu_description,
    })),
  ];

  setFilteredProducts(combinedResults);

  // Save for trending
  localStorage.setItem(
    "lastSearchResults",
    JSON.stringify(combinedResults)
  );
}


//   // 👇 store last results for trending fallback
//   localStorage.setItem("lastSearchResults", JSON.stringify(res.data || []));
// }


      // 🔹 Keep these frontend-only
      const q = searchQuery.toLowerCase();
      setServiceResults(demoServices.filter((s) => s.toLowerCase().includes(q)));
      setEmergencyResults(demoEmergency.filter((e) => e.toLowerCase().includes(q)));

    } catch (err) {
      console.error("Search failed", err);
      setApiError("Failed to search products");
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  fetchSearchResults();
}, [searchQuery]);

useEffect(() => {
  const stored = localStorage.getItem("lastSearchResults");
  if (stored) {
    setTrendingProducts(JSON.parse(stored).slice(0, 6));
  }
}, []);

  // ------------------- Search & Cart Tracking -------------------
  const incrementSearchCount = (productName) => {
    const counts = JSON.parse(localStorage.getItem("searchCounts") || "{}");
    counts[productName] = (counts[productName] || 0) + 1;
    localStorage.setItem("searchCounts", JSON.stringify(counts));
  };

  const incrementCartCount = (product) => {
    const counts = JSON.parse(localStorage.getItem("cartCounts") || "{}");
    counts[product.id] = (counts[product.id] || 0) + 1;
    localStorage.setItem("cartCounts", JSON.stringify(counts));
  };

  const handleSearchSubmit = (query) => {
    if (!query.trim()) return;
    incrementSearchCount(query);
    setSearchQuery(query);
    setRecentSearches((prev) => {
      const updated = [query, ...prev.filter((item) => item !== query)];
      localStorage.setItem("recentSearches", JSON.stringify(updated.slice(0, 5)));
      return updated.slice(0, 5);
    });
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  // ------------------- Merged Trending & Recommended Products -------------------
  // const getMergedProducts = () => {
  //   const searchCounts = JSON.parse(localStorage.getItem("searchCounts") || "{}");
  //   const cartCounts = JSON.parse(localStorage.getItem("cartCounts") || "{}");
  //   const allProducts = [...productsList, ...storedProducts];

  //   const scoredProducts = allProducts.map((p) => ({
  //     ...p,
  //     score: (searchCounts[p.name] || 0) + (cartCounts[p.id] || 0),
  //   }));

  //   scoredProducts.sort((a, b) => b.score - a.score);

  //   return scoredProducts.slice(0, 6);
  // };

  // const mergedProducts = getMergedProducts();


  // ------------------- Add to Cart -------------------
  const addToCart = (product) => {
    const exists = cartItems.find((item) => item.id === product.id);
    let updatedCart;
    if (exists) {
      updatedCart = cartItems.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cartItems, { ...product, quantity: 1 }];
    }
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    incrementCartCount(product);
  };

  // ------------------- JSX -------------------
  return (
    <div className="min-h-screen bg-[#FFF7ED] flex flex-col">
      {/* Header */}
      <header className="bg-orange-500 text-white py-4 px-4 shadow-lg w-full relative flex items-center justify-center">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-3 p-2 rounded-full bg-white shadow hover:bg-gray-100 transition"
        >
          <ArrowLeft className="w-5 h-5 text-orange-500" />
        </button>
        <div className="flex items-center bg-white rounded-full px-4 py-2 w-[80%] max-w-md">
          <Search className="text-gray-400 mr-2 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for products, brands, or stores"
            className="flex-1 bg-transparent focus:outline-none text-gray-800 placeholder-gray-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit(searchQuery)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-gray-500 hover:text-gray-700 ml-1"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </header>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div className="px-4 py-2">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-gray-700">Recent Searches</span>
            <button onClick={clearRecent} className="text-sm text-red-500 hover:text-red-600">
              Clear All
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto py-1">
            {recentSearches.map((item, idx) => (
              <motion.button
                key={idx}
                onClick={() => handleSearchSubmit(item)}
                whileTap={{ scale: 0.9 }}
                className="flex-shrink-0 bg-orange-100 text-orange-700 px-4 py-2 rounded-full hover:bg-orange-200 transition whitespace-nowrap"
              >
                {item}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Merged Products Grid
      {!searchQuery && (
        <div className="mt-6 px-4">
          <h2 className="font-bold text-gray-800 text-lg mb-3 flex items-center gap-2">
            🔥 Trending & Recommended
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {mergedProducts.map((p) => (
              <motion.div
                key={p.id}
                whileTap={{ scale: 0.95 }}
                className="bg-white rounded-2xl shadow-md p-3 flex flex-col items-center cursor-pointer border border-orange-100"
                onClick={() => navigate("/productDetails", { state: { product: p } })}
              >
                <img src={p.img} alt={p.name} className="w-20 h-20 rounded-xl object-cover" />
                <h3 className="font-medium text-gray-800 text-center text-sm mt-2">{p.name}</h3>
                <p className="text-orange-600 text-sm font-semibold mt-1">₹{p.price}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(p);
                  }}
                  className="bg-orange-400 text-white px-4 py-1 rounded-full text-xs font-semibold mt-2"
                >
                  Add
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )} */}

{!searchQuery && trendingProducts.length > 0 && (
  <div className="mt-6 px-4">
    <h2 className="font-bold text-gray-800 text-lg mb-3">
      🔥 Popular Searches
    </h2>

    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {trendingProducts.map((p) => (
        <motion.div
          key={p.id}
          whileTap={{ scale: 0.95 }}
          className="bg-white rounded-2xl shadow-md p-3 flex flex-col items-center"
        >
        <img
  src={
    p.image
      ? `${import.meta.env.VITE_API_BASE_URL}${p.image}`
      : "/food-placeholder.png"
  }
  alt={p.name}
  className="w-16 h-16 rounded-xl object-cover"
/>

<span
  className={`text-xs px-2 py-1 rounded-full font-semibold ${
    p.type === "menu"
      ? "bg-orange-100 text-orange-700"
      : "bg-blue-100 text-blue-700"
  }`}
>
  {p.type === "menu" ? "🍽️ Dish" : "🛒 Product"}
</span>

          <h3 className="text-sm mt-2 text-center">{p.name}</h3>
          <p className="text-orange-600 font-semibold">
            ₹{p.price || p.unit_price}
          </p>
          {getQty(p.id) === 0 ? (
  <button
    onClick={() => increaseQty(p)}
    className="bg-orange-500 text-white px-3 py-1 rounded-lg text-xs"
  >
    ADD
  </button>
) : (
  <div className="flex items-center gap-2 bg-orange-100 rounded-lg px-2 py-1">
    <button onClick={() => decreaseQty(p)}>−</button>
    <span>{getQty(p.id)}</span>
    <button onClick={() => increaseQty(p)}>+</button>
  </div>
)}

        </motion.div>
      ))}
    </div>
  </div>
)}

      {/* Search Results / Emergency */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {searchQuery &&
          filteredProducts.length === 0 &&
          merchantResults.length === 0 &&
          restaurantResults.length === 0 &&
          serviceResults.length === 0 &&
          emergencyResults.length === 0 && (
            <div className="text-center mt-16">
              <p className="text-gray-500 text-lg mb-2">Oops! No results found</p>
              <p className="text-orange-600 font-semibold">Try searching for something else</p>
            </div>
          )}

        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            className="flex items-center bg-white p-3 rounded-2xl shadow-md gap-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <img
            src={product.image || "/food-placeholder.png"}
            alt={product.name}
            className="w-16 h-16 rounded-xl object-cover"
          />

          <p className="text-orange-600 font-semibold">
            ₹{product.price || product.unit_price}
          </p>

            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{product.name}</h3>
            </div>
            <div className="flex items-center gap-2">
            {getQty(product.id) === 0 ? (
              <button
                onClick={() => increaseQty(product)}
                className="bg-orange-500 text-white px-4 py-1 rounded-xl text-sm font-semibold"
              >
                ADD
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-orange-100 rounded-xl px-2 py-1">
                <button
                  onClick={() => decreaseQty(product)}
                  className="px-2 font-bold text-orange-600"
                >
                  −
                </button>

                <span className="font-semibold">{getQty(product.id)}</span>

                <button
                  onClick={() => increaseQty(product)}
                  className="px-2 font-bold text-orange-600"
                >
                  +
                </button>
              </div>
            )}
          </div>
          </motion.div>
        ))}
{loading && (
  <div className="text-center mt-10 text-gray-500">
    Searching for “{searchQuery}”…
  </div>
)}
{apiError && (
  <div className="text-center mt-10 text-red-500 font-semibold">
    {apiError}
  </div>
)}

        {/* Emergency Section */}
        {emergencyResults.length > 0 && (
          <div className="mt-4">
            <h2 className="font-bold text-red-600 mb-3 flex items-center gap-2">
              🚨 Emergency Contacts
            </h2>
            <div className="bg-white rounded-2xl shadow-md p-3 space-y-2">
              {emergencyResults.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-between items-center border-b pb-2 last:border-none"
                >
                  <span className="text-gray-800 font-medium">{item}</span>
                  <button
                    onClick={() => window.location.href = "tel:8669106625"}
                    className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold"
                  >
                    Call
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Cart */}
      {cartItems.length > 0 && (
        <div className="sticky bottom-0 bg-white shadow-t p-4 flex justify-between items-center border-t">
          <span className="font-semibold">{cartItems.length} items in cart</span>
          <button
            onClick={() => navigate("/cart")}
            className="bg-orange-400 text-white px-6 py-2 rounded-2xl hover:bg-orange-500 transition"
          >
            Go to Cart
          </button>
        </div>
      )}

      {toast && (
  <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-xl shadow-lg z-50">
    {toast}
  </div>
)}

{showReplacePopup && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm shadow-xl text-center">
      <h3 className="text-lg font-bold mb-2">
        Items already in cart
      </h3>

      <p className="text-sm text-gray-600 mb-6">
        Your cart contains items from{" "}
        <span className="font-semibold">
          {cartMerchantName || "another store"}
        </span>.
        <br />
        Please complete or clear your cart before adding items from a new store.
      </p>

      <button
        onClick={() => {
          setShowReplacePopup(false);
          setPendingItem(null);
        }}
        className="w-full py-2 rounded-xl bg-orange-500 text-white font-semibold"
      >
        OKay
      </button>
    </div>
  </div>
)}


{/* {showReplacePopup && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm shadow-xl">
      <h3 className="text-lg font-bold mb-2">
        Replace cart items?
      </h3>

      <p className="text-sm text-gray-600 mb-6">
        Your cart contains items from{" "}
        <span className="font-semibold">
          {cartMerchantName || "another store"}
        </span>.
        <br />
        Do you want to replace it?
      </p>

      <div className="flex gap-3">
        <button
          onClick={() => setShowReplacePopup(false)}
          className="flex-1 py-2 rounded-xl bg-gray-100 text-gray-700 font-semibold"
        >
          No
        </button>

        <button
          onClick={confirmReplaceCart}
          className="flex-1 py-2 rounded-xl bg-orange-500 text-white font-semibold"
        >
          Yes
        </button>
      </div>
    </div>
  </div>
)} */}

    </div>
  );
}
