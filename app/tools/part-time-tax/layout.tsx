import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "103万円の壁とは何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "年収103万円以下なら所得税がかかりません（給与所得控除55万+基礎控除48万=103万円）。また配偶者が会社員の場合、被扶養者として健康保険・年金の保険料を支払わずに済みます。",
      },
    },
    {
      "@type": "Question",
      name: "130万円の壁とは何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "年収130万円以上になると、扶養から外れて自分で健康保険と国民年金（約20万円/年）を支払う必要が生じます。130万円を少し超えると手取りが減る逆転現象が起きることがあります。",
      },
    },
    {
      "@type": "Question",
      name: "2024年の「年収の壁」対策はどうなりましたか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "2024年10月から従業員51人以上の企業に勤める短時間労働者は、週20時間以上・月額8.8万円以上・2ヶ月超の雇用見込みがある場合に社会保険加入が必要になりました。",
      },
    },
    {
      "@type": "Question",
      name: "学生アルバイトの場合、税金はどうなりますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "勤労学生控除（27万円）を申請すれば年収130万円まで所得税がかかりません。親の扶養控除は年収103万円以下で一般扶養控除（38万円）、103万円超で段階的に減少します。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "アルバイト・パート収入計算【103万・130万の壁】扶養内かどうか確認 | ツールボックス",
  description:
    "アルバイト・パートの年収と税金・社会保険を無料計算。103万円・106万円・130万円・150万円・201万円の壁を超えた場合の手取り変化をシミュレーション。扶養内で働ける限度額も確認。",
  keywords: [
    "バイト 税金 計算",
    "パート 扶養 計算",
    "103万円 壁",
    "130万円 壁",
    "扶養内 収入 計算",
  ],
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/part-time-tax",
  },
  openGraph: {
    title: "アルバイト・パート収入計算【103万・130万の壁】",
    description:
      "103万・130万の壁をわかりやすく可視化。年収から手取り・税金・社会保険料を計算。扶養内で働ける限度額も確認。",
    url: "https://www.toolbox-jp.net/tools/part-time-tax",
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
