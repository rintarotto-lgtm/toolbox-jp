import Link from "next/link";
import AdBanner from "@/components/AdBanner";
import ToolSearch from "@/components/ToolSearch";
import { tools } from "@/lib/tools";

const BASE = "https://www.toolbox-jp.net";

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "無料オンラインツール一覧",
  description: "ツールボックスの全ツール一覧",
  numberOfItems: tools.length,
  itemListElement: tools.map((t, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: t.name,
    url: `${BASE}${t.path}`,
  })),
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "ツールボックスは無料で使えますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい、全てのツールは完全無料でご利用いただけます。会員登録も不要です。",
      },
    },
    {
      "@type": "Question",
      name: "入力したデータはサーバーに送信されますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "いいえ、全てのツールはブラウザ上で動作するため、入力したデータがサーバーに送信されることはありません。プライバシーが守られた状態でご利用いただけます。",
      },
    },
    {
      "@type": "Question",
      name: "スマートフォンでも使えますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい、PC・スマートフォン・タブレット全てに対応しています。インストール不要でブラウザからそのままご利用いただけます。",
      },
    },
    {
      "@type": "Question",
      name: "どんなツールがありますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: `現在${tools.length}種類のツールを提供しています。文字数カウント、JSON整形、QRコード生成、パスワード生成、給料手取り計算、BMI計算、ローン計算、電気代計算など、Web開発・デザイン・生活に役立つツールを網羅しています。`,
      },
    },
  ],
};

const categoryOrder = ["フリマ", "お金", "推し活", "テキスト", "開発", "計算", "デザイン", "セキュリティ", "画像"] as const;

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="text-center mb-6 sm:mb-10">
        <div className="text-4xl sm:text-5xl mb-2 sm:mb-3">🧰</div>
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">
          ツールボックス
        </h1>
        <p className="mt-1 sm:mt-2 text-base sm:text-lg text-gray-500">
          サクッと使える無料オンラインツール
        </p>
        <p className="mt-1 text-xs sm:text-sm text-gray-400">
          全{tools.length}種類 / ブラウザ完結 / データ送信なし
        </p>
      </div>

      {/* Top ad - hidden on mobile to keep tools above the fold */}
      <div className="hidden sm:block">
        <AdBanner />
      </div>

      <ToolSearch tools={tools} />

      <AdBanner />

      {/* SSR tool links for Google crawler - ensures all 50 tools are discoverable */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6">カテゴリ別ツール一覧</h2>
        {categoryOrder.map((cat) => {
          const catTools = tools.filter((t) => t.category === cat);
          if (catTools.length === 0) return null;
          return (
            <div key={cat} className="mb-6">
              <h3 className="text-sm font-bold text-gray-600 mb-2">{cat}（{catTools.length}）</h3>
              <div className="flex flex-wrap gap-2">
                {catTools.map((tool) => (
                  <Link
                    key={tool.id}
                    href={tool.path}
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline bg-blue-50 px-3 py-1.5 rounded-lg"
                  >
                    {tool.name}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      <section className="mt-12 bg-white rounded-xl border border-gray-200 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">よくある質問</h2>
        <div className="space-y-5">
          {[
            { q: "ツールボックスは無料で使えますか？", a: "はい、全てのツールは完全無料でご利用いただけます。会員登録も不要です。" },
            { q: "入力したデータはサーバーに送信されますか？", a: "いいえ、全てのツールはブラウザ上で動作するため、入力したデータがサーバーに送信されることはありません。プライバシーが守られた状態でご利用いただけます。" },
            { q: "スマートフォンでも使えますか？", a: "はい、PC・スマートフォン・タブレット全てに対応しています。インストール不要でブラウザからそのままご利用いただけます。" },
            { q: "どんなツールがありますか？", a: `現在${tools.length}種類のツールを提供しています。文字数カウント、JSON整形、QRコード生成、パスワード生成、給料手取り計算、BMI計算、ローン計算、電気代計算など、Web開発・デザイン・生活に役立つツールを網羅しています。` },
          ].map(({ q, a }) => (
            <details key={q} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <summary className="text-sm font-semibold text-gray-800 cursor-pointer hover:text-blue-600 list-none flex justify-between items-center">
                {q}
                <span className="text-gray-400 ml-2">＋</span>
              </summary>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-6 bg-white rounded-xl border border-gray-200 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">ツールボックスについて</h2>
        <div className="text-sm text-gray-600 space-y-3 leading-relaxed">
          <p>
            ツールボックスは、Web開発者・デザイナー・ライターの日常業務をサポートする無料オンラインツール集です。
            全てのツールはブラウザ上で動作するため、入力したデータがサーバーに送信されることはありません。
            プライバシーを重視し、安心してご利用いただけます。
          </p>
          <p>
            文字数カウント、JSON整形、QRコード生成、パスワード生成、Base64変換、カラーコード変換、
            テキスト差分比較、正規表現テスター、ハッシュ生成、Unix時間変換、CSSグラデーション生成、
            メタタグ生成、Markdownテーブル生成、.gitignore生成など、
            {tools.length}種類のツールを全て無料で提供しています。
          </p>
          <p>
            インストール不要で、PC・スマートフォン・タブレットからいつでもアクセスできます。
            ブックマークに追加して、日々の作業効率化にお役立てください。
          </p>
        </div>
      </section>
    </div>
  );
}
