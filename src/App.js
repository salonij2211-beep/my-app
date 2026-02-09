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
    localStorage.setItem("qrPage", JSON.stringify([newEntry, ...oldList]));

    navigate("/next");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
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

        <div className="w-full h-64 border-2 border-dashed border-gray-400 rounded-xl flex items-center justify-center mb-6">
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
        <div className="grid grid-cols-4 text-center font-semibold text-gray-700 border-b pb-3 mb-6">
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
              className="grid grid-cols-1 md:grid-cols-4 gap-6 border-b last:border-b-0 pb-6 mb-6"
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
                      className="w-28 h-28 border-4 border-black bg-white flex items-center justify-center"
                    >
                      <QRCodeCanvas value={link} size={80} />
                    </div>
                  ))}
                </div>

                <div className="flex justify-center gap-6">
                  {Array.from({ length: Math.max(qrCount - 2, 0) }).map(
                    (_, i) => (
                      <div
                        key={i}
                        className="w-28 h-28 border-4 border-black bg-white flex items-center justify-center"
                      >
                        <QRCodeCanvas value={link} size={80} />
                      </div>
                    )
                  )}
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
//custumize page
function CustomizePage() {
  const location = useLocation();

  const stored = JSON.parse(localStorage.getItem("qrPage"));
  const list = Array.isArray(stored) ? stored : stored ? [stored] : [];
  const data = location.state || list[0] || {};

  const link = data.link || "";
  const text = data.text || "";

  const num = text.match(/\d+/);
  const qrCount = num ? Math.min(Number(num[0]), 5) : 1;

  const [businessName, setBusinessName] = useState("Business Name");
  const [nameSize, setNameSize] = useState(18);
  const [nameColor, setNameColor] = useState("#6b2d2d");
  const [fontFamily, setFontFamily] = useState("Arial");

  const [logo, setLogo] = useState(null);
  const [logoSize, setLogoSize] = useState(40);

  const [icons, setIcons] = useState(Array(qrCount).fill("none"));

  const [logoPos, setLogoPos] = useState({ x: 60, y: 430 });
  const [namePos, setNamePos] = useState({ x: 60, y: 60 });

  useEffect(() => {
    setIcons(Array(qrCount).fill("none"));
  }, [qrCount]);

  const iconMap = {
    none: null,
    whatsapp: "/whatsapp.png",
    instagram: "/instagram.png",
    linkedin: "/linkedin.png",
  };

  const startDrag = (type, e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startPos = type === "logo" ? logoPos : namePos;

    const onMove = (ev) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      const newPos = { x: startPos.x + dx, y: startPos.y + dy };
      type === "logo" ? setLogoPos(newPos) : setNamePos(newPos);
    };

    const stop = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", stop);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", stop);
  };

  const handleLogoUpload = (e) => {
    if (e.target.files[0]) {
      setLogo(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleIconChange = (i, value) => {
    const copy = [...icons];
    copy[i] = value;
    setIcons(copy);
  };

  const handleDownload = () => {
    const svg = document.getElementById("final-svg");
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svg);

    if (!source.includes("xmlns")) {
      source = source.replace(
        "<svg",
        '<svg xmlns="http://www.w3.org/2000/svg"'
      );
    }

    const blob = new Blob([source], {
      type: "image/svg+xml;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "final-design.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ===== SVG PREVIEW ===== */}
        <svg
          id="final-svg"
          viewBox="0 0 500 520"
          width="100%"
          height="520"
          className="border rounded-2xl"
        >
          {/* TEMPLATE SVG */}
          <image href="/3_Qr.svg" x="0" y="0" width="500" height="520" />

          {/* BUSINESS NAME */}
          <text
            x={namePos.x}
            y={namePos.y}
            fontSize={nameSize}
            fill={nameColor}
            fontFamily={fontFamily}
            style={{ cursor: "move" }}
            onMouseDown={(e) => startDrag("name", e)}
          >
            {businessName}
          </text>

          {/* ICON + QR */}
          {Array.from({ length: qrCount }).map((_, i) => {
            const y = 120 + i * 125;
            return (
              <g key={i}>
                {iconMap[icons[i]] && (
                  <image
                    href={iconMap[icons[i]]}
                    x="130"
                    y={y-16}
                    width="80"
                    height="80"
                  />
                )}
                <foreignObject x="270" y={y - 28} width="120" height="120">
                  <div xmlns="http://www.w3.org/1999/xhtml">
                    <QRCodeCanvas value={link} size={100} />
                  </div>
                </foreignObject>
              </g>
            );
          })}

          {/* LOGO */}
          {logo && (
            <image
              href={logo}
              x={logoPos.x}
              y={logoPos.y}
              height={logoSize}
              preserveAspectRatio="xMidYMid meet"
              style={{ cursor: "move" }}
              onMouseDown={(e) => startDrag("logo", e)}
            />
          )}
        </svg>

        {/* ===== RIGHT CONTROLS (IMAGE STYLE) ===== */}
        <div className="border rounded-2xl p-6 space-y-4">

          {Array.from({ length: qrCount }).map((_, i) => (
            <div key={i}>
              <div className="text-sm mb-1">Icon {i + 1}</div>
              <select
                value={icons[i]}
                onChange={(e) => handleIconChange(i, e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="none">Select</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="instagram">Instagram</option>
                <option value="linkedin">LinkedIn</option>
              </select>
            </div>
          ))}

          <div>
            <div className="text-sm mb-1">Business Name Size</div>
            <input
              type="range"
              min="12"
              max="40"
              value={nameSize}
              onChange={(e) => setNameSize(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <div className="text-sm mb-1">Business Name Color</div>
            <input
              type="color"
              value={nameColor}
              onChange={(e) => setNameColor(e.target.value)}
            />
          </div>

          <div>
            <div className="text-sm mb-1">Logo Size</div>
            <input
              type="range"
              min="20"
              max="80"
              value={logoSize}
              onChange={(e) => setLogoSize(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <input type="file" onChange={handleLogoUpload} />

          <button
            onClick={handleDownload}
            className="w-full bg-blue-500 text-white py-3 rounded-xl"
          >
            Download
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
