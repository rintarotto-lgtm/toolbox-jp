import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "医療費控除の「10万円の壁」とは何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "医療費控除は、1年間に支払った医療費が10万円（または総所得金額の5%）を超えた部分が控除対象となります。ただし総所得が200万円未満の方は「総所得×5%」が基準となるため、10万円以下でも控除を受けられる場合があります。",
      },
    },
    {
      "@type": "Question",
      name: "医療費控除の対象になる医療費はどんなものですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "診察・治療費、処方薬の購入費、入院費（食事代含む）、歯の治療費、介護サービス費などが対象です。一方、健康診断（疾病が発見された場合は対象）、予防接種、美容整形、眼鏡・コンタクト代（治療目的を除く）は原則対象外です。生計を一にする家族の医療費も合算できます。",
      },
    },
    {
      "@type": "Question",
      name: "セルフメディケーション税制とは何ですか？通常の医療費控除と違いは？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "セルフメディケーション税制は、市販のスイッチOTC医薬品を年間1万2千円超購入した場合に、超えた金額（上限8万8千円）を控除できる制度です。通常の医療費控除との選択制で、医療費が10万円に達しない場合でも適用できるのが利点です。健康の維持増進の取り組み（健康診断受診など）が要件となります。",
      },
    },
    {
      "@type": "Question",
      name: "医療費控除はどうやって申告しますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "医療費控除は年末調整では手続きできず、確定申告が必要です。翌年の2月16日〜3月15日に確定申告書と医療費控除の明細書を提出します。領収書の提出は不要になりましたが、5年間の保管義務があります。e-Taxを使えばオンラインで申告できます。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title:
    "医療費控除計算シミュレーター【2024年確定申告対応】いくら戻る？ | ツールボックス",
  description:
    "医療費控除でいくら還付される？年収・医療費を入力するだけで控除額と還付金を計算。10万円の壁・セルフメディケーション税制の比較も。2024年確定申告対応。",
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/medical-deduction",
  },
  openGraph: {
    title: "医療費控除計算シミュレーター【2024年確定申告対応】いくら戻る？",
    description:
      "年収・医療費を入力するだけで控除額と還付金を計算。10万円の壁・セルフメディケーション税制の比較も。",
    url: "https://www.toolbox-jp.net/tools/medical-deduction",
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
