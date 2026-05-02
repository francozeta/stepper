import type { Metadata } from "next";
import type { TableOfContents } from "fumadocs-core/toc";
import { Rss } from "lucide-react";
import { notFound } from "next/navigation";

import { CopyButton } from "@/components/copy-button";
import { DocsPageActions } from "@/components/docs-page-actions";
import { PageHeader } from "@/components/docs-content";
import {
  DocsMobileTableOfContents,
  DocsTableOfContents,
  DocsTocProvider,
} from "@/components/docs-toc";
import { Button } from "@/components/ui/button";
import { registryVersion } from "@/lib/docs";
import { source } from "@/lib/source";
import { mdxComponents } from "@/mdx-components";

type DocFrontmatter = {
  badge?: string;
  copyCopiedLabel?: string;
  copyImport?: string;
  copyLabel?: string;
  description?: string;
  eyebrow?: string;
  rss?: boolean;
  title: string;
  toc?: TableOfContents;
};

function resolveBadge(badge?: string) {
  if (badge === "registry-version") {
    return `Registry v${registryVersion}`;
  }

  return badge;
}

function getDoc(slug: string[]) {
  const page = source.getPage(slug);

  if (!page) {
    notFound();
  }

  return page;
}

function getCopyImportAction(data: DocFrontmatter) {
  return data.copyImport ? (
    <CopyButton
      value={data.copyImport}
      label={data.copyLabel ?? "Copy"}
      copiedLabel={data.copyCopiedLabel ?? "Copied"}
    />
  ) : null;
}

function createDocMetadata(slug: string[] = []): Metadata {
  const page = source.getPage(slug);

  if (!page) {
    return {};
  }

  return {
    title: page.data.title,
    description: page.data.description,
  };
}

function MdxDocPage({ slug = [] }: { slug?: string[] }) {
  const page = getDoc(slug);
  const data = page.data as DocFrontmatter;
  const MDX = page.data.body;
  const toc = data.toc ?? [];
  const action = (
    <>
      <DocsPageActions slug={slug} title={data.title} />
      {data.rss ? (
        <Button asChild variant="outline" size="sm">
          <a href="/rss.xml">
            <Rss data-icon="inline-start" />
            RSS
          </a>
        </Button>
      ) : null}
      {getCopyImportAction(data)}
    </>
  );

  return (
    <DocsTocProvider toc={toc}>
      <DocsMobileTableOfContents />
      <div className="mx-auto grid w-full min-w-0 max-w-6xl grid-cols-1 gap-10 px-4 py-8 sm:px-6 sm:py-10 md:px-8 xl:grid-cols-[minmax(0,1fr)_11rem]">
        <main
          data-docs-content
          className="flex min-w-0 max-w-3xl flex-col gap-10"
        >
          <PageHeader
            eyebrow={data.eyebrow}
            title={data.title}
            description={data.description ?? ""}
            badge={resolveBadge(data.badge)}
            action={action}
          />
          <div className="flex flex-col gap-10">
            <MDX components={mdxComponents} />
          </div>
        </main>
        <DocsTableOfContents />
      </div>
    </DocsTocProvider>
  );
}

export { createDocMetadata, MdxDocPage };
