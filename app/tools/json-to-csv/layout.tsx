import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON → CSV変換 - 無料オンラインツール",
  description:
    "JSON配列をCSV形式に変換するオンラインツール。ExcelやGoogleスプレッドシートへの貼り付けに最適。",
  keywords: ["JSON CSV変換", "JSON to CSV", "JSONからCSV", "CSV変換", "データ変換"],
  openGraph: {
    title: "JSON → CSV変換",
    description: "JSON配列をCSVに変換。ブラウザ上で完結。",
  },
  alternates: {
    canonical: "https://toolbox-jp.vercel.app/tools/json-to-csv",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
