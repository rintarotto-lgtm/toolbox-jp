import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "光熱費シミュレーター - 電気・ガス・水道の月額費用を無料計算 | ToolBox Japan",
  description: "家族構成・住居タイプ・地域から電気代・ガス代・水道代の月額目安を無料計算。光熱費の節約方法や平均費用との比較も表示。家計管理に活用。",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "電気代の月平均はいくらですか？", acceptedAnswer: { "@type": "Answer", text: "総務省の家計調査（2023年）によると、2人以上の世帯の電気代の月平均は約12,000〜15,000円です。1人暮らしは約5,000〜8,000円が目安です。" } },
          { "@type": "Question", name: "光熱費を節約する効果的な方法は？", acceptedAnswer: { "@type": "Answer", text: "電力会社の切り替え（新電力）、LED照明の導入、エアコンの適切な設定（冷房28℃・暖房20℃）、太陽光発電、省エネ家電への買い替えなどが効果的です。" } },
          { "@type": "Question", name: "オール電化にすると光熱費は安くなりますか？", acceptedAnswer: { "@type": "Answer", text: "深夜電力を活用するオール電化は、ガス代がゼロになる分、電気代は上がりますが、総合的に月5,000〜10,000円の節約になるケースが多いです。太陽光発電と組み合わせると更に効果的です。" } },
        ],
      }) }} />
      {children}
    </>
  );
}
