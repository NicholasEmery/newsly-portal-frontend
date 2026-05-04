import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { api, resolveDataSourceMode } from "@/api/connection/http";
import { AuthSessionSchema } from "@/api/schemas/authSession";
import { appendSetCookieHeaders } from "../_utils";

export async function POST(request: NextRequest) {
  if (resolveDataSourceMode() === "mock") {
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const response = await api.post(
      "/auth/logout",
      {},
      {
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      },
    );

    const nextResponse = NextResponse.json(
      AuthSessionSchema.parse({ authenticated: false, user: null }),
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      },
    );

    appendSetCookieHeaders(nextResponse, response.headers["set-cookie"]);
    return nextResponse;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      return NextResponse.json(
        { error: "Logout failed" },
        { status },
      );
    }

    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
