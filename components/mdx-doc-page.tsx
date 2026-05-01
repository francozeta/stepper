import type { Metadata } from "next";
import { Rss } from "lucide-react";
import { notFound } from "next/navigation";

import { CopyButton } from "@/components/copy-button";
import { DocsPageActions } from "@/components/docs-page-actions";
import { PageHeader } from "@/components/docs-content";
import { Button } from "@/components/ui/button";
import { packageVersion } from "@/lib/docs";
import { source } from "@/lib/source";
import { mdxComponents } from "@/mdx-components";

type DocFrontmatter = {
  badge?: string;
  copyImport?: string;
  copyLabel?: string;
  copyToast?: string;
  description?: string;
  eyebrow?: string;
  rss?: boolean;
  title: string;
};

function resolveBadge(badge?: string) {
  if (badge === "package-version") {
    return `v${packageVersion}`;
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
      copiedLabel={data.copyToast ?? "Copied"}
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
    <>
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
    </>
  );
}

export { createDocMetadata, MdxDocPage };
