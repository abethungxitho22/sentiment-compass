import { useMemo } from "react";
import { ThumbsUp, ThumbsDown, Minus, Target, Database } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { ImprovementBanner } from "@/components/dashboard/ImprovementBanner";
import { StatBox } from "@/components/dashboard/StatBox";
import { TrendLineChart } from "@/components/dashboard/TrendLineChart";
import { SentimentDonut } from "@/components/dashboard/SentimentDonut";
import { ModelComparisonTable } from "@/components/dashboard/ModelComparisonTable";
import { PasteAnalyzer } from "@/components/dashboard/PasteAnalyzer";
import { buildTrend, computeMetrics, type Review } from "@/lib/mock-data";
import { useAnalysisHistory } from "@/hooks/use-analysis-history";

const Index = () => {
  const { history, add, clear } = useAnalysisHistory();

  // Charts and stats reflect ONLY the reviews the user has submitted.
  const reviews: Review[] = useMemo(
    () =>
      history.map((h) => ({
        id: h.id,
        source: "Google Reviews",
        author: "You",
        rating: h.consensus === "positive" ? 5 : h.consensus === "negative" ? 1 : 3,
        text: h.text,
        createdAt: h.createdAt,
        label: h.consensus,
        scores: {
          VADER: h.results[0].score,
          HuggingFace: h.results[1].score,
        },
      })),
    [history],
  );

  const trend = useMemo(() => buildTrend(reviews), [reviews]);
  const metrics = useMemo(() => computeMetrics(reviews), [reviews]);

  const counts = reviews.reduce(
    (acc, r) => { acc[r.label]++; return acc; },
    { positive: 0, negative: 0, neutral: 0 } as Record<"positive"|"negative"|"neutral", number>,
  );
  const total = reviews.length;
  const safe = (n: number) => (total === 0 ? "0.0" : ((n / total) * 100).toFixed(1));
  const pos = safe(counts.positive);
  const neg = safe(counts.negative);
  const neu = safe(counts.neutral);
  const avgAcc = (metrics.reduce((s, m) => s + m.accuracy, 0) / metrics.length * 100).toFixed(1);

  return (
    <AppLayout>
      <div className="grid-bg">
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1500px] mx-auto space-y-6">
          {/* Page heading */}
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="font-mono-data text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-1">
                Sentilytics · overview
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                Customer sentiment dashboard
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono-data text-muted-foreground">
              <span>3 models</span>
              <span className="text-border">|</span>
              <span className="text-foreground">{total} review{total === 1 ? "" : "s"} submitted</span>
            </div>
          </div>

          <ImprovementBanner trend={trend} />

          {/* Stat row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <StatBox label="% Positive"        value={`${pos}%`} hint={`${counts.positive} review${counts.positive === 1 ? "" : "s"}`}  icon={ThumbsUp}  variant="positive" />
            <StatBox label="% Negative"        value={`${neg}%`} hint={`${counts.negative} review${counts.negative === 1 ? "" : "s"}`}  icon={ThumbsDown} variant="negative" />
            <StatBox label="% Neutral"         value={`${neu}%`} hint={`${counts.neutral} review${counts.neutral === 1 ? "" : "s"}`}   icon={Minus}     variant="neutral" />
            <StatBox label="Avg model accuracy"value={`${avgAcc}%`} hint="VADER · HF · AWS"          icon={Target}    variant="cyan" />
            <StatBox label="Total analyzed"    value={total.toLocaleString()} hint="your submissions"     icon={Database}  variant="purple" />
          </div>

          {/* Trend + donut */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TrendLineChart data={trend} />
            </div>
            <SentimentDonut reviews={reviews} />
          </div>

          {/* Model table */}
          <ModelComparisonTable metrics={metrics} />

          {/* Paste analyzer (full-width) */}
          <PasteAnalyzer
            history={history}
            onSubmit={add}
            onClear={clear}
          />

          <footer className="pt-4 pb-2 text-center font-mono-data text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Sentilytics · v1.0 · multi-model sentiment intelligence
          </footer>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
