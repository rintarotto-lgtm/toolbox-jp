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
            プライバシーを重視し、安心して利用できます。
          </p>
          <p>
            文字数カウント、JSON整形・フォーマッター、QRコード生成、パスワード生成、Base64エンコード・デコード、
            URLエンコード・デコード、カラーコード変換（HEX・RGB・HSL）、テキスト差分比較、Markdownプレビュー、
            テキスト一括置換、半角全角変換、ハッシュ生成（SHA-256等）、Unix時間変換、バイト数カウント、
            正規表現テスター、HTMLエスケープ・アンエスケープ、SNS文字数チェッカー、ダミーテキスト生成、
            JSON→CSV変換、アスペクト比計算、進数変換（2進数・8進数・16進数）、JWTデコーダー、Cron式解説、
            文字コード判定、IPアドレス情報・CIDR計算、UUID生成、CSV→JSON変換、YAML⇔JSON変換、
            SQL整形、CSS圧縮・整形、絵文字検索、日時計算、スラッグ生成、文字列エスケープ、HTML→Markdown変換、
            テキスト変換（大文字・小文字・キャメルケース）、XML整形、URL解析、Chmod計算機、行ソート・重複削除、
            CSSグラデーション生成、ボックスシャドウ生成、メタタグ生成、Markdownテーブル生成、.gitignore生成、
            単語出現頻度カウンター、Punycode変換、JSONPathテスター、OGPプレビュー、画像Base64変換など、
            50種類のツールを無料で提供しています。
          </p>
          <p>
            インストール不要で、PC・スマートフォン・タブレットからいつでもアクセスできます。
            ブックマークに追加して、日々の作業効率化にお役立てください。
          </p>
        </div>
      </section>

      <section className="mt-8 bg-white rounded-xl border border-gray-200 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">カテゴリ別ツール一覧</h2>
        <div className="text-sm text-gray-600 space-y-4 leading-relaxed">
          <div>
            <h3 className="font-bold text-gray-800 mb-1">📝 テキスト・文字列ツール</h3>
            <p>文字数カウンター、SNS文字数チェッカー、バイト数カウント、テキスト一括置換、半角全角変換、ダミーテキスト生成、テキスト差分比較、Markdownプレビュー、文字コード判定、絵文字検索、HTML→Markdown変換</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-1">💻 開発者ツール</h3>
            <p>JSON整形ツール、Base64エンコード・デコード、URLエンコード・デコード、HTMLエスケープ、正規表現テスター、ハッシュ生成、Unix時間変換、進数変換、JSON→CSV変換、CSV→JSON変換、YAML⇔JSON変換、JWTデコーダー、Cron式解説、バイト数カウント、IPアドレス情報・CIDR計算、UUID生成、SQL整形、CSS圧縮・整形、日時計算、スラッグ生成、文字列エスケープ</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-1">🎨 デザイン・メディアツール</h3>
            <p>カラーコード変換、QRコード生成、アスペクト比計算、Markdownプレビュー</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-1">🔒 セキュリティツール</h3>
            <p>パスワード生成（安全なランダムパスワード）、ハッシュ生成（SHA-1/256/384/512）</p>
          </div>
        </div>
      </section>
    </div>
  );
}
