import { ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { registryVersion } from "@/lib/docs";
import { getReleaseAnchor, releases } from "@/lib/releases";
import { siteConfig } from "@/lib/site";

const formatter = new Intl.DateTimeFormat("en", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function ChangelogList() {
  return (
    <div className="flex flex-col gap-4">
      {releases.map((release) => {
        const isCurrent = release.version === registryVersion;

        return (
          <article
            key={release.version}
            id={getReleaseAnchor(release)}
            className="scroll-mt-24"
          >
            <div className="grid border border-white/10 bg-white/[0.012] md:grid-cols-[9rem_minmax(0,1fr)]">
              <div className="border-b border-white/10 p-4 md:border-b-0 md:border-r">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-zinc-600">
                  {formatReleaseDate(release.date)}
                </p>
                {isCurrent ? (
                  <Badge
                    variant="outline"
                    className="mt-3 rounded-none border-amber-400/40 bg-amber-300 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-zinc-950"
                  >
                    beta
                  </Badge>
                ) : null}
              </div>
              <div className="min-w-0">
                <div className="border-b border-white/10 p-5">
                  <h2 className="text-xl font-medium tracking-normal text-zinc-100">
                    {release.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-zinc-500">
                    {release.summary}
                  </p>
                </div>
                <div className="flex flex-col gap-5 p-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    {release.sections.map((section) => (
                      <section key={section.title} className="space-y-3">
                        <h3 className="text-sm font-medium text-zinc-100">
                          {section.title}
                        </h3>
                        <ul className="space-y-2 text-sm leading-6 text-zinc-500">
                          {section.items.map((item) => (
                            <li key={item} className="flex gap-2">
                              <span
                                className="mt-2 size-1.5 shrink-0 bg-zinc-500"
                                aria-hidden="true"
                              />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 border-t border-white/10 pt-4">
                    {release.links.map((link) => (
                      <Button
                        key={link.label}
                        asChild
                        variant="outline"
                        size="sm"
                        className="rounded-none border-white/10 bg-[#050505] text-zinc-300 hover:bg-white/[0.045] hover:text-zinc-100"
                      >
                        <a
                          href={getPublicReleaseHref(link.href)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {link.label}
                          <ExternalLink data-icon="inline-end" />
                        </a>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function formatReleaseDate(date: string) {
  return formatter.format(new Date(`${date}T00:00:00.000Z`));
}

function getPublicReleaseHref(href: string) {
  if (href.includes("/compare/")) {
    return `${siteConfig.repository}/commits`;
  }

  if (href.includes("/tree/")) {
    return siteConfig.repository;
  }

  return `${siteConfig.repository}/releases`;
}

export { ChangelogList };
