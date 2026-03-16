"use client";

import { usePlan } from "@/lib/hooks/use-plan";
import Link from "next/link";

export default function SettingsPage() {
  const { user, plan, isAuthenticated, isLoading } = usePlan();

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">読み込み中...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">ログインが必要です</h1>
        <Link href="/auth/signin" className="text-blue-600 hover:underline">ログインする</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-6">アカウント設定</h1>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-bold mb-4">プロフィール</h2>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-500">名前</label>
            <p className="text-gray-900">{user?.name || "未設定"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">メールアドレス</label>
            <p className="text-gray-900">{user?.email || "未設定"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">プラン</label>
            <p className="text-gray-900">{plan}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-bold mb-4">リンク</h2>
        <div className="space-y-2">
          <Link href="/billing" className="block text-blue-600 hover:underline text-sm">請求管理</Link>
          <Link href="/pricing" className="block text-blue-600 hover:underline text-sm">プランを変更</Link>
        </div>
      </div>
    </div>
  );
}
