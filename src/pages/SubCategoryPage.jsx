import React from "react";
import { useParams, useLocation } from "react-router-dom";

export default function SubCategoryPage() {
  const { id } = useParams();
  const { state } = useLocation();

  return (
    <div className="min-h-screen bg-[#fff9f4] p-4">
      <h1 className="text-xl font-bold mb-2">
        {state?.name || "Sub Category"}
      </h1>

      <p className="text-sm text-gray-500 mb-4">
        Subcategory ID: {id} ({state?.type})
      </p>

      {/* 🔜 Next: fetch products using subcategory id */}
      <div className="bg-white rounded-xl p-4 shadow">
        Product list will come here
      </div>
    </div>
  );
}
