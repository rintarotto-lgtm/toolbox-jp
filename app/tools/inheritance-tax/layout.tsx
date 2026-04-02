import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "相続税の基礎控除額はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "相続税の基礎控除額は「3,000万円 + 600万円 × 法定相続人の数」で計算されます。例えば法定相続人が2人の場合は3,000万円 + 600万円 × 2 = 4,200万円となり、遺産総額がこの金額以下であれば相続税はかかりません。",
      },
    },
    {
      "@type": "Question",
      name: "相続税の税率はどれくらいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "相続税は超過累進税率が適用されます。取得金額が1,000万円以下は10%、3,000万円以下は15%、5,000万円以下は20%、1億円以下は30%、2億円以下は40%、3億円以下は45%、6億円以下は50%、6億円超は55%です。実際には法定相続分に応じた按分計算を行います。",
      },
    },
    {
      "@type": "Question",
      name: "相続税を払わなければならないのは誰ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "相続税は、遺産総額が基礎控除額（3,000万円 + 600万円 × 法定相続人数）を超える場合に、実際に財産を相続した人が納める義務を負います。配偶者・子・父母などの法定相続人が対象となりますが、遺産分割の結果によって各人の負担額は異なります。",
      },
    },
    {
      "@type": "Question",
      name: "相続税の申告期限はいつですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "相続税の申告と納付の期限は、被相続人が亡くなったことを知った日の翌日から10ヶ月以内です。申告先は被相続人の住所地を管轄する税務署となります。期限を過ぎると延滞税や加算税が発生する場合がありますので注意が必要です。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "相続税計算シミュレーター - 基礎控除と税額を無料計算 | ツールボックス",
  description:
    "相続税を無料でシミュレーション。基礎控除は3,000万円＋600万円×法定相続人数。税率は10〜55%の超過累進課税。遺産総額・相続人数・配偶者の有無・債務を入力するだけで相続税総額と配偶者控除後の実質負担がわかります。",
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/inheritance-tax",
  },
  openGraph: {
    title: "相続税計算シミュレーター - 基礎控除と税額を無料計算",
    description:
      "遺産総額と法定相続人数を入力するだけで相続税を自動計算。基礎控除3,000万＋600万×人数、税率10〜55%に対応。",
    url: "https://www.toolbox-jp.net/tools/inheritance-tax",
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
