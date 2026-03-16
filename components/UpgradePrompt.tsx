"use client";

import Link from "next/link";

interface UpgradePromptProps {
  feature?: string;
}

export default function UpgradePrompt({ feature }: UpgradePromptProps) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 text-center">
      <div className="text-3xl mb-2">⚡</div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">
        {feature ? `${feature}はProプランの機能です` : "Proプランにアップグレード"}
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        広告なし・無制限利用・API対応。月額¥980から。
      </p>
      <Link
        href="/pricing"
        className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors"
      >
        プランを見る
      </Link>
    </div>
  );
}
