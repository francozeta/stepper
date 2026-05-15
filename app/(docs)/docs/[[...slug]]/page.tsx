import type { Metadata } from "next";

import { DocsShell } from "@/components/docs-shell";
import { createDocMetadata, MdxDocPage } from "@/components/mdx-doc-page";
import { source } from "@/lib/source";

type PageProps = {
  params: Promise<{
    slug?: string[];
  }>;
};

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug = [] } = await params;

  return createDocMetadata(slug);
}

export default async function DocsPage({ params }: PageProps) {
  const { slug = [] } = await params;

  return (
    <DocsShell>
      <MdxDocPage slug={slug} />
    </DocsShell>
  );
}
