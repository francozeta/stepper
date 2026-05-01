import { createDocMetadata, MdxDocPage } from "@/components/mdx-doc-page";

const slug = ["api"];

export const metadata = createDocMetadata(slug);

export default function ApiPage() {
  return <MdxDocPage slug={slug} />;
}
