import { getFullMarkdownDocs } from "@/lib/docs-markdown";

export const dynamic = "force-static";

export async function GET() {
  return new Response(await getFullMarkdownDocs(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
