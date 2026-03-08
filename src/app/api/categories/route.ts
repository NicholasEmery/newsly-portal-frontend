import { NextResponse } from "next/server";
import { getCategories } from "@/api/services/categories";

export async function GET() {
  try {
    const cats = await getCategories();
    return NextResponse.json(cats || [], { status: 200 });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
