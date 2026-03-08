import { NextRequest, NextResponse } from "next/server";
import { loadMocks, hasMocksDirectory } from "@/api/mocks";
import { requestJson } from "@/api/connection/http";
import {
  getDataSourceStatus,
  getResolvedDataSourceMode,
} from "@/api/services/homeSections";
import { withQuery } from "@/api/routes";

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

  const serveMocks = () => {
    const mocks = loadMocks();
    if (!mocks || !mocks.ALL_NEWS_MOCK) {
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

  if (mode === "mock") return serveMocks();

  if (!status.canRender && hasMocksDirectory()) return serveMocks();

  try {
    const resp = await requestJson(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/${encodeURIComponent(id)}`,
      {} as any,
    );
    return NextResponse.json(resp, { status: 200 });
  } catch (err) {
    if (hasMocksDirectory()) return serveMocks();
    return NextResponse.json(null, { status: 404 });
  }
}
