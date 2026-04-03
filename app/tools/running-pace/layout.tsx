import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "ランニングペース計算 - マラソン・5km完走タイム予測 | ToolBox Japan",
  description: "ランニングのペース・タイム・距離を相互計算。マラソン（42.195km）・ハーフ・10km・5kmの完走タイムをペースから予測。サブ4・サブ3目標ペースも計算。",
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
                name: "マラソンサブ4のペースはどれくらいですか？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "サブ4（4時間切り）のペースは1kmあたり約5分41秒です。これを42.195km維持すると3時間59分59秒でゴールできます。",
                },
              },
              {
                "@type": "Question",
                name: "ランニングの適切なペースはどれくらいですか？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "初心者は1kmあたり7〜8分、中級者は5〜6分、上級者は4〜5分が目安です。ゆっくり話せる程度のペースが有酸素運動に最適です。",
                },
              },
              {
                "@type": "Question",
                name: "5kmを30分で走るには1kmのペースはどれくらいですか？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "5kmを30分で走るには1kmあたり6分00秒のペースが必要です。この計算ツールで距離とタイムを入力するとペースが自動計算されます。",
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
