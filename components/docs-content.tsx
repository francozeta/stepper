import { codeToHtml } from "shiki";

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
    theme: "vitesse-dark",
  });

  return (
    <div
      data-slot="docs-code-block"
      className={cn(
        "relative overflow-hidden rounded-xl bg-card text-sm ring-1 ring-border/80",
        className
      )}
    >
      {filename ? (
        <div className="pointer-events-none absolute left-4 top-3 z-10 max-w-[calc(100%-4rem)] truncate font-mono text-xs text-muted-foreground">
          {filename ?? lang}
        </div>
      ) : null}

      {showCopy ? (
        <CopyButton
          value={source}
          label="Copy code"
          iconOnly
          toastMessage={filename ? `${filename} copied` : "Code copied"}
          className="absolute right-3 top-2.5 z-10 bg-card/80 backdrop-blur"
        />
      ) : null}

      <div
        className={cn(
          "docs-scrollbar max-h-[420px] overflow-auto",
          filename ? "pt-8" : "pt-2"
        )}
      >
        {showCopy ? (
          <span className="sr-only">Copy code is available in the top right.</span>
        ) : null}
        <div
          className="docs-code min-w-max"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
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

function toAnchorId(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export { CodeBlock, InfoGrid, PageHeader, Section };
