import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "画像Base64変換 - 画像をBase64エンコード - ToolBox",
  description: "画像ファイルをBase64文字列に変換。Data URI形式でHTMLやCSSに直接埋め込み可能。PNG、JPEG、GIF、SVG対応。",
  alternates: { canonical: "https://toolbox-jp.vercel.app/tools/image-base64" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
