import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "基礎代謝（BMR）とは何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "基礎代謝（BMR: Basal Metabolic Rate）とは、安静にしている状態でも生命維持のために消費されるエネルギー量のことです。呼吸・心臓の拍動・体温維持などに使われ、1日の総消費カロリーの約60〜70%を占めます。年齢・性別・体重・身長によって異なります。",
      },
    },
    {
      "@type": "Question",
      name: "TDEEとは何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "TDEE（Total Daily Energy Expenditure：総消費エネルギー量）とは、1日に消費するカロリーの合計です。基礎代謝量（BMR）に活動レベルを掛け合わせて算出します。ダイエットや筋肉増量の際、摂取カロリーの基準値として使用します。",
      },
    },
    {
      "@type": "Question",
      name: "ダイエットに必要なカロリー制限はどのくらいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "一般的に、1週間で体重500gを減らすにはTDEEから1日500kcalのカロリー不足が必要です（500kcal × 7日 ≒ 3,500kcal = 体脂肪約500g）。ただし、極端なカロリー制限は筋肉量の低下や栄養不足を招くため、BMRを下回らないように注意が必要です。",
      },
    },
    {
      "@type": "Question",
      name: "筋肉をつけながら痩せるためのカロリーはどうすればよいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "筋肉をつけながら痩せる「リコンポジション」を行うには、TDEEに近い維持カロリーで、たんぱく質を体重1kgあたり1.6〜2.2g摂取しながら筋力トレーニングを行うことが有効です。過度なカロリー制限は避け、消費カロリー超過は250〜500kcal程度に抑えるのが理想的です。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "カロリー計算【基礎代謝・消費カロリー】ダイエット目標摂取カロリーを計算 | ツールボックス",
  description:
    "1日の消費カロリー・目標摂取カロリーを無料計算。身長・体重・年齢・活動レベルから基礎代謝（BMR）と総消費エネルギー（TDEE）を算出。ダイエット・筋トレ目標設定に。",
  keywords: [
    "カロリー計算",
    "消費カロリー 計算",
    "基礎代謝 計算",
    "ダイエット カロリー",
    "TDEE 計算",
  ],
  alternates: { canonical: "https://www.toolbox-jp.net/tools/calorie-calc" },
  openGraph: {
    title: "カロリー計算【基礎代謝・消費カロリー】ダイエット目標摂取カロリーを計算",
    description:
      "身長・体重・年齢・活動レベルから基礎代謝（BMR）とTDEEを算出。ダイエット・筋トレの目標カロリーを無料計算。",
    url: "https://www.toolbox-jp.net/tools/calorie-calc",
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
