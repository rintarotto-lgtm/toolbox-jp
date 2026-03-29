import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "退職金の税金はいくらかかりますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "退職金には「退職所得控除」が適用され、勤続年数が長いほど控除額が大きくなります。勤続20年以下は年40万円、20年超は年70万円の控除があります。控除後の金額の1/2に所得税・住民税がかかります。",
      },
    },
    {
      "@type": "Question",
      name: "退職所得控除の計算方法は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "退職所得控除は勤続年数で計算します。勤続20年以下：40万円×勤続年数（最低80万円）。勤続20年超：800万円＋70万円×（勤続年数－20年）。",
      },
    },
    {
      "@type": "Question",
      name: "退職金の手取りはどのくらいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "退職金は控除が大きいため、手取り率が高い傾向があります。例えば勤続30年で退職金2,000万円の場合、退職所得控除は1,500万円、課税対象は250万円（×1/2）となり、手取りは約1,860万円（約93%）になります。",
      },
    },
    {
      "@type": "Question",
      name: "確定申告は必要ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "「退職所得の受給に関する申告書」を会社に提出していれば、退職金は源泉徴収で完結し確定申告は不要です。提出していない場合は20.42%の源泉徴収後に確定申告が必要です。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "退職金手取り計算ツール - 税金を引いた実際の手取りを計算 | ツールボックス",
  description: "退職金の手取り額を無料計算。退職所得控除・所得税・住民税を自動計算。勤続年数と退職金額を入力するだけで税引き後の実際の手取りがわかります。",
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/retirement-calc",
  },
  openGraph: {
    title: "退職金手取り計算ツール - 退職金の税金はいくら？",
    description: "退職所得控除と税金を引いた実際の手取り額を計算。勤続年数別の比較も。",
    url: "https://www.toolbox-jp.net/tools/retirement-calc",
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
