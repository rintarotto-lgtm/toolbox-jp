import ToolCard from "@/components/ToolCard";
import AdBanner from "@/components/AdBanner";
import { tools } from "@/lib/tools";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          無料オンラインツール集
        </h1>
        <p className="mt-3 text-gray-500 max-w-xl mx-auto">
          開発者・デザイナー・ライター向けの便利ツールが全て無料。
          ブラウザ上で動作し、データはサーバーに送信されません。
        </p>
      </div>

      <AdBanner />

      <div className="grid sm:grid-cols-2 gap-4">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      <AdBanner />

      <section className="mt-16 bg-white rounded-xl border border-gray-200 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">ToolBoxについて</h2>
        <div className="text-sm text-gray-600 space-y-3 leading-relaxed">
          <p>
            ToolBoxは、Web開発者・デザイナー・ライターの日常業務をサポートする無料オンラインツール集です。
            全てのツールはブラウザ上で動作するため、入力したデータがサーバーに送信されることはありません。
          </p>
          <p>
            文字数カウント、JSON整形、QRコード生成、パスワード生成、Base64変換、URLエンコード、
            カラーコード変換、テキスト差分比較、Markdownプレビュー、テキスト一括置換など、
            10種類以上のツールを提供しています。
          </p>
        </div>
      </section>
    </div>
  );
}
