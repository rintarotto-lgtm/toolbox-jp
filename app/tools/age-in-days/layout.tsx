import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "生後日数計算 - 誕生日から何日目か・年齢を日数で表示 | ToolBox Japan",
  description: "生年月日から今日まで何日生きているかを無料計算。赤ちゃんの生後日数・週数、100日・1000日・誕生日までのカウントダウンも表示。記念日計算に便利。",
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
                name: "赤ちゃんのお食い初めは生後何日ですか？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "お食い初めは生後100日（または110日）に行うのが一般的です。「一生食べることに困らないように」という願いを込めた日本の伝統行事です。",
                },
              },
              {
                "@type": "Question",
                name: "生後1000日の記念日はいつですか？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "生後1000日は約2年8ヶ月（2歳8ヶ月頃）です。近年は「ハーフバースデー（生後6ヶ月）」や「1000日記念」を祝う家庭も増えています。",
                },
              },
              {
                "@type": "Question",
                name: "人間は一生で何日生きますか？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "日本人の平均寿命（約84歳）で計算すると約30,660日です。80歳で約29,200日、90歳で約32,850日になります。",
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
