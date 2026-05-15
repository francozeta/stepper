"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { FileText, Hash, Search, Text } from "lucide-react";
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
        className={cn("size-10 rounded-none text-zinc-500 hover:bg-white/[0.045] hover:text-zinc-100", className)}
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
        "h-9 w-full justify-start gap-2 rounded-none border-white/10 bg-[#070707] px-2 text-zinc-500 hover:bg-white/[0.035] hover:text-zinc-100",
        className
      )}
      onClick={onClick}
    >
      <Search data-icon="inline-start" />
      <span className="min-w-0 flex-1 truncate text-left">Search docs</span>
      <kbd className="border border-white/10 bg-white/[0.035] px-1.5 py-0.5 font-mono text-[0.65rem] font-medium text-zinc-600">
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
  const pathname = usePathname();
  const { search, setSearch, query } = useDocsSearch({
    type: "fetch",
    delayMs: 120,
  });
  const trimmedSearch = search.trim();
  const results =
    query.data !== "empty"
      ? (query.data ?? []).filter((item) => !isDisabledDocsUrl(item.url))
      : [];
  const pageGroup = React.useMemo(
    () => (open ? getCurrentPageLinks(pathname) : null),
    [open, pathname]
  );
  const quickLinks = React.useMemo(
    () => getQuickLinks(navGroups, pageGroup),
    [navGroups, pageGroup]
  );

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
      description="Search Stepper docs, API, guides, and release notes."
      className="top-[18%] max-w-[calc(100%-2rem)] rounded-none border border-white/20 bg-[#050505] text-zinc-100 ring-1 ring-white/10 sm:max-w-2xl"
      showCloseButton
    >
      <Command shouldFilter={false} className="rounded-none bg-[#050505]">
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
          <CommandEmpty className="text-zinc-500">
            Search is unavailable right now.
          </CommandEmpty>
    );
  }

  if (isLoading) {
    return (
      <CommandEmpty className="text-zinc-500">
        Searching documentation...
      </CommandEmpty>
    );
  }

  if (results.length === 0) {
    return (
      <CommandEmpty className="text-zinc-500">
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
            className="items-start gap-3 py-2.5"
          >
            <Icon className="mt-0.5 text-zinc-500" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-zinc-100">
                <MarkedText value={title} />
              </span>
              {crumbs?.length ? (
                <span className="mt-0.5 block truncate text-xs text-zinc-600">
                  {crumbs.join(" / ")}
                </span>
              ) : null}
              {item.type === "text" && cleanText(item.content) !== cleanText(title) ? (
                <span className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-500">
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
            {group.items
              .filter((item) => item.status !== "soon")
              .map((item) => (
                <CommandItem
                  key={item.href}
                  value={`${item.title} ${item.href}`}
                  onSelect={() => onSelect(item.href)}
                >
                  {item.href.includes("#") ? (
                    <Hash className="text-zinc-500" />
                  ) : (
                    <FileText className="text-zinc-500" />
                  )}
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

function getQuickLinks(
  navGroups: DocsNavGroup[],
  pageGroup: DocsNavGroup | null
): DocsNavGroup[] {
  return pageGroup ? [...navGroups, pageGroup] : navGroups;
}

function getCurrentPageLinks(pathname: string): DocsNavGroup | null {
  if (typeof document === "undefined") {
    return null;
  }

  const content = document.querySelector("[data-docs-content]");

  if (!content) {
    return null;
  }

  const items = Array.from(
    content.querySelectorAll<HTMLElement>("section[id], h2[id], h3[id]")
  )
    .filter((element) => !element.matches('[data-slot="docs-example"]'))
    .map((element) => {
      const heading = element.matches("section")
        ? element.querySelector<HTMLElement>("h2, h3")
        : element;
      const title = heading?.textContent?.trim();

      if (!title || !element.id) {
        return null;
      }

      return {
        title,
        href: `${pathname}#${element.id}`,
        icon: "route" as const,
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .slice(0, 8);

  if (items.length === 0) {
    return null;
  }

  return {
    title: "On this page",
    items,
  };
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

function isDisabledDocsUrl(url: string) {
  return [
    "/docs/examples",
    "/docs/forms",
    "/docs/patterns",
  ].some((pathname) => url === pathname || url.startsWith(`${pathname}#`));
}

export { DocsSearchDialog, DocsSearchTrigger };
