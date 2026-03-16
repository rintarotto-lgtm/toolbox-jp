"use client";

import { useState, useCallback } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

// --------------- Simple YAML parser (no npm dependency) ---------------

function parseYaml(yaml: string): unknown {
  const lines = yaml.split("\n");
  const root: Record<string, unknown> = {};
  const stack: { indent: number; obj: Record<string, unknown> }[] = [
    { indent: -1, obj: root },
  ];

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    // skip blank lines and comments
    if (/^\s*(#|$)/.test(raw)) continue;

    const match = raw.match(/^(\s*)(.*)/);
    if (!match) continue;
    const indent = match[1].length;
    const content = match[2];

    // pop stack to correct parent
    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }
    const parent = stack[stack.length - 1].obj;

    // array item: "- value" or "- key: value"
    const arrMatch = content.match(/^-\s+(.*)/);
    if (arrMatch) {
      // find which key of parent this array belongs to
      const parentKeys = Object.keys(parent);
      const lastKey = parentKeys[parentKeys.length - 1];
      if (lastKey !== undefined && !Array.isArray(parent[lastKey])) {
        // first item — convert to array if parent value is empty/null
        if (
          parent[lastKey] === null ||
          parent[lastKey] === undefined ||
          parent[lastKey] === ""
        ) {
          parent[lastKey] = [];
        }
      }

      const arrValue = arrMatch[1];
      // "- key: value" nested object inside array
      const kvInArr = arrValue.match(/^([^:]+):\s*(.*)/);
      if (kvInArr && lastKey !== undefined && Array.isArray(parent[lastKey])) {
        const obj: Record<string, unknown> = {};
        obj[kvInArr[1].trim()] = castValue(kvInArr[2].trim());
        (parent[lastKey] as unknown[]).push(obj);
        stack.push({ indent: indent + 2, obj });
      } else if (lastKey !== undefined && Array.isArray(parent[lastKey])) {
        (parent[lastKey] as unknown[]).push(castValue(arrValue.trim()));
      }
      continue;
    }

    // key: value
    const kvMatch = content.match(/^([^:]+):\s*(.*)/);
    if (kvMatch) {
      const key = kvMatch[1].trim();
      const val = kvMatch[2].trim();
      if (val === "" || val === "|" || val === ">") {
        // nested object or block scalar — for simplicity treat empty as nested object
        const child: Record<string, unknown> = {};
        parent[key] = val === "" ? child : "";
        if (val === "") {
          stack.push({ indent, obj: child });
        }
        // block scalars: collect following indented lines
        if (val === "|" || val === ">") {
          const blockLines: string[] = [];
          while (i + 1 < lines.length) {
            const nextLine = lines[i + 1];
            const nextMatch = nextLine.match(/^(\s*)(.*)/);
            if (!nextMatch || (nextMatch[1].length <= indent && nextMatch[2] !== "")) break;
            if (nextMatch[2] === "" && blockLines.length > 0) {
              blockLines.push("");
              i++;
              continue;
            }
            if (nextMatch[1].length <= indent) break;
            blockLines.push(nextMatch[2]);
            i++;
          }
          const sep = val === "|" ? "\n" : " ";
          parent[key] = blockLines.join(sep);
        }
      } else {
        parent[key] = castValue(val);
      }
      continue;
    }
  }
  // if root has a single key, still return as object
  return root;
}

function castValue(val: string): unknown {
  if (val === "true" || val === "True" || val === "TRUE") return true;
  if (val === "false" || val === "False" || val === "FALSE") return false;
  if (val === "null" || val === "Null" || val === "NULL" || val === "~") return null;
  // quoted string
  if (
    (val.startsWith('"') && val.endsWith('"')) ||
    (val.startsWith("'") && val.endsWith("'"))
  ) {
    return val.slice(1, -1);
  }
  // number
  if (/^-?\d+(\.\d+)?$/.test(val)) return Number(val);
  return val;
}

// --------------- JSON to YAML converter ---------------

