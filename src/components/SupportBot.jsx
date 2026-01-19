//src\components\SupportBot.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";


const botFaq = [
  { q: "How do I place an order?", a: "Open Menu → Add items → Checkout → Pay Cash on Delivery." },
  { q: "Can I change my phone number?", a: "No, phone number cannot be changed once registered." },
  { q: "Can I update my email?", a: "Yes, Profile → Edit Profile → Update email → Save changes." },
  { q: "How do I cancel an order?", a: "Cancel only before merchant accepts. Orders → Active Orders → Cancel." },
  { q: "What payments are accepted?", a: "COD for orders, but you can pay delivery partner online." },
];

export default function SupportBot() {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([
    { from: "bot", text: "Hi! Ask me anything or tap a question below 👇" }
  ]);

  const sendMsg = () => {
    if (!msg.trim()) return;

    const newChat = [...chat, { from: "user", text: msg }];
    setChat(newChat);

    // Bot reply logic (offline)
    const found = botFaq.find(f => f.q.toLowerCase() === msg.toLowerCase());
    const reply = found ? found.a : "I can answer basic help. More features soon! 😊";

    setChat([...newChat, { from: "bot", text: reply }]);
    setMsg("");
  };

  const tapQuestion = (q, a) => {
    setChat([...chat, { from: "user", text: q }, { from: "bot", text: a }]);
  };

  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50">
     <motion.div
  initial={{ y: 300 }}
  animate={{ y: 0 }}
  transition={{ type: "spring", stiffness: 200, damping: 22 }}
  className="w-full max-w-md bg-white rounded-t-2xl p-4 shadow-lg h-[80vh] flex flex-col"
>

  {/* ✅ BACK BUTTON */}
  <button
    onClick={() => navigate(-1)}
    className="p-2 rounded-full bg-orange-100 w-fit mb-2 hover:bg-orange-200"
  >
    <ArrowLeft className="w-5 h-5 text-orange-600" />
  </button>

  {/* Optional: Bot Title */}
  <h2 className="text-lg font-bold text-orange-600 text-center">Support Chat</h2>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 text-sm">
          {chat.map((c, i) => (
            <div key={i} className={`flex ${c.from === "user" ? "justify-end" : "justify-start"}`}>
              <p className={`px-3 py-2 rounded-xl max-w-[75%] shadow ${
                c.from === "user" ? "bg-orange-500 text-white" : "bg-orange-50 text-gray-700 border border-orange-200"
              }`}>
                {c.text}
              </p>
            </div>
          ))}
        </div>

        {/* FAQ Tap Questions */}
        <div className="bg-orange-50 p-3 rounded-xl shadow space-y-2">
          <p className="font-semibold text-orange-600">Tap a question:</p>
          {botFaq.map((f, i) => (
            <button
              key={i}
              onClick={() => tapQuestion(f.q, f.a)}
              className="block text-left text-xs text-gray-700 hover:text-orange-500"
            >
              <span className="text-orange-500 font-bold">🔸</span> {f.q}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="mt-3 flex gap-2">
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 border border-orange-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
          />
          <button onClick={sendMsg} className="px-4 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600">
            Send
          </button>
        </div>
      </motion.div>
    </div>
  );
}
