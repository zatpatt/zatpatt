//src\pages\ServiceListPage.jsx

import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Phone } from "lucide-react";
import { getServicesBySubcategory } from "../services/allInOneApi";

export default function ServiceListPage() {
  const { id } = useParams(); // subcategory id
  const { state } = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);

  useEffect(() => {
  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await getServicesBySubcategory(id);

      if (res?.status) {
        setServices(res.data || []);
      }
    } catch (err) {
      console.error("Service fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  fetchServices();
}, [id]);


  return (
    <div className="min-h-screen bg-[#fff9f4]">
      {/* HEADER */}
      <header className="bg-orange-500 text-white py-4 px-4 shadow-md flex items-center sticky top-0 z-10">
       <button
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              navigate("/allinone");
            }
          }}
          className="mr-3 bg-white text-orange-500 p-2 rounded-full"
        >
          <ArrowLeft size={18} />
        </button>

        <div>
          <h1 className="text-base font-bold">
            {state?.name || "Services"}
          </h1>
        </div>
      </header>

      {/* CONTENT */}
      <div className="p-4">
        {loading ? (
          <div className="text-center text-gray-500 mt-12">
            Loading services…
          </div>
        ) : services.length === 0 ? (
          <div className="text-center text-gray-500 mt-12">
            No services found
          </div>
        ) : (
          <div className="space-y-3">
            {services.map((s) => (
              <div
                key={s.service_id}
                className="bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-sm">
                    {s.name}
                  </div>

                  {s.price && (
                    <div className="text-sm font-bold text-orange-500">
                      ₹{s.price}
                    </div>
                  )}
                </div>

                {/* CALL BUTTON */}
                <a
                  href={`tel:${s.description}`}
                  className="bg-green-500 text-white p-3 rounded-full shadow"
                >
                  <Phone size={18} />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
