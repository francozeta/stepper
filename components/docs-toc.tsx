"use client";

import * as React from "react";
import { ChevronDown, List } from "lucide-react";
import {
  AnchorProvider,
  ScrollProvider,
  TOCItem,
  useItems,
  type TableOfContents,
} from "fumadocs-core/toc";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

type DocsTocProps = {
  toc: TableOfContents;
};

const DocsTocContext = React.createContext<TableOfContents>([]);

function DocsTocProvider({
  children,
  toc,
}: DocsTocProps & {
  children: React.ReactNode;
}) {
  const normalizedToc = React.useMemo(() => normalizeToc(toc), [toc]);
  const [domToc, setDomToc] = React.useState<TableOfContents>([]);
  const items = normalizedToc.length > 0 ? normalizedToc : domToc;

  React.useEffect(() => {
    if (normalizedToc.length > 0) {
      return;
    }

    let frame: number | null = null;
    const updateDomToc = () => {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }

      frame = window.requestAnimationFrame(() => {
        frame = null;
        setDomToc(getDomToc());
      });
    };

    updateDomToc();

    const content = document.querySelector("[data-docs-content]");

    if (!content) {
      return () => {
        if (frame !== null) window.cancelAnimationFrame(frame);
      };
    }

    const observer = new MutationObserver(updateDomToc);

    observer.observe(content, {
      attributeFilter: ["id"],
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [normalizedToc.length]);

  return (
    <AnchorProvider toc={items} single>
      <DocsTocContext.Provider value={items}>
        {children}
      </DocsTocContext.Provider>
    </AnchorProvider>
  );
}

function useDocsToc() {
  return React.useContext(DocsTocContext);
}

function useDocsTocState() {
  const toc = useDocsToc();
  const observedItems = useItems();
  const activeObservedItem = observedItems
    .filter((item) => item.active)
    .sort((firstItem, secondItem) => secondItem.t - firstItem.t)[0];
  const activeUrl = activeObservedItem?.original.url ?? toc[0]?.url;
  const activeIndex = Math.max(
    0,
    toc.findIndex((item) => item.url === activeUrl)
  );
  const activeItem = toc[activeIndex] ?? toc[0];
  const progress = toc.length > 0 ? (activeIndex + 1) / toc.length : 0;

  return {
    activeItem,
    progress,
  };
}

function DocsTableOfContents() {
  const toc = useDocsToc();
  const containerRef = React.useRef<HTMLDivElement>(null);

  if (toc.length === 0) return null;

  return (
    <aside className="sticky top-8 hidden h-fit w-36 xl:block">
      <div className="flex items-center gap-1.5 text-[0.7rem] font-medium text-muted-foreground">
        <List className="size-3" />
        On this page
      </div>
      <div
        ref={containerRef}
        className="docs-scrollbar relative mt-3 max-h-[calc(100vh-6rem)] overflow-y-auto pl-2 before:absolute before:inset-y-0 before:left-0 before:w-px before:bg-gradient-to-b before:from-transparent before:via-border/80 before:to-transparent"
      >
        <ScrollProvider containerRef={containerRef}>
          <nav aria-label="On this page" className="space-y-0.5">
            {toc.map((item) => (
              <TocLink key={item.url} item={item} />
            ))}
          </nav>
        </ScrollProvider>
      </div>
    </aside>
  );
}

function DocsMobileTableOfContents() {
  const toc = useDocsToc();
  const { activeItem, progress } = useDocsTocState();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);

  if (toc.length === 0) return null;

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="sticky top-14 z-20 border-b border-border/80 bg-background/96 backdrop-blur supports-[backdrop-filter]:bg-background/86 md:top-0 xl:hidden"
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
        <div
          ref={containerRef}
          className="docs-scrollbar max-h-[38vh] overflow-y-auto px-4 pb-3 sm:px-6 md:px-8"
        >
          <ScrollProvider containerRef={containerRef}>
            <nav
              aria-label="On this page"
              className="relative py-1 pl-2 before:absolute before:inset-y-0 before:left-0 before:w-px before:bg-gradient-to-b before:from-transparent before:via-border/80 before:to-transparent"
            >
              {toc.map((item) => (
                <TocLink
                  key={item.url}
                  item={item}
                  mobile
                  onClick={() => setOpen(false)}
                />
              ))}
            </nav>
          </ScrollProvider>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function TocLink({
  item,
  mobile = false,
  onClick,
}: {
  item: TableOfContents[number];
  mobile?: boolean;
  onClick?: () => void;
}) {
  return (
    <TOCItem
      href={item.url}
      onClick={onClick}
      className={cn(
        "relative block rounded-sm text-muted-foreground transition-[background-color,color]",
        "before:absolute before:bottom-1.5 before:left-0 before:top-1.5 before:w-px before:rounded-full before:bg-gradient-to-b before:from-foreground/0 before:via-foreground before:to-foreground/0 before:opacity-0 before:transition-opacity",
        "hover:text-foreground focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none",
        "data-[active=true]:text-foreground data-[active=true]:before:opacity-100",
        mobile ? "px-3 py-2 text-sm leading-5" : "px-3 py-1 text-xs leading-5"
      )}
      style={{ paddingLeft: `${1 + Math.max(0, item.depth - 2) * 0.75}rem` }}
    >
      {item.title}
    </TOCItem>
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

function normalizeToc(toc: TableOfContents) {
  return toc.filter((item) => item.url.startsWith("#"));
}

function getDomToc(): TableOfContents {
  const items: TableOfContents = [];
  const seenUrls = new Set<string>();
  const pushHeading = (heading: HTMLElement, url: string) => {
    const title = heading.textContent?.trim();

    if (!title || seenUrls.has(url)) {
      return;
    }

    seenUrls.add(url);
    items.push({
      depth: Number(heading.tagName.slice(1)),
      title,
      url,
    });
  };
  const sections = document.querySelectorAll<HTMLElement>(
    "[data-docs-content] section[id]"
  );

  sections.forEach((section) => {
    const heading = section.querySelector<HTMLElement>("h2, h3");

    if (heading) pushHeading(heading, `#${section.id}`);
  });

  const headings = document.querySelectorAll<HTMLElement>(
    "[data-docs-content] h2[id], [data-docs-content] h3[id]"
  );

  headings.forEach((heading) => {
    pushHeading(heading, `#${heading.id}`);
  });

  return items;
}

export {
  DocsMobileTableOfContents,
  DocsTableOfContents,
  DocsTocProvider,
};
