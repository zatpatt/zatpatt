//src\pages\SubCategoryPage.jsx

import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getProductsBySubcategory } from "../services/allInOneApi";
import {
  newAddToCartApi,
  goToCartApi,
} from "../services/allInOneCartApi";
import {  updateCartApi } from "../services/cartApi";


export default function SubCategoryPage() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  // const [cart, setCart] = useState({});
  // const totalItems = Object.values(cart).reduce(
  // (sum, qty) => sum + qty,
  // 0
  // );
  // const [cartType, setCartType] = useState(null);
const totalItems = products.reduce(
  (sum, item) => sum + (item.quantity || 0),
  0
);

const fallbackImage =
  "https://images.unsplash.com/photo-1542838132-92c53300491e";


  // /* 🔁 1. SERVICE REDIRECT */
  // useEffect(() => {
  //   if (!state?.type) return;

  //   const productTypes = ["grocery", "snack", "medical", "pet", "party"];

  //   if (!productTypes.includes(state.type)) {
  //     navigate(`/services/${id}`, {
  //       state: {
  //         name: state.name,
  //         type: state.type,
  //       },
  //     });
  //   }
  // }, [id, state, navigate]);

//  useEffect(() => {
//   const fetchItems = async () => {
//     try {
//       setLoading(true);
//       const res = await getProductsBySubcategory(id);
//       if (res?.status) setProducts(res.data || []);
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchItems();
// }, [id]);


  /* 🛒 2. PRODUCT FETCH (THIS WAS MISSING) */
 useEffect(() => {
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getProductsBySubcategory(id);
      if (res?.status) setProducts(res.data || []);
    } catch (err) {
      console.error("Product fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, [id]);

// useEffect(() => {
//   const savedCart = localStorage.getItem("cart");
//   if (savedCart) {
//     setCart(JSON.parse(savedCart));
//   }

//   refreshCart();
// }, []);

// useEffect(() => {
//   localStorage.setItem("cart", JSON.stringify(cart));
// }, [cart]);

  /* 🧺 CART */
//   useEffect(() => {
//   const loadCart = async () => {
//     const res = await goToCartApi();

//     if (!res?.success) return;

//     const uiCart = {};

//     res.data.items.forEach((item) => {
//       uiCart[item.id] = item.quantity;
//     });

//     setCart(uiCart);
//   };

//   loadCart();
// }, []);

/* ---------------- CART ---------------- */



// const refreshCart = async () => {
//   const res = await newCartListApi({});

//   if (!res?.status) return;

//   const uiCart = {};

//   res.items.forEach((item) => {
//     uiCart[item.product_id] = item.quantity;
//   });

//   setCart(uiCart);
// };


// useEffect(() => {
//   refreshCart();
// }, []);

useEffect(() => {
  localStorage.setItem("cartType", "qc");
}, []);


const addToCart = async (p) => {
  localStorage.setItem("cartType", "qc");   // 👈 ADD THIS
  await newAddToCartApi({
    productIds: [p.product_ids],
    quantity: (p.quantity || 0) + 1,
  });

  // 🔁 Reload products
  const res = await getProductsBySubcategory(id);
  if (res?.status) setProducts(res.data || []);
};

const removeFromCart = async (p) => {
  if ((p.quantity || 0) <= 0) return;

  await newAddToCartApi({
    productIds: [p.product_ids],
    quantity: p.quantity - 1,
  });

  // 🔁 Reload products
  const res = await getProductsBySubcategory(id);
  if (res?.status) setProducts(res.data || []);
};


  /* 🖼 UI */
  return (
    <div className="min-h-screen bg-[#fff9f4]">
      <header className="bg-orange-500 text-white py-4 px-4 flex items-center sticky top-0">
        <button onClick={() => navigate(-1)} className="mr-3 bg-white text-orange-500 p-2 rounded-full">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-base font-bold">{state?.name || "Products"}</h1>
          <p className="text-xs opacity-90">{state?.type}</p>
        </div>
      </header>

      <div className="p-4 pb-24">        
      {loading ? (
          <div className="text-center mt-12">Loading products…</div>
        ) : products.length === 0 ? (
          <div className="text-center mt-12">No products found</div>
        ) : (
          <div className="grid grid-cols-2 gap-4">            
            {products.map((p) => {
   const qty = p.quantity || 0;

  return (
  <div
  key={p.product_ids}
  className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col"
>
  {/* PRODUCT IMAGE */}
  <div className="relative">
    <img
      src={p.image || fallbackImage}
      alt={p.name}
      className="w-full h-32 object-cover"
    />
  </div>

  {/* PRODUCT DETAILS */}
  <div className="p-3 flex flex-col gap-2">
    <div>
      <h3 className="font-semibold text-sm truncate">
        {p.name}
      </h3>
      <p className="text-xs text-gray-500 truncate">
        {p.merchant_name}
      </p>
    </div>

    <div className="flex justify-between items-center mt-1">
      <span className="text-orange-600 font-bold">
        ₹{p.price}
      </span>

      <div className="flex items-center gap-2">
        <button
          onClick={() => removeFromCart(p)}
          className="w-8 h-8 flex items-center justify-center border rounded-full"
        >
          −
        </button>

        <div className="w-6 text-center font-semibold">
          {qty}
        </div>

        <button
          onClick={() => addToCart(p)}
          className="w-8 h-8 flex items-center justify-center bg-orange-500 text-white rounded-full"
        >
          +
        </button>
      </div>
    </div>
  </div>
</div>
  );
})}

          </div>
        )}
      </div>

      <div className="fixed left-0 right-0 bottom-0 z-50 p-3">
  <div className="max-w-4xl mx-auto flex items-center justify-between bg-white rounded-2xl p-3 shadow-lg">

    <div className="flex items-center gap-3">
      <div className="bg-orange-100 text-orange-700 rounded-full w-12 h-12 flex items-center justify-center font-bold">
        {totalItems}
      </div>

      <div>
        <div className="text-sm font-semibold">Cart</div>
        <div className="text-xs text-gray-500">
          {totalItems} items
        </div>
      </div>
    </div>

    <button
  onClick={() => {
    localStorage.setItem("cartType", "qc");
    navigate("/cart");
  }}
      className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm"
    >
      Go to Cart
    </button>
  </div>
</div>

    </div>
  );
}