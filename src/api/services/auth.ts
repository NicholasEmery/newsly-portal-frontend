import { AuthSessionSchema, type AuthSessionDto } from "@/api/schemas/authSession";
import type { AuthLoginClientDto, AuthSignupClientDto } from "@/api/schemas/auth";

type JsonResponse = {
  ok: boolean;
  status: number;
  data: unknown;
};

const parseJsonResponse = async (response: Response): Promise<JsonResponse> => {
  const text = await response.text();
  let data: unknown = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
};

export const getAuthSession = async (): Promise<AuthSessionDto> => {
  const response = await fetch("/api/auth/session", {
    cache: "no-store",
    credentials: "include",
  });

  const payload = await parseJsonResponse(response);
  return AuthSessionSchema.parse(payload.data);
};

export const loginWithAuth = async (
  data: AuthLoginClientDto,
): Promise<AuthSessionDto> => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    cache: "no-store",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const payload = await parseJsonResponse(response);
  if (!payload.ok) {
    throw new Error(
      typeof payload.data === "object" && payload.data && "error" in payload.data
        ? String((payload.data as { error?: string }).error || "Login failed")
        : "Login failed",
    );
  }

  return AuthSessionSchema.parse(payload.data);
};

export const signupWithAuth = async (
  data: AuthSignupClientDto,
): Promise<AuthSessionDto> => {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    cache: "no-store",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const payload = await parseJsonResponse(response);
  if (!payload.ok) {
    throw new Error(
      typeof payload.data === "object" && payload.data && "error" in payload.data
        ? String((payload.data as { error?: string }).error || "Signup failed")
        : "Signup failed",
    );
  }

  return AuthSessionSchema.parse(payload.data);
};

export const logoutAuth = async (): Promise<AuthSessionDto> => {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
    cache: "no-store",
    credentials: "include",
  });

  const payload = await parseJsonResponse(response);
  if (!payload.ok) {
    throw new Error("Logout failed");
  }

  return AuthSessionSchema.parse(payload.data);
};
