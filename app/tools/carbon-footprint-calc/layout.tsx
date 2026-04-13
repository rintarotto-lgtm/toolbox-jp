import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "カーボンフットプリント計算 - 日常生活のCO2排出量を試算 | ToolBox Japan",
  description: "電気・都市ガス・車・食事・飛行機など日常生活のCO2排出量を計算。月間・年間の排出量を算出し、日本人平均と比較。脱炭素・エコ活動の参考に。",
  alternates: { canonical: "https://www.toolbox-jp.net/tools/carbon-footprint-calc" },
  openGraph: {
    title: "カーボンフットプリント計算 - 日常生活のCO2排出量を試算",
    description: "電気・ガス・車・食事・飛行機からCO2排出量を計算。日本人平均と比較。",
    url: "https://www.toolbox-jp.net/tools/carbon-footprint-calc",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "日本人のCO2排出量の平均は？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "1人あたり年間約8〜10トンCO2換算です。世界平均は約4.7トンで、日本は先進国の中では比較的高い水準にあります。",
                },
              },
              {
                "@type": "Question",
                name: "家庭でできるCO2削減は？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "電力会社の再生可能エネルギーへの切り替え、省エネ家電の導入、食肉消費の削減が効果的です。特に電力は家庭のCO2排出量の大きな割合を占めるため、節電と再エネ切り替えが重要です。",
                },
              },
              {
                "@type": "Question",
                name: "カーボンオフセットとは？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "削減困難なCO2排出量を、植林や再生可能エネルギー開発などの活動で相殺する取り組みです。航空会社や企業が導入しており、個人でも購入できるカーボンクレジットがあります。",
                },
              },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
