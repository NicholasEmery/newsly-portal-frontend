import { NextResponse } from "next/server";
import { loadMocks } from "@/api/mocks";
import { TopNoticeSchema } from "@/api/schemas/homepage";

export async function GET() {
  const mocks = loadMocks();
  const payload = TopNoticeSchema.parse(mocks?.TOP_NOTICE_MOCK || {});
  return NextResponse.json(payload, {
    status: 200,
    headers: { "Cache-Control": "no-store" },
  });
}
