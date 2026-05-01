import { createDocMetadata, MdxDocPage } from "@/components/mdx-doc-page";

const slug = ["changelog"];

export const metadata = createDocMetadata(slug);

export default function ChangelogPage() {
  return <MdxDocPage slug={slug} />;
}
