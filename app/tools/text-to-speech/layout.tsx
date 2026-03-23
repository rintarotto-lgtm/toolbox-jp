import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "テキスト読み上げ - Web Speech APIで音声合成",
  description: "テキストをブラウザの音声合成機能で読み上げ。日本語音声対応、速度・ピッチ調整可能。Web Speech API使用の無料オンラインツール。",
  alternates: { canonical: "https://www.toolbox-jp.net/tools/text-to-speech" },
  openGraph: {
    title: "テキスト読み上げ - Web Speech APIで音声合成",
    description: "テキストをブラウザで読み上げ。日本語音声対応、速度・ピッチ調整可能。",
    url: "https://www.toolbox-jp.net/tools/text-to-speech",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
