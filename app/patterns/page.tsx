import { createDocMetadata, MdxDocPage } from "@/components/mdx-doc-page";

const slug = ["patterns"];

export const metadata = createDocMetadata(slug);

export default function PatternsPage() {
  return <MdxDocPage slug={slug} />;
}
