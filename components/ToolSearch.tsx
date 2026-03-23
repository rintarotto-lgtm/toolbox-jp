"use client";

import { useState, useMemo } from "react";
import ToolCard from "@/components/ToolCard";
import type { Tool } from "@/lib/tools";

const categories = [
  { key: "all", label: "すべて", icon: "🔧" },
  { key: "フリマ", label: "フリマ", icon: "💰" },
  { key: "お金", label: "お金", icon: "📊" },
  { key: "推し活", label: "推し活", icon: "🎤" },
  { key: "テキスト", label: "テキスト", icon: "📝" },
  { key: "開発", label: "開発", icon: "💻" },
  { key: "デザイン", label: "デザイン", icon: "🎨" },
  { key: "計算", label: "計算", icon: "🔢" },
  { key: "セキュリティ", label: "セキュリティ", icon: "🔒" },
  { key: "画像", label: "画像", icon: "🖼" },
];

export default function ToolSearch({ tools }: { tools: Tool[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = useMemo(() => {
    return tools.filter((tool) => {
      const matchCategory = activeCategory === "all" || tool.category === activeCategory;
      if (!query.trim()) return matchCategory;
      const q = query.toLowerCase();
      const matchSearch =
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.keywords.some((k) => k.toLowerCase().includes(q)) ||
        tool.id.toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }, [tools, query, activeCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: tools.length };
    tools.forEach((t) => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    return counts;
  }, [tools]);

  return (
    <div>
      {/* 検索バー */}
      <div className="relative mb-6">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ツールを検索... 例: JSON, 文字数, パスワード, Base64"
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
          >
            ×
          </button>
        )}
      </div>

      {/* カテゴリフィルター */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => {
          const count = categoryCounts[cat.key] || 0;
          if (cat.key !== "all" && count === 0) return null;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeCategory === cat.key
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {cat.icon} {cat.label}
              <span className={`ml-1.5 text-xs ${activeCategory === cat.key ? "text-blue-200" : "text-gray-400"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 検索結果表示 */}
      {query && (
        <p className="text-sm text-gray-500 mb-4">
          {filtered.length > 0
            ? `${filtered.length}件のツールが見つかりました`
            : "該当するツールが見つかりません"}
        </p>
      )}

      {/* ツール一覧 */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
