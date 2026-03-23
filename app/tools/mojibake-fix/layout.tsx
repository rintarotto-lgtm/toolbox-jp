import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "文字化け修復 - 文字化けテキストを復元",
  description: "文字化けしたテキストを複数のエンコーディングパターンで復元を試みます。UTF-8、Shift_JIS、EUC-JP、ISO-2022-JP対応。無料オンラインツール。",
  alternates: { canonical: "https://www.toolbox-jp.net/tools/mojibake-fix" },
  openGraph: {
    title: "文字化け修復 - 文字化けテキストを復元",
    description: "文字化けしたテキストを複数のエンコーディングで復元。UTF-8・Shift_JIS・EUC-JP対応。",
    url: "https://www.toolbox-jp.net/tools/mojibake-fix",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
