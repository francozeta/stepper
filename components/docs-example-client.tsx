"use client";

import * as React from "react";
import { Plus, Terminal } from "lucide-react";
import { SiV0 } from "react-icons/si";

import { CopyButton } from "@/components/copy-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type DocsExampleClientProps = {
  id: string;
  title: string;
  description: string;
  code: React.ReactNode;
  preview: React.ReactNode;
  badge?: string;
  filename: string;
  hasCode: boolean;
  installCommand?: string;
  openInV0Url?: string;
  className?: string;
  previewClassName?: string;
};

function DocsExampleClient({
  id,
  title,
  description,
  code,
  preview,
  badge,
  hasCode,
  installCommand,
  openInV0Url,
  className,
  previewClassName,
}: DocsExampleClientProps) {
  const [tab, setTab] = React.useState<"preview" | "code">("preview");

  return (
    <section
      id={id}
      data-slot="docs-example"
      className={cn("flex min-w-0 scroll-mt-24 flex-col gap-3", className)}
    >
      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as "preview" | "code")}
        className="min-w-0 gap-0 overflow-hidden rounded-xl border border-border bg-card"
      >
        <div className="flex min-w-0 flex-col gap-2 border-b border-border bg-card px-2 py-1.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <TabsList className="h-8 shrink-0 rounded-lg bg-muted p-1">
              <TabsTrigger value="preview" className="px-3">
                Preview
              </TabsTrigger>
              {hasCode ? (
                <TabsTrigger value="code" className="gap-1.5 px-3">
                  Code
                </TabsTrigger>
              ) : null}
            </TabsList>

            <div className="hidden h-6 w-px bg-border sm:block" />

            <div className="min-w-0 px-1 sm:px-0">
              <div className="flex min-w-0 items-center gap-2">
                <h2 className="truncate text-sm font-semibold text-foreground">
                  {title}
                </h2>
                {badge ? (
                  <Badge variant="secondary" className="font-mono text-[11px]">
                    {badge}
                  </Badge>
                ) : null}
              </div>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground sm:line-clamp-1">
                {description}
              </p>
            </div>
          </div>

          {(installCommand || openInV0Url) ? (
            <div className="flex shrink-0 items-center gap-2 px-1 sm:px-0">
              {installCommand ? (
                <AddRegistryDialog
                  title={title}
                  installCommand={installCommand}
                />
              ) : null}
              {openInV0Url ? <OpenInV0Button url={openInV0Url} /> : null}
            </div>
          ) : null}
        </div>

        <TabsContent value="preview" className="m-0 min-w-0">
          <div
            className={cn(
              "min-w-0 overflow-x-auto bg-background p-4 sm:p-5",
              previewClassName
            )}
          >
            {preview}
          </div>
        </TabsContent>
        {hasCode ? (
          <TabsContent value="code" className="m-0 min-w-0 bg-background p-2">
            {code}
          </TabsContent>
        ) : null}
      </Tabs>
    </section>
  );
}

function AddRegistryDialog({
  title,
  installCommand,
}: {
  title: string;
  installCommand: string;
}) {
  const commands = getInstallCommands(installCommand);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          Add
          <Plus data-icon="inline-end" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100%-2rem)] gap-0 p-0 sm:max-w-xl">
        <DialogHeader className="px-4 pb-4 pt-4">
          <DialogTitle>Add {title}</DialogTitle>
          <DialogDescription>
            Run one command to add this block to your project.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="pnpm" className="gap-0">
          <div className="px-4">
            <TabsList className="h-8 bg-muted p-1">
              {commands.map((item) => (
                <TabsTrigger
                  key={item.manager}
                  value={item.manager}
                  className="px-2.5 text-xs"
                >
                  {item.manager}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {commands.map((item) => (
            <TabsContent key={item.manager} value={item.manager} className="m-0">
              <div className="mx-4 mb-4 mt-3 grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border bg-muted/40 p-3">
                <Terminal className="size-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0 overflow-x-auto">
                  <code className="whitespace-nowrap font-mono text-[0.72rem] text-muted-foreground">
                    {item.command}
                  </code>
                </div>
                <CopyButton value={item.command} label="Copy command" iconOnly />
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <DialogFooter className="mx-0 mb-0 mt-0">
          <DialogClose asChild>
            <Button variant="outline" size="sm">
              Done
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function OpenInV0Button({ url }: { url: string }) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-1.5 bg-foreground text-background hover:bg-foreground/90 hover:text-background dark:bg-foreground dark:text-background dark:hover:bg-foreground/90"
      asChild
    >
      <a
        href={`https://v0.dev/chat/api/open?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noreferrer"
      >
        Open in
        <SiV0 data-icon="inline-end" />
      </a>
    </Button>
  );
}

function getInstallCommands(command: string) {
  const npxCommand = command.replace(/^pnpm dlx /, "npx ");

  return [
    { manager: "pnpm", command },
    { manager: "npm", command: npxCommand },
    { manager: "yarn", command: command.replace(/^pnpm dlx /, "yarn dlx ") },
    { manager: "bun", command: command.replace(/^pnpm dlx /, "bunx ") },
  ];
}

export { DocsExampleClient };
