"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  return decodeURIComponent(atob(padded).split("").map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join(""));
}

function formatDate(ts: number): string {
  return new Date(ts * 1000).toLocaleString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default function JwtDecoderTool() {
  const [token, setToken] = useState("");

  let header: Record<string, unknown> | null = null;
  let payload: Record<string, unknown> | null = null;
  let signature = "";
  let error = "";

  if (token.trim()) {
    try {
      const parts = token.trim().split(".");
      if (parts.length !== 3) throw new Error("JWTは3つのパートで構成される必要があります");
      header = JSON.parse(base64UrlDecode(parts[0]));
      payload = JSON.parse(base64UrlDecode(parts[1]));
      signature = parts[2];
    } catch (e) {
      error = e instanceof Error ? e.message : "無効なJWTトークンです";
      header = null;
      payload = null;
    }
  }

  const exp = payload?.exp as number | undefined;
  const iat = payload?.iat as number | undefined;
  const isExpired = exp ? Date.now() / 1000 > exp : false;
  const copy = (text: string) => navigator.clipboard.writeText(text);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">JWTデコーダー</h1>
      <p className="text-gray-500 text-sm mb-6">JWTトークンをHeader・Payload・Signatureに分解してデコード表示。有効期限も確認。</p>

      <AdBanner />

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">JWTトークン</label>
          <textarea value={token} onChange={(e) => setToken(e.target.value)} placeholder="eyJhbGciOiJIUzI1NiIs..." className="w-full h-28 p-3 border border-gray-300 rounded-lg font-mono text-xs resize-y focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

        {header && (
          <div className="space-y-3">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-blue-600 uppercase">Header</span>
                <button onClick={() => copy(JSON.stringify(header, null, 2))} className="text-xs text-blue-600 hover:underline">コピー</button>
              </div>
              <pre className="text-xs font-mono text-gray-800 whitespace-pre-wrap bg-gray-50 p-3 rounded">{JSON.stringify(header, null, 2)}</pre>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-purple-600 uppercase">Payload</span>
                <button onClick={() => copy(JSON.stringify(payload, null, 2))} className="text-xs text-blue-600 hover:underline">コピー</button>
              </div>
              <pre className="text-xs font-mono text-gray-800 whitespace-pre-wrap bg-gray-50 p-3 rounded">{JSON.stringify(payload, null, 2)}</pre>
              {(exp || iat) && (
                <div className="mt-3 space-y-1 text-xs">
                  {iat && <p className="text-gray-600">発行日時 (iat): <span className="font-mono">{formatDate(iat)}</span></p>}
                  {exp && <p className={isExpired ? "text-red-600 font-bold" : "text-green-600"}>有効期限 (exp): <span className="font-mono">{formatDate(exp)}</span>{isExpired ? " — 期限切れ" : " — 有効"}</p>}
                </div>
              )}
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <span className="text-xs font-bold text-orange-600 uppercase block mb-2">Signature</span>
              <p className="text-xs font-mono text-gray-600 break-all bg-gray-50 p-3 rounded">{signature}</p>
            </div>
          </div>
        )}
      </div>

      <ToolFAQ faqs={[
        { question: "JWTとは何ですか？", answer: "JWT（JSON Web Token）は、2つのシステム間で安全に情報を送受信するための規格です。ヘッダー、ペイロード、署名の3部分で構成され、認証やAPI通信で広く使用されます。" },
        { question: "JWTのデコードは安全ですか？", answer: "このツールはブラウザ上でのみ動作し、トークンはサーバーに送信されません。ただし、JWTのペイロードは暗号化されていないため、機密情報を含むトークンの取り扱いには注意してください。" },
        { question: "JWTの署名検証はできますか？", answer: "このツールではデコード（内容の確認）のみ対応しています。署名の検証には秘密鍵が必要なため、サーバー側で行ってください。" },
      ]} />
      <AdBanner />
      <RelatedTools currentToolId="jwt-decoder" />
    </div>
  );
}
