"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function inferType(
  value: unknown,
  name: string,
  interfaces: Map<string, string>,
  useType: boolean
): string {
  if (value === null) return "null";
  if (value === undefined) return "undefined";

  const type = typeof value;
  if (type === "string") return "string";
  if (type === "number") return "number";
  if (type === "boolean") return "boolean";

  if (Array.isArray(value)) {
    if (value.length === 0) return "unknown[]";
    // Check if all items have the same type
    const itemTypes = new Set(value.map((item) => typeof item));
    if (itemTypes.size === 1) {
      const first = value[0];
      if (typeof first === "object" && first !== null && !Array.isArray(first)) {
        const interfaceName = capitalize(name) + "Item";
        generateInterface(first as Record<string, unknown>, interfaceName, interfaces, useType);
        return interfaceName + "[]";
      }
      return inferType(first, name, interfaces, useType) + "[]";
    }
    // Mixed types
    const types = [...new Set(value.map((item) => inferType(item, name, interfaces, useType)))];
    return `(${types.join(" | ")})[]`;
  }

  if (type === "object") {
    const interfaceName = capitalize(name);
    generateInterface(value as Record<string, unknown>, interfaceName, interfaces, useType);
    return interfaceName;
  }

  return "unknown";
}

function generateInterface(
  obj: Record<string, unknown>,
  name: string,
  interfaces: Map<string, string>,
  useType: boolean
): void {
  const lines: string[] = [];
  const entries = Object.entries(obj);

  for (const [key, value] of entries) {
    const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
    const typeName = inferType(value, key, interfaces, useType);
    lines.push(`  ${safeKey}: ${typeName};`);
  }

  const keyword = useType ? "type" : "interface";
  const body = lines.join("\n");

  if (useType) {
    interfaces.set(name, `${keyword} ${name} = {\n${body}\n};`);
  } else {
    interfaces.set(name, `${keyword} ${name} {\n${body}\n}`);
  }
}

function jsonToTypeScript(
  json: string,
  rootName: string,
  useType: boolean
): string {
  const parsed = JSON.parse(json);
  const interfaces = new Map<string, string>();

  if (Array.isArray(parsed)) {
    if (parsed.length > 0 && typeof parsed[0] === "object" && parsed[0] !== null) {
      generateInterface(parsed[0] as Record<string, unknown>, rootName, interfaces, useType);
    }
    // Also export the root array type
    const itemType = parsed.length > 0 && typeof parsed[0] === "object" ? rootName : inferType(parsed[0], rootName, interfaces, useType);
    if (useType) {
      interfaces.set(rootName + "List", `type ${rootName}List = ${itemType}[];`);
    } else {
      interfaces.set(rootName + "List", `type ${rootName}List = ${itemType}[];`);
    }
  } else if (typeof parsed === "object" && parsed !== null) {
    generateInterface(parsed as Record<string, unknown>, rootName, interfaces, useType);
  }

  // Reverse to put child interfaces first
  const values = [...interfaces.values()].reverse();
  return values.join("\n\n");
}

export default function JsonToTs() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [rootName, setRootName] = useState("Root");
  const [useType, setUseType] = useState(false);
  const [copied, setCopied] = useState(false);

  const convert = () => {
    if (!input.trim()) {
      setOutput("");
      setError("");
      return;
    }
    try {
      const result = jsonToTypeScript(input, rootName || "Root", useType);
      setOutput(result);
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sampleJson = `{
  "id": 1,
  "name": "田中太郎",
  "email": "tanaka@example.com",
  "age": 30,
  "isActive": true,
  "address": {
    "city": "東京",
    "zipCode": "100-0001"
  },
  "tags": ["developer", "designer"],
  "scores": [85, 92, 78]
}`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">JSON → TypeScript型変換</h1>
      <p className="text-gray-500 text-sm mb-6">
        JSONデータを貼り付けてTypeScriptのインターフェース・型定義を自動生成します。
      </p>

      <AdBanner />

      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          ルート名:
          <input
            value={rootName}
            onChange={(e) => setRootName(e.target.value)}
            className="w-32 px-2 py-1 border border-gray-300 rounded text-sm font-mono"
            placeholder="Root"
          />
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setUseType(false)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              !useType
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            interface
          </button>
          <button
            onClick={() => setUseType(true)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              useType
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            type
          </button>
        </div>
        <button
          onClick={() => setInput(sampleJson)}
          className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 ml-auto"
        >
          サンプルJSON
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            入力JSON
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"key": "value"}'
            className="w-full h-72 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            TypeScript型定義
          </label>
          <div className="relative">
            <textarea
              value={output}
              readOnly
              className="w-full h-72 p-3 border border-gray-200 rounded-lg font-mono text-sm bg-gray-50 resize-y"
            />
            {output && (
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 px-3 py-1 bg-white border border-gray-300 rounded text-xs font-medium hover:bg-gray-50"
              >
                {copied ? "コピー済み" : "コピー"}
              </button>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-3 mt-4">
        <button
          onClick={convert}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          変換
        </button>
        <button
          onClick={() => {
            setInput("");
            setOutput("");
            setError("");
          }}
          className="px-5 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
        >
          クリア
        </button>
      </div>

      <AdBanner />

      <section className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">
          JSON→TypeScript型変換ツールの使い方
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          左の入力欄にJSONデータをペーストし、「変換」ボタンをクリックすると
          TypeScriptのインターフェースまたは型定義が自動生成されます。
          ネストされたオブジェクトや配列にも対応し、適切な子インターフェースを自動生成します。
          APIレスポンスの型定義作成やフロントエンド開発に最適です。
        </p>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "interfaceとtypeの違いは何ですか？",
            answer:
              "interfaceはオブジェクトの形状を定義するもので、拡張（extends）が可能です。typeはより汎用的で、ユニオン型やインターセクション型も定義できます。一般的にはinterfaceが推奨されますが、プロジェクトの規約に従ってください。",
          },
          {
            question: "ネストされたオブジェクトはどう処理されますか？",
            answer:
              "ネストされたオブジェクトは自動的に別のインターフェース（または型）として生成されます。プロパティ名をPascalCaseに変換して命名します。例えば「address」プロパティは「Address」インターフェースになります。",
          },
          {
            question: "配列の中に異なる型が混在している場合はどうなりますか？",
            answer:
              "配列内の型が混在している場合は、ユニオン型（例: (string | number)[]）として生成されます。すべてのアイテムが同じオブジェクト構造の場合は、共通のインターフェースが生成されます。",
          },
        ]}
      />

      <RelatedTools currentToolId="json-to-ts" />
    </div>
  );
}
