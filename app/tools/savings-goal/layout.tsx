import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "貯金目標達成計算 - 目標金額までの期間・月額を無料シミュレーション | ToolBox Japan",
  description: "目標貯金額・現在の貯金額・月々の積立額から達成期間を無料計算。マイホーム頭金・結婚資金・教育費・老後資金など目的別の積立計画を自動算出。",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "1000万円貯めるには何年かかりますか？", acceptedAnswer: { "@type": "Answer", text: "月5万円積み立てた場合、1000万円達成まで約16年7ヶ月かかります。月10万円なら約8年4ヶ月、月20万円なら約4年2ヶ月です。金利を加味すると利息分だけ早く達成できます。" } },
          { "@type": "Question", name: "住宅購入の頭金はいくら貯めればよいですか？", acceptedAnswer: { "@type": "Answer", text: "一般的に物件価格の10〜20%が目安です。3000万円の物件なら300〜600万円です。最近はフルローンも増えていますが、頭金があると月々の返済額が減り、金利優遇を受けやすくなります。" } },
          { "@type": "Question", name: "貯金と投資はどのように組み合わせるべきですか？", acceptedAnswer: { "@type": "Answer", text: "生活費の3〜6ヶ月分は普通預金・定期預金で保持し、それ以上の余剰資金はNISA・iDeCoなどを活用した投資に回す方法が一般的に推奨されています。" } },
        ],
      }) }} />
      {children}
    </>
  );
}
