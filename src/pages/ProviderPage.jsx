// src/pages/ProviderPage.jsx
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Phone, Star, MapPin, MessageCircle, CheckCircle } from "lucide-react";

/**
 * Provider profile page.
 * Route: /provider/:id
 * expects provider data in location.state (or load by ID from API)
 */

export default function ProviderPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();

  // fallback mock data if state not provided
  const provider = state || {
    id,
    name: "Rajesh Electricals",
    rating: 4.8,
    reviews: 124,
    phone: "91234XXXXX",
    about: "Trusted electrician with 7 years experience. Wiring, fans, switches, and emergency calls.",
    location: "Vasind, Maharashtra",
    experience: "7 yrs",
    jobs: 1320,
    verified: true,
  };

  return (
    <div className="min-h-screen bg-[#fff9f4]">
      <header className="bg-orange-500 text-white py-4 px-4 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-3 bg-white/90 text-orange-500 p-2 rounded-full">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-lg font-bold">Provider</h1>
      </header>

      <main className="p-4 space-y-4">
        <div className="bg-white rounded-2xl p-4 shadow flex gap-4 items-center">
          <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
            <div className="text-xl font-bold">{provider.name.split(" ")[0][0]}</div>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-lg">{provider.name}</h2>
                <div className="text-xs text-gray-500">{provider.experience} • {provider.jobs} jobs</div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-2">
                  <Star size={14} className="text-yellow-500" />
                  <span className="font-semibold">{provider.rating}</span>
                </div>
                {provider.verified && (
                  <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle size={16} /> Verified
                  </div>
                )}
              </div>
            </div>

            <p className="text-sm text-gray-600 mt-3">{provider.about}</p>

            <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <MapPin size={14} />
                <span>{provider.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} />
                <span>{provider.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <a href={`tel:${provider.phone}`} className="flex-1 bg-white rounded-2xl p-3 shadow flex items-center justify-center gap-2">
            <Phone /> Call
          </a>
          <a href={`https://wa.me/91${provider.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="flex-1 bg-green-50 text-green-700 rounded-2xl p-3 shadow flex items-center justify-center gap-2">
            <MessageCircle /> WhatsApp
          </a>
        </div>

        <button
          onClick={() => navigate(`/book/${encodeURIComponent(provider.name)}`, { state: provider })}
          className="w-full bg-orange-500 text-white py-3 rounded-2xl font-bold"
        >
          Book Now
        </button>

        {/* Reviews placeholder */}
        <div className="bg-white rounded-2xl p-4 shadow">
          <h3 className="font-semibold">Reviews</h3>
          <div className="mt-3 text-sm text-gray-600">
            <p><span className="font-semibold">Rahul</span> — Quick and professional. Fixed our fan in 10 minutes.</p>
            <p className="mt-2"><span className="font-semibold">Meera</span> — On-time and courteous. Highly recommended.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
