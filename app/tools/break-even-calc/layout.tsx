import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "損益分岐点計算 - 売上・固定費・変動費から黒字化ラインを無料計算 | ToolBox Japan",
  description: "売上・固定費・変動費率から損益分岐点（BEP）を無料計算。フリーランス・副業・小売・飲食店の黒字化に必要な売上高・販売個数を算出。安全余裕率も表示。",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "損益分岐点とは何ですか？", acceptedAnswer: { "@type": "Answer", text: "損益分岐点（BEP: Break-Even Point）とは、売上と費用がちょうど等しくなる点です。この売上高を超えると利益が出ます。固定費÷（1－変動費率）で計算します。" } },
          { "@type": "Question", name: "安全余裕率はどのくらいが理想ですか？", acceptedAnswer: { "@type": "Answer", text: "一般的に安全余裕率が20〜30%以上あると経営が安定しているとされます。10%未満になると損益分岐点に近く、リスクが高い状態です。" } },
          { "@type": "Question", name: "変動費と固定費の違いは何ですか？", acceptedAnswer: { "@type": "Answer", text: "変動費は売上に比例して増減する費用（材料費・仕入原価・販売手数料など）、固定費は売上に関係なく一定にかかる費用（家賃・人件費・リース料など）です。" } },
        ],
      }) }} />
      {children}
    </>
  );
}
