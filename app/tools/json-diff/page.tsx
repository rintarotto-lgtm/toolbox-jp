"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

type DiffType = "added" | "removed" | "changed" | "unchanged";

interface DiffEntry {
  path: string;
  type: DiffType;
  oldValue?: unknown;
  newValue?: unknown;
}

function deepDiff(
  obj1: unknown,
  obj2: unknown,
  path: string = ""
): DiffEntry[] {
  const results: DiffEntry[] = [];

  if (
    typeof obj1 !== "object" ||
    typeof obj2 !== "object" ||
    obj1 === null ||
    obj2 === null ||
    Array.isArray(obj1) !== Array.isArray(obj2)
  ) {
    if (JSON.stringify(obj1) !== JSON.stringify(obj2)) {
      results.push({ path: path || "(root)", type: "changed", oldValue: obj1, newValue: obj2 });
    }
    return results;
  }

  const keys1 = Object.keys(obj1 as Record<string, unknown>);
  const keys2 = Object.keys(obj2 as Record<string, unknown>);
  const allKeys = new Set([...keys1, ...keys2]);

  for (const key of allKeys) {
    const currentPath = path ? `${path}.${key}` : key;
    const o1 = obj1 as Record<string, unknown>;
    const o2 = obj2 as Record<string, unknown>;

    if (!(key in o1)) {
      results.push({ path: currentPath, type: "added", newValue: o2[key] });
    } else if (!(key in o2)) {
      results.push({ path: currentPath, type: "removed", oldValue: o1[key] });
    } else if (
      typeof o1[key] === "object" &&
      typeof o2[key] === "object" &&
      o1[key] !== null &&
      o2[key] !== null
    ) {
      results.push(...deepDiff(o1[key], o2[key], currentPath));
    } else if (JSON.stringify(o1[key]) !== JSON.stringify(o2[key])) {
      results.push({
        path: currentPath,
        type: "changed",
        oldValue: o1[key],
        newValue: o2[key],
      });
    }
  }

  return results;
}

function formatValue(v: unknown): string {
  if (typeof v === "string") return `"${v}"`;
  return JSON.stringify(v);
}

export default function JsonDiff() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");

  const result = useMemo(() => {
    if (!left.trim() || !right.trim()) return null;
    try {
      const obj1 = JSON.parse(left);
      const obj2 = JSON.parse(right);
      const diffs = deepDiff(obj1, obj2);
      return { diffs, error: null };
    } catch (e) {
      return { diffs: [], error: (e as Error).message };
    }
  }, [left, right]);

  const summary = useMemo(() => {
    if (!result || result.error) return null;
    const added = result.diffs.filter((d) => d.type === "added").length;
    const removed = result.diffs.filter((d) => d.type === "removed").length;
    const changed = result.diffs.filter((d) => d.type === "changed").length;
    return { added, removed, changed, total: added + removed + changed };
  }, [result]);

  const colorMap: Record<DiffType, string> = {
    added: "bg-green-50 border-green-300 text-green-800",
    removed: "bg-red-50 border-red-300 text-red-800",
    changed: "bg-yellow-50 border-yellow-300 text-yellow-800",
    unchanged: "",
  };

  const labelMap: Record<DiffType, string> = {
    added: "追加",
    removed: "削除",
    changed: "変更",
    unchanged: "",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">JSON比較</h1>
      <p className="text-gray-500 text-sm mb-6">
        2つのJSONデータを比較し、追加・削除・変更されたキーをハイライト表示します。
      </p>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              JSON A（比較元）
            </label>
            <textarea
              value={left}
              onChange={(e) => setLeft(e.target.value)}
              placeholder='{"name": "太郎", "age": 25}'
              className="w-full h-64 p-3 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              JSON B（比較先）
            </label>
            <textarea
              value={right}
              onChange={(e) => setRight(e.target.value)}
              placeholder='{"name": "太郎", "age": 26, "city": "東京"}'
              className="w-full h-64 p-3 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        {result?.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
            JSONの解析エラー: {result.error}
          </div>
        )}

        {summary && (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {summary.added}
              </div>
              <div className="text-xs text-gray-500 mt-1">追加</div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {summary.removed}
              </div>
              <div className="text-xs text-gray-500 mt-1">削除</div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {summary.changed}
              </div>
              <div className="text-xs text-gray-500 mt-1">変更</div>
            </div>
          </div>
        )}

        {result && !result.error && result.diffs.length === 0 && left.trim() && right.trim() && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700 text-center">
            差分はありません。2つのJSONは同一です。
          </div>
        )}

        {result && !result.error && result.diffs.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">差分一覧</h3>
            {result.diffs.map((d, i) => (
              <div
                key={i}
                className={`border rounded-lg p-3 text-sm ${colorMap[d.type]}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-xs px-2 py-0.5 rounded bg-white/60">
                    {labelMap[d.type]}
                  </span>
                  <span className="font-mono font-medium">{d.path}</span>
                </div>
                {d.type === "changed" && (
                  <div className="font-mono text-xs mt-1 space-y-0.5">
                    <div>
                      <span className="text-red-600">- {formatValue(d.oldValue)}</span>
                    </div>
                    <div>
                      <span className="text-green-600">+ {formatValue(d.newValue)}</span>
                    </div>
                  </div>
                )}
                {d.type === "added" && (
                  <div className="font-mono text-xs mt-1 text-green-600">
                    + {formatValue(d.newValue)}
                  </div>
                )}
                {d.type === "removed" && (
                  <div className="font-mono text-xs mt-1 text-red-600">
                    - {formatValue(d.oldValue)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <AdBanner />

      <section className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">JSON比較ツールの使い方</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          左右のテキストエリアにJSONデータを入力すると、自動的に差分を検出してハイライト表示します。
          追加されたキー（緑）、削除されたキー（赤）、変更されたキー（黄）が色分けされ、
          ネストされたオブジェクトも再帰的に比較します。API開発やデータ移行時の確認にご活用ください。
        </p>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "ネストされたJSONも比較できますか？",
            answer:
              "はい。オブジェクトや配列が深くネストされていても、再帰的にすべてのキーと値を比較します。差分のパスはドット記法（例: user.address.city）で表示されます。",
          },
          {
            question: "配列の比較はどのように行われますか？",
            answer:
              "配列はインデックスをキーとして比較します。要素の順序が異なる場合は変更として検出されます。要素の追加・削除もインデックス単位で表示します。",
          },
          {
            question: "大きなJSONデータも比較できますか？",
            answer:
              "ブラウザ上で処理するため、通常のJSONデータであれば問題なく比較できます。ただし、数万行を超える非常に大きなJSONの場合はブラウザの性能に依存します。",
          },
          {
            question: "入力データはサーバーに送信されますか？",
            answer:
              "いいえ。すべての処理はブラウザ上で完結するため、入力データがサーバーに送信されることは一切ありません。",
          },
        ]}
      />

      <RelatedTools currentToolId="json-diff" />
    </div>
  );
}
