import { createDocMetadata, MdxDocPage } from "@/components/mdx-doc-page";

const slug = ["getting-started"];

export const metadata = createDocMetadata(slug);

export default function GettingStartedPage() {
  return <MdxDocPage slug={slug} />;
}
