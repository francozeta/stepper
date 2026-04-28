import { codeToHtml } from "shiki";

import { CopyButton } from "@/components/copy-button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    <header className="flex max-w-3xl flex-col gap-4">
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
        {action ? <div className="flex flex-wrap gap-2">{action}</div> : null}
      </div>
    </header>
  );
}

function Section({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("flex flex-col gap-4", className)}>
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
};

async function CodeBlock({
  code,
  children,
  filename,
  lang = "tsx",
  className,
  showCopy = true,
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
        "overflow-hidden rounded-lg border border-border bg-[#0d1117] text-sm shadow-sm",
        className
      )}
    >
      <div className="flex min-h-10 items-center justify-between gap-3 border-b border-white/10 bg-background px-3">
        <span className="min-w-0 truncate font-mono text-xs text-muted-foreground">
          {filename ?? lang}
        </span>
        {showCopy ? (
          <CopyButton
            value={source}
            label="Copy"
            toastMessage={filename ? `${filename} copied` : "Code copied"}
          />
        ) : null}
      </div>
      <ScrollArea className="max-h-[520px]">
        <div
          className="docs-code min-w-full"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </ScrollArea>
    </div>
  );
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

export { CodeBlock, InfoGrid, PageHeader, Section };
