// src/components/ShimmerLoader.jsx
import React from "react";

/**
 * Simple shimmer skeleton loader for a restaurant list.
 * Uses Tailwind classes; adjust the number of skeleton cards below as needed.
 */
export default function ShimmerLoader({ count = 4 }) {
  const cards = Array.from({ length: count });

  return (
    <div className="space-y-4">
      {cards.map((_, idx) => (
        <div
          key={idx}
          className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm overflow-hidden"
        >
          {/* image placeholder */}
          <div className="w-20 h-20 rounded-md bg-gray-200 relative overflow-hidden">
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" />
          </div>

          {/* text placeholders */}
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/5 rounded bg-gray-200 relative overflow-hidden">
              <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" />
            </div>
            <div className="h-3 w-1/3 rounded bg-gray-200 relative overflow-hidden">
              <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" />
            </div>

            <div className="flex gap-3 mt-2">
              <div className="h-3 w-16 rounded bg-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" />
              </div>
              <div className="h-3 w-20 rounded bg-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
