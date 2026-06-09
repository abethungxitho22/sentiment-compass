import {
  CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import type { DailyTrend } from "@/lib/mock-data";

interface Props { data: DailyTrend[]; }

// Map a -1..1 sentiment compound score to a 0..100 "happiness" score.
const toHappy = (s: number) => Math.round(((s + 1) / 2) * 100);

const fmtTime = (iso: string) => {
  const dt = new Date(iso);
  const h = dt.getHours();
  const m = dt.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  const hh = ((h + 11) % 12) + 1;
  return `${dt.getMonth() + 1}/${dt.getDate()} ${hh}:${m}${ampm}`;
};

const moodLabel = (v: number) =>
  v >= 70 ? "Happy" : v >= 55 ? "Pleased" : v >= 45 ? "Neutral" : v >= 30 ? "Unhappy" : "Upset";

export function TrendLineChart({ data }: Props) {
  const empty = data.length === 0;

  return (
    <div className="panel panel-cyan p-5 sm:p-6">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <h2 className="font-display text-xl font-semibold">Sentiment over time</h2>
          <p className="font-mono-data text-[11px] uppercase tracking-[0.2em] text-muted-foreground mt-1">
            Happiness score (0 – 100) · per model · your reviews only
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-3 font-mono-data text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <span><span className="text-negative">0</span> upset</span>
          <span><span className="text-neutral">50</span> neutral</span>
          <span><span className="text-positive">100</span> happy</span>
        </div>
      </div>

      {empty ? (
        <div className="h-72 grid place-items-center text-center">
          <div>
            <div className="font-mono-data text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              No reviews yet
            </div>
            <p className="text-sm text-foreground/80 mt-2 max-w-sm">
              Submit a review in the analyzer below — each one becomes a point on this chart.
            </p>
          </div>
        </div>
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data.map((d) => ({
                time: d.date,
                VADER: toHappy(d.VADER),
                HuggingFace: toHappy(d.HuggingFace),
               // "AWS Comprehend": toHappy(d["AWS Comprehend"]),
              }))}
              margin={{ top: 8, right: 12, bottom: 4, left: -16 }}
            >
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 6" vertical={false} />
              <XAxis
                dataKey="time"
                tickFormatter={fmtTime}
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 11, fontFamily: "DM Mono" }}
                tickLine={false}
                axisLine={false}
                minTickGap={32}
              />
              <YAxis
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 11, fontFamily: "DM Mono" }}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 12,
                  fontFamily: "DM Mono",
                  fontSize: 12,
                }}
                labelFormatter={(t) => fmtTime(t as string)}
                formatter={(value: number, name) => [`${value} / 100  (${moodLabel(value)})`, name]}
              />
              <Legend
                wrapperStyle={{ fontFamily: "DM Mono", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.15em" }}
                iconType="plainline"
              />
              <Line type="monotone" dataKey="VADER"          stroke="hsl(var(--primary))"   strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="HuggingFace"    stroke="hsl(var(--secondary))" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
             
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
