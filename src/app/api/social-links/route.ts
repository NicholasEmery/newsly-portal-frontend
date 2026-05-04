import { NextResponse } from "next/server";
import { getSocialLinks } from "@/api/services/socialLinks";

export async function GET() {
  try {
    const socialLinks = await getSocialLinks();
    return NextResponse.json(socialLinks || [], { status: 200 });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
