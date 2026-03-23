import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "改行コード変換 - LF・CRLF・CRを相互変換",
  description: "テキストの改行コードをLF（Unix/Mac）・CRLF（Windows）・CR（旧Mac）に相互変換。現在の改行コードも自動判定。",
  alternates: { canonical: "https://www.toolbox-jp.net/tools/newline-converter" },
  openGraph: {
    title: "改行コード変換 - LF・CRLF・CRを相互変換",
    description: "テキストの改行コードをLF（Unix/Mac）・CRLF（Windows）・CR（旧Mac）に相互変換。現在の改行コードも自動判定。",
    url: "https://www.toolbox-jp.net/tools/newline-converter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
