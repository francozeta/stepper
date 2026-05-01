import { createDocMetadata, MdxDocPage } from "@/components/mdx-doc-page";

const slug = ["examples"];

export const metadata = createDocMetadata(slug);

export default function ExamplesPage() {
  return <MdxDocPage slug={slug} />;
}
