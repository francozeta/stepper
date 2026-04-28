"use client";

import * as React from "react";
import { List } from "lucide-react";
import { usePathname } from "next/navigation";

import { docsToc } from "@/lib/docs-toc";
import { cn } from "@/lib/utils";

function DocsTableOfContents() {
  const pathname = usePathname();
  const items = React.useMemo(() => docsToc[pathname] ?? [], [pathname]);
  const [activeHref, setActiveHref] = React.useState<string>();
  const currentActiveHref =
    activeHref && items.some((item) => item.href === activeHref)
      ? activeHref
      : items[0]?.href;

  React.useEffect(() => {
    if (items.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);

        if (visibleEntry?.target.id) {
          setActiveHref(`#${visibleEntry.target.id}`);
        }
      },
      {
        rootMargin: "-24% 0px -68% 0px",
        threshold: 0,
      }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.href.slice(1));

      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  return (
    <aside className="sticky top-8 hidden h-fit xl:block">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <List className="size-3.5" />
        On this page
      </div>
      <nav className="mt-4 border-l border-dashed border-border/80">
        {items.map((item) => {
          const isActive = currentActiveHref === item.href;

          return (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "block border-l-2 border-transparent px-4 py-1.5 text-sm leading-5 text-muted-foreground transition-[border-color,color]",
                "hover:text-foreground focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none",
                isActive && "-ml-px border-foreground text-foreground"
              )}
            >
              {item.title}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}

export { DocsTableOfContents };
