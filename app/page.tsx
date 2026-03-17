import AdBanner from "@/components/AdBanner";
import ToolSearch from "@/components/ToolSearch";
import { tools } from "@/lib/tools";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="text-5xl mb-3">🧰</div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          ツールボックス
        </h1>
        <p className="mt-2 text-lg text-gray-500">
          サクッと使える無料オンラインツール
        </p>
        <p className="mt-1 text-sm text-gray-400">
          全{tools.length}種類 / ブラウザ完結 / データ送信なし
        </p>
      </div>

      <AdBanner />

      <ToolSearch tools={tools} />

      <AdBanner />

      <section className="mt-16 bg-white rounded-xl border border-gray-200 p-8">
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
