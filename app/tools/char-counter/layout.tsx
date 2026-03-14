import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "文字数カウンター - 無料オンライン文字数チェック",
  description: "無料で使えるオンライン文字数カウンターツール。文字数・単語数・行数をリアルタイムで計測。ツイートやSNS投稿、レポート作成時の文字数チェックに最適です。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
