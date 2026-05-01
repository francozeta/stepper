import { createDocMetadata, MdxDocPage } from "@/components/mdx-doc-page";

const slug = ["forms"];

export const metadata = createDocMetadata(slug);

export default function FormsPage() {
  return <MdxDocPage slug={slug} />;
}
