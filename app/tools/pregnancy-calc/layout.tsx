import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "出産予定日の計算方法は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "最終月経開始日から280日後（40週後）が出産予定日です。ナーゲル法では最終月経開始月に9を足し（または3を引き）、日に7を足して計算します。",
      },
    },
    {
      "@type": "Question",
      name: "妊娠週数の数え方は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "最終月経開始日を妊娠0週0日とします。7日で1週が終わり、次の週に進みます。妊娠10週0日は最終月経から70日目です。",
      },
    },
    {
      "@type": "Question",
      name: "妊娠初期・中期・後期の区分は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "妊娠0〜15週が初期（第1三半期）、16〜27週が中期（第2三半期）、28週以降が後期（第3三半期）とされています。",
      },
    },
    {
      "@type": "Question",
      name: "早産・正期産・過期産の定義は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "妊娠22〜36週の出産が早産、37〜41週が正期産（予定日±2週）、42週以降が過期産です。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "妊娠週数・出産予定日計算【最終月経から自動計算】今何週目？ | ツールボックス",
  description:
    "最終月経開始日または受精日・排卵日から妊娠週数と出産予定日を無料計算。今何週何日目か、各妊娠時期のマイルストーンもカレンダー表示。",
  keywords: [
    "妊娠週数 計算",
    "出産予定日 計算",
    "妊娠 週数 計算",
    "出産予定日 いつ",
    "妊娠 カレンダー",
  ],
  alternates: { canonical: "https://www.toolbox-jp.net/tools/pregnancy-calc" },
  openGraph: {
    title: "妊娠週数・出産予定日計算【最終月経から自動計算】",
    description:
      "最終月経開始日または受精日から妊娠週数と出産予定日を無料計算。マイルストーン一覧も表示。",
    url: "https://www.toolbox-jp.net/tools/pregnancy-calc",
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
