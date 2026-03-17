"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

interface Rule {
  id: string;
  userAgent: string;
  directives: { type: "Allow" | "Disallow"; path: string }[];
}

const presets: Record<string, { label: string; rules: Rule[]; sitemap: string }> = {
  basic: {
    label: "基本（すべて許可）",
    rules: [{ id: "1", userAgent: "*", directives: [{ type: "Allow", path: "/" }] }],
    sitemap: "/sitemap.xml",
  },
  wordpress: {
    label: "WordPress",
    rules: [
      {
        id: "1",
        userAgent: "*",
        directives: [
          { type: "Disallow", path: "/wp-admin/" },
          { type: "Allow", path: "/wp-admin/admin-ajax.php" },
          { type: "Disallow", path: "/wp-includes/" },
          { type: "Disallow", path: "/?s=" },
          { type: "Disallow", path: "/search/" },
        ],
      },
    ],
    sitemap: "/sitemap.xml",
  },
  nextjs: {
    label: "Next.js",
    rules: [
      {
        id: "1",
        userAgent: "*",
        directives: [
          { type: "Allow", path: "/" },
          { type: "Disallow", path: "/_next/" },
          { type: "Disallow", path: "/api/" },
        ],
      },
    ],
    sitemap: "/sitemap.xml",
  },
  strict: {
    label: "厳格（すべて拒否）",
    rules: [{ id: "1", userAgent: "*", directives: [{ type: "Disallow", path: "/" }] }],
    sitemap: "",
  },
  noai: {
    label: "AI クローラーをブロック",
    rules: [
      { id: "1", userAgent: "*", directives: [{ type: "Allow", path: "/" }] },
      { id: "2", userAgent: "GPTBot", directives: [{ type: "Disallow", path: "/" }] },
      { id: "3", userAgent: "ChatGPT-User", directives: [{ type: "Disallow", path: "/" }] },
      { id: "4", userAgent: "CCBot", directives: [{ type: "Disallow", path: "/" }] },
      { id: "5", userAgent: "Google-Extended", directives: [{ type: "Disallow", path: "/" }] },
    ],
    sitemap: "/sitemap.xml",
  },
};

let nextId = 100;

