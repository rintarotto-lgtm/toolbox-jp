"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Header() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const plan = (session?.user as Record<string, unknown>)?.plan as string | undefined;

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900">
          <span className="text-blue-600">Tool</span>Box
        </Link>
        <nav className="flex items-center gap-4 text-sm text-gray-600">
          <Link href="/" className="hidden sm:block hover:text-gray-900">ツール一覧</Link>
          <Link href="/pricing" className="hidden sm:block hover:text-gray-900">料金プラン</Link>

          {status === "loading" ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
          ) : session?.user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 hover:text-gray-900"
              >
                {session.user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.user.image}
                    alt=""
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                    {session.user.name?.[0] || session.user.email?.[0] || "U"}
                  </div>
                )}
                {plan && plan !== "FREE" && (
                  <span className="text-xs font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded">
                    {plan}
                  </span>
                )}
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">{session.user.name || session.user.email}</p>
                    <p className="text-xs text-gray-500">{plan || "FREE"}プラン</p>
                  </div>
                  <Link href="/settings" className="block px-3 py-2 text-sm hover:bg-gray-50" onClick={() => setMenuOpen(false)}>設定</Link>
                  <Link href="/billing" className="block px-3 py-2 text-sm hover:bg-gray-50" onClick={() => setMenuOpen(false)}>請求管理</Link>
                  {(!plan || plan === "FREE") && (
                    <Link href="/pricing" className="block px-3 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50" onClick={() => setMenuOpen(false)}>
                      ⚡ アップグレード
                    </Link>
                  )}
                  <button
                    onClick={() => { setMenuOpen(false); signOut(); }}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    ログアウト
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/signin" className="hover:text-gray-900">ログイン</Link>
              <Link
                href="/auth/register"
                className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                無料登録
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
