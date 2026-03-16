import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "設定 - ToolBox",
  description: "アカウント設定",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
