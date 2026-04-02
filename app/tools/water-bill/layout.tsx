import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "水道代はどのように計算されますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "水道料金は「基本料金＋従量料金（使用量に応じた料金）」で計算されます。従量料金は使用量が増えるほど単価が高くなる累進制を採用している自治体が多く、また上水道（飲料水・生活用水）と下水道（排水）の両方の料金が請求されます。料金体系は自治体によって大きく異なります。",
      },
    },
    {
      "@type": "Question",
      name: "平均的な水道代はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "全国平均の水道代（上下水道合計）は1人世帯で月約2,000〜3,000円、2人世帯で月約4,000〜5,000円、4人世帯で月約6,000〜8,000円程度です。地域によって料金体系が大きく異なり、同じ使用量でも東京と地方では2倍以上の差が出ることもあります。",
      },
    },
    {
      "@type": "Question",
      name: "節水するとどのくらい水道代が安くなりますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "シャワーを1分短縮すると1回約12L（月約360L）の節水になり、月約70〜100円の節約になります。洗濯機の水量設定を適切にする、食洗機を使う、節水型トイレに交換するなどで年間数千円〜1万円以上の節約も可能です。小まめな節水習慣が積み重なると大きな効果になります。",
      },
    },
    {
      "@type": "Question",
      name: "1日の水道使用量の目安はどのくらいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "日本人1人1日あたりの家庭用水使用量は平均約214L（約0.21㎥）とされています。内訳は風呂・シャワーが最も多く約40%、トイレが約21%、炊事が約18%、洗濯が約15%程度です。4人家族では1日約800〜900L、月に約25〜27㎥程度になります。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "水道料金計算ツール - 使用量から水道代を無料計算 | ツールボックス",
  description:
    "水道使用量（㎥）から水道料金を計算。東京・大阪・名古屋など主要都市の料金体系に対応。シャワー・洗濯・トイレ等の生活行動から使用量も推定できます。",
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/water-bill",
  },
  openGraph: {
    title: "水道料金計算ツール - 使用量から水道代を無料計算",
    description:
      "水道使用量から料金を計算。東京・大阪・名古屋など主要都市対応。生活習慣から使用量推定も。",
    url: "https://www.toolbox-jp.net/tools/water-bill",
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
