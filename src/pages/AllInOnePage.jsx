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

export default function AllInOnePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  // --- MASTER DATA (your requested categories + SOS contacts) ---
  const MASTER = useMemo(
    () => [
      {
        id: "sos",
        title: "Emergency & SOS Contacts",
        contacts: [
          { name: "Ambulance Service", area: "City Ambulance", phone: "108" },
          { name: "Snake Catcher", area: "Vijay Nagre", phone: "9220088143" },
          { name: "Fire Helpline", area: "Fire Dept", phone: "101" },
          { name: "Bike/Car Puncture", area: "Roadside Assist", phone: "9876543210" },
          { name: "Petrol/Diesel Delivery", area: "Limited Areas", phone: "9801234567" },
        ],
      },

      {
        id: "groceries-kitchen",
        title: "Groceries & Kitchen",
        items: [
          "Fruits & Vegetables",
          "Bread & Bakery",
          "Atta, Rice, Oils & Dals",
          "Meat, Fish & Eggs",
          "Masala & Dry Fruits",
          "Breakfast, Sauces & Cereals",
          "Packaged Food",
        ].map((n) => ({ name: n })),
      },

      {
        id: "snacks-drinks",
        title: "Snacks & Drinks",
        items: [
          "Tea, Coffee & More",
          "Ice Creams & More",
          "Frozen Food",
          "Sweet Cravings",
          "Cold Drink & Juices",
          "Munchies",
          "Biscuits & Cookies",
        ].map((n) => ({ name: n })),
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
        id: "medical-health",
        title: "Medical & Health",
        items: [
          "Medicines & First Aid",
          "Thermometer & BP Monitor",
          "Sanitary Pads & Diapers",
          "Health Drinks & Protein Supplements",
          "Kids & Baby",
        ].map((n) => ({ name: n })),
      },

      {
        id: "pet-essentials",
        title: "Pet Essentials",
        items: [
          "Dog Food",
          "Cat Food",
          "Treats",
          "Litter",
          "Pet Grooming",
          "Pet Accessories",
        ].map((n) => ({ name: n })),
      },

      {
        id: "bills-recharge",
        title: "Bills & Recharge",
        items: ["Mobile Recharge", "DTH/Cable Recharge", "Electricity Bill Pay"].map((n) => ({ name: n })),
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

      {
        id: "events-party",
        title: "Events & Party Essentials",
        items: [
          "Balloons & Party Decoration",
          "Birthday Banners",
          "Candle Packs",
          "Disposable Plates & Cups",
          "Return Gifts",
          "Helium Balloons",
          "Celebration Cakes",
        ].map((n) => ({ name: n })),
      },
    ],
    []
  );

  useEffect(() => {
    // shimmer simulation
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
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
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <LifeBuoy size={18} className="text-red-600" />
              <h2 className="text-lg font-bold text-red-600">🚨 {sos.title}</h2>
            </div>
            <div className="text-xs text-gray-500">Keep handy</div>
          </div>

          <div className="space-y-2">
            {sos.contacts.map((c, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm p-2 flex items-center gap-3"
                style={{ alignItems: "center" }}
              >
                {/* small square avatar */}
                <div
                  className="w-10 h-10 rounded-sm flex items-center justify-center text-white font-semibold text-sm"
                  style={{ background: "#e53935" }}
                >
                  {String(c.name).trim().charAt(0)}
                </div>

                {/* single-line look: name + area */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-gray-900 truncate">
                      {c.name}
                      {/* area inline, smaller */}
                      <span className="text-xs text-gray-500 ml-2">• {c.area}</span>
                    </div>
                    {/* phone (smaller) */}
                    <div className="text-xs text-gray-700 ml-2">{c.phone}</div>
                  </div>
                </div>

                {/* call button */}
                <a
                  href={`tel:${c.phone}`}
                  className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow active:scale-95"
                >
                  Call
                </a>
              </div>
            ))}
          </div>
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
          filtered.map((sec) => (
            <section key={sec.id} className="px-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-gray-800">{sec.title}</h2>
                <div className="text-xs text-gray-400 flex items-center gap-2">
                  <IconForSection sectionId={sec.id} />
                </div>
              </div>

              {/* If section has items (normal sections) render horizontal cards */}
              {sec.items && (
                <div className="flex gap-3 overflow-x-auto pb-3">
                  {sec.items.map((it, idx) => {
                    const color = palette[idx % palette.length];
                    return (
                      <div
                        key={it.name}
                        onClick={() => navigate(`/category/${encodeURIComponent(it.name)}`)}
                        className="w-36 min-w-[9rem] bg-white rounded-2xl shadow-sm p-3 flex-none cursor-pointer hover:shadow-md transition"
                      >
                        <div
                          className="w-12 h-12 rounded-full mb-2 flex items-center justify-center mx-auto"
                          style={{
                            background: `${color}22`,
                            boxShadow: `0 6px 18px ${color}33`,
                          }}
                        >
                          {/* Section icon used as tile icon for simplicity */}
                          <div className="text-white/0">
                            <IconForSection sectionId={sec.id} />
                          </div>
                        </div>

                        <div className="text-xs text-center font-semibold text-gray-800 leading-tight">{it.name}</div>
                        <div className="text-[11px] text-center text-gray-400 mt-1">{sec.title}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          ))
        )}
      </div>
    </div>
  );
}
