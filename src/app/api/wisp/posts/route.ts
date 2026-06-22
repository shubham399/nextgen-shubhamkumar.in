import { wisp } from "@/lib/wisp";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "6", 10);
  const query = searchParams.get("query") || undefined;
  const tags = searchParams.getAll("tag");

  const result = await wisp.getPosts({ page, limit, query, tags: tags.length ? tags : undefined });
  return NextResponse.json(result);
}
