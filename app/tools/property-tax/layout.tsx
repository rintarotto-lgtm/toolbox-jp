import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "固定資産税の計算方法を教えてください",
      acceptedAnswer: {
        "@type": "Answer",
        text: "固定資産税は「固定資産税評価額 × 税率1.4%」で計算します。ただし住宅用地には軽減措置があり、小規模住宅用地（200㎡以下の部分）は評価額の1/6、一般住宅用地（200㎡超の部分）は1/3に課税標準が軽減されます。土地と建物それぞれに税額を算出して合計します。",
      },
    },
    {
      "@type": "Question",
      name: "固定資産税の税率はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "固定資産税の標準税率は1.4%です。市区町村によっては条例で異なる税率を設定することもありますが、ほとんどの自治体で1.4%が適用されています。なお都市計画税は別途0.3%以内で課税される場合があります。",
      },
    },
    {
      "@type": "Question",
      name: "固定資産税の軽減措置にはどのようなものがありますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "住宅用地には「住宅用地の特例」があり、小規模住宅用地（200㎡以下）は固定資産税の課税標準が1/6に、一般住宅用地（200㎡超）は1/3に軽減されます。また新築住宅の建物部分は新築後3年間（マンション等は5年間）、床面積120㎡以下の部分の固定資産税が1/2になる「新築特例」があります。",
      },
    },
    {
      "@type": "Question",
      name: "固定資産税の支払い時期はいつですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "固定資産税は通常、年4回に分けて納付します。第1期：5月、第2期：7月、第3期：12月、第4期：翌年2月が一般的な納期です（自治体によって異なる場合があります）。各期の納付額は年税額の1/4ずつです。一括払いも可能で、4月〜5月頃に一括納付できる自治体が多いです。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "固定資産税計算シミュレーター【2025年】マンション・一戸建ての税額を計算 | ツールボックス",
  description:
    "固定資産税の年額を無料計算。土地・建物の固定資産税評価額を入力するだけで税額を算出。住宅用地の軽減措置・新築特例も自動適用。マンション・一戸建て対応。",
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/property-tax",
  },
  openGraph: {
    title: "固定資産税計算シミュレーター【2025年】マンション・一戸建て対応",
    description:
      "土地・建物の固定資産税評価額を入力するだけで年間税額を自動計算。住宅用地の軽減措置・新築特例も対応。",
    url: "https://www.toolbox-jp.net/tools/property-tax",
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
