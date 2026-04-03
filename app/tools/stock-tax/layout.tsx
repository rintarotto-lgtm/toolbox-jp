import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "株式の売却益にかかる税率はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "特定口座（源泉徴収あり）では所得税15%＋住民税5%＋復興特別所得税0.315%の合計20.315%が自動徴収されます。NISA口座内の利益は非課税です。",
      },
    },
    {
      "@type": "Question",
      name: "株式の損益通算とは何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "同年内の株式・投資信託の損失と利益を相殺することです。例えばA株で30万円の利益、B株で10万円の損失があれば、課税対象は差引20万円になります。",
      },
    },
    {
      "@type": "Question",
      name: "株式の損失繰越とは何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "年間の損益が損失になった場合、確定申告することで翌年以降3年間の利益と相殺できます。特定口座（源泉徴収なし）または一般口座は毎年確定申告が必要です。",
      },
    },
    {
      "@type": "Question",
      name: "取得費が不明な場合はどうなりますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "取得費が不明な場合は売却代金の5%を取得費とみなして計算します（概算取得費）。実際の取得費がこれより高ければ実際の額を使う方が有利です。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "株式譲渡益税計算【特定口座・NISA対応】売却益の税額を自動計算 | ツールボックス",
  description:
    "株式・投資信託の売却益にかかる税金を無料計算。取得価格・売却価格・手数料から課税所得と税額を算出。特定口座（源泉徴収あり/なし）・NISA・損益通算に対応。",
  keywords: [
    "株式 譲渡益税 計算",
    "株式 売却 税金 計算",
    "株 税金 計算",
    "NISA 非課税 計算",
    "譲渡所得 計算",
  ],
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/stock-tax",
  },
  openGraph: {
    title: "株式譲渡益税計算【特定口座・NISA対応】",
    description:
      "株式・投資信託の売却益にかかる税金を無料計算。特定口座・NISA・損益通算に対応。",
    url: "https://www.toolbox-jp.net/tools/stock-tax",
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
