import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { api, resolveDataSourceMode } from "@/api/connection/http";
import { AuthLoginClientSchema } from "@/api/schemas/auth";
import { AuthSessionSchema } from "@/api/schemas/authSession";
import { appendSetCookieHeaders } from "../_utils";

const normalizeSession = (data: unknown) => {
  const payload = (data || {}) as Record<string, unknown>;
  const userCandidate =
    (payload.user as Record<string, unknown> | undefined) ||
    (payload.account as Record<string, unknown> | undefined) ||
    (payload.profile as Record<string, unknown> | undefined) ||
    null;

  const normalizedUser = userCandidate
    ? {
        id: String(userCandidate.id || ""),
        name: String(userCandidate.name || userCandidate.fullName || ""),
        fullName: String(userCandidate.fullName || userCandidate.name || ""),
        email: String(userCandidate.email || ""),
        role: String(userCandidate.role || ""),
        plan: String(userCandidate.plan || ""),
        isPremium: Boolean(userCandidate.isPremium),
      }
    : null;

  return AuthSessionSchema.parse({
    authenticated: true,
    user: normalizedUser,
  });
};

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = AuthLoginClientSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid login data" },
      { status: 400 },
    );
  }

  if (resolveDataSourceMode() === "mock") {
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const response = await api.post("/auth/login", result.data, {
      headers: cookieHeader ? { cookie: cookieHeader } : undefined,
    });

    const nextResponse = NextResponse.json(normalizeSession(response.data), {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });

    appendSetCookieHeaders(nextResponse, response.headers["set-cookie"]);
    return nextResponse;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message =
        (error.response?.data as { error?: string; message?: string } | undefined)
          ?.error ||
        (error.response?.data as { error?: string; message?: string } | undefined)
          ?.message ||
        "Login failed";

      return NextResponse.json({ error: message }, { status });
    }

    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
