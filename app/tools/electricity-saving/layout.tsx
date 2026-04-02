import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "電気代の全国平均はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "総務省の家計調査によると、電気代の全国平均は一人暮らしで月約7,000円、二人世帯で月約12,000円、三人以上の世帯で月約17,000円が目安です。電気料金の値上がりにより近年は増加傾向にあります。季節によって冷暖房の使用量が変わるため、夏と冬は電気代が高くなりやすい傾向があります。",
      },
    },
    {
      "@type": "Question",
      name: "節電効果の計算方法を教えてください",
      acceptedAnswer: {
        "@type": "Answer",
        text: "節電効果は「現在の電気代 × 削減率」で計算できます。例えばエアコンの設定温度を1℃変えると消費電力が約10%削減され、月1万円の電気代なら約1,000円の節約になります。LED電球への交換は白熱球10個の場合、月約800円の節約が見込めます。複数の節電アクションを組み合わせると効果が積み上がります。",
      },
    },
    {
      "@type": "Question",
      name: "エアコンと電気ストーブではどちらが電気代が安いですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "一般的にエアコン（ヒートポンプ式）の方が電気ストーブより大幅に電気代が安くなります。エアコンは消費電力の3〜6倍の熱エネルギーを生み出せる（COP3〜6）のに対し、電気ストーブは消費電力がそのまま熱になるため効率が低いです。同じ暖房効果を得るためにかかる電気代はエアコンの方が電気ストーブの3分の1〜6分の1程度になります。",
      },
    },
    {
      "@type": "Question",
      name: "太陽光発電の節電効果はどのくらいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "太陽光発電システムの節電効果は設置容量・地域・日照条件によって異なりますが、一般的な家庭用（4kW）では年間約4,000kWh程度の発電が期待できます。電気料金を1kWhあたり30〜35円とすると、年間約12〜14万円の電気代削減になります。余剰電力は売電することも可能です。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "電気代節約シミュレーター - 節電でいくら減る？年間削減額を計算 | ツールボックス",
  description:
    "電気代節約効果を無料シミュレーション。現在の月額電気代と節電アクションを選ぶだけで年間削減額を計算。エアコン設定温度・LED交換・待機電力の効果も。",
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/electricity-saving",
  },
  openGraph: {
    title: "電気代節約シミュレーター - 節電でいくら減る？年間削減額を計算",
    description:
      "節電アクションを選ぶだけで年間削減額を計算。エアコン設定温度・LED交換・待機電力削減の効果がひと目でわかる。",
    url: "https://www.toolbox-jp.net/tools/electricity-saving",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  );
}
