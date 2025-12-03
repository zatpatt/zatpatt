import React, { useContext, useEffect, useState } from "react";
import HeaderImg from "../assets/Header/Header.png";
import { LanguageContext } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const { lang, setLang, t } = useContext(LanguageContext);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const newErrors = {};
    if (firstName && !/^[A-Za-z]+$/.test(firstName)) {
      newErrors.firstName = t("firstNameError");
    }
    if (lastName && !/^[A-Za-z]+$/.test(lastName)) {
      newErrors.lastName = t("lastNameError");
    }
    if (mobile && !/^[0-9]{10}$/.test(mobile)) {
  newErrors.mobile = t("mobileError");
}
   if (referralCode && !/^[A-Z0-9]{6}$/.test(referralCode)) {
  newErrors.referralCode = "Referral code must be 6 characters, uppercase letters and numbers only";
}
   setErrors({ ...newErrors }); // ensures referral error is stored too

    setIsFormValid(
      firstName.length > 0 &&
        lastName.length > 0 &&
        mobile.length === 10 &&
(!referralCode || /^[A-Z0-9]{6}$/.test(referralCode)) &&
Object.keys(newErrors).length === 0
  );
  }, [firstName, lastName, mobile, t]);

  const onMobileChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setMobile(val);
  };
  
const [referralCode, setReferralCode] = useState(""); // optional referral code

 const handleContinue = (e) => {
  e.preventDefault();

  // 🚫 Block bypass if referral is entered but invalid
  if (referralCode && !/^[A-Z0-9]{6}$/.test(referralCode)) {
    setErrors((prev) => ({
      ...prev,
      referralCode: "Referral code must be 6 characters, uppercase letters and numbers only"
    }));
    return;
  }

  // ✅ Only continue if everything is valid
  if (isFormValid && (!referralCode || /^[A-Z0-9]{6}$/.test(referralCode))) {
    navigate("/otp", { state: { mobileNumber: mobile, referralCode } });
  }
};

  return (
    <div className="min-h-screen flex flex-col bg-[#fff6ed] relative overflow-hidden">
      {/* Header Section */}
      <header className="relative w-full">
        <img
          src={HeaderImg}
          alt="Header"
          className="w-full h-[260px] sm:h-[320px] object-cover animate-zoomOut"
        />

        {/* Language selector */}
        <div className="absolute right-4 top-4 z-20">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="bg-white border border-gray-300 rounded-md px-2 py-1 text-sm shadow-sm"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="mr">मराठी</option>
          </select>
        </div>
      </header>

      {/* Overlapping Form Section */}
      {/* Main card with gradient border */}
<main className="flex-1 flex items-start justify-center px-4 relative -mt-16 z-30 pb-10">
  <div className="w-full max-w-xl p-[2px] rounded-xl bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 shadow-lg">
    <div className="bg-white rounded-xl p-6 sm:p-8">
      <h2 className="text-center text-xl sm:text-2xl font-semibold mb-4 border-b border-orange-500 pb-2">
        {t("title")}
      </h2>

      <form onSubmit={handleContinue} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-700">
              {t("firstName")} <span className="text-red-600">*</span>
            </label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder={t("firstName")}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
            />
            {errors.firstName && (
              <p className="text-red-600 text-xs font-medium mt-1">
                {errors.firstName}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-700">
              {t("lastName")} <span className="text-red-600">*</span>
            </label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder={t("lastName")}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
            />
            {errors.lastName && (
              <p className="text-red-600 text-xs font-medium mt-1">
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-700">
            {t("mobile")} <span className="text-red-600">*</span>
          </label>
          <div className="mt-1 flex gap-2">
            <select className="border border-gray-300 rounded px-2 py-2 bg-white text-sm">
              <option value="+91">🇮🇳 +91</option>
            </select>
            <input
              value={mobile}
              onChange={onMobileChange}
              inputMode="numeric"
              placeholder="10-digit mobile number"
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
            />
          </div>
          {errors.mobile && (
            <p className="text-red-600 text-xs font-medium mt-1">
              {errors.mobile}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm text-gray-700">
            Referral Code <span className="text-gray-400">(optional)</span>
          </label>
          <input
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            placeholder="Enter referral code"
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
          />
          {errors.referralCode && (
  <p className="text-red-600 text-xs font-medium mt-1">
    {errors.referralCode}
  </p>
)}
      </div>

        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full py-2.5 rounded-md text-white font-semibold text-sm transition ${
            isFormValid
              ? "bg-orange-500 hover:bg-orange-600"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          {t("continue")}
        </button>

        <div className="flex items-center justify-center my-2 gap-3">
          <hr className="flex-1 border-orange-500" />
          <span className="text-xs text-gray-400">OR</span>
          <hr className="flex-1 border-orange-500" />
        </div>

        <div className="flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2 px-3 shadow-sm bg-white hover:bg-gray-50 transition cursor-pointer">
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span className="text-sm font-medium text-gray-700">
            {t("continueWithGoogle")}
          </span>
        </div>
      </form>
    </div>
  </div>
</main>

      <footer className="bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400  text-white text-center py-4 pb-6 text-sm mt-auto">
        {t("footer")}
      </footer>
    </div>
  );
}
