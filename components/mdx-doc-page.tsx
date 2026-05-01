import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CopyButton } from "@/components/copy-button";
import { PageHeader } from "@/components/docs-content";
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

function getAction(data: DocFrontmatter) {
  if (!data.copyImport) {
    return undefined;
  }

  return (
    <CopyButton
      value={data.copyImport}
      label={data.copyLabel ?? "Copy"}
      toastMessage={data.copyToast ?? "Copied"}
    />
  );
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

  return (
    <>
      <PageHeader
        eyebrow={data.eyebrow}
        title={data.title}
        description={data.description ?? ""}
        badge={resolveBadge(data.badge)}
        action={getAction(data)}
      />
      <div className="flex flex-col gap-10">
        <MDX components={mdxComponents} />
      </div>
    </>
  );
}

export { createDocMetadata, MdxDocPage };
