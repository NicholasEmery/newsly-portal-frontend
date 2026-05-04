import { NextResponse } from "next/server";
import { loadMocksAsync } from "@/api/mocks";
import { TopNoticeSchema } from "@/api/schemas/homepage";

export async function GET() {
  const mocks = await loadMocksAsync();
  if (!mocks) {
    // eslint-disable-next-line no-console
    console.debug("[top-notice] mocks not available; returning empty payload");
  }
  const payload = TopNoticeSchema.parse(mocks?.TOP_NOTICE_MOCK || {});
  return NextResponse.json(payload, {
    status: 200,
    headers: { "Cache-Control": "no-store" },
  });
}
