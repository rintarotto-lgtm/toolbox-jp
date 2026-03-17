"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

const SIZES = [16, 32, 48, 64, 128, 192] as const;
type Shape = "square" | "rounded" | "circle";

function SmallPreview({
  size,
  drawFavicon,
}: {
  size: number;
  drawFavicon: (canvas: HTMLCanvasElement, size: number) => void;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (ref.current) drawFavicon(ref.current, size);
  }, [drawFavicon, size]);
  return (
    <div className="text-center">
      <canvas
        ref={ref}
        style={{ width: size, height: size }}
        className="border border-gray-300 rounded"
      />
      <p className="text-xs text-gray-400 mt-1">{size}px</p>
    </div>
  );
}

export default function FaviconGenTool() {
  const [text, setText] = useState("A");
  const [bgColor, setBgColor] = useState("#4F46E5");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [shape, setShape] = useState<Shape>("rounded");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawFavicon = useCallback(
    (canvas: HTMLCanvasElement, size: number) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = size;
      canvas.height = size;
      ctx.clearRect(0, 0, size, size);

      // Draw shape
      ctx.fillStyle = bgColor;
      if (shape === "circle") {
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (shape === "rounded") {
        const r = size * 0.15;
        ctx.beginPath();
        ctx.moveTo(r, 0);
        ctx.lineTo(size - r, 0);
        ctx.quadraticCurveTo(size, 0, size, r);
        ctx.lineTo(size, size - r);
        ctx.quadraticCurveTo(size, size, size - r, size);
        ctx.lineTo(r, size);
        ctx.quadraticCurveTo(0, size, 0, size - r);
        ctx.lineTo(0, r);
        ctx.quadraticCurveTo(0, 0, r, 0);
        ctx.fill();
      } else {
        ctx.fillRect(0, 0, size, size);
      }

      // Draw text
      ctx.fillStyle = textColor;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const fontSize = text.length === 1 ? size * 0.6 : size * 0.4;
      ctx.font = `bold ${fontSize}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
      ctx.fillText(text, size / 2, size / 2 + size * 0.04);
    },
    [text, bgColor, textColor, shape]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) drawFavicon(canvas, 192);
  }, [drawFavicon]);

  const download = (size: number) => {
    const tempCanvas = document.createElement("canvas");
    drawFavicon(tempCanvas, size);
    const link = document.createElement("a");
    link.download = `favicon-${size}x${size}.png`;
    link.href = tempCanvas.toDataURL("image/png");
    link.click();
  };

  const downloadIco = () => {
    const tempCanvas = document.createElement("canvas");
    drawFavicon(tempCanvas, 32);
    const link = document.createElement("a");
    link.download = "favicon.png";
    link.href = tempCanvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">ファビコン生成</h1>
      <p className="text-gray-500 text-sm mb-6">
        テキストや絵文字からファビコンを生成。背景色・形状をカスタマイズしてダウンロード。
      </p>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        {/* Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              テキスト（1〜2文字 or 絵文字）
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 2))}
              placeholder="A"
              className="w-full p-3 border border-gray-300 rounded-lg text-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              形状
            </label>
            <div className="flex gap-2">
              {(
                [
                  { value: "square", label: "四角" },
                  { value: "rounded", label: "角丸" },
                  { value: "circle", label: "丸" },
                ] as const
              ).map((s) => (
                <button
                  key={s.value}
                  onClick={() => setShape(s.value)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm border ${
                    shape === s.value
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              背景色
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-10 h-10 rounded cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              テキスト色
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-10 h-10 rounded cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">プレビュー</h3>
          <div className="flex items-end gap-4 flex-wrap bg-gray-50 p-4 rounded-lg border border-gray-200">
            <canvas
              ref={canvasRef}
              className="border border-gray-300 rounded"
              style={{ width: 192, height: 192 }}
            />
            <div className="flex gap-3 items-end flex-wrap">
              {[16, 32, 48, 64].map((size) => (
                <SmallPreview key={size} size={size} drawFavicon={drawFavicon} />
              ))}
            </div>
          </div>
        </div>

        {/* Download buttons */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">ダウンロード</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={downloadIco}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              favicon.png（32px）
            </button>
            {SIZES.map((size) => (
              <button
                key={size}
                onClick={() => download(size)}
                className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
              >
                {size}x{size}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AdBanner />

      <ToolFAQ
        faqs={[
          {
            question: "ファビコンとは何ですか？",
            answer:
              "ファビコン（favicon）は、ブラウザのタブやブックマークに表示される小さなアイコンです。Webサイトのブランドを視覚的に識別するために使われます。一般的に16x16、32x32、192x192ピクセルなどのサイズが必要です。",
          },
          {
            question: "どのサイズをダウンロードすればよいですか？",
            answer:
              "最低限32x32のPNGファイルを用意すれば多くのブラウザで表示されます。Androidのホーム画面用には192x192、Apple Touch Iconには180x180が推奨です。複数サイズを用意するとより多くの環境に対応できます。",
          },
          {
            question: "絵文字もファビコンに使えますか？",
            answer:
              "はい、このツールでは絵文字をそのままファビコンとして使えます。テキスト入力欄に絵文字を貼り付けるだけで、Canvas APIを使ってPNG画像として生成されます。",
          },
        ]}
      />

      <RelatedTools currentToolId="favicon-gen" />
    </div>
  );
}
