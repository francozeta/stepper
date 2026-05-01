import { notFound } from "next/navigation";

import { getMarkdownDoc, getMarkdownDocContent } from "@/lib/docs-markdown";

export const dynamic = "force-static";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await context.params;
  const doc = getMarkdownDoc(slug);

  if (!doc) {
    notFound();
  }

  return new Response(await getMarkdownDocContent(doc), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
