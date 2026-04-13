import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "インデックス投資シミュレーター - 積立投資の将来資産を無料計算 | ToolBox Japan",
  description: "毎月の積立額・年利・期間から将来の資産額を無料シミュレーション。日経平均・S&P500・オルカンの過去リターンを参考に複利効果を可視化。NISA活用で税引き後の資産も計算。",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "S&P500の過去平均リターンは何%ですか？", acceptedAnswer: { "@type": "Answer", text: "米国S&P500の過去30年（1993〜2023年）の年平均リターンは約10%（ドルベース）、円換算では為替影響で12〜15%程度です。ただし将来を保証するものではありません。" } },
          { "@type": "Question", name: "毎月5万円を20年積み立てると資産はいくらになりますか？", acceptedAnswer: { "@type": "Answer", text: "年利5%で複利計算すると約2,055万円（元本1,200万円＋利益855万円）になります。年利7%なら約2,598万円、年利10%なら約3,788万円です。" } },
          { "@type": "Question", name: "NISAを使うと投資の税金はどうなりますか？", acceptedAnswer: { "@type": "Answer", text: "通常、株式・投資信託の利益には20.315%の税金がかかりますが、新NISAの成長投資枠・積立投資枠を使うと利益が非課税になります。長期投資では非課税効果が大きくなります。" } },
        ],
      }) }} />
      {children}
    </>
  );
}
