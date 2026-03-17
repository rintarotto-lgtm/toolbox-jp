import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "行ソート・重複削除ツール - テキスト行の並べ替え - ToolBox",
  description: "テキストの行をアルファベット順・逆順・数値順にソート。重複行の削除、空行の除去も。",
  alternates: { canonical: "https://toolbox-jp.vercel.app/tools/line-sort" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
