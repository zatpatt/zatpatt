// src/pages/AllInOnePage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Apple,
  Coffee,
  Copy,
  LifeBuoy,
  Box,
  CreditCard,
  Wrench,
  Users,
  Gift,
  Phone,
  Image,
  Truck,
  Tag,
} from "lucide-react";
import {
  getGroceryList,
  getSnackList,
  getMedicalList,
  getPetEssentialsList,
  getPartyEssentialsList,
} from "../services/allInOneApi";


export default function AllInOnePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const [groceries, setGroceries] = useState([]);
  const [snacks, setSnacks] = useState([]);
  const [medical, setMedical] = useState([]);
  const [pets, setPets] = useState([]);
  const [party, setParty] = useState([]);

  // ADD THIS:
const [sosOpen, setSosOpen] = useState(false); // false = collapsed by default

  // --- MASTER DATA (your requested categories + SOS contacts) ---
  const MASTER = useMemo(
    () => [
  {
  id: "sos",
  title: "Emergency & SOS Contacts",
  contacts: [
    {
      name: "Hospital & Ambulance Service",
      phone: "", // main empty, use only subContacts
      subContacts: [
        { name: "Jijau Hospital", phone: "8669106625" },
        { name: "Vasind Hospital", phone: "7083609444" },
      ],
    },
    { name: "Snake Catcher", area: "Vijay Nagre", phone: "9220088143" },
    { name: "Fire Helpline", area: "Vaibhav", phone: "9224676818" },
    { name: "Bike/Car Puncture", area: "Ganesh Thakre", phone: "9222235777" },
    { name: "Petrol/Diesel Delivery", area: "Akshay Halker", phone: "9860267576" },
  ],
},

 {
      id: "groceries-kitchen",
      title: "Groceries & Kitchen",
      items: groceries.map((g) => ({
        name: g.name,
        image: g.image,
        subcategory: g.subcategory,
        type: "grocery",
      })),
    },

    {
      id: "snacks-drinks",
      title: "Snacks & Drinks",
      items: snacks.map((s) => ({
        name: s.name,
        image: s.image,
        subcategory: s.subcategory,
        type: "snack",
      })),
    },

    {
      id: "medical-health",
      title: "Medical & Health",
      items: medical.map((m) => ({
        name: m.name,
        image: m.image,
        subcategory: m.subcategory,
        type: "medical",
      })),
    },

    {
      id: "pet-essentials",
      title: "Pet Essentials",
      items: pets.map((p) => ({
        name: p.name,
        image: p.image,
        subcategory: p.subcategory,
        type: "pet",
      })),
    },

    {
      id: "events-party",
      title: "Events & Party Essentials",
      items: party.map((p) => ({
        name: p.name,
        image: p.image,
        subcategory: p.subcategory,
        type: "party",
      })),
    },



      

      {
        id: "print-services",
        title: "Document & Print Services",
        items: [
          "Print or Xerox (B/W, Color)",
          "Photo Print",
          "Banner / Flex Printing",
          "Lamination",
          "Spiral Binding",
        ].map((n) => ({ name: n })),
      }, 
      
      {
        id: "bills-recharge",
        title: "Bills & Recharge",
        items: ["Mobile Recharge", "DTH / Cable Recharge", "Electricity Bill Pay"].map((n) => ({ name: n })),
      },

      {
        id: "home-services",
        title: "Home Services — Repairs & More",
        items: [
          "Electrician / Plumber / Carpenter",
          "Mobile Repair",
          "AC / Cooler Repair",
          "Water Purifier / Geyser Repair",
          "Refrigerator / TV / Washing Machine Repair",
          "Inverter & Battery Repair",
          "Pest Control",
          "Painting Services",
        ].map((n) => ({ name: n })),
      },

      {
        id: "grooming-wellness",
        title: "Grooming & Wellness",
        items: ["Salon (Men)", "Beauty & Salon (Women)", "Mehendi Artists"].map((n) => ({ name: n })),
      },

     ],
    [groceries, snacks, medical, pets, party]
  );

  
  // useEffect(() => {
  //   // shimmer simulation
  //   const t = setTimeout(() => setLoading(false), 600);
  //   return () => clearTimeout(t);
  // }, []);

  useEffect(() => {
  const fetchAll = async () => {
    try {
      setLoading(true);

      const [
        groceryRes,
        snackRes,
        medicalRes,
        petRes,
        partyRes,
      ] = await Promise.all([
        getGroceryList(),
        getSnackList(),
        getMedicalList(),
        getPetEssentialsList(),
        getPartyEssentialsList(),
      ]);

      if (groceryRes?.status) setGroceries(groceryRes.data || []);
      if (snackRes?.status) setSnacks(snackRes.data || []);
      if (medicalRes?.status) setMedical(medicalRes.data || []);
      if (petRes?.status) setPets(petRes.data || []);
      if (partyRes?.status) setParty(partyRes.data || []);
    } catch (err) {
      console.error("All-in-one fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  fetchAll();
}, []);

  // flatten items for potential autosuggest or search detail (safe)
  const flatItems = useMemo(
    () =>
      MASTER.flatMap((sec) =>
        (sec.items || []).map((it) => ({
          ...it,
          section: sec.title,
        }))
      ),
    [MASTER]
  );

  // filtered view - ensure SOS (no items) is preserved
  const filtered = useMemo(() => {
    if (!query.trim()) return MASTER;
    const q = query.toLowerCase();
    return MASTER
      .map((sec) => {
        if (!sec.items) return sec;
        return { ...sec, items: sec.items.filter((it) => it.name.toLowerCase().includes(q)) };
      })
      .filter((s) => !s.items || s.items.length > 0);
  }, [MASTER, query]);

  // small helper: pick an icon component for a section / item
  const IconForSection = ({ sectionId }) => {
    switch (sectionId) {
      case "sos":
        return <LifeBuoy size={18} />;
      case "groceries-kitchen":
        return <Apple size={18} />;
      case "snacks-drinks":
        return <Coffee size={18} />;
      case "print-services":
        return <Copy size={18} />;
      case "medical-health":
        return <LifeBuoy size={18} />;
      case "pet-essentials":
        return <Box size={18} />;
      case "bills-recharge":
        return <CreditCard size={18} />;
      case "home-services":
        return <Wrench size={18} />;
      case "grooming-wellness":
        return <Users size={18} />;
      case "events-party":
        return <Gift size={18} />;
      default:
        return <Tag size={18} />;
    }
  };

  // CARD color palette for horizontal tiles
  const palette = [
    "#FF6B6B",
    "#F59E0B",
    "#3B82F6",
    "#10B981",
    "#8B5CF6",
    "#EF4444",
    "#06B6D4",
    "#F97316",
  ];
const IMAGE_MAP = {
  "Fruits & Vegetables": "/Images/Fruits-Vegetables.png",
  "Bread & Bakery": "/Images/Bread-Bakery.png",
  "Atta, Rice, Oils & Dals": "/Images/Atta-Rice-Oils-Dals.png",
  "Meat, Fish & Eggs": "/Images/Meat-Fish-Eggs.png",
  "Masala & Dry Fruits": "/Images/Masala-Dry-Fruits.png",
  "Breakfast, Sauces & Cereals": "/Images/Breakfast-Sauces-Cereals.png",
  "Packaged Food": "/Images/Packaged-Food.png",

  "Tea, Coffee & More": "/Images/Tea-Coffee-More.png",
  "Ice Creams & More": "/Images/Ice-Creams-More.png",
  "Frozen Food": "/Images/Frozen-Food.png",
  "Sweet Cravings": "/Images/Sweet-Cravings.png",
  "Cold Drink & Juices": "/Images/Cold-Drink-Juices.png",
  "Munchies": "/Images/Munchies.png",
  "Biscuits & Cookies": "/Images/Biscuits-Cookie.png",

  "Print or Xerox (B/W, Color)": "/Images/Print-or-Xerox(B-W-Color).png",
  "Photo Print": "/Images/Photo-Print.png",
  "Banner / Flex Printing": "/Images/Banner-Flex-Printing.png",
  "Lamination": "/Images/Lamination.png",
  "Spiral Binding": "/Images/Spiral-Binding.png",

  "Medicines & First Aid": "/Images/Medicines-First-Aid.png",
  "Thermometer, BP Monitor & More ": "/Images/Health-Drinks-Protein-Supplements.png",
  "Sanitary Pads & Diapers": "/Images/Sanitary-Pads-Diapers.png",
  "Health Drinks & Protein Supplements": "/Images/Health-Drinks-Protein-Supplements.png",
  "Baby Cares": "/Images/Baby-Cares.png",

  "Dog Food": "/Images/Dog-Food.png",
  "Cat Food": "/Images/Cat-Food.png",
  "Treats": "/Images/Treats.png",
  "Litter": "/Images/Litter.png",
  "Pet Grooming": "/Images/Pet-Grooming.png",
  "Pet Accessories": "/Images/Pet-Accessories.png",

  "Balloons & Party Decoration": "/Images/Balloons-Party-Decoration.png",
  "Birthday Banners": "/Images/Birthday-Banners.png",
  "Candle Packs": "/Images/Candle-Packs.png",
  "Disposable Plates & Cups": "/Images/Disposable-Plates-Cups.png",
  "Return Gifts": "/Images/Return-Gifts.png",
  "Helium Balloons": "/Images/Helium-Balloons.png",
  "Celebration Cakes": "/Images/Celebration-Cakes.png",

  "Mobile Recharge": "/Images/Mobile-Recharge.png",
  "DTH / Cable Recharge": "/Images/DTH-Cable-Recharge.png",
  "Electricity Bill Pay": "/Images/Electricity-Bill-Pay.png",

  "Electrician / Plumber / Carpenter": "/Images/Electrician-Plumber-Carpenter.png",
  "Mobile Repair": "/Images/Mobile-Repair.png",
  "AC / Cooler Repair": "/Images/AC-Cooler-Repair.png",
  "Water Purifier / Geyser Repair": "/Images/Water-Purifier-Geyser-Repair.png",
  "Refrigerator / TV / Washing Machine Repair": "/Images/Refrigerator-TV-Washing-Machine-Repair.png",
  "Inverter & Battery Repair": "/Images/Inverter-Battery-Repair.png",
  "Pest Control": "/Images/Pest-Control.png",
  "Painting Services": "/Images/Painting-Services.png",

  "Salon (Men)": "/Images/Salon(Men).png",
  "Beauty & Salon (Women)": "/Images/Beauty-Salon(Women).png",
  "Mehendi Artists": "/Images/Mehendi-Artists.png",
};

  return (
    <div className="min-h-screen bg-[#fff9f4]">
      {/* Header */}
      <header className="bg-orange-500 text-white py-4 px-6 shadow-md flex items-center">
        <button onClick={() => navigate(-1)} className="mr-3 bg-white text-orange-500 p-2 rounded-full">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-lg font-bold">All Categories</h1>
      </header>

      {/* Search */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-full shadow px-4 py-2 flex items-center">
          <Search size={16} className="text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search categories, services, items..."
            className="ml-3 flex-1 outline-none text-gray-700"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-gray-400 text-sm px-2">
              Clear
            </button>
          )}
        </div>
      </div>

{/* SOS — compact red box */}
{MASTER.filter((sec) => sec.id === "sos").map((sos) => (
  <div
    key={sos.id}
    className="mx-4 mt-6 p-4 rounded-2xl"
    style={{ background: "#ff000015", boxShadow: "0 0 18px #ff000033", border: "1px solid #ff5555" }}
  >
    <div
  className="flex items-center justify-between mb-3 cursor-pointer"
  onClick={() => setSosOpen(!sosOpen)}
>
  <div className="flex items-center gap-2">
    <LifeBuoy size={18} className="text-red-600" />
    <h2 className="text-lg font-bold text-red-600">🚨 {sos.title}</h2>
  </div>
  <div className="flex items-center gap-2 text-xs text-gray-500">
   {sosOpen ? "▲" : "▼"}
  </div>
</div>

  {sosOpen && (
  <div className="space-y-2">
    {sos.contacts.map((c, i) => (
      <div key={i} className="bg-white rounded-lg shadow-sm p-2 flex flex-col gap-1">
        {(c.subContacts ? c.subContacts : [c]).map((contact, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between text-sm text-gray-900 bg-white px-2 py-1 rounded-lg shadow"
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-sm flex items-center justify-center text-white font-semibold text-sm"
                  style={{ background: "#e53935" }}
                >
                  {contact.name.charAt(0)}
                </div>
                <span className="truncate font-medium">{contact.name}</span>
              </div>
              {c.name && c.subContacts && (
                <span className="text-xs text-gray-500 ml-10">{c.name}</span>
              )}
              {!c.subContacts && c.area && (
                <span className="text-xs text-gray-500 ml-10">{c.area}</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-700">{contact.phone}</span>
              <a
                href={`tel:${contact.phone}`}
                className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-semibold shadow active:scale-95"
              >
                Call
              </a>
            </div>
          </div>
        ))}
      </div>
    ))}
  </div>
)}
  </div>
))}

      {/* Content */}
      <div className="mt-5 space-y-6 px-2 pb-24">
        {loading ? (
          // skeleton
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse px-4">
                <div className="h-4 bg-gray-300 w-44 rounded mb-3"></div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <div key={j} className="w-28 h-32 bg-gray-200 rounded-xl flex-shrink-0"></div>
                  ))}
                </div>
              </div>
            ))}
          </>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-500 mt-12">No categories match your search.</div>
        ) : (
          filtered
  .filter((sec) => sec.id !== "sos") // <-- exclude SOS
  .map((sec) => (
    <section key={sec.id} className="px-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-gray-800">{sec.title}</h2>
                <div className="text-xs text-gray-400 flex items-center gap-2">
                  <IconForSection sectionId={sec.id} />
                </div>
              </div>

              {/* If section has items (normal sections) render horizontal cards */}
{sec.items && (
  <div className="grid grid-cols-3 gap-3 pb-6">
    {sec.items.map((it) => (
      <div
        key={it.name}
        onClick={() => {
          if (sec.id === "bills-recharge") {  // ✅ fixed id check
            let tab = "mobile";
            const name = it.name.toLowerCase();

            if (name.includes("dth") || name.includes("cable")) tab = "dth";
            else if (name.includes("electricity") || name.includes("bill")) tab = "electricity";
           navigate("/bills-recharge", { state: { activeTab: tab } });
          } else if (sec.id === "print-services") { // keep print logic too if needed
            let tab = "xerox";
            const name = it.name.toLowerCase();
            if (name.includes("photo")) tab = "photo";
            else if (name.includes("banner") || name.includes("flex")) tab = "banner";
            else if (name.includes("lamination")) tab = "lamination";
            else if (name.includes("spiral") || name.includes("binding")) tab = "binding";

            navigate("/print-services", { state: { activeTab: tab } });
          } 

else if (sec.id === "grooming-wellness") { // keep print logic too if needed
            let tab = "salon-men";
            const name = it.name.toLowerCase();
            if (name.includes("beauty") || name.includes("women")) tab = "beauty-salon-women";
            else if (name.includes("mehendi") || name.includes("artists")) tab = "mehendi-artists";

            navigate("/grooming-wellness", { state: { activeTab: tab } });
          } 

else if (sec.id === "home-services") {
  let tab = "mobile-repair"; // default
 const name = it.name.toLowerCase();
 if (name.includes("mobilerepair")) tab = "mobile-repair";
 else if (name.includes("fridge") || name.includes("tv") || name.includes("washing") || name.includes("machine"))
    tab = "refrigerator-tv-washing-machine-repair";
            else if (name.includes("ac") || name.includes("cooler")) tab = "ac-cooler-repair";
            else if (name.includes("purifier") || name.includes("geyser") || name.includes("water") || name.includes("heater"))
    tab = "water-purifier-geyser-repair";
            
            else if (name.includes("inverter") || name.includes("battery")) tab = "inverter-battery-repair";
            else if (name.includes("pest")) tab = "pest-control";
           else if (name.includes("paint")) tab = "painting-services";
           else if (name.includes("electrician") || name.includes("plumber") || name.includes("carpenter"))
    tab = "electrician-plumber-carpenter";

  navigate("/home-services", { state: { activeTab: tab } });
}
else if (it.name.toLowerCase().includes("birthday banner")) {
        navigate("/print-services", { state: { activeTab: "banner" } });
      } 
else if (it.subcategory) {
  navigate(
    `/subcategory/${it.subcategory}`,
    {
      state: {
        name: it.name,
        type: it.type,
      },
    }
  );
}
else {
  navigate(`/category/${encodeURIComponent(it.name)}`);
}

        }}
        className="bg-white rounded-2xl shadow-sm p-3 flex flex-col items-center cursor-pointer hover:shadow-md transition"
      >
        <div className="w-20 h-20 rounded-xl mb-2 overflow-hidden">
          <img
           src={it.image || IMAGE_MAP[it.name] || "/Images/default.png"}
            alt={it.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-xs text-center font-semibold text-gray-800 leading-tight">
          {it.name}
        </div>
      </div>
    ))}
  </div>
)}

              
            </section>
          ))
        )}
      </div>
    </div>
  );
}
