// Lightweight deterministic sentiment engine that mimics three models.
// Replace with real VADER / HuggingFace / AWS Comprehend calls server-side later.

export type SentimentLabel = "positive" | "negative" | "neutral";
export type ModelName = "VADER" | "HuggingFace" ;

export interface ModelResult {
  model: ModelName;
  label: SentimentLabel;
  score: number;       // -1..1 (compound)
  confidence: number;  // 0..1
}

const POS = [
  "love","loved","great","excellent","amazing","awesome","fantastic","best","good","perfect",
  "happy","helpful","easy","fast","smooth","beautiful","brilliant","recommend","worth","superb",
  "intuitive","reliable","stunning","delightful","wonderful","incredible","favorite","solid",
];
const NEG = [
  "hate","bad","terrible","awful","worst","slow","broken","crash","crashes","buggy","bug","glitch",
  "useless","poor","disappointing","disappointed","horrible","frustrating","annoying","laggy",
  "unresponsive","expensive","scam","unusable","confusing","missing","fail","failed","stuck",
];
const NEGATORS = ["not","no","never","barely","hardly","without","cannot","can't","don't","didn't","isn't","wasn't"];
const INTENSIFIERS: Record<string, number> = { "very":1.4,"really":1.35,"super":1.4,"so":1.2,"absolutely":1.5,"extremely":1.6,"totally":1.4 };

function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9'\s!?]/g, " ").split(/\s+/).filter(Boolean);
}

// Base lexicon score in [-1, 1]
function baseScore(text: string): { score: number; words: number } {
  const tokens = tokenize(text);
  if (tokens.length === 0) return { score: 0, words: 0 };
  let raw = 0;
  let hits = 0;
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    let val = 0;
    if (POS.includes(t)) val = 1;
    else if (NEG.includes(t)) val = -1;
    if (val !== 0) {
      const prev = tokens[i - 1];
      const prev2 = tokens[i - 2];
      if (prev && NEGATORS.includes(prev)) val *= -0.85;
      if (prev && INTENSIFIERS[prev]) val *= INTENSIFIERS[prev];
      else if (prev2 && INTENSIFIERS[prev2]) val *= INTENSIFIERS[prev2] * 0.9;
      raw += val;
      hits++;
    }
  }
  // Punctuation boost
  const exclaim = (text.match(/!/g) || []).length;
  raw *= 1 + Math.min(exclaim, 3) * 0.05;
  // Normalize like VADER's compound (alpha=15)
  const compound = raw / Math.sqrt(raw * raw + 15);
  return { score: Number(compound.toFixed(3)), words: hits };
}

function labelFromScore(s: number, posT = 0.05, negT = -0.05): SentimentLabel {
  if (s >= posT) return "positive";
  if (s <= negT) return "negative";
  return "neutral";
}

// Deterministic per-model variation (so the three models disagree slightly)
function jitter(seed: string, amp: number): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const u = ((h >>> 0) % 10000) / 10000; // 0..1
  return (u - 0.5) * 2 * amp;             // -amp..amp
}

export function analyzeAll(text: string): ModelResult[] {
  const { score: base, words } = baseScore(text);

  // VADER — strict thresholds, minimal noise
  const vScore = Math.max(-1, Math.min(1, base + jitter(text + "vader", 0.04)));
  const vader: ModelResult = {
    model: "VADER",
    score: Number(vScore.toFixed(3)),
    label: labelFromScore(vScore, 0.05, -0.05),
    confidence: Math.min(0.99, 0.55 + Math.abs(vScore) * 0.4 + Math.min(words, 5) * 0.02),
  };

  // HuggingFace (cardiffnlp/twitter-roberta) — more confident, slightly amplified
  const hScore = Math.max(-1, Math.min(1, base * 1.15 + jitter(text + "hf", 0.07)));
  const hf: ModelResult = {
    model: "HuggingFace",
    score: Number(hScore.toFixed(3)),
    label: labelFromScore(hScore, 0.1, -0.1),
    confidence: Math.min(0.99, 0.62 + Math.abs(hScore) * 0.35 + Math.min(words, 5) * 0.02),
  };

  // AWS Comprehend — wider neutral band


  return [vader, hf];
}

export function consensusLabel(results: ModelResult[]): SentimentLabel {
  const counts: Record<SentimentLabel, number> = { positive: 0, negative: 0, neutral: 0 };
  results.forEach((r) => counts[r.label]++);
  return (Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]) as SentimentLabel;
}
