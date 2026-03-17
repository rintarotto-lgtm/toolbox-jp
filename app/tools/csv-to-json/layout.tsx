import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSV → JSON変換ツール | CSVファイルをJSON形式に変換 - ツールボックス",
  description:
    "CSVデータをJSON形式に変換。ヘッダー行の自動検出、区切り文字の指定、配列/オブジェクト形式の選択が可能。",
  keywords: ["CSV JSON変換", "CSV to JSON", "CSVからJSON", "JSON変換", "データ変換"],
  openGraph: {
    title: "CSV → JSON変換ツール - ツールボックス",
    description: "CSVをJSONに変換。ヘッダー自動検出・区切り文字指定対応。",
  },
  alternates: {
    canonical: "https://toolbox-jp.vercel.app/tools/csv-to-json",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
