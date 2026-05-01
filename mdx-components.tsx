import type { AnchorHTMLAttributes, HTMLAttributes } from "react";
import type { MDXComponents } from "mdx/types";

import { CodeBlock } from "@/components/docs-content";
import { cn } from "@/lib/utils";

function Heading2({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "scroll-mt-24 text-xl font-semibold tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  );
}

function Heading3({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "scroll-mt-24 text-lg font-semibold tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  );
}

function Paragraph({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "max-w-3xl text-pretty text-sm leading-6 text-muted-foreground sm:text-base",
        className
      )}
      {...props}
    />
  );
}

function UnorderedList({
  className,
  ...props
}: HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      className={cn(
        "flex max-w-3xl list-disc flex-col gap-2 pl-5 text-sm leading-6 text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

function OrderedList({
  className,
  ...props
}: HTMLAttributes<HTMLOListElement>) {
  return (
    <ol
      className={cn(
        "flex max-w-3xl list-decimal flex-col gap-2 pl-5 text-sm leading-6 text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

function InlineCode({
  className,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <code
      className={cn(
        "rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground",
        className
      )}
      {...props}
    />
  );
}

function Anchor({
  className,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={cn(
        "font-medium text-foreground underline underline-offset-4",
        className
      )}
      {...props}
    />
  );
}

const mdxComponents = {
  a: Anchor,
  code: InlineCode,
  h2: Heading2,
  h3: Heading3,
  ol: OrderedList,
  p: Paragraph,
  ul: UnorderedList,
  CodeBlock,
} satisfies MDXComponents;

function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...mdxComponents,
    ...components,
  };
}

export { mdxComponents, useMDXComponents };
