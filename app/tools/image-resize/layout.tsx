import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "画像リサイズ - 画像のサイズ変更・圧縮 - ツールボックス",
  description: "画像のサイズ変更・圧縮をブラウザ上で完結。PNG・JPEG・WebP出力対応。品質調整・アスペクト比維持・プレビュー付き。",
  alternates: { canonical: "https://toolbox-jp.vercel.app/tools/image-resize" },
  openGraph: {
    title: "画像リサイズ - 画像のサイズ変更・圧縮 - ツールボックス",
    description: "画像のサイズ変更・圧縮をブラウザ上で完結。PNG・JPEG・WebP出力対応。品質調整・アスペクト比維持・プレビュー付き。",
    url: "https://toolbox-jp.vercel.app/tools/image-resize",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
