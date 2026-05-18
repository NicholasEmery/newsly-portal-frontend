import { NextResponse } from "next/server";
import { getDataSourceStatus } from "@/api/services/homeSections";
import { hasMocksDirectory } from "@/api/mocks";
import {
  resolveDataSourceMode,
  isDataSourceEnvConfigured,
} from "@/api/connection/http";

export async function GET() {
  const status = await getDataSourceStatus();
  const envConfigured = isDataSourceEnvConfigured();
  const mode = resolveDataSourceMode();
  const mocksPresent = hasMocksDirectory();

  let mocksSummary: any = null;
  try {
    // dynamic import to reflect what loadMocksAsync would get
    const m = await import("@/mocks");
    const mods = m;
    mocksSummary = {
      hasLatest: Boolean(mods?.LATEST_NEWS_SECTION_MOCK),
      latestCount: mods?.LATEST_NEWS_SECTION_MOCK?.Items?.length || 0,
      hasTrending: Boolean(mods?.TRENDING_SECTION_MOCK),
      trendingCount: mods?.TRENDING_SECTION_MOCK?.length || 0,
    };
  } catch (err) {
    mocksSummary = { error: String(err) };
  }

  return NextResponse.json(
    { status, envConfigured, mode, mocksPresent, mocksSummary },
    { status: 200 },
  );
}
