"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

interface EmojiItem { emoji: string; name: string; keywords: string[]; category: string; }

const EMOJIS: EmojiItem[] = [
  { emoji: "😀", name: "にこにこ顔", keywords: ["笑顔","嬉しい","にこにこ","smile"], category: "顔" },
  { emoji: "😂", name: "泣き笑い", keywords: ["笑い","爆笑","面白い","笑","lol"], category: "顔" },
  { emoji: "🥹", name: "嬉し泣き", keywords: ["感動","泣く","嬉しい"], category: "顔" },
  { emoji: "😊", name: "照れ笑い", keywords: ["照れ","はにかみ","にっこり"], category: "顔" },
  { emoji: "😍", name: "ハート目", keywords: ["好き","愛","かわいい","love"], category: "顔" },
  { emoji: "🤔", name: "考え中", keywords: ["考える","うーん","think","疑問"], category: "顔" },
  { emoji: "😢", name: "泣き顔", keywords: ["泣く","悲しい","sad","涙"], category: "顔" },
  { emoji: "😡", name: "怒り顔", keywords: ["怒る","怒り","angry","ムカつく"], category: "顔" },
  { emoji: "😱", name: "恐怖", keywords: ["怖い","びっくり","shock","叫び"], category: "顔" },
  { emoji: "🤣", name: "大爆笑", keywords: ["爆笑","笑い転げる","rofl"], category: "顔" },
  { emoji: "😴", name: "眠い", keywords: ["寝る","眠い","sleep","zzz"], category: "顔" },
  { emoji: "🤗", name: "ハグ", keywords: ["ハグ","抱きしめる","hug","温かい"], category: "顔" },
  { emoji: "🫡", name: "敬礼", keywords: ["了解","敬礼","salute","ラジャー"], category: "顔" },
  { emoji: "👍", name: "いいね", keywords: ["いいね","OK","グッド","thumbs up","賛成"], category: "手" },
  { emoji: "👎", name: "よくない", keywords: ["ダメ","反対","thumbs down"], category: "手" },
  { emoji: "👏", name: "拍手", keywords: ["拍手","おめでとう","clap","すごい"], category: "手" },
  { emoji: "🙏", name: "お願い", keywords: ["お願い","感謝","ありがとう","pray","祈り"], category: "手" },
  { emoji: "✌️", name: "ピース", keywords: ["ピース","勝利","peace","v"], category: "手" },
  { emoji: "💪", name: "力こぶ", keywords: ["頑張る","力","strong","筋肉","ガンバ"], category: "手" },
  { emoji: "🤝", name: "握手", keywords: ["握手","合意","handshake","契約"], category: "手" },
  { emoji: "❤️", name: "赤ハート", keywords: ["愛","好き","ハート","love","heart"], category: "記号" },
  { emoji: "💔", name: "割れたハート", keywords: ["失恋","悲しい","broken heart"], category: "記号" },
  { emoji: "⭐", name: "星", keywords: ["星","スター","star","お気に入り"], category: "記号" },
  { emoji: "🔥", name: "炎", keywords: ["炎","火","hot","熱い","すごい","fire"], category: "記号" },
  { emoji: "✅", name: "チェック", keywords: ["完了","OK","チェック","check","done"], category: "記号" },
  { emoji: "❌", name: "バツ", keywords: ["ダメ","不正解","バツ","NG","close"], category: "記号" },
  { emoji: "⚠️", name: "注意", keywords: ["注意","警告","warning","danger"], category: "記号" },
  { emoji: "💡", name: "電球", keywords: ["アイデア","ひらめき","idea","電球"], category: "記号" },
  { emoji: "🎉", name: "パーティー", keywords: ["お祝い","パーティー","おめでとう","party","congratulations"], category: "記号" },
  { emoji: "🎁", name: "プレゼント", keywords: ["プレゼント","贈り物","gift","誕生日"], category: "記号" },
  { emoji: "📌", name: "ピン", keywords: ["ピン留め","固定","pin","重要"], category: "記号" },
  { emoji: "🚀", name: "ロケット", keywords: ["ロケット","打ち上げ","launch","スタート","リリース"], category: "物" },
  { emoji: "💻", name: "ノートPC", keywords: ["パソコン","PC","laptop","プログラミング","仕事"], category: "物" },
  { emoji: "📱", name: "スマホ", keywords: ["スマホ","携帯","phone","モバイル"], category: "物" },
  { emoji: "☕", name: "コーヒー", keywords: ["コーヒー","カフェ","coffee","休憩"], category: "食べ物" },
  { emoji: "🍕", name: "ピザ", keywords: ["ピザ","pizza","食べ物"], category: "食べ物" },
  { emoji: "🍣", name: "寿司", keywords: ["寿司","すし","sushi","和食","日本食"], category: "食べ物" },
  { emoji: "🍺", name: "ビール", keywords: ["ビール","乾杯","beer","飲み会"], category: "食べ物" },
  { emoji: "🌸", name: "桜", keywords: ["桜","花","春","cherry blossom","さくら"], category: "自然" },
  { emoji: "🌙", name: "月", keywords: ["月","夜","moon","三日月"], category: "自然" },
  { emoji: "☀️", name: "太陽", keywords: ["太陽","晴れ","sun","天気"], category: "自然" },
  { emoji: "🌈", name: "虹", keywords: ["虹","レインボー","rainbow"], category: "自然" },
  { emoji: "❄️", name: "雪", keywords: ["雪","冬","snow","寒い"], category: "自然" },
  { emoji: "🐱", name: "猫", keywords: ["猫","ねこ","cat","にゃー"], category: "動物" },
  { emoji: "🐶", name: "犬", keywords: ["犬","いぬ","dog","わんわん"], category: "動物" },
  { emoji: "🐻", name: "くま", keywords: ["くま","熊","bear"], category: "動物" },
  { emoji: "🦊", name: "きつね", keywords: ["きつね","狐","fox"], category: "動物" },
  { emoji: "📧", name: "メール", keywords: ["メール","email","手紙","連絡"], category: "物" },
  { emoji: "🔑", name: "鍵", keywords: ["鍵","キー","key","パスワード","セキュリティ"], category: "物" },
  { emoji: "📝", name: "メモ", keywords: ["メモ","ノート","note","書く","記録"], category: "物" },
  { emoji: "🗑️", name: "ゴミ箱", keywords: ["削除","ゴミ箱","trash","delete"], category: "物" },
  { emoji: "⏰", name: "目覚まし", keywords: ["時間","時計","alarm","締め切り","タイマー"], category: "物" },
  { emoji: "🔔", name: "ベル", keywords: ["通知","ベル","bell","お知らせ","notification"], category: "物" },
  { emoji: "🏠", name: "家", keywords: ["家","ホーム","home","house"], category: "物" },
  { emoji: "💰", name: "お金", keywords: ["お金","金","money","給料","報酬"], category: "物" },
  { emoji: "📊", name: "グラフ", keywords: ["グラフ","チャート","chart","データ","分析","統計"], category: "物" },
  { emoji: "🎯", name: "的", keywords: ["目標","ターゲット","target","的","ゴール"], category: "記号" },
  { emoji: "💯", name: "100点", keywords: ["100点","満点","完璧","perfect","hundred"], category: "記号" },
  { emoji: "🆕", name: "NEW", keywords: ["新しい","NEW","新着","new"], category: "記号" },
  { emoji: "🔗", name: "リンク", keywords: ["リンク","URL","link","チェーン","接続"], category: "記号" },
];

