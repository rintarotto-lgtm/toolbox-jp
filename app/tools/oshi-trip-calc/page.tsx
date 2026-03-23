"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";

/* ─── 定数 ─── */

const cities = [
  "東京",
  "大阪",
  "名古屋",
  "福岡",
  "札幌",
  "仙台",
  "広島",
  "横浜",
  "埼玉",
  "神戸",
  "京都",
  "その他",
] as const;

type City = (typeof cities)[number];

const tripDays = [
  { label: "日帰り", days: 1, nights: 0 },
  { label: "1泊2日", days: 2, nights: 1 },
  { label: "2泊3日", days: 3, nights: 2 },
  { label: "3泊4日", days: 4, nights: 3 },
] as const;

type TransportType = "shinkansen" | "plane" | "bus" | "car" | "train";

const transportLabels: Record<TransportType, string> = {
  shinkansen: "新幹線",
  plane: "飛行機",
  bus: "高速バス",
  car: "車(高速道路)",
  train: "在来線",
};

const transportEmoji: Record<TransportType, string> = {
  shinkansen: "🚄",
  plane: "✈️",
  bus: "🚌",
  car: "🚗",
  train: "🚃",
};

/* 片道料金（円）。0 = その手段では行けない */
const transportCosts: Record<
  string,
  Partial<Record<TransportType, number>>
> = {
  "東京-大阪": { shinkansen: 13870, plane: 20000, bus: 5000, car: 8000, train: 8910 },
  "東京-名古屋": { shinkansen: 11300, plane: 18000, bus: 4000, car: 5500, train: 6380 },
  "東京-福岡": { shinkansen: 22220, plane: 25000, bus: 12000, car: 15000 },
  "東京-札幌": { plane: 30000 },
  "東京-仙台": { shinkansen: 11210, plane: 18000, bus: 3500, car: 5000, train: 5940 },
  "東京-広島": { shinkansen: 19440, plane: 22000, bus: 8000, car: 12000, train: 11880 },
  "東京-横浜": { shinkansen: 1730, train: 480, bus: 800, car: 1500 },
  "東京-埼玉": { train: 480, bus: 600, car: 1000 },
  "東京-神戸": { shinkansen: 14700, plane: 21000, bus: 5500, car: 8500, train: 9350 },
  "東京-京都": { shinkansen: 13320, plane: 19000, bus: 4800, car: 7500, train: 8360 },
  "大阪-福岡": { shinkansen: 15400, plane: 18000, bus: 5000, car: 9000 },
  "大阪-名古屋": { shinkansen: 6680, bus: 2500, car: 4000, train: 3410 },
  "大阪-札幌": { plane: 28000 },
  "大阪-仙台": { shinkansen: 19980, plane: 22000, bus: 9000 },
  "大阪-広島": { shinkansen: 10440, bus: 4000, car: 5500, train: 5720 },
  "大阪-横浜": { shinkansen: 13100, bus: 4800, car: 7500, train: 8400 },
  "大阪-神戸": { shinkansen: 2900, train: 410, bus: 600, car: 1500 },
  "大阪-京都": { shinkansen: 2900, train: 580, bus: 700, car: 1500 },
  "名古屋-福岡": { shinkansen: 18380, plane: 20000, bus: 7000, car: 11000 },
  "名古屋-札幌": { plane: 26000 },
  "名古屋-仙台": { shinkansen: 17890, plane: 20000, bus: 7000 },
  "名古屋-広島": { shinkansen: 12600, bus: 5500, car: 7000 },
  "福岡-札幌": { plane: 35000 },
  "福岡-仙台": { plane: 28000 },
  "福岡-広島": { shinkansen: 9170, bus: 3500, car: 4500 },
  "札幌-仙台": { plane: 22000 },
  "仙台-広島": { shinkansen: 24000, plane: 26000 },
};

function getRouteKey(from: City, to: City): string | null {
  if (from === to || from === "その他" || to === "その他") return null;
  const key1 = `${from}-${to}`;
  const key2 = `${to}-${from}`;
  if (transportCosts[key1]) return key1;
  if (transportCosts[key2]) return key2;
  return null;
}

const hotelTypes = [
  { label: "ビジネスホテル", price: 7000 },
  { label: "カプセルホテル", price: 3500 },
  { label: "シティホテル", price: 12000 },
  { label: "友人宅", price: 0 },
  { label: "カスタム", price: -1 },
] as const;

