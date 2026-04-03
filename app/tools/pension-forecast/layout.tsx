import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "将来の年金受給額シミュレーター - 老齢年金を無料試算 | ToolBox Japan",
  description: "現在の年収・加入年数・受給開始年齢から老齢厚生年金・老齢基礎年金の受給額を無料シミュレーション。繰上げ・繰下げ受給の影響も計算。老後資金計画に活用。",
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
                name: "年金はいくらもらえますか？平均はどれくらいですか？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "老齢基礎年金の満額は約79,000円/月（令和6年度）です。厚生年金は現役時代の平均報酬月額と加入期間により異なり、平均は約14万円/月（夫婦2人で約22万円）程度です。",
                },
              },
              {
                "@type": "Question",
                name: "年金の繰下げ受給はいつまでできますか？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "75歳まで繰下げ受給が可能です。65歳を基準に1ヶ月繰下げるごとに0.7%増額され、最大75歳まで繰下げると84%増（65歳受給の1.84倍）になります。",
                },
              },
              {
                "@type": "Question",
                name: "iDeCo（個人型確定拠出年金）と年金どちらを優先すべきですか？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "公的年金は強制加入で老後の基盤となります。iDeCoは節税効果があり、公的年金の上乗せとして活用するのがおすすめです。両方を組み合わせた老後資金設計が理想的です。",
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
