import { Navigate } from "react-router-dom";

export default function LocationGuard({ children }) {
  const lat = localStorage.getItem("userLat");
  const lng = localStorage.getItem("userLng");
  const searchedLocation = localStorage.getItem("searchedLocation");

  const locationSet = (lat && lng) || searchedLocation;

  if (!locationSet) {
    return <Navigate to="/enable-location" replace />;
  }

  return children;
}
