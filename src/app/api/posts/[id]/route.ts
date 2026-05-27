import { NextRequest, NextResponse } from "next/server";
import { loadMocksAsync, hasMocksDirectory } from "@/api/mocks";
import { requestJsonWithLocale, resolveBackendBaseUrl } from "@/api/connection/http";
import {
  getDataSourceStatus,
  getResolvedDataSourceMode,
} from "@/api/services/homeSections";
import { getLocaleFromRequest } from "@/api/utils/locale";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const status = await getDataSourceStatus();
  const mode = getResolvedDataSourceMode();

  const normalize = (slug: string) => slug.toLowerCase();
  const matchId = (itemSlug: string) => {
    const normalizedSlug = normalize(itemSlug);
    const slugTail = normalizedSlug.split("/").filter(Boolean).pop();
    const normalizedId = decodeURIComponent(id).toLowerCase();
    return (
      slugTail === normalizedId ||
      normalizedSlug === `/${normalizedId}` ||
      normalizedSlug === `/post/${normalizedId}`
    );
  };

  const serveMocks = async () => {
    const mocks = await loadMocksAsync();
    if (!mocks || !mocks.ALL_NEWS_MOCK) {
      // eslint-disable-next-line no-console
      console.debug("[posts/id] mocks missing or ALL_NEWS_MOCK not present");
      return NextResponse.json(null, { status: 404 });
    }
    const post = mocks.ALL_NEWS_MOCK.find((item: any) => matchId(item.Slug));
    if (!post) return NextResponse.json(null, { status: 404 });
    return NextResponse.json(
      {
        Title: post.Title,
        Creator: post.Creator,
        DateCreated: post.CreatedAt,
        Content: post.Description,
      },
      { status: 200 },
    );
  };

  if (mode === "mock") return await serveMocks();

  if (!status.canRender && hasMocksDirectory()) return await serveMocks();

  try {
    const locale = getLocaleFromRequest(request);
    const resp = await requestJsonWithLocale(
      `${resolveBackendBaseUrl()}/posts/${encodeURIComponent(id)}`,
      {} as any,
      locale,
    );
    return NextResponse.json(resp, { status: 200 });
  } catch (err) {
    if (hasMocksDirectory()) return await serveMocks();
    return NextResponse.json(null, { status: 404 });
  }
}
