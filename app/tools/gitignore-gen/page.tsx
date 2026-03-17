"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

const templates: Record<string, { category: string; patterns: string[] }> = {
  "Node.js": { category: "言語", patterns: ["node_modules/", "npm-debug.log*", "yarn-debug.log*", "yarn-error.log*", ".npm", ".yarn-integrity", "dist/", "build/", ".env", ".env.local", ".env.*.local"] },
  Python: { category: "言語", patterns: ["__pycache__/", "*.py[cod]", "*$py.class", "*.so", ".Python", "env/", "venv/", ".venv/", "*.egg-info/", "dist/", "build/", ".env"] },
  Java: { category: "言語", patterns: ["*.class", "*.jar", "*.war", "*.ear", "target/", ".gradle/", "build/", "gradle-app.setting", "!gradle-wrapper.jar"] },
  Go: { category: "言語", patterns: ["*.exe", "*.exe~", "*.dll", "*.so", "*.dylib", "*.test", "*.out", "vendor/"] },
  Rust: { category: "言語", patterns: ["target/", "Cargo.lock", "**/*.rs.bk"] },
  Ruby: { category: "言語", patterns: ["*.gem", "*.rbc", ".bundle/", "vendor/bundle", "log/", "tmp/", ".env"] },
  PHP: { category: "言語", patterns: ["vendor/", "composer.lock", ".env", "*.cache", "storage/logs/"] },
  Swift: { category: "言語", patterns: [".build/", "Packages/", "*.xcodeproj/xcuserdata/", "*.playground/timeline.xctimeline"] },
  "React/Next.js": { category: "FW", patterns: [".next/", "out/", "build/", "node_modules/", ".env.local", ".vercel"] },
  "Vue/Nuxt": { category: "FW", patterns: [".nuxt/", ".output/", "dist/", "node_modules/", ".env"] },
  Angular: { category: "FW", patterns: ["dist/", "tmp/", "node_modules/", ".angular/", ".env"] },
  Django: { category: "FW", patterns: ["*.pyc", "db.sqlite3", "media/", "staticfiles/", ".env"] },
  Rails: { category: "FW", patterns: ["log/", "tmp/", "storage/", "public/assets", ".env", "db/*.sqlite3"] },
  Laravel: { category: "FW", patterns: ["vendor/", "node_modules/", ".env", "storage/*.key", "public/hot", "public/storage"] },
  VSCode: { category: "IDE", patterns: [".vscode/*", "!.vscode/settings.json", "!.vscode/tasks.json", "!.vscode/launch.json", "!.vscode/extensions.json", "*.code-workspace"] },
  JetBrains: { category: "IDE", patterns: [".idea/", "*.iml", "*.iws", "*.ipr", "out/", ".idea_modules/"] },
  Vim: { category: "IDE", patterns: ["[._]*.s[a-v][a-z]", "[._]*.sw[a-p]", "[._]s[a-rt-v][a-z]", "[._]ss[a-gi-z]", "[._]sw[a-p]", "Session.vim", "Sessionx.vim", ".netrwhist", "*~", "tags"] },
  macOS: { category: "OS", patterns: [".DS_Store", ".AppleDouble", ".LSOverride", "._*", ".Spotlight-V100", ".Trashes"] },
  Windows: { category: "OS", patterns: ["Thumbs.db", "Thumbs.db:encryptable", "ehthumbs.db", "*.lnk", "[Dd]esktop.ini"] },
  Linux: { category: "OS", patterns: ["*~", ".fuse_hidden*", ".directory", ".Trash-*", ".nfs*"] },
  Docker: { category: "その他", patterns: ["docker-compose.override.yml", ".docker/"] },
  Terraform: { category: "その他", patterns: [".terraform/", "*.tfstate", "*.tfstate.*", "crash.log", "*.tfvars"] },
};

export default function GitignoreGen() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  const toggle = (name: string) => {
    const next = new Set(selected);
    next.has(name) ? next.delete(name) : next.add(name);
    setSelected(next);
  };

  const categories = [...new Set(Object.values(templates).map((t) => t.category))];
  const output = [...selected].map((name) => `# ${name}\n${templates[name].patterns.join("\n")}`).join("\n\n");

  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  const download = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = ".gitignore"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">.gitignore生成ツール</h1>
      <p className="text-gray-500 text-sm mb-6">言語・フレームワークを選ぶだけで.gitignoreを自動生成。</p>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        {categories.map((cat) => (
          <div key={cat}>
            <h3 className="text-sm font-medium text-gray-700 mb-2">{cat === "FW" ? "フレームワーク" : cat === "IDE" ? "エディタ/IDE" : cat}</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(templates).filter(([, t]) => t.category === cat).map(([name]) => (
                <button key={name} onClick={() => toggle(name)} className={`px-3 py-1.5 rounded-lg text-sm border ${selected.has(name) ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}>
                  {name}
                </button>
              ))}
            </div>
          </div>
        ))}

        {selected.size > 0 && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">.gitignore ({selected.size}テンプレート)</span>
              <div className="flex gap-2">
                <button onClick={download} className="px-4 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700">ダウンロード</button>
                <button onClick={copy} className="px-4 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">{copied ? "OK!" : "コピー"}</button>
              </div>
            </div>
            <pre className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono overflow-x-auto whitespace-pre max-h-96">{output}</pre>
          </div>
        )}
      </div>

      <AdBanner />

      <ToolFAQ faqs={[
        { question: ".gitignoreとは？", answer: "Gitで管理しないファイルやディレクトリを指定する設定ファイルです。node_modules/やビルド成果物、環境変数ファイル（.env）などを除外するのに使います。" },
        { question: ".gitignoreが効かない場合は？", answer: "既にGitにコミットされたファイルは.gitignoreに追加しても追跡が続きます。git rm --cached <file>で追跡を解除してから.gitignoreに追加してください。" },
        { question: "グローバル.gitignoreとは？", answer: "git config --global core.excludesfileで設定する、全リポジトリに適用される.gitignoreです。macOSの.DS_StoreやIDEの設定ファイルなど、個人的な除外はグローバルで設定するのがベストプラクティスです。" },
      ]} />

      <RelatedTools currentToolId="gitignore-gen" />
    </div>
  );
}
