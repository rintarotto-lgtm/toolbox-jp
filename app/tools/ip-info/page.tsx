"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

interface IpInfo {
  ip: string;
  prefix: number;
  binary: string;
  ipClass: string;
  type: string;
  networkAddress: string;
  broadcastAddress: string;
  subnetMask: string;
  wildcardMask: string;
  hostCount: number;
  firstHost: string;
  lastHost: string;
}

function parseIpv4(input: string): IpInfo | null {
  const cidrMatch = input.match(/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?:\/(\d{1,2}))?$/);
  if (!cidrMatch) return null;

  const ip = cidrMatch[1];
  const prefix = cidrMatch[2] ? parseInt(cidrMatch[2]) : 32;
  const octets = ip.split(".").map(Number);

  if (octets.some(o => o < 0 || o > 255) || prefix < 0 || prefix > 32) return null;

  const ipNum = (octets[0] << 24 | octets[1] << 16 | octets[2] << 8 | octets[3]) >>> 0;
  const maskNum = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  const networkNum = (ipNum & maskNum) >>> 0;
  const broadcastNum = (networkNum | (~maskNum >>> 0)) >>> 0;
  const hostCount = Math.max(0, broadcastNum - networkNum - 1);

  const numToIp = (n: number): string => `${(n >>> 24) & 0xff}.${(n >>> 16) & 0xff}.${(n >>> 8) & 0xff}.${n & 0xff}`;
  const numToBin = (n: number): string => octets.map((_, i) => ((n >>> (24 - i * 8)) & 0xff).toString(2).padStart(8, "0")).join(".");

  // Class
  let ipClass = "N/A";
  if (octets[0] <= 127) ipClass = "クラスA";
  else if (octets[0] <= 191) ipClass = "クラスB";
  else if (octets[0] <= 223) ipClass = "クラスC";
  else if (octets[0] <= 239) ipClass = "クラスD (マルチキャスト)";
  else ipClass = "クラスE (実験用)";

  // Type
  let type = "グローバル";
  if (octets[0] === 10) type = "プライベート (10.0.0.0/8)";
  else if (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) type = "プライベート (172.16.0.0/12)";
  else if (octets[0] === 192 && octets[1] === 168) type = "プライベート (192.168.0.0/16)";
  else if (octets[0] === 127) type = "ループバック";
  else if (octets[0] === 169 && octets[1] === 254) type = "リンクローカル";
  else if (octets[0] >= 224 && octets[0] <= 239) type = "マルチキャスト";

  return {
    ip,
    prefix,
    binary: numToBin(ipNum),
    ipClass,
    type,
    networkAddress: numToIp(networkNum),
    broadcastAddress: numToIp(broadcastNum),
    subnetMask: numToIp(maskNum),
    wildcardMask: numToIp((~maskNum) >>> 0),
    hostCount: prefix >= 31 ? (prefix === 32 ? 1 : 2) : hostCount,
    firstHost: prefix >= 31 ? numToIp(networkNum) : numToIp(networkNum + 1),
    lastHost: prefix >= 31 ? numToIp(broadcastNum) : numToIp(broadcastNum - 1),
  };
}

const COMMON_MASKS = [
  { prefix: 8, mask: "255.0.0.0", hosts: "16,777,214" },
  { prefix: 16, mask: "255.255.0.0", hosts: "65,534" },
  { prefix: 24, mask: "255.255.255.0", hosts: "254" },
  { prefix: 25, mask: "255.255.255.128", hosts: "126" },
  { prefix: 26, mask: "255.255.255.192", hosts: "62" },
  { prefix: 27, mask: "255.255.255.224", hosts: "30" },
  { prefix: 28, mask: "255.255.255.240", hosts: "14" },
  { prefix: 29, mask: "255.255.255.248", hosts: "6" },
  { prefix: 30, mask: "255.255.255.252", hosts: "2" },
  { prefix: 32, mask: "255.255.255.255", hosts: "1" },
];

