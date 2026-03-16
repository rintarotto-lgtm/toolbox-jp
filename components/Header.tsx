import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900">
          <span className="text-blue-600">Tool</span>Box
        </Link>
        <nav className="hidden sm:flex gap-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-gray-900">ツール一覧</Link>
          <Link href="/dashboard" className="hover:text-gray-900">📊 ダッシュボード</Link>
        </nav>
      </div>
    </header>
  );
}
