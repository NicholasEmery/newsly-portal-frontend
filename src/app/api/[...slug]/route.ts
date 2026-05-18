import { NextResponse } from "next/server";
import axios from "axios";
import { resolveDataSourceMode } from "@/api/connection/http";
import {
  hasMocksDirectory,
  loadMocksAsync,
  loadMockForPathAsync,
} from "@/api/mocks";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function mapMockForPath(mocks: any, path: string, _query: string) {
  // Exact mappings for well-known endpoints
  if (path === "categories") {
    return mocks?.NAV_ALL_CATEGORIES || mocks?.NAV_PRIMARY_CATEGORIES || [];
  }

  if (path === "social-links") {
    return mocks?.SOCIAL_LINKS_MOCK || [];
  }

  if (path.startsWith("sections/")) {
    if (path.includes("top-notice")) return mocks?.TOP_NOTICE_MOCK ?? null;
    if (path.includes("trending-now"))
      return mocks?.TRENDING_SECTION_MOCK ?? [];
    if (path.includes("latest-news"))
      return mocks?.LATEST_NEWS_SECTION_MOCK ?? null;
    if (path.includes("home-grids")) return mocks?.HOME_SECTIONS_MOCK ?? [];
    if (path.includes("subscriber-news"))
      return mocks?.SUBSCRIBER_NEWS_MOCK ?? [];
  }

  // fallback: try exporting with uppercase underscore key naming
  const normalized = path.replace(/\//g, "_").toUpperCase() + "_MOCK";
  return mocks?.[normalized] ?? null;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params;
  const path = Array.isArray(slug) ? slug.join("/") : String(slug ?? "");
  const url = new URL(request.url);
  const queryString = url.search;

  try {
    const response = await axios.get(`${BACKEND_URL}/${path}${queryString}`, {
      timeout: 10000,
      headers: {
        "Accept-Language": request.headers.get("Accept-Language") || "",
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    const status = error?.response?.status;

    // If backend error (5xx) or network failure, attempt to serve mocks
    if ((status && status >= 500) || !error?.response) {
      const mode = resolveDataSourceMode();
      const hasMocks = hasMocksDirectory();
      if ((mode === "mock" || mode === "auto") && hasMocks) {
        const mocks = await loadMocksAsync();
        let mock = mapMockForPath(mocks, path, queryString);
        if (
          (mock === null || mock === undefined) &&
          (!mocks || Object.keys(mocks).length === 0)
        ) {
          // Try targeted import of the specific mock module
          try {
            const targeted = await loadMockForPathAsync(path);
            if (targeted !== null && targeted !== undefined) mock = targeted;
          } catch (_e) {
            /* ignore */
          }
        }
        if (mock !== null && mock !== undefined) {
          return NextResponse.json(mock, { status: 200 });
        }
      }
    }

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: error.response?.status || 503 },
      );
    }

    return NextResponse.json(
      {
        error: "Failed to proxy request",
      },
      { status: 503 },
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params;
  const path = Array.isArray(slug) ? slug.join("/") : String(slug ?? "");
  const body = await request.json();

  try {
    const response = await axios.post(`${BACKEND_URL}/${path}`, body, {
      timeout: 10000,
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    const status = error?.response?.status;
    if ((status && status >= 500) || !error?.response) {
      const mode = resolveDataSourceMode();
      if ((mode === "mock" || mode === "auto") && hasMocksDirectory()) {
        const mocks = await loadMocksAsync();
        const mock = mapMockForPath(mocks, path, "");
        if (mock !== null && mock !== undefined) {
          return NextResponse.json(mock, { status: 200 });
        }
      }
    }

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: error.response?.status || 503 },
      );
    }

    return NextResponse.json(
      {
        error: "Failed to proxy request",
      },
      { status: 503 },
    );
  }
}
