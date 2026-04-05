import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "株式・投資損益通算計算 - 確定申告で取り戻せる税金を無料計算 | ToolBox Japan",
  description: "株式・投資信託・FXの損益通算で確定申告により取り戻せる税金を無料計算。損失の繰越控除（3年間）の効果と必要書類も解説。NISA・特定口座対応。",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "株式の損益通算とは何ですか？", acceptedAnswer: { "@type": "Answer", text: "損益通算とは、同じ年の株式等の利益と損失を相殺することです。例えば、A株で20万円の利益、B株で10万円の損失の場合、課税対象は差額の10万円になります。" } },
          { "@type": "Question", name: "株式の損失は何年繰り越せますか？", acceptedAnswer: { "@type": "Answer", text: "確定申告で損失繰越を申請すると、最大3年間繰り越せます。つまり今年の損失を翌年・翌々年・3年後の利益と相殺できます。毎年確定申告が必要です。" } },
          { "@type": "Question", name: "NISA口座の損益は通算できますか？", acceptedAnswer: { "@type": "Answer", text: "NISA口座での損失は他の口座の利益と損益通算できません（非課税扱いのため）。特定口座や一般口座での損失のみ損益通算が可能です。" } },
        ],
      }) }} />
      {children}
    </>
  );
}
