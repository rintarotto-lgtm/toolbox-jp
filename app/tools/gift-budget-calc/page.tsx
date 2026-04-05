"use client";
import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

type Scene = "birthday" | "christmas" | "valentine" | "wedding" | "baby" | "ochugen" | "oseibo" | "father" | "mother";
type Relation = "lover" | "spouse" | "friend" | "colleague" | "boss" | "parent" | "sibling" | "child";

const SCENES: { id: Scene; label: string; icon: string }[] = [
  { id: "birthday", label: "誕生日", icon: "🎂" },
  { id: "christmas", label: "クリスマス", icon: "🎄" },
  { id: "valentine", label: "バレンタイン/ホワイトデー", icon: "💝" },
  { id: "wedding", label: "結婚祝い", icon: "💒" },
  { id: "baby", label: "出産祝い", icon: "👶" },
  { id: "ochugen", label: "お中元", icon: "🍺" },
  { id: "oseibo", label: "お歳暮", icon: "🎁" },
  { id: "father", label: "父の日", icon: "👔" },
  { id: "mother", label: "母の日", icon: "💐" },
];

const RELATIONS: { id: Relation; label: string }[] = [
  { id: "lover", label: "恋人" },
  { id: "spouse", label: "配偶者" },
  { id: "friend", label: "友人" },
  { id: "colleague", label: "同僚" },
  { id: "boss", label: "上司" },
  { id: "parent", label: "親" },
  { id: "sibling", label: "兄弟姉妹" },
  { id: "child", label: "子ども" },
];

