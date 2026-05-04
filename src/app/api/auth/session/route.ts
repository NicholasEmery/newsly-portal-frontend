import { NextRequest, NextResponse } from "next/server";
import { api, resolveDataSourceMode } from "@/api/connection/http";
import { AuthSessionSchema } from "@/api/schemas/authSession";
import axios from "axios";

const normalizeSession = (data: unknown) => {
  const payload = (data || {}) as Record<string, unknown>;
  const userCandidate =
    (payload.user as Record<string, unknown> | undefined) ||
    (payload.account as Record<string, unknown> | undefined) ||
    (payload.profile as Record<string, unknown> | undefined) ||
    null;

  const authenticated =
    Boolean(payload.authenticated) ||
    Boolean(payload.isAuthenticated) ||
    Boolean(userCandidate);

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
    authenticated,
    user: authenticated ? normalizedUser : null,
  });
};

export async function GET(request: NextRequest) {
  if (resolveDataSourceMode() === "mock") {
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const response = await api.get("/auth/session", {
      headers: cookieHeader ? { cookie: cookieHeader } : undefined,
    });

    return NextResponse.json(normalizeSession(response.data), {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 200, headers: { "Cache-Control": "no-store" } },
      );
    }

    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  }
}
