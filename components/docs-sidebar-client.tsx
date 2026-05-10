"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Boxes,
  Code2,
  FileCheck,
  GalleryVerticalEnd,
  Menu,
  Palette,
  Route,
  Rocket,
  X,
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
import type { DocsNavGroup, DocsNavIcon } from "@/lib/docs-navigation";
import { cn } from "@/lib/utils";

type DocsSidebarClientProps = {
  navGroups: DocsNavGroup[];
  registryVersion: string;
};

const iconByName: Record<DocsNavIcon, React.ComponentType<{ className?: string }>> = {
  "book-open": BookOpen,
  boxes: Boxes,
  code: Code2,
  "file-check": FileCheck,
  gallery: GalleryVerticalEnd,
  palette: Palette,
  route: Route,
  rocket: Rocket,
};

function DocsSidebarClient({
  navGroups,
  registryVersion,
}: DocsSidebarClientProps) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = React.useState(false);

  return (
    <>
      <DocsSearchDialog
        navGroups={navGroups}
        open={searchOpen}
        onOpenChange={setSearchOpen}
      />
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border bg-background md:flex">
        <div className="flex min-h-0 flex-1 flex-col px-4 py-5">
          <SidebarBrand />
          <DocsSearchTrigger
            className="mt-3"
            onClick={() => setSearchOpen(true)}
          />
          <div className="relative mt-3 min-h-0 flex-1">
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-3 bg-gradient-to-b from-background via-background/80 to-transparent" />
            <SidebarNav navGroups={navGroups} pathname={pathname} />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-4 bg-gradient-to-t from-background via-background/80 to-transparent" />
          </div>
          <SidebarFooter registryVersion={registryVersion} />
        </div>
      </aside>

      <header className="sticky top-0 z-20 border-b border-border bg-background/95 px-4 backdrop-blur md:hidden">
        <div className="flex min-h-14 items-center justify-between gap-3">
          <SidebarBrand compact />
          <div className="flex items-center gap-1">
            <DocsSearchTrigger
              iconOnly
              onClick={() => setSearchOpen(true)}
            />
            <GithubLink className="size-10 rounded-lg" iconClassName="size-5" />
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
            <p className="px-2 text-xs font-medium text-muted-foreground">
              {group.title}
            </p>
            <div className="flex flex-col gap-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = iconByName[item.icon];

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={onNavigate}
                    className={cn(
                      "group flex min-h-8 items-center gap-2 rounded-md px-2 text-sm font-medium text-muted-foreground outline-none",
                      "transition-[background-color,color,box-shadow] hover:bg-muted hover:text-foreground",
                      "focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                      isActive && "bg-muted text-foreground"
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
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
        "flex min-w-0 items-center gap-2 rounded-md outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        compact
          ? "py-1"
          : "relative pb-3 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-gradient-to-r after:from-transparent after:via-border/90 after:to-transparent"
      )}
    >
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-foreground shadow-sm",
          compact ? "size-9" : "size-8"
        )}
      >
        <StepperLogo className={compact ? "h-7 w-6" : "h-6 w-5"} />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-foreground">
          Stepper
        </span>
        <span className="block truncate text-xs text-muted-foreground">
          by francozeta
        </span>
      </span>
    </Link>
  );
}

function SidebarFooter({ registryVersion }: { registryVersion: string }) {
  return (
    <div className="relative mt-4 flex flex-col gap-4 pt-2 before:absolute before:left-0 before:top-0 before:h-px before:w-full before:bg-gradient-to-r before:from-transparent before:via-border/90 before:to-transparent">
      <Link
        href="/changelog"
        className="rounded-lg border border-border bg-muted/30 p-3 outline-none transition-[background-color,box-shadow] hover:bg-muted/60 focus-visible:ring-ring/50 focus-visible:ring-[3px]"
      >
        <p className="text-sm font-medium text-foreground">
          Registry v{registryVersion}
        </p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Registry updates, examples, and documentation notes.
        </p>
      </Link>
      <div className="flex items-center justify-between">
        <span className="rounded-md border border-border bg-background px-2 py-1 font-mono text-xs text-muted-foreground">
          v{registryVersion}
        </span>
        <GithubLink />
      </div>
    </div>
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
          className="size-10 rounded-lg text-muted-foreground"
          aria-label="Open documentation navigation"
        >
          <Menu className="size-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="w-[18.5rem] max-w-[84vw] gap-0 rounded-r-lg border-border/80 bg-background p-0 shadow-2xl">
        <DrawerHeader className="border-b border-border p-4 pr-12 text-left">
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
              className="absolute right-3 top-3 size-9 rounded-lg text-muted-foreground"
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
        "inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-[background-color,color]",
        "hover:bg-muted hover:text-foreground focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none",
        className
      )}
    >
      <FaGithub className={cn("size-4", iconClassName)} />
    </a>
  );
}

export { DocsSidebarClient };
