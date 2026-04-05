import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "行事・記念日カウントダウン計算 - 次のイベントまで何日？ | ToolBox Japan",
  description: "誕生日・クリスマス・正月・バレンタインなど次のイベントまで何日か無料計算。複数の記念日を登録してカウントダウン一覧表示。大切な日を忘れないために。",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "次のクリスマスまで何日ですか？", acceptedAnswer: { "@type": "Answer", text: "毎年12月25日がクリスマスです。このツールで今日から次の12月25日まで何日かを自動計算できます。" } },
          { "@type": "Question", name: "記念日のカウントダウンはどうやって計算しますか？", acceptedAnswer: { "@type": "Answer", text: "今日の日付からイベント日付を引くだけです。例えば今日が4月1日で誕生日が7月15日なら、105日後になります。" } },
          { "@type": "Question", name: "毎年繰り返すイベントの日程はどう計算しますか？", acceptedAnswer: { "@type": "Answer", text: "今年の日付が過ぎていれば自動的に来年の日付でカウントダウンを計算します。誕生日・記念日など毎年繰り返すイベントに対応しています。" } },
        ],
      }) }} />
      {children}
    </>
  );
}
