"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

// ─── 定数
const CATEGORIES = [
  "交通費",
  "宿泊費",
  "食費・会議費",
  "消耗品",
  "通信費",
  "接待費",
  "その他",
] as const;

type Category = (typeof CATEGORIES)[number];
type TaxRate = "10" | "8" | "0";

interface ExpenseRow {
  id: number;
  date: string;
  category: Category;
  description: string;
  amount: number;
  taxRate: TaxRate;
  note: string;
}

const TAX_LABELS: Record<TaxRate, string> = {
  "10": "10%",
  "8": "8%（軽減）",
  "0": "非課税",
};

const CATEGORY_COLORS: Record<Category, string> = {
  交通費: "bg-blue-100 text-blue-700",
  宿泊費: "bg-purple-100 text-purple-700",
  "食費・会議費": "bg-orange-100 text-orange-700",
  消耗品: "bg-yellow-100 text-yellow-700",
  通信費: "bg-cyan-100 text-cyan-700",
  接待費: "bg-pink-100 text-pink-700",
  その他: "bg-gray-100 text-gray-700",
};

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

let nextId = 4;

function makeRow(overrides?: Partial<ExpenseRow>): ExpenseRow {
  return {
    id: nextId++,
    date: today(),
    category: "交通費",
    description: "",
    amount: 0,
    taxRate: "10",
    note: "",
    ...overrides,
  };
}

const FAQS = [
  {
    question: "経費として認められるものは何ですか？",
    answer:
      "事業に関連する支出が経費になります。交通費・宿泊費・会議費・通信費・消耗品費・広告宣伝費などが代表例です。プライベートとの按分が必要なものもあります。",
  },
  {
    question: "レシートなしでも経費計上できますか？",
    answer:
      "3万円未満の交通費（バス・電車）など領収書の取得が困難なものは出金伝票での代替が認められる場合があります。ただし原則として領収書・レシートの保管が必要です。",
  },
  {
    question: "自宅兼事務所の家賃は経費になりますか？",
    answer:
      "個人事業主・フリーランスは自宅の使用面積按分で家賃の一部を経費にできます。例えば30㎡の部屋で仕事用スペース6㎡なら20%が経費算入可能です。",
  },
  {
    question: "経費の領収書はいつまで保管が必要ですか？",
    answer:
      "法人は7年間（青色申告の欠損金がある場合は10年）、個人事業主は5年間の保管が義務付けられています。電子保存も法的に認められています。",
  },
];

function formatYen(n: number): string {
  return `¥${Math.round(n).toLocaleString("ja-JP")}`;
}

