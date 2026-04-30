"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PackageCheck } from "lucide-react";
import { FaGithub } from "react-icons/fa";

import { docsNav } from "@/lib/docs";
import { cn } from "@/lib/utils";

function DocsSidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border bg-background md:flex">
        <div className="flex min-h-0 flex-1 flex-col px-4 py-5">
          <SidebarBrand />
          <nav className="docs-scrollbar mt-6 flex flex-1 flex-col gap-7 overflow-y-auto pr-1">
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
          </nav>
          <SidebarFooter />
        </div>
      </aside>

      <header className="sticky top-0 z-20 border-b border-border bg-background/95 px-4 backdrop-blur md:hidden">
        <div className="flex min-h-14 items-center justify-between gap-3">
          <SidebarBrand compact />
          <a
            href="https://github.com/francozeta/stepper"
            aria-label="Open GitHub repository"
            className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-[background-color,color] hover:bg-muted hover:text-foreground focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
          >
            <FaGithub className="size-4" />
          </a>
        </div>
        <nav className="docs-scrollbar-muted -mx-4 flex gap-1 overflow-x-auto px-4 pb-3">
          {docsNav.flatMap((group) =>
            group.items.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "shrink-0 rounded-md px-2.5 py-1.5 text-sm font-medium text-muted-foreground",
                    "transition-[background-color,color] hover:bg-muted hover:text-foreground",
                    isActive && "bg-muted text-foreground"
                  )}
                >
                  {item.title}
                </Link>
              );
            })
          )}
        </nav>
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
        compact ? "py-1" : "border-b border-dashed border-border pb-4"
      )}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-foreground">
        <PackageCheck className="size-4" />
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
    <div className="mt-6 flex flex-col gap-4 border-t border-dashed border-border pt-4">
      <Link
        href="/changelog"
        className="rounded-lg border border-border bg-muted/30 p-3 outline-none transition-[background-color,box-shadow] hover:bg-muted/60 focus-visible:ring-ring/50 focus-visible:ring-[3px]"
      >
        <p className="text-sm font-medium text-foreground">Release 0.1.1</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Core primitive, docs shell, and product demos are ready.
        </p>
      </Link>
      <div className="flex items-center justify-between">
        <span className="rounded-md border border-border bg-background px-2 py-1 font-mono text-xs text-muted-foreground">
          v0.1.1
        </span>
        <a
          href="https://github.com/francozeta/stepper"
          aria-label="Open GitHub repository"
          className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-[background-color,color] hover:bg-muted hover:text-foreground focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
        >
          <FaGithub className="size-4" />
        </a>
      </div>
    </div>
  );
}

export { DocsSidebar };
