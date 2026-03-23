import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "電気代計算ツール - 家電ごとの電気代を瞬時に計算 | ツールボックス",
  description:
    "エアコン・ドライヤー・テレビなど家電ごとの電気代を瞬時に計算。1日・1ヶ月・1年の電気代と節約シミュレーションが無料で使える。2026年の電気料金対応。",
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/electricity-calc",
  },
  openGraph: {
    title: "電気代計算ツール - この家電、月いくら？",
    description:
      "家電ごとの電気代を瞬時に計算。エアコン・ドライヤー・テレビなどの月額電気代と節約額がわかる。",
    url: "https://www.toolbox-jp.net/tools/electricity-calc",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
