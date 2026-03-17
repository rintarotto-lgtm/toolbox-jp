"use client";

import { useState, useRef } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

export default function ImageBase64() {
  const [base64, setBase64] = useState("");
  const [dataUri, setDataUri] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [imgPreview, setImgPreview] = useState("");
  const [copied, setCopied] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setFileName(file.name);
    setFileSize(file.size);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setDataUri(result);
      setImgPreview(result);
      setBase64(result.split(",")[1] || "");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) handleFile(file);
        break;
      }
    }
  };

  const copy = (text: string, key: string) => { navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(""), 1500); };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const htmlSnippet = dataUri ? `<img src="${dataUri.substring(0, 60)}..." alt="">` : "";
  const cssSnippet = dataUri ? `background-image: url(${dataUri.substring(0, 60)}...);` : "";

  return (
    <div className="max-w-3xl mx-auto px-4 py-10" onPaste={handlePaste}>
      <h1 className="text-2xl font-bold mb-2">画像Base64変換</h1>
      <p className="text-gray-500 text-sm mb-6">画像をBase64に変換。Data URI形式でHTMLやCSSに埋め込み。</p>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
        >
          <input ref={fileRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} className="hidden" />
          <div className="text-gray-400 text-4xl mb-2">📁</div>
          <p className="text-sm text-gray-600">クリックまたはドラッグ&ドロップで画像を選択</p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPEG, GIF, SVG, WebP対応 / Ctrl+Vで貼り付けも可能</p>
        </div>

        {imgPreview && (
          <>
            <div className="flex items-start gap-4">
              <div className="w-32 h-32 border border-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                <img src={imgPreview} alt="Preview" className="w-full h-full object-contain" />
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">ファイル名:</span> {fileName}</p>
                <p><span className="font-medium">元サイズ:</span> {formatSize(fileSize)}</p>
                <p><span className="font-medium">Base64サイズ:</span> {formatSize(base64.length)} (~{((base64.length / fileSize - 1) * 100).toFixed(0)}%増)</p>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-gray-700">Data URI</label>
                <button onClick={() => copy(dataUri, "uri")} className="text-xs text-blue-600">{copied === "uri" ? "OK!" : "コピー"}</button>
              </div>
              <textarea readOnly value={dataUri} className="w-full h-24 p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono resize-y" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-gray-700">Base64文字列</label>
                <button onClick={() => copy(base64, "b64")} className="text-xs text-blue-600">{copied === "b64" ? "OK!" : "コピー"}</button>
              </div>
              <textarea readOnly value={base64} className="w-full h-24 p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono resize-y" />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-gray-500">HTML</span>
                  <button onClick={() => copy(`<img src="${dataUri}" alt="">`, "html")} className="text-xs text-blue-600">{copied === "html" ? "OK!" : "コピー"}</button>
                </div>
                <code className="text-xs font-mono text-gray-700 break-all">{htmlSnippet}</code>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-gray-500">CSS</span>
                  <button onClick={() => copy(`background-image: url(${dataUri});`, "css")} className="text-xs text-blue-600">{copied === "css" ? "OK!" : "コピー"}</button>
                </div>
                <code className="text-xs font-mono text-gray-700 break-all">{cssSnippet}</code>
              </div>
            </div>
          </>
        )}
      </div>

      <AdBanner />

      <ToolFAQ faqs={[
        { question: "画像のBase64変換のメリットは？", answer: "HTTPリクエストを減らしてページの表示速度を向上できます。特に小さなアイコンやロゴをCSS/HTMLに直接埋め込む場合に効果的です。" },
        { question: "Base64変換のデメリットは？", answer: "Base64はバイナリデータより約33%サイズが大きくなります。大きな画像にはファイル参照の方が効率的です。また、キャッシュが効かないため繰り返しの読み込みに不利です。" },
        { question: "どのサイズの画像に使うべき？", answer: "一般的に10KB以下の小さな画像（アイコン、シンプルなロゴ等）に適しています。それ以上の場合は通常のファイル参照やWebP形式の利用を検討してください。" },
      ]} />

      <RelatedTools currentToolId="image-base64" />
    </div>
  );
}