const BUDGETS: Record<Scene, Record<Relation, { min: number; max: number; note: string }>> = {
  birthday: {
    lover: { min: 5000, max: 20000, note: "交際期間が長いほど高め" },
    spouse: { min: 5000, max: 15000, note: "家族全体でお祝いも◎" },
    friend: { min: 3000, max: 5000, note: "グループで贈るなら1人1000〜2000円" },
    colleague: { min: 1000, max: 3000, note: "職場ではお菓子・消耗品が無難" },
    boss: { min: 3000, max: 5000, note: "贈りすぎに注意、お菓子等が無難" },
    parent: { min: 5000, max: 15000, note: "感謝の気持ちとともに" },
    sibling: { min: 3000, max: 8000, note: "年齢差によって調整" },
    child: { min: 3000, max: 10000, note: "年齢・興味に合わせたもの" },
  },
  christmas: {
    lover: { min: 10000, max: 30000, note: "交際年数・年齢で変動あり" },
    spouse: { min: 5000, max: 20000, note: "家族で過ごす場合はディナーも含めて" },
    friend: { min: 2000, max: 5000, note: "交換プレゼント形式が多い" },
    colleague: { min: 500, max: 2000, note: "職場のビンゴやくじ引き向け" },
    boss: { min: 2000, max: 5000, note: "高価なものは避けお菓子が無難" },
    parent: { min: 3000, max: 10000, note: "家族全員で集まるお祝いの場合は食事で" },
    sibling: { min: 2000, max: 5000, note: "子供がいる兄弟へはお子さんへのプレゼントも" },
    child: { min: 3000, max: 15000, note: "年齢・サンタクロースの予算は家庭によって異なる" },
  },
  valentine: {
    lover: { min: 3000, max: 10000, note: "手作りチョコ＋プレゼントの場合は合算で" },
    spouse: { min: 2000, max: 8000, note: "義理チョコ文化は職場で変わりつつある" },
    friend: { min: 500, max: 2000, note: "友チョコ・義理チョコは500〜1000円が相場" },
    colleague: { min: 300, max: 1000, note: "職場配り用は1個200〜500円程度" },
    boss: { min: 500, max: 1500, note: "高価なものは避け、ブランドチョコが無難" },
    parent: { min: 1000, max: 3000, note: "感謝を伝える良い機会" },
    sibling: { min: 500, max: 2000, note: "年齢・性別に関係なく" },
    child: { min: 500, max: 2000, note: "子供向けはキャラクター系が喜ばれる" },
  },
  wedding: {
    lover: { min: 30000, max: 50000, note: "招待された場合はご祝儀として" },
    spouse: { min: 30000, max: 100000, note: "親族への贈り物として" },
    friend: { min: 30000, max: 50000, note: "ご祝儀の相場は3〜5万円" },
    colleague: { min: 30000, max: 50000, note: "会社の同僚は3万円が一般的" },
    boss: { min: 30000, max: 50000, note: "上司への結婚祝いは3万円が相場" },
    parent: { min: 100000, max: 300000, note: "親からの結婚祝いは10〜30万円" },
    sibling: { min: 50000, max: 100000, note: "兄弟姉妹へは5〜10万円が目安" },
    child: { min: 100000, max: 300000, note: "子どもへは10〜30万円が一般的" },
  },
  baby: {
    lover: { min: 5000, max: 15000, note: "消耗品（おむつ等）とプレゼントを組み合わせると◎" },
    spouse: { min: 5000, max: 20000, note: "ベビー用品で実用的なものが喜ばれる" },
    friend: { min: 3000, max: 10000, note: "消耗品（おむつ・ガーゼ）やカタログギフトが人気" },
    colleague: { min: 3000, max: 5000, note: "職場でまとめて贈る場合は1人1000〜2000円" },
    boss: { min: 3000, max: 5000, note: "グループでまとめて贈ることが多い" },
    parent: { min: 10000, max: 30000, note: "初孫の場合は特別に用意することも" },
    sibling: { min: 5000, max: 30000, note: "兄弟姉妹へは実用的なベビー用品が喜ばれる" },
    child: { min: 10000, max: 50000, note: "自分の子への出産祝いはご両親から" },
  },
  ochugen: {
    lover: { min: 3000, max: 5000, note: "日頃の感謝を伝える" },
    spouse: { min: 3000, max: 5000, note: "家族や義実家への挨拶品として" },
    friend: { min: 2000, max: 5000, note: "特別な友人への感謝として" },
    colleague: { min: 2000, max: 3000, note: "職場での慣習に従って" },
    boss: { min: 3000, max: 5000, note: "お世話になっている方へ。食品・飲み物が人気" },
    parent: { min: 3000, max: 10000, note: "実家・義実家へ。食品・地元の名産品が喜ばれる" },
    sibling: { min: 2000, max: 5000, note: "近所に住む兄弟姉妹へ" },
    child: { min: 2000, max: 5000, note: "離れて住む子どもへ" },
  },
  oseibo: {
    lover: { min: 3000, max: 5000, note: "年末の感謝とともに" },
    spouse: { min: 3000, max: 5000, note: "義実家への挨拶品として" },
    friend: { min: 2000, max: 5000, note: "特別な友人への感謝" },
    colleague: { min: 2000, max: 3000, note: "職場での慣習に従って" },
    boss: { min: 3000, max: 5000, note: "お世話になった方へ。高級食品が人気" },
    parent: { min: 3000, max: 10000, note: "実家・義実家へ。食品・酒類が一般的" },
    sibling: { min: 2000, max: 5000, note: "家族間でのお歳暮交換" },
    child: { min: 2000, max: 5000, note: "離れて住む子どもへ" },
  },
  father: {
    lover: { min: 3000, max: 8000, note: "パートナーのお父さんへの贈り物" },
    spouse: { min: 3000, max: 8000, note: "夫（お父さん）へ家族からのプレゼント" },
    friend: { min: 1000, max: 3000, note: "友人のお父さんへ" },
    colleague: { min: 1000, max: 3000, note: "職場での父の日プレゼント" },
    boss: { min: 2000, max: 5000, note: "上司の父の日" },
    parent: { min: 3000, max: 10000, note: "自分の父へ。ネクタイ・財布・グルメが人気" },
    sibling: { min: 1000, max: 3000, note: "兄弟姉妹でまとめて贈る場合" },
    child: { min: 3000, max: 10000, note: "自分が父として子どもから贈ってもらう場合" },
  },
  mother: {
    lover: { min: 3000, max: 8000, note: "パートナーのお母さんへ" },
    spouse: { min: 3000, max: 10000, note: "妻（お母さん）へ家族からのプレゼント" },
    friend: { min: 1000, max: 3000, note: "友人のお母さんへ" },
    colleague: { min: 1000, max: 3000, note: "職場での母の日プレゼント" },
    boss: { min: 2000, max: 5000, note: "上司の母の日" },
    parent: { min: 3000, max: 10000, note: "自分の母へ。花・スイーツ・エステが人気" },
    sibling: { min: 1000, max: 3000, note: "兄弟姉妹でまとめて贈る場合" },
    child: { min: 3000, max: 10000, note: "自分が母として子どもから贈ってもらう場合" },
  },
};

