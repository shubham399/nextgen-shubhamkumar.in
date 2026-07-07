import { NextResponse } from "next/server";
import {
  getMe,
  getSocials,
  getContacts,
  getNav,
  getExperience,
  getSkills,
  getServices,
  getTestimonials,
  getCertificates,
  getWorkouts,
  getWorkoutSummary,
  fetchAPI,
} from "@/lib/api";

export async function POST() {
  try {
    await fetchAPI("/api/cache/flush", { method: "POST" });

    const results = await Promise.allSettled([
      getMe(),
      getSocials(),
      getContacts(),
      getNav(),
      getExperience(),
      getSkills(),
      getServices(),
      getTestimonials(),
      getCertificates(),
      getWorkouts(),
      getWorkoutSummary(),
    ]);

    const errors = results.filter(
      (r): r is PromiseRejectedResult => r.status === "rejected"
    );

    if (errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          revalidated: results.length - errors.length,
          total: results.length,
          errors: errors.map((e) => e.reason?.message),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      revalidated: results.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
