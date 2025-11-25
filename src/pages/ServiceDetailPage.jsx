// src/pages/ServiceDetailPage.jsx
import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Phone,
  MapPin,
  Image,
  User,
  MessageCircle,
} from "lucide-react";

/**
 * Premium service detail page.
 * Route: /service/:name
 */

const MOCK_PROVIDERS = [
  {
    id: "p1",
    name: "Rajesh Electricals",
    rating: 4.8,
    price: 149,
    reviews: 124,
    eta: "25-40 mins",
    phone: "91234XXXXX",
    about: "Expert electrician — wiring, switches, fans, and emergency repairs.",
    location: "Vasind, Maharashtra",
    jobs: 1320,
    experience: "7 yrs",
  },
  {
    id: "p2",
    name: "Amit Home Services",
    rating: 4.6,
    price: 129,
    reviews: 98,
    eta: "30-45 mins",
    phone: "91234YYYYY",
    about: "Quick and reliable. On-time guaranteed.",
    location: "Nearby areas",
    jobs: 820,
    experience: "5 yrs",
  },
];

export default function ServiceDetailPage() {
  const navigate = useNavigate();
  const { name } = useParams();
  const serviceName = decodeURIComponent(name || "Service");

  // For premium feel we pick hero image colors + summary
  const hero = useMemo(
    () => ({
      title: serviceName,
      subtitle: `${serviceName} — Verified professionals at your door`,
      imageAlt: `${serviceName} hero`,
    }),
    [serviceName]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff8f2] to-white">
      {/* Header */}
      <header className="bg-orange-500 text-white py-4 px-4 shadow-md flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="mr-3 bg-white/90 text-orange-500 p-2 rounded-full shadow-sm"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-lg font-bold">{hero.title}</h1>
          <p className="text-sm text-orange-100">{hero.subtitle}</p>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 mt-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="h-44 bg-gradient-to-r from-orange-300 to-amber-200 flex items-center justify-center">
            <Image size={48} className="text-white/80" />
          </div>

          <div className="p-4">
            <h2 className="text-xl font-semibold text-gray-800">{serviceName}</h2>
            <p className="text-sm text-gray-500 mt-2">
              Professional {serviceName} services — verified providers, transparent pricing, and
              real-time updates.
            </p>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-full">
                <Star size={14} className="text-orange-500" />
                <span className="text-sm font-semibold">4.7</span>
                <span className="text-xs text-gray-500 ml-1">| top rated</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <MapPin size={14} />
                <span>Available near you</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Providers list (cards) */}
      <section className="px-4 mt-6 space-y-4 pb-32">
        <h3 className="text-base font-semibold text-gray-700 mb-2">Available Professionals</h3>

        {MOCK_PROVIDERS.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl shadow-md p-4 flex items-start gap-4"
          >
            <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
              <User size={26} />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-800">{p.name}</h4>
                  <p className="text-xs text-gray-500">{p.about}</p>
                </div>

                <div className="text-right">
                  <div className="text-lg font-bold text-gray-800">₹{p.price}</div>
                  <div className="text-xs text-gray-500">Est. {p.eta}</div>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-3">
                <div className="flex items-center gap-2 bg-green-50 px-2 py-1 rounded-full">
                  <Star size={14} className="text-green-600" />
                  <span className="text-sm font-semibold text-green-700">{p.rating}</span>
                  <span className="text-xs text-gray-500">({p.reviews})</span>
                </div>

                <button
                  onClick={() => navigate(`/provider/${p.id}`, { state: p })}
                  className="px-3 py-1 rounded-xl bg-orange-100 text-orange-600 text-sm font-semibold hover:bg-orange-200 transition"
                >
                  View
                </button>

                <button
                  onClick={() => navigate(`/book/${encodeURIComponent(serviceName)}`, { state: p })}
                  className="ml-auto px-4 py-2 rounded-2xl bg-orange-500 text-white font-bold hover:opacity-95 transition"
                >
                  Book
                </button>
              </div>

              <div className="mt-3 text-xs text-gray-400 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Phone size={14} />
                  <span>{p.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle size={14} />
                  <span>Chat</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
