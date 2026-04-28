import { Code } from "lucide-react";

import { CodeBlock } from "@/components/docs-content";
import { CopyButton } from "@/components/copy-button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <Card data-slot="docs-example" className={cn("shadow-sm", className)}>
      <CardHeader className="border-b border-border/70 pb-4">
        <CardTitle>{title}</CardTitle>
        <CardDescription className="max-w-xl text-pretty leading-6">
          {description}
        </CardDescription>
        <CardAction className="flex items-center gap-2">
          {badge ? (
            <Badge variant="secondary" className="w-fit">
              {badge}
            </Badge>
          ) : null}
          <CopyButton value={code.trim()} label="Copy code" />
        </CardAction>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="preview" className="gap-0">
          <div className="flex items-center justify-between border-b border-border/70 px-4 py-2">
            <TabsList variant="line" className="h-8">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code" className="gap-1.5">
                <Code data-icon="inline-start" />
                Code
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="preview" className="m-0 p-4">
            <div
              className={cn(
                "rounded-lg border border-border bg-background/70 p-4 sm:p-5",
                previewClassName
              )}
            >
              {preview}
            </div>
          </TabsContent>
          <TabsContent value="code" className="m-0 p-0">
            <CodeBlock
              code={code}
              filename={filename}
              lang={lang}
              showCopy={false}
              className="rounded-none border-0 shadow-none"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export { DocsExample };
