import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "所得税の計算方法を教えてください",
      acceptedAnswer: {
        "@type": "Answer",
        text: "所得税は「課税所得 × 税率 - 控除額」で計算します。まず給与収入から給与所得控除を差し引き「給与所得」を求め、そこから基礎控除・扶養控除・社会保険料控除などを差し引いた「課税所得」に税率を掛けます。最終的に復興特別所得税（×2.1%）を加算します。",
      },
    },
    {
      "@type": "Question",
      name: "基礎控除の金額はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "2020年以降、基礎控除は合計所得金額2,400万円以下の場合48万円です。合計所得が2,400万円を超えると段階的に減少し、2,500万円超では0円になります。",
      },
    },
    {
      "@type": "Question",
      name: "扶養控除の種類と金額を教えてください",
      acceptedAnswer: {
        "@type": "Answer",
        text: "扶養控除には一般扶養（16〜18歳・23〜69歳）38万円、特定扶養（19〜22歳）63万円、老人扶養（70歳以上・同居の場合）58万円などがあります。このシミュレーターでは一般扶養として1人38万円で計算しています。",
      },
    },
    {
      "@type": "Question",
      name: "所得税と住民税の違いは何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "所得税は国税で超過累進課税（5〜45%）、住民税は地方税で一律10%（道府県民税4%＋市町村民税6%）です。住民税は前年の所得をもとに翌年6月から納付します。このツールは所得税のみを計算します。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "所得税計算シミュレーター【2025年最新】年収・控除から所得税額を計算 | ツールボックス",
  description:
    "年収・各種控除から所得税を無料計算。給与所得控除・基礎控除・扶養控除・社会保険料控除など控除項目を細かく設定。課税所得と所得税率の内訳も表示。",
  keywords: ["所得税 計算", "所得税 シミュレーション", "課税所得 計算", "所得税率 計算", "所得税 控除"],
  alternates: { canonical: "https://www.toolbox-jp.net/tools/income-tax-calc" },
  openGraph: {
    title: "所得税計算シミュレーター【2025年最新】",
    description: "年収・各種控除から所得税を無料計算。課税所得と所得税率の内訳も表示。",
    url: "https://www.toolbox-jp.net/tools/income-tax-calc",
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
