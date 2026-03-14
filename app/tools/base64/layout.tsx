import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Base64変換 - エンコード・デコードツール",
  description: "Base64エンコード・デコードを無料でオンライン変換。テキストや画像データのBase64変換に対応し、Web開発やAPIデータの確認・検証作業を効率化します。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
