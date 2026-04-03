import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "老後に2000万円が必要と言われる理由は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "金融庁の報告書（2019年）で、夫婦2人の場合に公的年金だけでは月5.5万円の赤字が生じ、30年間で約2,000万円の資産取崩しが必要と試算されたためです。現在は年金額や物価も変動しているため、個人の状況に合わせた計算が重要です。",
      },
    },
    {
      "@type": "Question",
      name: "老後の生活費は月いくら必要ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "総務省の家計調査では、65歳以上の無職夫婦世帯の平均支出は約25〜27万円/月です。単身の場合は約15〜16万円程度です。",
      },
    },
    {
      "@type": "Question",
      name: "老後資金の積立はいつから始めるべきですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "早ければ早いほど効果的です。30代から始めると複利効果で60代には大きな資産になります。iDeCo・NISAを活用した税制優遇のある積立が効率的です。",
      },
    },
    {
      "@type": "Question",
      name: "公的年金は月いくらもらえますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "2024年度の平均受給額は、厚生年金（夫婦）で約22〜23万円/月、国民年金（単身）で約6.7万円/月です。加入期間や収入によって大きく異なります。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "老後資金シミュレーター【2000万円問題】老後に必要な資金を計算 | ツールボックス",
  description:
    "老後に必要な資金総額を無料シミュレーション。現在の年齢・貯蓄額・毎月の積立から退職時の資産と不足額を計算。年金受給額も考慮した老後の収支計画に。",
  keywords: ["老後資金 計算", "老後 必要資金", "老後 2000万円", "老後資金 シミュレーション", "退職後 生活費"],
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/retirement-savings",
  },
  openGraph: {
    title: "老後資金シミュレーター【2000万円問題】老後に必要な資金を計算",
    description: "現在の年齢・貯蓄・積立額から退職時の資産と老後の不足額を計算。",
    url: "https://www.toolbox-jp.net/tools/retirement-savings",
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
