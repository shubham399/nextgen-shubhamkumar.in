"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface DailyViewsChartProps {
  days: { date: string; views: number }[];
}

function formatDate(date: string) {
  return new Date(date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short" });
}

export default function DailyViewsChart({ days }: DailyViewsChartProps) {
  const chartData = days.map((d) => ({
    ...d,
    label: formatDate(d.date),
  }));

  if (!days.length || days.every((d) => d.views === 0)) {
    return (
      <div className="h-full flex items-center justify-center text-on-surface-variant/30 font-label text-xs">
        No data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={chartData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
        <XAxis
          dataKey="label"
          tick={{ fontSize: 10, fill: "#bbc9cf" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "#bbc9cf" }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          cursor={{ fill: "rgba(165, 231, 255, 0.1)" }}
          contentStyle={{
            background: "#2a2a2a",
            border: "none",
            borderRadius: 8,
            fontSize: 12,
            color: "#e5e2e1",
          }}
          formatter={(value) => [Number(value).toLocaleString(), "views"]}
          labelFormatter={(label) => label}
        />
        <Bar
          dataKey="views"
          fill="#a5e7ff"
          activeBar={{ fill: "#00d2ff" }}
          radius={[4, 4, 0, 0]}
          maxBarSize={32}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
