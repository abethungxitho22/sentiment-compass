import {
  CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import type { DailyTrend } from "@/lib/mock-data";

interface Props { data: DailyTrend[]; }

const fmt = (d: string) => {
  const dt = new Date(d);
  return `${dt.getMonth() + 1}/${dt.getDate()}`;
};

export function TrendLineChart({ data }: Props) {
  return (
    <div className="panel panel-cyan p-5 sm:p-6">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <h2 className="font-display text-xl font-semibold">Sentiment over time</h2>
          <p className="font-mono-data text-[11px] uppercase tracking-[0.2em] text-muted-foreground mt-1">
            Compound score · daily average · per model
          </p>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: -16 }}>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 6" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={fmt}
              stroke="hsl(var(--muted-foreground))"
              tick={{ fontSize: 11, fontFamily: "DM Mono" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[-1, 1]}
              stroke="hsl(var(--muted-foreground))"
              tick={{ fontSize: 11, fontFamily: "DM Mono" }}
              tickLine={false}
              axisLine={false}
              width={48}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 12,
                fontFamily: "DM Mono",
                fontSize: 12,
              }}
              labelFormatter={(d) => fmt(d as string)}
            />
            <Legend
              wrapperStyle={{ fontFamily: "DM Mono", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.15em" }}
              iconType="plainline"
            />
            <Line type="monotone" dataKey="VADER"          stroke="hsl(var(--primary))"   strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="HuggingFace"    stroke="hsl(var(--secondary))" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="AWS Comprehend" stroke="hsl(var(--accent))"    strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
