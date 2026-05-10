"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { FileText, Hash, Search, Text, Zap } from "lucide-react";
import { useDocsSearch } from "fumadocs-core/search/client";
import type { SortedResult } from "fumadocs-core/search";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import type { DocsNavGroup } from "@/lib/docs-navigation";
import { cn } from "@/lib/utils";

type DocsSearchDialogProps = {
  navGroups: DocsNavGroup[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type DocsSearchTriggerProps = {
  iconOnly?: boolean;
  onClick: () => void;
  className?: string;
};

function DocsSearchTrigger({
  iconOnly = false,
  onClick,
  className,
}: DocsSearchTriggerProps) {
  if (iconOnly) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon-lg"
        className={cn("size-10 rounded-lg text-muted-foreground", className)}
        onClick={onClick}
        aria-label="Search documentation"
      >
        <Search />
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn(
        "h-9 w-full justify-start gap-2 rounded-lg px-2 text-muted-foreground",
        className
      )}
      onClick={onClick}
    >
      <Search data-icon="inline-start" />
      <span className="min-w-0 flex-1 truncate text-left">Search docs</span>
      <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.65rem] font-medium text-muted-foreground">
        Ctrl K
      </kbd>
    </Button>
  );
}

function DocsSearchDialog({
  navGroups,
  open,
  onOpenChange,
}: DocsSearchDialogProps) {
  const router = useRouter();
  const { search, setSearch, query } = useDocsSearch({
    type: "fetch",
    delayMs: 120,
  });
  const trimmedSearch = search.trim();
  const results = query.data !== "empty" ? query.data ?? [] : [];
  const quickLinks = React.useMemo(() => getQuickLinks(navGroups), [navGroups]);

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpenChange(true);
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onOpenChange]);

  function visit(url: string) {
    onOpenChange(false);
    router.push(url);
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search documentation"
      description="Search Stepper docs, API, examples, blocks, and release notes."
      className="top-[22%] max-w-[calc(100%-2rem)] border-border bg-card sm:max-w-2xl"
      showCloseButton
    >
      <Command shouldFilter={false} className="rounded-xl bg-card">
        <CommandInput
          value={search}
          onValueChange={setSearch}
          placeholder="Search Stepper docs..."
          autoFocus
        />
        <CommandList className="max-h-[24rem]">
          {trimmedSearch ? (
            <SearchResults
              isLoading={query.isLoading}
              error={query.error}
              results={results}
              onSelect={visit}
            />
          ) : (
            <QuickLinks groups={quickLinks} onSelect={visit} />
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}

function SearchResults({
  error,
  isLoading,
  onSelect,
  results,
}: {
  error?: Error;
  isLoading: boolean;
  onSelect: (url: string) => void;
  results: SortedResult[];
}) {
  if (error) {
    return (
      <CommandEmpty className="text-muted-foreground">
        Search is unavailable right now.
      </CommandEmpty>
    );
  }

  if (isLoading) {
    return (
      <CommandEmpty className="text-muted-foreground">
        Searching documentation...
      </CommandEmpty>
    );
  }

  if (results.length === 0) {
    return (
      <CommandEmpty className="text-muted-foreground">
        No results found.
      </CommandEmpty>
    );
  }

  return (
    <CommandGroup heading="Results">
      {results.slice(0, 12).map((item) => {
        const Icon = getResultIcon(item.type);
        const title = getResultTitle(item);
        const crumbs = item.breadcrumbs?.map((crumb) => cleanText(crumb));

        return (
          <CommandItem
            key={`${item.id}-${item.url}`}
            value={`${title} ${item.url}`}
            onSelect={() => onSelect(item.url)}
            className="items-start gap-3 py-2"
          >
            <Icon className="mt-0.5 text-muted-foreground" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-foreground">
                <MarkedText value={title} />
              </span>
              {crumbs?.length ? (
                <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                  {crumbs.join(" / ")}
                </span>
              ) : null}
              {item.type === "text" && cleanText(item.content) !== cleanText(title) ? (
                <span className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                  <MarkedText value={item.content} />
                </span>
              ) : null}
            </span>
          </CommandItem>
        );
      })}
    </CommandGroup>
  );
}

function QuickLinks({
  groups,
  onSelect,
}: {
  groups: DocsNavGroup[];
  onSelect: (url: string) => void;
}) {
  return (
    <>
      {groups.map((group, index) => (
        <React.Fragment key={group.title}>
          {index > 0 ? <CommandSeparator /> : null}
          <CommandGroup heading={group.title}>
            {group.items.map((item) => (
              <CommandItem
                key={item.href}
                value={`${item.title} ${item.href}`}
                onSelect={() => onSelect(item.href)}
              >
                <Zap className="text-muted-foreground" />
                <span>{item.title}</span>
                <CommandShortcut>{item.href}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        </React.Fragment>
      ))}
    </>
  );
}

function getQuickLinks(navGroups: DocsNavGroup[]): DocsNavGroup[] {
  return [
    ...navGroups,
    {
      title: "On this page",
      items: [
        { title: "Install", href: "/#install", icon: "book-open" },
        { title: "API", href: "/#api", icon: "code" },
        { title: "Composition", href: "/#composition", icon: "route" },
        { title: "Blocks", href: "/#blocks", icon: "gallery" },
      ],
    },
  ];
}

function getResultIcon(type: SortedResult["type"]) {
  if (type === "heading") return Hash;
  if (type === "text") return Text;

  return FileText;
}

function getResultTitle(item: SortedResult) {
  if (item.type === "page") return item.content;
  if (item.breadcrumbs?.length) return item.breadcrumbs.at(-1) ?? item.content;

  return item.content;
}

function MarkedText({ value }: { value: string }) {
  const parts = value.split(/(<mark>.*?<\/mark>)/g);

  return (
    <>
      {parts.map((part, index) => {
        const marked = part.match(/^<mark>(.*?)<\/mark>$/);

        if (marked) {
          return (
            <mark
              key={`${part}-${index}`}
              className="rounded-sm bg-foreground px-0.5 text-background"
            >
              {sanitizeInlineText(marked[1])}
            </mark>
          );
        }

        return (
          <React.Fragment key={`${part}-${index}`}>
            {sanitizeInlineText(part)}
          </React.Fragment>
        );
      })}
    </>
  );
}

function cleanText(value: string) {
  return sanitizeInlineText(value).replace(/\s+/g, " ").trim();
}

function sanitizeInlineText(value: string) {
  return value.replace(/<[^>]+>/g, "");
}

export { DocsSearchDialog, DocsSearchTrigger };
