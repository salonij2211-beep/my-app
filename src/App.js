import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";

/* ================= PAGE 1 ================= */
function Home() {
  const navigate = useNavigate();

  const stored = JSON.parse(localStorage.getItem("qrPage"));
  const list = Array.isArray(stored) ? stored : stored ? [stored] : [];
  const latest = list[0] || {};

  const [link, setLink] = useState(latest.link || "");
  const [text, setText] = useState(latest.text || "");

  const handleNext = () => {
    if (!link) {
      alert("Please generate QR code");
      return;
    }

    const old = JSON.parse(localStorage.getItem("qrPage"));
    const oldList = Array.isArray(old) ? old : old ? [old] : [];

    const newEntry = { link, text };

    localStorage.setItem(
      "qrPage",
      JSON.stringify([newEntry, ...oldList])
    );

    navigate("/next");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100
                    flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl">

        <h1 className="text-xl font-bold mb-6 text-gray-800">
          QR Code Create
        </h1>

        <input
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="enter link"
          className="w-full border-2 border-gray-400 p-3 rounded-xl mb-6"
        />

        <div className="w-full h-64 border-2 border-dashed border-gray-400
                        rounded-xl flex items-center justify-center mb-6">
          {link ? <QRCodeCanvas value={link} size={200} /> : "qr code"}
        </div>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="enter text (1qr,2qr..5qr)"
          className="w-full border-2 border-gray-400 p-3 rounded-xl mb-8"
        />

        <button
          onClick={handleNext}
          className="w-full bg-blue-500 text-white py-3 rounded-xl"
        >
          Next
        </button>
      </div>
    </div>
  );
}

/* ================= PAGE 2 ================= */
function NextPage() {
  const navigate = useNavigate();

  const stored = JSON.parse(localStorage.getItem("qrPage"));
  const list = Array.isArray(stored) ? stored : stored ? [stored] : [];

  const clearAll = () => {
    localStorage.removeItem("qrPage");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex justify-center">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-xl p-6">

        <div className="grid grid-cols-4 text-center font-semibold
                        text-gray-700 border-b pb-3 mb-6">
          <div>text</div>
          <div>Link</div>
          <div>QR code</div>
          <div>customization</div>
        </div>

        {list.map((item, index) => {
          const { link, text } = item;
          const qrCount = Math.min(parseInt(text) || 1, 5);

          return (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-4 gap-6
                         border-b last:border-b-0 pb-6 mb-6"
            >
              <div>{text}</div>

              <a href={link} className="text-blue-600 underline break-all">
                {link}
              </a>

              <div className="inline-block bg-gray-50 p-4 rounded-xl">
                <div className="flex justify-center gap-6 mb-6">
                  {Array.from({ length: Math.min(qrCount, 2) }).map((_, i) => (
                    <div
                      key={i}
                      className="w-28 h-28 border-4 border-black bg-white
                                 flex items-center justify-center"
                    >
                      <QRCodeCanvas value={link} size={80} />
                    </div>
                  ))}
                </div>

                <div className="flex justify-center gap-6">
                  {Array.from({ length: Math.max(qrCount - 2, 0) }).map((_, i) => (
                    <div
                      key={i}
                      className="w-28 h-28 border-4 border-black bg-white
                                 flex items-center justify-center"
                    >
                      <QRCodeCanvas value={link} size={80} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4 items-center">
                <button
                  onClick={() => navigate("/customize", { state: item })}
                  className="border px-6 py-3 rounded-xl"
                >
                  customize
                </button>

                <button
                  onClick={clearAll}
                  className="text-red-500 underline text-sm"
                >
                  clear
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ================= PAGE 3 ================= */
/* ================= PAGE 3 ================= */
function CustomizePage() {
  const location = useLocation();

  const stored = JSON.parse(localStorage.getItem("qrPage"));
  const list = Array.isArray(stored) ? stored : stored ? [stored] : [];

  const data = location.state || list[0] || {};
  const link = data.link || "";
  const text = data.text || "";

  const num = text.match(/\d+/);
  const qrCount = num ? Math.min(Number(num[0]), 3) : 1;

  const [businessName, setBusinessName] = useState("Business name");
  const [logo, setLogo] = useState(null);
  const [icons, setIcons] = useState(Array(qrCount).fill("none"));

  const iconMap = {
    none: null,
    whatsapp: "/whatsapp.png",
    instagram: "/instagram.png",
    linkedin: "/linkedin.png",
  };

  const handleIconChange = (i, value) => {
    const copy = [...icons];
    copy[i] = value;
    setIcons(copy);
  };

  const handleLogoUpload = (e) => {
    if (e.target.files[0]) {
      setLogo(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ================= LEFT PREVIEW ================= */}
        <div className="border rounded-2xl p-6 flex flex-col items-center">

          {/* LOGO */}
          <div className="mb-6">
            {logo ? (
              <img src={logo} alt="logo" className="h-10" />
            ) : (
              <div className="border px-6 py-1 rounded">logo</div>
            )}
          </div>

          {/* ICON + QR VERTICAL */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* ICON COLUMN */}
            <div className="flex flex-col gap-6 items-center">
              {Array.from({ length: qrCount }).map((_, i) => (
                <div key={i} className="h-20 flex items-center">
                  {iconMap[icons[i]] ? (
                    <img
                      src={iconMap[icons[i]]}
                      alt="icon"
                      className="w-10 h-10"
                    />
                  ) : (
                    <div className="text-sm">icon {i + 1}</div>
                  )}
                </div>
              ))}
            </div>

            {/* QR COLUMN */}
            <div className="flex flex-col gap-6 items-center">
              {Array.from({ length: qrCount }).map((_, i) => (
                <div
                  key={i}
                  className="w-20 h-20 border-4 border-black flex items-center justify-center"
                >
                  <QRCodeCanvas value={link} size={60} />
                </div>
              ))}
            </div>
          </div>

          {/* BUSINESS NAME */}
          <div className="border px-6 py-1 rounded">
            {businessName}
          </div>
        </div>

        {/* ================= RIGHT CONTROLS ================= */}
        <div className="border rounded-2xl p-6 space-y-4">

          {Array.from({ length: qrCount }).map((_, i) => (
            <div key={i}>
              <div className="mb-1">icon {i + 1}</div>
              <select
                value={icons[i]}
                onChange={(e) => handleIconChange(i, e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="none">dropdown</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="instagram">Instagram</option>
                <option value="linkedin">LinkedIn</option>
              </select>
            </div>
          ))}

          <input
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="enter business name"
            className="w-full border p-2 rounded"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="w-full border p-2 rounded"
          />

          <button className="w-full bg-blue-500 text-white py-2 rounded-xl">
            download
          </button>
        </div>

      </div>
    </div>
  );
}



/* ================= ROUTES ================= */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/next" element={<NextPage />} />
      <Route path="/customize" element={<CustomizePage />} />
    </Routes>
  );
}
