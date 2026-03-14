import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON整形ツール - 無料オンラインJSONフォーマッター",
  description: "無料のオンラインJSON整形・バリデーションツール。JSONを見やすく整形・フォーマットし、構文エラーも即座に検出。APIレスポンスの確認やデバッグ作業に便利です。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
