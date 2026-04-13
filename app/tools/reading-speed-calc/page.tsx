"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

type Mode = "test" | "calc";

interface BookPreset {
  title: string;
  chars: number;
}

const SAMPLE_TEXT =
  "日本語の読書速度を測定します。このサンプルテキストを最初から最後まで普段通りのペースで読んでください。読書とは、文字から情報や感情を読み取る行為です。速く読むことよりも、内容を理解しながら読むことが大切です。読書習慣を身につけると、語彙力や読解力が向上します。本を読む時間を毎日少しでも確保することで、知識の幅が広がっていきます。さあ、このテキストを読み終えたら計測ボタンを押してください。";

const SAMPLE_CHAR_COUNT = SAMPLE_TEXT.length; // ~200字

const bookPresets: BookPreset[] = [
  { title: "ノルウェイの森（村上春樹）", chars: 250000 },
  { title: "コンビニ人間（村田沙耶香）", chars: 50000 },
  { title: "君の膵臓をたべたい（住野よる）", chars: 100000 },
  { title: "容疑者Xの献身（東野圭吾）", chars: 150000 },
  { title: "嫌われる勇気（岸見・古賀）", chars: 90000 },
  { title: "一般的な文庫本", chars: 150000 },
  { title: "新書（一般的）", chars: 80000 },
];

function formatDuration(minutes: number): string {
  if (minutes < 60) return `約${Math.round(minutes)}分`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return m > 0 ? `約${h}時間${m}分` : `約${h}時間`;
}

