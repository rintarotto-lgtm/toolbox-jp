import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "YAML ⇔ JSON変換ツール | YAML/JSON相互変換 - ツールボックス",
  description:
    "YAMLとJSONを相互変換。Docker ComposeやKubernetesの設定ファイル変換に便利。シンタックスエラー検出付き。",
  alternates: {
    canonical: "https://toolbox-jp.vercel.app/tools/yaml-json",
  },
  openGraph: {
    title: "YAML ⇔ JSON変換ツール | YAML/JSON相互変換 - ツールボックス",
    description: "YAMLとJSONを相互変換。Docker ComposeやKubernetesの設定ファイル変換に便利。",
    url: "https://toolbox-jp.vercel.app/tools/yaml-json",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
