import { Code } from "lucide-react";

import { CodeBlock } from "@/components/docs-content";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type DocsExampleProps = {
  title: string;
  description: string;
  code: string;
  preview: React.ReactNode;
  badge?: string;
  filename?: string;
  lang?: string;
  className?: string;
  previewClassName?: string;
};

function DocsExample({
  title,
  description,
  code,
  preview,
  badge,
  filename = "example.tsx",
  lang = "tsx",
  className,
  previewClassName,
}: DocsExampleProps) {
  return (
    <section
      id={toAnchorId(title)}
      data-slot="docs-example"
      className={cn("flex min-w-0 scroll-mt-24 flex-col gap-4", className)}
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          {badge ? (
            <Badge variant="secondary" className="font-mono">
              {badge}
            </Badge>
          ) : null}
        </div>
        <p className="max-w-2xl text-pretty text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>

      <Tabs defaultValue="preview" className="min-w-0 gap-3">
        <TabsList variant="line" className="h-8 bg-transparent p-0">
          <TabsTrigger value="preview" className="px-0">
            Preview
          </TabsTrigger>
          <TabsTrigger value="code" className="gap-1.5 px-0">
            <Code data-icon="inline-start" />
            Code
          </TabsTrigger>
        </TabsList>
        <TabsContent value="preview" className="m-0 min-w-0">
          <div
            className={cn(
              "min-w-0 overflow-x-auto rounded-xl bg-card p-4 ring-1 ring-border/80 sm:p-5",
              previewClassName
            )}
          >
            {preview}
          </div>
        </TabsContent>
        <TabsContent value="code" className="m-0 min-w-0">
          <CodeBlock code={code} filename={filename} lang={lang} />
        </TabsContent>
      </Tabs>
    </section>
  );
}

function toAnchorId(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export { DocsExample };
