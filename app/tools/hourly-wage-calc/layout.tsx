import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "時給換算計算 - 年収・月収から実質時給を無料計算 | ToolBox Japan",
  description: "年収・月収・残業時間から実質の時給を無料計算。サラリーマンの実質時給、アルバイトとの比較、転職・副業の時給比較にも活用。通勤時間込みの実質時給も計算。",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "年収500万円のサラリーマンの時給はいくらですか？", acceptedAnswer: { "@type": "Answer", text: "年収500万円で月160時間勤務（残業なし）なら時給約2,600円です。月200時間（残業40時間含む）なら約2,083円になります。通勤時間を含めると実質1,700〜2,000円程度になるケースが多いです。" } },
          { "@type": "Question", name: "最低賃金は2024年いくらですか？", acceptedAnswer: { "@type": "Answer", text: "2024年10月に全国加重平均1,055円に引き上げられました。東京都は1,163円、神奈川県は1,162円が最低賃金です（2024年10月時点）。" } },
          { "@type": "Question", name: "残業代込みの時給計算はどうやりますか？", acceptedAnswer: { "@type": "Answer", text: "月給（手当込み）÷月の総労働時間で計算します。残業代は通常の時給×1.25以上（法定超過分）が支払われる必要があります。" } },
        ],
      }) }} />
      {children}
    </>
  );
}
