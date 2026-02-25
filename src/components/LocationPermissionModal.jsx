import React, { useEffect } from "react";

export default function LocationPermissionModal({ onEnable, onManual }) {

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end"
      onClick={onManual}
    >
      <div
        className="bg-white w-full rounded-t-3xl p-6 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1 bg-gray-300 mx-auto rounded-full mb-6"></div>

        <div className="text-center">
          <div className="text-5xl mb-4">📍</div>

          <h2 className="text-xl font-bold mb-2">
            Location permission is off
          </h2>

          <p className="text-gray-500 text-sm mb-6">
            Please enable location permission for better delivery experience
          </p>

          <button
            onClick={onEnable}
            className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold mb-3"
          >
            Enable device location
          </button>

          <button
            onClick={onManual}
            className="w-full border border-gray-300 py-3 rounded-xl text-gray-700"
          >
            Select location manually
          </button>
        </div>
      </div>
    </div>
  );
}
