import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "日本人1人当たりのCO2排出量はどのくらいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "日本人の年間CO2排出量は1人当たり約7〜9トンとされています。世界平均は約4トンで、パリ協定の目標（2050年カーボンニュートラル）には1人あたり2トン以下が必要です。",
      },
    },
    {
      "@type": "Question",
      name: "一番CO2を減らせる行動は何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "最も効果が大きいのは食事（特に牛肉の消費削減）、航空機利用の削減、自動車からの電車・自転車への転換です。電力の再エネ切り替えも効果的です。",
      },
    },
    {
      "@type": "Question",
      name: "電気1kWhあたりのCO2排出量はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "日本の電力のCO2排出係数は約0.43kg-CO2/kWh（2022年度）です。再生可能エネルギー100%の電力会社に切り替えることで大幅削減できます。",
      },
    },
    {
      "@type": "Question",
      name: "カーボンオフセットとは何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "削減困難なCO2排出量を、植林や再エネ事業への投資などで相殺することです。1トンのCO2オフセットは数百〜数千円程度で購入できます。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "カーボンフットプリント計算【CO2排出量診断】生活の環境負荷を計算 | ツールボックス",
  description:
    "日常生活のCO2排出量を無料計算。電気・ガス・移動・食事・買い物の習慣からカーボンフットプリントを算出。削減目標と節約のヒントも提案。",
  keywords: [
    "カーボンフットプリント 計算",
    "CO2排出量 計算",
    "環境負荷 計算",
    "温室効果ガス 計算",
    "脱炭素 シミュレーション",
  ],
  alternates: { canonical: "https://www.toolbox-jp.net/tools/carbon-footprint" },
  openGraph: {
    title: "カーボンフットプリント計算【CO2排出量診断】生活の環境負荷を計算",
    description:
      "電気・ガス・移動・食事・買い物の習慣から年間CO2排出量を算出。削減アクションの効果もシミュレーション。",
    url: "https://www.toolbox-jp.net/tools/carbon-footprint",
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
