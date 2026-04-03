import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "1畳は何平米ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "畳のサイズは地域によって異なります。江戸間（関東標準）は1畳≒1.548㎡、京間（関西）は1畳≒1.824㎡、団地サイズは1畳≒1.444㎡です。不動産広告では1畳=1.62㎡で計算されることが多いです。",
      },
    },
    {
      "@type": "Question",
      name: "1坪は何平米ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "1坪 = 約3.3058㎡（正確には約3.30578512㎡）です。また1坪 = 2畳（江戸間）です。",
      },
    },
    {
      "@type": "Question",
      name: "1LDKと2LDKの広さの違いは？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "一般的に1LDKは30〜45㎡、2LDKは45〜60㎡程度が目安です。LDK部分は10畳以上、Dがある場合はさらに広くなります。",
      },
    },
    {
      "@type": "Question",
      name: "部屋の広さはどうやって測りますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "部屋の縦×横の長さ（m）を掛けて㎡が求められます。壁から壁の内法寸法で測るのが一般的です。不動産広告の面積は壁の中心線で測る壁芯計算が多いため実際より広く表示されることがあります。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "部屋の広さ計算【畳・坪・㎡変換】間取り別の広さを比較 | ツールボックス",
  description:
    "部屋の広さを畳・坪・㎡で相互変換。間取り（1K・1LDK・2LDK等）の広さ目安も確認できます。引越し・不動産選びの参考に。",
  keywords: ["畳 坪 平米 変換", "部屋 広さ 計算", "間取り 広さ", "坪 計算", "㎡ 畳 換算"],
  alternates: { canonical: "https://www.toolbox-jp.net/tools/room-size" },
  openGraph: {
    title: "部屋の広さ計算【畳・坪・㎡変換】間取り別の広さを比較",
    description: "部屋の広さを畳・坪・㎡で相互変換。間取り別の広さ目安も確認。",
    url: "https://www.toolbox-jp.net/tools/room-size",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  );
}
