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
      className={cn(
        "flex w-full min-w-0 max-w-full scroll-mt-24 flex-col gap-3",
        className
      )}
    >
      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as "preview" | "code")}
        className="w-full min-w-0 max-w-full gap-0 overflow-hidden rounded-none border border-white/10 bg-[#050505]"
      >
        <div className="flex min-w-0 flex-col gap-2 border-b border-white/10 bg-[#050505] px-2 py-1.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <TabsList
              variant="line"
              className="h-8 shrink-0 gap-0 rounded-none border border-white/10 bg-[#050505] p-0"
            >
              <TabsTrigger
                value="preview"
                className="h-full flex-none rounded-none border-r border-white/10 px-3 text-xs text-zinc-500 after:hidden last:border-r-0 hover:text-zinc-200 data-active:text-zinc-50"
              >
                Preview
              </TabsTrigger>
              {hasCode ? (
                <TabsTrigger
                  value="code"
                  className="h-full flex-none rounded-none px-3 text-xs text-zinc-500 after:hidden hover:text-zinc-200 data-active:text-zinc-50"
                >
                  Code
                </TabsTrigger>
              ) : null}
            </TabsList>

            <div className="hidden h-6 w-px bg-white/10 sm:block" />

            <div className="min-w-0 px-1 sm:px-0">
              <div className="flex min-w-0 items-center gap-2">
                <h3 className="truncate text-sm font-semibold text-zinc-100">
                  {title}
                </h3>
                {badge ? (
                  <Badge variant="outline" className="rounded-none border-white/10 bg-white/[0.035] font-mono text-[11px] text-zinc-500">
                    {badge}
                  </Badge>
                ) : null}
              </div>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-600 sm:line-clamp-1">
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
              "min-w-0 overflow-x-auto bg-[#050505] p-4 sm:p-5",
              previewClassName
            )}
          >
            {preview}
          </div>
        </TabsContent>
        {hasCode ? (
          <TabsContent value="code" className="m-0 min-w-0 bg-[#050505] p-2">
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
        <Button variant="outline" size="sm" className="gap-1.5 rounded-none border-white/10 bg-[#050505] text-zinc-300 hover:bg-white/[0.045] hover:text-zinc-100">
          Add
          <Plus data-icon="inline-end" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100%-2rem)] gap-0 rounded-none border-white/10 bg-[#050505] p-0 sm:max-w-xl">
        <DialogHeader className="px-4 pb-4 pt-4">
          <DialogTitle>Add {title}</DialogTitle>
          <DialogDescription>
            Run one command to add this block to your project.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="pnpm" className="gap-0">
          <div className="px-4">
            <TabsList
              variant="line"
              className="h-8 gap-0 rounded-none border border-white/10 bg-[#050505] p-0"
            >
              {commands.map((item) => (
                <TabsTrigger
                  key={item.manager}
                  value={item.manager}
                  className="h-full flex-none rounded-none border-r border-white/10 px-2.5 text-xs text-zinc-500 after:hidden last:border-r-0 hover:text-zinc-200 data-active:text-zinc-50"
                >
                  {item.manager}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {commands.map((item) => (
            <TabsContent key={item.manager} value={item.manager} className="m-0">
              <div className="mx-4 mb-4 mt-3 grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border border-white/10 bg-white/[0.025] p-3">
                <Terminal className="size-4 shrink-0 text-zinc-500" />
                <div className="min-w-0 overflow-x-auto">
                  <code className="whitespace-nowrap font-mono text-[0.72rem] text-zinc-500">
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
            <Button variant="outline" size="sm" className="rounded-none">
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
      className="gap-1.5 rounded-none bg-zinc-100 text-zinc-950 hover:bg-white hover:text-zinc-950"
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
