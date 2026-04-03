import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "有給休暇計算 - 付与日数・消化率・残日数を無料計算 | ToolBox Japan",
  description: "勤続年数から有給休暇の付与日数・取得可能日数を無料計算。有給消化率、消化義務5日の確認、残日数と金銭換算も表示。法改正対応の有給管理ツール。",
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
                name: "有給休暇は入社後いつからもらえますか？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "入社後6ヶ月が経過し、全労働日の8割以上出勤した場合に10日間の有給休暇が付与されます。その後は1年ごとに日数が増え、6年6ヶ月以上で最大20日になります。",
                },
              },
              {
                "@type": "Question",
                name: "有給休暇の時効（有効期間）はいつですか？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "有給休暇の時効は2年間です。付与日から2年以内に取得しないと消滅します。繰越は1年分のみ可能で、最大保有日数は40日（20日×2年分）です。",
                },
              },
              {
                "@type": "Question",
                name: "年5日の有給取得義務はどんな制度ですか？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "2019年4月の法改正で、年10日以上の有給が付与される労働者に対して、会社が年5日以上取得させる義務が生じました。取得が5日未満の場合、会社側に罰則があります。",
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
