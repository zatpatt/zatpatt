//src\pages\PrintServicesPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.mjs";
import { useCart } from "../context/CartContext";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
).toString();

export default function PrintServicesPage() {
  const navigate = useNavigate();
  const [active, setActive] = useState("xerox");
  const [innerTab, setInnerTab] = useState("print"); // default print
  const [stayTuned, setStayTuned] = useState(false);
const [sideType, setSideType] = useState("single");
const [fileInfo, setFileInfo] = useState([]);
const { addToCart } = useCart();

const [bannerHeight, setBannerHeight] = useState("");
const [bannerWidth, setBannerWidth] = useState("");
const [uploadedBanner, setUploadedBanner] = useState(null);
const [bannerMaterial, setBannerMaterial] = useState("standard");
const [bannerDesign, setBannerDesign] = useState(false);
const [bannerDelivery, setBannerDelivery] = useState("instant");
const [bannerTheme, setBannerTheme] = useState("");

const [uploadedPhoto, setUploadedPhoto] = useState(null);
const [numCopies, setNumCopies] = useState(1);
const [photoFinish, setPhotoFinish] = useState("Glossy"); // Glossy/Matte/HD
const [enhanceImage, setEnhanceImage] = useState(false);

const [size, setSize] = useState("A4"); // you can make this selectable
const [printType, setPrintType] = useState("bw"); // link with B/W or Color select
const [orientation, setOrientation] = useState("portrait");

const [lamAlert, setLamAlert] = useState(false);
const [bindAlert, setBindAlert] = useState(false);


  const location = useLocation();

const calculateCost = (pages, printType, sideType) => {
  if (!pages) return 0;
  let basePrice;
  if (printType === "bw") basePrice = sideType === "double" ? 7 : 5;
  else basePrice = sideType === "double" ? 12 : 10;
  return pages * basePrice;
};


useEffect(() => {
  if (location.state?.activeTab) {
    setActive(location.state.activeTab);
  }
}, [location]);

  return (
    <div className="min-h-screen bg-[#fff9f4] pb-28">

      {/* HEADER */}
      <header className="bg-orange-500 text-white py-4 px-4 shadow-md flex items-center">
    <button onClick={() => navigate(-1)} className="mr-3 bg-white/90 text-orange-500 p-2 rounded-full shadow">
      <ArrowLeft size={18} />
    </button>
    <h1 className="text-lg font-bold">Document & Print Services</h1>
  </header>

    {/* SUB-TABS (Hide when center mode is active) */}
{location.state?.activeTab ? null : (
  <div className="mt-5 px-4 flex overflow-x-auto gap-2 pb-3 justify-center">
    {[
      { key: "xerox", label: "Print/Xerox" },
      { key: "photo", label: "Photo Print" },
      { key: "banner", label: "Banner/Flex" },
      { key: "lamination", label: "Lamination" },
      { key: "binding", label: "Spiral Binding" },
    ].map((t) => (
      <button
        key={t.key}
        onClick={() => setActive(t.key)}
        className={`px-3 py-1 rounded-full text-sm font-semibold shadow transition whitespace-nowrap ${
          active === t.key ? "bg-orange-500 text-white" : "bg-white text-gray-700"
        }`}
      >
        {t.label}
      </button>
    ))}
  </div>
)}

{/* CENTER-TOP MODE – when coming from All-In-One */}
{location.state?.activeTab ? (
  <div className="flex justify-center mt-6">  {/* ✅ centered at top */}
   {active === "xerox" && (
  <div className="flex flex-col items-center mt-5">

    {/* ✅ 2 INNER TABS */}
    <div className="flex bg-white rounded-full shadow p-1 w-fit mb-4">
      <button
        onClick={() => setInnerTab("print")}
        className={`px-4 py-1 rounded-full text-sm font-semibold transition ${
          innerTab === "print" ? "bg-orange-500 text-white" : "text-gray-700"
        }`}
      >
        Print
      </button>
      <button
        onClick={() => setInnerTab("xerox")}
        className={`px-4 py-1 rounded-full text-sm font-semibold transition ${
          innerTab === "xerox" ? "bg-orange-500 text-white" : "text-gray-700"
        }`}
      >
        Xerox
      </button>
    </div>

    {/* ✅ PRINT TAB CONTENT – YOUR EXISTING UI */}
    {innerTab === "print" && (
      <motion.div className="bg-white rounded-2xl shadow p-6 w-[95%] max-w-4xl">
        <h2 className="text-lg font-bold text-gray-900 text-center mb-4">Document Printing</h2>
{/* 1. Single / Double Side */}
<label className="block text-sm font-semibold mb-2">Print Sides</label>
                  <select
                    className="w-full border p-2 rounded-xl mb-3"
                    value={sideType}
                    onChange={(e) => setSideType(e.target.value)}
                  >
                    <option value="single">Single Side</option>
                    <option value="double">Double Side</option>
                  </select>


        {/* 2. B/W OR COLOR */}
        <label className="block text-sm font-semibold mb-2">Print Type</label>
                  <select
                    className="w-full border p-2 rounded-xl mb-3"
                    value={printType}
                    onChange={(e) => setPrintType(e.target.value)}
                  >
                    <option value="bw">Black & White (B/W)</option>
                    <option value="color">Color</option>
                  </select>

        {/* 3. ORIENTATION */}
        <label className="block text-sm font-semibold mb-2">Orientation</label>
                  <select
                    className="w-full border p-2 rounded-xl mb-5"
                    value={orientation}
                    onChange={(e) => setOrientation(e.target.value)}
                  >
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>

{/* 4. FILE UPLOAD */}
<input
  id="docUpload"
  type="file"
  accept=".pdf, .jpg, .jpeg, .png, .jp2"
  className="hidden"
  multiple
  onChange={async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length + fileInfo.length > 5) {
      alert("You can upload maximum 5 files");
      return;
    }

    const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg", "image/jp2"];
    const newFiles = [];

    for (let file of selectedFiles) {
      if (file.size > 100 * 1024 * 1024) {
        alert(`File ${file.name} must be below 100MB`);
        continue;
      }
      if (!allowedTypes.includes(file.type)) {
        alert(`File ${file.name} has invalid type`);
        continue;
      }

      let pages = 1; // default for images
      if (file.type === "application/pdf") {
        const typedArray = new Uint8Array(await file.arrayBuffer());
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
        pages = pdf.numPages;
      }

      newFiles.push({ file, name: file.name, pages });
    }

    setFileInfo((prev) => [...prev, ...newFiles]);

    // Preview first PDF or image
    const firstFile = newFiles[0];
    if (firstFile) {
      if (firstFile.file.type === "application/pdf") {
        const iframe = document.getElementById("pdfPreview");
        iframe.src = URL.createObjectURL(firstFile.file);
        iframe.classList.remove("hidden");
        document.getElementById("previewBox").classList.add("hidden");
      } else {
        const img = document.getElementById("previewBox");
        img.src = URL.createObjectURL(firstFile.file);
        img.classList.remove("hidden");
        document.getElementById("pdfPreview").classList.add("hidden");
      }
    }
  }}
/>

<label
  htmlFor="docUpload"
  className="bg-orange-500 text-white font-semibold px-5 py-2 rounded-full shadow block text-center cursor-pointer"
>
  Upload Documents (Max 5)
</label>


      {/* 5. PREVIEW ALL UPLOADED FILES */}
{fileInfo.length > 0 && (
  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 justify-center">
    {fileInfo.map((f, index) => (
      <div key={index} className="relative flex flex-col items-center bg-gray-50 rounded-xl p-3 shadow-sm">
        
        {/* ❌ REMOVE FILE BUTTON */}
        <button
          onClick={() => {
            setFileInfo(fileInfo.filter((_, i) => i !== index));
          }}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow hover:opacity-90 active:scale-95"
        >
          ✕
        </button>

        {/* FILE PREVIEW */}
        {f.file.type === "application/pdf" ? (
          <iframe
            src={URL.createObjectURL(f.file)}
            className="w-full h-40 border rounded-lg shadow"
            title={`pdf-preview-${index}`}
          ></iframe>
        ) : (
          <img
            src={URL.createObjectURL(f.file)}
            className="w-full h-40 border rounded-lg object-contain shadow"
            alt={`preview-${index}`}
          />
        )}

        {/* FILE DETAILS */}
        <div className="mt-2 text-sm text-gray-700 text-center">
          <p className="font-semibold">{f.name}</p>
          <p>{f.pages} × {printType === "bw" ? "B/W" : "Color"} × {sideType}</p>
          <p className="font-bold text-orange-600">₹{calculateCost(f.pages, printType, sideType)}</p>
        </div>

      </div>
    ))}
  </div>
)}



{/* 2. Page Count and Price Info */}
{fileInfo.length > 0 && (
  <div className="mt-3 bg-gray-50 p-3 rounded-xl text-sm shadow-sm">
    {fileInfo.map((f, index) => (
      <div key={index}>
        <p><strong>File {index + 1}:</strong> {f.name}</p>
        <p><strong>Pages:</strong> {f.pages}</p>
        <p><strong>Selected Type & Side:</strong> {printType} | {sideType === "double" ? "Double Side" : "Single Side"} | {orientation}</p>
        <p><strong>Estimated Cost:</strong> ₹{calculateCost(f.pages, printType, sideType)}</p>
      </div>
    ))}
    <p className="mt-2 font-semibold">Total Estimated Cost: ₹{fileInfo.reduce((acc, f) => acc + calculateCost(f.pages, printType, sideType), 0)}</p>
  </div>
)}
      
        {/* 7. PRICE INFO */}
        <div className="bg-orange-50 p-6 rounded-xl text-sm shadow-sm">
                    <p className="font-semibold">Notes & Price (Merchant Info)</p>
                    <p>• A4 B/W Print Single side — ₹5/page</p>
                    <p>• A4 Color Print Single side — ₹10/page</p>
                    <p>• A4 B/W Print Double side   — ₹7/page</p>
                    <p>• A4 Color Print Double side  — ₹12/page</p>
                    <p>• Standard Delivery Charges Will Be Applied</p>
                    <p>• Document Size Less than 100 MB</p>
                    <p>• Maximum 5 Files Allowed</p>
                    <p>• Minimum Total Print Cost ₹50 </p>
                           <p>• Note: Merchant reserves the right to reject or cancel any order at their discretion. ✅</p>
</div>
                  {/* 8. ADD TO CART BUTTON */}
<div className="mt-4 flex justify-center">
<button
  disabled={fileInfo.reduce((acc, f) => acc + calculateCost(f.pages, printType, sideType), 0) < 50}
  onClick={() => {
    const totalPrice = fileInfo.reduce(
      (acc, f) => acc + calculateCost(f.pages, printType, sideType),
      0
    );

    addToCart({
      id: Date.now(),
      name: `Print Order (${fileInfo.length} file${fileInfo.length > 1 ? "s" : ""})`,
      category: "print",
      files: fileInfo.map(f => ({ name: f.name, pages: f.pages })),
      printType,
      sideType,
      price: totalPrice,
      quantity: 1,
      img: "/assets/print-icon.png"
    });

    // Navigate to cart page
    navigate("/cart");
  }}
  className={`w-fit px-5 py-2 rounded-2xl font-semibold shadow text-white transition 
    ${fileInfo.reduce((acc, f) => acc + calculateCost(f.pages, printType, sideType), 0) >= 50
      ? "bg-orange-500 hover:bg-orange-600 cursor-pointer"
      : "bg-gray-400 cursor-not-allowed"
    }`}
>
  Add to Cart
</button>


                  </div>
                </motion.div>
              )}

    {/* ✅ XEROX TAB — COMING SOON */}
 {innerTab === "xerox" && (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
    className="bg-white text-gray-700 font-semibold text-sm p-8 rounded-2xl shadow-lg w-[90%] max-w-lg text-center flex flex-col items-center justify-center space-y-4"
  >
    <span className="text-4xl animate-pulse">🚧</span>
    <h2 className="text-lg font-bold">Xerox Service Coming Soon!</h2>
    <p className="text-xs text-gray-500">
      We are working hard to make Xerox services available. Stay tuned!
    </p>

    {/* Stay Tuned Button */}
    <button
      onClick={() => setStayTuned(true)}
      className={`mt-3 px-5 py-2 rounded-full font-semibold shadow transition ${
        stayTuned
          ? "bg-green-500 text-white"
          : "bg-orange-500 text-white hover:bg-orange-600"
      }`}
    >
      {stayTuned ? "✓ Stay Tuned Activated" : "Stay Tuned"}
    </button>
  </motion.div>
)}
 {/* FIXED CONTACT BUTTON */}
      <div className="fixed left-0 right-0 bottom-0 p-4">
        <div className="max-w-4xl mx-auto bg-white shadow rounded-2xl p-3 flex justify-between items-center">
          <p className="text-sm font-semibold text-gray-700">Need printing done? Contact shop now</p>
          <button className="px-3 py-1 bg-orange-500 text-white text-sm font-bold rounded-full shadow flex items-center gap-1">
            <button
  onClick={() => window.location.href = "tel:9356511501"}
  className="px-3 py-1 bg-orange-500 text-white text-sm font-bold rounded-full shadow flex items-center gap-1"
>
  <Phone size={15} /> Call Shop
</button>

          </button>
        </div>
      </div>
  </div>
)}



 {active === "photo" && (
  <motion.div className="bg-white rounded-2xl shadow p-5 w-[90%] max-w-lg text-center mx-auto">
    <h2 className="text-xl font-bold text-gray-900">Photo Printing</h2>
    <p className="text-sm text-gray-600 mt-1 mb-4">Glossy / Matte / HD photo prints</p>

    {/* Info Box */}
    <div className="text-left text-sm space-y-1 bg-gray-50 p-3 rounded-xl shadow-sm mb-4">
      <p>• Passport size photos Only</p>
      <p>• ₹50 For 1 Set of 8 Photocopy Wil Be Provided </p>
      <p>• Instant delivery available</p>
      <p>• Standard delivery Charges Applicable</p>
      <p>• Number Of Copies is 8 × Entered Number </p>
             <p>• Note: Merchant reserves the right to reject or cancel any order at their discretion. ✅</p>
       </div>

    {/* Upload Photo */}
    <div className="mb-4">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setUploadedPhoto(e.target.files[0])}
        className="block w-full text-sm text-gray-600 file:bg-orange-500 file:text-white file:py-2 file:px-4 file:rounded-full file:border-none cursor-pointer"
      />
      {uploadedPhoto && (
        <img
          src={URL.createObjectURL(uploadedPhoto)}
          alt="preview"
          className="w-32 h-32 object-cover mx-auto mt-3 rounded-lg"
        />
      )}
    </div>

    {/* Number of Copies */}
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-1">Number of Copies</label>
      <input
        type="number"
        min={1}
        value={numCopies}
        onChange={(e) => setNumCopies(Number(e.target.value))}
        className="w-full px-3 py-2 border rounded-xl text-center"
      />
    </div>

    
    {/* Add to Cart Button */}
   <button
  disabled={!uploadedPhoto || numCopies < 1}
  onClick={() => {
    const setPrice = 50; // ✅ Fixed ₹50 per 1 set (8 copies)
    const totalPrice = setPrice * numCopies; // numCopies acts as "units"

    addToCart({
      id: Date.now(),
      name: `Passport Photo (${numCopies} set${numCopies > 1 ? "s" : ""})`,
      category: "photo",
      file: uploadedPhoto.name,
      price: totalPrice,
      quantity: 1,
      img: uploadedPhoto ? URL.createObjectURL(uploadedPhoto) : "/assets/print-icon.png",
    });

    navigate("/cart");
  }}
  className="w-fit px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-full shadow hover:bg-orange-600 transition"
>
  Add to Cart
</button>
  {/* FIXED CONTACT BUTTON */}
      <div className="fixed left-0 right-0 bottom-0 p-4">
        <div className="max-w-4xl mx-auto bg-white shadow rounded-2xl p-3 flex justify-between items-center">
          <p className="text-sm font-semibold text-gray-700">Need Photo done? Contact shop now</p>
          <button className="px-3 py-1 bg-orange-500 text-white text-sm font-bold rounded-full shadow flex items-center gap-1">
            <button
  onClick={() => window.location.href = "tel:9356511501"}
  className="px-3 py-1 bg-orange-500 text-white text-sm font-bold rounded-full shadow flex items-center gap-1"
>
  <Phone size={15} /> Call Shop
</button>

          </button>
        </div>
      </div>
  </motion.div>
)}

   {active === "banner" && (
  <div className="flex justify-center mt-6 px-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 120 }}
      className="bg-white rounded-2xl shadow p-6 w-full max-w-2xl text-left space-y-4"
    >

      {/* TITLE */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900">Banner & Flex Printing</h2>
        <p className="text-sm text-gray-500">Custom size in feet • Upload design • Choose material</p>
      </div>

      {/* 1. SIZE INPUT */}
      <div>
        <label className="block text-sm font-semibold mb-1">Banner Size (Feet)</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Height"
            value={bannerHeight}
            onChange={(e) => setBannerHeight(e.target.value)}
            className="w-1/2 border p-2 rounded-xl text-sm shadow-sm"
          />
          <input
            type="number"
            placeholder="Width"
            value={bannerWidth}
            onChange={(e) => setBannerWidth(e.target.value)}
            className="w-1/2 border p-2 rounded-xl text-sm shadow-sm"
          />
        </div>
        {bannerHeight && bannerWidth && (
          <p className="text-xs text-gray-600 mt-1">
            Area: {bannerHeight * bannerWidth} sq.ft
          </p>
        )}
      </div>

      {/* 2. FILE UPLOAD */}
      <div>
        <input
          id="bannerUpload"
          type="file"
          accept=".pdf, .jpg, .jpeg, .png"
          className="hidden"
          onChange={(e) => setUploadedBanner(e.target.files[0])}
        />
        <label
          htmlFor="bannerUpload"
          className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm block text-center cursor-pointer hover:opacity-90 transition"
        >
          {uploadedBanner ? "✓ File Selected" : "Upload Banner Design"}
        </label>
        {uploadedBanner && (
          <p className="text-xs text-center text-gray-500 mt-1">{uploadedBanner.name}</p>
        )}
      </div>

      {/* 3. MATERIAL SELECT */}
      <div>
        <label className="block text-sm font-semibold mb-1">Material</label>
        <select
          value={bannerMaterial}
          onChange={(e) => setBannerMaterial(e.target.value)}
          className="w-full border p-2 rounded-xl text-sm shadow-sm"
        >
          <option value="standard">Standard Flex — ₹15/sq.ft</option>
          <option value="premium">Premium Flex — ₹20/sq.ft</option>
          <option value="vinyl">Vinyl Banner — ₹25/sq.ft</option>
        </select>
      </div>

      {/* 4. DESIGN SERVICE */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={bannerDesign}
          onChange={(e) => setBannerDesign(e.target.checked)}
          className="w-4 h-4"
        />
        <p className="text-sm">Need Design Service (₹100 extra)</p>
      </div>

      {/* 5. DELIVERY */}
      <div>
        <label className="block text-sm font-semibold mb-1">Delivery</label>
        <select
          value={bannerDelivery}
          onChange={(e) => setBannerDelivery(e.target.value)}
          className="w-full border p-2 rounded-xl text-sm shadow-sm"
        >
          <option value="instant">Instant Pickup from Shop</option>
          <option value="standard">Standard Delivery (Charges Apply)</option>
        </select>
      </div>

{/* DESIGN SUGGESTION BOX */}
{bannerDesign && (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    className="bg-orange-50 border border-orange-200 p-3 rounded-xl text-xs shadow-sm"
  >
    <p className="font-semibold text-orange-700 mb-1">Design Suggestions:</p>
    <p>• Keep text bold and readable from distance</p>
    <p>• Limit to 10–12 words per line max</p>
    <p>• Use high contrast colors (Red–White / Black–Yellow)</p>
    <p>• Add 1 big image instead of many small images</p>
    <p>• QR code should be at least 8–12 inches big</p>
    <p className="mt-2 text-center text-orange-600 font-bold">
      Tip: Tell merchant to describe theme while uploading
    </p>
  </motion.div>
)}

<textarea
  placeholder="Describe your banner theme (Birthday, Offer, Business, Event...)"
  value={bannerTheme}
  onChange={(e) => setBannerTheme(e.target.value)}
  className="w-full border p-2 rounded-xl text-xs shadow-sm mt-2"
/>

      {/* 6. PRICE PREVIEW */}
      {bannerHeight && bannerWidth && (
        <div className="bg-gray-50 p-3 rounded-xl text-xs shadow-sm">
          <p className="font-semibold">Estimated Price</p>
          <p>• Area: {bannerHeight * bannerWidth} sq.ft</p>
          <p>• Material Rate: ₹{bannerMaterial === "premium" ? 20 : bannerMaterial === "vinyl" ? 25 : 15}/sq.ft</p>
          <p>• Sets: {numCopies} Set</p>
          <p className="font-bold mt-1">
            Total: ₹
            {(bannerHeight * bannerWidth) *
              (bannerMaterial === "premium" ? 20 : bannerMaterial === "vinyl" ? 25 : 15) +
              (bannerDesign ? 100 : 0)}
          </p>
        </div>
      )}
       <p>• Note: Merchant reserves the right to reject or cancel any order at their discretion. ✅</p>
      {/* 7. ADD TO CART BUTTON */}
      <div className="flex justify-center pt-2">
        <button
          disabled={!uploadedBanner || !bannerHeight || !bannerWidth}
          onClick={() => {
            const area = bannerHeight * bannerWidth;
            const rate = bannerMaterial === "premium" ? 20 : bannerMaterial === "vinyl" ? 25 : 15;
            const totalPrice = area * rate + (bannerDesign ? 100 : 0);

            addToCart({
              id: Date.now(),
              name: `Banner (${bannerHeight}×${bannerWidth} ft)`,
              category: "banner",
              file: uploadedBanner.name,
              material: bannerMaterial,
              design: bannerDesign,
              delivery: bannerDelivery,
              price: totalPrice,
              quantity: 1,
              img: "/assets/banner-icon.png"
            });

            navigate("/cart");
          }}
          className={`px-5 py-2 rounded-xl text-sm font-bold shadow transition ${
            uploadedBanner && bannerHeight && bannerWidth
              ? "bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          Add to Cart
        </button>
      </div>

    </motion.div>
      {/* FIXED CONTACT BUTTON */}
      <div className="fixed left-0 right-0 bottom-0 p-4">
        <div className="max-w-4xl mx-auto bg-white shadow rounded-2xl p-3 flex justify-between items-center">
          <p className="text-sm font-semibold text-gray-700">Need Banner done? Contact shop now</p>
          <button className="px-3 py-1 bg-orange-500 text-white text-sm font-bold rounded-full shadow flex items-center gap-1">
            <button
  onClick={() => window.location.href = "tel:9764002378"}
  className="px-3 py-1 bg-orange-500 text-white text-sm font-bold rounded-full shadow flex items-center gap-1"
>
  <Phone size={15} /> Call Shop
</button>

          </button>
        </div>
      </div>
  </div>
)}


{active === "lamination" && (
  <motion.div className="bg-white rounded-2xl shadow p-5 w-[90%] max-w-lg text-center">
    <h2 className="text-xl font-bold text-gray-900">Lamination</h2>
    <p className="text-sm text-gray-600 mt-1 mb-4">Protect your printed documents & photos</p>

    <div className="text-left text-xs space-y-2 bg-gray-50 p-3 rounded-xl shadow-sm">
      <p className="font-semibold text-orange-600">🔒 Important:</p>
      <p>• Lamination service is available **only if printing is done from us**</p>
      <p>• Lamination is processed **after merchant completes your print order**</p>
      <p>• Cost: ₹30 per sheet (only applied after print order)</p>
      <p>• Merchant note and delivery charges applicable</p>
       <p>• Note: Merchant reserves the right to reject or cancel any order at their discretion. ✅</p>

      <p className="text-center text-orange-700 font-bold mt-2 bg-orange-100 p-2 rounded-lg">
        Lamination will be processed once printed ✅
      </p>
    </div>

    <label className="flex items-center justify-center gap-2 mt-4 cursor-pointer text-sm font-semibold">
      <input
        type="checkbox"
        checked={lamAlert}
        onChange={() => setLamAlert(!lamAlert)}
        className="accent-orange-500"
      />
      Enable lamination after print
    </label>

    {/* ✅ ADD TO CART BUTTON */}
    <div className="mt-4 flex justify-center">
      <button
        disabled={!lamAlert}
        onClick={() => {
          addToCart({
            id: Date.now(),
            name: "Lamination Service (After Print)",
            category: "lamination",
            price: 30,
            quantity: 1,
            img: "/assets/print-icon.png",
          });

          navigate("/cart");
        }}
        className={`w-fit text-white font-semibold px-4 py-2 rounded-xl shadow active:scale-95 transition ${
          lamAlert ? "bg-orange-500 hover:bg-orange-600 cursor-pointer" : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Add Lamination to Cart
      </button>
    </div>
      {/* FIXED CONTACT BUTTON */}
      <div className="fixed left-0 right-0 bottom-0 p-4">
        <div className="max-w-4xl mx-auto bg-white shadow rounded-2xl p-3 flex justify-between items-center">
          <p className="text-sm font-semibold text-gray-700">Need Lamination done? Contact shop now</p>
          <button className="px-3 py-1 bg-orange-500 text-white text-sm font-bold rounded-full shadow flex items-center gap-1">
            <button
  onClick={() => window.location.href = "tel:9356511501"}
  className="px-3 py-1 bg-orange-500 text-white text-sm font-bold rounded-full shadow flex items-center gap-1"
>
  <Phone size={15} /> Call Shop
</button>

          </button>
        </div>
      </div>
  </motion.div>
)}

 {active === "binding" && (
  <motion.div className="bg-white rounded-2xl shadow p-5 w-[90%] max-w-lg text-center">
    <h2 className="text-xl font-bold text-gray-900">Spiral Binding</h2>
    <p className="text-sm text-gray-600 mt-1 mb-4">Convert prints into books and projects</p>

    <div className="text-left text-xs space-y-2 bg-gray-50 p-3 rounded-xl shadow-sm">
      <p className="font-semibold text-green-600">📘 Service Rule:</p>
      <p>• Binding is available **only if printing is done from us**</p>
      <p>• Binding starts **after merchant completes the print order**</p>
      <p>• Binding Cost: </p>
      <p>   •  Spiral: ₹ 50</p>
      <p>• Maximum 100 pages per book</p>
       <p>• Note: Merchant reserves the right to reject or cancel any order at their discretion. ✅</p>
      <p className="text-center text-green-700 font-bold mt-2 bg-green-100 p-2 rounded-lg">
        Binding will start once printed ✅
      </p>
    </div>

    <label className="flex items-center justify-center gap-2 mt-4 cursor-pointer text-sm font-semibold">
      <input
        type="checkbox"
        checked={bindAlert}
        onChange={() => setBindAlert(!bindAlert)}
        className="accent-orange-500"
      />
      Enable binding after print
    </label>

    {/* ✅ ADD TO CART BUTTON */}
    <div className="mt-4 flex justify-center">
      <button
        disabled={!bindAlert}
        onClick={() => {
          addToCart({
            id: Date.now(),
            name: "Binding Service (After Print)",
            category: "binding",
            price: 40, // base price (can be updated in cart later)
            quantity: 1,
            img: "/assets/print-icon.png",
          });

          navigate("/cart");
        }}
        className={`w-fit text-white font-semibold px-4 py-2 rounded-xl shadow active:scale-95 transition ${
          bindAlert ? "bg-orange-500 hover:bg-orange-600 cursor-pointer" : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Add Binding to Cart
      </button>
    </div>
      {/* FIXED CONTACT BUTTON */}
      <div className="fixed left-0 right-0 bottom-0 p-4">
        <div className="max-w-4xl mx-auto bg-white shadow rounded-2xl p-3 flex justify-between items-center">
          <p className="text-sm font-semibold text-gray-700">Need Spiral done? Contact shop now</p>
          <button className="px-3 py-1 bg-orange-500 text-white text-sm font-bold rounded-full shadow flex items-center gap-1">
            <button
  onClick={() => window.location.href = "tel:9356511501"}
  className="px-3 py-1 bg-orange-500 text-white text-sm font-bold rounded-full shadow flex items-center gap-1"
>
  <Phone size={15} /> Call Shop
</button>

          </button>
        </div>
      </div>
  </motion.div>
  
)}


  </div>
) : (
  <div className="px-4 mt-4"> {/* normal tab outcome (already working UI) */}
    {/* your existing tab UI stays here */}
    
  </div>
)}

    

    </div>
  );
}
