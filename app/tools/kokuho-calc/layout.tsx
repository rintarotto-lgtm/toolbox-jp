import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "国民健康保険料はどのように計算されますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "国民健康保険料は「医療分」「後期高齢者支援金分」（40〜64歳は「介護分」も）の合計です。各区分は「所得割（前年所得に料率をかけた額）」と「均等割（加入者数×定額）」で構成されます。料率は市区町村ごとに異なるため、実際の金額はお住まいの自治体の窓口や公式サイトでご確認ください。",
      },
    },
    {
      "@type": "Question",
      name: "国民健康保険料を安くする方法はありますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "主な節約方法として、①前年所得が一定以下の場合は均等割の2〜7割軽減が自動適用されます（世帯の合計所得43万円以下で7割軽減など）。②会社員の配偶者に扶養してもらえれば保険料が0円になります。③退職後は任意継続被保険者として最大2年間、在職中の保険料水準を維持できる場合があります。いずれも条件があるためご自身の状況を確認してください。",
      },
    },
    {
      "@type": "Question",
      name: "国民健康保険と社会保険（健康保険）の違いは何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "社会保険（健康保険）は会社員・公務員が対象で、保険料の約半分を会社が負担します。そのため同じ年収でも自己負担は国民健康保険の半分程度になる場合が多いです。一方、国民健康保険は自営業・フリーランス・退職後の方などが加入し、保険料は全額自己負担です。傷病手当金や出産手当金がないなど給付内容にも違いがあります。",
      },
    },
    {
      "@type": "Question",
      name: "国民健康保険にはいつ加入しますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "会社を退職して社会保険の資格を失った日や、海外から転入した日など、他の公的医療保険の被保険者でなくなった翌日から国民健康保険への加入義務が発生します。加入手続きはお住まいの市区町村窓口で行い、原則として14日以内に届け出る必要があります。手続きが遅れた場合も加入日（資格取得日）まで遡って保険料が発生します。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "国民健康保険料計算シミュレーター - 年収から保険料を無料計算 | ツールボックス",
  description:
    "フリーランス・自営業・退職後の方向けに国民健康保険料を無料でシミュレーション。前年所得・世帯人数・都道府県を入力するだけで年間・月額保険料の概算を瞬時に計算。社会保険との差額比較や節約ヒントも掲載。",
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/kokuho-calc",
  },
  openGraph: {
    title: "国民健康保険料計算シミュレーター - 年収から保険料を無料計算",
    description:
      "フリーランス・自営業・退職後の方向けに国民健康保険料を無料シミュレーション。所得・世帯人数・都道府県から年間・月額を計算。",
    url: "https://www.toolbox-jp.net/tools/kokuho-calc",
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
