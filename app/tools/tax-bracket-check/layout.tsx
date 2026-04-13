import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "所得税率チェック・課税所得計算 - 自分の税率を無料確認 | ToolBox Japan",
  description: "年収・控除から課税所得と適用される所得税率を無料計算。累進課税の仕組みを図解。所得税の節税（iDeCo・ふるさと納税・医療費控除）の効果も計算。",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "所得税率はどうやって決まりますか？", acceptedAnswer: { "@type": "Answer", text: "所得税は「累進課税」で、課税所得が高いほど高い税率が適用されます。5%〜45%の7段階で、195万円以下は5%、195〜330万円は10%、4000万円超は45%です。" } },
          { "@type": "Question", name: "iDeCoで所得税はいくら節税できますか？", acceptedAnswer: { "@type": "Answer", text: "iDeCoの掛金は全額所得控除されます。年収500万円（税率20%）で年間24万円掛けると、所得税で約4.8万円、住民税で約2.4万円、合計約7.2万円の節税効果があります。" } },
          { "@type": "Question", name: "住民税の税率は何%ですか？", acceptedAnswer: { "@type": "Answer", text: "住民税は原則として課税所得の10%（道府県民税4%＋市町村民税6%）に均等割（年約5,000円）を加えた金額です。所得税と異なり全国一律の税率です。" } },
        ],
      }) }} />
      {children}
    </>
  );
}
