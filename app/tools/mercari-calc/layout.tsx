import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "メルカリ利益計算機 - 送料・手数料込みで瞬時に利益計算 | ツールボックス",
  description:
    "メルカリの販売手数料10%、全配送方法の送料、振込手数料を自動計算。出品価格から手取り利益を瞬時に表示。送料比較表で最安配送方法も一目でわかる無料ツール。",
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/mercari-calc",
  },
  openGraph: {
    title: "メルカリ利益計算機 - 送料・手数料込みで瞬時に利益計算",
    description:
      "メルカリの販売手数料10%、全配送方法の送料、振込手数料を自動計算。出品価格から手取り利益を瞬時に表示。",
    url: "https://www.toolbox-jp.net/tools/mercari-calc",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
