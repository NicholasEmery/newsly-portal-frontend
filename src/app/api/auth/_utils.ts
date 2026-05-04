import { NextResponse } from "next/server";

export const appendSetCookieHeaders = (
  response: NextResponse,
  setCookieHeader: string | string[] | undefined,
) => {
  if (!setCookieHeader) return;

  const cookies = Array.isArray(setCookieHeader)
    ? setCookieHeader
    : [setCookieHeader];

  cookies.forEach((cookie) => {
    response.headers.append("set-cookie", cookie);
  });
};
