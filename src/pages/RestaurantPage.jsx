// src/pages/RestaurantPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { motion } from "framer-motion";
import ShimmerLoader from "../components/ShimmerLoader";

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

  // cart (persisted in localStorage)
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cartItems") || "[]");
    } catch {
      return [];
    }
  });

  // item detail modal
  const [detailItem, setDetailItem] = useState(null);

  // refs for smooth scrolling to category if needed later
  const categoryRefs = useRef({});

  // ---------- Demo data ----------
  const demoRestaurants = useMemo(() => {
    return {
      "1": {
        id: "1",
        name: "Velvet Scoops",
        banner:
          "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1400&q=80",
        rating: 4.8,
        time: 25,
        distance: 1.2,
        vegOnly: false,
      },
      "2": {
        id: "2",
        name: "Green Leaf Cafe",
        banner:
          "https://images.unsplash.com/photo-1541542684-7a6ce36f4f12?auto=format&fit=crop&w=1400&q=80",
        rating: 4.6,
        time: 20,
        distance: 0.8,
        vegOnly: true,
      },
      "3": {
        id: "3",
        name: "Wakhari Bhojan",
        banner:
          "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1400&q=80",
        rating: 4.7,
        time: 18,
        distance: 0.5,
        vegOnly: false,
      },
      default: {
        id: "0",
        name: "Demo Restaurant",
        banner: demoUploadedImage,
        rating: 4.2,
        time: 30,
        distance: 1.5,
        vegOnly: false,
      },
    };
  }, []);

  const demoMenus = useMemo(() => {
    // Each restaurant has categories with items
    return {
      "1": {
        categories: [
          {
            id: "recommended",
            name: "Recommended",
            items: [
              { id: "1_1", name: "Chocolate Ice Cream", price: 120, veg: true, img: demoUploadedImage, rating: 4.8, desc: "Rich chocolate ice cream topped with choco chips." },
              { id: "1_2", name: "Belgian Waffle", price: 150, veg: true, img: demoUploadedImage, rating: 4.6, desc: "Crispy waffles with maple syrup." },
              { id: "1_7", name: "Brownie Sundae", price: 210, veg: true, img: demoUploadedImage, rating: 4.7, desc: "Warm brownie with vanilla ice cream." },
              { id: "1_8", name: "Fruit Bowl", price: 130, veg: true, img: demoUploadedImage, rating: 4.5, desc: "Seasonal fruits with honey." },
              { id: "1_9", name: "Cookie Shake", price: 140, veg: true, img: demoUploadedImage, rating: 4.4, desc: "Creamy milkshake with crushed cookies." },
              { id: "1_10", name: "Nutella Crepe", price: 160, veg: true, img: demoUploadedImage, rating: 4.5, desc: "Thin crepe filled with Nutella." },
            ],
          },
          {
            id: "sundaes",
            name: "Sundaes & Bowls",
            items: [
              { id: "1_3", name: "Strawberry Sundae", price: 180, veg: true, img: demoUploadedImage, rating: 4.5, desc: "Fresh strawberry, cream & syrup." },
              { id: "1_4", name: "Brownie Delight", price: 200, veg: true, img: demoUploadedImage, rating: 4.7, desc: "Brownie with scoop of ice cream." },
            ],
          },
          {
            id: "beverages",
            name: "Beverages",
            items: [
              { id: "1_5", name: "Cold Coffee", price: 90, veg: true, img: demoUploadedImage, rating: 4.2, desc: "Iced coffee with cream." },
              { id: "1_6", name: "Milkshake", price: 130, veg: true, img: demoUploadedImage, rating: 4.3, desc: "Creamy milkshake." },
            ],
          },
        ],
      },

      "2": {
        categories: [
          {
            id: "recommended",
            name: "Recommended",
            items: [
              { id: "2_1", name: "Herb Paneer Sandwich", price: 160, veg: true, img: demoUploadedImage, rating: 4.6, desc: "Paneer with herbs grilled." },
              { id: "2_4", name: "Avocado Toast", price: 170, veg: true, img: demoUploadedImage, rating: 4.5, desc: "Whole grain toast with avocado." },
            ],
          },
          {
            id: "breakfast",
            name: "Breakfast",
            items: [
              { id: "2_2", name: "Idli Sambar", price: 90, veg: true, img: demoUploadedImage, rating: 4.4, desc: "Soft idlis with sambar." },
              { id: "2_3", name: "Pancakes", price: 120, veg: true, img: demoUploadedImage, rating: 4.3, desc: "Fluffy pancakes with syrup." },
            ],
          },
        ],
      },

      "3": {
        categories: [
          {
            id: "recommended",
            name: "Recommended",
            items: [
              { id: "3_1", name: "Wakhari Thali (Non-Veg)", price: 240, veg: false, img: demoUploadedImage, rating: 4.5, desc: "Local thali with sides." },
              { id: "3_2", name: "Veg Thali", price: 200, veg: true, img: demoUploadedImage, rating: 4.4, desc: "Vegetarian thali with rotis." },
            ],
          },
          {
            id: "mains",
            name: "Mains",
            items: [
              { id: "3_3", name: "Masala Fish", price: 260, veg: false, img: demoUploadedImage, rating: 4.2, desc: "Spicy masala fried fish." },
            ],
          },
        ],
      },
    };
  }, []);

  // ---------- Load restaurant + menu ----------
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      const rest = demoRestaurants[id] || demoRestaurants.default;
      const menu = demoMenus[id] || demoMenus["1"];
      // default open category = recommended
      setRestaurantData({ ...rest, menu });
      setOpenCategory("recommended");
      setLoading(false);
      // prepare refs
      (menu.categories || []).forEach(c => (categoryRefs.current[c.id] = categoryRefs.current[c.id] || React.createRef()));
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // persist cart to localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cart));
  }, [cart]);

  // cart helpers
  const addToCart = (item) => {
    setCart(prev => {
      const found = prev.find(p => p.id === item.id);
      if (found) {
        return prev.map(p => p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeOne = (item) => {
    setCart(prev => {
      const found = prev.find(p => p.id === item.id);
      if (!found) return prev;
      if (found.quantity <= 1) return prev.filter(p => p.id !== item.id);
      return prev.map(p => p.id === item.id ? { ...p, quantity: p.quantity - 1 } : p);
    });
  };

  const quantityOf = (itemId) => {
    const it = cart.find(c => c.id === itemId);
    return it ? it.quantity : 0;
  };

  const goToCart = () => {
    navigate("/cart");
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
  const cartTotal = cart.reduce((s, it) => s + (it.price || 0) * (it.quantity || 1), 0);

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
                <img src={item.img || demoUploadedImage} alt={item.name} className="w-full h-32 object-cover rounded-lg" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">{item.name}</h4>
                    <span className="text-xs text-gray-500">₹{item.price}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.desc}</p>
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
          filteredCategories.map(cat => {
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
    </div>
  );
}
