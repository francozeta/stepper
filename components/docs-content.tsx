import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  badge?: string;
};

function PageHeader({ eyebrow, title, description, badge }: PageHeaderProps) {
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

function CodeBlock({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <pre
      className={cn(
        "overflow-x-auto rounded-lg border border-border bg-muted/30 p-4 text-sm leading-6 shadow-sm",
        className
      )}
    >
      <code className="font-mono text-foreground">{children}</code>
    </pre>
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
