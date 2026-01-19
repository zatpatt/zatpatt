//src\pages\PrivacyPage.jsx
import React from "react";
import { ArrowLeft, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header */}
      <header className="bg-orange-500 text-white py-4 px-6 shadow-lg flex items-center sticky top-0 z-50">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-white mr-4 shadow"
        >
          <ArrowLeft className="w-5 h-5 text-orange-500" />
        </motion.button>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Lock className="inline text-white" /> Privacy Policy
        </h1>
      </header>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-3xl mx-auto p-6 space-y-4 text-gray-800"
      >

        {/* Existing Sections */}
        <section className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold text-orange-600">1. Information We Collect</h2>
          <p className="text-sm mt-2">We may collect personal data such as name, email, phone number, saved addresses, order history, favorite items, and app preferences.</p>
        </section>

        <section className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold text-orange-600">2. How We Use Your Information</h2>
          <p className="text-sm mt-2">Your information is used to process orders, track deliveries, offer rewards, personalize experience, improve services, and maintain secure logins.</p>
        </section>

        <section className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold text-orange-600">3. Data Storage & Security</h2>
          <p className="text-sm mt-2">User data is stored on device using encrypted local storage where applicable. We apply strong security practices, but cannot guarantee full protection from advanced attacks.</p>
        </section>

        <section className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold text-orange-600">4. Cookies & Tracking</h2>
          <p className="text-sm mt-2">The app may use local storage and browser identifiers for storing login sessions and saved preferences. No external tracking is enabled unless user allows.</p>
        </section>

        <section className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold text-orange-600">5. Third-Party Services</h2>
          <p className="text-sm mt-2">The app may rely on external providers like maps or payment partners. Their policies apply to interactions made through them.</p>
        </section>

        <section className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold text-orange-600">6. Sharing of Information</h2>
          <p className="text-sm mt-2">We do not sell personal data. Only minimal order-related info is shared with merchants and delivery partners to complete services.</p>
        </section>

        <section className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold text-orange-600">7. User Controls</h2>
          <p className="text-sm mt-2">You may delete favorites, saved addresses, receipts, and logout devices anytime from Settings.</p>
        </section>

        <section className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold text-orange-600">8. Children & Eligibility Data</h2>
          <p className="text-sm mt-2">Users under 13 may only access under guardian supervision. Age is not directly stored unless required for safety compliance.</p>
        </section>

        <section className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold text-orange-600">9. Policy Updates</h2>
          <p className="text-sm mt-2">Privacy terms may update anytime. Continued usage means acceptance of the revised policy.</p>
        </section>

        {/* New Added Professional Sections */}
        <section className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold text-orange-600">10. Product Availability</h2>
          <p className="text-sm mt-2">Company does not guarantee availability of all products shown on the app. Stock may change anytime.</p>
        </section>

        <section className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold text-orange-600">11. Regional Offers</h2>
          <p className="text-sm mt-2">Offers and rewards may change based on region, event, festive season, time or policy decided by the company.</p>
        </section>

        <section className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold text-orange-600">12. Delivery Partner Role</h2>
          <p className="text-sm mt-2">Delivery partner is not a direct employee of the company and works only as a service associate.</p>
        </section>

        <section className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold text-orange-600">13. Permissions & Consent</h2>
          <p className="text-sm mt-2">Camera, location, notification access are only enabled when user allows via device permissions.</p>
        </section>

        <section className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold text-orange-600">14. Ads & Promotions</h2>
          <p className="text-sm mt-2">Users may receive promotional banners, alerts, or brand advertisements that improve app experience.</p>
        </section>

        <section className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold text-orange-600">15. Order Data Retention</h2>
          <p className="text-sm mt-2">Order history may be stored for better recommendations unless deleted by the user.</p>
        </section>

        <section className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold text-orange-600">16. Device & Session Logs</h2>
          <p className="text-sm mt-2">Login session and device identifiers are stored locally to keep user signed in securely.</p>
        </section>

        <section className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold text-orange-600">17. Merchant Policies</h2>
          <p className="text-sm mt-2">Each merchant may have its own policies for order acceptance, packing, or delivery instructions.</p>
        </section>

        <section className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold text-orange-600">18. Rating & Feedback Storage</h2>
          <p className="text-sm mt-2">Ratings, reviews, and feedback may be stored to improve service quality.</p>
        </section>

        <section className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold text-orange-600">19. Wallet & Rewards Data</h2>
          <p className="text-sm mt-2">Reward points, referral bonus, credits are stored locally or server (if integrated in future upgrades).</p>
        </section>

        <section className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold text-orange-600">20. Data Deletion on Account Removal</h2>
          <p className="text-sm mt-2">If an account is deleted, stored app data may also be erased from device automatically.</p>
        </section>

        {/* Footer */}
        <p className="text-xs text-center text-gray-500 mt-6">
          Last Updated: 29-Nov-2025 • © 2025 Zatpatt App
        </p>

      </motion.div>
    </div>
  );
}
