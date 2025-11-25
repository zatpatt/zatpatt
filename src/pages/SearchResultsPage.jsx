// src/pages/SearchResultsPage.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function SearchResultsPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const query = state?.query?.toLowerCase() || "";

  const allServices = [
    "Electrician", "Plumber", "Carpenter", "AC Repair",
    "Water Can", "Gas Cylinder", "Laundry", "Salon at Home",
    "Print-out", "Xerox", "Flex / Banner", "Visiting Cards",
    "House Cleaning", "Pest Control", "Painting",
    "Furniture Repair", "Medicine Delivery", "Doctor Visit"
  ];

  const results = allServices.filter((s) =>
    s.toLowerCase().includes(query)
  );

  return (
    <div className="min-h-screen bg-[#fff8f2]">
      <header className="bg-orange-500 text-white py-4 px-6 shadow-md flex items-center relative justify-center">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 bg-white text-orange-500 p-2 rounded-full"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold">Search Results</h1>
      </header>

      <p className="text-sm text-gray-500 mt-3 px-4">
        Showing results for: <b>{query}</b>
      </p>

      <div className="mt-4 p-4 space-y-3">
        {results.length > 0 ? (
          results.map((item, i) => (
            <div
              key={i}
              onClick={() => navigate(`/service/${item}`)}
              className="bg-white shadow rounded-xl p-4 cursor-pointer hover:bg-gray-50"
            >
              <p className="text-gray-800 font-semibold">{item}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-6">No matching services found.</p>
        )}
      </div>
    </div>
  );
}
