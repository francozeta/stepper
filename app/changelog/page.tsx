import type { Metadata } from "next";

import { PageHeader, Section } from "@/components/docs-content";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { releaseItems, v2Roadmap } from "@/lib/docs";

export const metadata: Metadata = {
  title: "Release 0.1.0",
};

export default function ChangelogPage() {
  return (
    <>
      <PageHeader
        eyebrow="guides"
        title="Release 0.1.0"
        description="The first release candidate establishes the Stepper primitive, local demos, and docs-ready project structure."
        badge="published"
      />

      <Section title="Added">
        <Card>
          <CardHeader>
            <CardTitle>Stepper 0.1.0</CardTitle>
            <CardDescription>
              Published as a GitHub release and tagged with v0.1.0.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
              {releaseItems.map((item) => (
                <li key={item} className="flex gap-2">
                  <Badge variant="secondary" className="mt-0.5 h-5 px-1.5">
                    +
                  </Badge>
                  <span className="leading-6">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </Section>

      <Section title="Release link">
        <a
          href="https://github.com/francozeta/stepper/releases/tag/v0.1.0"
          className="inline-flex min-h-10 w-fit items-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-[background-color,box-shadow,transform] hover:bg-muted active:scale-[0.96] focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
        >
          Open GitHub release
        </a>
      </Section>

      <Section
        title="Next direction"
        description="The next version can become more composable without making V1 heavier."
      >
        <div className="grid gap-3 md:grid-cols-3">
          {v2Roadmap.map((item) => (
            <Card key={item.title} size="sm">
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
