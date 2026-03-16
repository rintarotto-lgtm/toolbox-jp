import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "請求管理 - ToolBox",
  description: "サブスクリプションと請求情報の管理",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
