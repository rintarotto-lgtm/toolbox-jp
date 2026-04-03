import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ペット保険シミュレーター【犬・猫の保険料と補償内容を比較】 | ツールボックス",
  description:
    "ペット保険の年間保険料と補償内容を無料シミュレーション。犬・猫の種類・年齢から保険料の目安を計算。補償割合50%・70%・90%プランの費用対効果を比較。",
  keywords: [
    "ペット保険 計算",
    "ペット保険 比較",
    "犬 保険料 計算",
    "猫 保険料 計算",
    "ペット保険 必要性",
  ],
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/pet-insurance",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "ペット保険の保険料の目安はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "犬（小型犬・1歳）の場合、月額2,000〜5,000円程度が一般的です。猫は犬より安く月額1,500〜3,500円程度が多いです。年齢や犬種・猫種によって大きく異なります。",
      },
    },
    {
      "@type": "Question",
      name: "ペット保険は必要ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "犬・猫の一生涯の医療費は平均50〜100万円以上かかることもあります。特に手術費用は1回で10〜50万円になることも。経済的な安心のため検討する価値があります。",
      },
    },
    {
      "@type": "Question",
      name: "ペット保険の補償割合の違いは何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "50%・70%・90%は診療費の自己負担割合を示します。90%なら10万円の診療費のうち9万円が保険でカバーされます。補償割合が高いほど保険料も高くなります。",
      },
    },
    {
      "@type": "Question",
      name: "ペット保険に加入するタイミングはいつがいいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "若いうちに加入するほど保険料が安く、既往症の告知が不要です。シニア期（7〜8歳以上）になると加入できない場合や保険料が高くなる場合があります。",
      },
    },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
