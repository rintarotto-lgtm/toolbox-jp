import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QRコード生成 - 無料オンラインQRコード作成",
  description: "無料でQRコードをオンライン作成。URL・テキスト・連絡先などを瞬時にQRコード化し、PNG画像としてダウンロード可能。登録不要で即利用できます。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
