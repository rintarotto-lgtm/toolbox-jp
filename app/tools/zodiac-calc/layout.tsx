import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "干支・星座計算 - 生年月日から干支・十二星座・血液型相性を無料判定 | ToolBox Japan",
  description: "生年月日から干支（えと）と十二星座を無料で自動判定。今年の干支や来年の干支も確認。12星座の性格特徴・相性ランキングも掲載。",
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
                name: "2024年の干支は何ですか？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "2024年（令和6年）の干支は「辰（たつ）」です。辰年は十二支の5番目で、12年ごとに巡ってきます。",
                },
              },
              {
                "@type": "Question",
                name: "干支はいつから変わりますか？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "干支は1月1日（元旦）から変わります。ただし旧暦（中国式）では立春（2月4日頃）から変わるという考え方もあります。",
                },
              },
              {
                "@type": "Question",
                name: "12星座の分かれ目の日付はどうやって計算しますか？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "星座の区切りは太陽の黄道上の位置で決まります。例えば牡羊座は3月21日頃から4月19日頃まで。正確な日付は年により1〜2日前後します。",
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
