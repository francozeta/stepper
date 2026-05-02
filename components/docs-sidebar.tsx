"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Waypoints, X } from "lucide-react";
import { FaGithub } from "react-icons/fa";

import { docsNav, registryVersion } from "@/lib/docs";
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
import { cn } from "@/lib/utils";

function DocsSidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border bg-background md:flex">
        <div className="flex min-h-0 flex-1 flex-col px-4 py-5">
          <SidebarBrand />
          <div className="relative mt-3 min-h-0 flex-1">
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-2 bg-gradient-to-b from-background via-background/80 to-transparent" />
            <nav className="docs-scrollbar h-full overflow-y-auto pr-1">
              <div className="flex flex-col gap-7 py-2">
                {docsNav.map((group) => (
                  <div key={group.title} className="flex flex-col gap-2">
                    <p className="px-2 text-xs font-medium text-muted-foreground">
                      {group.title}
                    </p>
                    <div className="flex flex-col gap-1">
                      {group.items.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            aria-current={isActive ? "page" : undefined}
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
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-7 bg-gradient-to-t from-background via-background/80 to-transparent" />
          </div>
          <SidebarFooter />
        </div>
      </aside>

      <header className="sticky top-0 z-20 border-b border-border bg-background/95 px-4 backdrop-blur md:hidden">
        <div className="flex min-h-14 items-center justify-between gap-3">
          <SidebarBrand compact />
          <div className="flex items-center gap-1">
            <GithubLink className="size-10 rounded-lg" iconClassName="size-5" />
            <MobileNavDrawer pathname={pathname} />
          </div>
        </div>
      </header>
    </>
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
        <Waypoints className={compact ? "size-5" : "size-4"} />
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

function SidebarFooter() {
  return (
    <div className="relative mt-4 flex flex-col gap-4 pt-3 before:absolute before:left-0 before:top-0 before:h-px before:w-full before:bg-gradient-to-r before:from-transparent before:via-border/90 before:to-transparent">
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

function MobileNavDrawer({ pathname }: { pathname: string }) {
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
        <nav className="docs-scrollbar flex min-h-0 flex-1 flex-col gap-7 overflow-y-auto p-4">
          {docsNav.map((group) => (
            <div key={group.title} className="flex flex-col gap-2">
              <p className="px-2 text-xs font-medium text-muted-foreground">
                {group.title}
              </p>
              <div className="flex flex-col gap-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex min-h-10 items-center gap-2 rounded-md px-2 text-sm font-medium text-muted-foreground outline-none",
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
        </nav>
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

export { DocsSidebar };
