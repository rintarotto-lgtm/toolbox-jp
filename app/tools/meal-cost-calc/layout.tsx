import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "食費計算・1食あたりコスト - 月の食費と自炊vs外食の差を無料比較 | ToolBox Japan",
  description: "1ヶ月の食費と1食あたりのコストを無料計算。自炊・外食・コンビニの割合から月の食費総額を算出。食費節約のコツと平均食費との比較も表示。家計管理に。",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "一人暮らしの食費の平均はいくらですか？", acceptedAnswer: { "@type": "Answer", text: "総務省の家計調査（2023年）によると、一人暮らしの食費の月平均は約37,000〜42,000円です。自炊中心なら2〜3万円、外食中心だと5〜8万円になるケースもあります。" } },
          { "@type": "Question", name: "自炊と外食では1食あたりいくら違いますか？", acceptedAnswer: { "@type": "Answer", text: "自炊は1食約200〜400円、外食は1食約800〜1,500円が目安です。コンビニ弁当は400〜700円程度です。1日3食すべて外食にすると月7〜13万円になる計算です。" } },
          { "@type": "Question", name: "食費を節約する効果的な方法は？", acceptedAnswer: { "@type": "Answer", text: "週に1〜2回まとめ買い、食材の使い回し（作り置き）、スーパーの特売日を活用、外食は週2回以下に抑えることが効果的です。食材ロスを減らすだけで月5,000〜10,000円の節約も可能です。" } },
        ],
      }) }} />
      {children}
    </>
  );
}
