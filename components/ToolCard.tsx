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
      className="block bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-300 transition-all group"
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${color}`}>
          {tool.icon}
        </div>
        <div>
          <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {tool.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">
            {tool.description}
          </p>
          <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
            {tool.category}
          </span>
        </div>
      </div>
    </Link>
  );
}
