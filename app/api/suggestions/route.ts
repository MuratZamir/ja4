import { NextRequest, NextResponse } from "next/server";
import { getSuggestions } from "@/lib/search";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") || "";

  if (q.length < 2) {
    return NextResponse.json([]);
  }

  const suggestions = getSuggestions(q);
  return NextResponse.json(suggestions);
}
