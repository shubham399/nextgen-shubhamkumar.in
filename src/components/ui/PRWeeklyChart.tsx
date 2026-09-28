"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";

interface PRBucket {
  label: string;
  count: number;
  full: boolean;
  days: number;
}

interface PRWeeklyChartProps {
  buckets: PRBucket[];
}

import { themeVar } from "@/lib/theme";

// Live role references rather than hexes, so the series follows the active
// palette. var() resolves in SVG presentation attributes, which is where a
// recharts <Cell> writes its fill.
const COLOR_FULL = themeVar("primary");
const COLOR_PARTIAL = themeVar("warning");
const COLOR_TICK = themeVar("content-muted");

export default function PRWeeklyChart({ buckets }: PRWeeklyChartProps) {
  const chartData = buckets.map((b) => ({
    name: b.label,
    count: b.count,
    full: b.full,
    tooltip: b.full
      ? `${b.label}: ${b.count} commit${b.count === 1 ? "" : "s"}`
      : `${b.label}: ${b.count} commit${b.count === 1 ? "" : "s"} (partial, ${b.days}d)`,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} margin={{ top: 20, right: 4, left: -16, bottom: 0 }}>
        <XAxis
          dataKey="name"
          tick={{ fontSize: 10, fill: COLOR_TICK }}
          axisLine={false}
          tickLine={false}
          interval={1}
        />
        <YAxis
          tick={{ fontSize: 10, fill: COLOR_TICK }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />

        <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={40} label={{ position: "top", fontSize: 10, fill: COLOR_TICK, offset: 4 }}>
          {chartData.map((entry, i) => (
            <Cell key={i} fill={entry.full ? COLOR_FULL : COLOR_PARTIAL} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
