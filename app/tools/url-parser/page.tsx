"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

interface ParsedUrl {
  protocol: string; host: string; hostname: string; port: string;
  pathname: string; search: string; hash: string; origin: string;
  params: [string, string][];
}

function parseUrl(raw: string): ParsedUrl | null {
  try {
    const u = new URL(raw);
    const params: [string, string][] = [];
    u.searchParams.forEach((v, k) => params.push([k, v]));
    return { protocol: u.protocol, host: u.host, hostname: u.hostname, port: u.port, pathname: u.pathname, search: u.search, hash: u.hash, origin: u.origin, params };
  } catch { return null; }
}

export default function UrlParser() {
  const [input, setInput] = useState("https://example.com:8080/path/to/page?name=value&lang=ja#section1");
  const [copied, setCopied] = useState("");

  const parsed = parseUrl(input);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 1500);
  };

  const rows = parsed ? [
    ["Protocol", parsed.protocol],
    ["Host", parsed.host],
    ["Hostname", parsed.hostname],
    ["Port", parsed.port || "(デフォルト)"],
    ["Origin", parsed.origin],
    ["Pathname", parsed.pathname],
    ["Search", parsed.search || "(なし)"],
    ["Hash", parsed.hash || "(なし)"],
  ] : [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">URL解析ツール</h1>
      <p className="text-gray-500 text-sm mb-6">URLを構成要素に分解して表示。クエリパラメータも一覧化。</p>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="https://example.com/path?key=value#hash" className="w-full p-4 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

        {!parsed && input.trim() && <p className="text-red-500 text-sm">有効なURLを入力してください</p>}

        {parsed && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody>
                  {rows.map(([label, value]) => (
                    <tr key={label} className="border-b border-gray-100">
                      <td className="py-2 pr-4 font-medium text-gray-600 whitespace-nowrap w-32">{label}</td>
                      <td className="py-2 font-mono text-gray-900 break-all">{value}</td>
                      <td className="py-2 pl-2 w-16">
                        <button onClick={() => copy(value, label)} className="text-xs text-blue-600 hover:underline">{copied === label ? "OK!" : "コピー"}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {parsed.params.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">クエリパラメータ ({parsed.params.length})</h3>
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-gray-200"><th className="text-left py-2 text-gray-500">Key</th><th className="text-left py-2 text-gray-500">Value</th></tr></thead>
                  <tbody>
                    {parsed.params.map(([k, v], i) => (
                      <tr key={i} className="border-b border-gray-100">
                        <td className="py-2 pr-4 font-mono text-blue-700">{k}</td>
                        <td className="py-2 font-mono text-gray-900 break-all">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      <AdBanner />

      <ToolFAQ faqs={[
        { question: "URLの構成要素とは？", answer: "URLはプロトコル（https:）、ホスト名（example.com）、ポート番号、パス（/path）、クエリパラメータ（?key=value）、フラグメント（#section）で構成されます。" },
        { question: "クエリパラメータとは？", answer: "URLの?以降にkey=value形式で付与される追加情報です。複数ある場合は&で区切られます。検索条件やフィルター、トラッキングパラメータなどに使われます。" },
        { question: "フラグメント（#）の役割は？", answer: "フラグメントはページ内の特定セクションを指定するもので、サーバーには送信されません。ブラウザ側でのページ内ナビゲーションに使用されます。" },
      ]} />

      <RelatedTools currentToolId="url-parser" />
    </div>
  );
}
