import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "自動車税の計算方法を教えてください",
      acceptedAnswer: {
        "@type": "Answer",
        text: "自動車税（種別割）は排気量によって年税額が決まります。例えば1,000cc以下は年25,000円、2,000cc以下は年36,000円です。軽自動車は一律10,800円（軽自動車税）です。年度途中で新規登録した場合は月割りで計算され、登録月から3月末までの月数分の税額を納付します。",
      },
    },
    {
      "@type": "Question",
      name: "排気量による自動車税の違いを教えてください",
      acceptedAnswer: {
        "@type": "Answer",
        text: "自動車税（普通車）の税額は排気量で決まります。1,000cc以下：25,000円、1,500cc以下：30,500円、2,000cc以下：36,000円、2,500cc以下：43,500円、3,000cc以下：50,000円、4,000cc以下：65,500円、6,000cc以下：87,000円、6,000cc超：110,000円です。軽自動車は一律10,800円です。",
      },
    },
    {
      "@type": "Question",
      name: "環境性能割とは何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "環境性能割は自動車の取得時にかかる税金で、取得価格（中古車は課税標準基準価格）に燃費性能に応じた税率（非課税・1%・2%・3%）を掛けて計算します。燃費が優れた車ほど税率が低くなります。電気自動車やハイブリッド車は非課税になる場合があります。",
      },
    },
    {
      "@type": "Question",
      name: "自動車税の月割り計算はどうやって行いますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "自動車税は4月1日を基準日として年税額が課税されます。年度途中（5月〜翌3月）に新規登録した場合は月割りで課税され、登録月から3月末までの月数分（最大11ヶ月）の税額が課税されます。なお、廃車・売却時は月割りで還付される場合があります。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "自動車税計算シミュレーター - 排気量別の税額・月割りを無料計算 | ツールボックス",
  description:
    "自動車税（種別割）を排気量から計算。新車・中古車の取得時にかかる環境性能割も計算。月割り還付額・グリーン化特例（減税）も対応。",
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/car-tax",
  },
  openGraph: {
    title: "自動車税計算シミュレーター - 排気量別の税額・月割りを無料計算",
    description:
      "自動車税を排気量から計算。環境性能割・月割り計算・グリーン化特例にも対応。",
    url: "https://www.toolbox-jp.net/tools/car-tax",
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
