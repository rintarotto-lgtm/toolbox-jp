import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "年収シミュレーター - 手取り・社会保険料・税金を無料計算 | ToolBox Japan",
  description: "年収から手取り・所得税・住民税・社会保険料（健康保険・厚生年金・雇用保険）を無料計算。年収別の手取り早見表付き。昇給・転職時の手取り変化も即確認。",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "年収400万円の手取りはいくらですか？", acceptedAnswer: { "@type": "Answer", text: "年収400万円の手取りは約310〜320万円が目安です。所得税・住民税・社会保険料を合わせると約80〜90万円（約20〜22%）が差し引かれます。" } },
          { "@type": "Question", name: "年収が上がると手取りはどれくらい増えますか？", acceptedAnswer: { "@type": "Answer", text: "年収500万円→600万円の場合、手取りは約380万円→450万円と70万円程度増えます。年収が高いほど税率も上がるため、増加分の約30〜35%が税・社保で引かれます。" } },
          { "@type": "Question", name: "社会保険料はいくらかかりますか？", acceptedAnswer: { "@type": "Answer", text: "会社員の社会保険料の自己負担は年収の約14〜15%です。健康保険（約5%）、厚生年金（約9.15%）、雇用保険（約0.6%）の合計です。" } },
        ],
      }) }} />
      {children}
    </>
  );
}
