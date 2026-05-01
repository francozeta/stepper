import { ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { packageVersion } from "@/lib/docs";
import { getReleaseAnchor, releases } from "@/lib/releases";

const formatter = new Intl.DateTimeFormat("en", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function ChangelogList() {
  return (
    <div className="flex flex-col gap-6">
      {releases.map((release) => {
        const isCurrent = release.version === packageVersion;

        return (
          <article
            key={release.version}
            id={getReleaseAnchor(release)}
            className="scroll-mt-24"
          >
            <Card>
              <CardHeader className="gap-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="text-xl">
                        {formatReleaseTitle(release)}
                      </CardTitle>
                      {isCurrent ? (
                        <Badge variant="secondary" className="font-mono">
                          current
                        </Badge>
                      ) : null}
                    </div>
                    <CardDescription>{release.summary}</CardDescription>
                  </div>
                  <Badge variant="outline" className="w-fit font-mono">
                    v{release.version}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <div className="grid gap-4 md:grid-cols-2">
                  {release.sections.map((section) => (
                    <section key={section.title} className="space-y-3">
                      <h3 className="text-sm font-medium text-foreground">
                        {section.title}
                      </h3>
                      <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
                        {section.items.map((item) => (
                          <li key={item} className="flex gap-2">
                            <span
                              className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                              aria-hidden="true"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                  {release.links.map((link) => (
                    <Button
                      key={link.href}
                      asChild
                      variant="outline"
                      size="sm"
                    >
                      <a href={link.href} target="_blank" rel="noreferrer">
                        {link.label}
                        <ExternalLink data-icon="inline-end" />
                      </a>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </article>
        );
      })}
    </div>
  );
}

function formatReleaseTitle(release: { date: string; title: string }) {
  return `${formatter.format(new Date(`${release.date}T00:00:00.000Z`))} - ${
    release.title
  }`;
}

export { ChangelogList };
