"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

export default function TextToSpeech() {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const available = speechSynthesis.getVoices();
      setVoices(available);

      // Prefer Japanese voice
      if (available.length > 0 && !selectedVoice) {
        const jpVoice = available.find((v) => v.lang.startsWith("ja"));
        setSelectedVoice(jpVoice?.name || available[0].name);
      }
    };

    loadVoices();
    speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      speechSynthesis.cancel();
    };
  }, [selectedVoice]);

  const handlePlay = useCallback(() => {
    if (!text.trim()) return;

    if (isPaused) {
      speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) utterance.voice = voice;
    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };
    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  }, [text, voices, selectedVoice, rate, pitch, isPaused]);

  const handlePause = useCallback(() => {
    if (isPlaying && !isPaused) {
      speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  }, [isPlaying, isPaused]);

  const handleStop = useCallback(() => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  }, []);

  // Group voices by language
  const japaneseVoices = voices.filter((v) => v.lang.startsWith("ja"));
  const otherVoices = voices.filter((v) => !v.lang.startsWith("ja"));

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">テキスト読み上げ</h1>
      <p className="text-gray-500 text-sm mb-6">
        テキストをブラウザの音声合成機能（Web Speech API）で読み上げます。
      </p>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              読み上げるテキスト
            </label>
            <span className="text-xs text-gray-400">{text.length} 文字</span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="読み上げたいテキストを入力してください..."
            className="w-full h-40 p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Voice selector */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            音声を選択
          </label>
          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {japaneseVoices.length > 0 && (
              <optgroup label="日本語">
                {japaneseVoices.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </optgroup>
            )}
            {otherVoices.length > 0 && (
              <optgroup label="その他">
                {otherVoices.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </optgroup>
            )}
          </select>
        </div>

        {/* Rate and pitch sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              速度: {rate.toFixed(1)}x
            </label>
            <input
              type="range"
              min={0.1}
              max={3}
              step={0.1}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0.1x</span>
              <span>1.0x</span>
              <span>3.0x</span>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              ピッチ: {pitch.toFixed(1)}
            </label>
            <input
              type="range"
              min={0}
              max={2}
              step={0.1}
              value={pitch}
              onChange={(e) => setPitch(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>低い</span>
              <span>標準</span>
              <span>高い</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <button
            onClick={handlePlay}
            disabled={!text.trim()}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              {isPlaying ? (
                <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
              ) : (
                <path d="M8 5v14l11-7z" />
              )}
            </svg>
            {isPaused ? "再開" : isPlaying ? "再生中..." : "再生"}
          </button>
          <button
            onClick={handlePause}
            disabled={!isPlaying}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-sm rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
            </svg>
            一時停止
          </button>
          <button
            onClick={handleStop}
            disabled={!isPlaying && !isPaused}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-sm rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" />
            </svg>
            停止
          </button>
        </div>

        {/* Status indicator */}
        {(isPlaying || isPaused) && (
          <div className={`flex items-center gap-2 text-sm ${isPlaying ? "text-blue-600" : "text-yellow-600"}`}>
            <div className={`w-2 h-2 rounded-full ${isPlaying ? "bg-blue-600 animate-pulse" : "bg-yellow-600"}`} />
            {isPlaying ? "再生中..." : "一時停止中"}
          </div>
        )}
      </div>

      <AdBanner />

      <section className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">テキスト読み上げツールの使い方</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          テキストを入力し、音声を選択して再生ボタンを押すとブラウザの音声合成機能で読み上げます。
          日本語を含む多言語の音声に対応しており、速度とピッチを自由に調整できます。
          文章の校正確認、プレゼンテーション練習、アクセシビリティ確認などにご活用ください。
        </p>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "対応しているブラウザは？",
            answer:
              "Web Speech APIに対応している主要ブラウザ（Chrome、Firefox、Safari、Edge）でご利用いただけます。利用可能な音声はブラウザやOSによって異なります。",
          },
          {
            question: "日本語の音声が表示されません",
            answer:
              "日本語音声はOSにインストールされている音声に依存します。Windows/Macの設定から追加の音声をダウンロードできる場合があります。",
          },
          {
            question: "長い文章も読み上げられますか？",
            answer:
              "はい、長い文章にも対応しています。ただし、非常に長いテキストの場合はブラウザの制限により途中で停止する場合があります。その場合はテキストを分割してお試しください。",
          },
          {
            question: "入力データはサーバーに送信されますか？",
            answer:
              "いいえ。すべての処理はブラウザのWeb Speech APIで行われるため、テキストデータがサーバーに送信されることはありません。",
          },
        ]}
      />

      <RelatedTools currentToolId="text-to-speech" />
    </div>
  );
}
