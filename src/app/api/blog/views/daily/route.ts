import { NextResponse } from "next/server";
import { fetchAPI } from "@/lib/api";
import type { DailyViewsResponse } from "@/types";

export async function GET() {
  try {
    const data = await fetchAPI<DailyViewsResponse>("/api/blog/views/daily");
    return NextResponse.json(data);
  } catch (err) {
    console.error("[blog/views/daily] fetchAPI FAILED", err);
    const emptyDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
        date: d.toISOString().split("T")[0],
        views: 0,
      };
    });
    return NextResponse.json({ days: emptyDays });
  }
}
