import type { Metadata } from "next";

import { PageHeader, Section } from "@/components/docs-content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { releaseItems, v2Roadmap } from "@/lib/docs";

export const metadata: Metadata = {
  title: "Release 0.1.3",
};

export default function ChangelogPage() {
  return (
    <>
      <PageHeader
        eyebrow="guides"
        title="Release 0.1.3"
        description="This pass tightens npm package DX: smaller Radix dependency, explicit Tailwind setup, and clearer style contracts."
        badge="ready"
      />

      <Section title="Changed">
        <Card>
          <CardHeader>
            <CardTitle>Stepper 0.1.3</CardTitle>
            <CardDescription>
              Prepared for @francozeta/stepper v0.1.3.
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

      <Section title="Tag link">
        <Button asChild variant="outline" className="w-fit">
          <a href="https://github.com/francozeta/stepper/tree/v0.1.3">
            Open GitHub tag
          </a>
        </Button>
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
