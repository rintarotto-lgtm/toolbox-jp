export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  path: string;
  category: string;
  keywords: string[];
}

export const tools: Tool[] = [
  {
    id: "char-counter",
    name: "文字数カウンター",
    description: "テキストの文字数・単語数・行数をリアルタイムでカウント。全角・半角も区別して表示。",
    icon: "Aa",
    path: "/tools/char-counter",
    category: "テキスト",
    keywords: ["文字数カウント", "文字数", "ワードカウント", "文字数チェック"],
  },
  {
    id: "json-formatter",
    name: "JSON整形ツール",
    description: "JSONデータを見やすく整形・検証。シンタックスエラーも即座に検出。",
    icon: "{}",
    path: "/tools/json-formatter",
    category: "開発",
    keywords: ["JSON整形", "JSON検証", "JSONフォーマッター", "JSON変換"],
  },
  {
    id: "qr-generator",
    name: "QRコード生成",
    description: "URLやテキストからQRコードを瞬時に作成。PNG画像でダウンロード可能。",
    icon: "QR",
    path: "/tools/qr-generator",
    category: "画像",
    keywords: ["QRコード作成", "QRコード生成", "QRコード"],
  },
  {
    id: "password-gen",
    name: "パスワード生成",
    description: "安全なランダムパスワードを生成。長さ・文字種をカスタマイズ可能。",
    icon: "PW",
    path: "/tools/password-gen",
    category: "セキュリティ",
    keywords: ["パスワード生成", "ランダムパスワード", "安全なパスワード"],
  },
  {
    id: "base64",
    name: "Base64変換",
    description: "テキストをBase64にエンコード・デコード。日本語も完全対応。",
    icon: "B64",
    path: "/tools/base64",
    category: "開発",
    keywords: ["Base64変換", "Base64エンコード", "Base64デコード"],
  },
  {
    id: "url-encode",
    name: "URLエンコード/デコード",
    description: "URLの特殊文字をエンコード・デコード。日本語URLの変換に便利。",
    icon: "%",
    path: "/tools/url-encode",
    category: "開発",
    keywords: ["URLエンコード", "URLデコード", "パーセントエンコーディング"],
  },
  {
    id: "color-converter",
    name: "カラーコード変換",
    description: "HEX・RGB・HSLを相互変換。カラーピッカーで直感的に色を選択。",
    icon: "C",
    path: "/tools/color-converter",
    category: "デザイン",
    keywords: ["カラーコード変換", "HEX変換", "RGB変換", "色変換"],
  },
  {
    id: "text-diff",
    name: "テキスト差分比較",
    description: "2つのテキストの差分をハイライト表示。変更箇所が一目でわかる。",
    icon: "+-",
    path: "/tools/text-diff",
    category: "テキスト",
    keywords: ["テキスト差分", "テキスト比較", "diff", "文章比較"],
  },
  {
    id: "markdown-preview",
    name: "Markdownプレビュー",
    description: "Markdownをリアルタイムでプレビュー。コピー&ペーストですぐ確認。",
    icon: "MD",
    path: "/tools/markdown-preview",
    category: "テキスト",
    keywords: ["Markdownプレビュー", "マークダウン", "Markdown変換"],
  },
  {
    id: "text-replace",
    name: "テキスト一括置換",
    description: "テキスト内の文字列を一括置換。正規表現にも対応。",
    icon: "ab",
    path: "/tools/text-replace",
    category: "テキスト",
    keywords: ["テキスト置換", "文字列置換", "一括置換", "検索置換"],
  },
];