export default function ReadingSpeedCalc() {
  const [mode, setMode] = useState<Mode>("test");

  // -- Speed test state --
  const [testState, setTestState] = useState<"idle" | "running" | "done">("idle");
  const [elapsedMs, setElapsedMs] = useState(0);
  const [measuredCpm, setMeasuredCpm] = useState<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTest = useCallback(() => {
    setTestState("running");
    setElapsedMs(0);
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      if (startTimeRef.current) {
        setElapsedMs(Date.now() - startTimeRef.current);
      }
    }, 100);
  }, []);

  const stopTest = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    const elapsed = startTimeRef.current ? (Date.now() - startTimeRef.current) / 1000 : 0;
    if (elapsed > 0) {
      const cpm = Math.round((SAMPLE_CHAR_COUNT / elapsed) * 60);
      setMeasuredCpm(cpm);
      setTestState("done");
    }
  }, []);

  const resetTest = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTestState("idle");
    setElapsedMs(0);
    setMeasuredCpm(null);
    startTimeRef.current = null;
  }, []);

  // -- Calc state --
  const [inputMode, setInputMode] = useState<"chars" | "pages">("chars");
  const [charCount, setCharCount] = useState("");
  const [pageCount, setPageCount] = useState("");
  const [charsPerPage, setCharsPerPage] = useState("500");
  const [speedInput, setSpeedInput] = useState("");
  const [dailyMinutes, setDailyMinutes] = useState("30");
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);

  const effectiveSpeed = useMemo(() => {
    const manual = parseFloat(speedInput);
    if (!isNaN(manual) && manual > 0) return manual;
    if (measuredCpm && measuredCpm > 0) return measuredCpm;
    return null;
  }, [speedInput, measuredCpm]);

  const totalChars = useMemo(() => {
    if (inputMode === "chars") {
      const c = parseFloat(charCount);
      return isNaN(c) ? null : c;
    } else {
      const p = parseFloat(pageCount);
      const cpp = parseFloat(charsPerPage);
      if (isNaN(p) || isNaN(cpp) || p <= 0 || cpp <= 0) return null;
      return p * cpp;
    }
  }, [inputMode, charCount, pageCount, charsPerPage]);

  const calcResult = useMemo(() => {
    if (!totalChars || !effectiveSpeed || totalChars <= 0 || effectiveSpeed <= 0) return null;
    const totalMinutes = totalChars / effectiveSpeed;
    const daily = parseFloat(dailyMinutes);
    const days = isNaN(daily) || daily <= 0 ? null : Math.ceil(totalMinutes / daily);
    return { totalMinutes, days, dailyMinutes: daily };
  }, [totalChars, effectiveSpeed, dailyMinutes]);

  const speedComment = useMemo(() => {
    if (!effectiveSpeed) return null;
    if (effectiveSpeed < 300) return "平均より遅め。ゆっくり丁寧に読むタイプです。";
    if (effectiveSpeed < 500) return "平均的な読書速度です（400〜600字/分）。";
    if (effectiveSpeed < 800) return "平均より速め。読み慣れている方です。";
    if (effectiveSpeed < 1200) return "かなり速い！速読レベルです。";
    return "超高速！速読トレーニング済みレベルです。";
  }, [effectiveSpeed]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">読書速度・読了時間計算</h1>
      <p className="text-gray-500 text-sm mb-6">
        読書スピードを測定し、本・記事の読了時間を計算します。読書計画の立案にご活用ください。
      </p>

      <AdBanner />

      {/* Mode Tabs */}
      <div className="flex gap-2 mb-6">
        {(
          [
            { value: "test" as Mode, label: "📏 読書速度テスト" },
            { value: "calc" as Mode, label: "📖 読了時間計算" },
          ] as { value: Mode; label: string }[]
        ).map((tab) => (
          <button
            key={tab.value}
            onClick={() => setMode(tab.value)}
            className={`flex-1 py-2.5 px-4 rounded-xl border text-sm font-medium transition-colors ${
              mode === tab.value
                ? "bg-blue-600 border-blue-600 text-white"
                : "bg-white border-gray-300 text-gray-700 hover:border-blue-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ---- Speed Test Mode ---- */}
      {mode === "test" && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-gray-700">
                サンプル文（{SAMPLE_CHAR_COUNT}字）
              </h2>
              {testState === "running" && (
                <span className="text-sm font-mono text-blue-600">
                  {(elapsedMs / 1000).toFixed(1)}秒
                </span>
              )}
            </div>
            <div
              className={`bg-gray-50 border rounded-xl p-4 text-sm leading-relaxed text-gray-800 select-none ${
                testState === "running" ? "border-blue-300" : "border-gray-200"
              }`}
            >
              {SAMPLE_TEXT}
            </div>
          </div>

          <div className="flex gap-3">
            {testState === "idle" && (
              <button
                onClick={startTest}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors"
              >
                計測開始
              </button>
            )}
            {testState === "running" && (
              <button
                onClick={stopTest}
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium text-sm transition-colors"
              >
                読み終わった！
              </button>
            )}
            {testState === "done" && (
              <>
                <button
                  onClick={resetTest}
                  className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium text-sm transition-colors"
                >
                  もう一度測定
                </button>
                <button
                  onClick={() => setMode("calc")}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors"
                >
                  読了時間を計算する →
                </button>
              </>
            )}
          </div>

          {testState === "done" && measuredCpm && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-blue-600">{measuredCpm}</div>
                  <div className="text-xs text-gray-500 mt-1">字/分</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-gray-700">
                    {(elapsedMs / 1000).toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">秒（計測時間）</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-gray-700">
                    {(measuredCpm / 60).toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">字/秒</div>
                </div>
              </div>
              {speedComment && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
                  {speedComment}
                </div>
              )}
              {/* 日本人平均との比較 */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-xs font-semibold text-gray-600 mb-3">日本人平均との比較</h3>
                <div className="space-y-2">
                  {(
                    [
                      { label: "遅め", cpm: 250, color: "bg-blue-300" },
                      { label: "平均", cpm: 500, color: "bg-green-400" },
                      { label: "速め", cpm: 800, color: "bg-yellow-400" },
                      { label: "速読", cpm: 1200, color: "bg-orange-400" },
                      { label: "あなた", cpm: measuredCpm, color: "bg-blue-600" },
                    ] as { label: string; cpm: number; color: string }[]
                  ).map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <div className="w-12 text-xs text-gray-600 shrink-0">{item.label}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div
                          className={`${item.color} h-3 rounded-full`}
                          style={{ width: `${Math.min(100, (item.cpm / 1500) * 100)}%` }}
                        />
                      </div>
                      <div className="w-16 text-xs text-right shrink-0 font-medium text-gray-700">
                        {item.cpm}字/分
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---- Calc Mode ---- */}
      {mode === "calc" && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
          {/* 本のプリセット */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              有名な本から選ぶ（任意）
            </label>
            <div className="flex flex-wrap gap-2">
              {bookPresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedPreset(idx);
                    setInputMode("chars");
                    setCharCount(String(preset.chars));
                  }}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    selectedPreset === idx
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-gray-50 border-gray-300 text-gray-700 hover:border-blue-400"
                  }`}
                >
                  {preset.title}
                </button>
              ))}
            </div>
          </div>

          {/* 入力モード切替 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">入力方法</label>
            <div className="flex gap-2 mb-3">
              {(
                [
                  { value: "chars" as const, label: "文字数で入力" },
                  { value: "pages" as const, label: "ページ数で入力" },
                ] as { value: "chars" | "pages"; label: string }[]
              ).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setInputMode(opt.value)}
                  className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
                    inputMode === opt.value
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-white border-gray-300 text-gray-700 hover:border-blue-400"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {inputMode === "chars" ? (
              <input
                type="number"
                value={charCount}
                onChange={(e) => {
                  setCharCount(e.target.value);
                  setSelectedPreset(null);
                }}
                placeholder="例: 150000"
                min="1"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">総ページ数</label>
                  <input
                    type="number"
                    value={pageCount}
                    onChange={(e) => setPageCount(e.target.value)}
                    placeholder="300"
                    min="1"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">1ページあたりの文字数</label>
                  <input
                    type="number"
                    value={charsPerPage}
                    onChange={(e) => setCharsPerPage(e.target.value)}
                    placeholder="500"
                    min="1"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 読書速度 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              読書速度（字/分）
            </label>
            <input
              type="number"
              value={speedInput}
              onChange={(e) => setSpeedInput(e.target.value)}
              placeholder={
                measuredCpm
                  ? `${measuredCpm}（測定値）`
                  : "例: 500（日本人平均）"
              }
              min="1"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            {measuredCpm && !speedInput && (
              <p className="text-xs text-blue-600 mt-1">
                速度テストの測定値（{measuredCpm}字/分）を使用中
              </p>
            )}
            {!measuredCpm && !speedInput && (
              <p className="text-xs text-gray-400 mt-1">
                空欄の場合は「読書速度テスト」の測定値を使用します。
              </p>
            )}
          </div>

          {/* 1日の読書時間 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              1日の読書時間（分）
            </label>
            <input
              type="number"
              value={dailyMinutes}
              onChange={(e) => setDailyMinutes(e.target.value)}
              placeholder="30"
              min="1"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* 結果 */}
          {calcResult && totalChars && (
            <div className="border-t border-gray-100 pt-5 space-y-4">
              <h2 className="text-sm font-semibold text-gray-700">計算結果</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatDuration(calcResult.totalMinutes)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">読了時間（合計）</div>
                </div>
                {calcResult.days !== null && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {calcResult.days}日
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      1日{Math.round(calcResult.dailyMinutes)}分読んだ場合
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-2 gap-y-2 text-sm">
                <div className="text-gray-500">文字数</div>
                <div className="text-gray-800 font-medium text-right">
                  {totalChars.toLocaleString()}字
                </div>
                <div className="text-gray-500">読書速度</div>
                <div className="text-gray-800 font-medium text-right">
                  {effectiveSpeed}字/分
                </div>
                <div className="text-gray-500">総読書時間</div>
                <div className="text-gray-800 font-medium text-right">
                  {Math.floor(calcResult.totalMinutes / 60)}時間
                  {Math.round(calcResult.totalMinutes % 60)}分
                </div>
              </div>
              {speedComment && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-800">
                  {speedComment}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <AdBanner />

      <section className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">読書速度・読了時間計算ツールの使い方</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          「読書速度テスト」モードでは、サンプル文（約{SAMPLE_CHAR_COUNT}字）を読んで計測ボタンを押すだけで1分あたりの読書速度（字/分）を測定できます。
          「読了時間計算」モードでは、本の文字数またはページ数と自分の読書速度を入力することで、読了までの時間と、1日○分読めば何日で完読できるかを計算します。
          有名な本の文字数プリセットも用意しており、読書計画の立案にご活用いただけます。
        </p>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "日本人の平均読書速度は？",
            answer:
              "一般的に400〜600文字/分とされています。速読トレーニングを積むことで1,000文字/分以上も可能になります。",
          },
          {
            question: "本の平均的な文字数は？",
            answer:
              "一般的な文庫本で10〜20万字程度。新書は6〜10万字が多く、ライトノベルは8〜12万字程度です。",
          },
          {
            question: "読書速度を上げるには？",
            answer:
              "黙読の練習、視野を広げる訓練、返り読みを減らすことが効果的です。毎日継続的に読書することで自然に速度が上がります。",
          },
          {
            question: "入力したデータはサーバーに送信されますか？",
            answer:
              "いいえ。このツールは全てブラウザ上で動作するため、入力した情報がサーバーに送信されることは一切ありません。",
          },
        ]}
      />

      <RelatedTools currentToolId="reading-speed-calc" />
    </div>
  );
}
