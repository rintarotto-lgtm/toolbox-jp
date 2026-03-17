import Link from "next/link";
import type { Tool } from "@/lib/tools";

const iconColors: Record<string, string> = {
  "テキスト": "bg-amber-100 text-amber-700",
  "開発": "bg-blue-100 text-blue-700",
  "画像": "bg-purple-100 text-purple-700",
  "セキュリティ": "bg-red-100 text-red-700",
  "デザイン": "bg-pink-100 text-pink-700",
};

export default function ToolCard({ tool }: { tool: Tool }) {
  const color = iconColors[tool.category] || "bg-gray-100 text-gray-700";
  return (
    <Link
      href={tool.path}
      className="block bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-blue-300 transition-all group"
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${color}`}>
          {tool.icon}
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
            {tool.name}
          </h3>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
            {tool.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
