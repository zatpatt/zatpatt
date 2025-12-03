// src/pages/HomeServicesPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Phone, Wrench, Smartphone, Snowflake, Droplet, Tv, BatteryCharging, Bug, Paintbrush } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";

export default function GroomingWellnessPage() {
  const navigate = useNavigate();
  const addCart = useCart();
  const location = useLocation();

  const [active, setActive] = useState("salon-men");
  const [tab, setTab] = useState("salon-men");

   useEffect(() => {
    if (location.state?.activeTab) {
      setActive(location.state.activeTab);
    }
  }, [location.state]);

   return (
    <div className="min-h-screen bg-[#fff8f1] pb-32">

      {/* HEADER */}
      <header className="bg-orange-500 text-white py-4 px-4 shadow-md flex items-center">
        <button onClick={() => navigate(-1)} className="mr-3 bg-white/90 text-orange-500 p-2 rounded-full shadow">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-lg font-bold">Grooming & Wellness</h1>
      </header>

 {/* Tabs */}
      <div className="mt-5 px-4 flex overflow-x-auto gap-2 pb-3 justify-center">
        {location.state?.activeTab ? null : (
          <div className="flex overflow-x-auto gap-2 pb-3 justify-center">
            {[
    { key: "salon-men", label: "Salon Men"},         
    { key: "beauty-salon-women", label: "Beauty Salon Women"},
    { key: "mehendi-artists", label: "Mehendi Artists"},
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

 {/* ----- salon-men FORM ----- */}
       {active === "salon-men" && (
         <motion.div className="bg-white rounded-2xl shadow p-5 w-[90%] max-w-lg text-left mx-auto mt-6 space-y-3">
           <h2 className="text-xl font-bold text-gray-900 text-center">Salon (Men)</h2>
           <p className="text-sm text-gray-600 text-center mb-3">Store Services</p>
 
          
 {/*Contact 1  */}
     
    <div className="max-w-md mx-auto bg-orange-100 shadow-lg rounded-2xl p-3 flex justify-between items-center">
  <div className="flex flex-col gap-1">
    <p className="text-xs font-semibold text-gray-700">Mr. Ramesh kumar(edit)</p>
    <p className="text-[15px] text-gray-500">New Looks Mens Salon</p>
  </div>
  <button
    onClick={() => window.location.href="tel:7264850230"}
    className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full shadow flex items-center gap-1"
  >
    <Phone size={12}/> Call Us
  </button>
</div>
 {/*Contact 2  */}
     
    <div className="max-w-md mx-auto bg-orange-100 shadow-lg rounded-2xl p-3 flex justify-between items-center">
  <div className="flex flex-col gap-1">
    <p className="text-xs font-semibold text-gray-700">Mr. Ramesh kumar(edit)</p>
    <p className="text-[15px] text-gray-500">V-Cut Unisex Salon</p>
  </div>
  <button
    onClick={() => window.location.href="tel:7264850230"}
    className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full shadow flex items-center gap-1"
  >
    <Phone size={12}/> Call Us
  </button>
</div>

  {/*Contact 3  */}
     
  <div className="max-w-md mx-auto bg-orange-100 shadow-lg rounded-2xl p-3 flex justify-between items-center">
  <div className="flex flex-col gap-1">
    <p className="text-xs font-semibold text-gray-700">Mr. Ramesh kumar(edit)</p>
    <p className="text-[15px] text-gray-500">Store Name</p>
  </div>
  <button
    onClick={() => window.location.href="tel:7264850230"}
    className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full shadow flex items-center gap-1"
  >
    <Phone size={12}/> Call Us
  </button>
</div>    

  {/* Info Box */}
     <div className="text-left text-sm space-y-1 bg-red-100 p-3 rounded-xl shadow-sm mb-4">
       <p><strong>NOTE</strong> : We just provide numbers avalivabilty and serivces check with respective services providers.</p>
          </div>
 
         </motion.div>
       )}
 
{/* ----- beauty-salon-women FORM ----- */}
       {active === "beauty-salon-women" && (
         <motion.div className="bg-white rounded-2xl shadow p-5 w-[90%] max-w-lg text-left mx-auto mt-6 space-y-3">
           <h2 className="text-xl font-bold text-gray-900 text-center">Beauty & Salon (women)</h2>
           <p className="text-sm text-gray-600 text-center mb-3">Store Services</p>
 
          
 {/*Contact 1  */}
     
    <div className="max-w-md mx-auto bg-orange-100 shadow-lg rounded-2xl p-3 flex justify-between items-center">
  <div className="flex flex-col gap-1">
    <p className="text-xs font-semibold text-gray-700">Mr. Bhushan Jadhav</p>
    <p className="text-[15px] text-gray-500">Store Name</p>
  </div>
  <button
    onClick={() => window.location.href="tel:9892210211"}
    className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full shadow flex items-center gap-1"
  >
    <Phone size={12}/> Call Us
  </button>
</div>
 {/*Contact 2  */}
     
    <div className="max-w-md mx-auto bg-orange-100 shadow-lg rounded-2xl p-3 flex justify-between items-center">
  <div className="flex flex-col gap-1">
    <p className="text-xs font-semibold text-gray-700">Mr. Ramesh kumar(edit)</p>
    <p className="text-[15px] text-gray-500">V-cut Unisex Salon</p>
  </div>
  <button
    onClick={() => window.location.href="tel:7264850230"}
    className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full shadow flex items-center gap-1"
  >
    <Phone size={12}/> Call Us
  </button>
</div>
 
  {/* Info Box */}
     <div className="text-left text-sm space-y-1 bg-red-100 p-3 rounded-xl shadow-sm mb-4">
       <p><strong>NOTE</strong> : We just provide numbers avalivabilty and serivces check with respective services providers.</p>
          </div>
 
         </motion.div>
       )}
 
 {/* ----- mehendi-artists FORM ----- */}
       {active === "mehendi-artists" && (
         <motion.div className="bg-white rounded-2xl shadow p-5 w-[90%] max-w-lg text-left mx-auto mt-6 space-y-3">
           <h2 className="text-xl font-bold text-gray-900 text-center">Mehendi Artists</h2>
           <p className="text-sm text-gray-600 text-center mb-3">Home & Store Services</p>
           
 {/*Contact 1  */}
     
    <div className="max-w-md mx-auto bg-orange-100 shadow-lg rounded-2xl p-3 flex justify-between items-center">
  <div className="flex flex-col gap-1">
    <p className="text-xs font-semibold text-gray-700">Mr. Ramesh kumar(edit)</p>
    <p className="text-[15px] text-gray-500">Store Name</p>
  </div>
  <button
    onClick={() => window.location.href="tel:7264850230"}
    className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full shadow flex items-center gap-1"
  >
    <Phone size={12}/> Call Us
  </button>
</div>
 {/*Contact 2  */}
     
    <div className="max-w-md mx-auto bg-orange-100 shadow-lg rounded-2xl p-3 flex justify-between items-center">
  <div className="flex flex-col gap-1">
    <p className="text-xs font-semibold text-gray-700">Mr. Ramesh kumar(edit)</p>
    <p className="text-[15px] text-gray-500">Home Service</p>
  </div>
  <button
    onClick={() => window.location.href="tel:7264850230"}
    className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full shadow flex items-center gap-1"
  >
    <Phone size={12}/> Call Us
  </button>
</div>

  {/*Contact 3  */}
     
  <div className="max-w-md mx-auto bg-orange-100 shadow-lg rounded-2xl p-3 flex justify-between items-center">
  <div className="flex flex-col gap-1">
    <p className="text-xs font-semibold text-gray-700">Mr. Ramesh kumar(edit)</p>
    <p className="text-[15px] text-gray-500">Store Name</p>
  </div>
  <button
    onClick={() => window.location.href="tel:7264850230"}
    className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full shadow flex items-center gap-1"
  >
    <Phone size={12}/> Call Us
  </button>
</div>    

  {/* Info Box */}
     <div className="text-left text-sm space-y-1 bg-red-100 p-3 rounded-xl shadow-sm mb-4">
       <p><strong>NOTE</strong> : We just provide numbers avalivabilty and serivces check with respective services providers.</p>
          </div>
 
         </motion.div>
       )}


      {/* HELP BAR */}
      <div className="fixed left-0 right-0 bottom-0 p-4">
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl p-3 flex justify-between items-center border-l-4 border-orange-500">
          <p className="text-xs font-semibold text-gray-700">Need help with services?</p>
          <button
            onClick={() => window.location.href="tel:7264850230"}
            className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full shadow flex items-center gap-1"
          >
            <Phone size={12}/> Call Us
          </button>
        </div>
      </div>

    </div>
  );
}
