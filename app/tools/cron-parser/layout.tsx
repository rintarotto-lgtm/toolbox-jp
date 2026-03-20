import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cron式解説ツール | crontab変換・次回実行時刻表示",
  description:
    "Cron式（crontab）を日本語で分かりやすく解説。次の実行予定時刻やよく使うプリセット一覧も表示。スケジュール設定の確認に便利。",
  openGraph: {
    title: "Cron式解説ツール | crontab変換・次回実行時刻表示",
    description:
      "Cron式を日本語で解説。次の実行予定時刻やプリセット一覧も表示。",
    url: "https://toolbox-jp.net/tools/cron-parser",
  },
  alternates: { canonical: "https://toolbox-jp.net/tools/cron-parser" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
