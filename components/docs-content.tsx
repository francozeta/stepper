import { codeToHtml } from "shiki";
import {
  SiCss,
  SiJavascript,
  SiNextdotjs,
  SiNpm,
  SiPnpm,
  SiReact,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import {
  VscFile,
  VscFileCode,
  VscFolderOpened,
  VscJson,
  VscMarkdown,
  VscTerminalPowershell,
} from "react-icons/vsc";

import { CopyButton } from "@/components/copy-button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  badge?: string;
  action?: React.ReactNode;
};

function PageHeader({
  eyebrow,
  title,
  description,
  badge,
  action,
}: PageHeaderProps) {
  return (
    <header className="grid max-w-4xl gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
      <div className="flex min-w-0 flex-col gap-4">
        {eyebrow ? (
          <p className="font-mono text-xs font-medium text-muted-foreground">
            {eyebrow}
          </p>
        ) : null}
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {title}
            </h1>
            {badge ? (
              <Badge variant="secondary" className="font-mono">
                {badge}
              </Badge>
            ) : null}
          </div>
          <p className="max-w-2xl text-pretty text-sm leading-6 text-muted-foreground sm:text-base">
            {description}
          </p>
        </div>
      </div>
      {action ? (
        <div className="flex shrink-0 flex-wrap gap-2 lg:justify-end lg:pt-6">
          {action}
        </div>
      ) : null}
    </header>
  );
}

function Section({
  id,
  title,
  description,
  children,
  className,
}: {
  id?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const sectionId = id ?? toAnchorId(title);

  return (
    <section
      id={sectionId}
      className={cn("flex scroll-mt-24 flex-col gap-4", className)}
    >
      <div className="flex max-w-3xl flex-col gap-2">
        <h2 className="text-balance text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {description ? (
          <p className="text-pretty text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

type CodeBlockProps = {
  code?: string;
  children?: string;
  filename?: string;
  lang?: string;
  className?: string;
  showCopy?: boolean;
  showLineNumbers?: boolean;
  compact?: boolean;
};

async function CodeBlock({
  code,
  children,
  filename,
  lang = "tsx",
  className,
  showCopy = true,
  showLineNumbers = true,
  compact = false,
}: CodeBlockProps) {
  const source = (code ?? children ?? "").trim();
  const html = await codeToHtml(source, {
    lang,
    theme: "github-dark-default",
  });

  return (
    <div
      data-slot="docs-code-block"
      className={cn(
        "relative w-full min-w-0 overflow-hidden rounded-xl bg-card text-sm ring-1 ring-border/80",
        className
      )}
    >
      {filename ? (
        <div className="flex min-h-10 items-center gap-2 border-b border-border/70 px-4 pr-12">
          <CodeFileIcon filename={filename} lang={lang} />
          <div className="min-w-0 truncate font-mono text-xs text-muted-foreground">
            {filename ?? lang}
          </div>
        </div>
      ) : null}

      {showCopy ? (
        <CopyButton
          value={source}
          label="Copy code"
          iconOnly
          className={cn(
            "absolute right-3 z-10 bg-card/80 backdrop-blur",
            filename ? "top-1" : "top-2.5"
          )}
        />
      ) : null}

      <div className="docs-code-scroll max-h-[420px] max-w-full overflow-auto">
        {showCopy ? (
          <span className="sr-only">Copy code is available in the top right.</span>
        ) : null}
        <div
          className="docs-code min-w-max"
          data-line-numbers={showLineNumbers ? "true" : "false"}
          data-compact={compact ? "true" : undefined}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}

function CodeFileIcon({
  filename,
  lang,
}: {
  filename?: string;
  lang?: string;
}) {
  const name = `${filename ?? ""} ${lang ?? ""}`.toLowerCase();
  const className = "size-3.5 shrink-0 text-muted-foreground";
  const Icon =
    name.includes("pnpm")
      ? SiPnpm
      : name.includes("npm")
        ? SiNpm
        : name.includes("powershell") || name.includes("ps1")
          ? VscTerminalPowershell
          : name.endsWith(".tsx") || name.includes("tsx")
            ? SiReact
            : name.endsWith(".ts") || name.includes("typescript")
              ? SiTypescript
              : name.endsWith(".js") || name.includes("javascript")
                ? SiJavascript
                : name.endsWith(".css") || name.includes("css")
                  ? SiCss
                  : name.includes("tailwind")
                    ? SiTailwindcss
                    : name.includes("next")
                      ? SiNextdotjs
                      : name.endsWith(".json") || name.includes("json")
                        ? VscJson
                        : name.endsWith(".md") || name.includes("markdown")
                          ? VscMarkdown
                          : VscFileCode;

  return <Icon className={className} aria-hidden="true" />;
}

type FileTreeItem = {
  name: string;
  children?: FileTreeItem[];
};

function FileTree({
  items,
  className,
}: {
  items: FileTreeItem[];
  className?: string;
}) {
  return (
    <div
      data-slot="docs-file-tree"
      className={cn(
        "rounded-xl bg-card p-4 font-mono text-sm ring-1 ring-border/80",
        className
      )}
    >
      <FileTreeItems items={items} />
    </div>
  );
}

function FileTreeItems({
  items,
  level = 0,
}: {
  items: FileTreeItem[];
  level?: number;
}) {
  return (
    <ul className="space-y-1.5">
      {items.map((item) => {
        const hasChildren = Boolean(item.children?.length);
        const Icon = hasChildren ? VscFolderOpened : getTreeFileIcon(item.name);

        return (
          <li key={`${level}-${item.name}`}>
            <div
              className="flex min-h-7 items-center gap-2 text-foreground"
              style={{ paddingLeft: `${level * 1.25}rem` }}
            >
              <Icon className="size-4 shrink-0 text-muted-foreground" />
              <span>{item.name}</span>
            </div>
            {item.children ? (
              <div className="ml-2 border-l border-border/70 pl-1">
                <FileTreeItems items={item.children} level={level + 1} />
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

function getTreeFileIcon(name: string) {
  const lowerName = name.toLowerCase();

  if (lowerName.endsWith(".json")) {
    return VscJson;
  }

  if (lowerName.endsWith(".md") || lowerName.endsWith(".mdx")) {
    return VscMarkdown;
  }

  if (lowerName.endsWith(".ts") || lowerName.endsWith(".tsx")) {
    return VscFileCode;
  }

  return VscFile;
}

function InfoGrid({
  items,
}: {
  items: Array<{ label: string; value: string; help?: string }>;
}) {
  return (
    <dl className="grid gap-3 sm:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-lg border border-border bg-muted/25 p-4"
        >
          <dt className="text-xs font-medium text-muted-foreground">
            {item.label}
          </dt>
          <dd className="mt-2 text-sm font-medium text-foreground">
            {item.value}
          </dd>
          {item.help ? (
            <dd className="mt-1 text-xs leading-5 text-muted-foreground">
              {item.help}
            </dd>
          ) : null}
        </div>
      ))}
    </dl>
  );
}

function toAnchorId(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export { CodeBlock, FileTree, InfoGrid, PageHeader, Section };
export type { FileTreeItem };
