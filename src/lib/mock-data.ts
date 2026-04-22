import { analyzeAll, consensusLabel, ModelName, SentimentLabel } from "./sentiment";

export type Source = "Google Reviews" | "App Store" | "Play Store" | "Trustpilot";

export interface Review {
  id: string;
  source: Source;
  author: string;
  rating: number;
  text: string;
  createdAt: string; // ISO
  label: SentimentLabel;
  scores: Record<ModelName, number>;
}

export const SOURCE_STATUS: Record<Source, "connected" | "degraded"> = {
  "Google Reviews": "connected",
  "App Store": "connected",
  "Play Store": "degraded",
  "Trustpilot": "connected",
};

const AUTHORS = ["Maya R.","Jordan K.","Priya S.","Liam B.","Noor A.","Hiro T.","Elena M.","Omar D.","Zoe P.","Marco V.","Sana I.","Dan W."];

const REVIEW_TEXTS: { text: string; rating: number }[] = [
  { text: "Absolutely love the new dashboard, it's incredibly fast and intuitive!", rating: 5 },
  { text: "App keeps crashing after the latest update, very frustrating and unusable.", rating: 1 },
  { text: "Decent features but the UI is confusing and slow to load on mobile.", rating: 3 },
  { text: "Best customer support I've ever experienced, super helpful team.", rating: 5 },
  { text: "Not worth the price, missing basic functionality and full of bugs.", rating: 2 },
  { text: "Solid product overall, does what it promises without much fuss.", rating: 4 },
  { text: "The onboarding flow is beautiful and really easy to follow.", rating: 5 },
  { text: "Terrible performance, the export feature is completely broken.", rating: 1 },
  { text: "Pretty good but I wish the reports were more customizable.", rating: 4 },
  { text: "Stunning design and the analytics are genuinely useful.", rating: 5 },
  { text: "Disappointed with the latest pricing change, no longer good value.", rating: 2 },
  { text: "Works fine, nothing exceptional but reliable for daily use.", rating: 3 },
  { text: "Fantastic update! The new charts are exactly what we needed.", rating: 5 },
  { text: "Buggy, laggy, and the support team never responds. Avoid.", rating: 1 },
  { text: "Really helpful for our small team, recommend it without hesitation.", rating: 5 },
  { text: "The mobile app is unresponsive half the time, very annoying.", rating: 2 },
  { text: "Excellent integration options, saved us hours of manual work.", rating: 5 },
  { text: "Confusing pricing tiers but the core product is solid.", rating: 3 },
  { text: "Smooth, fast, and beautifully designed. A delightful experience.", rating: 5 },
  { text: "Crashes on launch every single time on Android 14, fix this please.", rating: 1 },
];
const SOURCES: Source[] = ["Google Reviews", "App Store", "Play Store", "Trustpilot"];

function pick<T>(arr: T[], i: number): T { return arr[i % arr.length]; }

export function generateReviews(count = 240): Review[] {
  const out: Review[] = [];
  const now = Date.now();
  for (let i = 0; i < count; i++) {
    const t = pick(REVIEW_TEXTS, i * 7 + 3);
    const results = analyzeAll(t.text);
    const label = consensusLabel(results);
    const daysAgo = Math.floor((i / count) * 30); // spread over 30 days
    const created = new Date(now - daysAgo * 86400000 - (i % 24) * 3600000).toISOString();
    out.push({
      id: `r_${i}`,
      source: pick(SOURCES, i * 3 + 1),
      author: pick(AUTHORS, i * 5),
      rating: t.rating,
      text: t.text,
      createdAt: created,
      label,
      scores: {
        VADER: results[0].score,
        HuggingFace: results[1].score,
        "AWS Comprehend": results[2].score,
      },
    });
  }
  return out;
}

export interface DailyTrend {
  date: string;        // YYYY-MM-DD
  VADER: number;
  HuggingFace: number;
  "AWS Comprehend": number;
}

export function buildTrend(reviews: Review[]): DailyTrend[] {
  const buckets = new Map<string, { v: number[]; h: number[]; a: number[] }>();
  reviews.forEach((r) => {
    const d = r.createdAt.slice(0, 10);
    if (!buckets.has(d)) buckets.set(d, { v: [], h: [], a: [] });
    const b = buckets.get(d)!;
    b.v.push(r.scores.VADER);
    b.h.push(r.scores.HuggingFace);
    b.a.push(r.scores["AWS Comprehend"]);
  });
  const avg = (arr: number[]) => (arr.reduce((s, n) => s + n, 0) / arr.length);
  return [...buckets.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, b]) => ({
      date,
      VADER: Number(avg(b.v).toFixed(3)),
      HuggingFace: Number(avg(b.h).toFixed(3)),
      "AWS Comprehend": Number(avg(b.a).toFixed(3)),
    }));
}

export interface ModelMetrics {
  model: ModelName;
  precision: number;
  recall: number;
  f1: number;
  accuracy: number;
}

// Deterministic mock metrics derived from data volume so it feels real
export function computeMetrics(reviews: Review[]): ModelMetrics[] {
  const n = reviews.length;
  const seedFactor = Math.min(0.04, n / 10000);
  return [
    { model: "VADER",          precision: 0.78 + seedFactor, recall: 0.74 + seedFactor, f1: 0.76 + seedFactor, accuracy: 0.77 + seedFactor },
    { model: "HuggingFace",    precision: 0.89 + seedFactor, recall: 0.87 + seedFactor, f1: 0.88 + seedFactor, accuracy: 0.88 + seedFactor },
    { model: "AWS Comprehend", precision: 0.84 + seedFactor, recall: 0.82 + seedFactor, f1: 0.83 + seedFactor, accuracy: 0.83 + seedFactor },
  ].map((m) => ({
    ...m,
    precision: Number(Math.min(0.99, m.precision).toFixed(3)),
    recall:    Number(Math.min(0.99, m.recall).toFixed(3)),
    f1:        Number(Math.min(0.99, m.f1).toFixed(3)),
    accuracy:  Number(Math.min(0.99, m.accuracy).toFixed(3)),
  }));
}
