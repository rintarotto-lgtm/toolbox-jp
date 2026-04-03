import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "残業代計算【2025年最新】時間外・深夜・休日割増賃金を自動計算 | ツールボックス",
  description:
    "残業代を無料計算。月給・時給から割増賃金を自動計算。時間外（25%増）・深夜（25%増）・休日（35%増）・60時間超（50%増）の割増率に対応。未払い残業代のチェックにも。",
  keywords: [
    "残業代 計算",
    "割増賃金 計算",
    "残業 時給 計算",
    "残業代 未払い",
    "時間外手当 計算",
  ],
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/overtime-calc",
  },
  openGraph: {
    title: "残業代計算【2025年最新】時間外・深夜・休日割増賃金を自動計算",
    description:
      "残業代を無料計算。月給・時給から割増賃金を自動計算。時間外・深夜・休日・60時間超の割増率に完全対応。",
    url: "https://www.toolbox-jp.net/tools/overtime-calc",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "残業代の割増率はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "法定時間外（月60時間まで）は25%増、月60時間超は50%増、深夜（22時〜翌5時）は25%増、法定休日は35%増が義務です。これらは重複して適用されます（例：深夜残業は50%増）。",
      },
    },
    {
      "@type": "Question",
      name: "残業代の計算方法を教えてください。",
      acceptedAnswer: {
        "@type": "Answer",
        text: "1時間あたりの基礎賃金×割増率×残業時間で計算します。月給制の場合、月の所定労働時間で月給を割って時給換算します。",
      },
    },
    {
      "@type": "Question",
      name: "残業代が払われない場合はどうすればいいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "未払い残業代は労働基準監督署に相談できます。時効は2年（2020年4月以降の分は3年）です。タイムカードや業務記録を証拠として保管しておきましょう。",
      },
    },
    {
      "@type": "Question",
      name: "管理職は残業代が出ないのは本当ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "「管理監督者」（労働基準法41条）に該当する場合は時間外・休日割増は適用外ですが、深夜割増は支払い義務があります。名ばかり管理職には残業代の請求権があります。",
      },
    },
  ],
};

export default function OvertimeCalcLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