export default function RobotsGenTool() {
  const [rules, setRules] = useState<Rule[]>([
    { id: "1", userAgent: "*", directives: [{ type: "Allow", path: "/" }] },
  ]);
  const [sitemap, setSitemap] = useState("/sitemap.xml");
  const [siteUrl, setSiteUrl] = useState("https://example.com");
  const [copied, setCopied] = useState(false);

  const addRule = () => {
    setRules([...rules, { id: String(nextId++), userAgent: "*", directives: [{ type: "Disallow", path: "/" }] }]);
  };

  const removeRule = (id: string) => {
    setRules(rules.filter((r) => r.id !== id));
  };

  const updateUserAgent = (id: string, value: string) => {
    setRules(rules.map((r) => (r.id === id ? { ...r, userAgent: value } : r)));
  };

  const addDirective = (ruleId: string) => {
    setRules(
      rules.map((r) =>
        r.id === ruleId
          ? { ...r, directives: [...r.directives, { type: "Disallow", path: "/" }] }
          : r
      )
    );
  };

  const removeDirective = (ruleId: string, dirIdx: number) => {
    setRules(
      rules.map((r) =>
        r.id === ruleId
          ? { ...r, directives: r.directives.filter((_, i) => i !== dirIdx) }
          : r
      )
    );
  };

  const updateDirective = (ruleId: string, dirIdx: number, field: "type" | "path", value: string) => {
    setRules(
      rules.map((r) =>
        r.id === ruleId
          ? {
              ...r,
              directives: r.directives.map((d, i) =>
                i === dirIdx ? { ...d, [field]: value } : d
              ),
            }
          : r
      )
    );
  };

  const applyPreset = (key: string) => {
    const preset = presets[key];
    setRules(preset.rules.map((r, i) => ({ ...r, id: String(nextId + i) })));
    nextId += preset.rules.length;
    setSitemap(preset.sitemap);
  };

  // Generate output
  const output = [
    ...rules.map((r) => {
      const lines = [`User-agent: ${r.userAgent}`];
      r.directives.forEach((d) => lines.push(`${d.type}: ${d.path}`));
      return lines.join("\n");
    }),
    ...(sitemap ? [`\nSitemap: ${siteUrl}${sitemap}`] : []),
  ].join("\n\n");

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const download = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "robots.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">robots.txt生成</h1>
      <p className="text-gray-500 text-sm mb-6">
        GUIでrobots.txtを簡単作成。プリセットから選ぶだけですぐに使える。
      </p>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        {/* Presets */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">プリセット</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(presets).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => applyPreset(key)}
                className="px-3 py-1.5 rounded-lg text-sm border bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Site URL */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">サイトURL</label>
          <input
            type="text"
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Rules */}
        <div className="space-y-4">
          {rules.map((rule) => (
            <div key={rule.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-600 whitespace-nowrap">User-agent:</label>
                <input
                  type="text"
                  value={rule.userAgent}
                  onChange={(e) => updateUserAgent(rule.id, e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {rules.length > 1 && (
                  <button
                    onClick={() => removeRule(rule.id)}
                    className="text-red-500 hover:text-red-700 text-sm px-2"
                  >
                    削除
                  </button>
                )}
              </div>

              {rule.directives.map((dir, idx) => (
                <div key={idx} className="flex items-center gap-2 pl-4">
                  <select
                    value={dir.type}
                    onChange={(e) => updateDirective(rule.id, idx, "type", e.target.value)}
                    className="p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Allow">Allow</option>
                    <option value="Disallow">Disallow</option>
                  </select>
                  <input
                    type="text"
                    value={dir.path}
                    onChange={(e) => updateDirective(rule.id, idx, "path", e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {rule.directives.length > 1 && (
                    <button
                      onClick={() => removeDirective(rule.id, idx)}
                      className="text-red-400 hover:text-red-600 text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}

              <button
                onClick={() => addDirective(rule.id)}
                className="text-sm text-blue-600 hover:text-blue-800 pl-4"
              >
                + ルールを追加
              </button>
            </div>
          ))}

          <button
            onClick={addRule}
            className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600"
          >
            + User-Agentグループを追加
          </button>
        </div>

        {/* Sitemap */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Sitemapパス（空欄で省略）</label>
          <input
            type="text"
            value={sitemap}
            onChange={(e) => setSitemap(e.target.value)}
            placeholder="/sitemap.xml"
            className="w-full p-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Output */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">生成結果</span>
            <div className="flex gap-2">
              <button onClick={download} className="px-4 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700">
                ダウンロード
              </button>
              <button onClick={copy} className="px-4 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">
                {copied ? "OK!" : "コピー"}
              </button>
            </div>
          </div>
          <pre className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono overflow-x-auto whitespace-pre">
            {output}
          </pre>
        </div>
      </div>

      <AdBanner />

      <ToolFAQ
        faqs={[
          {
            question: "robots.txtとは何ですか？",
            answer:
              "robots.txtはWebサイトのルートディレクトリに配置するテキストファイルで、検索エンジンのクローラーにサイトのどの部分をクロールしてよいか指示します。SEOやサーバー負荷の管理に重要なファイルです。",
          },
          {
            question: "robots.txtでクローラーを完全にブロックできますか？",
            answer:
              "robots.txtはあくまで「お願い」であり、行儀の良いクローラーは従いますが、悪意あるボットは無視する可能性があります。機密情報の保護にはパスワード認証やアクセス制御を使うべきです。",
          },
          {
            question: "Sitemapの指定は必要ですか？",
            answer:
              "必須ではありませんが、robots.txtにSitemapのURLを記載することで、クローラーがサイト構造を効率的に把握できます。Google Search ConsoleでSitemapを登録するのと併用するのがベストプラクティスです。",
          },
        ]}
      />

      <RelatedTools currentToolId="robots-gen" />
    </div>
  );
}