export default function IpInfo() {
  const [input, setInput] = useState("192.168.1.100/24");
  const info = parseIpv4(input);
  const copy = (text: string) => navigator.clipboard.writeText(text);

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm font-medium text-gray-800">{value}</span>
        <button onClick={() => copy(value)} className="text-xs text-blue-600 hover:underline">Copy</button>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">IPアドレス情報</h1>
      <p className="text-gray-500 text-sm mb-6">
        IPv4のクラス判定・CIDR計算・サブネット情報・バイナリ表現を表示。
      </p>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">IPアドレス（CIDR表記可）</label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="例: 192.168.1.0/24"
            className="w-full p-3 border border-gray-300 rounded-lg font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {!info && input && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            有効なIPv4アドレスを入力してください（例: 192.168.1.0/24）
          </div>
        )}

        {info && (
          <>
            {/* Type badges */}
            <div className="flex gap-2 flex-wrap">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">{info.ipClass}</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${info.type.includes("プライベート") ? "bg-green-100 text-green-700" : info.type === "ループバック" ? "bg-yellow-100 text-yellow-700" : "bg-purple-100 text-purple-700"}`}>{info.type}</span>
            </div>

            {/* Binary */}
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">バイナリ表現</div>
              <div className="font-mono text-sm tracking-wider">{info.binary}</div>
            </div>

            {/* Details */}
            <div>
              <InfoRow label="IPアドレス" value={`${info.ip}/${info.prefix}`} />
              <InfoRow label="ネットワークアドレス" value={info.networkAddress} />
              <InfoRow label="ブロードキャストアドレス" value={info.broadcastAddress} />
              <InfoRow label="サブネットマスク" value={info.subnetMask} />
              <InfoRow label="ワイルドカードマスク" value={info.wildcardMask} />
              <InfoRow label="ホスト範囲" value={`${info.firstHost} ～ ${info.lastHost}`} />
              <InfoRow label="利用可能ホスト数" value={info.hostCount.toLocaleString()} />
            </div>
          </>
        )}

        {/* Common subnets */}
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">📋 よく使うサブネット一覧</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-3 py-2 text-gray-500">CIDR</th>
                  <th className="text-left px-3 py-2 text-gray-500">サブネットマスク</th>
                  <th className="text-left px-3 py-2 text-gray-500">ホスト数</th>
                </tr>
              </thead>
              <tbody>
                {COMMON_MASKS.map(m => (
                  <tr key={m.prefix} className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => setInput(`${input.split("/")[0] || "192.168.1.0"}/${m.prefix}`)}>
                    <td className="px-3 py-1.5 font-mono text-blue-600">/{m.prefix}</td>
                    <td className="px-3 py-1.5 font-mono text-gray-700">{m.mask}</td>
                    <td className="px-3 py-1.5 text-gray-700">{m.hosts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ToolFAQ faqs={[
        { question: "CIDR表記とは何ですか？", answer: "CIDR（Classless Inter-Domain Routing）表記は、IPアドレスとサブネットマスクを「192.168.1.0/24」のように表記する方法です。/24はサブネットマスクのビット数を示し、255.255.255.0に相当します。" },
        { question: "プライベートIPアドレスとは？", answer: "プライベートIPアドレスは、ローカルネットワーク内でのみ使用されるアドレスです。10.0.0.0/8、172.16.0.0/12、192.168.0.0/16の3つの範囲が定義されています。インターネットに直接接続するにはNATが必要です。" },
        { question: "サブネットマスクの役割は？", answer: "サブネットマスクは、IPアドレスのネットワーク部とホスト部を区別するために使用します。例えば/24（255.255.255.0）の場合、上位24ビットがネットワーク部、下位8ビットがホスト部となります。" },
        { question: "IPv6には対応していますか？", answer: "現在このツールはIPv4のみ対応しています。IPv6のアドレス解析機能は今後追加予定です。" },
      ]} />
      <AdBanner />
      <RelatedTools currentToolId="ip-info" />
    </div>
  );
}
