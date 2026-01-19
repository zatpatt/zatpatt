//src\pages\AddressPage.jsx
import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Trash2,
  MapPin,
  Home,
  Landmark,
  Building2,
  Phone,
  LocateFixed,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { createAddress, getAddressList } from "../services/addressApi";


export default function AddressPage() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [building, setBuilding] = useState("");
  const [area, setArea] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [locating, setLocating] = useState(false);
  const [coords, setCoords] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);


  useEffect(() => {
  if (!area || !city) return;

  const timer = setTimeout(async () => {
    try {
      const query = encodeURIComponent(
        `${building || ""}, ${area}, ${landmark || ""}, ${city}`
      );

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
      );
      const data = await res.json();

      if (data?.length) {
        const lat = Number(data[0].lat);
        const lon = Number(data[0].lon);

        setLatitude(lat);
        setLongitude(lon);
        setCoords({ latitude: lat, longitude: lon });
      }
    } catch (err) {
      console.error("Geocoding failed", err);
    }
  }, 800); // 👈 debounce

  return () => clearTimeout(timer);
}, [building, area, landmark, city]);

  // Load saved addresses
  // useEffect(() => {
  //   const stored = JSON.parse(localStorage.getItem("addresses")) || [];
  //   setAddresses(stored);
  // }, []);

  // // Save to localStorage
  // const saveAddresses = (newAddresses) => {
  //   localStorage.setItem("addresses", JSON.stringify(newAddresses));
  //   setAddresses(newAddresses);
  // };

  // Add address
const handleAddAddress = async () => {
  if (!isFormValid()) return;

  if (!latitude || !longitude) {
    alert("Please select a valid location on map");
    return;
  }

  try {
    const payload = {
      building,
      area,
      landmark,
      city,
      phone,
      is_default: addresses.length === 0,
      latitude,
      longitude,
    };

    const res = await createAddress(payload);

    if (!res.status) {
      alert("Failed to save address");
      return;
    }

    const list = await getAddressList();

    if (list.status) {
      const formatted = list.addresses.map((addr) => ({
        id: addr.address_id,
        building: addr.building,
        area: addr.area,
        landmark: addr.landmark,
        city: addr.city,
        phone: addr.mobile,
        isDefault: addr.is_default,
        latitude: addr.latitude,
        longitude: addr.longitude,
      }));

      setAddresses(formatted);
    }

    setBuilding("");
    setArea("");
    setLandmark("");
    setCity("");
    setPhone("");
    setCoords(null);
    setLatitude(null);
    setLongitude(null);
  } catch (err) {
    console.error(err);
    alert("Failed to save address");
  }
};



