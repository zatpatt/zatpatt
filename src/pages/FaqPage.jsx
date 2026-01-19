//src\pages\FaqPage.jsx
import React, { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronUp, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// FAQ list with sections
const faqList = [
  {
    section: "Account & Profile",
    faqs: [
      { q: "How do I create an account?", a: "Open the app and follow the signup process using your phone number." },
      { q: "How do I reset my password?", a: "Go to Profile > Settings > Reset Password. Follow the instructions to set a new password." },
      { q: "Can I change my registered phone number or email?", a: "No, the registered phone number cannot be modified for security reasons. However, you can update your email by navigating to Profile → Edit Profile → Update Email, then save before exiting." },
      { q: "How do I update my profile information?", a: "Open Profile > Edit Profile and update your information. Save changes before exiting." }
    ]
  },
  {
    section: "Orders & Payments",
    faqs: [
      { q: "How do I place an order?", a: "Browse the menu, add items to your cart, and proceed to checkout." },
      { q: "Can I modify my order after placing it?", a: "No, once an order is placed, it cannot be modified—even before preparation. If required, you may cancel it before merchant acceptance and place a new order." },
      { q: "How can I track my order?", a: "Go to Orders > Active Orders to see live updates on your delivery." },
      { q: "What payment methods are accepted?", a: "As of now, we support Cash on Delivery (COD) only. You may also make an online payment directly to the delivery partner, if needed, at the time of delivery." },
      { q: "Is it safe to save my card or UPI details in the app?", a: "Yes, your information is securely encrypted. However, we currently do not accept card or UPI payments for orders. COD is the only in-app supported payment mode at this time." },
      { q: "How do I cancel an order?", a: "Cancellation is only possible before the merchant accepts the order. Go to Active Orders, select your order, and tap Cancel if merchant acceptance is still pending." },
      { q: "Can I schedule orders for later delivery?", a: "No, scheduled delivery is not available yet. Stay tuned—this feature is coming soon." }
    ]
  },
  {
    section: "Delivery & Services",
    faqs: [
      { q: "How long does delivery usually take?", a: "Delivery typically takes 30-60 minutes depending on distance and order volume." },
      { q: "What if the delivery is delayed?", a: "You can track your order live and contact support for any delays." },
      { q: "Can I change the delivery address after placing an order?", a: "No, the delivery address cannot be edited after placing an order. Please double-check your address before confirmation to avoid inconvenience." },
      { q: "How do I report missing or damaged items?", a: "Contact our Help & Support → Contact Support team. Issues are resolved through verification and supported by proof when required." },
      { q: "Do you offer contactless delivery?", a: "Yes, you can request contactless delivery anytime by informing your delivery partner for your safety and convenience." }
    ]
  },
  {
    section: "Rewards & Offers",
    faqs: [
      { q: "How do I earn reward points?", a: "Earn points for every purchase and special app activities like daily login or Spin & Win." },
      { q: "How can I redeem my reward points?", a: "Redeem points at checkout for discounts or rewards in the app." },
      { q: "Are there special offers for new users?", a: "Yes, check the Rewards section after account creation to explore welcome benefits and exclusive offers." },
      { q: "Can I use multiple coupons at once?", a: "Currently, only one coupon can be applied per order." }
    ]
  },
  {
    section: "App Features",
    faqs: [
      { q: "How do I add items to favorites or saved for later?", a: "Tap the ❤️ (Heart icon) to add items or restaurants to Favorites. Tap the ⭐ (Star icon) on an item to mark it as Saved for Later." },
      { q: "How do I use the Spin & Win feature?", a: "Go to Spin & Win page, spin the wheel, and claim your reward." },
      { q: "How can I refer a friend and get rewards?", a: "Go to Refer a Friend page, share your referral link, and earn rewards when your friends join." },
      { q: "How do I view my past orders and ongoing orders?", a: "Go to Profile → Recent Orders → View All Recent Orders. Here, you can see both ongoing and completed deliveries." },
      { q: "How do I leave a review for a service or restaurant?", a: "Open Profile → Recent Orders → View All Recent Orders, select the order, open details, then tap Leave a Review to share feedback." }
    ]
  },
  {
    section: "Support & Security",
    faqs: [
      { q: "How do I contact customer support?", a: "Go to Settings > Help & Support or call our hotline to reach support." },
      { q: "What should I do if I forgot my password?", a: "Use the 'Forgot Password' option on login and follow the instructions." },
      { q: "How is my personal information protected?", a: "All personal data is encrypted and handled according to privacy policies." },
      { q: "Can I report a bug or suspicious activity in the app?", a: "Yes: Report suspicious activity or technical issues via Help & Support → Report a Bug." }
    ]
  }
];

export default function FaqPage() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);
  const [search, setSearch] = useState("");

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Filter FAQs while preserving sections
  const filteredSections = faqList
    .map(section => {
      const filteredFaqs = section.faqs.filter(faq =>
        faq.q.toLowerCase().includes(search.toLowerCase())
      );
      return { ...section, faqs: filteredFaqs };
    })
    .filter(section => section.faqs.length > 0); // Remove empty sections

  let globalIndex = 0; // Unique key counter

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header */}
      <header className="bg-orange-500 text-white py-4 px-7 shadow-lg flex items-center">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white mr-4">
          <ArrowLeft className="text-orange-500 w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">FAQ</h1>
      </header>

      {/* Search Bar */}
      <div className="p-6 max-w-3xl mx-auto">
        <div className="flex items-center bg-white rounded-xl shadow px-4 py-2">
          <Search className="w-5 h-5 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search FAQs..."
            className="w-full outline-none text-gray-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* FAQ List */}
      <div className="p-6 space-y-6 max-w-3xl mx-auto">
        {filteredSections.length > 0 ? (
          filteredSections.map((section, secIndex) => (
            <div key={secIndex}>
              <h2 className="text-orange-500 font-bold text-lg mb-2">{section.section}</h2>
              {section.faqs.map((faq, index) => {
                const currentIndex = globalIndex++;
                return (
                  <div key={currentIndex} className="bg-white rounded-xl shadow mb-2">
                    <motion.button
                      onClick={() => toggleFaq(currentIndex)}
                      className="w-full flex justify-between items-center p-4 text-left font-semibold cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                    >
                      {faq.q}
                      {openIndex === currentIndex ? <ChevronUp className="w-5 h-5 text-orange-500" /> : <ChevronDown className="w-5 h-5 text-orange-500" />}
                    </motion.button>

                    <AnimatePresence>
                      {openIndex === currentIndex && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-4 pb-4 text-gray-600"
                        >
                          {faq.a}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-6">No FAQs found.</p>
        )}
      </div>
    </div>
  );
}
