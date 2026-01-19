// src/pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ShimmerLoader from "../components/ShimmerLoader";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Heart } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";
import { getAccessToken } from "../utils/auth";
import { getRestaurantList } from "../services/homeApi";


export default function HomePage() {
  const [loading, setLoading] = useState(true);

  // master list of demo restaurants (Vasind:4, Wakhari:7, Shahapur:2, Deola:30, Thane:0, Nashik:0)
  const [restaurants, setRestaurants] = useState([]);
  const [nearbyRestaurants, setNearbyRestaurants] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [cartCount, setCartCount] = useState(0);

const { favorites, addFavorite, removeFavorite } = useFavorites();

  // show modal only if no saved GPS and no searchedLocation
  const [showLocationModal, setShowLocationModal] = useState(() => {
    const lat = localStorage.getItem("userLat");
    const lng = localStorage.getItem("userLng");
    const searchedLocation = localStorage.getItem("searchedLocation");
    return !(lat && lng) && !searchedLocation;
  });

  const [locationGranted, setLocationGranted] = useState(() => {
    const lat = localStorage.getItem("userLat");
    const lng = localStorage.getItem("userLng");
    return !!(lat && lng);
  });

  const [searchLocation, setSearchLocation] = useState(() => {
    return localStorage.getItem("searchedLocation") || "";
  });

  const navigate = useNavigate();

  // search text for restaurant name
  const [searchText, setSearchText] = useState("");
  // filter: "All" | "Pure Veg" | "Non-Veg"
  const [filter, setFilter] = useState("All");
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);

  const updateCartCount = () => {
    const storedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartCount(storedCart.reduce((acc, item) => acc + (item.quantity || 0), 0));
  };

  // Request browser geolocation
  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationGranted(true);
          setShowLocationModal(false);
          const { latitude, longitude } = position.coords;
          localStorage.setItem("userLat", latitude);
          localStorage.setItem("userLng", longitude);
          // For demo, we'll default GPS to Vasind area restaurants
          localStorage.removeItem("searchedLocation");
          applyLocationFilterFromStorage();
        },
        () => {
          setLocationGranted(false);
          setShowLocationModal(true);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setShowLocationModal(false);
    }
  };

  // on change search/filter/nearby update filteredRestaurants
  useEffect(() => {
    let filtered = nearbyRestaurants.slice();

    // Veg/Non-Veg filter
    if (filter === "Pure Veg") filtered = filtered.filter((r) => r.isVeg);
    else if (filter === "Non-Veg") filtered = filtered.filter((r) => !r.isVeg);

    // name search
    if (searchText.trim() !== "")
      filtered = filtered.filter((r) =>
        r.name.toLowerCase().includes(searchText.toLowerCase())
      );

    setFilteredRestaurants(filtered);
  }, [searchText, filter, nearbyRestaurants]);

  useEffect(() => {
  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      updateCartCount();

      const res = await getRestaurantList({
        search: searchLocation || "",
        food:
          filter === "Pure Veg"
            ? "veg"
            : filter === "Non-Veg"
            ? "non_veg"
            : "",
      });

      if (res.status) {
        const formatted = res.data.map((r) => ({
          id: r.merchant_id,
          name: r.name,
          location: r.city || "Nearby",
          distance: "-",
          isVeg: r.food === "veg",
          price: "-",
          time: "-",
          rating: "-",
          img:
            r.logo ||
            "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=60",
        }));

        setRestaurants(formatted);
        setNearbyRestaurants(formatted);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  };

  fetchRestaurants();
}, [searchLocation, filter]);



  // // initial demo restaurants load
  // useEffect(() => {
  //   updateCartCount();

  //   // generate demo restaurants (counts as requested)
  //   const demo = [];

  //   // Helper to push restaurant objects
  //   const pushR = (id, name, location, distance, isVeg, price, time, rating, img) => {
  //     demo.push({
  //       id,
  //       name,
  //       location,
  //       distance, // km
  //       isVeg,
  //       price,
  //       time,
  //       rating,
  //       img,
  //     });
  //   };

  //   // Vasind (4: 2 veg, 2 non-veg)
  //   pushR(1, "Velvet Scoops", "Vasind", 1.2, true, 100, "25 min", "4.9★", "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=60");
  //   pushR(2, "Green Leaf Cafe", "Vasind", 0.8, true, 150, "20 min", "4.6★", "https://images.unsplash.com/photo-1541542684-7a6ce36f4f12?auto=format&fit=crop&w=800&q=60");
  //   pushR(3, "Vasind Katta", "Vasind", 2.1, false, 200, "30 min", "4.3★", "https://images.unsplash.com/photo-1606755962773-d32446d3b17b?auto=format&fit=crop&w=800&q=60");
  //   pushR(4, "Hyderabadi Biryani Vasind", "Vasind", 3.2, false, 220, "35 min", "4.5★", "https://images.unsplash.com/photo-1590080875832-6a4c0b8d7f8d?auto=format&fit=crop&w=800&q=60");

  //   // Wakhari (7: 4 veg, 3 non-veg)
  //   pushR(5, "Wakhari Bhojan", "Wakhari", 0.5, true, 120, "18 min", "4.7★", "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=60");
  //   pushR(6, "Spice Villa Wakhari", "Wakhari", 1.1, false, 210, "28 min", "4.4★", "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=800&q=60");
  //   pushR(7, "Wakhari Sweets", "Wakhari", 0.9, true, 80, "15 min", "4.5★", "https://images.unsplash.com/photo-1604908813167-d9d98eeeb8b7?auto=format&fit=crop&w=800&q=60");
  //   pushR(8, "Urban Dhaba", "Wakhari", 2.2, false, 180, "32 min", "4.2★", "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=60");
  //   pushR(9, "Green Bowl", "Wakhari", 1.8, true, 140, "25 min", "4.6★", "https://images.unsplash.com/photo-1543352634-4b38b2f5a1c6?auto=format&fit=crop&w=800&q=60");
  //   pushR(10, "Noodle House", "Wakhari", 2.5, false, 160, "30 min", "4.1★", "https://images.unsplash.com/photo-1544025162-3a9f1f4d5d1a?auto=format&fit=crop&w=800&q=60");
  //   pushR(11, "Cafe Sunrise", "Wakhari", 0.7, true, 110, "16 min", "4.8★", "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=800&q=60");

  //   // Shahapur (2: 1 veg, 1 non-veg)
  //   pushR(12, "Shahapur Bites", "Shahapur", 1.5, false, 190, "30 min", "4.2★", "https://images.unsplash.com/photo-1526318472351-c75fcf070d4b?auto=format&fit=crop&w=800&q=60");
  //   pushR(13, "Shahapur Sweets", "Shahapur", 0.9, true, 70, "12 min", "4.4★", "https://images.unsplash.com/photo-1542144582-1ba0046a4a4b?auto=format&fit=crop&w=800&q=60");

  //   // Deola (30: 18 veg, 12 non-veg) - demo names generated
  //   let idCounter = 14;
  //   const deolaNamesVeg = [
  //     "Deola Dhaba", "Deola Green", "Deola Sweets", "Deola Tiffins", "Deola Juice Corner",
  //     "Veggie Delight Deola", "Deola Bakers", "Deola Idli House", "Deola South Kitchen", "Deola Dosa Point",
  //     "Deola Thali House", "Deola Chana Bhatura", "Deola Salad Bar", "Deola Paratha Corner", "Deola Falafel",
  //     "Deola Coffee Bar", "Deola Wraps", "Deola Pancake Co"
  //   ];
  //   const deolaNamesNonVeg = [
  //     "Deola Biryani Hub", "Deola Chicken Corner", "Deola Grill", "Deola Fish Fry", "Deola Kebab Place",
  //     "Deola NonVeg Dhaba", "Deola Taste", "Deola Tandoor", "Deola Seafood", "Deola Express",
  //     "Deola Curry House", "Deola Roast"
  //   ];
  //   deolaNamesVeg.forEach((n, idx) => {
  //     pushR(idCounter++, n, "Deola", 1 + (idx % 6) * 0.4, true, 120 + (idx % 5) * 10, `${20 + (idx % 4)} min`, `${4.0 + (idx % 5) * 0.1}★`, "https://images.unsplash.com/photo-1543352634-4b38b2f5a1c6?auto=format&fit=crop&w=800&q=60");
  //   });
  //   deolaNamesNonVeg.forEach((n, idx) => {
  //     pushR(idCounter++, n, "Deola", 0.8 + (idx % 7) * 0.5, false, 160 + (idx % 6) * 15, `${25 + (idx % 6)} min`, `${4.1 + (idx % 4) * 0.1}★`, "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=60");
  //   });

  //   // (Thane,Nashik none => none added)

  //   setRestaurants(demo);

  //   // if user already selected searchedLocation, apply filter
  //   const storedSearch = (localStorage.getItem("searchedLocation") || "").trim();
  //   if (storedSearch) {
  //     const nearby = demo.filter(r => r.location.toLowerCase() === storedSearch.toLowerCase());
  //     setNearbyRestaurants(nearby);
  //   } else {
  //     // If GPS present, pick Vasind demo as default nearby (for demo)
  //     const lat = localStorage.getItem("userLat");
  //     const lng = localStorage.getItem("userLng");
  //     if (lat && lng) {
  //       const nearby = demo.filter(r => r.location === "Vasind");
  //       setNearbyRestaurants(nearby);
  //     } else {
  //       // default to Vasind nearby (so someone sees something)
  //       const nearby = demo.filter(r => r.location === "Vasind");
  //       setNearbyRestaurants(nearby);
  //     }
  //   }

  //   setLoading(false);
  // }, []);

  // when user searches a locality in the modal
  const handleSearchLocation = () => {
    if (!searchLocation) return;
    localStorage.setItem("searchedLocation", searchLocation.trim());
    // apply filter to restaurants by location EXACT match (case-insensitive)
    const nearby = restaurants.filter(
      (r) => r.location.toLowerCase() === searchLocation.trim().toLowerCase()
    );
    setNearbyRestaurants(nearby);
    setShowLocationModal(false);
    setLocationGranted(false); // since using manual search location
  };

  // apply location filter (helper used after GPS grant or change)
  const applyLocationFilterFromStorage = () => {
    const stored = (localStorage.getItem("searchedLocation") || "").trim();
    if (stored) {
      const nearby = restaurants.filter((r) => r.location.toLowerCase() === stored.toLowerCase());
      setNearbyRestaurants(nearby);
      return;
    }
    // if GPS exists, default to Vasind for demo
    const lat = localStorage.getItem("userLat");
    const lng = localStorage.getItem("userLng");
    if (lat && lng) {
      const nearby = restaurants.filter((r) => r.location === "Vasind");
      setNearbyRestaurants(nearby);
    }
  };

  // Add to cart (simple localStorage cart)
  const addToCart = (item) => {
    const storedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    const existing = storedCart.find((i) => i.id === item.id);

    if (existing) {
      const updatedCart = storedCart.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      );
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    } else {
      const updatedCart = [...storedCart, { ...item, quantity: 1 }];
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    }
    updateCartCount();
  };

  const offerImages = [
    "https://b.zmtcdn.com/data/file_photos/9e2/51da95cf0b8129ae5f3d09132a6b89e2.jpg",
    "https://b.zmtcdn.com/data/file_photos/4b2/51e1ed3c1a9b1455f617ce9b4eeb14b2.jpg",
    "https://b.zmtcdn.com/data/file_photos/f63/256b17ed7f303a4232b11bc79e216f63.jpg",
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: false,
  };

  const navItems = [
    { key: "Address", icon: "📍", route: "/address" },
    { key: "AllInOne", label: "All in One", icon: "🧺", route: "/allinone" },
    { key: "Search", icon: "🔍" },
    { key: "Cart", icon: "🛒", route: "/cart" },
    { key: "Leaderboard", icon: "🏆", route: "/leaderboard" },
    { key: "Profile", icon: "👤", route: "/profile" },
  ];

  // computed values
  const storedSearched = (localStorage.getItem("searchedLocation") || "").trim();
  const displayLocation = storedSearched || (locationGranted ? "Current GPS" : "");

  useEffect(() => {
    if (!getAccessToken()) {
      navigate("/");
    }
  }, []);

  
  return (
    <div className="min-h-screen bg-[#FFF7ED] flex flex-col relative">
      {/* ---------- Header ---------- */}
      <header className="flex justify-between items-center bg-gradient-to-r from-orange-400 to-amber-400 text-white p-4 shadow-md rounded-b-2xl">
        <div className="font-bold text-lg">ZATPATT 🍊</div>

        <div
          onClick={() => navigate("/rewards")}
          className="mx-2 relative flex items-center justify-between w-[150px] cursor-pointer rounded-full shadow-lg bg-orange-500 hover:bg-orange-600 transition-all p-3"
          style={{ border: "2px solid #FF8C00" }}
        >
          <div className="flex flex-col items-start">
            <h3 className="text-xs font-semibold">Rewards</h3>
            <p className="text-xl font-bold">120</p>
          </div>
          <span className="text-lg ml-2">🏅</span>
          <span className="absolute inset-0 rounded-full shadow-[0_0_15px_4px_rgba(255,140,0,0.12)] pointer-events-none"></span>
        </div>
      </header>

      {/* ---------- Location Modal with Search ---------- */}
      {showLocationModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 120 }}
            className="bg-white rounded-2xl p-6 w-11/12 max-w-sm text-center shadow-lg"
          >
            <h2 className="text-xl font-bold text-orange-600 mb-3">
              {locationGranted ? "Change Location" : "Enable Location"}
            </h2>
            <p className="text-gray-600 mb-3">
              {locationGranted
                ? "Search for a new locality or keep your current location 🍊"
                : "We need your location to show restaurants near you 🍊"}
            </p>

            <input
              type="text"
              placeholder="Search your locality..."
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="border border-gray-300 rounded-xl p-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <div className="flex justify-between gap-2">
              <button
                onClick={requestLocation}
                className="bg-orange-500 text-white px-4 py-2 rounded-xl font-semibold shadow hover:bg-orange-600 transition flex-1"
              >
                Allow Location
              </button>
              <button
                onClick={handleSearchLocation}
                className="bg-orange-500 text-white px-4 py-2 rounded-xl font-semibold shadow hover:bg-orange-600 transition flex-1"
              >
                Search
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* ---------- Offer Slider ---------- */}
      <div className="my-3 mx-3 rounded-lg overflow-hidden shadow">
        <Slider {...sliderSettings}>
          {offerImages.map((src, idx) => (
            <motion.div
              key={idx}
              className="w-full h-40 overflow-hidden rounded-lg"
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.img src={src} alt={`offer-${idx}`} className="w-full h-40 object-cover" />
            </motion.div>
          ))}
        </Slider>
      </div>

      {/* ---------- Nearby Restaurant Count & Location Header ---------- */}
      <div className="px-4 mt-3">
        {!loading && (
          <>
            <p className="text-orange-600 font-semibold mb-3">
              {nearbyRestaurants.length} restaurants near you 🍊
            </p>

            {/* Current location + Change button */}
            <div className="mb-3 px-4 flex flex-col gap-2">
              <div className="flex items-center justify-between bg-orange-50 p-3 rounded-xl shadow-sm">
                <p className="text-orange-600 font-semibold flex items-center gap-1">
                  📍 Your location: {displayLocation || "Current GPS"}
                </p>

                <button
                  onClick={() => {
                    setShowLocationModal(true);
                    // When clicking change, keep searchLocation prefilled
                    setSearchLocation(localStorage.getItem("searchedLocation") || "");
                  }}
                  className="bg-orange-500 text-white px-3 py-1 rounded-xl font-semibold shadow hover:bg-orange-600 transition text-sm"
                >
                  Change Location
                </button>
              </div>
            </div>

            {/* Search restaurants */}
            <input
            type="text"
            placeholder="Search restaurant..."
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            className="border border-gray-300 rounded-xl p-3 w-full mb-3"
          />

            {/* Veg / Non-Veg Filters */}
            <div className="flex gap-2 overflow-x-auto mb-3">
              {["All", "Pure Veg", "Non-Veg"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold shadow transition ${
                    filter === tab ? "bg-orange-500 text-white" : "bg-white text-orange-500 border border-orange-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ---------- Filtered & Searched Restaurant List or Coming Soon ---------- */}
      <div className="flex-1 overflow-y-auto px-3 pb-24">
        {loading ? (
          <ShimmerLoader />
        ) : // if no restaurants for the selected locality, show coming soon message (but keep location header)
        nearbyRestaurants.length === 0 ? (
          <div className="flex flex-col items-center mt-10 px-6 text-center">
           
             <div className="bg-white rounded-xl p-6 shadow-md w-full max-w-lg">
              <p className="text-center text-orange-600 font-semibold">
                No restaurants in your area yet. We're coming soon! 🚀
              </p>
            </div>
          </div>
        ) : filteredRestaurants.length > 0 ? (
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {filteredRestaurants.map((r) => (
   <motion.div
  key={r.id}
  onClick={() => navigate(`/restaurant/${r.id}`)}
  className="bg-white rounded-xl shadow hover:shadow-md transition-all overflow-hidden border border-orange-50 cursor-pointer relative"
>
  {/* Restaurant Image */}
  <div className="relative">
    <img src={r.img} alt={r.name} className="w-full h-36 object-cover" />

    {/* Favorite Heart */}
   <button
  onClick={(e) => {
    e.stopPropagation(); // prevent card click
    // Check if this restaurant is already in favorites
    const isFav = favorites.find((f) => f.id === r.id);
    if (isFav) removeFavorite(r.id);
    else addFavorite({ ...r, type: r.isVeg ? "Veg" : "Non-Veg", amount: r.price });
  }}
  className={`absolute top-2 right-2 p-1 rounded-full bg-white/70 hover:bg-white transition`}
>
  <Heart
    size={20}
    className={`transition-all ${
      favorites.find((f) => f.id === r.id)
        ? "text-orange-500 fill-current"
        : "text-gray-400"
    }`}
  />
</button>
  </div>

  <div className="p-3 flex flex-col gap-2">
    {/* NAME + VEG TAG */}
    <div className="flex justify-between items-center">
      <h3 className="font-semibold text-gray-800">{r.name}</h3>
      <span
        className={`text-xs px-2 py-1 rounded-full ${
          r.isVeg ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}
      >
        {r.isVeg ? "Pure Veg" : "Non-Veg"}
      </span>
    </div>

    {/* RATING • TIME • DISTANCE */}
    <p className="text-sm text-gray-500">
      {r.rating} • {r.time} • {r.distance} km
    </p>

    {/* PRICE */}
    <p className="text-sm text-gray-600">₹{r.price}</p>

    {/* ONLY VIEW BUTTON */}
    <button
      onClick={(e) => {
        e.stopPropagation(); // prevent card click
        navigate(`/restaurant/${r.id}`);
      }}
      className="w-full mt-2 bg-orange-500 text-white py-2 rounded-xl shadow hover:bg-orange-600 transition"
    >
      View
    </button>
  </div>
</motion.div>

  ))}
</motion.div>

        ) : (
          <p className="text-center text-orange-600 font-semibold mt-6">
            No restaurants match your search/filter criteria 🍊
          </p>
        )}
      </div>

      {/* ---------- Footer Navigation ---------- */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-orange-400 to-amber-400 text-white flex justify-around items-center py-2 shadow-lg z-50 rounded-t-2xl">
        {navItems.map((item) => (
          <motion.button
            key={item.key}
            onClick={() => {
              setActiveTab(item.key);
              if (item.key === "Search") navigate("/search");
              else if (item.route) navigate(item.route);
            }}
            whileTap={{ scale: 0.85 }}
            animate={activeTab === item.key ? { y: -6, scale: 1.1 } : { y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex flex-col items-center text-xs relative"
          >
            {activeTab === item.key ? (
              <motion.div
                layoutId="activeCircle"
                className="absolute -top-2 w-10 h-10 bg-white text-orange-500 rounded-full shadow-md flex items-center justify-center"
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-lg">{item.icon}</span>
              </motion.div>
            ) : (
              <span className="text-lg">{item.icon}</span>
            )}
            <span className="mt-1">{item.label ? item.label : item.key}</span>

            {item.key === "Cart" && cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </motion.button>
        ))}
      </nav>
    </div>
  );
}
