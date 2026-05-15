"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ArrowUpRight,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

import { DocsSearchDialog, DocsSearchTrigger } from "@/components/docs-search";
import { StepperLogo } from "@/components/stepper-logo";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import type { DocsNavGroup } from "@/lib/docs-navigation";
import { cn } from "@/lib/utils";

type DocsSidebarClientProps = {
  navGroups: DocsNavGroup[];
};

function DocsSidebarClient({ navGroups }: DocsSidebarClientProps) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = React.useState(false);

  return (
    <>
      <DocsSearchDialog
        navGroups={navGroups}
        open={searchOpen}
        onOpenChange={setSearchOpen}
      />
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/10 bg-[#050505] md:flex">
        <div className="flex min-h-0 flex-1 flex-col px-4 py-5">
          <SidebarBrand />
          <DocsSearchTrigger
            className="mt-3"
            onClick={() => setSearchOpen(true)}
          />
          <div className="relative mt-3 min-h-0 flex-1">
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-3 bg-gradient-to-b from-[#050505] via-[#050505]/80 to-transparent" />
            <SidebarNav navGroups={navGroups} pathname={pathname} />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-4 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />
          </div>
          <SidebarFooter />
        </div>
      </aside>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050505] px-4 md:hidden">
        <div className="flex min-h-14 items-center justify-between gap-3">
          <SidebarBrand compact />
          <div className="flex items-center gap-1">
            <DocsSearchTrigger
              iconOnly
              onClick={() => setSearchOpen(true)}
            />
            <GithubLink className="size-10" iconClassName="size-5" />
            <MobileNavDrawer navGroups={navGroups} pathname={pathname} />
          </div>
        </div>
      </header>
    </>
  );
}

