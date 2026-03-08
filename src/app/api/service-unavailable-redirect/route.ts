import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const reason = searchParams.get("reason") || "unknown";

  const response = new NextResponse(null, {
    status: 302,
    headers: {
      Location: "/service-unavailable",
    },
  });
  response.cookies.set("serviceUnavailableReason", reason, {
    path: "/service-unavailable",
    httpOnly: true,
  });
  return response;
}
