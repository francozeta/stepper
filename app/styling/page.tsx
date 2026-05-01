import { createDocMetadata, MdxDocPage } from "@/components/mdx-doc-page";

const slug = ["styling"];

export const metadata = createDocMetadata(slug);

export default function StylingPage() {
  return <MdxDocPage slug={slug} />;
}