function SidebarNav({
  navGroups,
  pathname,
  onNavigate,
}: {
  navGroups: DocsNavGroup[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="docs-scrollbar h-full overflow-y-auto pr-1">
      <div className="flex flex-col gap-7 py-2 pb-4">
        {navGroups.map((group) => (
          <div key={group.title} className="flex flex-col gap-2">
            <p className="px-2 font-mono text-[0.65rem] font-medium uppercase tracking-[0.18em] text-zinc-600">
              {group.title}
            </p>
            <div className="flex flex-col gap-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const isSoon = item.status === "soon";
                const itemClassName = cn(
                  "group flex min-h-8 items-center justify-between gap-2 border border-transparent px-2 text-sm font-medium text-muted-foreground outline-none",
                  "rounded-none transition-[background-color,border-color,color] hover:border-white/10 hover:bg-white/[0.04] hover:text-zinc-100",
                  "focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                  isActive && !isSoon && "border-white/10 bg-white/[0.055] text-zinc-100",
                  isSoon &&
                    "cursor-not-allowed text-zinc-700 hover:border-transparent hover:bg-transparent hover:text-zinc-700"
                );

                if (isSoon) {
                  return (
                    <span
                      key={item.href}
                      aria-disabled="true"
                      className={itemClassName}
                    >
                      <span className="truncate">{item.title}</span>
                      <span className="shrink-0 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-zinc-700">
                        Soon
                      </span>
                    </span>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={onNavigate}
                    className={itemClassName}
                  >
                    <span className="truncate">{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
}

function SidebarBrand({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex min-w-0 items-center gap-2 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        compact
          ? "py-1"
          : "relative pb-3 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-white/10"
      )}
    >
      <span
        className={cn(
          "flex shrink-0 items-center justify-center border border-white/10 bg-white/[0.035] text-zinc-100",
          compact ? "size-9" : "size-8"
        )}
      >
        <StepperLogo className={compact ? "h-7 w-6" : "h-6 w-5"} />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-zinc-100">
          Stepper
        </span>
        <span className="block truncate text-xs text-zinc-600">
          by francozeta
        </span>
      </span>
    </Link>
  );
}

function SidebarFooter() {
  return (
    <div className="relative mt-4 flex flex-col gap-4 pt-3 before:absolute before:left-0 before:top-0 before:h-px before:w-full before:bg-white/10">
      <a
        href="https://kocteau.com"
        target="_blank"
        rel="noreferrer"
        className="group border border-white/10 bg-white/[0.018] p-3 outline-none transition-colors hover:bg-white/[0.045] focus-visible:ring-ring/50 focus-visible:ring-[3px]"
      >
        <span className="flex items-center justify-between gap-3">
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-zinc-700">
            Just launched
          </span>
          <ArrowUpRight className="size-3.5 text-zinc-700 transition-colors group-hover:text-zinc-400" />
        </span>
        <span className="mt-3 flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center border border-white/10 bg-[#050505] text-zinc-50">
            <KocteauLogo className="size-5" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-medium text-zinc-100">
              Kocteau
            </span>
            <span className="mt-1 block text-xs leading-5 text-zinc-600 transition-colors group-hover:text-zinc-500">
              Music reviews, curation, and discovery.
            </span>
          </span>
        </span>
      </a>
      <div className="flex items-center justify-end">
        <GithubLink />
      </div>
    </div>
  );
}

function KocteauLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 936.28 953.67"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M936.28,5.38c-47.64,96.32-97.78,189.02-164.48,271.66-61.13,75.75-132.42,139.56-219.99,183.52-22.62,11.36-46.49,20.21-70.39,30.47,11.51,3.71,23.23,7.22,34.77,11.24,80.77,28.11,151.18,72.69,211.94,132.83,70.47,69.74,120.36,153.19,161.95,242.18,10.53,22.53,20.2,45.46,30.22,68.23,1.02,2.33,1.8,4.76,3.01,8.02-13.71,0-26.56,0-39.4,0-68.76-.01-137.52-.15-206.28.15-6.58.03-9.11-2.25-11.27-7.92-22.18-58.19-48.92-114.18-84.18-165.65-74.57-108.85-175.11-182.98-300.92-222.7-47.58-15.02-96.27-25.09-146.06-28.38-41.85-2.76-83.81-3.75-125.72-5.49-2.88-.12-5.78-.02-9.26-.02v-38.86c13.56-1.06,27.19-2.18,40.83-3.19,141.94-10.57,271.99-54.24,387.03-139.39,63.19-46.78,115.32-104.14,159.54-168.87,33.98-49.74,62.31-102.61,85.87-158.01,3.21-7.55,7.27-10.04,15.54-10,79.04.34,158.09.19,237.14.18,2.88,0,5.76,0,10.11,0Z" />
      <path d="M.43.27c68.46-1.77,134.64,4.37,195.17,39.26,76.23,43.94,122.94,109.35,142.48,194.7,7.39,32.26,8.63,65.07,8.21,97.96-.05,3.66-4.01,8.11-7.3,10.77-41.48,33.44-88.98,54.59-140.28,67.81-8.4,2.16-16.87,4.03-26.28,6.26,0-16.85.49-32.38-.11-47.87-.98-24.87.26-50.32-4.67-74.45-11.78-57.69-55.36-96.93-113.94-105.93-17.32-2.66-34.94-3.43-53.29-5.15V.27Z" />
      <path d="M.2,653.1v-92.2c14.54,0,28.58-.76,42.51.14,48.58,3.14,96.68,10.07,143.2,24.6,140.53,43.89,243.61,132.23,307.97,264.53,14.61,30.03,24.03,62.59,35.75,94.02.99,2.66,1.3,5.58,2.05,8.93h-174.6C318.98,756.93,198.58,658.98.2,653.1Z" />
      <path d="M0,952.87v-256.18c58.83-.6,111.98,14.35,157.19,52.58,63.38,53.59,77.4,124.71,70.51,203.61H0Z" />
    </svg>
  );
}

function MobileNavDrawer({
  navGroups,
  pathname,
}: {
  navGroups: DocsNavGroup[];
  pathname: string;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Drawer
      direction="left"
      open={open}
      onOpenChange={setOpen}
      shouldScaleBackground={false}
    >
      <DrawerTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-lg"
          className="size-10 rounded-none text-muted-foreground hover:bg-white/[0.045] hover:text-zinc-100"
          aria-label="Open documentation navigation"
        >
          <Menu className="size-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="w-[18.5rem] max-w-[84vw] gap-0 rounded-none border-white/10 bg-[#050505] p-0 shadow-none">
        <DrawerHeader className="border-b border-white/10 p-4 pr-12 text-left">
          <SidebarBrand />
          <DrawerTitle className="sr-only">Documentation navigation</DrawerTitle>
          <DrawerDescription className="sr-only">
            Browse Stepper documentation pages.
          </DrawerDescription>
          <DrawerClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-3 top-3 size-9 rounded-none text-zinc-500"
              aria-label="Close documentation navigation"
            >
              <X className="size-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <div className="min-h-0 flex-1 overflow-hidden p-4">
          <SidebarNav
            navGroups={navGroups}
            pathname={pathname}
            onNavigate={() => setOpen(false)}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function GithubLink({
  className,
  iconClassName,
}: {
  className?: string;
  iconClassName?: string;
}) {
  return (
    <a
      href="https://github.com/francozeta/stepper"
      aria-label="Open GitHub repository"
      className={cn(
        "inline-flex size-9 items-center justify-center text-zinc-500 transition-[background-color,color]",
        "hover:bg-white/[0.045] hover:text-zinc-100 focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none",
        className
      )}
    >
      <FaGithub className={cn("size-4", iconClassName)} />
    </a>
  );
}

export { DocsSidebarClient };
