"use client";

import { useState, useRef, useEffect } from "react";
import AdBanner from "@/components/AdBanner";

export default function QrGenerator() {
  const [text, setText] = useState("");
  const [size, setSize] = useState(200);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [generated, setGenerated] = useState(false);

  const generate = () => {
    if (!text.trim() || !canvasRef.current) return;
    // Simple QR code using external API rendered to canvas
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      setGenerated(true);
    };
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;
  };

  const download = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">QRコード生成</h1>
      <p className="text-gray-500 text-sm mb-6">
        URLやテキストからQRコードを作成。PNG画像でダウンロードできます。
      </p>

      <AdBanner />

      <div className="space-y-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="URLまたはテキストを入力..."
          className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-600 flex items-center gap-2">
            サイズ:
            <select value={size} onChange={(e) => setSize(Number(e.target.value))} className="border border-gray-300 rounded px-2 py-1">
              <option value={150}>150px</option>
              <option value={200}>200px</option>
              <option value={300}>300px</option>
              <option value={400}>400px</option>
            </select>
          </label>
          <button onClick={generate} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            生成
          </button>
          {generated && (
            <button onClick={download} className="px-5 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
              ダウンロード
            </button>
          )}
        </div>

        <div className="flex justify-center p-8 bg-white border border-gray-200 rounded-lg">
          <canvas ref={canvasRef} width={size} height={size} className="border border-gray-100" />
        </div>
      </div>

      <AdBanner />
    </div>
  );
}