useEffect(() => {
  const fetchAddresses = async () => {
    try {
      const res = await getAddressList();

      if (!res.status) {
        alert("Failed to load addresses");
        return;
      }

      const formatted = res.addresses.map((addr) => ({
  id: addr.address_id,
  building: addr.building,
  area: addr.area,
  landmark: addr.landmark,
  city: addr.city,
  phone: addr.mobile,
  isDefault: addr.is_default,
  latitude: addr.latitude,
  longitude: addr.longitude,
}));


      setAddresses(formatted);
    } catch (err) {
      console.error(err);
      alert("Failed to load addresses");
    }
  };

  fetchAddresses();
}, []);



  // Delete
 const handleDelete = (id) => {
  setAddresses((prev) => prev.filter((addr) => addr.id !== id));
};

  // Set Default
 const handleSetDefault = (id) => {
  setAddresses((prev) =>
    prev.map((addr) =>
      addr.id === id
        ? { ...addr, isDefault: true }
        : { ...addr, isDefault: false }
    )
  );
};


  // Deliver to address
  const handleDeliverTo = (addr) => {
  // ✅ SAVE SELECTED ADDRESS ID
  localStorage.setItem(
    "selectedAddressId",
    JSON.stringify(addr.id || addr.address_id)
  );

  // (optional but useful)
  localStorage.setItem(
    "selectedAddress",
    JSON.stringify(addr)
  );

  navigate("/cart"); // 🔁 go back to CartPage
};


  // Validation
  const isValidPhone = (value) => /^[0-9]{10}$/.test(value);
 const isFormValid = () =>
  building.trim() &&
  area.trim() &&
  landmark.trim() &&
  city.trim() &&
  isValidPhone(phone) &&
  latitude &&
  longitude;


  // Use Current Location
 const handleUseCurrentLocation = () => {
  if (!navigator.geolocation) {
    alert("Geolocation not supported by your browser.");
    return;
  }

  setLocating(true);

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const { latitude: lat, longitude: lon } = pos.coords;

      // ✅ set state first
      setLatitude(lat);
      setLongitude(lon);
      setCoords({ latitude: lat, longitude: lon });

      try {
        // ✅ use coords directly, NOT state
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
        );
        const data = await response.json();

        if (data?.address) {
          const detectedArea =
            data.address.suburb ||
            data.address.village ||
            data.address.neighbourhood ||
            data.address.road ||
            "";

          const detectedCity =
            data.address.city ||
            data.address.town ||
            data.address.county ||
            "";

          setArea(detectedArea);
          setCity(detectedCity);
          setLandmark(
            data.display_name?.split(",").slice(0, 2).join(", ") || ""
          );
        }
      } catch (err) {
        console.error(err);
        alert("Unable to fetch location details.");
      } finally {
        setLocating(false);
      }
    },
    () => {
      alert("Location access denied. Please enable it in settings.");
      setLocating(false);
    }
  );
};


  return (
    <div className="min-h-screen bg-[#FFF7ED] flex flex-col">
      {/* Header */}
      <header className="bg-orange-500 text-white py-4 px-7 shadow-lg w-full relative flex items-center justify-center">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-5 top-3 p-2 rounded-full bg-white shadow hover:bg-gray-100 transition"
        >
          <ArrowLeft className="w-5 h-5 text-orange-500" />
        </button>

        <h1 className="text-xl font-bold text-center">📍 Manage Address</h1>
      </header>

      {/* Form Section */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <div className="bg-white rounded-2xl shadow-md p-5 space-y-4 border border-orange-100">
          {/* Detect Location */}
          <button
            onClick={handleUseCurrentLocation}
            disabled={locating}
            className="w-full flex items-center justify-center gap-2 bg-orange-100 text-orange-600 py-2 rounded-lg font-semibold hover:bg-orange-200 transition"
          >
            {locating ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Detecting Location...
              </>
            ) : (
              <>
                <LocateFixed size={18} />
                Use Current Location
              </>
            )}
          </button>

          {/* Map Preview */}
          {coords && (
            <div className="w-full h-52 rounded-lg overflow-hidden shadow-md">
              <iframe
                title="map-preview"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps?q=${coords.latitude},${coords.longitude}&z=15&output=embed`}
              ></iframe>
            </div>
          )}

          {/* Inputs */}
          <div className="flex items-center gap-2">
            <Building2 className="text-orange-500" size={18} />
            <input
              type="text"
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
              placeholder="Building / Flat No."
              className="w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-orange-400 outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Home className="text-orange-500" size={18} />
            <input
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="Area / Locality"
              className="w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-orange-400 outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Landmark className="text-orange-500" size={18} />
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="Nearby Landmark"
              className="w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-orange-400 outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="text-orange-500" size={18} />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City / Town"
              className="w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-orange-400 outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Phone className="text-orange-500" size={18} />
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                const input = e.target.value;
                if (/^\d*$/.test(input) && input.length <= 10) {
                  setPhone(input);
                }
              }}
              placeholder="Phone Number (10 digits)"
              maxLength="10"
              className={`w-full border rounded-lg p-2 outline-none focus:ring-2 ${
                isValidPhone(phone)
                  ? "border-gray-200 focus:ring-orange-400"
                  : "border-red-300 focus:ring-red-400"
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={latitude ?? ""}
              disabled
              placeholder="Latitude"
              className="w-full bg-gray-100 border border-gray-200 rounded-lg p-2 text-sm text-gray-500"
            />
            <input
              type="text"
              value={longitude ?? ""}
              disabled
              placeholder="Longitude"
              className="w-full bg-gray-100 border border-gray-200 rounded-lg p-2 text-sm text-gray-500"
            />
          </div>

          {/* Save */}
          <button
            onClick={handleAddAddress}
            disabled={!isFormValid()}
            className={`w-full py-3 rounded-xl font-semibold shadow-md transition ${
              isFormValid()
                ? "bg-gradient-to-r from-orange-500 to-amber-400 text-white hover:shadow-lg"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Save Address
          </button>
        </div>

        {/* Saved Addresses */}
        <div className="mt-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Saved Addresses
          </h2>
          <AnimatePresence>
            {addresses.length === 0 ? (
              <p className="text-gray-500 text-sm">No addresses saved yet.</p>
            ) : (
              addresses.map((addr) => (
                <motion.div
                  key={addr.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-4 mb-3 rounded-xl shadow-sm border ${
                    addr.isDefault
                      ? "border-orange-400 bg-orange-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {addr.building}, {addr.area}
                      </p>
                      <p className="text-sm text-gray-500">
                        {addr.landmark}, {addr.city}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        📞 {addr.phone}
                      </p>
                      {addr.isDefault && (
                        <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full mt-1 inline-block">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {!addr.isDefault && (
                        <button
                          onClick={() => handleSetDefault(addr.id)}
                          className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-md hover:bg-green-200"
                        >
                          Set Default
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(addr.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Map Preview */}
                 {addr.latitude && addr.longitude && (
                  <div className="w-full h-36 rounded-lg overflow-hidden mt-3">
                    <iframe
                      title="saved-map"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      src={`https://www.google.com/maps?q=${addr.latitude},${addr.longitude}&z=15&output=embed`}
                    />
                  </div>
                )}

                  {/* Deliver To Button */}
                  <button
                    onClick={() => handleDeliverTo(addr)}
                    className="mt-3 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-400 text-white py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition"
                  >
                    <CheckCircle size={18} />
                    Deliver to this Address
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