function jsonToYaml(value: unknown, indent: number = 0): string {
  const pad = "  ".repeat(indent);

  if (value === null) return "null";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") return String(value);
  if (typeof value === "string") {
    // quote if contains special chars
    if (
      value === "" ||
      value.includes(":") ||
      value.includes("#") ||
      value.includes("{") ||
      value.includes("}") ||
      value.includes("[") ||
      value.includes("]") ||
      value.includes(",") ||
      value.includes("&") ||
      value.includes("*") ||
      value.includes("!") ||
      value.includes("|") ||
      value.includes(">") ||
      value.includes("'") ||
      value.includes('"') ||
      value.includes("\n") ||
      /^\s/.test(value) ||
      /\s$/.test(value)
    ) {
      return JSON.stringify(value);
    }
    return value;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    return value
      .map((item) => {
        if (typeof item === "object" && item !== null && !Array.isArray(item)) {
          const entries = Object.entries(item);
          if (entries.length === 0) return `${pad}- {}`;
          const first = `${pad}- ${entries[0][0]}: ${jsonToYaml(entries[0][1], indent + 2).trimStart()}`;
          const rest = entries
            .slice(1)
            .map(
              ([k, v]) =>
                `${pad}  ${k}: ${jsonToYaml(v, indent + 2).trimStart()}`
            );
          return [first, ...rest].join("\n");
        }
        return `${pad}- ${jsonToYaml(item, indent + 1).trimStart()}`;
      })
      .join("\n");
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return "{}";
    return entries
      .map(([k, v]) => {
        if (typeof v === "object" && v !== null) {
          const nested = jsonToYaml(v, indent + 1);
          return `${pad}${k}:\n${nested}`;
        }
        return `${pad}${k}: ${jsonToYaml(v, indent + 1)}`;
      })
      .join("\n");
  }

  return String(value);
}

// --------------- Component ---------------

type Mode = "yaml-to-json" | "json-to-yaml";

export default function YamlJsonConverter() {
  const [mode, setMode] = useState<Mode>("yaml-to-json");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const convert = useCallback(
    (value: string, m: Mode) => {
      if (!value.trim()) {
        setOutput("");
        setError("");
        return;
      }
      try {
        if (m === "yaml-to-json") {
          const parsed = parseYaml(value);
          setOutput(JSON.stringify(parsed, null, 2));
        } else {
          const parsed = JSON.parse(value);
          setOutput(jsonToYaml(parsed));
        }
        setError("");
      } catch (e) {
        setError((e as Error).message);
        setOutput("");
      }
    },
    []
  );

  const handleInput = (value: string) => {
    setInput(value);
    convert(value, mode);
  };

  const handleMode = (m: Mode) => {
    setMode(m);
    setInput("");
    setOutput("");
    setError("");
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">YAML ⇔ JSON 変換ツール</h1>
      <p className="text-gray-500 text-sm mb-6">
        YAMLとJSONを相互変換。Docker ComposeやKubernetesの設定ファイル変換に便利です。
      </p>

      <AdBanner />

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => handleMode("yaml-to-json")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === "yaml-to-json"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          YAML → JSON
        </button>
        <button
          onClick={() => handleMode("json-to-yaml")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === "json-to-yaml"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          JSON → YAML
        </button>
      </div>

      {/* Textareas */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            {mode === "yaml-to-json" ? "YAML 入力" : "JSON 入力"}
          </label>
          <textarea
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            placeholder={
              mode === "yaml-to-json"
                ? "name: my-app\nversion: 1.0\nservices:\n  web:\n    port: 8080"
                : '{\n  "name": "my-app",\n  "version": 1.0\n}'
            }
            className="w-full h-72 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            {mode === "yaml-to-json" ? "JSON 出力" : "YAML 出力"}
          </label>
          <textarea
            value={output}
            readOnly
            className="w-full h-72 p-3 border border-gray-200 rounded-lg font-mono text-sm bg-gray-50 resize-y"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mt-4">
        <button
          onClick={copy}
          disabled={!output}
          className="px-5 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-40"
        >
          {copied ? "コピーしました!" : "出力をコピー"}
        </button>
      </div>

      <AdBanner />

      {/* Usage */}
      <section className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">使い方</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          変換モード（YAML→JSON または JSON→YAML）を選択し、左の入力欄にデータをペーストすると、
          リアルタイムで右側に変換結果が表示されます。シンタックスエラーがある場合はエラーメッセージが表示されます。
          Docker Compose、Kubernetes マニフェスト、CI/CD設定ファイルなどの変換にご活用ください。
        </p>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "YAMLとJSONの違いは何ですか？",
            answer:
              "YAMLはインデントベースでコメントが書ける人間に読みやすい形式です。JSONは波括弧とダブルクォートを使う、プログラムで扱いやすい形式です。どちらもデータ構造を表現できますが、用途に応じて使い分けられます。",
          },
          {
            question: "どのようなYAML構文に対応していますか？",
            answer:
              "キーと値のペア、ネストされたオブジェクト（インデント）、配列（ハイフン）、文字列・数値・真偽値・nullの基本的な型に対応しています。アンカーやエイリアス等の高度な機能は非対応です。",
          },
          {
            question: "変換データはサーバーに送信されますか？",
            answer:
              "いいえ、すべての変換処理はブラウザ上で完結します。入力データが外部に送信されることはありません。",
          },
          {
            question: "Docker Composeファイルの変換に使えますか？",
            answer:
              "はい、Docker ComposeのYAMLファイルをJSONに変換したり、その逆も可能です。Kubernetesマニフェストやその他の設定ファイルにも対応しています。",
          },
        ]}
      />

      <RelatedTools currentToolId="yaml-json" />
    </div>
  );
}
