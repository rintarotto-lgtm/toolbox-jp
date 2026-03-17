"use client";

import Link from "next/link";
import { tools } from "@/lib/tools";

interface Props {
  currentToolId: string;
}

export default function RelatedTools({ currentToolId }: Props) {
  const currentTool = tools.find((t) => t.id === currentToolId);
  if (!currentTool) return null;

  // Same category first, then random others
  const sameCategory = tools.filter(
    (t) => t.id !== currentToolId && t.category === currentTool.category
  );
  const otherCategory = tools.filter(
    (t) => t.id !== currentToolId && t.category !== currentTool.category
  );

  // Deterministic selection: same category first, then others in stable order
  const related = [
    ...sameCategory,
    ...otherCategory,
  ].slice(0, 6);

  return (
    <div className="mt-10 pt-8 border-t border-gray-200">
      <h2 className="text-lg font-bold text-gray-800 mb-4">🔧 関連ツール</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {related.map((tool) => (
          <Link
            key={tool.id}
            href={tool.path}
            className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-sm font-bold text-blue-600 shrink-0">
              {tool.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">{tool.name}</p>
              <p className="text-xs text-gray-500 line-clamp-1">
                {tool.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