export default function GiftBudgetCalcPage() {
  const [scene, setScene] = useState<Scene>("birthday");
  const [relation, setRelation] = useState<Relation>("friend");

  const budget = BUDGETS[scene]?.[relation];

  const formatNum = (n: number) => n.toLocaleString("ja-JP");

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">プレゼント予算・相場計算</h1>
      <p className="text-gray-600 mb-6">シーンと関係性からプレゼントの相場金額を確認できます。</p>
      <AdBanner />
      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">シーン・イベント</label>
          <div className="grid grid-cols-3 gap-2">
            {SCENES.map((s) => (
              <button key={s.id} onClick={() => setScene(s.id)}
                className={`py-2 px-2 rounded-lg border text-xs font-medium transition-colors ${scene === s.id ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"}`}>
                {s.icon} {s.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">贈る相手との関係</label>
          <div className="grid grid-cols-4 gap-2">
            {RELATIONS.map((r) => (
              <button key={r.id} onClick={() => setRelation(r.id)}
                className={`py-2 px-2 rounded-lg border text-sm font-medium transition-colors ${relation === r.id ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"}`}>
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {budget && (
        <div className="mt-6 bg-pink-50 rounded-xl p-6 border border-pink-200">
          <h2 className="text-lg font-bold text-pink-900 mb-4">
            {SCENES.find(s => s.id === scene)?.icon} {SCENES.find(s => s.id === scene)?.label} × {RELATIONS.find(r => r.id === relation)?.label}
          </h2>
          <div className="bg-white rounded-xl p-5 text-center mb-4">
            <p className="text-sm text-gray-600 mb-1">相場金額</p>
            <p className="text-3xl font-bold text-pink-600">¥{formatNum(budget.min)} 〜 ¥{formatNum(budget.max)}</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-pink-100">
            <p className="text-sm text-gray-700">💡 {budget.note}</p>
          </div>
        </div>
      )}
      <AdBanner />
      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">プレゼント選びのポイント</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex gap-2"><span>🎯</span><span><strong>実用性</strong>：日常で使えるものは喜ばれやすい</span></div>
          <div className="flex gap-2"><span>💬</span><span><strong>相手の趣味・嗜好</strong>：事前にリサーチするとミスが少ない</span></div>
          <div className="flex gap-2"><span>📦</span><span><strong>ラッピング</strong>：見た目の演出で印象が大きく変わる</span></div>
          <div className="flex gap-2"><span>✉️</span><span><strong>メッセージカード</strong>：気持ちを文字にすることで特別感が増す</span></div>
        </div>
      </div>
      <div className="mt-6 bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-4">
          <div><h3 className="font-medium text-gray-900">プレゼントの予算が少なくても喜ばれる方法は？</h3><p className="text-sm text-gray-600 mt-1">手書きのメッセージカードや相手の好みに合わせた選択、丁寧なラッピングで、予算が少なくても気持ちが伝わります。</p></div>
          <div><h3 className="font-medium text-gray-900">オンラインで贈れるプレゼントはありますか？</h3><p className="text-sm text-gray-600 mt-1">カタログギフト、Amazonギフト券、体験ギフト（食事・エステ等）、デジタルコンテンツなどオンライン完結で贈れるギフトが増えています。</p></div>
        </div>
      </div>
      <RelatedTools currentToolId="gift-budget-calc" />
    </main>
  );
}
