import type { Metadata } from "next";

import { CodeBlock, PageHeader, Section } from "@/components/docs-content";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  indicatorCode,
  stateSelectorsCode,
  tailwindV3ContentSnippet,
  tailwindV4SourceSnippet,
  themeTokensSnippet,
} from "@/lib/docs";

export const metadata: Metadata = {
  title: "Styling",
};

const tokens = [
  "background",
  "foreground",
  "border",
  "muted",
  "muted-foreground",
  "primary",
  "primary-foreground",
  "destructive",
  "destructive-foreground",
  "ring",
];

export default function StylingPage() {
  return (
    <>
      <PageHeader
        eyebrow="guides"
        title="Styling"
        description="The Stepper uses shadcn/ui theme tokens and data attributes so users can restyle it without changing the logic."
      />

      <Section
        title="Theme tokens"
        description="The core avoids one-off color values and leans on semantic Tailwind tokens."
      >
        <div className="flex flex-wrap gap-2">
          {tokens.map((token) => (
            <Badge key={token} variant="outline" className="font-mono">
              {token}
            </Badge>
          ))}
        </div>
      </Section>

      <Section
        title="NPM package usage"
        description="When importing the compiled package directly, Tailwind must scan the package output. Copy-paste registry usage does not need this because the component lives in your app source."
      >
        <div className="grid gap-4">
          <CodeBlock
            code={tailwindV4SourceSnippet}
            filename="app/globals.css"
            lang="css"
          />
          <CodeBlock
            code={tailwindV3ContentSnippet}
            filename="tailwind.config.ts"
            lang="ts"
          />
        </div>
      </Section>

      <Section
        title="Required tokens"
        description="Vanilla Tailwind apps need the same semantic color names that shadcn/ui projects already provide."
      >
        <CodeBlock
          code={themeTokensSnippet}
          filename="globals.css"
          lang="css"
        />
      </Section>

      <Section title="State selectors">
        <CodeBlock
          code={stateSelectorsCode}
          filename="state-selectors.css"
          lang="css"
        />
      </Section>

      <Section
        title="Customize by composition"
        description="For V1, icons, labels, and descriptions are composed inside the trigger instead of being encoded as variants."
      >
        <Card>
          <CardHeader>
            <CardTitle>Indicator slot</CardTitle>
            <CardDescription>
              Pass custom children to StepperIndicator for lucide icons, numbers, or status marks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock
              code={indicatorCode}
              filename="custom-indicator.tsx"
              className="border-0 shadow-none"
            />
          </CardContent>
        </Card>
      </Section>
    </>
  );
}
