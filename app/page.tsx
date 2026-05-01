import { createDocMetadata, MdxDocPage } from "@/components/mdx-doc-page";

const slug: string[] = [];

export const metadata = createDocMetadata(slug);

export default function Home() {
  return <MdxDocPage slug={slug} />;
}
