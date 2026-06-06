"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown, Code2, ExternalLink, Monitor } from "lucide-react";
import { FaNpm } from "react-icons/fa";
import { SiPnpm } from "react-icons/si";
import { TbBrandYarn } from "react-icons/tb";

import { CopyButton } from "@/components/copy-button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type BlockInstallCommands = {
  pnpm: string;
  npm: string;
  yarn: string;
  bun: string;
};

type BlockPreviewCardClientProps = {
  demoHref: string;
  preview: React.ReactNode;
  code: React.ReactNode;
  installCommands: BlockInstallCommands;
  className?: string;
};

function BlockPreviewCardClient({
  demoHref,
  preview,
  code,
  installCommands,
  className,
}: BlockPreviewCardClientProps) {
  const [activeTab, setActiveTab] = React.useState<"preview" | "code">(
    "preview"
  );

  return (
    <article
      className={cn(
        "overflow-hidden border border-white/10 bg-[#040404]",
        className
      )}
    >
      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          if (value === "preview" || value === "code") {
            setActiveTab(value);
          }
        }}
        className="gap-0"
      >
        <div className="flex flex-col gap-2 border-b border-white/10 p-3 lg:flex-row lg:items-center lg:justify-between">
          <TabsList
            variant="line"
            className="h-8 w-fit gap-0 rounded-none border border-white/10 bg-[#080808] p-0"
          >
            <TabsTrigger
              value="preview"
              className={getTabClassName(activeTab === "preview")}
            >
              <Monitor data-icon="inline-start" />
              Preview
            </TabsTrigger>
            <TabsTrigger
              value="code"
              className={getTabClassName(activeTab === "code")}
            >
              <Code2 data-icon="inline-start" />
              Code
            </TabsTrigger>
          </TabsList>

          <div className="flex min-w-0 flex-wrap items-center gap-2 lg:justify-end">
            <CompactInstallCommand commands={installCommands} />
            <Button
              asChild
              variant="outline"
              size="icon-sm"
              aria-label="Open preview demo"
              title="Preview demo"
              className="rounded-none border-white/10 bg-[#080808] text-zinc-400 hover:bg-white/[0.08] hover:text-zinc-50"
            >
              <Link href={demoHref}>
                <ExternalLink aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="border-b border-white/10 bg-[#050505]">
          <TabsContent value="preview" className="m-0">
            {preview}
          </TabsContent>
          <TabsContent value="code" className="m-0">
            {code}
          </TabsContent>
        </div>
      </Tabs>
    </article>
  );
}

type PackageManager = keyof BlockInstallCommands;

const packageManagers: PackageManager[] = ["pnpm", "npm", "yarn", "bun"];

function CompactInstallCommand({
  commands,
}: {
  commands: BlockInstallCommands;
}) {
  const [packageManager, setPackageManager] =
    React.useState<PackageManager>("pnpm");
  const selectedCommand = commands[packageManager];

  return (
    <div className="flex h-8 min-w-0 max-w-full items-center overflow-hidden rounded-none border border-white/10 bg-[#080808] text-xs text-zinc-300 lg:max-w-[32rem]">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 rounded-none border-r border-white/10 px-2 font-mono text-xs text-zinc-200 hover:bg-white/[0.06]"
          >
            {getPackageManagerIcon(packageManager)}
            {packageManager}
            <ChevronDown data-icon="inline-end" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-36 rounded-none border border-white/10 bg-[#050505] text-zinc-300"
        >
          <DropdownMenuRadioGroup
            value={packageManager}
            onValueChange={(value) => {
              if (isPackageManager(value)) {
                setPackageManager(value);
              }
            }}
          >
            {packageManagers.map((item) => (
              <DropdownMenuRadioItem
                key={item}
                value={item}
                className="rounded-none font-mono text-xs text-zinc-300 focus:bg-white/[0.08] focus:text-zinc-50"
              >
                {getPackageManagerIcon(item)}
                {item}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <code className="min-w-0 flex-1 truncate px-2 font-mono text-[0.7rem] text-zinc-300">
        {selectedCommand}
      </code>
      <CopyButton
        value={selectedCommand}
        label="Copy install command"
        iconOnly
        variant="ghost"
        size="icon-sm"
        className="h-8 rounded-none border-l border-white/10 text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-50"
      />
    </div>
  );
}

function getTabClassName(isActive: boolean) {
  return cn(
    "h-8 rounded-none border-r border-white/10 px-3 text-xs after:hidden last:border-r-0",
    isActive
      ? "bg-zinc-100 text-zinc-950 shadow-none hover:text-zinc-950"
      : "bg-transparent text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-100"
  );
}

function getPackageManagerIcon(packageManager: PackageManager) {
  const iconClassName = "size-3.5";

  if (packageManager === "pnpm") {
    return (
      <span
        data-icon="inline-start"
        className="inline-flex size-4 items-center justify-center"
        aria-hidden="true"
      >
        <SiPnpm className={iconClassName} />
      </span>
    );
  }

  if (packageManager === "npm") {
    return (
      <span
        data-icon="inline-start"
        className="inline-flex size-4 items-center justify-center"
        aria-hidden="true"
      >
        <FaNpm className={iconClassName} />
      </span>
    );
  }

  if (packageManager === "yarn") {
    return (
      <span
        data-icon="inline-start"
        className="inline-flex size-4 items-center justify-center"
        aria-hidden="true"
      >
        <TbBrandYarn className={iconClassName} />
      </span>
    );
  }

  return (
    <span
      data-icon="inline-start"
      className="inline-flex size-4 items-center justify-center"
      aria-hidden="true"
    >
      <BunIcon className={iconClassName} />
    </span>
  );
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

function isPackageManager(value: string): value is PackageManager {
  return packageManagers.includes(value as PackageManager);
}

export { BlockPreviewCardClient };
export type { BlockInstallCommands };
