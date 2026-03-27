import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "スマホ料金節約シミュレーター - 格安SIMでいくら安くなる？ | ツールボックス",
  description: "今のスマホ料金から格安SIM・格安プランに乗り換えたらいくら節約できる？大手キャリアと格安SIM・ahamo・LINEMO等の料金を比較。年間の節約額を瞬時に計算。",
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/mobile-savings",
  },
  openGraph: {
    title: "スマホ料金節約シミュレーター - 乗り換えでいくら安くなる？",
    description: "今のスマホ料金と格安SIMの差額を計算。年間の節約額がわかる。",
    url: "https://www.toolbox-jp.net/tools/mobile-savings",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
