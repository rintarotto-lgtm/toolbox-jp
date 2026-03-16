import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "文字コード判定ツール | UTF-8・Shift_JIS・EUC-JP検出 - ToolBox",
  description:
    "テキストのバイト列から文字コードを推定。UTF-8、Shift_JIS、EUC-JP、ISO-2022-JPに対応。16進ダンプ表示やバイト数カウントも。",
  openGraph: {
    title: "文字コード判定ツール | UTF-8・Shift_JIS・EUC-JP検出 - ToolBox",
    description:
      "テキストの文字コードを推定。16進ダンプ表示やバイト数カウントも。",
    url: "https://toolbox-jp.vercel.app/tools/encoding-detector",
  },
  alternates: { canonical: "https://toolbox-jp.vercel.app/tools/encoding-detector" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
