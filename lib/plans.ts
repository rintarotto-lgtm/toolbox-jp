export type PlanType = "FREE" | "PRO" | "TEAM";

export interface PlanConfig {
  name: string;
  nameJa: string;
  price: number; // 月額（円）
  priceLabel: string;
  stripePriceId: string | null;
  features: string[];
  limits: {
    dailyUsagePerTool: number; // -1 = 無制限
    apiCallsPerDay: number; // 0 = API無し
    batchProcessing: boolean;
    fileUpload: boolean;
    noAds: boolean;
    teamManagement: boolean;
    prioritySupport: boolean;
  };
}

export const PLANS: Record<PlanType, PlanConfig> = {
  FREE: {
    name: "Free",
    nameJa: "無料プラン",
    price: 0,
    priceLabel: "¥0",
    stripePriceId: null,
    features: [
      "全21ツール利用可能",
      "1ツールあたり50回/日",
      "広告表示あり",
    ],
    limits: {
      dailyUsagePerTool: 50,
      apiCallsPerDay: 0,
      batchProcessing: false,
      fileUpload: false,
      noAds: false,
      teamManagement: false,
      prioritySupport: false,
    },
  },
  PRO: {
    name: "Pro",
    nameJa: "Proプラン",
    price: 980,
    priceLabel: "¥980/月",
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID ?? "",
    features: [
      "全ツール無制限利用",
      "広告なし",
      "バッチ処理",
      "ファイルアップロード",
      "API 1,000回/日",
      "メールサポート",
    ],
    limits: {
      dailyUsagePerTool: -1,
      apiCallsPerDay: 1000,
      batchProcessing: true,
      fileUpload: true,
      noAds: true,
      teamManagement: false,
      prioritySupport: false,
    },
  },
  TEAM: {
    name: "Team",
    nameJa: "Teamプラン",
    price: 2980,
    priceLabel: "¥2,980/月",
    stripePriceId: process.env.STRIPE_TEAM_PRICE_ID ?? "",
    features: [
      "Proプランの全機能",
      "API 10,000回/日",
      "チーム管理",
      "優先サポート",
      "カスタムブランディング",
    ],
    limits: {
      dailyUsagePerTool: -1,
      apiCallsPerDay: 10000,
      batchProcessing: true,
      fileUpload: true,
      noAds: true,
      teamManagement: true,
      prioritySupport: true,
    },
  },
};

export function getPlanConfig(plan: PlanType): PlanConfig {
  return PLANS[plan] ?? PLANS.FREE;
}
