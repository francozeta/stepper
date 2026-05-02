"use client";

import * as React from "react";
import { ChevronDown, List } from "lucide-react";
import { usePathname } from "next/navigation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { docsToc } from "@/lib/docs-toc";
import type { DocsTocItem } from "@/lib/docs-toc";
import { cn } from "@/lib/utils";

function useDocsTocState() {
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

  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.href === currentActiveHref)
  );
  const activeItem = items[activeIndex] ?? items[0];
  const progress = items.length > 0 ? (activeIndex + 1) / items.length : 0;

  return {
    activeHref: currentActiveHref,
    activeItem,
    items,
    progress,
  };
}

function DocsTableOfContents() {
  const { activeHref, items } = useDocsTocState();

  if (items.length === 0) return null;

  return (
    <aside className="sticky top-8 hidden h-fit xl:block">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <List className="size-3.5" />
        On this page
      </div>
      <nav className="mt-4 border-l border-dashed border-border/80">
        {items.map((item) => {
          const isActive = activeHref === item.href;

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

function DocsMobileTableOfContents() {
  const { activeHref, activeItem, items, progress } = useDocsTocState();
  const [open, setOpen] = React.useState(false);

  if (items.length === 0) return null;

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="sticky top-14 z-20 border-b border-border bg-background/94 backdrop-blur supports-[backdrop-filter]:bg-background/82 md:top-0 xl:hidden"
    >
      <CollapsibleTrigger
        className={cn(
          "flex min-h-11 w-full items-center gap-2.5 px-4 text-left text-sm text-muted-foreground outline-none sm:px-6 md:px-8",
          "transition-[background-color,color] hover:bg-muted/40 hover:text-foreground",
          "focus-visible:ring-ring/50 focus-visible:ring-[3px]"
        )}
        aria-label={open ? "Close page index" : "Open page index"}
      >
        <ProgressCircle value={progress} />
        <span className="grid min-w-0 flex-1 [grid-template-areas:'stack']">
          <span
            className={cn(
              "truncate [grid-area:stack] transition-[opacity,translate,color] duration-200",
              open ? "translate-y-0 text-foreground" : "-translate-y-1 opacity-0"
            )}
          >
            On this page
          </span>
          <span
            className={cn(
              "truncate [grid-area:stack] transition-[opacity,translate] duration-200",
              open ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100"
            )}
          >
            {activeItem?.title ?? "On this page"}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 transition-transform duration-200",
            open && "rotate-180"
          )}
          aria-hidden="true"
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <nav
          aria-label="On this page"
          className="docs-scrollbar max-h-[45vh] overflow-y-auto px-4 pb-3 sm:px-6 md:px-8"
        >
          <div className="border-l border-dashed border-border/80 py-1">
            {items.map((item) => (
              <TocLink
                key={item.href}
                item={item}
                active={activeHref === item.href}
                onClick={() => setOpen(false)}
              />
            ))}
          </div>
        </nav>
      </CollapsibleContent>
    </Collapsible>
  );
}

function TocLink({
  active,
  item,
  onClick,
}: {
  active: boolean;
  item: DocsTocItem;
  onClick?: () => void;
}) {
  return (
    <a
      href={item.href}
      onClick={onClick}
      className={cn(
        "block border-l-2 border-transparent px-4 py-2 text-sm leading-5 text-muted-foreground transition-[border-color,color]",
        "hover:text-foreground focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none",
        active && "-ml-px border-foreground text-foreground"
      )}
    >
      {item.title}
    </a>
  );
}

function ProgressCircle({ value }: { value: number }) {
  const size = 18;
  const strokeWidth = 1.7;
  const radius = size / 2 - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const progress = clamp(value, 0, 1) * circumference;

  return (
    <svg
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
      viewBox={`0 0 ${size} ${size}`}
      className="size-[18px] shrink-0 text-foreground"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        className="stroke-muted-foreground/25"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
        strokeLinecap="round"
        strokeWidth={strokeWidth}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="transition-[stroke-dashoffset] duration-[250ms] motion-reduce:transition-none"
      />
    </svg>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export { DocsMobileTableOfContents, DocsTableOfContents };
