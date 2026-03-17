"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

const labels = ["読み取り (r)", "書き込み (w)", "実行 (x)"];
const bits = [4, 2, 1];
const groups = ["所有者 (Owner)", "グループ (Group)", "その他 (Others)"];

const presets = [
  { value: "777", desc: "全権限（危険）" },
  { value: "755", desc: "標準ディレクトリ" },
  { value: "750", desc: "グループ読み取り可" },
  { value: "700", desc: "所有者のみ" },
  { value: "664", desc: "グループ書き込み可" },
  { value: "644", desc: "標準ファイル" },
  { value: "600", desc: "所有者のみ読み書き" },
  { value: "400", desc: "所有者読み取りのみ" },
];

export default function ChmodCalc() {
  const [perms, setPerms] = useState([true, true, true, true, false, true, true, false, true]); // 755
  const [copied, setCopied] = useState("");

  const getOctal = () => {
    let result = "";
    for (let g = 0; g < 3; g++) {
      let val = 0;
      for (let b = 0; b < 3; b++) if (perms[g * 3 + b]) val += bits[b];
      result += val;
    }
    return result;
  };

  const getSymbolic = () => {
    const chars = ["r", "w", "x"];
    return perms.map((p, i) => (p ? chars[i % 3] : "-")).join("");
  };

  const toggle = (index: number) => {
    const next = [...perms];
    next[index] = !next[index];
    setPerms(next);
  };

  const applyOctal = (octal: string) => {
    const next = new Array(9).fill(false);
    for (let g = 0; g < 3; g++) {
      const val = parseInt(octal[g], 10);
      if (isNaN(val)) return;
      if (val & 4) next[g * 3] = true;
      if (val & 2) next[g * 3 + 1] = true;
      if (val & 1) next[g * 3 + 2] = true;
    }
    setPerms(next);
  };

  const octal = getOctal();
  const symbolic = getSymbolic();
  const copy = (text: string, key: string) => { navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(""), 1500); };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">Chmod計算機</h1>
      <p className="text-gray-500 text-sm mb-6">Linuxファイルパーミッションを数値⇔シンボル形式で変換。</p>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 text-gray-600 w-40"></th>
                {labels.map((l) => <th key={l} className="text-center py-2 text-gray-600 px-3">{l}</th>)}
              </tr>
            </thead>
            <tbody>
              {groups.map((g, gi) => (
                <tr key={g} className="border-b border-gray-100">
                  <td className="py-3 font-medium text-gray-700">{g}</td>
                  {[0, 1, 2].map((bi) => (
                    <td key={bi} className="text-center py-3">
                      <input type="checkbox" checked={perms[gi * 3 + bi]} onChange={() => toggle(gi * 3 + bi)} className="w-5 h-5 accent-blue-600 cursor-pointer" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">数値形式</div>
            <div className="flex items-center gap-2">
              <code className="text-2xl font-bold font-mono text-gray-900">{octal}</code>
              <button onClick={() => copy(octal, "oct")} className="text-xs text-blue-600 hover:underline">{copied === "oct" ? "OK!" : "コピー"}</button>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">シンボル形式</div>
            <div className="flex items-center gap-2">
              <code className="text-2xl font-bold font-mono text-gray-900">-{symbolic}</code>
              <button onClick={() => copy(`-${symbolic}`, "sym")} className="text-xs text-blue-600 hover:underline">{copied === "sym" ? "OK!" : "コピー"}</button>
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="text-xs text-gray-500 mb-1">コマンド</div>
          <div className="flex items-center gap-2">
            <code className="font-mono text-sm text-gray-900">chmod {octal} filename</code>
            <button onClick={() => copy(`chmod ${octal} filename`, "cmd")} className="text-xs text-blue-600 hover:underline">{copied === "cmd" ? "OK!" : "コピー"}</button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">プリセット</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {presets.map((p) => (
              <button key={p.value} onClick={() => applyOctal(p.value)} className={`p-2 rounded-lg border text-sm text-left ${octal === p.value ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"}`}>
                <span className="font-mono font-bold">{p.value}</span>
                <span className="block text-xs text-gray-500">{p.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <AdBanner />

      <ToolFAQ faqs={[
        { question: "chmod 755と644の違いは？", answer: "755は所有者が全権限、グループとその他が読み取り・実行可能です。主にディレクトリやスクリプトに使用します。644は所有者が読み書き、グループとその他が読み取りのみで、一般的なファイルに適しています。" },
        { question: "chmod 777が危険な理由は？", answer: "全ユーザーが読み書き・実行できるため、悪意のあるユーザーがファイルを改ざんできます。本番環境では絶対に使用を避け、最小権限の原則に従いましょう。" },
        { question: "数値とシンボル形式の使い分けは？", answer: "数値形式（755等）は簡潔で一括設定に便利です。シンボル形式（u+x等）は特定の権限だけを追加・削除する場合に便利です。" },
      ]} />

      <RelatedTools currentToolId="chmod-calc" />
    </div>
  );
}
