import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ShoppingCart, X, Search } from "lucide-react";
import { motion } from "framer-motion";

const productsList = [
  { id: 1, name: "Hyderabadi Biryani", price: 220, img: "https://via.placeholder.com/80" },
  { id: 2, name: "Paneer Butter Masala", price: 180, img: "https://via.placeholder.com/80" },
  { id: 3, name: "Eggs (12 pcs)", price: 90, img: "https://via.placeholder.com/80" },
  { id: 4, name: "Milk 1L", price: 50, img: "https://via.placeholder.com/80" },
  { id: 5, name: "Maggi Noodles", price: 40, img: "https://via.placeholder.com/80" },
  { id: 6, name: "Apple (1kg)", price: 150, img: "https://via.placeholder.com/80" },
  { id: 7, name: "Bread", price: 35, img: "https://via.placeholder.com/80" },
  { id: 8, name: "Banana (1kg)", price: 60, img: "https://via.placeholder.com/80" },
];

const trendingSearches = ["Biryani", "Milk", "Eggs", "Snacks", "Fruits", "Paneer"];

export default function SearchPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialQuery = location.state?.query || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [recentSearches, setRecentSearches] = useState(() => {
    const stored = localStorage.getItem("recentSearches");
    return stored ? JSON.parse(stored) : [];
  });
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem("cartItems");
    return stored ? JSON.parse(stored) : [];
  });
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts([]);
      return;
    }
    const results = productsList.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchQuery]);

  const handleSearchSubmit = (query) => {
    if (!query.trim()) return;
    setSearchQuery(query);
    setRecentSearches((prev) => {
      const updated = [query, ...prev.filter((item) => item !== query)];
      localStorage.setItem("recentSearches", JSON.stringify(updated.slice(0, 5)));
      return updated.slice(0, 5);
    });
  };

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
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const handleTrendingClick = (term) => handleSearchSubmit(term);

  return (
    <div className="min-h-screen bg-[#FFF7ED] flex flex-col">
      {/* ---------- Header with Back Button + Search ---------- */}
      <header className="bg-orange-500 text-white py-4 px-4 shadow-lg w-full relative flex items-center justify-center">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-3 p-2 rounded-full bg-white shadow hover:bg-gray-100 transition"
        >
          <ArrowLeft className="w-5 h-5 text-orange-500" />
        </button>

        {/* Search Bar */}
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

      {/* ---------- Recent Searches ---------- */}
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

      {/* ---------- Trending Searches ---------- */}
      <div className="px-4 py-2">
        <span className="font-semibold text-gray-700 mb-2 block">Trending</span>
        <div className="flex gap-2 overflow-x-auto py-1">
          {trendingSearches.map((term, idx) => (
            <motion.button
              key={idx}
              onClick={() => handleTrendingClick(term)}
              whileTap={{ scale: 0.9 }}
              className="flex-shrink-0 bg-amber-100 text-amber-800 px-4 py-2 rounded-full whitespace-nowrap hover:bg-amber-200 transition"
            >
              {term}
            </motion.button>
          ))}
        </div>
      </div>

      {/* ---------- Search Results ---------- */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {searchQuery && filteredProducts.length === 0 && (
          <div className="text-center mt-16">
            <div className="flex justify-center mb-4">
              <img
  src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 24 24' fill='none' stroke='%23f97316' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><circle cx='11' cy='11' r='8'/><line x1='21' y1='21' x2='16.65' y2='16.65'/><text x='6' y='25' font-size='4' fill='%23f97316'>No Results</text></svg>"
  alt="No Results"
  className="w-40 h-40 object-contain opacity-90"
/>
            </div>
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
              src={product.img}
              alt={product.name}
              className="w-16 h-16 rounded-xl object-cover border border-orange-100"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{product.name}</h3>
              <p className="text-orange-600 font-semibold">₹{product.price}</p>
            </div>
            <button
              onClick={() => addToCart(product)}
              className="bg-orange-400 text-white px-4 py-2 rounded-2xl hover:bg-orange-500 transition flex items-center gap-1"
            >
              <ShoppingCart className="w-4 h-4" /> Add
            </button>
          </motion.div>
        ))}
      </div>

      {/* ---------- Sticky Cart Summary ---------- */}
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
    </div>
  );
}
