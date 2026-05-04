import { NextRequest, NextResponse } from "next/server";
import { getCategories } from "@/api/services/categories";
import { getLocaleFromRequest } from "@/api/utils/locale";

export async function GET(request: NextRequest) {
  try {
    const locale = getLocaleFromRequest(request);
    const cats = await getCategories(locale);
    return NextResponse.json(cats || [], { status: 200 });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
