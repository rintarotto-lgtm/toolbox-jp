"use client";

import { useState, useRef, useCallback } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

type OutputFormat = "image/png" | "image/jpeg" | "image/webp";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

export default function ImageResizeTool() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lockAspect, setLockAspect] = useState(true);
  const [quality, setQuality] = useState(85);
  const [format, setFormat] = useState<OutputFormat>("image/jpeg");
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const [resizedSize, setResizedSize] = useState(0);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const aspectRatio = useRef(1);

  const loadImage = useCallback((file: File) => {
    setOriginalSize(file.size);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setOriginalImage(dataUrl);
      setResizedImage(null);

      const img = new Image();
      img.onload = () => {
        setOriginalWidth(img.width);
        setOriginalHeight(img.height);
        setWidth(img.width);
        setHeight(img.height);
        aspectRatio.current = img.width / img.height;
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) loadImage(file);
    },
    [loadImage]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) loadImage(file);
    },
    [loadImage]
  );

  const handleWidthChange = (v: number) => {
    setWidth(v);
    if (lockAspect) setHeight(Math.round(v / aspectRatio.current));
  };

  const handleHeightChange = (v: number) => {
    setHeight(v);
    if (lockAspect) setWidth(Math.round(v * aspectRatio.current));
  };

  const resize = () => {
    if (!originalImage) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);

      const q = format === "image/png" ? undefined : quality / 100;
      const dataUrl = canvas.toDataURL(format, q);
      setResizedImage(dataUrl);

      // Calculate size from base64
      const base64 = dataUrl.split(",")[1];
      const byteLength = Math.round((base64.length * 3) / 4);
      setResizedSize(byteLength);
    };
    img.src = originalImage;
  };

  const download = () => {
    if (!resizedImage) return;
    const ext = format === "image/png" ? "png" : format === "image/jpeg" ? "jpg" : "webp";
    const link = document.createElement("a");
    link.download = `resized.${ext}`;
    link.href = resizedImage;
    link.click();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">画像リサイズ</h1>
      <p className="text-gray-500 text-sm mb-6">
        画像のサイズ変更・圧縮をブラウザ上で完結。すべてクライアント側で処理。
      </p>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        {/* Drop zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            dragging
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 hover:border-blue-300 hover:bg-gray-50"
          }`}
        >
          <p className="text-sm text-gray-500">
            画像をドラッグ＆ドロップ、またはクリックして選択
          </p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPEG, WebP, GIF対応</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {originalImage && (
          <>
            {/* Original info */}
            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 flex flex-wrap gap-4">
              <span>元のサイズ: {originalWidth} x {originalHeight}px</span>
              <span>ファイルサイズ: {formatBytes(originalSize)}</span>
            </div>

            {/* Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">幅（px）</label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => handleWidthChange(Number(e.target.value))}
                  min={1}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">高さ（px）</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => handleHeightChange(Number(e.target.value))}
                  min={1}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={lockAspect}
                onChange={(e) => setLockAspect(e.target.checked)}
                className="rounded"
              />
              アスペクト比を維持
            </label>

            {/* Format */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">出力フォーマット</label>
              <div className="flex gap-2">
                {(
                  [
                    { value: "image/jpeg", label: "JPEG" },
                    { value: "image/png", label: "PNG" },
                    { value: "image/webp", label: "WebP" },
                  ] as const
                ).map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFormat(f.value)}
                    className={`px-4 py-2 rounded-lg text-sm border ${
                      format === f.value
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quality slider (not for PNG) */}
            {format !== "image/png" && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  品質: {quality}%
                </label>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>低品質・小サイズ</span>
                  <span>高品質・大サイズ</span>
                </div>
              </div>
            )}

            {/* Resize button */}
            <button
              onClick={resize}
              className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              リサイズ実行
            </button>

            {/* Result */}
            {resizedImage && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700 mb-2">変換前</p>
                    <div className="border border-gray-200 rounded-lg p-2 bg-gray-50">
                      <img
                        src={originalImage}
                        alt="Original"
                        className="max-h-48 mx-auto object-contain"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {originalWidth}x{originalHeight} / {formatBytes(originalSize)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700 mb-2">変換後</p>
                    <div className="border border-gray-200 rounded-lg p-2 bg-gray-50">
                      <img
                        src={resizedImage}
                        alt="Resized"
                        className="max-h-48 mx-auto object-contain"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {width}x{height} / {formatBytes(resizedSize)}
                    </p>
                  </div>
                </div>

                {/* Size comparison */}
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <span className="text-sm text-gray-600">
                    ファイルサイズ:{" "}
                    <span className="font-medium">{formatBytes(originalSize)}</span>
                    {" → "}
                    <span className="font-medium">{formatBytes(resizedSize)}</span>
                    {resizedSize < originalSize && (
                      <span className="text-green-600 font-medium ml-2">
                        ({Math.round((1 - resizedSize / originalSize) * 100)}% 削減)
                      </span>
                    )}
                    {resizedSize >= originalSize && (
                      <span className="text-orange-600 font-medium ml-2">
                        (+{Math.round((resizedSize / originalSize - 1) * 100)}% 増加)
                      </span>
                    )}
                  </span>
                </div>

                <button
                  onClick={download}
                  className="w-full py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                >
                  ダウンロード
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <AdBanner />

      <ToolFAQ
        faqs={[
          {
            question: "画像データはどこに送信されますか？",
            answer:
              "このツールはすべての処理をブラウザ上（クライアントサイド）で行います。画像データはサーバーに送信されず、完全にローカルで処理されるため安全です。",
          },
          {
            question: "JPEG・PNG・WebPの違いは？",
            answer:
              "JPEGは写真向きで圧縮率が高く、PNGは透明度対応で可逆圧縮、WebPはJPEG/PNG両方の利点を持つ次世代フォーマットです。Webで使う場合はWebPが最もファイルサイズが小さくなることが多いです。",
          },
          {
            question: "品質スライダーはどう設定すればよいですか？",
            answer:
              "Web用の画像であれば品質70〜85%程度が見た目と圧縮のバランスが良い設定です。印刷用途であれば90%以上を推奨します。PNGは可逆圧縮のため品質設定は適用されません。",
          },
        ]}
      />

      <RelatedTools currentToolId="image-resize" />
    </div>
  );
}
