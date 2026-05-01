import { getReleaseUrl, releases } from "@/lib/releases";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export async function GET() {
  const latest = releases[0];
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    "  <channel>",
    `    <title>${escapeXml(siteConfig.name)} Changelog</title>`,
    `    <link>${absoluteUrl("/changelog")}</link>`,
    `    <description>${escapeXml(siteConfig.description)}</description>`,
    "    <language>en</language>",
    latest ? `    <lastBuildDate>${toRssDate(latest.date)}</lastBuildDate>` : "",
    ...releases.flatMap((release) => [
      "    <item>",
      `      <title>${escapeXml(`v${release.version}: ${release.title}`)}</title>`,
      `      <link>${getReleaseUrl(release)}</link>`,
      `      <guid isPermaLink="true">${getReleaseUrl(release)}</guid>`,
      `      <pubDate>${toRssDate(release.date)}</pubDate>`,
      `      <description>${escapeXml(release.summary)}</description>`,
      "    </item>",
    ]),
    "  </channel>",
    "</rss>",
  ]
    .filter(Boolean)
    .join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}

function toRssDate(date: string) {
  return new Date(`${date}T00:00:00.000Z`).toUTCString();
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
