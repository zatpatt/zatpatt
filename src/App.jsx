//src\App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import OtpPage from "./pages/OtpPage";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import SearchResultsPage from "./pages/SearchResultsPage";   // ✅ Added
import ServiceDetailPage from "./pages/ServiceDetailPage";   // ✅ Added
import BookingPage from "./pages/BookingPage";               // ✅ Added
import ProviderPage from "./pages/ProviderPage";
import CategoryPage from "./pages/CategoryPage";
import { CartProvider } from "./context/CartContext";
import CartBottomSheet from "./components/CartBottomSheet";
import ProductDetailPage from "./pages/ProductPage.jsx";
import RECENT from "./pages/RecentOrdersPage";
import FAV_PAGE from "./pages/FavoritesPage";
import SAVED_PAGE from "./pages/SavedForLaterPage";
import FaqPage from "./pages/FaqPage";
import SupportBot from "./components/SupportBot.jsx";
import TermsPage from "./pages/TermsPage.jsx";
import PrivacyPage from "./pages/PrivacyPage.jsx";
import RestaurantPage from "./pages/RestaurantPage"; // create this page
import ProductPage from "./pages/ProductPage"; // create this page
import PrintServicesPage from "./pages/PrintServicesPage";
import BillsRechargePage from "./pages/BillsRechargePage";
import HomeServicesPage from "./pages/HomeServicesPage";
import GroomingWellnessPage from "./pages/GroomingWellnessPage";
import AllOrdersPage from "./pages/AllOrdersPage"
import SubCategoryPage from "./pages/SubCategoryPage";

import RewardsPage from "./pages/RewardsPage";
import DailyLoginPage from "./pages/DailyLoginPage";
import SpinandWinPage from "./pages/SpinandWinPage";
import ReferaFriendPage from "./pages/ReferaFriendPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import CartPage from "./pages/CartPage";
import AllInOnePage from "./pages/AllInOnePage";
import LeaderboardPage from "./pages/LeaderboardPage";
import AddressPage from "./pages/AddressPage";
import PaymentPage from "./pages/PaymentPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import AfterDeliveryPage from "./pages/AfterDeliveryPage";
import RestaurantsPage from "./pages/RestaurantPage.jsx";

function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  return isLoggedIn ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Routes>

      {/* Public Routes */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/otp" element={<OtpPage />} />

      {/* Protected Routes */}
      <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />

      {/* Search */}
      <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
      <Route path="/search-results" element={<ProtectedRoute><SearchResultsPage /></ProtectedRoute>} />

      {/* Services */}
      <Route path="/service/:name" element={<ProtectedRoute><ServiceDetailPage /></ProtectedRoute>} />
      <Route path="/book/:name" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
      <Route path="/provider/:id" element={<ProtectedRoute><ProviderPage /></ProtectedRoute>} />
      <Route path="/category/:name" element={<CategoryPage />} />
      <Route path="/restaurant/:id" element={<RestaurantPage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/subcategory/:id" element={<SubCategoryPage />} />

      <Route path="/category/:name" element={<ProtectedRoute><CategoryPage/></ProtectedRoute>} />
      <Route path="/product/:category/:id" element={<ProtectedRoute><ProductPage/></ProtectedRoute>} />

      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/rewards" element={<ProtectedRoute><RewardsPage /></ProtectedRoute>} />
      <Route path="/dailylogin" element={<ProtectedRoute><DailyLoginPage /></ProtectedRoute>} />
      <Route path="/spinandwin" element={<ProtectedRoute><SpinandWinPage /></ProtectedRoute>} />
      <Route path="/referafriend" element={<ProtectedRoute><ReferaFriendPage /></ProtectedRoute>} />
      <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
      <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
      <Route path="/order-success" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
      <Route path="/order-tracking" element={<ProtectedRoute><OrderTrackingPage /></ProtectedRoute>} />
      <Route path="/after-delivery" element={<ProtectedRoute><AfterDeliveryPage /></ProtectedRoute>} />
      <Route path="/restaurant/:id" element={<ProtectedRoute><RestaurantsPage /></ProtectedRoute>} />
      <Route path="/recent-orders" element={<RECENT/>}/>
      <Route path="/favorites" element={<FAV_PAGE/>}/>
      <Route path="/saved" element={<SAVED_PAGE/>}/>
      <Route path="/faq" element={<ProtectedRoute><FaqPage /></ProtectedRoute>} />
      <Route path="/support-bot" element={<SupportBot />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/print-services" element={<ProtectedRoute><PrintServicesPage /></ProtectedRoute>} />
      <Route path="/bills-recharge" element={<ProtectedRoute><BillsRechargePage /></ProtectedRoute>} />
      <Route path="/home-services" element={<ProtectedRoute><HomeServicesPage /></ProtectedRoute>} />
      <Route path="/grooming-wellness" element={<ProtectedRoute><GroomingWellnessPage /></ProtectedRoute>} />
      <Route path="/allorders" element={<AllOrdersPage />} />

      {/* Semi-protected */}
      <Route path="/allinone" element={<AllInOnePage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/address" element={<AddressPage />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