const CATEGORIES = ["全て", "顔", "手", "記号", "物", "食べ物", "自然", "動物"];

export default function EmojiSearch() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全て");
  const [copied, setCopied] = useState("");

  const filtered = useMemo(() => {
    return EMOJIS.filter(e => {
      if (category !== "全て" && e.category !== category) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return e.name.includes(q) || e.keywords.some(k => k.includes(q));
    });
  }, [query, category]);

  const copyEmoji = (emoji: string) => {
    navigator.clipboard.writeText(emoji);
    setCopied(emoji);
    setTimeout(() => setCopied(""), 1500);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">絵文字検索</h1>
      <p className="text-gray-500 text-sm mb-6">日本語キーワードで絵文字を検索してワンクリックコピー。SNS・チャットに便利。</p>
      <AdBanner />
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="キーワードで検索（例：笑顔、ハート、コーヒー）"
          className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${category === c ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{c}</button>
          ))}
        </div>
        <div className="text-xs text-gray-500">{filtered.length}件の絵文字</div>
        <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
          {filtered.map(e => (
            <button key={e.emoji} onClick={() => copyEmoji(e.emoji)} title={e.name}
              className={`text-2xl p-2 rounded-lg hover:bg-gray-100 transition-all relative ${copied === e.emoji ? "bg-green-100 scale-110" : ""}`}>
              {e.emoji}
              {copied === e.emoji && <span className="absolute -top-1 -right-1 text-[10px] bg-green-500 text-white rounded px-1">✓</span>}
            </button>
          ))}
        </div>
        {filtered.length === 0 && <div className="text-center text-gray-400 py-8">該当する絵文字が見つかりません</div>}
      </div>
      <ToolFAQ faqs={[
        { question: "絵文字はどのデバイスでも表示されますか？", answer: "Unicode標準の絵文字は、iOS、Android、Windows、macOSなど主要なOSで表示されます。ただし、デバイスやOSバージョンによってデザインが若干異なる場合があります。" },
        { question: "絵文字をHTMLで使う方法は？", answer: "絵文字はそのままHTMLに貼り付けるか、Unicode番号で&#x1F600;のように記述できます。UTF-8エンコーディングが設定されていれば問題なく表示されます。" },
        { question: "SlackやTeamsでも使えますか？", answer: "はい、コピーした絵文字はSlack、Microsoft Teams、Discord、LINEなど主要なチャットツールでそのまま貼り付けて使用できます。" },
      ]} />
      <AdBanner />
      <RelatedTools currentToolId="emoji-search" />
    </div>
  );
}