const goodsPresets = [3000, 5000, 10000, 20000];

/* ─── SVG Pie Chart ─── */

interface PieSlice {
  label: string;
  value: number;
  color: string;
}

function PieChart({ slices }: { slices: PieSlice[] }) {
  const total = slices.reduce((s, sl) => s + sl.value, 0);
  if (total === 0) return null;

  const nonZero = slices.filter((s) => s.value > 0);
  let cumulative = 0;
  const arcs = nonZero.map((slice) => {
    const start = cumulative;
    const ratio = slice.value / total;
    cumulative += ratio;
    return { ...slice, start, ratio };
  });

  function arcPath(startAngle: number, endAngle: number, r: number) {
    const sx = 50 + r * Math.cos(startAngle);
    const sy = 50 + r * Math.sin(startAngle);
    const ex = 50 + r * Math.cos(endAngle);
    const ey = 50 + r * Math.sin(endAngle);
    const large = endAngle - startAngle > Math.PI ? 1 : 0;
    return `M 50 50 L ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey} Z`;
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <svg viewBox="0 0 100 100" className="w-48 h-48 drop-shadow-md">
        {arcs.map((arc, i) => {
          if (arc.ratio >= 0.999) {
            return (
              <circle key={i} cx="50" cy="50" r="45" fill={arc.color} />
            );
          }
          const startAngle = arc.start * 2 * Math.PI - Math.PI / 2;
          const endAngle = (arc.start + arc.ratio) * 2 * Math.PI - Math.PI / 2;
          return (
            <path key={i} d={arcPath(startAngle, endAngle, 45)} fill={arc.color} />
          );
        })}
        <circle cx="50" cy="50" r="22" fill="white" />
      </svg>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
        {nonZero.map((s, i) => (
          <span key={i} className="flex items-center gap-1">
            <span
              className="inline-block w-3 h-3 rounded-sm"
              style={{ backgroundColor: s.color }}
            />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── メインコンポーネント ─── */

export default function OshiTripCalc() {
  /* イベント情報 */
  const [eventName, setEventName] = useState("");
  const [destination, setDestination] = useState<City>("大阪");
  const [origin, setOrigin] = useState<City>("東京");
  const [tripDayIndex, setTripDayIndex] = useState(1); // 1泊2日
  const trip = tripDays[tripDayIndex];

  /* 交通費 */
  const [transport, setTransport] = useState<TransportType>("shinkansen");
  const [roundTrip, setRoundTrip] = useState(true);
  const [transportOverride, setTransportOverride] = useState("");

  /* 宿泊費 */
  const [hotelTypeIndex, setHotelTypeIndex] = useState(0);
  const [customHotelPrice, setCustomHotelPrice] = useState("");
  const [nightsOverride, setNightsOverride] = useState("");

  /* チケット */
  const [ticketPrice, setTicketPrice] = useState("");
  const [fanclubFee, setFanclubFee] = useState("");

  /* グッズ・その他 */
  const [goodsBudget, setGoodsBudget] = useState("");
  const [mealPerDay, setMealPerDay] = useState("3000");
  const [localTransportPerDay, setLocalTransportPerDay] = useState("1000");
  const [otherCost, setOtherCost] = useState("");

  /* 計算 */
  const routeKey = getRouteKey(origin, destination);
  const routeData = routeKey ? transportCosts[routeKey] : null;
  const availableTransport = routeData
    ? (Object.keys(routeData) as TransportType[]).filter(
        (k) => (routeData[k] ?? 0) > 0
      )
    : null;
  const estimatedOneWay = routeData?.[transport] ?? 0;
  const transportUnavailable = routeData !== null && estimatedOneWay === 0;

  const nights =
    nightsOverride !== "" ? parseInt(nightsOverride) || 0 : trip.nights;
  const days = nights + 1;

  const costs = useMemo(() => {
    const tOverride = transportOverride !== "" ? parseInt(transportOverride) || 0 : null;
    const oneWay = tOverride !== null ? tOverride : estimatedOneWay;
    const transportTotal = roundTrip ? oneWay * 2 : oneWay;

    const hotelType = hotelTypes[hotelTypeIndex];
    const hotelPricePerNight =
      hotelType.price === -1
        ? parseInt(customHotelPrice) || 0
        : hotelType.price;
    const hotelTotal = hotelPricePerNight * nights;

    const ticket = parseInt(ticketPrice) || 0;
    const fanclub = parseInt(fanclubFee) || 0;
    const ticketTotal = ticket + fanclub;

    const goods = parseInt(goodsBudget) || 0;
    const meals = (parseInt(mealPerDay) || 0) * days;
    const localTr = (parseInt(localTransportPerDay) || 0) * days;
    const other = parseInt(otherCost) || 0;

    const total =
      transportTotal + hotelTotal + ticketTotal + goods + meals + localTr + other;

    /* 節約計算 */
    const cheapestTransport = routeData
      ? Math.min(
          ...Object.entries(routeData)
            .filter(([, v]) => (v ?? 0) > 0)
            .map(([, v]) => v!)
        )
      : oneWay;
    const cheapestTransportKey = routeData
      ? (Object.entries(routeData).find(
          ([, v]) => v === cheapestTransport
        )?.[0] as TransportType | undefined)
      : null;
    const cheapestTransportTotal = roundTrip
      ? cheapestTransport * 2
      : cheapestTransport;

    const cheapestHotel = 3500; // カプセルホテル
    const cheapestHotelTotal = cheapestHotel * nights;

    const savingsTransport = transportTotal - cheapestTransportTotal;
    const savingsHotel = hotelTotal - cheapestHotelTotal;
    const cheapestTotal =
      cheapestTransportTotal +
      cheapestHotelTotal +
      ticketTotal +
      goods +
      meals +
      localTr +
      other;

    return {
      transport: transportTotal,
      hotel: hotelTotal,
      ticket: ticketTotal,
      goods,
      meals,
      localTransport: localTr,
      other,
      total,
      savingsTransport,
      savingsHotel,
      cheapestTransportKey,
      cheapestTotal,
    };
  }, [
    transportOverride,
    estimatedOneWay,
    roundTrip,
    hotelTypeIndex,
    customHotelPrice,
    nights,
    days,
    ticketPrice,
    fanclubFee,
    goodsBudget,
    mealPerDay,
    localTransportPerDay,
    otherCost,
    routeData,
  ]);

  const pieSlices: PieSlice[] = [
    { label: "交通費", value: costs.transport, color: "#f472b6" },
    { label: "宿泊費", value: costs.hotel, color: "#a78bfa" },
    { label: "チケット", value: costs.ticket, color: "#60a5fa" },
    { label: "グッズ", value: costs.goods, color: "#fbbf24" },
    { label: "食費", value: costs.meals, color: "#34d399" },
    { label: "現地交通", value: costs.localTransport, color: "#fb923c" },
    { label: "その他", value: costs.other, color: "#94a3b8" },
  ];

  const fmt = (n: number) => n.toLocaleString("ja-JP");

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* ヘッダー */}
      <h1 className="text-2xl font-bold mb-1">
        <span className="text-pink-500">推し活</span>遠征費計算ツール
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        推しに会いに行く遠征、全部でいくらかかる？交通費・宿泊費・グッズ代をまとめて計算！
      </p>

      <AdBanner />

      {/* ── 結果ヒーローカード ── */}
      {costs.total > 0 && (
        <div className="mt-6 mb-8 rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200 p-6 text-center shadow-sm">
          <p className="text-sm text-pink-600 font-semibold mb-1">
            {eventName || "遠征"} 合計費用
          </p>
          <p className="text-4xl font-extrabold text-pink-600 tracking-tight">
            &yen;{fmt(costs.total)}
          </p>

          {/* 内訳リスト */}
          <div className="mt-5 grid grid-cols-2 gap-2 text-left text-sm max-w-xs mx-auto">
            {[
              { emoji: "🚄", label: "交通費", value: costs.transport },
              { emoji: "🏨", label: "宿泊費", value: costs.hotel },
              { emoji: "🎫", label: "チケット", value: costs.ticket },
              { emoji: "🛍️", label: "グッズ", value: costs.goods },
              { emoji: "🍜", label: "食費", value: costs.meals },
              { emoji: "🚃", label: "現地交通", value: costs.localTransport },
              { emoji: "📦", label: "その他", value: costs.other },
            ]
              .filter((r) => r.value > 0)
              .map((r) => (
                <div
                  key={r.label}
                  className="flex items-center justify-between rounded-lg bg-white/70 px-3 py-1.5"
                >
                  <span>
                    {r.emoji} {r.label}
                  </span>
                  <span className="font-semibold">&yen;{fmt(r.value)}</span>
                </div>
              ))}
          </div>

          {/* パイチャート */}
          <div className="mt-5">
            <PieChart slices={pieSlices} />
          </div>
        </div>
      )}

      {/* ── フォームセクション ── */}
      <div className="space-y-8">
        {/* 1. イベント情報 */}
        <Section emoji="🎤" title="イベント情報">
          <Label text="イベント名（メモ用）">
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="例: ○○ LIVE TOUR 2026"
              className="input-field"
            />
          </Label>

          <div className="grid grid-cols-2 gap-3">
            <Label text="出発地">
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value as City)}
                className="input-field"
              >
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Label>
            <Label text="開催地">
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value as City)}
                className="input-field"
              >
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Label>
          </div>

          <Label text="日数">
            <div className="flex gap-2 flex-wrap">
              {tripDays.map((td, i) => (
                <button
                  key={td.label}
                  onClick={() => setTripDayIndex(i)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    tripDayIndex === i
                      ? "bg-pink-500 text-white shadow"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {td.label}
                </button>
              ))}
            </div>
          </Label>
        </Section>

        {/* 2. 交通費 */}
        <Section emoji="🚄" title="交通費">
          <Label text="移動手段">
            <div className="flex gap-2 flex-wrap">
              {(
                Object.keys(transportLabels) as TransportType[]
              ).map((key) => {
                const disabled =
                  availableTransport !== null &&
                  !availableTransport.includes(key);
                return (
                  <button
                    key={key}
                    onClick={() => !disabled && setTransport(key)}
                    disabled={disabled}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                      transport === key
                        ? "bg-pink-500 text-white shadow"
                        : disabled
                        ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {transportEmoji[key]} {transportLabels[key]}
                  </button>
                );
              })}
            </div>
          </Label>

          {transportUnavailable && (
            <p className="text-sm text-orange-600 bg-orange-50 rounded-lg px-3 py-2">
              このルートでは{transportLabels[transport]}は利用できません。他の手段を選んでください。
            </p>
          )}

          {estimatedOneWay > 0 && (
            <p className="text-sm text-gray-500">
              {transportEmoji[transport]} {origin}→{destination} 片道 約&yen;
              {fmt(estimatedOneWay)}（自動見積もり）
            </p>
          )}

          <label className="flex items-center gap-2 cursor-pointer">
            <div
              onClick={() => setRoundTrip(!roundTrip)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                roundTrip ? "bg-pink-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  roundTrip ? "translate-x-5" : ""
                }`}
              />
            </div>
            <span className="text-sm">往復</span>
          </label>

          <Label text="金額を手動で入力（片道）">
            <input
              type="number"
              value={transportOverride}
              onChange={(e) => setTransportOverride(e.target.value)}
              placeholder={
                estimatedOneWay > 0
                  ? `自動見積もり: ¥${fmt(estimatedOneWay)}`
                  : "金額を入力"
              }
              className="input-field"
            />
          </Label>
        </Section>

        {/* 3. 宿泊費 */}
        {nights > 0 && (
          <Section emoji="🏨" title="宿泊費">
            <Label text="宿泊タイプ">
              <div className="flex gap-2 flex-wrap">
                {hotelTypes.map((ht, i) => (
                  <button
                    key={ht.label}
                    onClick={() => setHotelTypeIndex(i)}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                      hotelTypeIndex === i
                        ? "bg-purple-500 text-white shadow"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {ht.label}
                    {ht.price > 0 && (
                      <span className="ml-1 opacity-70">
                        &yen;{fmt(ht.price)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </Label>

            {hotelTypes[hotelTypeIndex].price === -1 && (
              <Label text="1泊あたりの宿泊費">
                <input
                  type="number"
                  value={customHotelPrice}
                  onChange={(e) => setCustomHotelPrice(e.target.value)}
                  placeholder="金額を入力"
                  className="input-field"
                />
              </Label>
            )}

            <Label text="泊数">
              <input
                type="number"
                value={nightsOverride !== "" ? nightsOverride : trip.nights.toString()}
                onChange={(e) => setNightsOverride(e.target.value)}
                min={0}
                className="input-field w-24"
              />
            </Label>
          </Section>
        )}

        {/* 4. チケット・イベント費 */}
        <Section emoji="🎫" title="チケット・イベント費">
          <Label text="チケット代">
            <input
              type="number"
              value={ticketPrice}
              onChange={(e) => setTicketPrice(e.target.value)}
              placeholder="¥0"
              className="input-field"
            />
          </Label>
          <Label text="ファンクラブ会費（月割）">
            <input
              type="number"
              value={fanclubFee}
              onChange={(e) => setFanclubFee(e.target.value)}
              placeholder="¥0"
              className="input-field"
            />
          </Label>
        </Section>

        {/* 5. グッズ・その他 */}
        <Section emoji="🛍️" title="グッズ・その他">
          <Label text="グッズ予算">
            <input
              type="number"
              value={goodsBudget}
              onChange={(e) => setGoodsBudget(e.target.value)}
              placeholder="¥0"
              className="input-field"
            />
            <div className="flex gap-2 mt-2 flex-wrap">
              {goodsPresets.map((p) => (
                <button
                  key={p}
                  onClick={() => setGoodsBudget(p.toString())}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    goodsBudget === p.toString()
                      ? "bg-yellow-400 text-white shadow"
                      : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200"
                  }`}
                >
                  &yen;{fmt(p)}
                </button>
              ))}
            </div>
          </Label>

          <Label text={`食費（1日あたり × ${days}日）`}>
            <input
              type="number"
              value={mealPerDay}
              onChange={(e) => setMealPerDay(e.target.value)}
              placeholder="¥3,000"
              className="input-field"
            />
          </Label>

          <Label text={`現地交通費（1日あたり × ${days}日）`}>
            <input
              type="number"
              value={localTransportPerDay}
              onChange={(e) => setLocalTransportPerDay(e.target.value)}
              placeholder="¥1,000"
              className="input-field"
            />
          </Label>

          <Label text="その他">
            <input
              type="number"
              value={otherCost}
              onChange={(e) => setOtherCost(e.target.value)}
              placeholder="¥0"
              className="input-field"
            />
          </Label>
        </Section>
      </div>

      {/* ── 節約Tips ── */}
      {costs.total > 0 &&
        (costs.savingsTransport > 0 || costs.savingsHotel > 0) && (
          <div className="mt-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 p-5">
            <h2 className="text-base font-bold text-green-700 mb-3">
              💡 節約Tips
            </h2>
            <ul className="space-y-2 text-sm text-green-800">
              {costs.savingsTransport > 0 && costs.cheapestTransportKey && (
                <li>
                  {transportEmoji[costs.cheapestTransportKey]}{" "}
                  {transportLabels[costs.cheapestTransportKey]}
                  に変更すると交通費を
                  <span className="font-bold">
                    &yen;{fmt(costs.savingsTransport)}
                  </span>
                  節約できます
                </li>
              )}
              {costs.savingsHotel > 0 && nights > 0 && (
                <li>
                  🏨
                  カプセルホテルに変更すると宿泊費を
                  <span className="font-bold">
                    &yen;{fmt(costs.savingsHotel)}
                  </span>
                  節約できます
                </li>
              )}
            </ul>
            <div className="mt-3 pt-3 border-t border-green-200 text-center">
              <p className="text-xs text-green-600">最安プランなら</p>
              <p className="text-xl font-extrabold text-green-700">
                &yen;{fmt(costs.cheapestTotal)}
              </p>
            </div>
          </div>
        )}

      <div className="mt-10">
        <AdBanner />
      </div>

      {/* Tailwind utility styles for inputs */}
      <style jsx global>{`
        .input-field {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border-radius: 0.75rem;
          border: 1px solid #e5e7eb;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.15s;
          background: white;
        }
        .input-field:focus {
          border-color: #ec4899;
          box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
        }
      `}</style>
    </div>
  );
}

/* ─── 共通コンポーネント ─── */

function Section({
  emoji,
  title,
  children,
}: {
  emoji: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
      <h2 className="text-base font-bold flex items-center gap-2">
        <span className="text-xl">{emoji}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Label({
  text,
  children,
}: {
  text: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-gray-700">{text}</span>
      {children}
    </label>
  );
}
