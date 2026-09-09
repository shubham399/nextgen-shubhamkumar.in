"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface PRBucket {
  label: string;
  count: number;
  full: boolean;
  days: number;
}

interface PRWeeklyChartProps {
  buckets: PRBucket[];
}

const COLOR_FULL = "#33a852";
const COLOR_PARTIAL = "#7a72e8";

export default function PRWeeklyChart({ buckets }: PRWeeklyChartProps) {
  const chartData = buckets.map((b) => ({
    name: b.label,
    count: b.count,
    full: b.full,
    tooltip: b.full
      ? `${b.label}: ${b.count} PR${b.count === 1 ? "" : "s"}`
      : `${b.label}: ${b.count} PR${b.count === 1 ? "" : "s"} (partial, ${b.days}d)`,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} margin={{ top: 20, right: 4, left: -16, bottom: 0 }}>
        <XAxis
          dataKey="name"
          tick={{ fontSize: 10, fill: "#bbc9cf" }}
          axisLine={false}
          tickLine={false}
          interval={1}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "#bbc9cf" }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          cursor={{ fill: "rgba(165, 231, 255, 0.08)" }}
          contentStyle={{
            background: "#1c1b1b",
            border: "none",
            borderRadius: 8,
            fontSize: 12,
            color: "#e5e2e1",
          }}
          formatter={(value, _name, props) => [
            String((props.payload as Record<string, unknown>).tooltip ?? value),
            "",
          ]}
          labelFormatter={() => ""}
        />
        <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={40} label={{ position: "top", fontSize: 10, fill: "#bbc9cf", offset: 4 }}>
          {chartData.map((entry, i) => (
            <Cell key={i} fill={entry.full ? COLOR_FULL : COLOR_PARTIAL} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
