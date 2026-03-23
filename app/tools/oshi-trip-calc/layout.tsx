import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "推し活遠征費計算ツール - 交通費・宿泊費・グッズ代を一括計算 | ツールボックス",
  description:
    "推し活の遠征費用を一括計算！新幹線・飛行機・高速バスの交通費、ホテル代、チケット代、グッズ代をまとめて計算。節約プランも自動提案する無料ツール。",
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/oshi-trip-calc",
  },
  openGraph: {
    title: "推し活遠征費計算ツール - 遠征にいくらかかる？",
    description:
      "推しに会いに行く遠征費用を一括計算。交通費・宿泊費・グッズ代の総額と節約プランを自動提案。",
    url: "https://www.toolbox-jp.net/tools/oshi-trip-calc",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
