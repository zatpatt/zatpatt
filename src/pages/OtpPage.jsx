import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import { ArrowLeft } from "lucide-react";

export default function OtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useContext(LanguageContext);

  // Get number from LoginPage (ensure it shows +91 prefix)
  const mobileNumber = location.state?.mobileNumber
    ? `+91 ${location.state.mobileNumber}`
    : "+91 XXXXX XXXXX";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [resendVisible, setResendVisible] = useState(false);
 const inputsRef = useRef([]);

  // handle OTP input and navigation
  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next box if number entered
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  // Handle backspace/delete properly
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

// paste handler: paste full code if user pastes into first box
  const handlePaste = (e) => {
    const pasted = (e.clipboardData || window.clipboardData).getData("text");
    const digits = pasted.replace(/\D/g, "").slice(0, 6).split("");
    if (digits.length === 0) return;
    const newOtp = [...otp];
    for (let i = 0; i < digits.length; i++) newOtp[i] = digits[i];
    setOtp(newOtp);
    const next = Math.min(digits.length, 5);
    inputsRef.current[next].focus();
    e.preventDefault();
  };

  // resend timer logic
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    } else {
      setResendVisible(true);
    }
  }, [timer]);

// ✅ Verify handler — now redirects to /home when OTP is valid
  const handleVerify = () => {
  const code = otp.join("");
  if (code.length === 6) {
    // Example: Replace with backend verification logic later
    const isOtpValid = code === "123456"; // Temporary test OTP
    if (isOtpValid) {
      // ✅ Set login status
      localStorage.setItem("isLoggedIn", "true");

      // ✅ Redirect to Home page
      navigate("/home");
    } else {
      alert("⚠️ Invalid OTP. Please try again.");
    }
  } else {
    alert("⚠️ Please enter 6 digits");
  }
};

  const handleResend = () => {
    setTimer(30);
    setResendVisible(false);
    alert("OTP resent successfully!");
  };

  // check if all 6 digits entered
  const isOtpComplete = otp.every((digit) => digit !== "");

  return (
  <div className="min-h-screen flex flex-col bg-[#fff6ed]">
    {/* 🔸 HEADER */}
<header className="bg-orange-500 text-white py-4 px-6 relative">
  {/* Minimal Back Button */}
  <button
    onClick={() => navigate(-1)}
    className="absolute top-3 left-3 z-20 p-2 rounded-full bg-white shadow hover:bg-gray-100 transition"
  >
    <ArrowLeft className="w-5 h-5 text-orange-500" />
  </button>

  <h1 className="text-lg font-bold text-center">OTP Verification</h1>
</header>

    {/* MAIN BODY */}
    <div className="flex flex-col justify-center items-center flex-grow px-4">
      {/* Gradient Border Wrapper */}
      <div className="w-full max-w-md p-[2px] rounded-xl bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 shadow-lg">
        {/* Inner White Card */}
        <div className="bg-white rounded-xl p-8">
          <p className="text-center text-gray-600 mb-6">
            We have sent a{" "}
            <span className="font-semibold text-orange-500">
              verification code
            </span>{" "}
            to
          </p>

          <p className="text-center text-lg font-bold text-gray-800 mb-6">
            {mobileNumber}
          </p>

          {/* OTP BOXES */}
          <div className="flex justify-center space-x-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                ref={(el) => (inputsRef.current[index] = el)}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-10 h-10 text-center text-lg border border-gray-300 rounded-md focus:outline-none focus:border-orange-500"
              />
            ))}
          </div>

          {/* TIMER / RESEND */}
          <div className="text-center mb-6">
            {!resendVisible ? (
              <p className="text-gray-500">Resend SMS in {timer}s</p>
            ) : (
              <button
                onClick={handleResend}
                className="text-orange-500 font-semibold hover:underline"
              >
                Resend Code
              </button>
            )}
          </div>

          {/* VERIFY BUTTON */}
          <button
            onClick={handleVerify}
            disabled={!isOtpComplete}
            className={`w-full py-2 rounded-md font-semibold mb-6 transition duration-300 ${
              isOtpComplete
                ? "bg-orange-500 hover:bg-orange-600 text-white shadow-md"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Verify OTP
          </button>

          {/* BACK BUTTON */}
          <div className="text-center">
            <button
              onClick={() => navigate("/")}
              className="border border-orange-500 text-orange-500 px-4 py-2 rounded-md hover:bg-orange-500 hover:text-white transition duration-300"
            >
              Go back to login methods
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

}