"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

import { colorGroups } from "@/lib/theme";

const C = colorGroups;

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
      <div className="flex h-full items-center justify-center font-label text-xs text-content-subtle">
        No data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={chartData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
        <XAxis
          dataKey="label"
          tick={{ fontSize: 10, fill: C.content["content-muted"] }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: C.content["content-muted"] }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          cursor={{ fill: `${C.primary.primary}1a` }}
          contentStyle={{
            background: C.surface["surface-overlay"],
            border: "none",
            borderRadius: 8,
            fontSize: 12,
            color: C.content["on-surface"],
          }}
          formatter={(value) => [Number(value).toLocaleString(), "views"]}
          labelFormatter={(label) => label}
        />
        <Bar
          dataKey="views"
          fill={C.primary.primary}
          activeBar={{ fill: C.state.warning }}
          radius={[4, 4, 0, 0]}
          maxBarSize={32}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
