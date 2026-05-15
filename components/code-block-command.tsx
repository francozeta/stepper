"use client";

import * as React from "react";
import { Copy } from "lucide-react";
import { FaNpm } from "react-icons/fa";
import { SiPnpm } from "react-icons/si";
import { TbBrandYarn } from "react-icons/tb";

import { CopyButton } from "@/components/copy-button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type PackageManager = "prompt" | "pnpm" | "yarn" | "npm" | "bun";

type CodeBlockCommandProps = {
  prompt?: string;
  pnpm?: string;
  yarn?: string;
  npm?: string;
  bun?: string;
  className?: string;
  onCopySuccess?: (data: {
    packageManager: PackageManager;
    command: string;
  }) => void;
  onCopyError?: (error: Error) => void;
};

type ConvertNpmCommandResult = {
  pnpm: string;
  yarn: string;
  npm: string;
  bun: string;
};

const packageManagerKey = "stepper-package-manager";

function CodeBlockCommand({
  prompt,
  pnpm,
  yarn,
  npm,
  bun,
  className,
  onCopySuccess,
  onCopyError,
}: CodeBlockCommandProps) {
  const tabs = React.useMemo(
    () =>
      [
        ["prompt", prompt],
        ["pnpm", pnpm],
        ["yarn", yarn],
        ["npm", npm],
        ["bun", bun],
      ].filter((tab): tab is [PackageManager, string] => Boolean(tab[1])),
    [prompt, pnpm, yarn, npm, bun]
  );
  const [packageManager, setPackageManager] =
    React.useState<PackageManager>("pnpm");

  const selectedPackageManager = tabs.some(([key]) => key === packageManager)
    ? packageManager
    : tabs[0]?.[0];
  const selectedCommand =
    tabs.find(([key]) => key === selectedPackageManager)?.[1] ?? "";

  if (!selectedPackageManager) {
    return null;
  }

  function handleValueChange(value: string) {
    if (!isPackageManager(value)) {
      return;
    }

    setPackageManager(value);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(packageManagerKey, value);
    }
  }

  return (
    <div
      className={cn(
        "relative min-w-0 overflow-hidden border border-white/[0.12] bg-[#050505] text-left",
        className
      )}
    >
      <Tabs
        value={selectedPackageManager}
        onValueChange={handleValueChange}
        className="min-w-0 gap-0"
      >
        <div className="flex h-9 min-w-0 items-center justify-between gap-2 border-b border-white/10 px-2.5">
          <TabsList
            variant="line"
            className="docs-scrollbar-muted h-8 min-w-0 gap-0 overflow-x-auto overflow-y-hidden rounded-none p-0 text-zinc-500"
          >
            {tabs.map(([key]) => (
              <TabsTrigger
                key={key}
                value={key}
                className="h-7 flex-none rounded-none border border-transparent px-2 font-mono text-[0.68rem] text-zinc-500 after:hidden hover:text-zinc-200 data-active:border-white/15 data-active:bg-zinc-100 data-active:text-zinc-950 sm:px-2.5"
              >
                {getPackageManagerIcon(key)}
                {key}
              </TabsTrigger>
            ))}
          </TabsList>
          <CopyButton
            value={selectedCommand}
            label="Copy command"
            variant="ghost"
            size="icon-xs"
            iconOnly
            className="size-7 shrink-0 rounded-none text-zinc-500 hover:bg-white/[0.06] hover:text-zinc-100 active:scale-[0.96]"
            onCopySuccess={(copiedCommand) => {
              onCopySuccess?.({
                packageManager: selectedPackageManager,
                command: copiedCommand,
              });
            }}
            onCopyError={onCopyError}
          />
        </div>

        {tabs.map(([key, value]) => (
          <TabsContent key={key} value={key} className="m-0">
            <pre
              data-prompt={key === "prompt" ? "" : undefined}
              className="docs-scrollbar-muted w-full min-w-0 overflow-x-auto px-3 py-3 sm:px-4"
            >
              <code className="flex w-max min-w-0 items-start gap-1.5 font-mono text-[0.64rem] leading-5 text-zinc-300 sm:gap-2 sm:text-xs">
                <span
                  aria-hidden="true"
                  className="select-none text-zinc-600 data-[prompt]:hidden"
                  data-prompt={key === "prompt" ? "" : undefined}
                >
                  $
                </span>
                <span className={key === "prompt" ? "whitespace-normal" : ""}>
                  {value}
                </span>
              </code>
            </pre>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function getPackageManagerIcon(packageManager: PackageManager) {
  if (packageManager === "prompt") {
    return <Copy className="size-3" aria-hidden="true" />;
  }

  if (packageManager === "pnpm") {
    return <SiPnpm className="size-3" aria-hidden="true" />;
  }

  if (packageManager === "yarn") {
    return <TbBrandYarn className="size-3.5" aria-hidden="true" />;
  }

  if (packageManager === "npm") {
    return <FaNpm className="size-4" aria-hidden="true" />;
  }

  if (packageManager === "bun") {
    return <BunIcon className="size-3.5" aria-hidden="true" />;
  }

  return null;
}

function BunIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="currentColor"
      {...props}
    >
      <path d="M11.966 22.566c6.609 0 11.966-4.326 11.966-9.661 0-3.308-2.051-6.23-5.204-7.963-1.283-.713-2.291-1.353-3.13-1.885-1.58-1.004-2.555-1.623-3.632-1.623-1.094 0-2.327.783-3.955 1.816a49.78 49.78 0 0 1-2.808 1.692C2.051 6.675 0 9.597 0 12.905c0 5.335 5.357 9.66 11.966 9.66Zm-1.397-17.83a5.885 5.885 0 0 0 .497-2.403c0-.144.201-.186.229-.028.656 2.775-.9 4.15-2.051 4.61-.124.048-.199-.12-.103-.208a5.748 5.748 0 0 0 1.428-1.971Zm2.052-.102a5.795 5.795 0 0 0-.78-2.3v-.015c-.068-.123.086-.263.185-.172 1.956 2.105 1.303 4.055.554 5.037-.082.102-.229-.003-.188-.126a5.837 5.837 0 0 0 .229-2.424Zm1.771-.559a5.708 5.708 0 0 0-1.607-1.801V2.26c-.112-.085-.024-.274.113-.218 2.588 1.084 2.766 3.171 2.452 4.395a.116.116 0 0 1-.048.071.11.11 0 0 1-.153-.026.118.118 0 0 1-.022-.083 5.864 5.864 0 0 0-.735-2.324Zm-5.072.559c-.616.544-1.279.758-2.058.997-.116 0-.194-.078-.155-.18 1.747-.907 2.369-1.645 2.99-2.771 0 0 .155-.117.188.085 0 .303-.348 1.325-.965 1.869Zm4.931 11.205a2.949 2.949 0 0 1-.935 1.549 2.16 2.16 0 0 1-1.282.618 2.167 2.167 0 0 1-1.323-.618 2.95 2.95 0 0 1-.923-1.549.243.243 0 0 1 .064-.197.23.23 0 0 1 .192-.069h3.954a.226.226 0 0 1 .19.07.239.239 0 0 1 .063.196Zm-5.443-2.17a1.85 1.85 0 0 1-2.377-.244 1.969 1.969 0 0 1-.233-2.44c.207-.318.502-.565.846-.711a1.84 1.84 0 0 1 1.089-.11c.365.075.701.26.964.53.264.27.443.616.515.99a1.98 1.98 0 0 1-.108 1.118 1.923 1.923 0 0 1-.696.866Zm8.471.005a1.849 1.849 0 0 1-2.374-.252 1.956 1.956 0 0 1-.546-1.362c0-.383.11-.758.319-1.076.207-.318.502-.566.847-.711a1.84 1.84 0 0 1 1.09-.108c.366.076.702.261.965.533s.44.617.512.993a1.98 1.98 0 0 1-.113 1.118 1.922 1.922 0 0 1-.7.865Z" />
    </svg>
  );
}

function isPackageManager(value: string | null): value is PackageManager {
  return (
    value === "prompt" ||
    value === "pnpm" ||
    value === "yarn" ||
    value === "npm" ||
    value === "bun"
  );
}

function convertNpmCommand(npmCommand: string): ConvertNpmCommandResult {
  if (npmCommand.startsWith("npm install")) {
    return {
      pnpm: npmCommand.replaceAll("npm install", "pnpm add"),
      yarn: npmCommand.replaceAll("npm install", "yarn add"),
      npm: npmCommand,
      bun: npmCommand.replaceAll("npm install", "bun add"),
    };
  }

  if (npmCommand.startsWith("npx create-")) {
    return {
      pnpm: npmCommand.replace("npx create-", "pnpm create "),
      yarn: npmCommand.replace("npx create-", "yarn create "),
      npm: npmCommand,
      bun: npmCommand.replace("npx", "bunx --bun"),
    };
  }

  if (npmCommand.startsWith("npm create")) {
    return {
      pnpm: npmCommand.replace("npm create", "pnpm create"),
      yarn: npmCommand.replace("npm create", "yarn create"),
      npm: npmCommand,
      bun: npmCommand.replace("npm create", "bun create"),
    };
  }

  if (npmCommand.startsWith("npx")) {
    return {
      pnpm: npmCommand.replace("npx", "pnpm dlx"),
      yarn: npmCommand.replace("npx", "yarn dlx"),
      npm: npmCommand,
      bun: npmCommand.replace("npx", "bunx --bun"),
    };
  }

  if (npmCommand.startsWith("npm run")) {
    return {
      pnpm: npmCommand.replace("npm run", "pnpm"),
      yarn: npmCommand.replace("npm run", "yarn"),
      npm: npmCommand,
      bun: npmCommand.replace("npm run", "bun"),
    };
  }

  return {
    pnpm: npmCommand,
    yarn: npmCommand,
    npm: npmCommand,
    bun: npmCommand,
  };
}

export { CodeBlockCommand, convertNpmCommand };
export type {
  CodeBlockCommandProps,
  ConvertNpmCommandResult,
  PackageManager,
};
