import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "体脂肪率・基礎代謝計算ツール - 1日の消費カロリーも無料計算 | ツールボックス",
  description:
    "体脂肪率と基礎代謝（BMR）を無料計算。身長・体重・年齢・性別から1日の総消費カロリー（TDEE）・目標体重・ダイエット期間もシミュレーション。",
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/body-calc",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "体脂肪率の正常値はどのくらいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "体脂肪率の正常値は性別・年齢によって異なります。成人男性の標準は10〜20%、成人女性の標準は18〜28%が目安とされています。男性で25%以上、女性で35%以上は肥満と判定されることが多く、逆に男性10%未満・女性18%未満は低体脂肪となります。",
      },
    },
    {
      "@type": "Question",
      name: "基礎代謝とは何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "基礎代謝（BMR: Basal Metabolic Rate）とは、生命維持のために安静状態でも消費される最低限のエネルギー量です。呼吸・体温調節・内臓の働きなどに使われます。成人男性で平均1,500〜1,800kcal/日、成人女性で1,100〜1,400kcal/日程度が目安です。年齢・身長・体重・性別によって個人差があります。",
      },
    },
    {
      "@type": "Question",
      name: "1日の消費カロリーはどうやって計算しますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "1日の総消費カロリー（TDEE: Total Daily Energy Expenditure）は、基礎代謝（BMR）に活動レベル係数を掛けて算出します。例えばほぼ運動しない場合はBMR×1.2、軽い運動（週1〜3日）ならBMR×1.375、中程度の運動（週3〜5日）ならBMR×1.55が目安です。このツールではMifflin-St Jeor式でBMRを計算しています。",
      },
    },
    {
      "@type": "Question",
      name: "ダイエットに必要なカロリー赤字はどのくらいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "脂肪1kgを減らすには約7,200kcalの消費が必要です。一般的に健康的なペースとして1日500kcalの赤字（TDEE−500kcal）が推奨されており、これにより1週間で約0.5kgの減量が見込めます。急激な制限（1,200kcal未満/日）は筋肉量の低下や栄養不足を招く恐れがあるため避けましょう。",
      },
    },
  ],
};

export default function BodyCalcLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
