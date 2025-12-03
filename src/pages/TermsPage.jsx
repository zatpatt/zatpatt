import React from "react";
import { ArrowLeft, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function TermsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-orange-50">
      <header className="bg-orange-500 text-white py-4 px-6 shadow-lg flex items-center sticky top-0 z-50">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-white mr-4 shadow"
        >
          <ArrowLeft className="w-5 h-5 text-orange-500" />
        </motion.button>
        <h1 className="text-xl font-bold">
          <FileText className="inline mr-2 text-white" />Terms & Conditions</h1>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-3xl mx-auto p-6 space-y-4 text-gray-800"
      >
        <section className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold text-orange-600">1. Acceptance of Terms</h2>
          <p className="text-sm mt-2">
            By using this app, you agree to follow and be legally bound by these Terms & Conditions set by the company.
          </p>
        </section>

        <section className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold text-orange-600">2. User Responsibility</h2>
          <p className="text-sm mt-2">
            You must provide correct details. Any misuse, fraud, or illegal activity may lead to account termination.
          </p>
        </section>

        <section className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold text-orange-600">3. Orders & Delivery</h2>
          <p className="text-sm mt-2">
            Orders cannot be changed or canceled after merchant acceptance. Please verify details before ordering.
          </p>
        </section>

        <section className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold text-orange-600">4. Payment Policy</h2>
          <p className="text-sm mt-2">
            Currently we support Cash on Delivery (COD) for orders. You may pay the delivery partner online if needed.
          </p>
        </section>

        <section className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold text-orange-600">5. Data Privacy</h2>
          <p className="text-sm mt-2">
            Your allowed data (like email) is stored securely. Registered phone numbers cannot be changed once verified.
          </p>
        </section>

        <section className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold text-orange-600">6. Prohibited Activities</h2>
          <ul className="text-sm mt-2 list-disc pl-5 space-y-1">
            <li>Attempting to hack or disrupt the app</li>
            <li>Placing fake or fraudulent orders</li>
            <li>Using app for illegal purposes</li>
          </ul>
        </section>

        <section className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold text-orange-600">7. Termination</h2>
          <p className="text-sm mt-2">
            We reserve the right to suspend or delete accounts if harmful or suspicious actions are detected.
          </p>
        </section>

        <section className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold text-orange-600">8. Policy Updates</h2>
          <p className="text-sm mt-2">
            These terms may be updated anytime. Continued app usage means you accept the revised terms.
          </p>
        </section>

        {/* ✅ New Professional Sections */}
        <section className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold text-orange-600">9. Eligibility</h2>
          <p className="text-sm mt-2">
            You must be 13+ years old or use the app under guardian supervision.
          </p>
        </section>

        <section className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold text-orange-600">10. Account Security</h2>
          <p className="text-sm mt-2">
            You are responsible for keeping your password secure. We are not liable for unauthorized access due to user negligence.
          </p>
        </section>

        <section className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold text-orange-600">11. Service Availability</h2>
          <p className="text-sm mt-2">
            We do not guarantee uninterrupted or error-free service. Delivery time may vary due to traffic, weather, or partner availability.
          </p>
        </section>

        <section className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold text-orange-600">12. Pricing & Delivery Charges</h2>
          <p className="text-sm mt-2">
            Product prices, taxes and delivery charges may differ. Please check the final amount before confirmation.
          </p>
        </section>

        <section className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold text-orange-600">13. Limited Liability</h2>
          <p className="text-sm mt-2">
            We are not responsible for failures caused by network issues, payment partner outages, or third-party services.
          </p>
        </section>

        <section className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold text-orange-600">14. Intellectual Property</h2>
          <p className="text-sm mt-2">
            All app content, design, logos, and interface belong to the company and may not be copied without permission.
          </p>
        </section>

        <section className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold text-orange-600">15. Third-Party Services</h2>
          <p className="text-sm mt-2">
            External services like maps or payments are governed by their respective platforms.
          </p>
        </section>

        <section className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold text-orange-600">16. Governing Law</h2>
          <p className="text-sm mt-2">
            Any disputes are subject to the laws of India.
          </p>
        </section>

        <section className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold text-orange-600">17. Legal Contact</h2>
          <p className="text-sm mt-2">
            For legal or dispute concerns, email our support team.
          </p>
        </section>

        <section className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold text-orange-600">18. Refund & Compensation</h2>
          <p className="text-sm mt-2">
           Refunds are not guaranteed and are issued only after verification by support and merchant confirmation.
          </p>
        </section>

        <section className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold text-orange-600">19. Address Verification</h2>
          <p className="text-sm mt-2">
           Saved addresses must be accurate. Wrong or incomplete addresses causing failed delivery will not be compensated.
          </p>
        </section>

        <section className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold text-orange-600">20. Rewards Abuse</h2>
          <p className="text-sm mt-2">
           Using fake referrals, automation, or technical misuse to gain reward points leads to permanent removal of rewards and account action.
          </p>
        </section>

        <section className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold text-orange-600">21. Product Availability</h2>
          <p className="text-sm mt-2">
           Company does not guarantee availability of all products shown on the app. Items may go out of stock before delivery.
          </p>
        </section>

        <section className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold text-orange-600">22. Offers & Rewards Variation</h2>
          <p className="text-sm mt-2">
           Offers and reward benefits may change based on region, festival periods, demand, or active time windows.
          </p>
        </section>

        <section className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold text-orange-600">23. Delivery Partner Association</h2>
          <p className="text-sm mt-2">
           Delivery partners are not employees of the company. They function as independent service associates collaborating to fulfill deliveries.
          </p>
        </section>

        <p className="text-xs text-center text-gray-500 mt-5">
          Last Updated: 29-Nov-2025 • © 2025 Zatpatt App
        </p>
      </motion.div>
    </div>
  );
}