export default function BusinessExpense() {
  const [periodStart, setPeriodStart] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .slice(0, 10)
  );
  const [periodEnd, setPeriodEnd] = useState(today());
  const [submitterName, setSubmitterName] = useState("");
  const [rows, setRows] = useState<ExpenseRow[]>([
    makeRow({ id: 1, category: "交通費", description: "電車代（往復）", amount: 1_200, taxRate: "0" }),
    makeRow({ id: 2, category: "食費・会議費", description: "打ち合わせランチ", amount: 3_500, taxRate: "10" }),
    makeRow({ id: 3, category: "消耗品", description: "文具購入", amount: 800, taxRate: "10" }),
  ]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // ─── 行操作
  function updateRow<K extends keyof ExpenseRow>(
    id: number,
    key: K,
    value: ExpenseRow[K]
  ) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [key]: value } : r))
    );
  }

  function addRow() {
    setRows((prev) => [...prev, makeRow()]);
  }

  function removeRow(id: number) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  // ─── 集計
  const summary = useMemo(() => {
    const total = rows.reduce((s, r) => s + r.amount, 0);

    const tax10Base = rows
      .filter((r) => r.taxRate === "10")
      .reduce((s, r) => s + r.amount, 0);
    const tax8Base = rows
      .filter((r) => r.taxRate === "8")
      .reduce((s, r) => s + r.amount, 0);
    const taxFreeBase = rows
      .filter((r) => r.taxRate === "0")
      .reduce((s, r) => s + r.amount, 0);

    // 税込金額から税額を逆算 (税込 = 税抜 × (1 + rate) → 税額 = 税込 × rate / (1+rate))
    const tax10Amount = Math.round(tax10Base * 10 / 110);
    const tax8Amount = Math.round(tax8Base * 8 / 108);

    // カテゴリ別
    const byCategory: Record<string, number> = {};
    for (const r of rows) {
      byCategory[r.category] = (byCategory[r.category] ?? 0) + r.amount;
    }

    return {
      total,
      tax10Base,
      tax8Base,
      taxFreeBase,
      tax10Amount,
      tax8Amount,
      byCategory,
    };
  }, [rows]);

  // ─── CSV ダウンロード
  function downloadCsv() {
    const header = ["日付", "カテゴリ", "内容", "金額", "税率", "備考"];
    const csvRows = rows.map((r) =>
      [
        r.date,
        r.category,
        `"${r.description}"`,
        r.amount,
        TAX_LABELS[r.taxRate],
        `"${r.note}"`,
      ].join(",")
    );
    const csv = [header.join(","), ...csvRows].join("\n");
    const bom = "\uFEFF";
    const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `経費精算_${periodStart}_${periodEnd}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* ─── ヘッダー ─── */}
      <div className="bg-gradient-to-br from-slate-600 to-gray-700 rounded-2xl p-6 mb-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🧾</span>
          <div>
            <h1 className="text-2xl font-extrabold">経費精算計算</h1>
            <p className="text-sm opacity-90">
              交通費・日当・領収書の合計を自動集計
            </p>
          </div>
        </div>
      </div>

      <AdBanner />

      {/* ─── 精算期間・提出者 ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-base font-bold text-gray-800 mb-4">精算情報</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              開始日
            </label>
            <input
              type="date"
              value={periodStart}
              onChange={(e) => setPeriodStart(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              終了日
            </label>
            <input
              type="date"
              value={periodEnd}
              onChange={(e) => setPeriodEnd(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              氏名
            </label>
            <input
              type="text"
              placeholder="山田 太郎"
              value={submitterName}
              onChange={(e) => setSubmitterName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>
        </div>
      </div>

      {/* ─── 経費入力テーブル ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-800">経費項目</h2>
          <span className="text-sm text-gray-500">{rows.length}件</span>
        </div>

        {/* ヘッダー（デスクトップ） */}
        <div className="hidden sm:grid grid-cols-[90px_100px_1fr_100px_90px_80px] gap-2 text-xs text-gray-500 font-medium mb-2 px-1">
          <span>日付</span>
          <span>カテゴリ</span>
          <span>内容</span>
          <span className="text-right">金額（円）</span>
          <span>税率</span>
          <span>削除</span>
        </div>

        <div className="space-y-3">
          {rows.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-1 sm:grid-cols-[90px_100px_1fr_100px_90px_80px] gap-2 items-center bg-gray-50 rounded-xl p-3 sm:p-2"
            >
              {/* 日付 */}
              <input
                type="date"
                value={row.date}
                onChange={(e) => updateRow(row.id, "date", e.target.value)}
                className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs w-full focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white"
              />
              {/* カテゴリ */}
              <select
                value={row.category}
                onChange={(e) =>
                  updateRow(row.id, "category", e.target.value as Category)
                }
                className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs w-full focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {/* 内容 */}
              <input
                type="text"
                placeholder="内容を入力"
                value={row.description}
                onChange={(e) =>
                  updateRow(row.id, "description", e.target.value)
                }
                className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs w-full focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white"
              />
              {/* 金額 */}
              <input
                type="number"
                min={0}
                value={row.amount === 0 ? "" : row.amount}
                placeholder="0"
                onChange={(e) =>
                  updateRow(row.id, "amount", Number(e.target.value) || 0)
                }
                className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-right w-full focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white"
              />
              {/* 税率 */}
              <select
                value={row.taxRate}
                onChange={(e) =>
                  updateRow(row.id, "taxRate", e.target.value as TaxRate)
                }
                className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs w-full focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white"
              >
                <option value="10">10%</option>
                <option value="8">8%（軽）</option>
                <option value="0">非課税</option>
              </select>
              {/* 削除 */}
              <div className="flex justify-end sm:justify-center">
                <button
                  onClick={() => removeRow(row.id)}
                  disabled={rows.length <= 1}
                  className="text-gray-400 hover:text-red-500 disabled:opacity-30 text-lg font-bold px-2 transition-colors"
                  aria-label="削除"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 行追加 */}
        <button
          onClick={addRow}
          className="mt-4 w-full border-2 border-dashed border-gray-300 rounded-xl py-3 text-sm text-gray-500 hover:border-slate-400 hover:text-slate-600 transition-colors font-medium"
        >
          ＋ 行を追加
        </button>
      </div>

      {/* ─── 合計カード ─── */}
      <div className="bg-gradient-to-br from-slate-600 to-gray-700 rounded-2xl p-6 mb-6 text-white shadow-lg">
        <p className="text-sm font-medium opacity-90 mb-1">経費合計</p>
        <p className="text-5xl font-extrabold tracking-tight mb-1">
          {formatYen(summary.total)}
        </p>
        <p className="text-sm opacity-75 mb-4">{rows.length}件の経費</p>
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/30 text-center">
          <div>
            <p className="text-xs opacity-75">10%対象</p>
            <p className="text-lg font-bold">{formatYen(summary.tax10Base)}</p>
            <p className="text-xs opacity-60">
              税額 {formatYen(summary.tax10Amount)}
            </p>
          </div>
          <div>
            <p className="text-xs opacity-75">8%（軽減）対象</p>
            <p className="text-lg font-bold">{formatYen(summary.tax8Base)}</p>
            <p className="text-xs opacity-60">
              税額 {formatYen(summary.tax8Amount)}
            </p>
          </div>
          <div>
            <p className="text-xs opacity-75">非課税</p>
            <p className="text-lg font-bold">
              {formatYen(summary.taxFreeBase)}
            </p>
          </div>
        </div>
      </div>

      {/* ─── カテゴリ別集計 ─── */}
      {Object.keys(summary.byCategory).length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-4">
            カテゴリ別集計
          </h2>
          <div className="space-y-3">
            {Object.entries(summary.byCategory)
              .sort(([, a], [, b]) => b - a)
              .map(([cat, amt]) => {
                const pct =
                  summary.total > 0
                    ? Math.round((amt / summary.total) * 100)
                    : 0;
                const colorClass =
                  CATEGORY_COLORS[cat as Category] ?? "bg-gray-100 text-gray-700";
                return (
                  <div key={cat} className="flex items-center gap-3">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full w-24 text-center shrink-0 ${colorClass}`}
                    >
                      {cat}
                    </span>
                    <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-slate-500 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-800 w-28 text-right shrink-0">
                      {formatYen(amt)}
                      <span className="text-xs text-gray-400 ml-1">
                        ({pct}%)
                      </span>
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ─── 提出用サマリー ─── */}
      <div
        className="bg-white border-2 border-gray-300 rounded-2xl p-6 mb-6 shadow-sm print:border-black"
        id="print-summary"
      >
        <h2 className="text-base font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
          経費精算書（提出用）
        </h2>
        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
          <div>
            <span className="text-gray-500">提出者:</span>{" "}
            <strong>{submitterName || "（未入力）"}</strong>
          </div>
          <div>
            <span className="text-gray-500">精算期間:</span>{" "}
            <strong>
              {periodStart} 〜 {periodEnd}
            </strong>
          </div>
          <div>
            <span className="text-gray-500">件数:</span>{" "}
            <strong>{rows.length}件</strong>
          </div>
          <div>
            <span className="text-gray-500">作成日:</span>{" "}
            <strong>{today()}</strong>
          </div>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-500 mb-1">合計請求額</p>
          <p className="text-4xl font-extrabold text-slate-800">
            {formatYen(summary.total)}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            （うち消費税: {formatYen(summary.tax10Amount + summary.tax8Amount)}）
          </p>
        </div>
        {/* 明細テーブル（印刷用） */}
        <table className="w-full text-xs mt-4 border-collapse">
          <thead>
            <tr className="border-b border-gray-300 text-gray-600">
              <th className="text-left py-1.5 px-2">日付</th>
              <th className="text-left py-1.5 px-2">カテゴリ</th>
              <th className="text-left py-1.5 px-2">内容</th>
              <th className="text-right py-1.5 px-2">金額</th>
              <th className="text-center py-1.5 px-2">税率</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-gray-100">
                <td className="py-1.5 px-2 text-gray-700">{r.date}</td>
                <td className="py-1.5 px-2 text-gray-700">{r.category}</td>
                <td className="py-1.5 px-2 text-gray-700">
                  {r.description || "—"}
                </td>
                <td className="py-1.5 px-2 text-right font-semibold text-gray-800">
                  {formatYen(r.amount)}
                </td>
                <td className="py-1.5 px-2 text-center text-gray-600">
                  {TAX_LABELS[r.taxRate]}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-400">
              <td
                colSpan={3}
                className="py-2 px-2 text-right font-bold text-gray-800"
              >
                合計
              </td>
              <td className="py-2 px-2 text-right font-extrabold text-slate-800">
                {formatYen(summary.total)}
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>

      {/* ─── ボタン ─── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <button
          onClick={() => window.print()}
          className="flex-1 bg-slate-700 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
        >
          🖨️ 印刷する
        </button>
        <button
          onClick={downloadCsv}
          className="flex-1 bg-white hover:bg-gray-50 text-slate-700 font-semibold py-3 rounded-xl border-2 border-slate-400 transition-colors text-sm"
        >
          📥 CSVダウンロード
        </button>
      </div>

      <AdBanner />

      {/* ─── FAQ ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="border-b border-gray-100 pb-3 last:border-0 last:pb-0"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left flex justify-between items-center text-sm font-semibold text-gray-800 hover:text-slate-600 transition-colors"
              >
                <span>{faq.question}</span>
                <span className="text-gray-400 ml-2 shrink-0 text-base">
                  {openFaq === i ? "−" : "＋"}
                </span>
              </button>
              {openFaq === i && (
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <RelatedTools currentToolId="business-expense" />

      {/* ─── 免責事項 ─── */}
      <p className="text-xs text-gray-400 leading-relaxed mt-4">
        ※ このツールは参考用の簡易計算です。実際の経費計上・税額については税理士・会計士にご確認ください。
        消費税の計算は税込金額からの逆算（内税計算）です。
        なお、このツールはブラウザ上で完結し、入力情報がサーバーに送信されることは一切ありません。
      </p>
    </div>
  );
}
