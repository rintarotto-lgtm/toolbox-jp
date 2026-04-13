import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "犬・猫の年齢換算 - ペットの年齢を人間の年齢に換算 | ToolBox Japan",
  description: "犬・猫の年齢を人間の年齢に換算。犬種サイズ別（小型・中型・大型）の換算式、猫の年齢早見表付き。ペットのライフステージ（子犬・成犬・シニア・老齢）も確認できます。",
  alternates: { canonical: "https://www.toolbox-jp.net/tools/dog-age-calc" },
  openGraph: {
    title: "犬・猫の年齢換算 - ペットの年齢を人間の年齢に換算",
    description: "犬・猫の年齢を人間換算。サイズ別対応・年齢早見表付き。",
    url: "https://www.toolbox-jp.net/tools/dog-age-calc",
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
                name: "犬1歳は人間の何歳？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "小型犬で約15〜17歳相当です。犬は最初の1〜2年で急速に成長するため、人間の年齢換算では10代後半に相当します。大型犬は成長が早くより年齢が高くなります。",
                },
              },
              {
                "@type": "Question",
                name: "犬のシニア期はいつから？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "小型犬は10歳頃、大型犬は7〜8歳頃からシニア期とされます。シニア期以降は健康管理や食事に注意が必要で、定期的な獣医師の検診をおすすめします。",
                },
              },
              {
                "@type": "Question",
                name: "猫と犬では年齢換算が違う？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "はい、異なります。猫は2歳以降の換算が犬と少し異なり、全体的に長生きの傾向があります。猫の平均寿命は15〜20歳で、人間換算では76〜96歳相当になります。",
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
