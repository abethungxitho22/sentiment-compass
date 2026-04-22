import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { Review } from "@/lib/mock-data";

interface Props { reviews: Review[]; }

export function SentimentDonut({ reviews }: Props) {
  const counts = reviews.reduce(
    (acc, r) => { acc[r.label]++; return acc; },
    { positive: 0, negative: 0, neutral: 0 } as Record<"positive" | "negative" | "neutral", number>,
  );
  const total = reviews.length;
  const data = [
    { name: "Positive", value: counts.positive, color: "hsl(var(--positive))" },
    { name: "Negative", value: counts.negative, color: "hsl(var(--negative))" },
    { name: "Neutral",  value: counts.neutral,  color: "hsl(var(--neutral))"  },
  ];
  const positivePct = total > 0 ? Math.round((counts.positive / total) * 100) : 0;

  return (
    <div className="panel panel-purple p-5 sm:p-6 h-full">
      <div className="mb-3">
        <h2 className="font-display text-xl font-semibold">Overall split</h2>
        <p className="font-mono-data text-[11px] uppercase tracking-[0.2em] text-muted-foreground mt-1">
          {total > 0
            ? `Based on ${total} review${total === 1 ? "" : "s"} you submitted`
            : "No reviews submitted yet"}
        </p>
      </div>

      {total === 0 ? (
        <div className="h-56 grid place-items-center text-center">
          <p className="text-sm text-foreground/80 max-w-[220px]">
            Submit a review below and your sentiment split will appear here.
          </p>
        </div>
      ) : (
        <>
          <div className="relative h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 12,
                    fontFamily: "DM Mono",
                    fontSize: 12,
                  }}
                  formatter={(value: number, name) => [
                    `${value} review${value === 1 ? "" : "s"}  (${Math.round((value / total) * 100)}%)`,
                    name,
                  ]}
                />
                <Pie data={data} dataKey="value" nameKey="name" innerRadius={62} outerRadius={92} strokeWidth={2} stroke="hsl(var(--card))">
                  {data.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 grid place-items-center pointer-events-none">
              <div className="text-center">
                <div className="font-mono-data text-3xl font-medium text-positive">{positivePct}%</div>
                <div className="font-mono-data text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Positive</div>
              </div>
            </div>
          </div>
          <ul className="mt-4 grid grid-cols-3 gap-2">
            {data.map((d) => {
              const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
              return (
                <li key={d.name} className="text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                    <span className="font-mono-data text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{d.name}</span>
                  </div>
                  <div className="font-mono-data text-sm">
                    {d.value} <span className="text-muted-foreground">· {pct}%</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
