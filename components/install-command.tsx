"use client";

import * as React from "react";
import { SiBun, SiNpm, SiPnpm, SiYarn } from "react-icons/si";
import { VscTerminalPowershell } from "react-icons/vsc";

import { CopyButton } from "@/components/copy-button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const packageManagers = [
  {
    id: "pnpm",
    label: "pnpm",
    command: "pnpm add @francozeta/stepper",
    icon: SiPnpm,
  },
  {
    id: "npm",
    label: "npm",
    command: "npm install @francozeta/stepper",
    icon: SiNpm,
  },
  {
    id: "yarn",
    label: "yarn",
    command: "yarn add @francozeta/stepper",
    icon: SiYarn,
  },
  {
    id: "bun",
    label: "bun",
    command: "bun add @francozeta/stepper",
    icon: SiBun,
  },
] as const;

type InstallCommandProps = {
  className?: string;
};

function InstallCommand({ className }: InstallCommandProps) {
  const [value, setValue] =
    React.useState<(typeof packageManagers)[number]["id"]>("pnpm");
  const activeCommand =
    packageManagers.find((manager) => manager.id === value)?.command ??
    packageManagers[0].command;

  return (
    <Tabs
      value={value}
      onValueChange={(nextValue) =>
        setValue(nextValue as (typeof packageManagers)[number]["id"])
      }
      className={cn(
        "overflow-hidden rounded-xl bg-card ring-1 ring-border/80",
        className
      )}
    >
      <div className="flex min-h-11 items-center gap-2 border-b border-border/70 px-3">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground">
          <VscTerminalPowershell className="size-3.5" />
        </span>
        <TabsList variant="line" className="h-8 gap-1 bg-transparent p-0">
          {packageManagers.map((manager) => {
            const Icon = manager.icon;

            return (
              <TabsTrigger
                key={manager.id}
                value={manager.id}
                className="h-7 gap-1.5 rounded-md px-2 text-xs data-active:bg-background data-active:ring-1 data-active:ring-border"
              >
                <Icon data-icon="inline-start" />
                {manager.label}
              </TabsTrigger>
            );
          })}
        </TabsList>
        <CopyButton
          value={activeCommand}
          label="Copy command"
          toastMessage="Install command copied"
          iconOnly
          className="ml-auto"
        />
      </div>
      {packageManagers.map((manager) => (
        <TabsContent key={manager.id} value={manager.id} className="m-0">
          <pre className="overflow-x-auto px-4 py-4 font-mono text-[0.8125rem] leading-6 text-muted-foreground">
            <code>{manager.command}</code>
          </pre>
        </TabsContent>
      ))}
    </Tabs>
  );
}

export { InstallCommand };
